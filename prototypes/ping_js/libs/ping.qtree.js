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
    return (pos > low & pos < high);
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
    this.entities = [];
    this.name = name || "root";
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
        if(this.ul == null){
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
        if(this.ur == null){

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
        if(this.ll == null){

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
        if(this.lr == null){

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
 *@TODO extract this to possible Shapes library
 *@param {Integer} x is either an X coordinate or a point
 *@param {Integer} y
 */
ping.Lib.Quadrant.prototype.contains  = function(x, y){
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
    return ping.Lib.intersects.box(this,box);
    /**
     *AxMin > BxMax and AxMax > BxMin
        AyMin > ByMax and AyMax > ByMin
     */
    //return (
    //return (this.x > box.x + box.sx  && x < this.x + this.sx)
    //    && (y > this.y  && y < this.y + this.sy);
}


/**
 *High level Entity Add logic, focuses on where to route
 *a new entity.
 *
 *property {x,y,sx,sy} All information needed to map out a box shape
 @function
 */
ping.Lib.Quadrant.prototype.add = function(entity){

    //Has this quadrant divided already?
    if(this.entities == null){
        /** @TODO there should be a way to optimize this! */
        var failed = this.lrAddIf(entity) || this.urAddIf(entity) || this.llAddIf(entity) || this.ulAddIf(entity);

        return failed;
    }
    //Should this quadrant be divided?
    if(this.entities.length >= 1 && this.depth > 1 ){
        //This Quadrant has become crowded, flush out all entities down the next level
        this.entities.push(entity);
        this.divide();
        this.entities = null;
        return true;
    }else{
        //No, push entity to this Quadrant
        this.entities.push(entity);
        return true;
    }
}

/**
 *Divide current Quadrant
 *
@function
 */
ping.Lib.Quadrant.prototype.divide = function(){
    var entity = this.entities.pop();
    if (entity) {

        do {
            var failed = this.lrAddIf(entity) || this.urAddIf(entity) || this.llAddIf(entity) || this.ulAddIf(entity)
            this.entities.pop();
        } while(entity);
    }
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
 *Find all Quadrants from root to bottom tier that lead to
 *an entity
 *
@constructor
@param {Integer} x
 *@param {Integer} y
 *@returns {Array} returns all quadrants from top to bottom that contain an entity
 */
ping.Lib.Quadrant.prototype.find = function(x,y){
    var myTargets = [];

    if(this.contains(x,y)){
        myTargets.push(this);
        if(this.entities == null){
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
 *Find all Quadrants from root to bottom tier that lead to
 *an entity
 *
 *@param {Object} box has x,y and sx,sy properties
 *@returns {Array} returns all quadrants from top to bottom that contain an entity
 */
ping.Lib.Quadrant.prototype.findBox = function(box){

    if(this.entities == null){
            var temp = [];
            if(this.ul  && this.ul.containsBox(box))    temp = temp.concat( this.ul.findBox(box));
            if(this.ur  && this.ur.containsBox(box))    temp = temp.concat( this.ur.findBox(box));
            if(this.lr  && this.lr.containsBox(box))    temp = temp.concat( this.lr.findBox(box));
            if(this.ll  && this.ll.containsBox(box))    temp = temp.concat( this.ll.findBox(box));
            return temp;
    }else{
        return this.entities;
    }
}

ping.QuadrantFactory = function (ctx, max){
    return new ping.Lib.Quadrant(0,0, ctx.canvas.clientWidth, ctx.canvas.clientHeight, max || 4 )
}
