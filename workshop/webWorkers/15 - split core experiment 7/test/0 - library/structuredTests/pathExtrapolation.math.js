console.log('%cTesting - library.math.pathExtrapolation', 'font-size:15px; font-weight:bold;');
// {{include:../../main/1 - core/main.js}}
// var drawDotCounter = 0;
// function drawDot(x,y){
//     var temp = _canvas_.core.shape.create('circle');
//     temp.x(x);
//     temp.y(y);
//     temp.radius(1);
//     temp.name = 'circle_'+(drawDotCounter++);
//     _canvas_.core.arrangement.append(temp);
//     _canvas_.core.render.frame();
// }
// var drawLineCounter = 0;
// function drawLine(points){
//     var temp = _canvas_.core.shape.create('path');
//     temp.points(points);
//     temp.jointType(false);
//     temp.looping(true);
//     temp.thickness(0.75);
//     temp.name = 'path_'+(drawLineCounter++);
//     _canvas_.core.arrangement.append(temp);
//     _canvas_.core.render.frame();
// }

    var points = _canvas_.library.math.pathExtrapolation([0,10,100,10]);
    tester(points,[100,0, 100,20, 0,20, 0,20, 0,0, 100,0]);
    // for(var a = 0; a < points.length-2; a+=2){ drawLine({ x:points[a],y:points[a+1] },{ x:points[a+2],y:points[a+3] }); }

    var points = _canvas_.library.math.pathExtrapolation([0,10, 100,10, 100,100]);
    tester(points,[110,10, 110,100, 90,100, 90,20, 0,20, 0,0, 0,0, 100,0, 100,10, 100,10, 110,10, 90,100, 90,20, 0,0, 100,10, 100,10, 90,100, 90,20]);
    // for(var a = 0; a < points.length; a+=2){ drawDot( points[a],points[a+1] ); }
    // drawLine(points);

    var points = _canvas_.library.math.pathExtrapolation([0,10, 100,10, 50,100, 200,0]);
    tester(points,[
        194.4529980377477,-8.320502943378434,
        205.5470019622523,8.320502943378434,
        55.547001962252295,108.32050294337843,
        50,100,
        41.25842723878462,95.14357068821369,
        83.00485539890335,20,
        83.00485539890335,20,
        0,20,
        0,0,
        0,0,
        100,0,
        100,10,
        100,10,
        108.74157276121538,14.856429311786318,
        78.77332164722408,68.79928131697065,
        78.77332164722408,68.79928131697065, 
        194.4529980377477,-8.320502943378434,
        55.547001962252295,108.32050294337843,
        55.547001962252295,108.32050294337843,
        50,100,
        83.00485539890335,20,
        83.00485539890335,20,
        0,0,
        100,10,
        100,10,
        78.77332164722408,68.79928131697065,
        55.547001962252295,108.32050294337843,
        55.547001962252295,108.32050294337843,
        83.00485539890335,20,
        100,10]);
    // for(var a = 0; a < points.length; a+=2){ drawDot( points[a],points[a+1] ); }

    var points = _canvas_.library.math.pathExtrapolation([0,10, 100,10, 100,100],5,undefined,'sharp');
    tester(points,[105,5, 105,100, 95,100, 95,15, 0,15, 0,5, 105,5, 95,100, 95,15, 95,15, 0,5, 105,5]);
    // for(var a = 0; a < points.length; a+=2){ drawDot( points[a],points[a+1] ); }

    var points = _canvas_.library.math.pathExtrapolation([0,10, 100,10, 100,100],5,undefined,'round');
    tester(points,[
        105,10, 105,100, 95,100, 95,15, 0,15, 0,5, 0,5, 100,5,
        102.5,5.669872981077806, 102.5,5.669872981077806, 104.3301270189222,7.5,
        105,10, 105,10, 95,100, 95,15, 95,15, 0,5,
        102.5,5.669872981077806, 102.5,5.669872981077806,
        105,10, 95,15]);
    // for(var a = 0; a < points.length; a+=2){ drawDot( points[a],points[a+1] ); }

    var points = _canvas_.library.math.pathExtrapolation([0,10, 100,10, 100,100],5,undefined,'flat');
    tester(points,[105,10, 105,100, 95,100, 95,15, 0,15, 0,5, 0,5, 100,5, 105,10, 105,10, 95,100, 95,15, 95,15, 0,5, 105,10]);
    // for(var a = 0; a < points.length; a+=2){ drawDot( points[a],points[a+1] ); }

    var points = _canvas_.library.math.pathExtrapolation([0,10, 100,10, 100,100],5,undefined,'sharp',true);
    tester(points,[
        105,111.22681202353685, 
        -13.029791137263166,5.000000000000007, 
        13.029791137263171,15, 
        95,15, 
        13.029791137263171,15,
        -13.029791137263166,5.000000000000007,
        105,111.22681202353685,
        13.029791137263171,15,
        95,88.77318797646315,
        95,15,
        -13.029791137263166,5.000000000000007,
        105,4.999999999999994,
        105,4.999999999999994,
        105,111.22681202353685,
        95,88.77318797646315,
        95,88.77318797646315,
        95,15,
        105,4.999999999999994
    ]);
    // for(var a = 0; a < points.length; a+=2){ drawDot( points[a],points[a+1] ); }


    
    console.log('');