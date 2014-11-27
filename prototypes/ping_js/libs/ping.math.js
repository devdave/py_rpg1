
ping.Math = ping.Math || {};


/**

width = 3
height = 3

0 1 2
3 4 5
6 7 8

[0,0] [1,0] [2,0]
[0,1] [1,1] [2,1]
[0,2] [1,2] [2,3]

0 1 2 3 4 5 6 7 8

given - [1,2]
(x1 * w3)+ y2  == 7

given - 7
$y = Math.floor(7/3) == 2
$x = 7 - ($y*3) == 1

*/
ping.Math.c2i = function(x,y, sw, sh) {
                    return (x * sw) + y;
                }

ping.Math.i2c = function(i, sw, sh) {
                    var x = Math.floor(i/sw),
                        y = i - (x*sh);
                    return [x, y];
                }

ping.Math.clamp = function(z, min, max) {
                    if (z < min) {
                        return min;
                    } else if (z > max){
                        return max;
                    }
                    return z;
                }


