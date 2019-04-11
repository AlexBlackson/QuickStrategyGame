import os
import datetime
import json
import random
import math
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
from flask_restless import APIManager
from Models import *

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
    os.path.join(app.root_path, 'game.db'),
    TEMPLATES_AUTO_RELOAD = True
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.secret_key = "trashSecurity"
ma = Marshmallow(app)
db.init_app(app)
app.app_context().push()
apimanager = APIManager(app, flask_sqlalchemy_db=db)


apimanager.create_api(User, methods=['GET', 'POST', 'PUT', 'DELETE'])
apimanager.create_api(Player, methods=['GET', 'POST', 'PUT', 'DELETE'])
apimanager.create_api(Game, methods=['GET', 'POST', 'PUT' 'DELETE'])
apimanager.create_api(Gameboard, methods=['GET', 'POST', 'PUT', 'DELETE'])
apimanager.create_api(Tile, methods=['GET', 'POST', 'PUT' 'DELETE'])
apimanager.create_api(Turn, methods=['GET', 'POST', 'PUT' 'DELETE'])


@app.route("/routes")
def routes():
    list_routes()
    return render_template('login.html')


@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.drop_all()
    db.create_all()
    print('Initialized the database.')
    createUsers()
    createGame(User.query.all())
    createGameBoard()
    usrs = User.query.all()

@app.route("/trading_tests")
def trading_tests():
    return render_template("trading.html.j2")

def isUsernameUnique(username):
    users = User.query.order_by(User.user_id.desc()).all()
    if username in users:
        return True
    return False


@app.route("/users/<username>", methods=["GET", "POST"])
def users(username):
    if request.method == "GET":
        if session["username"] != username:
            abort(401)
        else:
            return render_template("profile.html", username=username)


@app.route("/register/", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        if request.form["username"] != "" and isUsernameUnique(request.form["username"]):
            db.session.add(
                User(request.form["username"], request.form["password"]))
            db.session.commit()
            session["username"] = request.form["username"]
            return redirect(url_for("users", username=session["username"]))
        else:
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


@app.route("/<game_id>/map/", methods=["GET"])
def map(game_id):
    game = Game.query.filter_by(game_id=game_id).first()
    print(game.game_id)
    return render_template("map.html", game=game)


def isUsernameUnique(name):
    if User.query.filter_by(username=name).first():
        return False
    else:
        return True


def createUsers():
    db.session.add(User('p1', 'p'))
    db.session.add(User('p2', 'p'))
    db.session.add(User('p3', 'p'))
    db.session.commit()

# creates a player, updates db, and assigns to game


def createPlayer(user, game):
    p = Player(User.query.filter_by(user_id=user.user_id).first())
    db.session.add(p)
    db.session.commit()
    game.players.append(p)


def createGame(players):
    turn = Turn()
    db.session.add(turn)
    g = Game(turn, Gameboard())
    for p in players:
        createPlayer(p, g)
    order = [p.player_id for p in g.players]
    turn.order = json.dumps(order)
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
                     i, j, 'Grass', .25, .5, 0)
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
    db_tile.luck = tile['luck']
    db_tile.income = tile['income']
    db_tile.player_id = tile['player_id']
    db_tile.unit_count = tile['unit_count']


def turn_test():
    turn = Turn(Player.query.first(), 0)
    db.session.add(turn)
    db.session.commit()
    test_turn = Game.query.first().turn

# ------Gameplay Endpoints------

# Will return a JSON formated string of the representation of the gameboard
# this is in the form of a 2d array of tiles
# Note: Tiles have a TerritoryType object as well
# Note: Can use curl to access this endpoint if no frontend

@app.route("/game/<game_id>/next_turn", methods=["GET","POST"])
def turn(game_id):
    print("*")
    g = Game.query.filter_by(game_id=game_id).first()
    turn = g.turn
    order = json.loads(turn.order)
    if request.method == "POST":
        # if turn.round == 0:
        next_idx = (g.turn.order_idx+1)%len(order)
        turn.order_idx = next_idx
        if next_idx == 0:
            turn.round += 1

        db.session.commit()
        return json.dumps(TurnSchema().dump(turn).data), 201
    elif request.method == "GET":
        return json.dumps(TurnSchema().dump(turn).data), 200

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

@app.route("/testing/", methods=["GET", "POST"])
def testing():
    return render_template("posttest.html")


def list_routes():
    import urllib
    with app.app_context():
        output = []
        for rule in app.url_map.iter_rules():

            options = {}
            for arg in rule.arguments:
                options[arg] = "[{0}]".format(arg)

            methods = ','.join(rule.methods)
            url = url_for(rule.endpoint, **options)
            line = urllib.parse.unquote(
                "{:50s} {:20s} {}".format(rule.endpoint, methods, url))
            output.append(line)

        for line in sorted(output):
            print(line)
