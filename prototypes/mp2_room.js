
game = game || {};

game.Room = function (x,y, width, height, connections) {
    this.x = x;
    this.y = y;
    /** @TODO standarize this ! */
    this.size = {h:height, w:width};
    this.width = width;
    this.height = height;
    this.sx = width;
    this.sy = height;
}

game.Room.prototype.render = function(ctx) {

    ctx.beginPath();
    this._renderRect();
    ctx.stroke();


}

game.Room.prototype._renderRect = function(ctx) {
    ctx.rect(this.x, this.y, this.width, this.height);
}
