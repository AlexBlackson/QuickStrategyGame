import json
from flask import Flask, request, abort, url_for, redirect, session, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///qsg.db'
db = SQLAlchemy(app)

app.secret_key = "trashSecurity"

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True)
	password = db.Column(db.String(80), unique=False)

	def __init__(self, username, password):
		self.username = username
		self.password = password

@app.route('/')
def default():
	return redirect(url_for("login"))

@app.route("/createAccount/", methods=["GET", "POST"])
def createAccount():
	if request.method == "POST":
		if isUsernameUnique(request.form["username"]):
			db.session.add(User(request.form["username"], request.form["password"]))
			db.session.commit()

			session["username"] = request.form["username"]
			return redirect(url_for("profile", username=session["username"]))

	return render_template("createAccount.html")


def isUsernameUnique(name):
	if User.query.filter_by(username=name).first():
		return False
	else:
		return True