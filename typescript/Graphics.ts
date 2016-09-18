
class TokenGraphics {
	P : Region;
	type: string;
	tokenSpots: Array<TokenSpot>;

	constructor(P, type, size, spots) {
		this.P = P;
		this.type = type;
		this.tokenSpots = [];
		for (var e = 0; e < spots.length; e++) {
			this.tokenSpots.push(new TokenSpot(this, this.type, spots[e][0],spots[e][1], this.P.tokenSize, e));
		}
	}

	update() {
		for(var i = 0; i < this.tokenSpots.length; i++) {
			this.tokenSpots[i].update();
		}
	}

	changeSize() {
		for(var i = 0; i < this.tokenSpots.length; i++) {
			this.tokenSpots[i].changeSize();
		}
	}

	addSpot() {
		this.tokenSpots.push( new TokenSpot(this, this.type, this.P.regionGraphic.sprite.x+20,
			this.P.regionGraphic.sprite.y+20, this.P.tokenSize, this.tokenSpots.length));
	}

}

/////////////////////////////////////////////////////////////////////////////////////////////

class TokenSpot {
	P: TokenGraphics;
	idx : number;     // index within the region
	sprite : Phaser.Button;
	size: string;
	type : number;
	ctrText: Phaser.BitmapText;
	dispCiv: number;
	dispQty: number;

	constructor(P, type, x, y, size, idx) {
		this.P = P;
		this.idx = idx;     // index within the region
		this.sprite = null;
		this.size = size;
		this.type = type;
		this.dispCiv = 1; 								// initally empty
		this.dispQty = this.idx;           // initially zero
		this.makeSprite(x,y);
		this.update();
	}

	makeSprite(x,y) {
			var k;
			if(this.type == 0 && this.size == "normal") k = 'tokens';
			if(this.type == 0 && this.size == "small") k = 'tokens_small';
			if(this.type == 1) k = 'ships';

			this.sprite = G.game.add.button(x,y,k,this.clickAction, this, 1,1,1,1);
			this.ctrText = G.game.add.bitmapText(x, y, 'carrier_command','  ',10);
			this.setSpriteByCiv(this.dispCiv);
			this.setCounter(this.dispQty);

			this.sprite.inputEnabled = true;

			if (G.buildModeOn) {
				this.sprite.input.enableDrag(true);
			}
	}

	setCounter(c) {
		//if(this.type == 0) {
			if(c < 0) this.ctrText.text = "-X";
			//if(c == 0 || c == 1) this.ctrText.text = "  ";
			if(c >= 0 && c < 10) this.ctrText.text = ' ' + c;
			if(c > 10) this.ctrText.text = '' + c;
		//}
	}

	setSpriteByCiv(civID) {
		this.sprite.setFrames(civID,civID,civID,civID);
		//this.sprite.setFrame(civID);
	}

	clickAction(obj) {
		if (G.buildModeOn) {
			this.P.P.regionGraphic.updateConnectionLines();
			G.buildModeTokenSpot = this;
		}
		this.update();
		G.console.println(this.toString());
	}

	deleteTokenSpot() {
		if(G.buildModeOn) {
			G.buildModeTokenSpot.sprite.x = -1000;
			G.buildModeTokenSpot.sprite.y = -1000;
		}
	}

	update() {
		this.sprite.update();
		this.syncText();
	}

	syncText() {
		var offset;// = [8,20];
		if(this.type == 0 && this.size == "normal") offset = [8,20];
		if(this.type == 0 && this.size == "small") offset = [-8,3];
		if(this.type == 1) offset = [20,20];
		this.ctrText.x = this.sprite.x + offset[0];
		this.ctrText.y = this.sprite.y + offset[1];
	}

	changeSize() {
		if(this.type == 0) {
			if(this.size == "normal") {
				this.size = "small";
				this.sprite.x += 8;
				this.sprite.y += 8;
				this.sprite.key = "tokens_small";
				this.sprite.loadTexture("tokens_small", this.sprite.frame);
				this.syncText();
			}
			else if(this.size == "small") {
				this.size = "normal";
				this.sprite.x -= 8;
				this.sprite.y -= 8;
				this.sprite.key = "tokens";
				this.sprite.loadTexture("tokens", this.sprite.frame);
				this.syncText();
			}
		}
	}

}

/////////////////////////////////////////////////////////////////////////////////////////////
class CityGraphic {

	P: Region;
	sprite: Phaser.Button;
	tokenSize: string;

	constructor(P, x, y, tokenSize) {
		this.P = P; // reference to the region that this object belongs to
		this.sprite = null;
		this.makeSprite(x,y);
		this.tokenSize = tokenSize;
	}

	makeSprite(x,y) {
		this.sprite = G.game.add.button(x, y, 'cities', null, this, 1,1,1,1 );

		this.sprite.inputEnabled = true;

		if (G.buildModeOn) {
			this.sprite.input.enableDrag(true);
			this.sprite.events.onDragStop.add(this.onDragStop, this);
		}
	}

	update() {
		if (G.buildModeOn) {
			this.P.regionGraphic.updateConnectionLines();
			//G.buildModeTokenSpot = this;
		}
	}

	onDragStop() {
		this.update();
	}

}

/////////////////////////////////////////////////////////////////////////////////////////////
class RegionGraphic {

	P: Region;
	sprite: Phaser.Button;
	tokenSize: string;

	constructor(P,x,y,size) {
		this.P = P; // reference to the region that this object belongs to
		this.sprite = null;
		this.tokenSize = size;
		this.makeSprite(x,y);
	}

	makeSprite(x,y) {
		this.sprite = G.game.add.button(x, y, 'pop', this.clickAction, this,
			this.P.food+1,this.P.food+1,this.P.food+1,this.P.food+1 );

		this.sprite.inputEnabled = true;

		if (G.buildModeOn) {
			this.sprite.input.enableDrag(true);
			this.sprite.events.onDragStop.add(this.onDragStop, this);
		}
	}

	clickAction(obj) {
		G.console.println("[RegionGraphic: " + this.P.name + " " + this.sprite.x + "," + this.sprite.y + "]");

		G.gfxHandler.drawRect(this.sprite.x + 20, this.sprite.y - 20, 100, 20, 0xCCCCCC, 0x000044);

		if(G.buildModeOn) {
			if(G.seaConnBuildOn) // if this is true, a region has already been clicked and then "started"
			{
				G.newConnList.push(this.P.name);
				this.P.seaConn.push(G.buildModeRegion.name);
				G.bmregionNameElement.innerHTML = "Land Connection #" + G.newConnList.length +" : " + G.buildModeRegion.name + " -> " + this.P.name;
			}
			else {
				G.buildModeRegion = this.P;
				G.bmregionNameElement.innerHTML = "Selected Region: " + this.P.name;
			}
		}
		this.update();
	}


	update() {
		if (G.buildModeOn) {
			this.updateConnectionLines();
		}
	}

	onDragStop() {
		this.update();
	}

	updateConnectionLines() {
		G.gfxHandler.clearGraphics();

		// Token Spots
		var spots = this.P.tokenGraphics.tokenSpots;
		for (var f = 0; f < spots.length; f++)
		{
			if (spots[f].sprite.x >= 0 && spots[f].sprite.y >= 0) {
				G.gfxHandler.drawLine(this.sprite.x + 10,this.sprite.y + 10,	spots[f].sprite.x + 16,	spots[f].sprite.y + 16,	2, 0xBBBBBB);
			}
		}

		spots = this.P.shipGraphics.tokenSpots;
		for (var f = 0; f < spots.length; f++)
		{
			if (spots[f].sprite.x >= 0 && spots[f].sprite.y >= 0) {
				G.gfxHandler.drawLine(this.sprite.x + 10,this.sprite.y + 10,	spots[f].sprite.x + 16,	spots[f].sprite.y + 16,	2, 0xBBBBBB);
			}
		}

		var citySpr = this.P.cityGraphic.sprite;
		if (citySpr.x >= 0 && citySpr.y >= 0) {
			G.gfxHandler.drawLine(this.sprite.x+10,this.sprite.y+10,citySpr.x+16,citySpr.y+16,2,0x44DD44);
		}
		var regTemp, reg2;

		// Land Connections

		for (var fl = 0; fl < this.P.landConn.length; fl++)
		{
			regTemp = findRegByName(G.regions, this.P.landConn[fl])
			if(regTemp != null)
			{
				reg2 = regTemp.regionGraphic;
				G.gfxHandler.drawLine(this.sprite.x+10,this.sprite.y+10, reg2.sprite.x+15, reg2.sprite.y+15, 2, 0xAA33FF);
			}
		}
		// Sea Connections
		for (var fs = 0; fs < this.P.seaConn.length; fs++)
		{
			regTemp = findRegByName(G.regions, this.P.seaConn[fs])
			if(regTemp != null)
			{
				reg2 = regTemp.regionGraphic;
				G.gfxHandler.drawLine(this.sprite.x+10,this.sprite.y+10, reg2.sprite.x+15, reg2.sprite.y+5, 2, 0x22FFFF);
			}
		}
	}
}
