from models.db import db
from models.users import User

def seed_users():
    # Create users
    user1 = User(username='user1', email='user1@example.com')
    user1.set_password('password1')
    user2 = User(username='user2', email='user2@example.com')
    user2.set_password('password2')
    
    # Add users to session
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

def undo_users():
    db.session.execute("DELETE FROM users")
    db.session.commit()
