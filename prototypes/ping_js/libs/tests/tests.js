
QUnit.test("namespaces exist", function(assert){

    assert.ok( window['ping'] != undefined);
    assert.ok( window.ping.Lib != undefined);
    assert.ok( window.ping.Lib.intersects != undefined);
    assert.ok( window.ping.Lib.util != undefined);
})


