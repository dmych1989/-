from app import app, db
from models import User, UserGroup

def create_default_groups():
    with app.app_context():
        # 创建默认用户组
        groups = [
            {
                'name': '普通用户',
                'can_post': True,
                'can_comment': True,
                'can_use_ai': False,
                'description': '可以发帖和评论的普通用户'
            },
            {
                'name': 'VIP用户',
                'can_post': True,
                'can_comment': True,
                'can_use_ai': True,
                'description': '可以使用所有功能的VIP用户'
            },
            {
                'name': '受限用户',
                'can_post': False,
                'can_comment': True,
                'can_use_ai': False,
                'description': '只能评论的受限用户'
            }
        ]
        
        for group_data in groups:
            group = UserGroup.query.filter_by(name=group_data['name']).first()
            if group is None:
                group = UserGroup(**group_data)
                db.session.add(group)
        
        db.session.commit()
        print("Default user groups created successfully!")

def create_admin_user():
    with app.app_context():
        admin = User.query.filter_by(username='admin').first()
        if admin is None:
            # 获取VIP用户组
            vip_group = UserGroup.query.filter_by(name='VIP用户').first()
            
            admin = User(
                username='admin',
                email='admin@example.com',
                is_admin=True,
                group=vip_group
            )
            admin.set_password('admin')
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")

if __name__ == '__main__':
    create_default_groups()
    create_admin_user()
