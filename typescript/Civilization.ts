class Civilization {
	civID : number;
	name: string;
	adjName: string;
	isInGame: boolean;
	tokenLimit: number;
	shipLimit: number;
	cityLimit: number;
	stock: UnitGroup;
	treasury: UnitGroup;

	constructor(civdata)
	{
		this.civID = civdata[0];		// CARTHAGE
		this.name = civdata[1];				// "Carthage"
		this.adjName = civdata[2];			// "Carthaginian"
		this.isInGame = civdata[3];			// don't bother making units, etc if false

		this.tokenLimit = G.tokenLimit;
		this.shipLimit = G.shipLimit;
		this.cityLimit = G.cityLimit;

		this.stock = new UnitGroup();
		this.treasury = new UnitGroup();

		for(var i = 0; i < this.tokenLimit; i++)
		{
			this.stock.push(new Token(this));
		}


	}

	// // constants
	// NONE = 0;
	// MINOA = 1;
	// SABA = 2;
	// CELTS = 3;
	// ASSYRIA = 4;
	// ROME = 5;
	// BABYLON = 6;
	// CARTHAGE = 7;
	// HELLAS = 8;
	// NUBIA = 9;
	// HATTI = 10;
	// IBERIA = 11;
	// EGYPT = 12;
	// BARBARIANS = 13;
	// PIRATES = 14;

	// Region.LAND = 0;
	// Region.COAST = 1;
	// Region.SEA = 2;

		// UNIT = 0;
		// SHIP = 1;
		// CITY = 2;
}

class UnitGroup {
	tokens: Array<Token>;
	ships: Array<Ship>;
	currentCity: number;

	constructor() {
		this.tokens = [];
 		this.ships = [];
 	// 	this.currentCity = Civilization.prototype.NONE;
	}

	length() {
		return this.tokens.length;
	}

	push(obj) {
		this.tokens.push(obj)
	}

	moveToGroup(qty, toGroup) {
		var q = qty;
		for(var t = 0; (q > 0) && (t < this.tokens.length); t++)
		{
			toGroup.push(this.tokens[t]);
			q--;

			this.tokens.splice(t, 1);
			t--;
		}
	}


	moveToGroupByCiv(cID, qty,toGroup) {
		var q = qty;
		for(var t = 0; (q > 0) && (t < this.tokens.length); t++)
		{
			if(this.tokens[t].civ.civID === cID)
			{
				toGroup.push(this.tokens[t]);
				q--;

				this.tokens.splice(t, 1);
				t--;
			}
		}
	}


	pull(qty) {
		var q = qty;
		var pull = [];
		for(var t = 0; (q > 0) && (t < this.tokens.length); t++)
		{
			pull.push(this.tokens[t]);
			q--;
		}
		return pull;
	}


	pullByCiv(cID, qty) {
		var q = qty;
		var pull = [];
		for(var t = 0; (q > 0) && (t < this.tokens.length); t++)
		{
			if(this.tokens[t].civ.civID === cID)
			{
				pull.push(this.tokens[t]);
				q--;
			}
		}
		return pull;
	}

}




class Token {
	civ: Civilization;
	movesLeft: number;

	constructor(civ) {
		this.civ = civ;
		this.movesLeft = 0;
	}

}




class Ship {
	civ: Civilization;
	movesLeft: number;
	containsTokens: Array<Token>;

	constructor(civ) {
		this.civ = civ;
		this.containsTokens = [];
		this.movesLeft = 0;
	}

	addToken(t) {
		this.containsTokens.push(t);
	}
}
