/**
0 - 4 - 8 -12
1 - 5 - 9 -13
2 - 6 -10 -14
3 - 7 -11 -15
*/
function buildAbox() {
    var index = 0,
        grid = ping.QuadrantFactory(4,4);

    for (var w = 0; w < 4; w++) {
        for(var h = 0; h < 4; h++) {
            grid.add({x:w, y:h, sx:1,sy:1, index:index} );
            index += 1;
        }
    }
    return grid;
}

(function(){
    var my_ctx = document.getElementById("myc").getContext("2d"),
        grid = buildAbox(),
        scale_x = my_ctx.canvas.width / 4,
        scale_y = my_ctx.canvas.height / 4;
    grid.render(my_ctx,10, scale_x, scale_y);

})();


/**
    box A overlaps a, b, c, d
    box a, b , c, d do not overlap
    everything is inside e
*/

QUnit.test("Sanity check qTree", function(assert){
    var grid = buildAbox();

    assert.ok(grid.ul != null);
    assert.ok(grid.ur != null);
    assert.ok(grid.ll != null);
    assert.ok(grid.lr != null);

    assert.ok(grid.ul.ul != null);
    assert.ok(grid.ul.ur != null);
    assert.ok(grid.ul.ll != null);
    assert.ok(grid.ul.lr != null);

    assert.ok(grid.lr.ul != null);
    assert.ok(grid.lr.ur != null);
    assert.ok(grid.lr.ll != null);
    assert.ok(grid.lr.lr != null);

} );

QUnit.test("Quadrant->containsBox - returns correct boxes", function(assert) {
    var grid = buildAbox();

        //upper left
        assert.ok(grid.containsBox({x:0,y:0, sx: 2, sy: 2}));
        assert.ok(true  === grid.ul.containsBox({x:0,y:0, sx: 2, sy: 2}),"ll ul");
        assert.ok(false === grid.ur.containsBox({x:0,y:0, sx: 2, sy: 2}),"ll ur");
        assert.ok(false === grid.ll.containsBox({x:0,y:0, sx: 2, sy: 2}),"ll ll");
        assert.ok(false === grid.lr.containsBox({x:0,y:0, sx: 2, sy: 2}),"ll lr");

        //upper right
        assert.ok(grid.containsBox({x:2,y:0, sx: 2, sy: 2}));

        assert.ok(false === grid.ul.containsBox({x:2,y:0, sx: 2, sy: 2}), "ur lr");
        assert.ok(true  === grid.ur.containsBox({x:2,y:0, sx: 2, sy: 2}), "ur ur");
        assert.ok(false === grid.ll.containsBox({x:2,y:0, sx: 2, sy: 2}), "ur ll");
        assert.ok(false === grid.lr.containsBox({x:2,y:0, sx: 2, sy: 2}), "ur lr");


        //lower left
        assert.ok(grid.containsBox({x:0,y:2, sx: 2, sy: 2}));

        assert.ok(false === grid.ul.containsBox({x:0,y:2, sx: 2, sy: 2}), "ll ul");
        assert.ok(false === grid.ur.containsBox({x:0,y:2, sx: 2, sy: 2}), "ll ur");
        assert.ok(true  === grid.ll.containsBox({x:0,y:2, sx: 2, sy: 2}), "ll ll");
        assert.ok(false === grid.lr.containsBox({x:0,y:2, sx: 2, sy: 2}), "ll lr");




        //lower right
        assert.ok(grid.containsBox({x:2,y:2, sx: 2, sy: 2}));

        assert.ok(false == grid.ul.containsBox({x:2,y:2, sx: 2, sy: 2}), "lr ul");
        assert.ok(false == grid.ur.containsBox({x:2,y:2, sx: 2, sy: 2}), "lr ur");
        assert.ok(false == grid.ll.containsBox({x:2,y:2, sx: 2, sy: 2}), "lr ll");
        assert.ok(true ==  grid.lr.containsBox({x:2,y:2, sx: 2, sy: 2}), "lr lr");
});


QUnit.test("Quadrant->find is correct", function(assert){
    var grid = buildAbox(),
        //boxes = [
        //    {x:0,y:0, sx: 2, sy: 2}, //ul
        //    {x:2,y:0, sx: 2, sy: 2}, //ur
        //    {x:0,y:2, sx: 2, sy: 2}, //ll
        //    {x:2,y:2, sx: 2, sy: 2}  //lr
        //]
        result1 = grid.find(0,1),
        result2 = grid.find(0,3),
        result3 = grid.find(1,1),
        result4 = grid.find(1,3);

        assert.ok(result1[2].name == "root->ul->ll");
        assert.ok(result2[2].name == "root->ll->ll");
        assert.ok(result3[2].name == "root->ul->lr");
        assert.ok(result4[2].name == "root->ll->lr");
});


QUnit.test("Quadrant->findBox is correct", function(assert){
    var grid = buildAbox();

    debugger;
    //There's an off by 1 error in here somewhere!
    var boxesUl = grid.findBox({x:0, y:0 , sx: 1, sy: 1}),
        boxesLR = grid.findBox({x:3, y:3 , sx: 1, sy: 1}),
        center  = grid.findBox({x:1, y:1 , sx: 0, sy: 0}),
        left    = grid.findBox({x:0, y:0 , sx: 1, sy: 3}),
        right   = grid.findBox({x:3, y:0 , sx: 2, sy: 3});

        debugger;
        assert.ok(boxesUl.length == 4, "Expects ul to eq 4 got " + boxesUl.length);
        assert.ok(boxesLR.length == 4, "Expects lr to eq 4 got " + boxesLR.length);
        assert.ok(center.length == 4, "Expects center to eq 4 got " + center.length);
        assert.ok(left.length == 8, "Expects left to eq 8 got " + left.length);
        assert.ok(right.length == 8, "Expects right to eq 8 got " + right.length);



});
