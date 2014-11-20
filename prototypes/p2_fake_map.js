
var roomCount = 0;

function r(x,y, connections ) {
    roomCount += 1;
    return {
        room_id: roomCount,
        x:x,
        y:y,
        connections: connections,
    }
}

var gridW = 30,
    gridH = 30,

    fakeMap = [
        r(10,4,{s:3, e:2}),
        r(11,4,{s:4,w:1}),
        r(10,5,{n:1,e:2}),
        r(11,5,{n:2,w:3}),
    ];

    map_lookup = {
        gridW: 30,
        gridH: 30,
        ids: {
            1:fakeMap[0],
            2:fakeMap[1],
            3:fakeMap[2],
            4:fakeMap[3]
        },
        x:{
            10:{

                4:fakeMap[0],
                5:fake[2]
            },
            11: {
                4:fakeMap[1],
                5:fakeMap[3]
            }
        }
    }
