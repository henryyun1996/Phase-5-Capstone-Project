from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-created_at', '-updated_at', '-password', '-last_name', '-email', '-phone_number', '-users_friends', '-friends_with_users', '-event_rooms', '-participants', '-messages',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String)
    phone_number = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    users_friends = db.relationship('Friend', foreign_keys='Friend.user_id', backref='user')
    friends_with_users = db.relationship('Friend', foreign_keys='Friend.friend_id', backref='friend')
    event_rooms = db.relationship('Event_Planning_Room', backref='user')
    participants = db.relationship('Participant', backref='user')
    messages = db.relationship('Message', backref='user')


    def __repr__(self):
        return f"<User id={self.id}, username='{self.username}', email='{self.email}'>"

class Friend(db.Model, SerializerMixin):
    __tablename__ = 'friends'

    serialize_rules = ('-created_at', '-updated_at',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    friend_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f"<Friend id={self.id}, user_id='{self.user_id}', friend_id='{self.friend_id}'>"

class Participant(db.Model, SerializerMixin):
    __tablename__ = 'participants'

    serialize_rules = ('-created_at', '-updated_at',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    room_id = db.Column(db.Integer, db.ForeignKey('event_planning_rooms.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f"<Participant id={self.id}, user_id='{self.user_id}', room_id='{self.room_id}'>"

class Event_Planning_Room(db.Model, SerializerMixin):
    __tablename__ = 'event_planning_rooms'

    serialize_rules = ('-created_at', '-updated_at', '-participants', '-event_elements', '-messages',)

    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    participants = db.relationship('Participant', backref='event_planning_room')
    event_elements = db.relationship('Event_Element', backref='event_planning_room')
    messages = db.relationship('Message', backref='event_planning_room')

    def __repr__(self):
        return f"<Event_Planning_Room id={self.id}, room_name='{self.room_name}', created_by='{self.created_by}'>"

class Event_Element(db.Model, SerializerMixin):
    __tablename__ = 'event_elements'

    serialize_rules = ('-created_at', '-updated_at',)

    id = db.Column(db.Integer, primary_key=True)
    event_element = db.Column(db.String)
    event_value = db.Column(db.String)
    room_id = db.Column(db.Integer, db.ForeignKey('event_planning_rooms.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f"<Event_Element id={self.id}, event_element='{self.event_element}', event_value='{self.event_value}', room_id='{self.room_id}'>"

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    message_text = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    room_id = db.Column(db.Integer, db.ForeignKey('event_planning_rooms.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f"<Message id={self.id}, message_text='{self.message_text}', user_id='{self.user_id}', room_id='{self.room_id}'>"
