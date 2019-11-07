const express = require("express");
const app = express();

let mapfile = "/images/map.json";

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/game.html");
});

app.listen(3000);
