
var guiObjJSON = {
    id: 'mainWindow',
    component: 'Window',
    header: { id: 'ttl', skin: 'blueheader', position: { x: 0, y: 0 }, height: 40, text: 'Title' },
    draggable: true,
    padding: 4,
    position: { x: 40, y: 40 },
    width: 600,
    height: 500,
    layout: [1, 3],
    children: [
        {
            component: 'Layout',
            position: { x: 0, y: 0 },
            width: 500,
            height: 140,
            layout: [2, 1],

            children: [
                  {
                      id: 'btn1',
                      text: 'btn',
                      font: {
                          size : '42px',
                          family: 'Arial'
                      },
                      component: 'Button',
                      skin: 'bluebutton',
                      position: 'center',
                      width: 190,
                      height: 80
                  },
                  {
                      component: 'Layout',
                      position: { x: 0, y: 0 },
                      width: 250,
                      height: 140,
                      layout: [1, 4],
                      children: [
                          { id: 'radio1', text: 'choice 1', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 },
                          { id: 'radio2', text: 'choice 2', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 },
                          { id: 'radio3', text: 'choice 3', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 },
                          { id: 'radio4', text: 'choice 4', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 }
                      ]
                  }
            ]
        },

    {
        id: 'hlist1',
        component: 'List',
        padding: 3,
        position: 'center',
        width: 400,
        height: 150,
        layout: [4, null],
        children: [
            { id: 'sc1', component: 'Button', position: 'center', width: 90, height: 120 },
            null,
            { id: 'sc2', component: 'Button', position: 'center', width: 90, height: 120 },
            { id: 'sc3', component: 'Button', position: 'center', width: 90, height: 120 },
            { id: 'sc4', component: 'Button', position: 'center', width: 90, height: 120 },
            { id: 'sc5', component: 'Button', position: 'center', width: 90, height: 120 }
        ]
    },
      {
          id: 'btn2',
          component: 'Checkbox',

          position: 'center',
          text: 'Checkbox',
          width: 30,
          height: 30
      }
    ]
}

var SW = {
    	drawLayer:       {extObj:null, type:"checkbox", active:true, v:true, label:"drawLayer"},
    	cameraDrag:      {extObj:null, type:"checkbox", active:true, v:true, label:"cameraDrag"},
    	//buildMode:       {extObj:null, type:"checkbox", active:true, v:true, label:"buildMode"},
    	//buildLandConn:   {extObj:null, type:"checkbox", active:true, v:false, label:"landConnBuild"},
        //buildSeaConn:    {extObj:null, type:"checkbox", active:true, v:false,  label:"seaConnBuild"},
        //buildingRegion:  {extObj:null, type:"textfield",active:false, v:"",     label:"Building Region<str>"},
        //consoleOutput:   {extObj:null, type:"multitext",active:true, v:"Console Output"}
};

var G = {
    regionListJSON: null,
    game: null,
    canvas: document.getElementById("main_canvas"),
    canvasDims: [1380, 780],
    keys: null,
    EZGUIContainer: null,
    console: null,
    mcamera: null,
    gfxHandler: null,
    dataHandler: null,
    drawLayerOn: true,
    cameraDragOn: true,
    builder: {
        enabled: true,
        currentRegion: null,
        currentTokenSpot: null,
        newConnList: [],
        landConnOn: false,
        seaConnOn: false
    },
    GV: {
        regions: [],
        civs: [],
        tokenLimit: 55,
        shipLimit: 4,
        cityLimit: 9
    },
};

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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
        G.game = new Phaser.Game(G.canvasDims[0], G.canvasDims[1], Phaser.AUTO, G.canvas.getAttribute('id'));
        G.game.state.add("GameRunningState", GameRunningState, false);
        G.game.state.start("GameRunningState", true, true);

        EZGUI.renderer = G.game.renderer;
        EZGUI.Theme.load(['./EZGUI-master/assets/kenney-theme/kenney-theme.json'], function () {
            //create the gui; the second parameter is the theme name, the name is defined under __config__ field
            G.EZGUIContainer = EZGUI.create(guiObjJSON, 'kenney');
            EZGUI.components.btn1.on('click', function (event) {
                console.log('clicked', event);
                EZGUI.components.mainWindow.position.x += 20;

            });
        });
    }
}

class GameRunningState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.game.load.image('mapSectionA', 'assets/NewCivmapSectionA.png');
        this.game.load.spritesheet('pop', 'assets/foodIcons.png', 20, 20, 7);
        this.game.load.spritesheet('tokens', 'assets/tokens.png', 32, 32, 4);
        this.game.load.spritesheet('cities', 'assets/cities.png', 32, 32, 4);
        this.game.load.spritesheet('tokens_small', 'assets/tokens_small.png', 16, 16, 4);
        this.game.load.spritesheet('ships', 'assets/ships.png', 50, 32, 4);
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
        //G.keys.num1.onDown.add(placeTokenSpot, this);
        //G.keys.num2.onDown.add(placeShipSpot, this);
        //G.keys.num3.onDown.add(placeRegion, this);
        //G.keys.num4.onDown.add(placeCity, this);
        //G.keys.num5.onDown.add(changeSize, this);
        //G.keys.num6.onDown.add(deleteTokenSpot, this);
        //G.keys.num8.onDown.add(startLandConnList, this);
        //G.keys.num9.onDown.add(finishLandConnList, this);
        //G.keys.num0.onDown.add(G.dataHandler.exportGameData, this);
        G.keys["z"].onDown.add(function() {
            EZGUI.components.mainWindow.visible = !EZGUI.components.mainWindow.visible;
        }, this);

        G.keys["d"].onDown.add(function() {
            console.log("**** draw layer key pressed");
            console.log(SW.drawLayer.v);
        }, this);
    }
}

function getMousePos() {
    return [this.game.input.mousePointer.position.x + this.game.camera.x,
        this.game.input.mousePointer.position.y + this.game.camera.y];
}

// BUILD mode functions /////////////////////////////////////////////////////////////////////////////////////////
/*
function placeRegion() {
    if (G.buildModeOn) {
        G.buildModeRegion = new Region(G.regions.length + 1, "New Region", -1, 0, 0, [], [], "normal", this.getMouse(), [], [], []);
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
        //G.bmregionNameElement.innerHTML = "Building sea conn's for region: " + G.buildModeRegion.name;
    }
}

function startLandConnList() {
    if (G.buildModeOn && !G.seaConnBuildOn) {
        G.seaConnBuildOn = true;
        G.newConnList = [];
        //G.bmregionNameElement.innerHTML = "Building sea conn's for region: " + G.buildModeRegion.name;
    }
}

function finishSeaConnList() {
    if (G.buildModeOn && G.seaConnBuildOn) {
        G.seaConnBuildOn = false;
        for (var n = 0; n < G.newConnList.length; n++) {
            G.buildModeRegion.seaConn.push(G.newConnList[n]);
        }
        G.newConnList = [];
        //G.bmregionNameElement.innerHTML = "Saving sea connections for region: " + G.buildModeRegion.name;
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
        //G.bmregionNameElement.innerHTML = "Saving land connections for region: " + G.buildModeRegion.name;
        G.buildModeRegion.updateGraphics()
    }
}
*/
