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
