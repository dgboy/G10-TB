const cvs = document.getElementById("display");
const ctx = cvs.getContext("2d");

ctx.imageSmoothingEnabled = false;

const path = "http://dg:3000/images/";

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

	loadMap: async function(path) {
		const res = await fetch(path);

		if (res.ok) {
			mapManager.parseMap(await res.json());
		} else {
			console.log("HTTP Error: " + res.status);
		}
	},

	fetchJson: async function(path) {
		const res = await fetch(path);
		return (res.ok) ? await res.json() : res.status;
	},

	parseMap: async function (json) {
		this.mapData = json;

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

			const t = await this.fetchJson(path + this.mapData.tilesets[i].source);
			img.src = path + t.image;

			var ts = {
				firstgid: this.mapData.tilesets[i].firstgid,
				image: img,
				name: t.name,
				xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
				yCount: Math.floor(t.imageheight / mapManager.tSize.y)
			}

			this.tilesets.push(ts);
		}
		this.jsonLoaded = true;

		mapManager.draw();
	},

	draw: function () {
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		if(!mapManager.imgLoaded || !mapManager.jsonLoaded) {
			setTimeout(() => {
				mapManager.draw(ctx);
			}, 500);
		} else {
			if(!this.tLayer) {
				for(var id = 0; id < this.mapData.layers.length; id++) {
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
					
					/*
					if(!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) {
						continue;
					}*/

					pX -= this.view.x;
					pY -= this.view.y;
					
					ctx.drawImage(
						tile.img, tile.px, tile.py,
						this.tSize.x, this.tSize.y,
						pX, pY, this.tSize.x * 2, this.tSize.y * 2
					);
				}
			}
		}

	},

	getTile: function (tileIndex) {
		var tile = {
			img: null, px: 0, py: 0
		}
		console.log(tile);
		
		var tileset = this.getTileset(tileIndex);
		tile.img = tileset.image;
		var id = tileIndex - tileset.firstgid;
		var x = id % tileset.xCount;
		var y = Math.floor(id / tileset.xCount);

		tile.px = x * mapManager.tSize.x;
		tile.py = y * mapManager.tSize.y;

		console.log(tile);
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



mapManager.loadMap(path + "tilemap.json");
