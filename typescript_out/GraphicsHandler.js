var GraphicsHandler = (function () {
    function GraphicsHandler() {
        this.graphics = G.game.add.graphics(0, 0);
        this.drawQueue = [];
    }
    GraphicsHandler.prototype.clearGraphics = function () {
        this.drawQueue = [];
    };
    GraphicsHandler.prototype.drawGraphics = function () {
        for (var i = 0; i < this.drawQueue.length; i++) {
            if (this.drawQueue[i][0] == 'line') {
                this.graphics.lineStyle(this.drawQueue[i][5], this.drawQueue[i][6]);
                this.graphics.moveTo(this.drawQueue[i][1], this.drawQueue[i][2]);
                this.graphics.lineTo(this.drawQueue[i][3], this.drawQueue[i][4]);
            }
            if (this.drawQueue[i][0] == 'rect') {
                this.graphics.lineStyle(1, this.drawQueue[i][5]);
                this.graphics.drawRect(this.drawQueue[i][1], this.drawQueue[i][2], this.drawQueue[i][3], this.drawQueue[i][4]);
            }
        }
    };
    GraphicsHandler.prototype.drawLine = function (x1, y1, x2, y2, size, color) {
        this.drawQueue.push(['line', x1, y1, x2, y2, size, color]);
        console.log(this.drawQueue[this.drawQueue.length - 1]);
    };
    GraphicsHandler.prototype.drawRect = function (x1, y1, w, h, linecolor, fillcolor) {
        this.drawQueue.push(['rect', x1, y1, w, h, linecolor, fillcolor]);
        console.log(this.drawQueue[this.drawQueue.length - 1]);
    };
    GraphicsHandler.prototype.move_camera_by_pointer = function (pntr) {
        if (!pntr.timeDown) {
            return;
        }
        if (pntr.isDown && !pntr.targetObject) {
            if (G.mcamera) {
                var movementX = G.mcamera.x - pntr.position.x;
                var movementY = G.mcamera.y - pntr.position.y;
                G.game.camera.x += movementX;
                G.game.camera.y += movementY;
            }
            G.mcamera = pntr.position.clone();
        }
        if (pntr.isUp) {
            G.mcamera = null;
        }
    };
    return GraphicsHandler;
}());
