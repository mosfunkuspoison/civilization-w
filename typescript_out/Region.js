var Region = (function () {
    function Region(regionID, name, food, floodType, citySite, landConn, seaConn, tokenSize, iconXY, cityXY, tokenSpots, shipSpots) {
        this.regionID = regionID;
        this.name = name;
        this.food = food;
        this.floodType = floodType;
        this.citySite = citySite;
        this.landConn = landConn;
        this.seaConn = seaConn;
        this.tokenSize = tokenSize;
        this.units = new UnitGroup();
        this.regionGraphic = new RegionGraphic(this, iconXY[0], iconXY[1], this.tokenSize);
        this.tokenGraphics = new TokenGraphics(this, 0, this.tokenSize, tokenSpots);
        this.shipGraphics = new TokenGraphics(this, 1, this.tokenSize, shipSpots);
        this.cityGraphic = new CityGraphic(this, cityXY[0], cityXY[1], this.tokenSize);
    }
    Region.prototype.addFromStock = function (qty, cID) {
        var civ = findCivByID(G.GV.civs, cID);
        if (civ.stock.length() >= qty) {
            civ.stock.moveToGroup(qty, this.units);
        }
    };
    Region.prototype.updateGraphics = function () {
        this.tokenGraphics.update();
        this.shipGraphics.update();
        this.cityGraphic.update();
        this.regionGraphic.update();
    };
    Region.prototype.isLandNeighbor = function (reg2) {
        return arrayContains(this.landConn, reg2.name);
    };
    Region.prototype.isSeaNeighbor = function (reg2) {
        return arrayContains(this.seaConn, reg2.name);
    };
    Region.prototype.toString = function () {
        return '[Region: ' + this.regionID + ',' + this.name + ']';
    };
    Region.prototype.placeTokenSpot = function () {
        if (G.builder.enabled) {
            this.tokenGraphics.addSpot();
        }
    };
    Region.prototype.placeShipSpot = function () {
        if (G.builder.enabled) {
            this.shipGraphics.addSpot();
        }
    };
    Region.prototype.changeSize = function () {
        if (G.builder.enabled) {
            if (this.tokenSize == "normal")
                this.tokenSize = "small";
            else if (this.tokenSize == "small")
                this.tokenSize = "normal";
            this.tokenGraphics.changeSize();
            this.shipGraphics.changeSize();
        }
    };
    return Region;
}());
function findRegByName(rlist, n) {
    for (var e = 0; e < rlist.length; e++) {
        if (n === rlist[e].name) {
            return rlist[e];
        }
    }
    return null;
}
function findRegByID(rlist, rid) {
    for (var e = 0; e < rlist.length; e++) {
        if (rid === rlist[e].regionID) {
            return rlist[e];
        }
    }
    return null;
}
function findCivByID(civList, id) {
    for (var e = 0; e < civList.length; e++) {
        if (id === civList[e].civID) {
            return civList[e];
        }
    }
    return null;
}
