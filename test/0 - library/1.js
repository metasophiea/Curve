tester(_canvas_.library.math.cartesianAngleAdjust(0,0,0),{x:0,y:0});
tester(_canvas_.library.math.cartesianAngleAdjust(10,0,Math.PI),{x:-10,y:0});
tester(_canvas_.library.math.cartesianAngleAdjust(10,0,Math.PI*2),{x:10,y:0});
tester(_canvas_.library.math.cartesianAngleAdjust(10,0,Math.PI/2),{x:0,y:10});
tester(_canvas_.library.math.cartesianAngleAdjust(10,0,-Math.PI/2),{x:0,y:-10});
tester(_canvas_.library.math.cartesianAngleAdjust(10,0,Math.PI/4),{x:7.0710678118654755,y:7.0710678118654755});
console.log('');





var loopCount = Math.pow(10,7);

console.log('pure random');
var startTime = (new Date()).getTime();
    for(var a = 0; a < loopCount; a++){
        var x = Math.random();
        var y = Math.random();
        var angle = Math.random();
        // console.log(x,y,angle);
        _canvas_.library.math.cartesianAngleAdjust(x,y,angle);
    }
var endTime = (new Date()).getTime();
console.log( loopCount + ' cycles took ' + (endTime - startTime)/1000 +' seconds' );
console.log('');

console.log('multiples of PI');
var startTime = (new Date()).getTime();
    for(var a = 0; a < loopCount; a++){
        var x = Math.random();
        var y = Math.random();
        var angle = a%4 * Math.PI/2;
        // console.log(x,y,angle);
        _canvas_.library.math.cartesianAngleAdjust(x,y,angle);
    }
var endTime = (new Date()).getTime();
console.log( loopCount + ' cycles took ' + (endTime - startTime)/1000 +' seconds' );
console.log('');






// tester(_canvas_.library.math.cartesianAngleAdjust2(0,0,0),{x:0,y:0});
// tester(_canvas_.library.math.cartesianAngleAdjust2(10,0,Math.PI),{x:-10,y:0});
// tester(_canvas_.library.math.cartesianAngleAdjust2(10,0,Math.PI*2),{x:10,y:0});
// tester(_canvas_.library.math.cartesianAngleAdjust2(10,0,Math.PI/2),{x:0,y:10});
// tester(_canvas_.library.math.cartesianAngleAdjust2(10,0,-Math.PI/2),{x:0,y:-10});
// tester(_canvas_.library.math.cartesianAngleAdjust2(10,0,Math.PI/4),{x:7.0710678118654755,y:7.0710678118654755});
// console.log('');

// console.log('pure random');
// var startTime = (new Date()).getTime();
//     for(var a = 0; a < loopCount; a++){
//         var x = Math.random();
//         var y = Math.random();
//         var angle = Math.random();
//         // console.log(x,y,angle);
//         _canvas_.library.math.cartesianAngleAdjust2(x,y,angle);
//     }
// var endTime = (new Date()).getTime();
// console.log( loopCount + ' cycles took ' + (endTime - startTime)/1000 +' seconds' );
// console.log('');

// console.log('multiples of PI');
// var startTime = (new Date()).getTime();
//     for(var a = 0; a < loopCount; a++){
//         var x = Math.random();
//         var y = Math.random();
//         var angle = a%4 * Math.PI/2;
//         // console.log(x,y,angle);
//         _canvas_.library.math.cartesianAngleAdjust2(x,y,angle);
//     }
// var endTime = (new Date()).getTime();
// console.log( loopCount + ' cycles took ' + (endTime - startTime)/1000 +' seconds' );
// console.log('');