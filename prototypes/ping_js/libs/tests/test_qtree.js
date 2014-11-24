function ar2box(ar){
    var box = {};
    box.x   = ar[0];
    box.y   = ar[1];
    box.sx  = ar[2];
    box.sy  = ar[3];
    return box;
}
var a = ar2box([0,0,100,100]), //a
    A = ar2box([50,50,125,125]), //A
    b = ar2box([125,0,100,100]), //b
    c = ar2box([125,125,100,100]), //b
    d = ar2box([0,125,100,100]),
    e = ar2box([0,0,550,350]),
    f = ar2box([10,10,200,50]),
    box     = [ e,  A,  a,  b,  c,  d],
    index   = ['e','A','a','b','c','d'];

/**
    box A overlaps a, b, c, d
    box a, b , c, d do not overlap
    everything is inside e
*/

QUnit.test("Sanity check qTree", function(assert){

});

