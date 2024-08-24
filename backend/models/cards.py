from models.db import db, environment, SCHEMA
from flask_login import UserMixin


class Card(UserMixin, db.Model):
    __tablename__ = 'cards'

    if environment == 'production':
        __table_args__ = {'schema':SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    set = db.Column(db.String(64), nullable=False)
    price = db.Column(db.Float)
    alert_price = db.Column(db.Float)
    quantity = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
