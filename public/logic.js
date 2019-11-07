var cvs = document.getElementById("display");
var ctx = cvs.getContext("2d");



const mapManager = {
    mapData: null,
    tLayer: null,
    xCount: 0,
    yCount: 0,
    tSize: {x: 64, y: 64},
    mapSize: {x: 64, y: 64},
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
        console.log(tilesJSON);
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
    
                if(
                    mapManager.imgLoadCount === 
                    mapManager.mapData.tilesets.length
                ) {
                    console.log(mapManager.mapData.tilesets.length);
                    mapManager.imgLoaded = true;
                }
            };
    
            console.log(this.mapDate.tilesets);
            img.src = this.mapDate.tilesets[i].image;
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
        this.jsonLoaded = true;
    },

    draw: function (ctx) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        if(!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () { mapManager.draw(ctx); }, 100);
        } else {
            if(this.tLayer === null) {
                for(var id = 0; id < this.mapData.layers.length; i++) {
                    var layer = this.mapData.layers[id];
                    
                    if(layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            }

            for(var i = 0; i < this.tLayer.data.length; i++) {
                if(this.tLayer.data[i] !== 0) {
                    var tile = this.getTile(this.tLayer.data[i]);
                    var pX = (i % this.xCount) * this.tSize.x;
                    var pY = Math.floor(i / this.yCount) * this.tSize.y;
                    
                    if(!this.isVisible(pX, pY, this.tSize.x, this.tSize/y)) {
                        continue;
                    }

                    pX -= this.view.x;
                    pY -= this.view.y;

                    ctx.drawImage(
                        tile.img, tile.px. tile.py, 
                        this.tSize.x, this.tSize.y,
                        pX, pY, this.tSize.x, this.tSize.y
                    );
                }
            }
        }
        requestAnimationFrame(draw);
    }
};



mapManager.loadMap("http://dg:3000/images/map.json");
mapManager.draw(ctx);



function getTile(tileIndex) {
    var tile = {
        img: null,
        px: 0,
        py: 0
    }
    
    var tileset = this.getTileset(tileIndex);
    tile.img = tileset.image;
    var id = tileIndex - tileset.firstgid;
    var x = id % tileset.xCount;
    var y = Math.floor(id / tileset.xCount);

    tile.px = x * mapManager.tSize.x;
    tile.py = y * mapManager.tSize.y;

    return tile;
}

function getTileset(tileIndex) {
    for(var i = mapManager.tilesets.length - 1; i >= 0; i--) {
        if(mapManager.tilesets[i].firstgid <= tileIndex) {
            return mapManager.tilesets[i];
        }
    }

    return null;
}

function isVisible(x, y, width, height) {
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


/*
let spr = new Image();
spr.src = "images/pic_greenhead.png";

console.log(ctx);

function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(spr, 0, 0);
    requestAnimationFrame(draw);
}

draw();
*/
