




clamp = ping.Math.clamp;

/**
GameTile doesn't know the size of the canvas
it's going to be so instead it knows what position it
is on a grid.
*/
GameTile = function(col, row, parent, fillStyle, index) {

    this.x = col;
    this.y = row;

    this.sx = 1;
    this.sy = 1;
    this.fillStyle = fillStyle;

    this.parent = parent;
    this.index = index;

    this.walls = {
        e:1, w:1, s:1, n:1
    };
    this.neighbors = {};

    this.geo_rose = {
        e: {x: 1, y: 0},
        w: {x: -1, y: 0},
        s: {x: 0, y: 1},
        n: {x: 0, y: -1}
    }
}


GameTile.prototype.render = function(ctx, scale_x, scale_y) {
    "use strict";
    var x = this.x * scale_x,
        y = this.y * scale_y;

    ctx.rect(x, y, scale_x, scale_y);
}


GameTile.prototype.findNeighbors = function() {
    "use strict";
    var found = {count:0},
        delta,
        index;


    for(var dir in this.geo_rose){
        if (this.geo_rose.hasOwnProperty(dir) == false ) continue;
        delta = this.geo_rose[dir];

        index = ping.Math.c2i(this.x + delta.x,
                              this.y + delta.y,
                              this.parent.width,
                              this.parent.height )
        if (index > this.parent.elements.length || index < 0) {
            continue;
        }
        found[dir] = this.parent.elements[index];
        found.count += 1;

    }
    this.neighbors = found;

    return found;

}

GameTile.prototype.go = function(dir) {
    var delta;

    if (this.geo_rose[dir] == undefined){
        throw ping.Exception("I don't know how to go " + dir);
    }

    delta = this.geo_rose[dir];
    index = ping.Math.c2i(this.x + delta.x, this.y + delta.y );

    return this.parent.elements[index] || false;
}




GameMap = function(max_width, max_height) {
    "use strict";

    this.width = max_width;
    this.height = max_height;
    this.grid = ping.QuadrantFactory(this.width, this.height);
    this.elements = [];

    var row, col, myColor, debug, index = 0;

    for(col = 0; col < this.width; col++){
        for (row = 0; row < this.height; row++) {

            myColor = "black";
            var tile = new GameTile(col, row, this, myColor, index);
            this.grid.add(tile);
            this.elements.push(tile);
            index += 1
        }
    }
    for(var i = 0; i < this.elements.length; i++){
        this.elements[i].findNeighbors();
    }
    //debug = this.grid.getAll();
    //console.log(this.height * this.width, debug.length, debug.length == this.height * this.width);
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
        drawCell(ctx, my_elements[i], scale_x, scale_y);
        //my_elements[i].render(ctx, scale_x, scale_y);
        //ctx.fillStyle = my_elements[i].fillStyle;
        //ctx.stroke();
        //ctx.fill();
        ctx.closePath;
    }

}

/**
*Draw the sides of a cell
*
* @param {nsIDOMCanvasRenderingContext2D} ctx target to draw too
* @param {GameTile} cell
* @param {number} cell.x start of cell
* @param {number} cell.y start of cell
* @param {number} cell.width
* @param {number} cell.height
* @param {boolean} cell.east has east wall
* @param {boolean} cell.w
* @param {boolean} cell.n
* @param {boolean} cell.s
  @param {number} scale_x
  @param {number scale_y
  @param {Object} adj
  @param {number} adj.x The real x coord
  @param {number} adj.y The real y coord
*/
function drawCell(ctx, cell, scale_x, scale_y, adj) {
    "use strict";

    ctx.save();
    ctx.beginPath();

    var dirs = ['e','w','n','s'],
        t,p,dir,
        adj_x = adj ? adj.x :  Math.floor(cell.x * scale_x),
        adj_y = adj ? adj.y :  Math.floor(cell.y * scale_y);

    scale_x = Math.floor(scale_x);
    scale_y = Math.floor(scale_y);

    ctx.fillStyle = cell.fillStyle;
    ctx.fillRect(adj_x, adj_y, scale_x, scale_y);


    ctx.save();
    ctx.strokeStyle = "white";
    //Shifting off makes the lines "crisper"
    ctx.translate(0.5,0.5);


    for(dir in cell.walls) {
        if (!cell.walls.hasOwnProperty(dir)) continue;

        ctx.beginPath();


        switch (dir) {
            case 'n':
                //origin to far upper right
                ctx.moveTo(
                    adj_x,
                    adj_y
                );
                ctx.lineTo(
                    adj_x + scale_x,
                    adj_y
                );
                break;
            case 's':
                //bottom left to bottom right
                ctx.moveTo(
                    adj_x,
                    adj_y + scale_y
                );
                ctx.lineTo(
                    adj_x + scale_x,
                    adj_y + scale_y );
                break;
            case 'w':
                //origin to bottom left
                ctx.moveTo(
                    adj_x,
                    adj_y
                );
                ctx.lineTo(
                    adj_x,
                    adj_y + scale_y
                );
                break;
            case 'e':
                //far right to bottom right
                ctx.moveTo(
                    adj_x + scale_x,
                    adj_y
                );
                ctx.lineTo(
                    adj_x + scale_x,
                    adj_y + scale_y
                );
                break;
        }


        ctx.closePath();
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();

}
