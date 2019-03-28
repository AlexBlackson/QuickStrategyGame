from flask_sqlalchemy import SQLAlchemy
import datetime

# note this should only be created once per project
# to define models in multiple files, put this in one file, and import db into each model, as we import it in flaskr.py
db = SQLAlchemy()


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80), unique=False)
    player_id = db.Column(db.Integer, db.ForeignKey('player.player_id'))

    def __init__(self, username, password):
        self.username = username
        self.password = password


class Player(db.Model):
    player_id = db.Column(db.Integer, primary_key=True)
    user = db.relationship('User', backref='user', lazy=True, uselist=False)
    resources = db.Column(db.String, unique=False)
    money = db.Column(db.Float, unique=False)
    tiles = db.relationship('Tile', backref='player', lazy=True)
    game_id = db.Column(db.Integer, db.ForeignKey(
        'game.game_id'), nullable=True)

    def __init__(self, user):
        self.user = user


class Game(db.Model):
    game_id = db.Column(db.Integer, primary_key=True)
    players = db.relationship('Player', backref='game', lazy=True)
    gameboard = db.relationship(
        'Gameboard', backref='game', lazy=True, uselist=False)
    gameOver = db.Column(db.Boolean, unique=False)

    def __init__(self, gameboard=None):
        self.gameOver = False
        if gameboard != None:
            self.gameboard = gameboard


class Gameboard(db.Model):
    gameboard_id = db.Column(db.Integer, primary_key=True)
    tiles = db.relationship('Tile', backref='gameboard', lazy=True)
    game_id = db.Column(db.Integer, db.ForeignKey(
        'game.game_id'), nullable=False)

    # def __init__(self, game):
    # 	self.game_id = game.game_id


class Tile(db.Model):
    tile_id = db.Column(db.Integer, primary_key=True)
    row = db.Column(db.Integer, unique=False)
    col = db.Column(db.Integer, unique=False)
    gameboard_id = db.Column(db.Integer, db.ForeignKey(
        'gameboard.gameboard_id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey(
        'player.player_id'), nullable=True)
    territoryType = db.relationship(
        'TerritoryType', backref='tile', uselist=False, lazy=False)

    def __init__(self, territoryType, player, gameboard, row, col):
        self.territoryType = territoryType
        if player != None:
            self.player_id = player.player_id
        self.gameboard_id = gameboard.gameboard_id
        self.row = row
        self.col = col

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class TerritoryType(db.Model):
    territoryType_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    multiplier = db.Column(db.String, unique=True)
    tile_id = db.Column(db.Integer, db.ForeignKey('tile.tile_id'))

    def __init__(self, name, multiplier):
        self.name = name
        self.multiplier = multiplier
