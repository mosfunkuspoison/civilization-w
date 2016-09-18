declare function zebraStart(_EUI);

var SW = {
    	drawLayer:       {obj:null, type:"checkbox", active:true, v:true, label:"drawLayer"},
    	cameraDrag:      {obj:null, type:"checkbox", active:true, v:true, label:"cameraDrag"},
    	buildMode:       {obj:null, type:"checkbox", active:true, v:true, label:"buildMode"},
    	buildLandConn:   {obj:null, type:"checkbox", active:true, v:false, label:"landConnBuild"},
        buildSeaConn:    {obj:null, type:"checkbox", active:true, v:false,  label:"seaConnBuild"},
        buildingRegion:  {obj:null, obj2:null, type:"textfield",active:false, v:"",     label:"Building Region"},
        buttonnn:        {obj:null, obj2:null, type:"button",   active:true, v:"Button thing"},
        consoleLabel:    {obj:null, type:"label",    active:true, v:"Console Output:"},
        consoleOutput:   {obj:null, type:"multitext",active:true, v:"Console Output"}
};

var G = {
    regionListJSON: null,
    game: null,
    main_canvas: document.getElementById("main_canvas"),
    canvasDims: [1380, 780],
    zebraCanvas: document.getElementById("zebra_canvas"),
    zebraEnabled: true,
    keys: null,
    console: null,
    mcamera: null,
    regions: [],
    civs: [],
    tokenLimit: 55,
    shipLimit: 4,
    cityLimit: 9,
    gfxHandler: null,
    dataHandler: null,
    buildModeRegion: null,
    newConnList: [],
    buildModeTokenSpot: null,
    // x
    regionNameElement: <HTMLInputElement>document.getElementById("rname_text"),
    bmregionNameElement: <HTMLInputElement>document.getElementById("rname_buildmoderegion"),
    buildModeOn: true,
    drawLayerOn: true,
    cameraDragOn: true,
    landConnBuildOn: false,
    seaConnBuildOn: false
};

window.onload = function() {
    var gm = new PhaserCivApp();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            G.regionListJSON = JSON.parse(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", "regionData.json", true);
    xmlhttp.send();
}

class PhaserCivApp {
    constructor() {
        G.zebraCanvas.hidden = false;
        if (G.zebraEnabled) {
            zebraStart(SW);
        }
        G.game = new Phaser.Game(G.canvasDims[0], G.canvasDims[1], Phaser.AUTO, 'main_canvas');
        G.game.state.add("GameRunningState", GameRunningState, false);
        G.game.state.start("GameRunningState", true, true);
    }
}

class GameRunningState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.game.load.image('mapSectionA', 'assets/NewCivmapSectionA.png');
        this.game.load.spritesheet('pop', 'assets/foodIcons.png', 20, 20, 7);
        //game.load.spritesheet('switch', 'assets/switch120_30.png', 60,30,3);
        this.game.load.spritesheet('tokens', 'assets/tokens.png', 32, 32, 4);
        this.game.load.spritesheet('cities', 'assets/cities.png', 32, 32, 4);
        this.game.load.spritesheet('tokens_small', 'assets/tokens_small.png', 16, 16, 4);
        this.game.load.spritesheet('ships', 'assets/ships.png', 50, 32, 4);
        //game.load.image('switchboard', 'assets/switchboard.png');
        this.game.stage.backgroundColor = '#337799';
        this.game.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
    }

    create() {
        G.console = new Consoler(document.getElementById("messages"), 30, 80);

        this.game.world.setBounds(0, 0, 6201, 2865);
        var mainMap = this.game.add.sprite(0, 0, 'mapSectionA');
        G.gfxHandler = new GraphicsHandler();
        G.dataHandler = new DataHandler();
        this.initKeys();
        //findByName(G.regions,"Londinium").addFromStock(7, Civilization.ASSYRIA);
    }

    update() {
        G.gfxHandler.graphics.clear();

        if (SW.drawLayer.v) {
            G.gfxHandler.drawGraphics();
        }

        if (G.cameraDragOn) {
            G.gfxHandler.move_camera_by_pointer(this.game.input.mousePointer);
            G.gfxHandler.move_camera_by_pointer(this.game.input.pointer1);
        }
    }

    render() {
        //game.debug.cameraInfo(game.camera, 16, 16);
        //game.debug.pointer(game.input.mousePointer, false)
    }

    initKeys() {
        G.keys = {
            num0: this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO),
            num1: this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),
            num2: this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),
            num3: this.game.input.keyboard.addKey(Phaser.Keyboard.THREE),
            num4: this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
            num5: this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE),
            num6: this.game.input.keyboard.addKey(Phaser.Keyboard.SIX),
            num8: this.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT),
            num9: this.game.input.keyboard.addKey(Phaser.Keyboard.NINE),
            z: this.game.input.keyboard.addKey(Phaser.Keyboard.Z),
            d: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        G.keys.num1.onDown.add(placeTokenSpot, this);
        G.keys.num2.onDown.add(placeShipSpot, this);
        G.keys.num3.onDown.add(placeRegion, this);
        //G.keys.num4.onDown.add(placeCity, this);
        G.keys.num5.onDown.add(changeSize, this);
        G.keys.num6.onDown.add(deleteTokenSpot, this);
        G.keys.num8.onDown.add(startLandConnList, this);
        G.keys.num9.onDown.add(finishLandConnList, this);
        G.keys.num0.onDown.add(G.dataHandler.exportGameData, this);
        G.keys["z"].onDown.add(function() {
            if (G.zebraEnabled) {
                G.zebraCanvas.hidden = !G.zebraCanvas.hidden;
                //G.game.paused = G.zebraCanvas.hidden;
            }
        }, this);

        G.keys["d"].onDown.add(function() {
            console.log("**** debug key pressed");
            console.log(SW.drawLayer.v);
        }, this);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMouse() {
    return [this.game.input.mousePointer.position.x + this.game.camera.x,
        this.game.input.mousePointer.position.y + this.game.camera.y];
}

// BUILD mode functions /////////////////////////////////////////////////////////////////////////////////////////

function placeRegion() {
    if (G.buildModeOn) {
        console.log("place region:" + G.regionNameElement.value);
        G.buildModeRegion = new Region(G.regions.length + 1, G.regionNameElement.value, -1, 0, 0, [], [], "normal", this.getMouse(), [], [], []);
        G.regionNameElement.value = "";
        G.bmregionNameElement.innerHTML = "Selected Region: " + G.buildModeRegion.name;
        G.regions.push(G.buildModeRegion);
    }
}

function placeTokenSpot() {
    if (G.buildModeRegion && G.buildModeOn) {
        G.buildModeRegion.addSpot(0);
    }
}

function placeShipSpot() {
    if (G.buildModeRegion && G.buildModeOn) {
        G.buildModeRegion.addSpot(1);
    }
}

function deleteTokenSpot() { // moves the token spot to a large negative value, which will delete it when saved
    if (G.buildModeTokenSpot && G.buildModeOn) {
        G.buildModeTokenSpot.sprite.x = -1000;
        G.buildModeTokenSpot.sprite.y = -1000;
    }
}

function changeSize() {
    if (G.buildModeRegion && G.buildModeOn) {
        G.buildModeRegion.changeSize();
        console.log(G.buildModeRegion.toString() + "    size: " + G.buildModeRegion.tokenSize);
    }
}

function startSeaConnList() {
    if (G.buildModeOn && !G.seaConnBuildOn) {
        G.seaConnBuildOn = true;
        G.newConnList = [];
        G.bmregionNameElement.innerHTML = "Building sea conn's for region: " + G.buildModeRegion.name;
    }
}

function startLandConnList() {
    if (G.buildModeOn && !G.seaConnBuildOn) {
        G.seaConnBuildOn = true;
        G.newConnList = [];
        G.bmregionNameElement.innerHTML = "Building sea conn's for region: " + G.buildModeRegion.name;
    }
}

function finishSeaConnList() {
    if (G.buildModeOn && G.seaConnBuildOn) {
        G.seaConnBuildOn = false;
        for (var n = 0; n < G.newConnList.length; n++) {
            G.buildModeRegion.seaConn.push(G.newConnList[n]);
        }
        G.newConnList = [];
        G.bmregionNameElement.innerHTML = "Saving sea connections for region: " + G.buildModeRegion.name;
        G.buildModeRegion.updateGraphics()
    }
}

function finishLandConnList() {
    if (G.buildModeOn && G.seaConnBuildOn) {
        G.seaConnBuildOn = false;
        for (var n = 0; n < G.newConnList.length; n++) {
            G.buildModeRegion.landConn.push(G.newConnList[n]);
        }
        G.newConnList = [];
        G.bmregionNameElement.innerHTML = "Saving land connections for region: " + G.buildModeRegion.name;
        G.buildModeRegion.updateGraphics()
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

// simple contains function
function arrayContains(arr, n) {
    for (var i in arr) {
        if (arr[i] === n) return true;
    }
    return false;
}

function padTwoDigitNum(n) {
    if (n <= 0)
        return '  ';
    else if (n < 10)
        return ' ' + n;
    else
        return '' + n;
}

function arrayIntersection(a, b) {
    var ai = 0, bi = 0;
    var result = new Array();

    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) { ai++; }
        else if (a[ai] > b[bi]) { bi++; }
        else /* they're equal */ {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }
    return result;
}
