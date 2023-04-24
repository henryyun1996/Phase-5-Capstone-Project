from flask import request, make_response, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import *
from models import User, Friend, Participant, Event_Planning_Room, Event_Element, Message