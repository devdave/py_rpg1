



(function(){
    var width = 3,
        height = 3,
        listmap = [
            0,1,2,
            3,4,5,
            6,7,8
        ],
        amap = [
            [0,1,2],
            [3,4,5],
            [6,7,8]
        ];

    function make_test(x, y, amap, listmap) {
        QUnit.test("Verify ["+x+"][" +y+ "]", function(assert){
            var i = ping.Math.c2i(x, y, 3, 3);
            assert.equal(i, listmap[i], i + " = " + i);
            var c = ping.Math.i2c(i, 3, 3);
            assert.equal(c[0],x, x + "=" + c[0]);
            assert.equal(c[1],y, y + "=" + c[1]);
            assert.deepEqual([c[0],c[1]], [x, y], "[" + c[0]+","+c[1]+"] = [" + x + ", " +y+"]");
            assert.ok(amap[x] != undefined, "amap[x] != undefined");
            assert.ok(amap[x][y] != undefined, "amap[x][y] != undefined");
        });
    }
    for (var y = 0; y < 3; y++ ) {
        for(var x = 0; x < 3; x++) {
            make_test(x, y, amap, listmap);
        }
    }
})()

