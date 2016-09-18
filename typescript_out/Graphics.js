var TokenGraphics = (function () {
    function TokenGraphics(P, type, size, spots) {
        this.P = P;
        this.type = type;
        this.tokenSpots = [];
        for (var e = 0; e < spots.length; e++) {
            this.tokenSpots.push(new TokenSpot(this, this.type, spots[e][0], spots[e][1], this.P.tokenSize, e));
        }
    }
    TokenGraphics.prototype.update = function () {
        for (var i = 0; i < this.tokenSpots.length; i++) {
            this.tokenSpots[i].update();
        }
    };
    TokenGraphics.prototype.changeSize = function () {
        for (var i = 0; i < this.tokenSpots.length; i++) {
            this.tokenSpots[i].changeSize();
        }
    };
    TokenGraphics.prototype.addSpot = function () {
        this.tokenSpots.push(new TokenSpot(this, this.type, this.P.regionGraphic.sprite.x + 20, this.P.regionGraphic.sprite.y + 20, this.P.tokenSize, this.tokenSpots.length));
    };
    return TokenGraphics;
}());
var TokenSpot = (function () {
    function TokenSpot(P, type, x, y, size, idx) {
        this.P = P;
        this.idx = idx;
        this.sprite = null;
        this.size = size;
        this.type = type;
        this.dispCiv = 1;
        this.dispQty = this.idx;
        this.makeSprite(x, y);
        this.update();
    }
    TokenSpot.prototype.makeSprite = function (x, y) {
        var k;
        if (this.type == 0 && this.size == "normal")
            k = 'tokens';
        if (this.type == 0 && this.size == "small")
            k = 'tokens_small';
        if (this.type == 1)
            k = 'ships';
        this.sprite = G.game.add.button(x, y, k, this.clickAction, this, 1, 1, 1, 1);
        this.ctrText = G.game.add.bitmapText(x, y, 'carrier_command', '  ', 10);
        this.setSpriteByCiv(this.dispCiv);
        this.setCounter(this.dispQty);
        this.sprite.inputEnabled = true;
        if (G.buildModeOn) {
            this.sprite.input.enableDrag(true);
        }
    };
    TokenSpot.prototype.setCounter = function (c) {
        if (c < 0)
            this.ctrText.text = "-X";
        if (c >= 0 && c < 10)
            this.ctrText.text = ' ' + c;
        if (c > 10)
            this.ctrText.text = '' + c;
    };
    TokenSpot.prototype.setSpriteByCiv = function (civID) {
        this.sprite.setFrames(civID, civID, civID, civID);
    };
    TokenSpot.prototype.clickAction = function (obj) {
        if (G.buildModeOn) {
            this.P.P.regionGraphic.updateConnectionLines();
            G.buildModeTokenSpot = this;
        }
        this.update();
        G.console.println(this.toString());
    };
    TokenSpot.prototype.deleteTokenSpot = function () {
        if (G.buildModeOn) {
            G.buildModeTokenSpot.sprite.x = -1000;
            G.buildModeTokenSpot.sprite.y = -1000;
        }
    };
    TokenSpot.prototype.update = function () {
        this.sprite.update();
        this.syncText();
    };
    TokenSpot.prototype.syncText = function () {
        var offset;
        if (this.type == 0 && this.size == "normal")
            offset = [8, 20];
        if (this.type == 0 && this.size == "small")
            offset = [-8, 3];
        if (this.type == 1)
            offset = [20, 20];
        this.ctrText.x = this.sprite.x + offset[0];
        this.ctrText.y = this.sprite.y + offset[1];
    };
    TokenSpot.prototype.changeSize = function () {
        if (this.type == 0) {
            if (this.size == "normal") {
                this.size = "small";
                this.sprite.x += 8;
                this.sprite.y += 8;
                this.sprite.key = "tokens_small";
                this.sprite.loadTexture("tokens_small", this.sprite.frame);
                this.syncText();
            }
            else if (this.size == "small") {
                this.size = "normal";
                this.sprite.x -= 8;
                this.sprite.y -= 8;
                this.sprite.key = "tokens";
                this.sprite.loadTexture("tokens", this.sprite.frame);
                this.syncText();
            }
        }
    };
    return TokenSpot;
}());
var CityGraphic = (function () {
    function CityGraphic(P, x, y, tokenSize) {
        this.P = P;
        this.sprite = null;
        this.makeSprite(x, y);
        this.tokenSize = tokenSize;
    }
    CityGraphic.prototype.makeSprite = function (x, y) {
        this.sprite = G.game.add.button(x, y, 'cities', null, this, 1, 1, 1, 1);
        this.sprite.inputEnabled = true;
        if (G.buildModeOn) {
            this.sprite.input.enableDrag(true);
            this.sprite.events.onDragStop.add(this.onDragStop, this);
        }
    };
    CityGraphic.prototype.update = function () {
        if (G.buildModeOn) {
            this.P.regionGraphic.updateConnectionLines();
        }
    };
    CityGraphic.prototype.onDragStop = function () {
        this.update();
    };
    return CityGraphic;
}());
var RegionGraphic = (function () {
    function RegionGraphic(P, x, y, size) {
        this.P = P;
        this.sprite = null;
        this.tokenSize = size;
        this.makeSprite(x, y);
    }
    RegionGraphic.prototype.makeSprite = function (x, y) {
        this.sprite = G.game.add.button(x, y, 'pop', this.clickAction, this, this.P.food + 1, this.P.food + 1, this.P.food + 1, this.P.food + 1);
        this.sprite.inputEnabled = true;
        if (G.buildModeOn) {
            this.sprite.input.enableDrag(true);
            this.sprite.events.onDragStop.add(this.onDragStop, this);
        }
    };
    RegionGraphic.prototype.clickAction = function (obj) {
        G.console.println("[RegionGraphic: " + this.P.name + " " + this.sprite.x + "," + this.sprite.y + "]");
        G.gfxHandler.drawRect(this.sprite.x + 20, this.sprite.y - 20, 100, 20, 0xCCCCCC, 0x000044);
        if (G.buildModeOn) {
            if (G.seaConnBuildOn) {
                G.newConnList.push(this.P.name);
                this.P.seaConn.push(G.buildModeRegion.name);
                G.bmregionNameElement.innerHTML = "Land Connection #" + G.newConnList.length + " : " + G.buildModeRegion.name + " -> " + this.P.name;
            }
            else {
                G.buildModeRegion = this.P;
                G.bmregionNameElement.innerHTML = "Selected Region: " + this.P.name;
            }
        }
        this.update();
    };
    RegionGraphic.prototype.update = function () {
        if (G.buildModeOn) {
            this.updateConnectionLines();
        }
    };
    RegionGraphic.prototype.onDragStop = function () {
        this.update();
    };
    RegionGraphic.prototype.updateConnectionLines = function () {
        G.gfxHandler.clearGraphics();
        var spots = this.P.tokenGraphics.tokenSpots;
        for (var f = 0; f < spots.length; f++) {
            if (spots[f].sprite.x >= 0 && spots[f].sprite.y >= 0) {
                G.gfxHandler.drawLine(this.sprite.x + 10, this.sprite.y + 10, spots[f].sprite.x + 16, spots[f].sprite.y + 16, 2, 0xBBBBBB);
            }
        }
        spots = this.P.shipGraphics.tokenSpots;
        for (var f = 0; f < spots.length; f++) {
            if (spots[f].sprite.x >= 0 && spots[f].sprite.y >= 0) {
                G.gfxHandler.drawLine(this.sprite.x + 10, this.sprite.y + 10, spots[f].sprite.x + 16, spots[f].sprite.y + 16, 2, 0xBBBBBB);
            }
        }
        var citySpr = this.P.cityGraphic.sprite;
        if (citySpr.x >= 0 && citySpr.y >= 0) {
            G.gfxHandler.drawLine(this.sprite.x + 10, this.sprite.y + 10, citySpr.x + 16, citySpr.y + 16, 2, 0x44DD44);
        }
        var regTemp, reg2;
        for (var fl = 0; fl < this.P.landConn.length; fl++) {
            regTemp = findRegByName(G.regions, this.P.landConn[fl]);
            if (regTemp != null) {
                reg2 = regTemp.regionGraphic;
                G.gfxHandler.drawLine(this.sprite.x + 10, this.sprite.y + 10, reg2.sprite.x + 15, reg2.sprite.y + 15, 2, 0xAA33FF);
            }
        }
        for (var fs = 0; fs < this.P.seaConn.length; fs++) {
            regTemp = findRegByName(G.regions, this.P.seaConn[fs]);
            if (regTemp != null) {
                reg2 = regTemp.regionGraphic;
                G.gfxHandler.drawLine(this.sprite.x + 10, this.sprite.y + 10, reg2.sprite.x + 15, reg2.sprite.y + 5, 2, 0x22FFFF);
            }
        }
    };
    return RegionGraphic;
}());
