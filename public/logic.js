var cvs = document.getElementById("display");
var ctx = cvs.getContext("2d");

let check = 0;

const mapManager = {
    mapData: null,
    tLayer: null,
    xCount: 0,
    yCount: 0,
    tSize: {x: 16, y: 16},
    mapSize: {x: 16, y: 16},
    tilesets: new Array(),

    imgLoadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,

    view: {
        x: 0,
        y: 0,
        w: 1200,
        h: 600
    },

    loadMap: function(path) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState === 4 && req.status === 200) {
                mapManager.parseMap(req.responseText);
            }
        };
        
        req.open("GET", path, true);
        req.send();
    },

    parseMap: function (tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        console.log(this.mapData);

        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
    
        for(var i = 0; i < this.mapData.tilesets.length; i++) {
            var img = new Image();
    
            img.onload = function () {
                mapManager.imgLoadCount++;
    
                if(mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;
                }
            };

            img.src = this.mapData.tilesets[i].image;
            var t = this.mapData.tilesets[i];
            var ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
                yCount: Math.floor(t.imageheight / mapManager.tSize.y)
            }

            this.tilesets.push(ts);
        }
        console.log(this);
        this.jsonLoaded = true;
    },

    draw: function () {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        if(!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(() => { 
                mapManager.draw(); 
            }, 100);
        } else {
            check++;
            console.log(`A(${check}):` + this.tLayer);
            
            if(!this.tLayer) {
                console.log("In!");
                for(var id = 0; id < this.mapData.layers.length; i++) {
                    var layer = this.mapData.layers[id];
                    if(layer.type === "tilelayer") {
                        console.log(layer);
                        this.tLayer = layer;
                        break;
                    }
                }
            }

            console.log("B: " + this.tLayer);

            for(var i = 0; i < this.tLayer.data.length; i++) {
                if(this.tLayer.data[i] !== 0) {
                    var tile = this.getTile(this.tLayer.data[i]);
                    var pX = (i % this.xCount) * this.tSize.x;
                    var pY = Math.floor(i / this.yCount) * this.tSize.y;
                    
                    if(!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) {
                        continue;
                    }

                    pX -= this.view.x;
                    pY -= this.view.y;

                    ctx.drawImage(
                        tile.img, tile.px, tile.py,
                        this.tSize.x, this.tSize.y,
                        pX, pY, this.tSize.x, this.tSize.y
                    );
                }
            }
        }

        console.log("--- req ---");
        requestAnimationFrame(mapManager.draw);
    },

    getTile: function (tileIndex) {
        var tile = {
            img: null, px: 0, py: 0
        }
        
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        var id = tileIndex - tileset.firstgid;
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);

        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;

        return tile;
    },

    getTileset: function (tileIndex) {
        for(var i = mapManager.tilesets.length - 1; i >= 0; i--) {
            if(mapManager.tilesets[i].firstgid <= tileIndex) {
                return mapManager.tilesets[i];
            }
        }

        return null;
    },

    isVisible: function (x, y, width, height) {
        if(
            x + width < this.view.x || 
            y + height < this.view.y || 
            x < this.view.x + this.view.w || 
            y < this.view.y + this.view.h
        ) {
            return false;
        }
        return true;
    }
};


/*
mapManager.loadMap("http://dg:3000/images/tilemap2.json");
mapManager.draw();
*/




let spr = new Image();
spr.src = "images/tileset.png";

function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(spr, 0, 0);
    requestAnimationFrame(draw);
}

draw();
