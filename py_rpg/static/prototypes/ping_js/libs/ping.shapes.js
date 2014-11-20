

ping.namespace("ping.Lib");

ping.Lib.pointDistance = function(x1,y1,x2,y2){
        var tX = Math.pow(x1 - x2, 2);
        var tY = Math.pow(y1 - y2, 2);
        return Math.sqrt((tX) + (tY));
}

ping.Lib.Point = function (x, y) {
        this.x = x;
        this.y = y;
    };


    

ping.Lib.Point.prototype.dist = function (o) {
    return ping.Lib.pointDistance(this.x,o.x,this.y,o.y);
};


/**
 *Bad design choice     
 *@deprecated */
ping.Lib.Point.prototype.slope = function (o) {
    return (this.y - o.y) / (this.x - o.x);
};



ping.Lib.Line = function (begin, end) {    
        this.begin = begin;
        this.end = end;    
    };

ping.Lib.Line.prototype = 
ping.Lib.Line.prototype.COINCIDENT   = 0x1 << 1;
ping.Lib.Line.prototype.PARALLEL     = 0x1 << 2;
ping.Lib.Line.prototype.NO_INTERSECT = 0x1 << 3;
ping.Lib.Line.prototype.INTERSECT    = 0x1 << 4;
    
ping.Lib.Line.prototype.slope = function (firstForm) {    
    return this.begin.slope(this.end);
};

ping.Lib.Line.prototype.dist = function () {
    return this.begin.dist(this.end);
};
    
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
    
ping.namespace("ping.lib.box");

ping.lib.box.Intersect = 

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