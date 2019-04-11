var timeLeft = 10;
var players = ["", "", "", "", "", ""];
var game_size;
var turn_obj;
var turn_int;
var player_id;
var player_money = 0;
var player_luck = 0;
(function()
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../api/game/1');
    xhr.onload = function()
    {
        game = JSON.parse(xhr.responseText);
        if(xhr.status == 200)
        {
            game_size = game.players.length;
            players[0] = game.players[0].name;
            players[1] = game.players[1].name;
            players[2] = game.players[2].name;

            var i;
            for(i= 0; i < 6; i++)
            {
                if(players[i] == localStorage.getItem('usrname'))
                {
                    player_id = i;
                }
            }
            console.log(players[0]);
            console.log(players[1]);
            console.log(players[2]);
        }
    }
    xhr.send();
}());

var turnTimer = setInterval(function(){
    var money_totals = localStorage.getItem('money_totals');
    var luck_totals = localStorage.getItem('luck_totals');
    if(timeLeft == 10)
    {
        // GET turn
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '../../game/1/next_turn');
        xhr.onload = function() 
        {
            if (xhr.status === 200) 
            {
                console.log(xhr.responseText);
                turn_obj = JSON.parse(xhr.responseText);
                turn_int = parseInt(turn_obj.order_idx);
                document.getElementById("turnLabel").innerHTML = "Turn: " + players[turn_int];
            }
        }
        xhr.send();

        player_money += parseFloat(money_totals[player_id]);
        player_luck += parseFloat(luck_totals[player_id]);
    }   
    document.getElementById("countdown").innerHTML = timeLeft + " seconds";
    timeLeft -= 1;

    document.getElementById("stats_display").innerHTML = "Money: " + player_money.toString() + " Luck: " + player_luck.toString();

    if(timeLeft <= 0){
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '../../game/1/next_turn');

        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(turn_obj, null, 1));
        timeLeft = 10;
    }
}, 1000)