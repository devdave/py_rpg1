/**
    Prototype 1 goals

    Make a grid of squares proportioned to the canvas tag.
    Encapsulate the building logic
    space the squares out so that a thin grid of lines connects to the
    center of each square.

    keep forgetting this crap
    X == width
    Y == height

*/
function renderBox(ctx, x, y, h, w, fill) {
    "use strict";

    ctx.beginPath();

    if (fill === true) {
        ctx.fillRect(x, y, h, w);
    } else {
        ctx.strokeRect(x, y, h, w);
    }
}

        function interconnectLines(ctx,
                bX, //Top left corner
                bY, //Top left corner
                bW, // width
                bH, //Height - TODO abstract box to an object
                doHorz, //Optional
                doVert  //Optional
                ) {

            if (doHorz === false && doVert === false) {
                return;
            }

            //horizontal first
            //we want to draw from the middle of the box to the next
            //box over.  It is assumed that higher level
            //logic above this ensure's there IS in fact box

            //The target is the boxes's center
            var halfW = bW / 2,
                halfH = bH / 2,
                boxRight = { x: bX + bW + halfW, y: bY + halfH  },
                boxDown  = { x: bX, y: bY + bH },
                boxCur   = { x: bX, y: bY };


                console.log(arguments, halfW, halfH);
                function center(){
                    ctx.moveTo(boxCur.x + halfW, boxCur.y + halfH);
                }
                ctx.save();
                ctx.beginPath()

                if (doHorz) {
                    //It's just a step to the right!

                    //Current to right
                    center();
                    ctx.lineTo(boxRight.x, boxRight.y );
                }


                //Current to bottom
                if (doVert) {

                    center();
                    ctx.lineTo(boxDown.x + halfW, boxDown.y + halfH);

                }

                ctx.stroke();
                ctx.restore();

                return;

        }

        (function(){
            var map_cnv = document.getElementById("map_cnv"),
                map_ctx = map_cnv.getContext("2d");

                //Make all of the lines crisper
                map_ctx.translate(.5, .5);


            var cWidth = map_cnv.width,
                cHeight = map_cnv.height,

                squareRowCnt = 3,
                gridRowCnt = 3,

                squareColCnt = 3,
                gridColCnt = 3,
                boxWidth = cWidth / squareColCnt,
                boxHeight = cHeight / squareRowCnt,

                squareMaxRowSize = cWidth / squareRowCnt,
                squareMaxColSize = cHeight / squareColCnt,
                squareInsetDepth = 0.10,
                squareInsetX = squareMaxColSize * (squareInsetDepth*2),
                squareInsetY = squareMaxRowSize * squareInsetDepth,
                squareInsetH = squareMaxRowSize - (squareInsetX*2),
                squareInsetW = squareMaxColSize - squareInsetY*2,
                showPerimeter = true,
                showBox = true,
                showLine = true,
                xPos = 0,
                yPos = 0,
                halfX = 0,
                halfY = 0,
                nextX = 0,
                nextY = 0;

                console.log("height", map_cnv.width);
                console.log("width", map_cnv.height);

                console.log(map_cnv.width, map_cnv.height);



                map_ctx.strokeStyle = "black";
                map_ctx.save();
                map_ctx.beginPath()



                for (var r = 0; r < squareColCnt; r++) {
                    //Been a while since I've worked with c++ ;)

                    for(var c = 0; c < squareRowCnt; c++) {

                        xPos = c*squareMaxRowSize;
                        yPos = r*squareMaxColSize;


                        map_ctx.moveTo(xPos,yPos);

                        if (showPerimeter) {

                            map_ctx.save();
                            map_ctx.strokeStyle = "black";
                            renderBox(map_ctx, xPos, yPos, squareMaxRowSize, squareMaxColSize );

                            map_ctx.restore()
                        }

                        if (showLine) {
                            console.log(c,r);
                            map_ctx.strokeStyle = "orange";
                            interconnectLines(
                                map_ctx,
                                xPos,
                                yPos,
                                boxWidth,
                                boxHeight,
                                c+1 < squareColCnt,
                                r+1 < squareRowCnt
                            );

                        }


                        if (showBox) {
                            map_ctx.save()
                            map_ctx.fillStyle = "blue";
                            renderBox(map_ctx,
                                       xPos + squareInsetX,
                                       yPos + squareInsetY,
                                       squareInsetH,
                                       squareInsetW,
                                       true
                            );
                            map_ctx.restore()

                        }


                    }


                }
                //map_ctx.stroke();
                map_ctx.restore();



        })()
