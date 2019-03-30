import os
import datetime
import json
import random
import math
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
# export FLASK_APP=salon.py
from models import db, User, Player, Game, Gameboard, Tile

# create our yuge application
app = Flask(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='owner',
    PASSWORD='pass',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SQLALCHEMY_DATABASE_URI='sqlite:///' +
    os.path.join(app.root_path, 'salon.db')
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

db.init_app(app)


@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.drop_all()
    db.create_all()
    print('Initialized the database.')
    createUsers()
    createGame()
    createGameBoard()
    # game = Game.query.first()
    # gameboard_get_test(game.game_id)


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
            db.session.add(
                User(request.form["username"], request.form["password"]))
            db.session.commit()
            session["username"] = request.form["username"]
            return redirect(url_for("users", username=session["username"]))
        else:
            print("Username is not unique")
            return render_template('createAccount.html', unique=False)
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


@app.route("/map/", methods=["GET"])
def map():
    return render_template("map.html")


def isUsernameUnique(name):
    if User.query.filter_by(username=name).first():
        return False
    else:
        return True


def createUsers():
    db.session.add(User('p1', 'p'))
    db.session.add(User('p2', 'p'))
    db.session.commit()

# creates a player, updates db, and assigns to game


def createPlayer(user, game):
    p = Player(User.query.filter_by(user_id=user.user_id).first())
    db.session.add(p)
    db.session.commit()
    game.players.append(p)


def createGame():
    g = Game(Gameboard())
    createPlayer(User.query.filter_by(username='p1').first(), g)
    createPlayer(User.query.filter_by(username='p2').first(), g)
    db.session.add(g)
    db.session.commit()


def createGameBoard():
    # Query the gameboard from database, created with createGame()
    g = Game.query.first()
    gameboard = g.gameboard
    board = []

    players = Player.query.all()
    players.append(None)
    # Create all the necessary tiles and put the in the gameboard
    for i in range(0, 9):
        arr = []
        for j in range(0, 9):
            t = Tile(players[random.randint(0, 2)], gameboard,
                     i, j, 'Grass', json.dumps([.25, .5, .75]), 0)
            db.session.add(t)
            arr.append(t)
        board.append(arr)

    db.session.add(g)
    db.session.commit()
    # Prove the creation worked
    # tiles = Game.query.first().gameboard.tiles
    # for t in tiles:
    # 	print(str(t.row) + ", " + str(t.col) + "\n")


def gameboard_get_test(game_id):
    # Create gameboard JSON Object
    game = Game.query.filter_by(game_id=game_id).first()
    tiles = game.gameboard.tiles
    tile_matrix = [[0 for x in range(0, 9)] for y in range(0, 9)]
    for t in tiles:
        tile_matrix[t.row][t.col] = t.as_dict()
    tile_post_test(
        game.game_id, game.gameboard.tiles[0].tile_id, json.dumps(tile_matrix[0][0]))
    # for i in tile_matrix:
    #     print(i)
    #     print("*")
    #     for j in i:
    #         print(j)
    #     print("")
    # print(tile_matrix)
    # print("*---2---")
    # print("*---3---")
    # print(json.loads(j))


def tile_post_test(game_id, tile_id, tile):
    tile = json.loads(tile)
    print(tile)
    db_tile = Tile.query.filter_by(tile_id=tile_id).first()
    db_tile.territoryName = tile['territoryName']
    db_tile.multiplier = tile['multiplier']
    db_tile.player_id = tile['player_id']
    db_tile.unit_count = tile['unit_count']

# Gameplay Endpoints

# Will return a JSON formated string of the representation of the gameboard
# this is in the form of a 2d array of tiles
# Note: Tiles have a TerritoryType object as well
# Note: Can use curl to access this endpoint if no frontend


@app.route("/<game_id>/gameboard", methods=["GET"])
def gameboard(game_id):
    if request.method == "GET":
        print("GET")
        # Create gameboard JSON Object
        game = Game.query.filter_by(game_id=game_id).first()
        tiles = game.gameboard.tiles
        tile_matrix = [[0 for x in range(0, 9)] for y in range(0, 9)]
        for t in tiles:
            tile_matrix[t.row][t.col] = t.as_dict()
        return json.dumps(tile_matrix), 200


@app.route("/<game_id>/gameboard/tiles/<tile_id>", methods=["GET", "POST"])
def tile(game_id, tile_id):
    if request.method == "POST":
        tile = request.get_json()
        db_tile = Tile.query.filter_by(tile_id=tile_id).first()
        db_tile.territoryName = tile['territoryName']
        db_tile.multiplier = tile['multiplier']
        db_tile.player_id = tile['player_id']
        db_tile.unit_count = tile['unit_count']
        # print(Tile.query.filter_by(tile_id=tile_id).first().territoryName)
        return json.dumps(Tile.query.filter_by(tile_id=tile_id).first().as_dict()), 201
    elif request.method == "GET":
        # print(Tile.query.filter_by(tile_id=tile_id).first().as_dict())
        return json.dumps(Tile.query.filter_by(tile_id=tile_id).first().as_dict()), 200


@app.route("/testing/", methods=["GET", "POST"])
def testing():
    return render_template("posttest.html")
