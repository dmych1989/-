from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory, session
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import json
from about_content import DEFAULT_ABOUT_CONTENT
from translations import translations
from extensions import db, login_manager
from models import User, Article, Activity

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tcm.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'login'

def get_text(key, lang=None):
    if not lang:
        lang = session.get('lang', 'zh')
    return translations.get(lang, {}).get(key, key)

app.jinja_env.globals.update(get_text=get_text)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    articles = Article.query.filter_by(published=True).order_by(Article.created_at.desc()).limit(5).all()
    return render_template('index.html', articles=articles)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user)
            user.last_login = datetime.utcnow()
            db.session.commit()
            flash('登录成功！', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        else:
            flash('用户名或密码错误', 'error')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/about')
def about():
    sections = AboutSection.query.order_by(AboutSection.order).all()
    if not sections:
        return render_template('about.html', about_content=DEFAULT_ABOUT_CONTENT)
    return render_template('about.html', about_content=sections)

@app.route('/manage/about', methods=['GET'])
@login_required
def manage_about():
    if not current_user.is_admin:
        flash('您没有权限访问此页面')
        return redirect(url_for('index'))
    
    sections = AboutSection.query.order_by(AboutSection.order).all()
    if not sections:
        sections = DEFAULT_ABOUT_CONTENT
    return render_template('manage_about.html', about_content=sections)

@app.route('/api/about/save', methods=['POST'])
@login_required
def save_about():
    if not current_user.is_admin:
        return jsonify({'success': False, 'message': '您没有权限执行此操作'})
    
    try:
        data = request.get_json()
        sections = data.get('sections', [])
        
        # 删除所有现有章节
        AboutSection.query.delete()
        
        # 添加新章节
        for i, section in enumerate(sections):
            new_section = AboutSection(
                title=section['title'],
                content=section['content'],
                order=i
            )
            db.session.add(new_section)
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/chat')
@login_required
def chat():
    return render_template('chat.html')

@app.route('/api/chat/config', methods=['POST'])
@login_required
def update_chat_config():
    try:
        data = request.get_json()
        config = ChatConfig.query.filter_by(user_id=current_user.id).first()
        
        if not config:
            config = ChatConfig(user_id=current_user.id)
            db.session.add(config)
        
        config.api_type = data.get('api_type', 'openai')
        config.api_key = data.get('api_key', '')
        config.api_endpoint = data.get('api_endpoint', '')
        config.model = data.get('model', '')
        config.model_list = json.dumps(data.get('model_list', []))
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/chat/conversations', methods=['GET'])
@login_required
def get_conversations():
    try:
        conversations = ChatConversation.query.filter_by(user_id=current_user.id)\
            .order_by(ChatConversation.updated_at.desc()).all()
        return jsonify({
            'success': True,
            'conversations': [{
                'id': conv.id,
                'title': conv.title,
                'created_at': conv.created_at.isoformat(),
                'updated_at': conv.updated_at.isoformat()
            } for conv in conversations]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/chat/conversation', methods=['POST'])
@login_required
def create_conversation():
    try:
        data = request.get_json()
        conversation = ChatConversation(
            user_id=current_user.id,
            title=data.get('title', '新对话')
        )
        db.session.add(conversation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'conversation': {
                'id': conversation.id,
                'title': conversation.title,
                'created_at': conversation.created_at.isoformat(),
                'updated_at': conversation.updated_at.isoformat()
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/chat/conversation/<int:id>', methods=['DELETE'])
@login_required
def delete_conversation(id):
    try:
        conversation = ChatConversation.query.get_or_404(id)
        if conversation.user_id != current_user.id:
            return jsonify({'success': False, 'message': '无权删除此对话'})
        
        db.session.delete(conversation)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/chat/message', methods=['POST'])
@login_required
def send_message():
    try:
        data = request.get_json()
        conversation_id = data.get('conversation_id')
        content = data.get('content')
        
        if not conversation_id or not content:
            return jsonify({'success': False, 'message': '缺少必要参数'})
        
        conversation = ChatConversation.query.get_or_404(conversation_id)
        if conversation.user_id != current_user.id:
            return jsonify({'success': False, 'message': '无权访问此对话'})
        
        # 保存用户消息
        user_message = ChatMessage(
            conversation_id=conversation_id,
            role='user',
            content=content
        )
        db.session.add(user_message)
        
        # 获取用户的API配置
        config = ChatConfig.query.filter_by(user_id=current_user.id).first()
        if not config or not config.api_key:
            return jsonify({'success': False, 'message': '请先配置API设置'})
        
        # TODO: 实现与AI API的交互
        ai_response = "这是一个示例回复。实际使用时需要实现与AI API的交互。"
        
        # 保存AI回复
        ai_message = ChatMessage(
            conversation_id=conversation_id,
            role='assistant',
            content=ai_response
        )
        db.session.add(ai_message)
        
        # 更新对话时间
        conversation.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': {
                'role': 'assistant',
                'content': ai_response
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/account')
@login_required
def account():
    # 获取用户活动记录
    activities = [
        {
            'icon': 'bi-person-check',
            'text': get_text('login_activity'),
            'time': datetime.now().strftime('%Y-%m-%d %H:%M')
        },
        {
            'icon': 'bi-gear',
            'text': get_text('profile_updated'),
            'time': datetime.now().strftime('%Y-%m-%d %H:%M')
        }
    ]
    
    # 获取用户文章
    articles = [
        {
            'id': 1,
            'title': '示例文章',
            'date': datetime.now().strftime('%Y-%m-%d'),
            'views': 100
        }
    ]
    
    return render_template('account.html', 
                         activities=activities,
                         articles=articles,
                         title=get_text('account_settings'))

@app.route('/update_profile', methods=['POST'])
@login_required
def update_profile():
    if request.method == 'POST':
        current_user.email = request.form.get('email')
        current_user.bio = request.form.get('bio')
        db.session.commit()
        flash(get_text('profile_update_success'), 'success')
    return redirect(url_for('account'))

@app.route('/update_password', methods=['POST'])
@login_required
def update_password():
    if request.method == 'POST':
        current_password = request.form.get('currentPassword')
        new_password = request.form.get('newPassword')
        confirm_password = request.form.get('confirmPassword')
        
        if not current_user.check_password(current_password):
            flash(get_text('wrong_password'), 'error')
        elif new_password != confirm_password:
            flash(get_text('password_mismatch'), 'error')
        else:
            current_user.set_password(new_password)
            db.session.commit()
            flash(get_text('password_update_success'), 'success')
    return redirect(url_for('account'))

@app.route('/update_notifications', methods=['POST'])
@login_required
def update_notifications():
    if request.method == 'POST':
        current_user.email_notifications = 'emailNews' in request.form
        db.session.commit()
        flash(get_text('notifications_update_success'), 'success')
    return redirect(url_for('account'))

@app.route('/knowledge')
def knowledge():
    page = request.args.get('page', 1, type=int)
    category = request.args.get('category')
    tag = request.args.get('tag')
    
    query = Article.query.filter_by(published=True)
    
    if category:
        query = query.filter_by(category=category)
    if tag:
        query = query.filter(Article.tags.contains(tag))
        
    articles = query.order_by(Article.created_at.desc()).paginate(
        page=page, per_page=10, error_out=False)
        
    return render_template('knowledge.html',
                         articles=articles,
                         category=category,
                         tag=tag,
                         title=get_text('knowledge_base'))

@app.route('/article/<int:id>')
def article(id):
    article = Article.query.get_or_404(id)
    article.views += 1
    db.session.commit()
    return render_template('article.html', article=article)

@app.route('/article/new', methods=['GET', 'POST'])
@login_required
def new_article():
    if request.method == 'POST':
        article = Article(
            title=request.form['title'],
            content=request.form['content'],
            summary=request.form['summary'],
            category=request.form['category'],
            tags=request.form['tags'],
            author=current_user
        )
        db.session.add(article)
        db.session.commit()
        flash(get_text('article_created'), 'success')
        return redirect(url_for('article', id=article.id))
    return render_template('edit_article.html', title=get_text('new_article'))

@app.route('/article/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def edit_article(id):
    article = Article.query.get_or_404(id)
    if article.author != current_user and not current_user.is_admin:
        abort(403)
        
    if request.method == 'POST':
        article.title = request.form['title']
        article.content = request.form['content']
        article.summary = request.form['summary']
        article.category = request.form['category']
        article.tags = request.form['tags']
        db.session.commit()
        flash(get_text('article_updated'), 'success')
        return redirect(url_for('article', id=article.id))
        
    return render_template('edit_article.html', article=article, title=get_text('edit_article'))

@app.route('/edit_article/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_article_new(id):
    article = Article.query.get_or_404(id)
    if request.method == 'POST':
        article.title = request.form['title']
        article.content = request.form['content']
        db.session.commit()
        return redirect(url_for('articles'))
    return render_template('edit_article.html', article=article)

@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        abort(403)
    return render_template('admin/index.html', title=get_text('admin_panel'))

@app.route('/admin/users')
@login_required
def admin_users():
    if not current_user.is_admin:
        abort(403)
    page = request.args.get('page', 1, type=int)
    users = User.query.paginate(page=page, per_page=20, error_out=False)
    return render_template('admin/users.html', users=users, title=get_text('user_management'))

@app.route('/admin/articles')
@login_required
def admin_articles():
    if not current_user.is_admin:
        abort(403)
    page = request.args.get('page', 1, type=int)
    articles = Article.query.paginate(page=page, per_page=20, error_out=False)
    return render_template('admin/articles.html', articles=articles, title=get_text('article_management'))

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/articles')
@login_required
def articles():
    articles = Article.query.all()
    return render_template('articles.html', articles=articles)

# 语言切换路由
@app.route('/change_language/<lang>')
def change_language(lang):
    if lang in ['zh', 'en']:
        session['language'] = lang
    return redirect(request.referrer or url_for('index'))

# 搜索路由
@app.route('/search')
def search():
    query = request.args.get('q', '')
    if not query:
        return redirect(url_for('index'))
    
    # 在这里实现搜索逻辑
    # 例如：搜索知识库、文章等
    search_results = []  # 这里添加实际的搜索逻辑
    
    return render_template('search.html', 
                         query=query, 
                         results=search_results)

@app.context_processor
def utility_processor():
    return dict(get_text=get_text)

def init_db():
    with app.app_context():
        db.create_all()
        
        # 检查是否已存在管理员用户
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin = User(
                username='admin',
                email='admin@example.com',
                is_admin=True,
                email_notifications=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
