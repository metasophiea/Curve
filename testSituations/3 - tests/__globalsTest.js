(function(){

function p(a=''){console.log(a);}

//curveGenerator
    //linear
        p( __globals.utility.math.curveGenerator.linear() );
        p( __globals.utility.math.curveGenerator.linear(10) );
        p( __globals.utility.math.curveGenerator.linear(10,5,10) );
        p( __globals.utility.math.curveGenerator.linear(10,8) );
        p();
    //sin
        p( __globals.utility.math.curveGenerator.sin() );
        p( __globals.utility.math.curveGenerator.sin(10) );
        p( __globals.utility.math.curveGenerator.sin(10,5,10) );
        p( __globals.utility.math.curveGenerator.sin(10,8) );
        p();

    //cos
        p( __globals.utility.math.curveGenerator.cos() );
        p( __globals.utility.math.curveGenerator.cos(10) );
        p( __globals.utility.math.curveGenerator.cos(10,5,10) );
        p( __globals.utility.math.curveGenerator.cos(10,8) );
        p();

    //s
        p( __globals.utility.math.curveGenerator.s() );
        p( __globals.utility.math.curveGenerator.s(10) );
        p( __globals.utility.math.curveGenerator.s(10,5,10) );
        p( __globals.utility.math.curveGenerator.s(10,8) );
        p();

    //exponential
        p( __globals.utility.math.curveGenerator.exponential() );
        p( __globals.utility.math.curveGenerator.exponential(10) );
        p( __globals.utility.math.curveGenerator.exponential(10,5,10) );
        p( __globals.utility.math.curveGenerator.exponential(10,8) );
        p();

//detectOverlap (broken)
    // //totally separate shapes
    // var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
    // var poly_b = [{x:15,y:15},{x:25,y:15},{x:25,y:25},{x:15,y:25}];
    // var box_a = [{x:0,y:0},{x:10,y:10}];
    // var box_b = [{x:15,y:15},{x:25,y:25}];
    // p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
    // //simple overlap
    // var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
    // var poly_b = [{x:5,y:5},{x:15,y:5},{x:15,y:15},{x:5,y:15}];
    // var box_a = [{x:0,y:0},{x:10,y:10}];
    // var box_b = [{x:5,y:5},{x:15,y:15}];
    // p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
    // //the same shape twice, no bounding boxes
    // var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
    // var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
    // p( __globals.utility.math.detectOverlap(poly_a, poly_b) );
    // p();

//intersectionOfTwoLineSegments
    //simple crossing
    var segment1 = [{x:0,y:0},{x:5,y:5}];
    var segment2 = [{x:5,y:0},{x:0,y:5}];
    p( __globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2) );
    //no crossing
    var segment1 = [{x:0,y:0},{x:5,y:5}];
    var segment2 = [{x:0,y:2},{x:0,y:5}];
    p( __globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2) );
    //one segment touches the other
    var segment1 = [{x:0,y:0},{x:5,y:5}];
    var segment2 = [{x:2.5,y:2.5},{x:0,y:5}];
    p( __globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2) );
    p();

//boundingBoxFromPoints
    //simple box
    var poly = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
    p( __globals.utility.math.boundingBoxFromPoints(poly) );
    //triangle
    var poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}];
    p( __globals.utility.math.boundingBoxFromPoints(poly) );
    p();

//polar2cartesian
    var distance = 10;
    var angle = 0;
    p( __globals.utility.math.polar2cartesian(angle,distance) );
    var distance = -10;
    var angle = 0;
    p( __globals.utility.math.polar2cartesian(angle,distance) );
    var distance = 10;
    var angle = Math.PI/2;
    p( __globals.utility.math.polar2cartesian(angle,distance) );
    var distance = -10;
    var angle = Math.PI;
    p( __globals.utility.math.polar2cartesian(angle,distance) );
    var distance = 3.5355339059327378;
    var angle = Math.PI/4;
    p( __globals.utility.math.polar2cartesian(angle,distance) );
    p();
//cartesian2polar
    var x = 10;
    var y = 0;
    p( __globals.utility.math.cartesian2polar(x,y) );
    var x = -10;
    var y = 0;
    p( __globals.utility.math.cartesian2polar(x,y) );
    var x = 0;
    var y = 10;
    p( __globals.utility.math.cartesian2polar(x,y) );
    var x = 10;
    var y = 40;
    p( __globals.utility.math.cartesian2polar(x,y) );
    var x = 2.5;
    var y = 2.5;
    p( __globals.utility.math.cartesian2polar(x,y) );
    p();


})();
