var Civilization = (function () {
    function Civilization(civdata) {
        this.civID = civdata[0];
        this.name = civdata[1];
        this.adjName = civdata[2];
        this.isInGame = civdata[3];
        this.tokenLimit = G.tokenLimit;
        this.shipLimit = G.shipLimit;
        this.cityLimit = G.cityLimit;
        this.stock = new UnitGroup();
        this.treasury = new UnitGroup();
        for (var i = 0; i < this.tokenLimit; i++) {
            this.stock.push(new Token(this));
        }
    }
    return Civilization;
}());
var UnitGroup = (function () {
    function UnitGroup() {
        this.tokens = [];
        this.ships = [];
    }
    UnitGroup.prototype.length = function () {
        return this.tokens.length;
    };
    UnitGroup.prototype.push = function (obj) {
        this.tokens.push(obj);
    };
    UnitGroup.prototype.moveToGroup = function (qty, toGroup) {
        var q = qty;
        for (var t = 0; (q > 0) && (t < this.tokens.length); t++) {
            toGroup.push(this.tokens[t]);
            q--;
            this.tokens.splice(t, 1);
            t--;
        }
    };
    UnitGroup.prototype.moveToGroupByCiv = function (cID, qty, toGroup) {
        var q = qty;
        for (var t = 0; (q > 0) && (t < this.tokens.length); t++) {
            if (this.tokens[t].civ.civID === cID) {
                toGroup.push(this.tokens[t]);
                q--;
                this.tokens.splice(t, 1);
                t--;
            }
        }
    };
    UnitGroup.prototype.pull = function (qty) {
        var q = qty;
        var pull = [];
        for (var t = 0; (q > 0) && (t < this.tokens.length); t++) {
            pull.push(this.tokens[t]);
            q--;
        }
        return pull;
    };
    UnitGroup.prototype.pullByCiv = function (cID, qty) {
        var q = qty;
        var pull = [];
        for (var t = 0; (q > 0) && (t < this.tokens.length); t++) {
            if (this.tokens[t].civ.civID === cID) {
                pull.push(this.tokens[t]);
                q--;
            }
        }
        return pull;
    };
    return UnitGroup;
}());
var Token = (function () {
    function Token(civ) {
        this.civ = civ;
        this.movesLeft = 0;
    }
    return Token;
}());
var Ship = (function () {
    function Ship(civ) {
        this.civ = civ;
        this.containsTokens = [];
        this.movesLeft = 0;
    }
    Ship.prototype.addToken = function (t) {
        this.containsTokens.push(t);
    };
    return Ship;
}());
