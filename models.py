from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import datetime

# note this should only be created once per project
# to define models in multiple files, put this in one file, and import db into each model, as we import it in flaskr.py
db = SQLAlchemy()
ma = Marshmallow()


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80), unique=False)
    player_id = db.Column(db.Integer, db.ForeignKey('player.player_id'))

    def __init__(self, username, password):
        self.username = username
        self.password = password

    # def get(self, user_id):
    #    return UserSchema(many=True).dump(self)


class Player(db.Model):
    player_id = db.Column(db.Integer, primary_key=True)
    user = db.relationship('User', backref='player', lazy=False, uselist=False)
    name = db.Column(db.String(80), unique=False)
    resources = db.Column(db.String, unique=False)
    money = db.Column(db.Float, unique=False)
    tiles = db.relationship('Tile', backref='player', lazy=False)
    game_id = db.Column(db.Integer, db.ForeignKey(
        'game.game_id'), nullable=True)

    def __init__(self, user):
        self.user = user
        self.name = user.username


class Game(db.Model):
    game_id = db.Column(db.Integer, primary_key=True)
    players = db.relationship('Player', backref='game', lazy=False)
    gameboard = db.relationship(
        'Gameboard', backref='game', lazy=False, uselist=False)
    gameOver = db.Column(db.Boolean, unique=False)
    turn = db.relationship('Turn', backref='game', lazy=False, uselist=False)

    def __init__(self, turn, gameboard=None):
        self.gameOver = False
        self.turn = turn
        if gameboard != None:
            self.gameboard = gameboard


class Gameboard(db.Model):
    gameboard_id = db.Column(db.Integer, primary_key=True)
    tiles = db.relationship('Tile', backref='gameboard', lazy=False)
    game_id = db.Column(db.Integer, db.ForeignKey(
        'game.game_id'), nullable=False)


class Tile(db.Model):
    tile_id = db.Column(db.Integer, primary_key=True)
    gameboard_id = db.Column(db.Integer, db.ForeignKey(
        'gameboard.gameboard_id'), nullable=False)
    row = db.Column(db.Integer, unique=False)
    col = db.Column(db.Integer, unique=False)
    # mutable
    territoryName = db.Column(db.String(80), nullable=False, unique=False)
    multiplier = db.Column(db.String(80), unique=False)
    player_id = db.Column(db.Integer, db.ForeignKey(
        'player.player_id'), nullable=True)
    unit_count = db.Column(db.Integer, unique=False)

    def __init__(self, player, gameboard, row, col, territoryName, multiplier, unit_count):
        self.territoryName = territoryName
        self.multiplier = multiplier
        if player != None:
            self.player_id = player.player_id
        else:
            self.player_id = -1
        self.gameboard_id = gameboard.gameboard_id
        self.row = row
        self.col = col
        self.unit_count = unit_count

    def as_dict(self):
        dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        return dict


class Turn(db.Model):
    turn_id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey(
        'game.game_id'), nullable=True)
    round = db.Column(db.Integer, nullable=False)
    order_idx = db.Column(db.Integer, nullable=False)
    order = db.Column(db.String(80), nullable=True)

    def __init__(self):
        self.round = 0
        self.order_idx = 0

    def as_dict(self):
        dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        return dict

# Marshmallow Schema


class GameboardSchema(ma.ModelSchema):
    class Meta:
        model = Gameboard


class TileSchema(ma.ModelSchema):
    class Meta:
        model = Tile


class UserSchema(ma.ModelSchema):
    class Meta:
        model = User


class PlayerSchema(ma.ModelSchema):
    class Meta:
        model = Player


class GameSchema(ma.ModelSchema):
    class Meta:
        model = Game

class TurnSchema(ma.ModelSchema):
    class Meta:
        model = Turn
