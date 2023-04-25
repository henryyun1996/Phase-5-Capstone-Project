#!/usr/bin/env python3
from flask import Flask, jsonify, request, make_response, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import *
from models import User, Friend, Participant, Event_Planning_Room, Event_Element, Message

class Home(Resource):
    def get(self):
        welcome_message = '<h1>Welcome to my Home Made API!</h1>'
        return make_response(welcome_message, 200)

class UserByID(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(user.to_dict())
        elif User.query.count() == 0:
            message = '<h1>Sorry, there are no registered users yet.</h1>'
            return make_response(message, 404)
        else:
            return make_response({"error": "No User found"}, 404)
    
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        new_username = request.json.get('username')
        new_password = request.json.get('_password_hash')
        current_module_id = request.json.get('current_module_id')
        progress_percentage = request.json.get('progress_percentage')

        if progress_percentage:
            user.progress_percentage = progress_percentage

        if current_module_id:
            user.current_module_id = current_module_id

        if new_username:
            user.username = new_username

        if new_password:
            user.password_hash = new_password

        db.session.commit()
        return make_response(user.to_dict(), 200)
    
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        Favorite.query.filter_by(user_id=user.id).delete()
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 200)

class Friends(Resource):
    def get(self):
        friends = [friend.to_dict() for friend in Friend.query.all()]
        return make_response(jsonify(friends), 200)

    def post(self):
        request_json = request.get_json()
        user_id = request_json.get('user_id')
        friend_id = request_json.get('friend_id')

        user = User.query.filter_by(id=user_id).first()
        friend = User.query.filter_by(id=friend_id).first()

        if not user or not friend:
            return make_response({"error": "User or Friend not found"}, 404)

        new_friend = Friend(user_id=user_id, friend_id=friend_id)
        db.session.add(new_friend)
        db.session.commit()

        return make_response(new_friend.to_dict(), 200)

class FriendByID(Resource):
    def get(self, id):
        friend = Friend.query.filter_by(id=id).first()
        if friend:
            return make_response(jsonify(friend), 200)
        elif Friend.query.count() == 0:
            no_friend_message = '<h1>You have no friends yet!</h1>'
            return make_response(no_friend_message, 200)
        else:
            return make_response({"error": "No friend found"}, 404)
    
class Rooms(Resource):
    def get(self):
        rooms = [room.to_dict() for room in Event_Planning_Room.query.all()]
        return make_response(jsonify(rooms), 200)
    
    def post(self):
        request_json = request.get_json()
        room_creator_id = request_json.get('created_by')

        user = User.query.filter_by(id=room_creator_id).first()

        if not user:
            return make_response({"error": "User not found"}, 404)

        room_creator = Event_Planning_Room(created_by=room_creator_id)
        db.session.add(room_creator)
        db.session.commit()

class RoomByID(Resource):
    def get(self, id):
        room = Event_Planning_Room.query.filter_by(id=id).first()
        if room:
            return make_response(jsonify(room), 200)
        elif Event_Planning_Room.query.count() == 0:
            no_room_message = '<h1>There are no active rooms yet!</h1>'
            return make_response(no_room_message, 200)
        else:
            return make_response({"error": "No room found"}, 404)

    def delete(self, id):
        room = Event_Planning_Room.query.filter_by(id=id).first()
        if not room:
            return make_response({"error": "No room found"}, 404)
        # I think I have to delete this from somewhere else too (?)
        db.session.delete(room)
        db.session.commit()
        return make_response({}, 201)

class Participants(Resource):
    def get(self):
        participants = [participant.to_dict() for participant in Participant.query.all()]
        return make_response(jsonify(participants), 200)
    
    def post(self):
        request_json = request.get_json()

        user_id = request_json.get('user_id')
        room_id = request_json.get('room_id')

        user = User.query.filter_by(id=user_id).first()
        room = Event_Planning_Room.query.filter_by(id=room_id).first()

        if not user or not room:
            return make_response({"error": "User or Event Planning Room not found"}, 404)

        participant = Participant(user_id=user_id, room_id=room_id)
        db.session.add(participant)
        db.session.commit()

        return make_response(participant.to_dict(), 200)


class ParticipantByID(Resource):
    def get(self, id):
        participant = Participant.query.filter_by(id=id).first()
        if participant:
            return make_response(participant.to_dict(), 200)
        elif Participant.query.count() == 0:
            no_participant_message = '<h1>There are no participants yet!</h1>'
            return make_response(no_participant_message, 200)
        else:
            return make_response({"error": "No participant found"}, 402)

class EventElements(Resource):
    def get(self):
        event_elements = [ee.to_dict() for ee in Event_Element.query.all()]
        return make_response(jsonify(event_elements), 200)

class EventElementByID(Resource):
    def get(self, id):
        event_element = Event_Element.query.filter_by(id=id).first()
        if event_element:
            return make_response(jsonify(event_element), 200)
        elif Event_Element.query.count() == 0:
            no_event_elements_message = '<h1>There are no event elements yet!</h1>'
            return make_response(no_event_elements_message, 200)
        else:
            return make_response({"error": "No event element found"}, 402)
    
    def post(self):
        request_json = request.get_json()

        room_id = request_json.get('room_id')
        event_element = request_json.get('event_element')
        event_value = request_json.get('event_value')

        if not all([room_id, event_element, event_value]):
            return make_response({"error": "Missing fields in request body"}, 400)

        room = Event_Planning_Room.query.filter_by(id=room_id).first()

        if not room:
            return make_response({"error": "Room not found"}, 404)

        element = Event_Element(room_id=room_id, event_element=event_element, event_value=event_value)
        db.session.add(element)
        db.session.commit()

        return make_response(element.to_dict(), 200)
    
    def delete(self, id):
        event_element = Event_Element.query.filter_by(id=id).first()
        if not event_element:
            return make_response({"error": "No Event Element found"}, 404)
        db.session.delete(event_element)
        db.session.commit()

        return make_response({}, 201)

class Messages(Resource):
    def get(self):
        messages = [message.to_dict() for message in Message.query.all()]
        return make_response(jsonify(messages), 200)
    
    def post(self):
        request_json = request.get_json()

        user_id = request_json.get('user_id')
        room_id = request_json.get('room_id')

        user = User.query.filter_by(id=user_id).first()
        room = Event_Planning_Room.query.filter_by(id=room_id).first()

        if not user or not room:
            return make_response({"error": "User or Event Planning Room not found"}, 404)

        message = Message(user_id=user_id, room_id=room_id)
        db.session.add(message)
        db.session.commit()

        return make_response(message.to_dict(), 200)

class MessageByID(Resource):
    def get(self, id):
        message = Message.query.filter_by(id=id).first()
        if message:
            return make_response(jsonify(message), 200)
        elif Message.query.count() == 0:
            no_messages_message = '<h1>There are no messages yet!</h1>'
            return make_response(no_messages_message, 200)
        else:
            return make_response({"error": "No message found"}, 402) 

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        new_user = User(
            username=username
        )

        new_user.password_hash = password

        try:
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)

        except Exception as e:
            print(e)
            return make_response({'error': 'Unprocessable Entity'}, 417)

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        
        current_user = User.query.filter(User.id == user_id).first()
        return current_user.to_dict(), 200

class Login(Resource):
    def post(self):
        data = request.get_json()

        check_user = User.query.filter(User.username == data['username']).first()
        
        if check_user and check_user.authenticate(data['password']):
            session['user_id'] = check_user.id
            return make_response(check_user.to_dict(), 200)
        return {'error': 'Unauthorized'}, 401


class Logout(Resource):
    def delete(self):
        
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        return {'error': '401 Unauthorized'}, 401


api.add_resource(Home, '/')
api.add_resource(UserByID, '/user/<int:id>')
api.add_resource(Friends, '/friends')
api.add_resource(FriendByID, '/friends/<int:id>')
api.add_resource(Rooms, '/rooms')
api.add_resource(RoomByID, '/rooms/<int:id>')
api.add_resource(Participants, '/participants')
api.add_resource(ParticipantByID, '/participants/<int:id>')
api.add_resource(EventElements, '/elements')
api.add_resource(EventElementByID, '/elements/<int:id>')
api.add_resource(Messages, '/messages')
api.add_resource(MessageByID, '/messages/<int:id>')
api.add_resource(Signup, '/signup')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5000, debug=True)