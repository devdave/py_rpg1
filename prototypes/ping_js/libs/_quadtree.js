/**
@file One of two impelementations of the Quadtree class.  TODO is consolidate
them both.
*/
/**
@namespace
*/
ping.Lib.util = ping.Lib.util || {};
/**
@function
*/
ping.Lib.util.inside = function(pos, low, high){
    return (pos > low & pos < high);
}

/**
@function
*/
ping.Lib.util.insideBox = function(x,y, box){
    var eX = box.x || box[0],
        eY = box.y || box[1],
        sx = box.sx || box[2],
        sy = box.sy || box[3];
    return (( ping.Lib.util.inside(x, eX, eX + sx)) && (ping.Lib.util.inside(y, eY, eY +sy)))
}

/**
 *Quadrant is a recursive quad-tree like structure that
 *breaks a given area progressively into 4 quadrants.
 *
 *
 @class
 *@argument {Integer} mx Upper left x coordinate
 *@argument {Integer} my Upper left y coordinate
 *@argument {Integer} lx lower right x coordinate
 *@argument {integer} ly lower right y coordinate
 *@argument {Integer} depth determines how many more quadrants to descend down
 */
function Quadrant(x, y, sx, sy, depth, name){
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.depth = depth - 1;
    this.entities = [];
    this.name = name || "root";
    /* @property {Quadrant} ul Upper left */
    this.ul = null;
    /* @property {Quadrant} ll Lower left */
    this.ll = null;
    /* @property {Quadrant} ur Upper right*/
    this.ur = null;
    /* @property {Quadrant} lr Lower right*/
    this.lr = null;


}

Quadrant.prototype.ulAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x, this.y, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.ul == null){
            this.ul = new Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->ul");
        }
        this.ul.add(entity);
        return true;
    }
    return false;
}

Quadrant.prototype.urAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x + this.sx/2, this.y, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.ur == null){

            this.ur = node = new Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->ur");
        }
        this.ur.add(entity);
        return true;
    }
    return false;

}

Quadrant.prototype.llAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x, this.y + this.sy / 2, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.ll == null){

            this.ll = new Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->ur");
        }
        this.ll.add(entity);
        return true;
    }
    return false;

}

Quadrant.prototype.lrAddIf = function(entity){
    //step 1 does this belong here
    var box = [this.x + this.sx/2, this.y + this.sy / 2, this.sx/2, this.sy / 2];
    if( ping.Lib.util.insideBox(entity.x, entity.y, box) ){
        if(this.lr == null){

            this.lr = new Quadrant(box[0], box[1], box[2], box[3],   this.depth - 1, this.name + "->lr");
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
 *@argument x is either an X coordinate or a point
 *@argument {Integer} y
 */
Quadrant.prototype.contains  = function(x, y){
    return (x > this.x  && x < this.x + this.sx)
        && (y > this.y  && y < this.y + this.sy);
}

/**
 *Does this quadrant hold a point of the provided box?
 *
 *@TODO extract this to possible Shapes library
 *@argument x is either an X coordinate or a point
 *@argument {Integer} y
 */
Quadrant.prototype.containsBox  = function(box){
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
 */
Quadrant.prototype.add = function(entity){

    //Has this quadrant divided already?
    if(this.entities == null){
        this.lrAddIf(entity) || this.urAddIf(entity) || this.llAddIf(entity) || this.ulAddIf(entity);
        return;
    }
    //Should this quadrant be divided?
    if(this.entities.length >= 1 && this.depth > 1 ){
        //This Quadrant has become crowded, flush out all entities down the next level
        this.entities.push(entity);
        this.divide();
        this.entities = null;
    }else{
        //No, push entity to this Quadrant
        this.entities.push(entity);
    }
}

/**
 *Divide current Quadrant
 *
 */
Quadrant.prototype.divide = function(){
    var entity = null;
    while(entity = this.entities.pop()){

        var failed = this.lrAddIf(entity) || this.urAddIf(entity) || this.llAddIf(entity) || this.ulAddIf(entity)
        //if(failed == false){
        //    throw {msg:"Could not place entity"};
        //}
    }
}


Quadrant.prototype.render = function(ctx, depth){
    ctx.strokeRect(this.x, this.y, this.sx, this.sy);
    if(this.ul) this.ul.render(ctx, depth -1);
    if(this.ur) this.ur.render(ctx, depth -1);
    if(this.lr) this.lr.render(ctx, depth -1);
    if(this.ll) this.ll.render(ctx, depth -1);

}

Quadrant.prototype.loop = function(block){
    var retvals = [];
    var points = ["ul","ll",'ur','lr'];
    for(var i = 0; i < points.length; i++ ){
        if( this[points[i]] instanceof Quadrant ){
            retvals.push( block.call(this[points[i]], points[i]));
        }
    }
    return retvals;
}

/**
 *Find all Quadrants from root to bottom tier that lead to
 *an entity
 *
 *@param {Integer} x
 *@param {Integer} y
 *@returns {Array} returns all quadrants from top to bottom that contain an entity
 */
Quadrant.prototype.find = function(x,y){
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
Quadrant.prototype.findBox = function(box){

    if(this.entities == null){
            var temp = [];
            if(this.ul  && this.ul.containsBox(box))    temp = temp.concat( this.ul.findBox(box));
            if(this.ur  && this.ur.containsBox(box))    temp = temp.concat( this.ur.findBox(box));
            if(this.lr  && this.lr.containsBox(box))    temp = temp.concat( this.lr.findBox(box));
            if(this.ll  && this.ll.containsBox(box))    temp = temp.concat( this.ll.findBox(box));
            return temp;
    }else{
        return [this];
    }
}

function QuadrantFactory (ctx, x, y, max) {
    return new Quadrant(0,0, x, y, max || 4 );
}




(function(){
    console.log("Test here!");
}());
