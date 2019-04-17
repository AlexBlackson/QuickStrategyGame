var timeLeft = 10;
var players1 = ["", "", "", "", "", ""];
var game_size;
var turn_obj;
var turn_int = 0;
var player_id;
var player_money = 0;
var player_luck = 0;
var player;;
var trade_alert = false;
(function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../api/game/1');
    xhr.onload = function() {
        game = JSON.parse(xhr.responseText);
        if (xhr.status == 200) {
            game_size = game.players.length;
            players1[0] = game.players[0].name;
            players1[1] = game.players[1].name;
            players1[2] = game.players[2].name;

            var i;
            for (i = 0; i < 6; i++) {
                if (players1[i] == localStorage.getItem('usrname')) {
                    player_id = i;
                    localStorage.setItem('player_id', player_id);
                }
            }
        }
    }
    xhr.send();
}());

var turnTimer = setInterval(function() {
    var money_totals = localStorage.getItem('money_totals');
    var luck_totals = localStorage.getItem('luck_totals');



    if (timeLeft == 10) {
        // GET turn
        turn_int++;
        if (turn_int >= game_size)
            turn_int = 0;
        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', '../../api/player/' + (player_id + 1));
        xhr1.onload = function() {
            if (xhr1.status === 200) {
                player = JSON.parse(xhr1.responseText);
                document.getElementById("stats_display").innerHTML = "Money: " + player.money + " Luck: " + player.resources;
                pollPendingTrade();
            }
        }
        xhr1.send();
        document.getElementById("turnLabel").innerHTML = "Turn: " + players1[turn_int];
    }


    document.getElementById("countdown").innerHTML = timeLeft + " seconds";
    timeLeft -= 1;

    if (timeLeft <= 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '../../game/1/next_turn');

        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(turn_obj, null, 1));

        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', '../../api/player/' + (player_id + 1));
        xhr1.onload = function() {
            if (xhr1.status === 200) {
                player = JSON.parse(xhr1.responseText);
                document.getElementById("stats_display").innerHTML = "Money: " + player.money + " Luck: " + player.resources;
                var xhttp2 = new XMLHttpRequest();
                xhttp2.open('PUT', '../../api/player/' + (player_id + 1));
                var inc = parseFloat(money_totals.split(",")[player_id]);
                var inc2 = parseFloat(luck_totals.split(",")[player_id]);
                var p_money = parseFloat(player.money) + inc + money_deduct;
                var p_luck = inc2;
                player.money = p_money;
                player.resources = p_luck;
                xhttp2.setRequestHeader('Content-Type', 'application/json');
                xhttp2.send(JSON.stringify(player, null, 1));
                pollPendingTrade();
            }
        }
        xhr1.send();
        document.getElementById("turnLabel").innerHTML = "Turn: " + players1[turn_int];

        xhttp.open('PUT', '../../api/gameboard/1');

        // console.log(load_gb.tiles);

        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function() {
            // console.log(xhttp.responseText);
        }
        xhttp.send(JSON.stringify(load_gb));

        timeLeft = 10;
        money_deduct = 0;
    }
}, 1000)

function pollPendingTrade() {

    setTimeout(pollPendingTrade, 2000)

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log("blah blah");
            console.log(req.responseText);
            if(req.responseText!=""){
                if(!trade_alert){
                    trade_alert = true;
                    var trade = JSON.parse(req.responseText);
                    var par = document.createElement("div")
                    par.id = "overlay"
                    var div_trade_info = document.createElement("div");
                    var p1s_offer = "";
                    var p2s_offer = "";
                    if(trade[0]["tile_id"] != -1){
                        p1s_offer = "Tile " + trade[0]["tile_id"].toString();
                    }
                    else{
                        p1s_offer = "$ " + trade[0]["money"].toString();
                    }
                    if(trade[1]["tile_id"] != -1){
                        p2s_offer = "Tile " + trade[1]["tile_id"].toString();
                    }
                    else{
                        p2s_offer = "$" + trade[1]["money"].toString();
                    }
                    var trade_string = trade[0]["player_name"] + " will give you " + p1s_offer + " and you will give " + p2s_offer;
                    var h1 = document.createElement("h1");
                    h1.innerHTML = "Trade Offer!"
                    var table = document.createElement("table");
                    var tr1 = document.createElement("tr");
                    var tr2 = document.createElement("tr");
                    // var tr3 = document.createElement("tr");
                    table.appendChild(tr1);
                    table.appendChild(tr2);
                    // table.appendChild(tr3);
                    var trade_button = document.createElement("button");
                    trade_button.addEventListener("click", acceptTrade);
                    trade_button.innerHTML = "Send Trade";
                    div_trade_info.innerHTML= trade_string;
                    tr1.appendChild(div_trade_info);
                    tr2.appendChild(trade_button);
                    par.appendChild(h1);
                    par.appendChild(table);
                    // par.appendChild(div_trade_info);
                    // par.appendChild(trade_button);
                    document.body.appendChild(par);
                }
            }
        }
    }
    console.log("/game/1" + "/check_for_trades/" + player.name)
    req.open("GET", "/game/1" + "/check_for_trades/" + player.name, true);
    req.send();
}

function acceptTrade(){
    trade_alert = false;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log("accepted trade!");
            document.getElementById("overlay").remove();
        }
    }
    req.open("POST", "/game/1/accept_trade/" + player.name, true);
    req.send();
}
