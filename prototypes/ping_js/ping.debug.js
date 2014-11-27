/**
@fileoverview Main script file, set's up the ping namespace.
*/

/**
 *Global Application logic collection, should hold only instances
 *@namespace
 *@type Object
 */
var ping = { "Lib" : {}};


/**
 *Namespace utility
 *
 @deprecated Cool idea once, breaks JsDoc as you can't document namespaces with it
 *@param ns {String} An array or string of namespaces to create or verify exist
 *@param toApply {Function} Adds
 *@returns {Object} Last element in a NS
 */
ping.namespace = function(ns, toApply){
    var elements = ns.split(".");
    var root = window[elements[0]] = window[elements[0]] || {};

    for(var i = 1; i < elements.length; i++){
        root = root[elements[i]] = root[elements[i]] || {};
    }
    return root;
}

/**
 *With Namespace/object extension helper

 @deprecated maybe?  I was big into ExtJS when I was writing this.
 *Provides a namespace safe mechanism for extending a functions prototype or decorating an object
 */
ping.w = function(target, toApply){
    toApply.call(target.prototype);
}

/**
 *Application exception implementation
 *
 *@constructor
 *@param {string} Error message
 *@param {Object} A reference/copy of the local this variable for debugging purposes
 */
ping.Exception = function(message, scope){
    this.message = message;
    this.scope = scope;
}

ping.Exception.prototype.toString = function(){
    return  "ping.Exception( " + this.message + ", ... );"
}

/**
 *@static Global reference to the Canvas 2d context
 *@deprecated
 */
ping.CTX = null;
/**
@fileoverview Provides a fly-weight light caching for canvas objects as well
as overloading/monkey patching the default CanvasRenderingContext2d class
to provide some additional features.
*/
/**
 *Canvas additions library
 *
 *Adds some useful new methods and helpers to the canvas
 *Instance
 *@namespace
 *
 */
ping.Lib = ping.Lib || {};

/**
 *A canvas instance manager
 *
 *@classdesc It's pretty rare to create & destroy canvas's from the DOM
 *so it make sense to an extent to try and cache the reference
 *to the 2d Rendering context...thereby avoiding continual
 *DOM getElementBy Id calls.
 *
 *This is considered an internal library utility and shouldn't
 *be called directly
 *
 *@constructor
 */
ping.Lib.CnvMan = function(){
     /**
     *Holds references of known canvas elements
     *@member {object}
     **/
     this.refs = {};
}

/**
Internal setter to assign a element to the ref's property
@Private
@method */
ping.Lib.CnvMan.prototype._set = function(id, ref){
   this.refs[id] = ref;
}

/**
Returns a valid canvas element by it's id, if it exists.
@method
@param {string} id A valid canvas element id
@returns {CanvasRenderingContext2D}
*/
ping.Lib.CnvMan.prototype.get = function(id){
    if( typeof this.refs[id]  == "undefined"){
         this._set(id, ping.Lib.$C(id));
    }
    return this.refs[id];
}

/**
Add's a canvas element to the list of cached elements.
@method
@param {string} id A valid id for a canvas element.
@param {HTMLCanvasElement} reference
@returns {CanvasRenderingContext2D}
*/
ping.Lib.CnvMan.prototype.set = function(id, reference){
    if( typeof this.refs[id] == "undefined"){
         this._set(id, reference);
    }
    return this.refs[id];
}
/**
@method
@param {string} id A valid id for a canvas element.
@returns {Boolean}
*/
ping.Lib.CnvMan.prototype.exists = function(id){
   return typeof this.refs[id] != "undefined";
}


/**
Keeps a record of every extended canvas made
@memberof ping
@type {ping.Lib.CnvMan}
@instance
 */
ping.cMngr = new ping.Lib.CnvMan();


/**
 *Utility to instantiate/retrieve the 2d Rendering context of canvas tags
 *
 *This is also a future safe measure in case the 2d Rendering context should ever change,
 *all of the add on methods can be bound at run time instead of compile time.
@function
@param {string} elemId A valid canvas html id
@returns {CanvasRenderingContext2D}
 */
ping.$C = function(elemId){
   if(ping.cMngr.exists(elemId)){
       return ping.cMngr.get(elemId);
   }
   var element = document.getElementById(elemId);
   var ref = element.getContext("2d");
   return ping.cMngr.set(elemId, ref);
}

/**
@class CanvasRenderingContext2D
*/

/**
 *@deprecated
 *Initially was meant to be a utility to ensure
 *drawing sections of code were always wrapped with a begin..end path calls
 *
 *Unfortunately this turned out to be an amazing nightmare performance
 *killing swamp.  Closures and very high performance DO NOT mix!
@method
 */
CanvasRenderingContext2D.prototype.render = function(block){
                        this.beginPath();
                        //@TODO add try/catch here?
                        block.call(this);
                        this.closePath();
                        return this;
}





/**
 *Given a Radi & angle value, return points on a circle
 *
 *This is heavily used by the PingGame itself so should be considered stable
 *
 *@param {inter} Radius is the radius of the circle
 *@param {float} angle should be a sane degree value from 0-360
 *@param {float} x the x coordinate for the circle origin
 *@param {float} y the y coordinate for the circle origin
 *
 */
CanvasRenderingContext2D.prototype.rayGen = function(Radius, angle, x, y){
                       var radian = angle * Math.PI/180;
                        var lx = Radius * (Math.cos(radian)) + x;
                        var ly = Radius * (Math.sin(radian)) + y;
                        return [lx, ly];
                };

/**
 *Draws an elliptical circle on the canvas.
 *Ratio reflects on warped the circle gets
 *
 *@see Solar
 @todo Damn if I remember how this works
 *
 */
CanvasRenderingContext2D.prototype.elipGen = function(Radius, angle, originX, originY, ratio ){
                        ratio = /*ratio ||*/ 1.8;
                        var radian = angle * Math.PI/180;
                        var lx = (Radius * (Math.cos(radian)* ratio) + originX) ;
                        var ly = Radius * (Math.sin(radian) * .5) + originY;
                        return [lx, ly];
};

/**
 *A utility to take ping Point classes and render out a line.
 *
 *Currently not used anywhere
 @method
 @param {Object} p1 The starting point if a line
 @param {Object} p2 The end point of a line
 */
CanvasRenderingContext2D.prototype.line = function(p1, p2){
                    this.moveTo(p2.x, p2.y);
                    this.lineTo(p1.x, p1.y);
                };

/**

@deprecated Duplicate of line and adds 1 more call to stack
@see CanvasRenderingContext2D#line
@function
 */
CanvasRenderingContext2D.prototype.drawLine = CanvasRenderingContext2D.prototype.line

/**
Utility to draw a circle
@function
@param {float} x Origin x
@param {float} y Origin y
@param {float} radius
@deprecated Waste of cycles
*/
CanvasRenderingContext2D.prototype.circle = function(x, y, radius) {
                        return this.arc(x, y, radius, 0, Math.PI* 2, true);
                        };

/**
Utility to draw a circle with begin & close path (equiv to stroke)
@function
@param {float} x Origin x
@param {float} y Origin y
@param {float} radius
@deprecated Waste of cycles
*/
CanvasRenderingContext2D.prototype.drawCircle = function(x, y, radius){
                        this.beginPath();
                        this.circle(x,y,radius);
                        this.closePath();
}
/**
Draw a pixel at the specific point that is 1x1 in size
@function
@param {object} point {x:#,y:#} object
@param {string} color a valid HTML color code
*/
CanvasRenderingContext2D.prototype.pixel    = function(point, color){
                        this.save();
                        this.moveTo(point[0],point[1]);
                        this.fillStyle = color;
                        this.fillRect(point[0],point[1],1,1);
                        this.restore();
}

/**
Draw a pixel at the specific point that is 1x1 in size
@function
@param {object} point {x:#,y:#} object
@param {string} color a valid HTML color code
@deprecated Waste of a stack call for conveniance
*/
CanvasRenderingContext2D.prototype.putPixel = function(x,y, color){
                        if(arguments.length == 1){
                          var point = x;
                        }else{
                          var point = [x,y];
                        }
                        color = color || "white";
                        this.pixel(point, color)
    }

/**
Flood the entire canvas with the specified color

This is an alternative to using clearRect
@function
@param {string} color a valid HTML color code
*/
CanvasRenderingContext2D.prototype.floodFill = function(color){
                        this.save();
                        this.fillStyle  = color;
                        this.fillRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);
                        this.restore();
                        }

/**
Shortcut to clear the entire canvas
@function
*/
CanvasRenderingContext2D.prototype.clearAll = function(color){
                        this.clearRect(0,0,this.canvas.width, this.canvas.height );
                        }

/**
Shortcut to get the canvas height
@function
@deprecated
*/
CanvasRenderingContext2D.prototype.maxHeight = function(){
     return this.canvas.clientHeight;
}

/**
Shortcut to get the canvas width
@function
@deprecated
*/
CanvasRenderingContext2D.prototype.maxWidth = function(){
     return this.canvas.clientWidth;
}


//To allow for documentation detection
/**
Reference to the
@see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D|Mozilla Canvas docs} for further information
*/
ping.Lib.CanvasRenderingContext2D = CanvasRenderingContext2D;


//ping.namespace("ping.Lib")
ping.Lib = ping.Lib || {};
//ping.namespace("ping.Lib.intersects")
/**
@namespace
*/
ping.Lib.intersects = ping.Lib.intersects || {}


/**
  This isn't labeled right, I want to know if any given point
  on box b's corners is inside A

  //Sourced from
  http://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
  @TODO test!
*/
ping.Lib.intersects.boxContainsBox = function(a, b) {
    return (Math.abs(a.x - b.x) * 2 < (a.sx + b.sx)) &&
            (Math.abs(a.y - b.y) * 2 < (a.sy + b.sy));
}

/**
This relatively insane function is meant to see if two
boxes intersect each other
@param {object} a should be {x:#,y:#,sx:#,sy#} where s vars are short for (s)ize
@param {object} b should be {x:#,y:#,sx:#,sy#} where s vars are short for (s)ize
@returns {Boolean}
@function
@deprecated
*/
ping.Lib.intersects.box = function(a,b){
    return!( (b.x > (a.x+a.sx)) ||
             ((b.x + b.sx) < a.x) ||
             (b.y > (a.y + a.sy) ||
             (b.y + b.sy) < a.y)
    );
}
//ping.Lib.intersects.box = function(a,b){
//                return ping.Lib.intersects.boxContainsBox(a,b);
//                //b = 1 - 4
//               //a = A
//               //AUa upper left corner
//               if(a.x >= b.x && a.x <= b.x + b.sx && a.y >= b.y && a.y <= b.y + b.sy) return true;
//               //AUb upper right corner
//               if(a.x + a.sx >= b.x && a.x + a.sx <= b.x + b.sx  && a.y >= b.y && a.y <= b.y + b.sy ) return true;
//               //AUc lower right corner
//               if(a.x + a.sx >= b.x && a.x + a.sx <= b.x + b.sx && a.y + a.sy >= b.y && a.y + a.sy <= b.y + b.sy) return true;
//               //AUd lower left corner
//               if(a.x >= b.x && a.x <= b.x + b.sx && a.y + a.sy >= b.y && a.y + a.sy <= b.y + b.sy) return true;
//
//               if(b.x >= a.x && b.x <= a.x + a.sx && b.y >= a.y && b.y <= a.y + a.sy) return true;
//               //AUb upper right corner
//               if(b.x + b.sx >= a.x && b.x + b.sx <= a.x + a.sx  && b.y >= a.y && b.y <= a.y + a.sy ) return true;
//               //AUc lower right corner
//               if(b.x + b.sx >= a.x && b.x + b.sx <= a.x + a.sx && b.y + b.sy >= a.y && b.y + b.sy <= a.y + a.sy) return true;
//               //AUd lower left corner
//               if(b.x >= a.x && b.x <= a.x + a.sx && b.y + b.sy >= a.y && b.y + b.sy <= a.y + a.sy) return true;
//
//               return false;
//
//            }

/**
@todo Come back to these
*/
//ping.Lib.Point.prototype.dist = function(o){
//    var tX = Math.pow(this.x - o.x, 2);
//    var tY = Math.pow(this.y - o.y, 2);
//    return Math.sqrt((tX) + (tY))
//}
//
//ping.Lib.Point.prototype.slope = function(o){
//    (this.y - o.y) / (this.x - o.x);
//}
//
//
//
//ping.Lib.Line.prototype.COINCIDENT   = 0x1 << 1;
//ping.Lib.Line.prototype.PARALLEL     = 0x1 << 2;
//ping.Lib.Line.prototype.NO_INTERSECT = 0x1 << 3;
//ping.Lib.Line.prototype.INTERSECT    = 0x1 << 4;
//
//ping.Lib.Line.prototype.slope = function(firstForm){
//
//    return this.begin.slope(this.end);
//}
//
//ping.Lib.Line.prototype.dist = function(){
//    return this.begin.dist(this.end);
//}
//
//
//ping.Lib.Line.prototype.intersect = function (a,b) {
//
//    //TODO - recyle slopes to cut down expressions
//    var denom =   ((o.end.y - o.begin.y) * (this.end.x - this.begin.x)) - ((o.end.x - o.begin.x) * (this.end.y - this.begin.y));
//    var nume_a =  ((o.end.x - o.begin.x) * (this.begin.y - o.begin.y)) - ((o.end.y  - o.begin.y) * (this.begin.x - o.begin.x));
//    var nume_b =  ((this.end.x - this.begin.x) * (this.begin.y - o.begin.y)) - ((this.end.y - this.begin.y) * (this.begin.x - o.begin.x));
//
//    if (denom == 0) {
//        if (nume_a == 0 && nume_b == 0) {
//            return [this.COINCIDENT];
//        } else {
//            return [this.PARALLEL];
//        }
//
//    }
//    var ua = nume_a / denom;
//    var ub = nume_b / denom;
//
//    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
//        var x = this.begin.x + ua * (this.end.x - this.begin.x);
//        var y = this.begin.y + ua * (this.end.y - this.begin.y);
//        return [this.INTERSECT, x, y];
//    }
//
//    return [this.NO_INTERSECT];
//
//};
/**
@namespace
*/
/**
@function
@deprecated
*/
ping.Lib.MainLoop = function(){
                var self = this;
                var tickTime = 10; //How many times to rerun through the game loop in MS

                // Constant function queue
                self.constantList = [];

                //List of functions to be run per tick as needed
                self.runQueue = [];
                /**
                 *The logic loop's interval ID
                 */
                var runnerHandle = null;
                self.logicLoop = function(){
                    $.each(self.constantList, function(index, handler){
                        try{
                            handler();
                        }catch(err){
                            console.debug(err);
                            self.stop();
                        }
                    });

                    if(self.runQueue.length > 0){
                        var func = runQueue.shift();
                        func();
                    }
                }

                self.start = function(){
                    runnerHandle = setInterval(self.logicLoop, tickTime);
                }
                self.stop = function(){
                    clearInterval(runnerHandle);
                }
            };

/**
@namespace
*/
ping.Lib = ping.Lib || {};
ping.Shapes = ping.Shapes || {};
//ping.namespace("ping.Lib");




/**
  Return the distance between two points
*/
ping.Lib.pointDistance = function(x1,y1,x2,y2){
        var tX = Math.pow(x1 - x2, 2);
        var tY = Math.pow(y1 - y2, 2);
        return Math.sqrt((tX) + (tY));
}

/**
A point object
@class
*/
ping.Lib.Point = function (x, y) {
        this.x = x;
        this.y = y;
    };



/**
Distance between two points
@function
*/
ping.Lib.Point.prototype.dist = function (o) {
    return ping.Lib.pointDistance(this.x,o.x,this.y,o.y);
};


/**
 *Bad design choice
 *@deprecated */
ping.Lib.Point.prototype.slope = function (o) {
    return (this.y - o.y) / (this.x - o.x);
};



/**
A line class
@class
*/
ping.Lib.Line = function (begin, end) {
        this.begin = begin;
        this.end = end;
    };

//ping.Lib.Line.prototype =
ping.Lib.Line.prototype.COINCIDENT   = 0x1 << 1;
ping.Lib.Line.prototype.PARALLEL     = 0x1 << 2;
ping.Lib.Line.prototype.NO_INTERSECT = 0x1 << 3;
ping.Lib.Line.prototype.INTERSECT    = 0x1 << 4;

/**
@function
*/
ping.Lib.Line.prototype.slope = function (firstForm) {
    return this.begin.slope(this.end);
};

/**
Length of a line
@function
*/
ping.Lib.Line.prototype.dist = function () {
    return this.begin.dist(this.end);
};

/**
Given two lines, do they intersect?
@function
*/
ping.Lib.Line.prototype.intersect = function (o) {

        //TODO - recyle slopes to cut down expressions
        var denom =   ((o.end.y - o.begin.y) * (this.end.x - this.begin.x)) - ((o.end.x - o.begin.x) * (this.end.y - this.begin.y));
        var nume_a =  ((o.end.x - o.begin.x) * (this.begin.y - o.begin.y)) - ((o.end.y  - o.begin.y) * (this.begin.x - o.begin.x));
        var nume_b =  ((this.end.x - this.begin.x) * (this.begin.y - o.begin.y)) - ((this.end.y - this.begin.y) * (this.begin.x - o.begin.x));

        if (denom == 0) {
            if (nume_a == 0 && nume_b == 0) {
                return [this.COINCIDENT];
            } else {
                return [this.PARALLEL];
            }

        }
        var ua = nume_a / denom;
        var ub = nume_b / denom;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            var x = this.begin.x + ua * (this.end.x - this.begin.x);
            var y = this.begin.y + ua * (this.end.y - this.begin.y);
            return [this.INTERSECT, x, y];
        }

        return [this.NO_INTERSECT];

};

/**
@namespace
*/
ping.Lib = ping.Lib || {};
//ping.namespace("ping.lib.box");

//ping.lib.box.Intersect =

/**
@function
*/
ping.Lib.boxfactory = function (){
        var oP, size;
        switch(arguments.length){
                case 3:
                        oP = new ping.Lib.Point(arguments[0], arguments[1]);
                        size = arguments[2]
                        break;
                case 2:
                       oP = arguments[0];
                        size = arguments[1];
                        break;
                default:
                        throw new ping.Exception("ping.Lib.boxFactory expects (point, size) or (x, y, size) only");

        }

        var p1 = new ping.Lib.Point(oP.x, oP.y);
        var p2 = new ping.Lib.Point(oP.x + size, oP.y);
        var p3 = new ping.Lib.Point(oP.x + size, oP.y + size);
        var p4 = new ping.Lib.Point(oP.x, oP.y + size );

        var l1  = new ping.Lib.Line(p1, p2)
        var l2 = new ping.Lib.Line( l1.end, p3 );
        var l3 = new ping.Lib.Line( l2.end, p4);
        var l4 = new ping.Lib.Line( l3.end, l1.begin );
        return [l1,l2,l3,l4];
}

/**
@namespace
*/
ping.Lib = ping.Lib || {};

/**
Likely keep this around as I can't remember how it works.
As for what it does, it provided a way to track
the arrow keys to see if they were pressed or unpressed (up or down);

@deprecated
@lends
*/
ping.Lib.initInput = function(){
    /**
    @function
    */
    ping.Lib.Input = new function(){
        var self = this;
        var map    = { 38: "U", 40: "D", 37: "L", 39: "R" };
        self.state = { U: false, D: false, L: false, R: false };
        self.keydown = function(evnt){
            var mKey = map[evnt.which];
            if(mKey != "undefined"){
                self.state[mKey] = true;
            }
        }

        self.keyup = function(evnt){
            var mKey = map[evnt.which];
            if(mKey){
                self.state[mKey] = false;
            }
        }

        $(document).keydown(self.keydown);
        $(document).keyup(self.keyup);
    }
}
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


ping.Lib.Quadrant.prototype.render = function(ctx, depth, sx, sy){
    var px = sx || 1,
        py = sy || 1;
    ctx.strokeRect(this.x * px, this.y * py, px , py);
    if(this.ul) this.ul.render(ctx, depth -1, sx, sy);
    if(this.ur) this.ur.render(ctx, depth -1, sx, sy);
    if(this.lr) this.lr.render(ctx, depth -1, sx, sy);
    if(this.ll) this.ll.render(ctx, depth -1, sx, sy);

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
    "use strict";
    var temp = [], result, zone;

    if (ping.Lib.intersects.box(this, box)) {
        if (this.entity) {
            temp = temp.concat([this.entity])
        } else {
            for( var i = 0; i < this.zones.length; i++){
                zone = this[this.zones[i]];
                if (zone) {
                    result = zone.findBox(box);
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

ping.Math = ping.Math || {};


/**

width = 3
height = 3

0 1 2
3 4 5
6 7 8

[0,0] [1,0] [2,0]
[0,1] [1,1] [2,1]
[0,2] [1,2] [2,3]

0 1 2 3 4 5 6 7 8

given - [1,2]
(x1 * w3)+ y2  == 7

given - 7
$y = Math.floor(7/3) == 2
$x = 7 - ($y*3) == 1

*/
ping.Math.c2i = function(x,y, sw, sh) {
    return (x * sw) + y;
}

ping.Math.i2c = function(i, sw, sh) {
    var x = Math.floor(i/sw),
        y = i - (x*sh);
    return [x, y];
}

//function(x, y, width, height) {
//
//}
