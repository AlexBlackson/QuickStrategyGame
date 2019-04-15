var timeLeft = 10;
var players = ["", "", "", "", "", ""];
var game_size;
var turn_obj;
var turn_int = 0;
var player_id;
var player_money = 0;
var player_luck = 0;
var player;;
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
                    localStorage.setItem('player_id', player_id);
                }
            }
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
        turn_int++;
        if(turn_int>= game_size)
            turn_int = 0;
        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', '../../api/player/'+(player_id+1));
        xhr1.onload = function()
        {
            if(xhr1.status === 200)
            {
                player = JSON.parse(xhr1.responseText);
                document.getElementById("stats_display").innerHTML = "Money: " + player.money + " Luck: " + player.resources;
            }
        }
        xhr1.send();
        document.getElementById("turnLabel").innerHTML = "Turn: " + players[turn_int];
    }


    document.getElementById("countdown").innerHTML = timeLeft + " seconds";
    timeLeft -= 1;

    if(timeLeft <= 0){
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '../../game/1/next_turn');

        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(turn_obj, null, 1));

        var xhttp2 = new XMLHttpRequest();
        xhttp2.open('PUT', '../../api/player/'+(player_id+1));

        var inc = parseFloat(money_totals.split(",")[player_id]);
        var inc2 = parseFloat(luck_totals.split(",")[player_id]);
        var p_money = parseFloat(player.money) + inc + money_deduct;
        var p_luck = inc2;
        player.money = p_money;
        player.resources = p_luck;
        xhttp2.setRequestHeader('Content-Type', 'application/json');
        xhttp2.send(JSON.stringify(player, null, 1));

        xhttp.open('PUT', '../../api/gameboard/1');

        // console.log(load_gb.tiles);

        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function(){
            // console.log(xhttp.responseText);
        }
        xhttp.send(JSON.stringify(load_gb));

        timeLeft = 10;
        money_deduct = 0;
    }
}, 1000)
