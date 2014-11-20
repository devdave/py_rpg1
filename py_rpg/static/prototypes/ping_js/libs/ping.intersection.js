

ping.namespace("ping.Lib")
ping.namespace("ping.Lib.intersects")

ping.Lib.intersects.box = function(a,b){
                //b = 1 - 4
               //a = A
               //AUa upper left corner
               if(a.x >= b.x && a.x <= b.x + b.sx && a.y >= b.y && a.y <= b.y + b.sy) return true;
               //AUb upper right corner
               if(a.x + a.sx >= b.x && a.x + a.sx <= b.x + b.sx  && a.y >= b.y && a.y <= b.y + b.sy ) return true;
               //AUc lower right corner
               if(a.x + a.sx >= b.x && a.x + a.sx <= b.x + b.sx && a.y + a.sy >= b.y && a.y + a.sy <= b.y + b.sy) return true;
               //AUd lower left corner
               if(a.x >= b.x && a.x <= b.x + b.sx && a.y + a.sy >= b.y && a.y + a.sy <= b.y + b.sy) return true;
               
               if(b.x >= a.x && b.x <= a.x + a.sx && b.y >= a.y && b.y <= a.y + a.sy) return true;
               //AUb upper right corner
               if(b.x + b.sx >= a.x && b.x + b.sx <= a.x + a.sx  && b.y >= a.y && b.y <= a.y + a.sy ) return true;
               //AUc lower right corner
               if(b.x + b.sx >= a.x && b.x + b.sx <= a.x + a.sx && b.y + b.sy >= a.y && b.y + b.sy <= a.y + a.sy) return true;
               //AUd lower left corner
               if(b.x >= a.x && b.x <= a.x + a.sx && b.y + b.sy >= a.y && b.y + b.sy <= a.y + a.sy) return true;
               
               return false;
                
            }


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