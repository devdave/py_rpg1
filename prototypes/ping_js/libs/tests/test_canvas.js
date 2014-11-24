QUnit.test("CanvasRenderingContext2D.rayGen product is correct", function(assert) {

    var canvas = document.getElementById("myc"),
        ctx = canvas.getContext("2d");

    assert.ok( ctx['rayGen'] != undefined);

    CanvasRenderingContext2D.prototype.rayGen
    assert.ok( CanvasRenderingContext2D.prototype.rayGen != undefined);

    var pointList = [],
        step = .05,
        radius = 10,
        ox = 50,
        oy = 50,
        pos, xpoint, ypoint, rsquare;

    //Verify via the Equation of a circle http://en.wikipedia.org/wiki/Circle#Equations
    for (var i = 0; i < 360; i++) {
        pos = ctx.rayGen(radius, i, ox,oy);
        xpoint = Math.pow(pos[0]-ox,2);
        ypoint = Math.pow(pos[1]-oy,2)
        rsquare = Math.round(Math.pow(radius,2));

        assert.equal(Math.round(xpoint + ypoint), rsquare);

    }

});
