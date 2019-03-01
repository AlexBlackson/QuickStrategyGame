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

<<<<<<< HEAD
def isUsernameUnique(username):
	users = User.query.order_by(User.user_id.desc()).all()
	print(users)
	print(username)
	if username in users:
		print("false")
		return True
	return False
=======
@app.route('/')
def default():
	return redirect(url_for("login"))
>>>>>>> 5a18d0b508eaacaeae66fba880b69ad62869f51c

@app.route("/accounts/<username>", methods=["GET", "POST"])
def accounts():
	return 404

@app.route("/login/", methods=["GET", "POST"])
def register():
	if request.method == "POST":
		if isUsernameUnique(request.form["username"]):
			db.session.add(User(request.form["username"], request.form["password"]))
			db.session.commit()
			session["username"] = request.form["username"]
			return redirect(url_for("profile", username=session["username"]))
		return render_template('createAccount.html',unique=True)
	return render_template("createAccount.html")


def isUsernameUnique(name):
	if User.query.filter_by(username=name).first():
		return False
	else:
		return True
