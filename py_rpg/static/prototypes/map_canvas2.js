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

    "use strict";

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
        boxDown  = { x: bX + halfW, y: bY + bH + halfH },
        boxCur   = { x: bX, y: bY };


    function center() {
        ctx.moveTo(boxCur.x + halfW, boxCur.y + halfH);
    }
    ctx.save();
    ctx.beginPath();

    if (doHorz) {
        //It's just a step to the right!
        center();
        ctx.lineTo(boxRight.x, boxRight.y);
    }

    if (doVert) {
        //And then a jump down!
        center();
        ctx.lineTo(boxDown.x, boxDown.y);

    }

    ctx.stroke();
    ctx.restore();

    return;
}

function initialize_map(map, gridColCnt, gridRowCnt) {
    "use strict";
    var map_cnv = document.getElementById("map_cnv"),
        map_ctx = map_cnv.getContext("2d"),
        cWidth = map_cnv.width,
        cHeight = map_cnv.height,

        boxWidth = cWidth / gridColCnt,
        boxHeight = cHeight / gridRowCnt,

        squareInsetDepth = 0.30,
        insetWidth = boxWidth * squareInsetDepth,
        insetHeight = boxHeight * squareInsetDepth,
        //squareMaxRowSize = cWidth / gridRowCnt,
        //squareMaxColSize = cHeight / gridColCnt,


        //squareInsetX = boxWidth * (squareInsetDepth * 2),
        //squareInsetY = boxHeight * squareInsetDepth,
        //squareInsetH = boxHeight - (squareInsetX * 2),
        //squareInsetW = boxWidth - squareInsetY * 2,
        showPerimeter = true,
        showBox = true,
        showLine = true,
        xPos = 0,
        yPos = 0;
        //halfX = 0,
        //halfY = 0,
        //nextX = 0,
        //nextY = 0;

    //Make all lines crisper
    map_ctx.translate(0.5, 0.5);

    map_ctx.strokeStyle = "black";
    map_ctx.save();
    map_ctx.beginPath();



    for (var r = 0; r < gridColCnt; r++) {
        //Been a while since I've worked with c++ ;)

        for(var c = 0; c < gridRowCnt; c++) {

            xPos = c*boxWidth;
            yPos = r*boxHeight;


            map_ctx.moveTo(xPos,yPos);

            if (showPerimeter) {

                map_ctx.save();
                map_ctx.strokeStyle = "black";
                renderBox(map_ctx, xPos, yPos, boxWidth, boxHeight );

                map_ctx.restore();
            }

            if (showLine) {

                map_ctx.strokeStyle = "orange";
                interconnectLines(
                    map_ctx,
                    xPos,
                    yPos,
                    boxWidth,
                    boxHeight,
                    c+1 < gridRowCnt,
                    r+1 < gridColCnt
                );

            }


            if (showBox) {
                map_ctx.save();
                map_ctx.fillStyle = "blue";
                /**
                    I wrote this and it still confused
                    me when I pass over it.

                    So we want the interior square to have
                    10% padding around it.

                    So 1st two arguments, we move our box
                    down and right by 10%... BUT the box
                    itself is still 100% sized.

                    We still want 10% padding per side.
                    left + right + box.width must equal 100

                    the 2 & 3rd argument + inset H & W
                    only pushes the box 10% down and 10% right
                    but the box is still 100%.

                    So for arguments 4 & 5, you shrink the
                    box by 20% so that you get 10% padding
                    on all sides.

                */
                renderBox(map_ctx,
                           xPos + insetWidth,
                           yPos + insetHeight,
                           boxWidth - ( insetWidth * 2),
                           boxHeight - ( insetHeight * 2) ,
                           true
                );
                map_ctx.restore();


            }


        }


    }
    //map_ctx.stroke();
    map_ctx.restore();



};
