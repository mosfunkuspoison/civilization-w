class Region
{
	regionID : number;
	name : string;
	food : number;
	floodType : number;
	citySite : number;
	landConn: Array<string>;
	seaConn : Array<string>;
	tokenSize: string;
	units : UnitGroup;
	regionGraphic: RegionGraphic;
	tokenGraphics: TokenGraphics;
	shipGraphics: TokenGraphics;
	cityGraphic : CityGraphic;

	constructor(regionID, name, food, floodType, citySite, landConn, seaConn, tokenSize, iconXY, cityXY, tokenSpots, shipSpots) {
		this.regionID = regionID;
		this.name = name;
		this.food = food;
		this.floodType = floodType;
		this.citySite = citySite;
		this.landConn = landConn;
		this.seaConn = seaConn;
		this.tokenSize = tokenSize;

		this.units = new UnitGroup();

		this.regionGraphic = new RegionGraphic(this, iconXY[0], iconXY[1], this.tokenSize); // x and y (numbers)
		this.tokenGraphics = new TokenGraphics(this, 0, this.tokenSize, tokenSpots);
		this.shipGraphics = new TokenGraphics(this, 1,  this.tokenSize, shipSpots);
		this.cityGraphic = new CityGraphic(this, cityXY[0], cityXY[1], this.tokenSize);
	}

	addFromStock (qty, cID) {
		var civ = findCivByID(G.GV.civs, cID);
		if(civ.stock.length() >= qty) {
			civ.stock.moveToGroup(qty, this.units);
		}
	}

	updateGraphics () {
		this.tokenGraphics.update();
		this.shipGraphics.update();
		this.cityGraphic.update();
		this.regionGraphic.update();
	}

	isLandNeighbor (reg2) {
		return arrayContains(this.landConn, reg2.name)
	}

	isSeaNeighbor (reg2) {
		return arrayContains(this.seaConn, reg2.name)
	}

	toString () {
		return '[Region: ' + this.regionID + ',' + this.name + ']';
	}

	placeTokenSpot() {
		if(G.builder.enabled) {
			this.tokenGraphics.addSpot();
		}
	}

	placeShipSpot() {
		if(G.builder.enabled) {
			this.shipGraphics.addSpot();
		}
	}

	changeSize () {
		if(G.builder.enabled) {
			if(this.tokenSize == "normal")
				this.tokenSize = "small";
			else if(this.tokenSize == "small")
				this.tokenSize = "normal";
			this.tokenGraphics.changeSize();
			this.shipGraphics.changeSize();
		}
	}

}

// findByName([Region], string) -> Region
function findRegByName(rlist, n) {
    for (var e = 0; e < rlist.length; e++) {
        if (n === rlist[e].name) { return rlist[e]; }
    }
    return null;
}

// regionByID([Region], number) -> Region
function findRegByID(rlist, rid) {
    for (var e = 0; e < rlist.length; e++) {
        if (rid === rlist[e].regionID) { return rlist[e]; }
    }
    return null;
}

// civByID([Civilization], number) -> Civilization
function findCivByID(civList, id) {
    for (var e = 0; e < civList.length; e++) {
        if (id === civList[e].civID) { return civList[e]; }
    }
    return null;
}
