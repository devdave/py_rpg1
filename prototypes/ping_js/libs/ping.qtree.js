/**
@file One of two impelementations of the Quadtree class.  TODO is consolidate
them both.
*/
/**
@namespace
*/
ping.Lib.util = ping.Lib.util || {};

/**
Given a single dimension line, is pos inside of it?
@function
@param {Float} pos A number on a line
@param {Float} low start of a line
@param {Float} high end of a line
*/
ping.Lib.util.inside = function(pos, low, high){
    return (pos >= low && pos <= high);
}

/**
Expansion of @see inside to check if a point is inside a rectangle
@function
@param {Object|List} box A rectangular space to check again
*/
ping.Lib.util.insideBox = function(x,y, box){
    /** @TODO consolidate, this is wasted time */
    var eX = box.x || box[0];
    var eY = box.y || box[1];
    var sx = box.sx || box[2];
    var sy = box.sy || box[3];
    return (( ping.Lib.util.inside(x, eX, eX + sx)) && (ping.Lib.util.inside(y, eY, eY +sy)))
}

/**
 *Quadrant is a recursive quad-tree like structure that
 *breaks a given area progressivel into 4 quadrants.  This is recursion on
 steroids.
 *@see {@link http://en.wikipedia.org/wiki/Quadtree}

@class
@param {Integer} x Upper left x coordinate
@param {Integer} y Upper left y coordinate
@param {Integer} sx Quadrant width
@param {integer} sy quadrant height
@param {Integer} depth how many times should a quadrant be divided into?
 */
ping.Lib.Quadrant = function(x, y, sx, sy, depth, name){
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.depth = depth - 1;
    //this.entities = [];
    this.entity = undefined;
    this.name = name || "root";
    this.zones = ['ul', 'ur', 'll', 'lr'];
    /**
    Upper left quadrant
    @member  {Quadrant}*/
    this.ul = null;

    /**
    Lower left quadrant
    @member  {Quadrant} */
    this.ll = null;

    /**
    Upper right quadrant
    @member  {Quadrant} */
    this.ur = null;
    /**
    Lower right quadrant
    @member {Quadrant} */
    this.lr = null;


}

/**
Add an entity to the upper left quadrant if it belongs there
@function
*/
ping.Lib.Quadrant.prototype.ulAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x, this.y, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.ul === null){
            this.ul = new ping.Lib.Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->ul");
        }
        this.ul.add(entity);
        return true;
    }
    return false;
}

/**
Add an entity to the upper right quadrant if it belongs there
@function
*/
ping.Lib.Quadrant.prototype.urAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x + this.sx/2, this.y, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.ur === null){

            this.ur = node = new ping.Lib.Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->ur");
        }
        this.ur.add(entity);
        return true;
    }
    return false;

}

/**
Add an entity to the lower left quadrant if it belongs there
@function
*/
ping.Lib.Quadrant.prototype.llAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x, this.y + this.sy / 2, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.ll === null){

            this.ll = new ping.Lib.Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->ur");
        }
        this.ll.add(entity);
        return true;
    }
    return false;

}

/**
Add an entity to the lower right quadrant if it belongs there
@function
*/
ping.Lib.Quadrant.prototype.lrAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x + this.sx/2, this.y + this.sy / 2, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.lr === null){

            this.lr = new ping.Lib.Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->lr");
        }
        this.lr.add(entity);
        return true;
    }
    return false;
}

/**
 *Does this quadrant contain this point?
 *
 @private
 *@TODO extract this to possible Shapes library
 *@param {Integer} x is either an X coordinate or a point
 *@param {Integer} y
 @deprecated
 */
ping.Lib.Quadrant.prototype.contains  = function(x, y){
    throw new Error("Deprecated!");
    return (x > this.x  && x < this.x + this.sx)
        && (y > this.y  && y < this.y + this.sy);
}

/**
 *Does this quadrant hold a point of the provided box?
 *
 *@TODO extract this to possible Shapes library
 *@param {Integer|Object} x is either an X coordinate or a point
 *@param {Integer} y
 */
ping.Lib.Quadrant.prototype.containsBox  = function(box){
    return  ((box.x == this.x && box.x == this.x + this.sx )&&
             (box.y == this.y && box.y == this.y + this.sy)
            )
            ||
            ((box.x >= this.x && box.x < this.x + this.sx )&&
             (box.y >= this.y && box.y < this.y + this.sy)
            )
    //return ping.Lib.intersects.box(this,box);
    /**
     *AxMin > BxMax and AxMax > BxMin
        AyMin > ByMax and AyMax > ByMin
     */
    //return (
    //return (this.x > box.x + box.sx  && x < this.x + this.sx)
    //    && (y > this.y  && y < this.y + this.sy);
}

ping.Lib.Quadrant.prototype.getAll = function(){
    var temp = [],
        zones = ['ul','ur','lr','ll'];

    if (this.entity != null) {
        temp.push(this.entity);
    }
    else{
        for(var i = 0; i < zones.length; i++) {
            if (this[zones[i]] != null) {
                temp = temp.concat(this[zones[i]].getAll());
            }
        }
    }
    return temp;
}


/**
    Spin trough possible zones and add the entity to the appropriate spot.

    @private
    @param {Object} entity
*/
ping.Lib.Quadrant.prototype.addIf = function(entity) {
    var box,
        zones = {
            ul: [this.x, this.y, this.sx/2, this.sy / 2],
            ur: [this.x + this.sx/2, this.y, this.sx/2, this.sy / 2],
            ll: [this.x, this.y + this.sy / 2, this.sx/2, this.sy / 2],
            lr: [this.x + this.sx/2, this.y + this.sy / 2, this.sx/2, this.sy / 2]
        },
        zone;

    for(zone in zones){
        if (zones.hasOwnProperty(zone)) {
            box = zones[zone];
            if (entity.x >= box[0] && entity.x < box[0] + box[2] &&
                entity.y >= box[1] && entity.y < box[1] + box[3]) {
                if (this[zone] === null) {
                    this[zone] = new ping.Lib.Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->" + zone);
                }
                this[zone].add(entity);
                return true;
            }
        }
    }

    return false;
}


/**
 *High level Entity Add logic, focuses on where to route
 *a new entity.
 *
 *property {x,y,sx,sy} All information needed to map out a box shape
 @function
 */
ping.Lib.Quadrant.prototype.add = function(new_entity){
    "use strict";
    var box,
        result = false;

    //Has this quadrant divided already?
    if(this.entity === null){
        result = this.addIf(new_entity);

        if (result == false) {
            throw new ping.Exception("Unable to find zone to add entity!", [this, new_entity]);
        } else{
            return result;
        }


    } else {
        if (this.entity) {
            this.divide(new_entity);
        } else{
            this.entity = new_entity;
        }
        return true;
    }

    throw new ping.Exception("Unable to add entity!", [this, entity]);
    return false;

}

/**
Divide current Quadrant
@function
@private
 */
ping.Lib.Quadrant.prototype.divide = function(new_entity){
    var failures = [],
        zones = ['lr','ur','ll','lr'],
        added,
        result;

    result = this.addIf(new_entity);
    if (result == false) {
        throw new ping.Exception("Could no divide Quadrant! Entity would be lost!", [this, new_entity, i]);
    }
    old_result = this.addIf(this.entity);
    if (result == false) {
        throw new ping.Exception("Could no divide Quadrant! Entity would be lost!", [this, entity, i]);
    }

    this.entity = null;
}


ping.Lib.Quadrant.prototype.render = function(ctx, depth){
    ctx.strokeRect(this.x, this.y, this.sx, this.sy);
    if(this.ul) this.ul.render(ctx, depth -1);
    if(this.ur) this.ur.render(ctx, depth -1);
    if(this.lr) this.lr.render(ctx, depth -1);
    if(this.ll) this.ll.render(ctx, depth -1);

}

ping.Lib.Quadrant.prototype.loop = function(block){
    //DEPRECATED
    console.error("Deprecated, non-performent!")
    var retvals = [];
    var points = ["ul","ll",'ur','lr'];
    for(var i = 0; i < points.length; i++ ){
        if( this[points[i]] instanceof ping.Lib.Quadrant ){
            retvals.push( block.call(this[points[i]], points[i]));
        }
    }
    return retvals;
}

/**
Find all Quadrants from root to bottom tier that contain a specific point.
 *
@constructor
@param {Integer} x
@param {Integer} y
@returns {Array} returns all quadrants from top to bottom that contain an entity

 */
ping.Lib.Quadrant.prototype.find = function(x,y){
    var myTargets = [];

    if(x >= this.x && x < this.x + this.sx &&
       y >= this.y && y < this.y + this.sy){
        myTargets.push(this);
        if(this.entity === null){
            var temp = [];
            if(this.ul)     temp = temp.concat( this.ul.find(x,y, myTargets));
            if(this.ur )    temp = temp.concat( this.ur.find(x,y, myTargets));
            if(this.lr )    temp = temp.concat( this.lr.find(x,y, myTargets));
            if(this.ll )    temp = temp.concat( this.ll.find(x,y, myTargets));
            return myTargets.concat(temp);
        }
    }
    return myTargets;
}

/**
 *Find all entities inside the box
 *an entity
 *
 *@param {Object} box has x,y and sx,sy properties
 *@returns {Array} returns all entities from inside box
 */
ping.Lib.Quadrant.prototype.findBox = function(box){

    var temp = [];

    if (ping.Lib.intersects.box(this, box)) {
        if (this.entity) {
            temp = temp.concat([this.entity])
        } else {
            for( var i = 0; i < this.zones.length; i++){
                var zone = this.zones[i];
                if (this[zone]) {
                    result = this[zone].findBox(box);
                    temp = temp.concat(result);
                }
            }
        }

    }
    return temp;
}

ping.QuadrantFactory = function(width, height, max) {
    return new ping.Lib.Quadrant(0,0, width, height, max || 4 );
}
