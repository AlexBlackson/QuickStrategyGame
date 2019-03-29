import os, datetime
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
#export FLASK_APP=salon.py
from models import db, User

# create our yuge application
app = Flask(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
	DEBUG=True,
	SECRET_KEY='development key',
	USERNAME='owner',
	PASSWORD='pass',
	SQLALCHEMY_TRACK_MODIFICATIONS = False,
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'salon.db')
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

db.init_app(app)

@app.cli.command('initdb')
def initdb_command():
	"""Creates the database tables."""
	db.drop_all()
	db.create_all()
	print('Initialized the database.')

app.secret_key = "trashSecurity"

def isUsernameUnique(username):
	users = User.query.order_by(User.user_id.desc()).all()
	print(users)
	print(username)
	if username in users:
		print("false")
		return True
	return False

@app.route("/users/<username>", methods=["GET", "POST"])
def users(username):
	if request.method == "GET":
		print(session["username"])
		if session["username"] != username:
			abort(401)
		else:
			return render_template("profile.html", username=username)


@app.route("/register/", methods=["GET", "POST"])
def register():
	if request.method == "POST":

		if request.form["username"] != "" and isUsernameUnique(request.form["username"]):
			print("Username is unique")
			db.session.add(User(request.form["username"], request.form["password"]))
			db.session.commit()
			session["username"] = request.form["username"]
			return redirect(url_for("users", username=session["username"]))
		else:
			print("Username is not unique")
			return render_template('createAccount.html',unique=False)
	return render_template("createAccount.html", unique=True)

@app.route("/login/", methods=["GET", "POST"])
def login():
	if request.method == "POST":
		user = User.query.filter_by(username=request.form["username"]).first()
		if user is None:
			return render_template("login.html", invalid=True)
		elif user.password != request.form["password"]:
			return render_template("login.html", invalid=True)
		else:
			session["username"] = request.form["username"]
			return redirect(url_for("users", username=session["username"]))
	return render_template("login.html", invalid=False)

@app.route("/logout/", methods=["GET", "POST"])
def logout():
	session["username"] = ""
	return render_template("login.html", invalid=False)

# @app.route("/firstTile/", methods=["POST"])
# def firstTile():
# 	db.session

def isUsernameUnique(name):
	if User.query.filter_by(username=name).first():
		return False
	else:True
		return 
