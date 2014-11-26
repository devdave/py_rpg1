
GameTile = function(col, row, parent, fillStyle) {
    /**
    GameTile doesn't know the size of the canvas
    it's going to be so instead it knows what position it
    is on a grid.


    */
    this.x = col;
    this.y = row;

    this.sx = 1;
    this.sy = 1;
    this.fillStyle = fillStyle;

    this.parent = parent;
}

GameTile.prototype.render = function(ctx, scale_x, scale_y) {
    "use strict";
    var x = this.x * scale_x,
        y = this.y * scale_y;

    ctx.rect(x, y, scale_x, scale_y);
}


GameMap = function(map_data) {
    "use strict";

    this.width = map_data.cols;
    this.height = map_data.rows;
    this.grid = ping.QuadrantFactory(this.width, this.height);
    this.elements = [];

    var colors = ["red","blue","green","yellow", "orange"],
        row, col, myColor, debug;

    for (row = 0; row < this.height; row++) {
        alert("stop!");
        for(col = 0; col < this.width; col++){
            alert("stop!");
            myColor = colors[Math.floor(Math.random() * colors.length)];
            var tile = new GameTile(col, row, parent, myColor );
            this.grid.add(tile);
            this.elements.push(tile);
        }
    }
    debug = this.grid.getAll();
    console.log(this.height * this.width, debug.length, debug.length == this.height * this.width);
}

GameMap.prototype.render = function(ctx, offsetx, offsety, limit_x, limit_y) {
    "use strict";
    var scale_x = ctx.canvas.width / this.width,
        scale_y = ctx.canvas.height / this.height,
        offsetx = offsetx || 0,
        offsety = offsety || 0,
        limit_x = limit_x || this.width,
        limit_y = limit_y || this.height,
        search_box = {x:offsetx, y:offsety, sx:limit_x, sy: limit_y},
        my_elements, debug_element;

        if (arguments.length == 1) {
            my_elements = this.elements;
        } else {
            my_elements = this.grid.findBox(search_box);
            debug_element = this.grid.getAll();
            console.log("found", my_elements.length);
        }



    for( var i = 0; i < my_elements.length; i++) {
        ctx.beginPath();
        my_elements[i].render(ctx, scale_x, scale_y);
        ctx.fillStyle = my_elements[i].fillStyle;
        ctx.stroke();
        ctx.fill();
        ctx.closePath;
    }

}
