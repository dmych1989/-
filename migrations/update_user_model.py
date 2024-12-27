import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db
from datetime import datetime

def upgrade_database():
    with app.app_context():
        # Drop existing tables
        db.drop_all()
        
        # Create all tables with new schema
        db.create_all()
        
        # Create default users
        from app import User
        from werkzeug.security import generate_password_hash
        
        # Create admin user
        admin = User(
            username='admin',
            password_hash=generate_password_hash('admin'),
            email='admin@example.com',
            created_at=datetime.utcnow(),
            is_admin=True
        )
        db.session.add(admin)
        
        # Create guest user
        guest = User(
            username='fangke',
            password_hash=generate_password_hash('fangke'),
            email='guest@example.com',
            created_at=datetime.utcnow(),
            is_admin=False
        )
        db.session.add(guest)
        
        try:
            db.session.commit()
            print("Database upgrade completed successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error during database upgrade: {str(e)}")

if __name__ == '__main__':
    upgrade_database()
