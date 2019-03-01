from flask_sqlalchemy import SQLAlchemy
import datetime

# note this should only be created once per project
# to define models in multiple files, put this in one file, and import db into each model, as we import it in flaskr.py
db = SQLAlchemy()

class User(db.Model):
	user_id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True)
	password = db.Column(db.String(80), unique=False)

	def __init__(self, username, password):
		self.username = username
		self.password = password
