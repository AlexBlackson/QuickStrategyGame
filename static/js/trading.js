function trade(game_id){
    console.log("trading");
    console.log(game_id)
     // document.getElementById("fade").style.display = "block";
     // document.getElementById("overlay").classList.toggle("overlay_class")
     // document.getElementById("board").style.display = "none"
     var par = document.createElement("div")
     par.id = "overlay"
     var h1 = document.createElement("h1")
     h1.innerHTML = "blah"
     par.appendChild(h1)
     document.body.appendChild(par)
     var players = getPlayers(game_id);
     for(var i=0; i<players['num_results']; i++)
        console.log(players['objects'][i].name)

}
function getPlayers(game_id)
{
    setTimeout(getGameBoard, 2000)

    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(JSON.parse(req.responseText));
            return JSON.parse(req.responseText);
        }
    }
    console.log("http://localhost:5000/api/game/"+game_id.toString() + "/players")
    req.open("GET", "http://localhost:5000/api/game/"+game_id.toString() + "/players", true);
    req.send();
}
