from models.db import db
from models.cards import Card
from models.users import User

def seed_cards():
    # Assuming users already exist
    user1 = User.query.filter_by(username='user1').first()
    user2 = User.query.filter_by(username='user2').first()

    # Create cards
    card1 = Card(name='Card One', set='Set A', price=1.99, alert_price=1.50, quantity=10, user_id=user1.id)
    card2 = Card(name='Card Two', set='Set B', price=2.99, alert_price=2.50, quantity=15, user_id=user1.id)
    card3 = Card(name='Card Three', set='Set C', price=3.99, alert_price=3.00, quantity=20, user_id=user2.id)

    # Add cards to session and commit
    db.session.add(card1)
    db.session.add(card2)
    db.session.add(card3)
    db.session.commit()

def undo_cards():
    db.session.execute("DELETE FROM cards")
    db.session.commit()
