ping.namespace("ping.Lib.ents");

debug = "Start";

(function(library){
    
        library.Entity = function(x,y,sx,sy,dx,dy, color){
                this.id = this.GUID();
                this.x = x;
                this.y = y;
                this.sx = sx;
                this.sy = sy;
                this.dx = dx;
                this.dy = dy;
                this.color = color || "blue";
                this.type = "UNK";
            }
            
            library.Entity.prototype.tick = function(){                
                this.x += this.dx;
                this.y += this.dy;
                
            }
            
            library.Entity.prototype.copy = function(){
                return new library.Entity(this.x, this.y, this.sx, this.sy, this.dx, this.dy, this.color);
            }
            
            library.Entity.prototype.render = function(ctx){                
                ctx.fillStyle = this.color;
                ctx.circle(Math.floor(this.x),Math.floor(this.y), this.sx);                
            }
            
            library.Entity.prototype.GUID = function(){
                return new Date().getTime() +
                (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + 
                (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
                (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            
            library.BoxEntity = function(x,y,sx,sy,dx,dy,color){
                this.base = library.Entity;
                this.base(x,y,sx,sy,dx,dy,color);                
            };
            
            library.BoxEntity.prototype = new library.Entity;
            /**
             *
             *@param {CanvasRenderingContext2D} ctx A reference to the target canvas
             */
            library.BoxEntity.prototype.render = function(ctx){
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.sx, this.sy );
                ctx.beginPath();
            }
            
}(ping.Lib.ents));

debug = "End";