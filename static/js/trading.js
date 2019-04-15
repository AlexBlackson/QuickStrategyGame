var players;
var player;
var player_names = [];
//0 is your offer, 1 is their offer
var trades = [
    {
        "player_name":"",
        "money":0,
        "tile_id":-1
    },
    {
        "player_name":"",
        "money":0,
        "tile_id":-1
    }
];

function trade(game_id, player){
    console.log("trading");
    console.log(game_id);
    console.log(player);
     // document.getElementById("fade").style.display = "block";
     // document.getElementById("overlay").classList.toggle("overlay_class")
     // document.getElementById("board").style.display = "none"
     var par = document.createElement("div")
     par.id = "overlay"
     var h1 = document.createElement("h1")
     h1.innerHTML = "Trade"
     par.appendChild(h1)
     document.body.appendChild(par)
     getPlayers(game_id);


}
function getPlayers(game_id)
{
    setTimeout(getGameBoard, 2000)

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(JSON.parse(req.responseText));
            players = JSON.parse(req.responseText);
            makeDropDowns();
            // makeCSSDropDowns();
        }
    }
    console.log("http://localhost:5000/api/game/"+game_id.toString() + "/players")
    req.open("GET", "http://localhost:5000/api/game/"+game_id.toString() + "/players", true);
    req.send();
}

function sendTurn(game_id, data)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            // console.log(JSON.parse(req.responseText));
            // players = JSON.parse(req.responseText);
            // makeDropDowns();
            // makeCSSDropDowns();
            console.log("sent turn");
        }
    }
    console.log(data)
    req.open("POST", "http://localhost:5000/game/"+game_id.toString() + "/trade", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(data);
}

function makeCSSDropDowns(){
    var player_names = [];
    for(var i=0; i<players['num_results']; i++){
        player_names.push(players['objects'][i].name)
    }

    var overlay = document.getElementById("overlay");
    var htmlstr = `<ul>
  <li><a href="#home">Home</a></li>
  <li><a href="#news">News</a></li>
  <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn">Dropdown</a>
    <div class="dropdown-content">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a>
    </div>
  </li>
</ul>`;
    overlay.innerHTML=htmlstr;
    // var list_container = document.createElement("ul");
    // var main_div = document.createElement("li");
    // var hover_button = document.createElement("a");
    // var div_menu = document.createElement("div");
    // main_div.href = "#"
    // hover_button.innerHTML = "Select Player"
    // overlay.appendChild(list_container);
    // list_container.appendChild(main_div);
    // main_div.appendChild(hover_button);
    // main_div.appendChild(div_menu);
    // for(var i=0; i<players['num_results']; i++){
    //     var option = document.createElement("a");
    //     option.innerHTML = players['objects'][i].name;
    //     option.href="#"
    //     div_menu.appendChild(option);
    // }

    // main_div.classList.add("dropdown");
    // hover_button.classList.add("dropbtn");
    // div_menu.classList.add("dropdown-content");

}

function makeDropDowns(){
    //Create Array of player names
    // var player_names = [];
    for(var i=0; i<players['num_results']; i++){
        player_names.push(players['objects'][i].name)
    }


    var overlay = document.getElementById("overlay");
    //Create the trading table
    var table_div = document.createElement("div");
    var trade_table = document.createElement("table");
    var trade_button_row = document.createElement("tr");
    var trade_button = document.createElement("button");
    var your_offer_col = document.createElement("td");
    var their_offer_col = document.createElement("td");
    var their_offer_heading = document.createElement("th");
    var your_offer_heading = document.createElement("th");

    trade_button.addEventListener("click", sendTrades);
    trade_button.innerHTML = "Send Trade";
    their_offer_heading.innerHTML="Their Offer";
    your_offer_heading.innerHTML="Your Offer";
    their_offer_col.id = "their_offer_col";
    your_offer_col.id = "your_offer_col";

    your_offer_col.appendChild(your_offer_heading);
    their_offer_col.appendChild(their_offer_heading);
    trade_button_row.appendChild(trade_button);
    trade_table.appendChild(trade_button_row);
    trade_table.appendChild(your_offer_col);
    trade_table.appendChild(their_offer_col);
    table_div.appendChild(trade_table);
    overlay.appendChild(table_div);

    //Create dropdown containers
    var player_select_div = document.createElement("div");
    // var territory_select_div = document.createElement("div");
    player_select_div.classList.add("select-divs");
    // territory_select_div.classList.add("select-divs");
    player_select_div.innerHTML="Select Player: ";
    // territory_select_div.innerHTML="Select Territory to Trade:  ";

    //Create player to trade with selection
    var select_player = document.createElement("select");
    select_player.name = "Select Player";
    select_player.id = "player_select";
    select_player.addEventListener("change",theirMoneyOrTerritory);

    //Create tile to trade selection
    // var select_tile = document.createElement("select");
    // select_tile.name = "Select Tile";
    // select_tile.id = "tile_select";

    their_offer_col.appendChild(player_select_div);
    // their_offer_col.appendChild(territory_select_div);

    player_select_div.appendChild(select_player);
    // territory_select_div.appendChild(select_tile);
    label = document.createElement("optgroup");

    var place_holder_option = document.createElement("option");
    place_holder_option.value = "-1";
    place_holder_option.innerHTML = "Select a Player";
    select_player.appendChild(place_holder_option);

    // label.label = "Select Player";
    // select_player.appendChild(label);
    for(var i=0; i<players['num_results']; i++){
        var option = document.createElement("option");
        option.innerHTML = players['objects'][i].name;
        select_player.appendChild(option);
    }
    yourMoneyOrTerritory();
}

function theirMoneyOrTerritory(){
    their_offer_col = document.getElementById("their_offer_col");
    var select_money_territory = document.createElement("select");
    select_money_territory.name = "Territory or Money?";
    select_money_territory.id = "their_territory_or_money_select";
    select_money_territory.addEventListener("change",theirDecision);
    select_money_div = document.createElement("div");
    select_money_div.innerHTML = "Trade for money or territory? ";
    var money = document.createElement("option");
    var territory = document.createElement("option");
    var place_holder_option = document.createElement("option");
    place_holder_option.value = "-1";
    place_holder_option.innerHTML = "Money or Territory?";
    select_money_territory.appendChild(place_holder_option);
    money.innerHTML = "Money";
    territory.innerHTML = "Territory";
    select_money_territory.appendChild(money);
    select_money_territory.appendChild(territory);
    select_money_div.appendChild(select_money_territory);
    their_offer_col.appendChild(select_money_div);
}
function yourMoneyOrTerritory(){
    your_offer_col = document.getElementById("your_offer_col");
    var select_money_territory = document.createElement("select");
    select_money_territory.name = "Territory or Money?";
    select_money_territory.id = "your_territory_or_money_select";
    select_money_territory.addEventListener("change",yourDecision);
    select_money_div = document.createElement("div");
    select_money_div.innerHTML = "Trade for money or territory? ";
    var money = document.createElement("option");
    var territory = document.createElement("option");
    var place_holder_option = document.createElement("option");
    place_holder_option.value = "-1";
    place_holder_option.innerHTML = "Money or Territory?";
    select_money_territory.appendChild(place_holder_option);
    money.innerHTML = "Money";
    territory.innerHTML = "Territory";
    select_money_territory.appendChild(money);
    select_money_territory.appendChild(territory);
    select_money_div.appendChild(select_money_territory);
    your_offer_col.appendChild(select_money_div);
}

function theirDecision(){
    var money_or_tile = document.getElementById("their_territory_or_money_select").value;
    var selected_player = document.getElementById("player_select").value;
    trades[1]["player_name"] = selected_player;
    if(money_or_tile=="Territory"){
        var player_tiles = [];
        for(var i = 0; i< 9; i++){
            for(var j=0; j < 9; j++){
                if(player_names[myGameBoard[i][j]["player_id"]-1]==selected_player){
                    player_tiles.push(myGameBoard[i][j]);
                }
            }
        }
        console.log(player_tiles);
        console.log(myGameBoard);
        theirPopulateTiles(player_tiles);
    }
    else{
        their_offer_col = document.getElementById("their_offer_col");
        money_input = document.createElement("input");
        money_input.id = "their_money_input";
        their_offer_col.appendChild(money_input);
    }
}

function yourDecision(){
    var money_or_tile = document.getElementById("your_territory_or_money_select").value;
    trades[0]["player_name"] = player.name;
    if(money_or_tile=="Territory"){
        var your_player = player.name;
        var player_tiles = [];
        for(var i = 0; i< 9; i++){
            for(var j=0; j < 9; j++){
                if(player_names[myGameBoard[i][j]["player_id"]-1]==your_player){
                    player_tiles.push(myGameBoard[i][j]);
                }
            }
        }
        console.log(player_tiles);
        console.log(myGameBoard);
        yourPopulateTiles(player_tiles);
    }
    else{
        their_offer_col = document.getElementById("your_offer_col");
        money_input = document.createElement("input");
        money_input.id = "your_money_input";
        their_offer_col.appendChild(money_input);
    }
}


function theirPopulateTiles(player_tiles){

    their_offer_col = document.getElementById("their_offer_col");
    var territory_select_div = document.createElement("div");
    territory_select_div.classList.add("select-divs");
    territory_select_div.innerHTML="Select Territory to Trade:  ";
    var select_tile = document.createElement("select");
    select_tile.name = "Select Tile";
    select_tile.id = "their_tile_select";
    their_offer_col.appendChild(territory_select_div);
    territory_select_div.appendChild(select_tile);
    // row_cols = player_tiles.map(x => [x.row, x.col]);
    tile_ids = player_tiles.map(x => x.tile_id);

    tile_select = document.getElementById("their_tile_select");
    place_holder_option = document.createElement("option");
    place_holder_option.value = "-1";
    place_holder_option.innerHTML = "Select a Tile";
    tile_select.appendChild(place_holder_option);
    for(var i=0; i<tile_ids.length;i++){
        var option = document.createElement("option");
        option.innerHTML = "Tile ID: " + tile_ids[i];
        tile_select.appendChild(option);
    }
}

function yourPopulateTiles(player_tiles){

    their_offer_col = document.getElementById("your_offer_col");
    var territory_select_div = document.createElement("div");
    territory_select_div.classList.add("select-divs");
    territory_select_div.innerHTML="Select Territory to Trade:  ";
    var select_tile = document.createElement("select");
    select_tile.name = "Select Tile";
    select_tile.id = "your_tile_select";
    their_offer_col.appendChild(territory_select_div);
    territory_select_div.appendChild(select_tile);
    // row_cols = player_tiles.map(x => [x.row, x.col]);
    tile_ids = player_tiles.map(x => x.tile_id);

    tile_select = document.getElementById("your_tile_select");
    place_holder_option = document.createElement("option");
    place_holder_option.value = "-1";
    place_holder_option.innerHTML = "Select a Tile";
    tile_select.appendChild(place_holder_option);
    for(var i=0; i<tile_ids.length;i++){
        var option = document.createElement("option");
        option.innerHTML = "Tile ID: " + tile_ids[i];
        tile_select.appendChild(option);
    }
    // console.log(player_tiles)
}

function sendTrades(){
    their_tile = document.getElementById("their_tile_select");
    your_tile = document.getElementById("your_tile_select");
    their_money = 0;
    your_money = 0;
    if(document.getElementById("their_money_input")!= null)
        their_money = parseInt(document.getElementById("their_money_input").value);
    if(document.getElementById("your_money_input")!= null)
        your_money = parseInt(document.getElementById("your_money_input").value);

    if(your_tile!= null)
        trades[0]["tile_id"] = your_tile.value;
    if(their_tile!= null)
        trades[1]["tile_id"] = their_tile.value;
    trades[0]["money"] = your_money;
    trades[1]["money"] = their_money;
    console.log(trades);
    sendTurn(1,JSON.stringify(trades));

}
