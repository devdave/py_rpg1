var ping={"Lib":{}};ping.namespace=function(ns,toApply){var elements=ns.split(".");var root=window[elements[0]]=window[elements[0]]||{};for(var i=1;i<elements.length;i++)root=root[elements[i]]=root[elements[i]]||{};return root};ping.w=function(target,toApply){toApply.call(target.prototype)};ping.Exception=function(message,scope){this.message=message;this.scope=scope};ping.Exception.prototype.toString=function(){return"ping.Exception( "+this.message+", ... );"};ping.CTX=null;ping.Lib=ping.Lib||{};ping.Lib.CnvMan=function(){this.refs={}};ping.Lib.CnvMan.prototype._set=function(id,ref){this.refs[id]=ref};ping.Lib.CnvMan.prototype.get=function(id){if(typeof this.refs[id]=="undefined")this._set(id,ping.Lib.$C(id));return this.refs[id]};ping.Lib.CnvMan.prototype.set=function(id,reference){if(typeof this.refs[id]=="undefined")this._set(id,reference);return this.refs[id]};ping.Lib.CnvMan.prototype.exists=function(id){return typeof this.refs[id]!="undefined"};ping.cMngr=new ping.Lib.CnvMan;
ping.$C=function(elemId){if(ping.cMngr.exists(elemId))return ping.cMngr.get(elemId);var element=document.getElementById(elemId);var ref=element.getContext("2d");return ping.cMngr.set(elemId,ref)};CanvasRenderingContext2D.prototype.render=function(block){this.beginPath();block.call(this);this.closePath();return this};CanvasRenderingContext2D.prototype.rayGen=function(Radius,angle,x,y){var radian=angle*Math.PI/180;var lx=Radius*Math.cos(radian)+x;var ly=Radius*Math.sin(radian)+y;return[lx,ly]};
CanvasRenderingContext2D.prototype.elipGen=function(Radius,angle,originX,originY,ratio){ratio=1.8;var radian=angle*Math.PI/180;var lx=Radius*(Math.cos(radian)*ratio)+originX;var ly=Radius*(Math.sin(radian)*0.5)+originY;return[lx,ly]};CanvasRenderingContext2D.prototype.line=function(p1,p2){this.moveTo(p2.x,p2.y);this.lineTo(p1.x,p1.y)};CanvasRenderingContext2D.prototype.drawLine=CanvasRenderingContext2D.prototype.line;
CanvasRenderingContext2D.prototype.circle=function(x,y,radius){return this.arc(x,y,radius,0,Math.PI*2,true)};CanvasRenderingContext2D.prototype.drawCircle=function(x,y,radius){this.beginPath();this.circle(x,y,radius);this.closePath()};CanvasRenderingContext2D.prototype.pixel=function(point,color){this.save();this.moveTo(point[0],point[1]);this.fillStyle=color;this.fillRect(point[0],point[1],1,1);this.restore()};
CanvasRenderingContext2D.prototype.putPixel=function(x,y,color){if(arguments.length==1)var point=x;else var point=[x,y];color=color||"white";this.pixel(point,color)};CanvasRenderingContext2D.prototype.floodFill=function(color){this.save();this.fillStyle=color;this.fillRect(0,0,this.canvas.clientWidth,this.canvas.clientHeight);this.restore()};CanvasRenderingContext2D.prototype.clearAll=function(color){this.clearRect(0,0,this.canvas.width,this.canvas.height)};
CanvasRenderingContext2D.prototype.maxHeight=function(){return this.canvas.clientHeight};CanvasRenderingContext2D.prototype.maxWidth=function(){return this.canvas.clientWidth};ping.Lib.CanvasRenderingContext2D=CanvasRenderingContext2D;ping.Lib=ping.Lib||{};ping.Lib.intersects=ping.Lib.intersects||{};ping.Lib.intersects.boxContainsBox=function(a,b){return Math.abs(a.x-b.x)*2<a.sx+b.sx&&Math.abs(a.y-b.y)*2<a.sy+b.sy};ping.Lib.intersects.box=function(a,b){return!(b.x>a.x+a.sx||(b.x+b.sx<a.x||(b.y>a.y+a.sy||b.y+b.sy<a.y)))};ping.Lib.MainLoop=function(){var self=this;var tickTime=10;self.constantList=[];self.runQueue=[];var runnerHandle=null;self.logicLoop=function(){$.each(self.constantList,function(index,handler){try{handler()}catch(err){console.debug(err);self.stop()}});if(self.runQueue.length>0){var func=runQueue.shift();func()}};self.start=function(){runnerHandle=setInterval(self.logicLoop,tickTime)};self.stop=function(){clearInterval(runnerHandle)}};ping.Lib=ping.Lib||{};ping.Shapes=ping.Shapes||{};ping.Lib.pointDistance=function(x1,y1,x2,y2){var tX=Math.pow(x1-x2,2);var tY=Math.pow(y1-y2,2);return Math.sqrt(tX+tY)};ping.Lib.Point=function(x,y){this.x=x;this.y=y};ping.Lib.Point.prototype.dist=function(o){return ping.Lib.pointDistance(this.x,o.x,this.y,o.y)};ping.Lib.Point.prototype.slope=function(o){return(this.y-o.y)/(this.x-o.x)};ping.Lib.Line=function(begin,end){this.begin=begin;this.end=end};ping.Lib.Line.prototype.COINCIDENT=1<<1;
ping.Lib.Line.prototype.PARALLEL=1<<2;ping.Lib.Line.prototype.NO_INTERSECT=1<<3;ping.Lib.Line.prototype.INTERSECT=1<<4;ping.Lib.Line.prototype.slope=function(firstForm){return this.begin.slope(this.end)};ping.Lib.Line.prototype.dist=function(){return this.begin.dist(this.end)};
ping.Lib.Line.prototype.intersect=function(o){var denom=(o.end.y-o.begin.y)*(this.end.x-this.begin.x)-(o.end.x-o.begin.x)*(this.end.y-this.begin.y);var nume_a=(o.end.x-o.begin.x)*(this.begin.y-o.begin.y)-(o.end.y-o.begin.y)*(this.begin.x-o.begin.x);var nume_b=(this.end.x-this.begin.x)*(this.begin.y-o.begin.y)-(this.end.y-this.begin.y)*(this.begin.x-o.begin.x);if(denom==0)if(nume_a==0&&nume_b==0)return[this.COINCIDENT];else return[this.PARALLEL];var ua=nume_a/denom;var ub=nume_b/denom;if(ua>=0&&(ua<=
1&&(ub>=0&&ub<=1))){var x=this.begin.x+ua*(this.end.x-this.begin.x);var y=this.begin.y+ua*(this.end.y-this.begin.y);return[this.INTERSECT,x,y]}return[this.NO_INTERSECT]};ping.Lib=ping.Lib||{};
ping.Lib.boxfactory=function(){var oP,size;switch(arguments.length){case 3:oP=new ping.Lib.Point(arguments[0],arguments[1]);size=arguments[2];break;case 2:oP=arguments[0];size=arguments[1];break;default:throw new ping.Exception("ping.Lib.boxFactory expects (point, size) or (x, y, size) only");}var p1=new ping.Lib.Point(oP.x,oP.y);var p2=new ping.Lib.Point(oP.x+size,oP.y);var p3=new ping.Lib.Point(oP.x+size,oP.y+size);var p4=new ping.Lib.Point(oP.x,oP.y+size);var l1=new ping.Lib.Line(p1,p2);var l2=
new ping.Lib.Line(l1.end,p3);var l3=new ping.Lib.Line(l2.end,p4);var l4=new ping.Lib.Line(l3.end,l1.begin);return[l1,l2,l3,l4]};ping.Lib=ping.Lib||{};ping.Lib.initInput=function(){ping.Lib.Input=new function(){var self=this;var map={38:"U",40:"D",37:"L",39:"R"};self.state={U:false,D:false,L:false,R:false};self.keydown=function(evnt){var mKey=map[evnt.which];if(mKey!="undefined")self.state[mKey]=true};self.keyup=function(evnt){var mKey=map[evnt.which];if(mKey)self.state[mKey]=false};$(document).keydown(self.keydown);$(document).keyup(self.keyup)}};ping.Lib.util=ping.Lib.util||{};ping.Lib.util.inside=function(pos,low,high){return pos>=low&&pos<=high};ping.Lib.util.insideBox=function(x,y,box){var eX=box.x||box[0];var eY=box.y||box[1];var sx=box.sx||box[2];var sy=box.sy||box[3];return ping.Lib.util.inside(x,eX,eX+sx)&&ping.Lib.util.inside(y,eY,eY+sy)};
ping.Lib.Quadrant=function(x,y,sx,sy,depth,name){this.x=x;this.y=y;this.sx=sx;this.sy=sy;this.depth=depth-1;this.entity=undefined;this.name=name||"root";this.zones=["ul","ur","ll","lr"];this.ul=null;this.ll=null;this.ur=null;this.lr=null};
ping.Lib.Quadrant.prototype.ulAddIf=function(entity){var box=[this.x,this.y,this.sx/2,this.sy/2];if(ping.Lib.util.insideBox(entity.x,entity.y,box)){if(this.ul===null)this.ul=new ping.Lib.Quadrant(box[0],box[1],box[2],box[3],this.depth-1,this.name+"->ul");this.ul.add(entity);return true}return false};
ping.Lib.Quadrant.prototype.urAddIf=function(entity){var box=[this.x+this.sx/2,this.y,this.sx/2,this.sy/2];if(ping.Lib.util.insideBox(entity.x,entity.y,box)){if(this.ur===null)this.ur=node=new ping.Lib.Quadrant(box[0],box[1],box[2],box[3],this.depth-1,this.name+"->ur");this.ur.add(entity);return true}return false};
ping.Lib.Quadrant.prototype.llAddIf=function(entity){var box=[this.x,this.y+this.sy/2,this.sx/2,this.sy/2];if(ping.Lib.util.insideBox(entity.x,entity.y,box)){if(this.ll===null)this.ll=new ping.Lib.Quadrant(box[0],box[1],box[2],box[3],this.depth-1,this.name+"->ur");this.ll.add(entity);return true}return false};
ping.Lib.Quadrant.prototype.lrAddIf=function(entity){var box=[this.x+this.sx/2,this.y+this.sy/2,this.sx/2,this.sy/2];if(ping.Lib.util.insideBox(entity.x,entity.y,box)){if(this.lr===null)this.lr=new ping.Lib.Quadrant(box[0],box[1],box[2],box[3],this.depth-1,this.name+"->lr");this.lr.add(entity);return true}return false};ping.Lib.Quadrant.prototype.contains=function(x,y){throw new Error("Deprecated!");return x>this.x&&x<this.x+this.sx&&(y>this.y&&y<this.y+this.sy)};
ping.Lib.Quadrant.prototype.containsBox=function(box){return box.x==this.x&&box.x==this.x+this.sx&&(box.y==this.y&&box.y==this.y+this.sy)||box.x>=this.x&&box.x<this.x+this.sx&&(box.y>=this.y&&box.y<this.y+this.sy)};ping.Lib.Quadrant.prototype.getAll=function(){var temp=[],zones=["ul","ur","lr","ll"];if(this.entity!=null)temp.push(this.entity);else for(var i=0;i<zones.length;i++)if(this[zones[i]]!=null)temp=temp.concat(this[zones[i]].getAll());return temp};
ping.Lib.Quadrant.prototype.addIf=function(entity){var box,zones={ul:[this.x,this.y,this.sx/2,this.sy/2],ur:[this.x+this.sx/2,this.y,this.sx/2,this.sy/2],ll:[this.x,this.y+this.sy/2,this.sx/2,this.sy/2],lr:[this.x+this.sx/2,this.y+this.sy/2,this.sx/2,this.sy/2]},zone;for(zone in zones)if(zones.hasOwnProperty(zone)){box=zones[zone];if(entity.x>=box[0]&&(entity.x<box[0]+box[2]&&(entity.y>=box[1]&&entity.y<box[1]+box[3]))){if(this[zone]===null)this[zone]=new ping.Lib.Quadrant(box[0],box[1],box[2],box[3],
this.depth-1,this.name+"->"+zone);this[zone].add(entity);return true}}return false};ping.Lib.Quadrant.prototype.add=function(new_entity){var box,result=false;if(this.entity===null){result=this.addIf(new_entity);if(result==false)throw new ping.Exception("Unable to find zone to add entity!",[this,new_entity]);else return result}else{if(this.entity)this.divide(new_entity);else this.entity=new_entity;return true}throw new ping.Exception("Unable to add entity!",[this,entity]);return false};
ping.Lib.Quadrant.prototype.divide=function(new_entity){var failures=[],zones=["lr","ur","ll","lr"],added,result;result=this.addIf(new_entity);if(result==false)throw new ping.Exception("Could no divide Quadrant! Entity would be lost!",[this,new_entity,i]);old_result=this.addIf(this.entity);if(result==false)throw new ping.Exception("Could no divide Quadrant! Entity would be lost!",[this,entity,i]);this.entity=null};
ping.Lib.Quadrant.prototype.render=function(ctx,depth,sx,sy){var px=sx||1,py=sy||1;ctx.strokeRect(this.x*px,this.y*py,px,py);if(this.ul)this.ul.render(ctx,depth-1,sx,sy);if(this.ur)this.ur.render(ctx,depth-1,sx,sy);if(this.lr)this.lr.render(ctx,depth-1,sx,sy);if(this.ll)this.ll.render(ctx,depth-1,sx,sy)};
ping.Lib.Quadrant.prototype.loop=function(block){console.error("Deprecated, non-performent!");var retvals=[];var points=["ul","ll","ur","lr"];for(var i=0;i<points.length;i++)if(this[points[i]]instanceof ping.Lib.Quadrant)retvals.push(block.call(this[points[i]],points[i]));return retvals};
ping.Lib.Quadrant.prototype.find=function(x,y){var myTargets=[];if(x>=this.x&&(x<this.x+this.sx&&(y>=this.y&&y<this.y+this.sy))){myTargets.push(this);if(this.entity===null){var temp=[];if(this.ul)temp=temp.concat(this.ul.find(x,y,myTargets));if(this.ur)temp=temp.concat(this.ur.find(x,y,myTargets));if(this.lr)temp=temp.concat(this.lr.find(x,y,myTargets));if(this.ll)temp=temp.concat(this.ll.find(x,y,myTargets));return myTargets.concat(temp)}}return myTargets};
ping.Lib.Quadrant.prototype.findBox=function(box){var temp=[],result,zone;if(ping.Lib.intersects.box(this,box))if(this.entity)temp=temp.concat([this.entity]);else for(var i=0;i<this.zones.length;i++){zone=this[this.zones[i]];if(zone){result=zone.findBox(box);temp=temp.concat(result)}}return temp};ping.QuadrantFactory=function(width,height,max){return new ping.Lib.Quadrant(0,0,width,height,max||4)};ping.Math=ping.Math||{};ping.Math.c2i=function(x,y,sw,sh){return x*sw+y};ping.Math.i2c=function(i,sw,sh){var x=Math.floor(i/sw),y=i-x*sh;return[x,y]};ping.Math.clamp=function(z,min,max){if(z<min)return min;else if(z>max)return max;return z};
