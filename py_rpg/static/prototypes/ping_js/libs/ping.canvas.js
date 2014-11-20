/**
 *Canvas additions library
 *
 *Adds some useful new methods and helpers to the canvas
 *Instance
 *
 */
ping.namespace("ping.Lib");

/**
 *A canvas instance manager
 *
 *It's pretty rare to create & destroy canvas's from the DOM
 *so it make sense to an extent to try and cache the reference
 *to the 2d Rendering context...thereby avoiding continual
 *DOM getElementBy Id calls.
 *
 *This is considered an internal library utility and shouldn't
 *be called directly
 */
ping.Lib.CnvMan = function(){
     this.refs = {};
     this.count = 0;
}
ping.Lib.CnvMan.prototype._set = function(id, ref){
   this.refs[id] = ref;
   this.count += 1;
}
ping.Lib.CnvMan.prototype.get = function(id){
    if( typeof this.refs[id]  == "undefined"){
         this._set(id, ping.Lib.$C(id));
    }
    return this.refs[id];
}

ping.Lib.CnvMan.prototype.set = function(id, reference){
    if( typeof this.refs[id] == "undefined"){
         this._set(id, reference);
    }
    return this.refs[id];
}
ping.Lib.CnvMan.prototype.exists = function(id){
   return typeof this.refs[id] != "undefined";
}


/**
 *Keeps a record of every extended canvas made
 */
ping.cMngr = new ping.Lib.CnvMan();


/**
 *Utility to instantiate/retrieve the 2d Rendering context of canvas tags
 *
 *This is also a future safe measure in case the 2d Rendering context should ever change,
 *all of the add on methods can be bound at call time instead of compile time.
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
 *@deprecated
 *Initially was meant to be a utility to ensure
 *drawing sections of code were always wrapped with a begin..end path calls
 *
 *Unfortunately this turned out to be an amazing nightmare performance
 *killing swamp.  Closures and very high performance DO NOT mix!
 */
CanvasRenderingContext2D.prototype.render = function(block){
                        this.beginPath();
                        //@TODO add try/catch here?
                        block.call(this);
                        this.closePath();
                        return this;
}


/**
 *A utility to take ping Point classes and render out a line.
 *
 *Currently not used anywhere
 */
CanvasRenderingContext2D.prototype.drawLine = function(p1, p2){ this.line(p1,p2); };
    
    
/**
 *Given a Radi & angle value, return points on a circle
 *
 *This is heavily used by the PingGame itself so should be considered stable
 *
 *@param {inter} Radius is the distence from the x,y coordinates
 *@param {float} angle is a relatively sane angle from 0-360
 *@param {float} x is the x coordinate for the center of the circle
 *@param {float} y is the y coordinate for the center of the circle
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
 *
 */
CanvasRenderingContext2D.prototype.line = function(p1, p2){
                    this.moveTo(p2.x, p2.y);                        
                    this.lineTo(p1.x, p1.y);            
                };
    
CanvasRenderingContext2D.prototype.circle = function(x, y, radius) {
                        return this.arc(x, y, radius, 0, Math.PI* 2, true);
                        };
                        
CanvasRenderingContext2D.prototype.drawCircle = function(x, y, radius){
                        this.beginPath();
                        this.circle(x,y,radius);
                        this.closePath();
}
CanvasRenderingContext2D.prototype.pixel    = function(point, color){
                        this.save();
                        this.moveTo(point[0],point[1]);
                        this.fillStyle = color;
                        this.fillRect(point[0],point[1],1,1);
                        this.restore();
}
CanvasRenderingContext2D.prototype.putPixel = function(x,y, color){
                        if(arguments.length == 1){
                          var point = x;
                        }else{
                          var point = [x,y];
                        }
                        color = color || "white";
                        this.pixel(point, color)
    }

CanvasRenderingContext2D.prototype.floodFill = function(color){
                        this.save();
                        this.fillStyle  = color;                 
                        this.fillRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);                     
                        this.restore();
                        }

CanvasRenderingContext2D.prototype.clearAll = function(color){
                        this.clearRect(0,0,this.canvas.clientWidth, this.canvas.clientHeight );
                        }

CanvasRenderingContext2D.prototype.maxHeight = function(){
     return this.canvas.clientHeight;
}

CanvasRenderingContext2D.prototype.maxWidth = function(){
     return this.canvas.clientWidth;
}


//To allow for documentation detection
ping.Lib.CanvasRenderingContext2D = CanvasRenderingContext2D;