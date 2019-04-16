var myGameBoard = new Array(9);
myGameBoard[0] = new Array(9);
myGameBoard[1] = new Array(9);
myGameBoard[2] = new Array(9);
myGameBoard[3] = new Array(9);
myGameBoard[4] = new Array(9);
myGameBoard[5] = new Array(9);
myGameBoard[6] = new Array(9);
myGameBoard[7] = new Array(9);
myGameBoard[8] = new Array(9);
var old_hover;
myvar = setTimeout(getGameBoard,2000);
var has_clicked = false;
var clicked_id;
var game;
var money_totals = [0,0,0,0,0,0];
var luck_totals = [0,0,0,0,0,0];
var load_gb;
var money_deduct = 0;
var add_troops = false;
var old_y;
var old_x;

var player1_count = 0;
var player2_count = 0;
var player3_count = 0;
var player4_count = 0;
var player5_count = 0;
var player6_count = 0;

function assign_game(g, player){
    game = g;
}

var par;

function button_pushed()
{
   if(add_troops)
   {
       add_troops = false;
   }
   else
   {
       add_troops = true;
   }
}

function hover(id, color) {
    old_hover = document.getElementById(id).getAttribute('class');
    document.getElementById(id).setAttribute('class', 'hexagon8');

    par = document.createElement("div");
    par.id = "tileInformation";
    var h1 = document.createElement("h3");
    var h2 = document.createElement("h3");
    var h3 = document.createElement("h3");
    var h4 = document.createElement("h3");

    var tile = myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))];

    h1.innerHTML = tile.territoryName;
    h2.innerHTML = "Income: " + tile.income;
    h3.innerHTML = "Luck: " + tile.luck;
    h1.style.color = "white";
    h2.style.color = "white";
    h3.style.color = "white";
    par.appendChild(h1);
    par.appendChild(h2);
    par.appendChild(h3);

    var x = event.clientX;
    var y = event.clientY;

    par.style.left = x+110;
    par.style.top = y;
    document.body.appendChild(par);
}

function end_hover(id, revert)
{
    if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id == "1")
    {
        document.getElementById(id).setAttribute('class', 'hexagon1');
        document.getElementById(id).getElementsByTagName('p')[0].innerHTML = myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count;

    }
    else if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id == "2")
    {
        document.getElementById(id).setAttribute('class', 'hexagon2');
        document.getElementById(id).getElementsByTagName('p')[0].innerHTML = myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count;
    }
    else if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id == "3")
    {
        document.getElementById(id).setAttribute('class', 'hexagon3');
        document.getElementById(id).getElementsByTagName('p')[0].innerHTML = myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count;
    }
    else if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id == "4")
    {
        document.getElementById(id).setAttribute('class', 'hexagon4');
        document.getElementById(id).getElementsByTagName('p')[0].innerHTML = myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count;
    }
    else if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id == "5")
    {
        document.getElementById(id).setAttribute('class', 'hexagon5');
        document.getElementById(id).getElementsByTagName('p')[0].innerHTML = myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count;
    }
    else if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id == "6")
    {
        document.getElementById(id).setAttribute('class', 'hexagon6');
        document.getElementById(id).getElementsByTagName('p')[0].innerHTML = myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count;
    }
    else
    {
        document.getElementById(id).setAttribute('class', 'hexagon7');
    }
    //document.getElementById(id).getElementsByTagName('p')[0].innerHTML = "x";
    document.body.removeChild(par);
}

function clicked(id)
{
    event.preventDefault();
    if(!add_troops)
    {
        if(!has_clicked)
        {
            if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id = (player_id+1))
            {
                clicked_id = id;
                has_clicked = true;

                old_x = event.clientX;
                old_y = event.clientY;
            }
        }

        else
        {
            if(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id != localStorage.getItem('player_id'))
            {
                var x_diff = event.clientX - old_x;
                var y_diff = event.clientX - old_y;
                if(Math.pow(x_diff, 2) + Math.pow(y_diff, 2) < Math.pow(1000, 2))
                {
                    var attacker_number = parseInt(document.getElementById(clicked_id).getElementsByTagName('p')[0].innerHTML);
                    var defender_number = parseInt(document.getElementById(id).getElementsByTagName('p')[0].innerHTML);

                    var attacker_luck = luck_totals[parseInt(player_id)];
                    var defender_luck = luck_totals[parseInt(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id) - 1];
                    var attacker_n = attacker_number + attacker_luck/6;
                    var defender_n = defender_number + defender_luck/6;

                    if(attacker_n < defender_n)
                    {
                        defender_number = defender_number - attacker_number;
                        attacker_number = 1;
                    }
                    else if(attacker_n == defender_n)
                    {
                        attacker_number = 1;
                        defender_number = 1;
                    }
                    else
                    {
                        attacker_number = attacker_number - defender_number;
                        if(attacker_number > 1)
                        {
                            myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id = (player_id+1);
                        }
                            myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count = attacker_number - 1;

                            myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))].unit_count = 1;


                    }

                    var cb;
                    var cb2;
                    for(cb = 0; cb < 9; cb++)
                    {
                        for(cb2 = 0; cb2 <9; cb2++)
                        {
                            load_gb.tiles[cb2+cb*9] = myGameBoard[cb2][cb];
                        }
                    }
                    has_clicked = false;

                    var xhttp = new XMLHttpRequest();
                    xhttp.open('PUT', '../../api/gameboard/1');

                    console.log(load_gb.tiles);

                    xhttp.setRequestHeader('Content-Type', 'application/json');
                    xhttp.onreadystatechange = function(){
                        console.log(xhttp.responseText);
                    }
                    xhttp.send(JSON.stringify(load_gb));
                }
            }
            else
            {
                var attacker_number = parseInt(document.getElementById(clicked_id).getElementsByTagName('p')[0].innerHTML);
                myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count = attacker_number - 1;
                myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))].unit_count = 1;

                var cb;
                    var cb2;
                    for(cb = 0; cb < 9; cb++)
                    {
                        for(cb2 = 0; cb2 <9; cb2++)
                        {
                            load_gb.tiles[cb2+cb*9] = myGameBoard[cb2][cb];
                        }
                    }
                    has_clicked = false;

                    var xhttp = new XMLHttpRequest();
                    xhttp.open('PUT', '../../api/gameboard/1');

                    console.log(load_gb.tiles);

                    xhttp.setRequestHeader('Content-Type', 'application/json');
                    xhttp.onreadystatechange = function(){
                        console.log(xhttp.responseText);
                    }
                    xhttp.send(JSON.stringify(load_gb));
            }
        }
    }
    else
    {
        money_deduct-=10;

        myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count = (parseInt(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count)+1);



        var cb;
        var cb2;
        for(cb = 0; cb < 9; cb++)
        {
            for(cb2 = 0; cb2 <9; cb2++)
            {
                load_gb.tiles[cb2+cb*9] = myGameBoard[cb2][cb];
            }
        }
        has_clicked = false;

        var xhttp = new XMLHttpRequest();
        xhttp.open('PUT', '../../api/gameboard/1');

        console.log(load_gb.tiles);

        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function(){
            console.log(xhttp.responseText);
        }
        xhttp.send(JSON.stringify(load_gb));
    }
}

function getGameBoard()
{
    setTimeout(getGameBoard, 800)

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../api/gameboard/1');
    xhr.onload = function() {
        if (xhr.status === 200) {
            load_gb = JSON.parse(xhr.responseText);

            var cb;
            var cb2;
            for(cb = 0; cb < 9; cb++)
            {
                for(cb2 = 0; cb2 <9; cb2++)
                {
                    myGameBoard[cb2][cb] = load_gb.tiles[cb2+cb*9];
                }
            }
            var i=0;
            var left = 2;
            var right = 7;
            var left_increase = true;

            var temp_money_totals = [0,0,0,0,0,0];
            var temp_luck_totals = [0,0,0,0,0,0];

            for (i = 0; i < 5; i++)
            {
                for(j = left; j < right; j++)
                {
                    var pid = parseInt(myGameBoard[i][j].player_id);
                    temp_money_totals[pid-1] += parseFloat(myGameBoard[i][j].income);
                    temp_luck_totals[pid-1] += parseFloat(myGameBoard[i][j].luck);
                    localStorage.setItem('money_totals', money_totals);
                    localStorage.setItem('luck_totals', luck_totals);

                    if(!(document.getElementById(i + "" + j).getAttribute('class') == 'hexagon8'))
                    {
                        if(myGameBoard[i][j].player_id == "1")
                        {
                            document.getElementById(i + "" + j).setAttribute('class', 'hexagon1');
                            document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                            player1_count++;
                        }
                        else if(myGameBoard[i][j].player_id == "2")
                        {
                            document.getElementById(i + "" + j).setAttribute('class', 'hexagon2');
                            document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                            player2_count++;
                        }
                        else if(myGameBoard[i][j].player_id == "3")
                        {
                            document.getElementById(i + "" + j).setAttribute('class', 'hexagon3');
                            document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                            player3_count++;
                        }
                        else if(myGameBoard[i][j].player_id == "4")
                        {
                            document.getElementById(i + "" + j).setAttribute('class', 'hexagon4');
                            document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                            player4_count++;
                        }
                        else if(myGameBoard[i][j].player_id == "5")
                        {
                            document.getElementById(i + "" + j).setAttribute('class', 'hexagon5');
                            document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                            player5_count++;
                        }
                        else if(myGameBoard[i][j].player_id == "6")
                        {
                            document.getElementById(i + "" + j).setAttribute('class', 'hexagon6');
                            document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                            player6_count++;
                        }
                    }
                }
                if(left_increase)
                {
                    left--;
                }
                else
                {[i]
                    right++;
                }
                left_increase = !left_increase;
            }


        left = 0;
        right = 8
        var left_decrease = true;

        for (i = 5; i < 9; i++)
        {
            for(j = left; j < right; j++)
            {
                var pid = parseInt(myGameBoard[i][j].player_id);
                temp_money_totals[pid-1] += parseFloat(myGameBoard[i][j].income);
                temp_luck_totals[pid-1] += parseFloat(myGameBoard[i][j].luck);

                if(!(document.getElementById(i + "" + j).getAttribute('class') == 'hexagon8'))
                {
                    if(myGameBoard[i][j].player_id == "1")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon1');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                        player1_count++;
                    }
                    else if(myGameBoard[i][j].player_id == "2")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon2');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                        player2_count++;
                    }
                    else if(myGameBoard[i][j].player_id == "3")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon3');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                        player3_count++;
                    }
                    else if(myGameBoard[i][j].player_id == "4")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon4');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                        player4_count++;
                    }
                    else if(myGameBoard[i][j].player_id == "5")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon5');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                        player5_count++;
                    }
                    else if(myGameBoard[i][j].player_id == "6")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon6');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                        player6_count++;
                    }
                }
            }
            if(left_decrease)
            {
                left++;
            }
            else
            {
                right--;
            }
                left_decrease= !left_decrease;
        }

        if(player1_count == 61)
        {
            document.getElementById("stats_display").innerHTML = "Player 1 Wins";
        }
        else if(player2_count == 61)
        {
            document.getElementById("stats_display").innerHTML = "Player 2 Wins";
        }
        else if(player3_count == 61)
        {
            document.getElementById("stats_display").innerHTML = "Player 3 Wins";
        }
        else if(player4_count == 61)
        {
            document.getElementById("stats_display").innerHTML = "Player 4 Wins";
        }
        else if(player5_count == 61)
        {
            document.getElementById("stats_display").innerHTML = "Player 5 Wins";
        }
        else if(player6_count == 61)
        {
            document.getElementById("stats_display").innerHTML = "Player 6 Wins";
        }

        luck_totals = temp_luck_totals;
        money_totals = temp_money_totals;
        localStorage.setItem('money_totals', money_totals);
        localStorage.setItem('luck_totals', luck_totals);
    }
        else {
            console.log('Request failed. Returned status of ' + xhr.responseText);
        }
    }

    xhr.send();
}
