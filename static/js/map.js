var myGameBoard;
var old_hover;
myvar = setTimeout(getGameBoard,2000);
var has_clicked = false;
var clicked_id;
var game;

function assign_game(g){
    game = g;
    console.log(game)
}


function hover(id, color) {
    old_hover = document.getElementById(id).getAttribute('class');
    document.getElementById(id).setAttribute('class', 'hexagon8');
}

function end_hover(id, revert)
{
    document.getElementById(id).setAttribute('class', old_hover);
    //document.getElementById(id).getElementsByTagName('p')[0].innerHTML = "x";
}

function clicked(id)
{
    if(!has_clicked)
    {
        clicked_id = id;
        has_clicked = true;
    }
    else
    {
        var attacker_number = parseInt(document.getElementById(clicked_id).getElementsByTagName('p')[0].innerHTML);
        var defender_number = parseInt(document.getElementById(id).getElementsByTagName('p')[0].innerHTML);

        if(attacker_number < defender_number)
        {
            defender_number -= attacker_number
            attacker_number = 1;
            myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count = defender_number;
            myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))].unit_count = defender_number;
        }
        else if(attacker_number == defender_number)
        {
            attacker_number = 1;
            defender_number = 1;

            myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count = defender_number;
            myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))].unit_count = defender_number;
        }
        else
        {
            attacker_number = attacker_number - defender_number-1;
            defender_number = 0;

            myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].unit_count = attacker_number;
            myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))].unit_count = 1;

            myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].player_id = myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))].player_id;
        }
        has_clicked = false;


        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/1/gameboard/tiles/' + myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))].tile_id);

        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.send(JSON.stringify(myGameBoard[parseInt(id.charAt(0))][parseInt(id.charAt(1))], null, 1));

        var xhttp2 = new XMLHttpRequest();
        xhttp2.open('POST', '/1/gameboard/tiles/' + myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))].tile_id);

        xhttp2.setRequestHeader('Content-Type', 'application/json');

        xhttp2.send(JSON.stringify(myGameBoard[parseInt(clicked_id.charAt(0))][parseInt(clicked_id.charAt(1))]));
    }

}

function getGameBoard()
{
    setTimeout(getGameBoard, 2000)

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../api/gameboard/1');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            myGameBoard = JSON.parse(xhr.responseText);
            var i;
            var left = 2;
            var right = 7;
            var left_increase = true;
            for (i = 0; i < 5; i++)
            {
                for(j = left; j < right; j++)
                {
                    if(myGameBoard.tiles[i][j].player_id == "1")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon1');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                    }
                    else if(myGameBoard.tiles[i][j].player_id == "2")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon2');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                    }
                    else if(myGameBoard.tiles[i][j].player_id == "3")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon3');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                    }
                    else if(myGameBoard.tiles[i][j].player_id == "4")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon4');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                    }
                    else if(myGameBoard.tiles[i][j].player_id == "5")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon5');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                    }
                    else if(myGameBoard.tiles[i][j].player_id == "6")
                    {
                        document.getElementById(i + "" + j).setAttribute('class', 'hexagon6');
                        document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
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
        right = 7
        var left_decrease = true;
        for (i = 5; i < 9; i++)
        {
            for(j = left; j < right; j++)
            {
                if(myGameBoard[i][j].player_id == "1")
                {
                    document.getElementById(i + "" + j).setAttribute('class', 'hexagon1');
                    document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
                }
                else if(myGameBoard[i][j].player_id == "2")
                {
                    document.getElementById(i + "" + j).setAttribute('class', 'hexagon2');
                    document.getElementById(i + "" + j).getElementsByTagName('p')[0].innerHTML = myGameBoard[i][j].unit_count;
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
    }
        else {
            console.log('Request failed. Returned status of ' + xhr.responseText);
        }
    }

    xhr.send();
}
