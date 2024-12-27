from app import app, db
from models import User, UserGroup, Article, Comment, Activity

with app.app_context():
    # Drop all tables
    db.drop_all()
    
    # Create all tables
    db.create_all()
    
    print("Database tables created successfully!")
