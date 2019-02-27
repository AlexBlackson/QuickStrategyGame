import json
from flask import Flask, request, abort, url_for, redirect, session, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.update(dict(
	DEBUG=True,
	SECRET_KEY='development key',
	USERNAME='owner',
	PASSWORD='pass',
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'salon.db')
))


@app.cli.command('initdb')
def initdb_command():
	"""Creates the database tables."""
	db.drop_all()
	db.create_all()
	print('Initialized the database.')
app.secret_key = "trashSecurity"

@app.route('/')
def default():
	return redirect(url_for("login"))

@app.route("/accounts/<username>", methods=["GET", "POST"])
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
