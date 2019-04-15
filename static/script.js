class Game
{
    constructor(board, players, id)
    {
        this.board = board;
        this.players = players;
        this.id = id;
    }

    get players()
    {
        return this.players;
    }

    get board()
    {
        return this.board;
    }

    get id()
    {
        return this.id;
    }
}

class Player
{
    constructor(username)
    {
        this.username = username;
    }
}