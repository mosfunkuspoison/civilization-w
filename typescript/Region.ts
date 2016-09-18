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
		var civ = findCivByID(G.civs, cID);
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
		if(G.buildModeOn) {
			this.tokenGraphics.addSpot();
		}
	}

	placeShipSpot() {
		if(G.buildModeOn) {
			this.shipGraphics.addSpot();
		}
	}

	changeSize () {
		if(G.buildModeOn) {
			if(this.tokenSize == "normal")
				this.tokenSize = "small";
			else if(this.tokenSize == "small")
				this.tokenSize = "normal";
			this.tokenGraphics.changeSize();
			this.shipGraphics.changeSize();
		}
	}

}
