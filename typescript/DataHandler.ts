class DataHandler {
    constructor() {
        this.initCivsData();
        this.initRegionData();
    }

    stringArrayDefText(arr) {
    	var ret = '[';
    	for (var i = 0; i < arr.length; i++) {
    		ret += '"' + arr[i] + '"' + (i < arr.length-1 ? ',' : '');
    	}
    	ret += ']';
    	return ret;
    }

    initCivsData() {
    	var cd = [
    		[0,"Minoa","Minoan",true],
    		[1,"Saba","Sabaean",false],
    		[2,"Celts","Celtic",true],
    		[3,"Assyria","Assyrian",true],
    		[4,"Rome","Roman",false],
    		[5,"Babylon","Babylonian",false],
    		[6,"Carthage","Carthaginian",false],
    		[7,"Hellas","Hellenic",false],
    		[8,"Nubia","Nubian",false],
    		[9,"Hatti","Hattian",false],
    		[10,"Iberia","Iberian",false],
    		[11,"Egypt","Egyptian",false],
    		[12,"Barbarians","Barbarian",false],
    		[13,"Pirates","Pirate",false],
    	];

    	G.GV.civs = [];
    	for(var i = 0; i < cd.length; i++) {
    		G.GV.civs.push( new Civilization(cd[i]) );
    	}
    }

    initRegionData() {
    	G.GV.regions = [];
    	var i = 1;
    	for (var key in G.regionListJSON)
    	{
    		//console.log(obj.regionID);
    		var obj = G.regionListJSON[key]

    		G.GV.regions.push(new Region(
                i,
    			obj.name,
    			obj.food,
    			obj.floodType,
    			obj.citySite,
    			obj.landConn,
    			obj.seaConn,
    			obj.tokenSize,
    			obj.iconXY,
    			obj.cityXY,
    			obj.tokenSpots,
    			obj.shipSpots
    		));
    		i++;
    	}
    }

    // Export Game data to a JSON object
    exportGameData(console:Consoler) {
    	var NL = "\r\n"
    	var CNL = ",\r\n"
    	var text = '{' + NL;

    	function quote(t) {	return '"' + t + '"'; }
    	function coord(x,y) { return '[' + x + ',' + y + ']'; }

    	for(var i = 0; i < G.GV.regions.length; i++) {

    		if(G.GV.regions[i].regionID >= 0) {
    			var foodSprite = G.GV.regions[i].regionGraphic.sprite;
    			var foodXY = coord(foodSprite.x, foodSprite.y);
    			var citySprite = G.GV.regions[i].cityGraphic.sprite;
    			var cityXY = coord(citySprite.x, citySprite.y);
    			//var cityXY = coord(citySprite.x + citySprite.width/2, citySprite.y + citySprite.height/2);

    			var tokenSpotsText = '';
    			var shipSpotsText = '';
    			var t;
    			var spots = G.GV.regions[i].tokenGraphics.tokenSpots;
    			for (var k = 0; k < spots.length; k++) {
    				if (spots[k].sprite.x >= 0 && spots[k].sprite.y >= 0) {
    					tokenSpotsText += coord(spots[k].sprite.x, spots[k].sprite.y) + ',';
    				}
    			}

    			spots = G.GV.regions[i].shipGraphics.tokenSpots;
    			for (var k = 0; k < spots.length; k++) {
    				if (spots[k].sprite.x >= 0 && spots[k].sprite.y >= 0) {
    					shipSpotsText += coord(spots[k].sprite.x, spots[k].sprite.y) + ',';
    				}
    			}

    			tokenSpotsText = tokenSpotsText.substring(0, tokenSpotsText.length-1);
    			shipSpotsText = shipSpotsText.substring(0, shipSpotsText.length-1);

    			//var shipSpots = [[321,321]] // G.GV.regions[i].shipGraphics.shipSpots;
    			//var shipSpotsText = '';
    			// for (var k = 0; k < shipSpots.length; k++) {
    			// shipSpotsText += coord(shipSpots[k].sprite.x, shipSpots[k].sprite.y) + (k < shipSpots.length-1 ? ',' : '');
    			// }

    			text += quote('region_' + G.GV.regions[i].regionID) 								+ ': {' + NL;
    			text += quote('regionID') 	+ ':' + G.GV.regions[i].regionID 						+ CNL;
    			text += quote('name') 		+ ':' + quote(G.GV.regions[i].name) 					+ CNL;
    			text += quote('food') 		+ ':' + G.GV.regions[i].food		 					+ CNL;
    			text += quote('citySite') 	+ ':' + G.GV.regions[i].citySite		 				+ CNL;
    			text += quote('floodType') 	+ ':' + G.GV.regions[i].floodType		 				+ CNL;
    			text += quote('landConn')	+ ':' + this.stringArrayDefText(G.GV.regions[i].landConn) 	+ CNL;
    			text += quote('seaConn')	+ ':' + this.stringArrayDefText(G.GV.regions[i].seaConn) 	+ CNL;
    			text += quote('tokenSize')	+ ':' + quote(G.GV.regions[i].tokenSize)	 			+ CNL;
    			text += quote('iconXY') 	+ ':' + foodXY 										+ CNL;
    			text += quote('cityXY') 	+ ':' + cityXY										+ CNL;
    			text += quote('tokenSpots') + ':' + '['+tokenSpotsText+']'						+ CNL;
    			text += quote('shipSpots') 	+ ':' + '['+shipSpotsText+']'						+ NL;
    			text += (i < G.GV.regions.length-1 ? '},' : '}') + NL;
    		}
    	}
    	text += '}' + NL;
    	G.console.downloadText(text, 'export.txt', 'text/plain');
    }
}
