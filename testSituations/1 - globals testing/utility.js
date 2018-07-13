(function(){

    function p(a=''){console.log(a);}

    // //normalizeStretchArray
    //     p( __globals.utility.math.normalizeStretchArray([0,1]) );
    //     p( __globals.utility.math.normalizeStretchArray([0,0.5,1]) );
    //     p( __globals.utility.math.normalizeStretchArray([0,0.9,1]) );
    //     p( __globals.utility.math.normalizeStretchArray([0.9,0.99,0.999]) );
    //     p( __globals.utility.math.normalizeStretchArray([0,0.0001,1.9]) );
    //     p( __globals.utility.math.normalizeStretchArray([-1,-0.9999,0.9]) );
    //     p();
    
    //curvePoint
        // //linear
        //     p( __globals.utility.math.curvePoint.linear() );
        //     p( __globals.utility.math.curvePoint.linear(0.1,0,1) );
        //     p( __globals.utility.math.curvePoint.linear(0.1,0,2) );
        //     p( __globals.utility.math.curvePoint.linear(0.5,-1,1) );
        //     p( __globals.utility.math.curvePoint.linear(0.99,-5,10) );
        //     for(var a = 0; a <= 10; a++){
        //         p( '\t ' + a + ' -> ' + __globals.utility.math.curvePoint.linear(a/10) );
        //     }
        //     p();
        //     for(var a = 0; a <= 10; a++){
        //         p( '\t ' + a + ' -> ' + __globals.utility.math.curvePoint.linear(a/10,0.025,1) );
        //     }
        //     p();
        // //sin
        //     p( __globals.utility.math.curvePoint.sin() );
        //     p( __globals.utility.math.curvePoint.sin(0.1,0,1) );
        //     p( __globals.utility.math.curvePoint.sin(0.1,0,2) );
        //     p( __globals.utility.math.curvePoint.sin(0.5,-1,1) );
        //     p( __globals.utility.math.curvePoint.sin(1/3,-1,1) );
        //     p( __globals.utility.math.curvePoint.sin(0.99,-5,10) );
        //     p();
        // //cos
        //     p( __globals.utility.math.curvePoint.cos() );
        //     p( __globals.utility.math.curvePoint.cos(0.1,0,1) );
        //     p( __globals.utility.math.curvePoint.cos(0.1,0,2) );
        //     p( __globals.utility.math.curvePoint.cos(0.5,-1,1) );
        //     p( __globals.utility.math.curvePoint.cos(2/3,-1,1) );
        //     p( __globals.utility.math.curvePoint.cos(0.0001,-5,10) );
        //     p( __globals.utility.math.curvePoint.cos(0.9999,-5,10) );
        //     p();
        // //cos
        //     p( __globals.utility.math.curvePoint.s() );
        //     p( __globals.utility.math.curvePoint.s(0.0) );
        //     p( __globals.utility.math.curvePoint.s(0.1) );
        //     p( __globals.utility.math.curvePoint.s(0.2) );
        //     p( __globals.utility.math.curvePoint.s(0.3) );
        //     p( __globals.utility.math.curvePoint.s(0.4) );
        //     p( __globals.utility.math.curvePoint.s(0.5) );
        //     p( __globals.utility.math.curvePoint.s(0.6) );
        //     p( __globals.utility.math.curvePoint.s(0.7) );
        //     p( __globals.utility.math.curvePoint.s(0.8) );
        //     p( __globals.utility.math.curvePoint.s(0.9) );
        //     p( __globals.utility.math.curvePoint.s(1) );
        //     p();
        // //exponential
        //     p( __globals.utility.math.curvePoint.exponential() );
        //     p( __globals.utility.math.curvePoint.exponential(0.0) );
        //     p( __globals.utility.math.curvePoint.exponential(0.1) );
        //     p( __globals.utility.math.curvePoint.exponential(0.2) );
        //     p( __globals.utility.math.curvePoint.exponential(0.3) );
        //     p( __globals.utility.math.curvePoint.exponential(0.4) );
        //     p( __globals.utility.math.curvePoint.exponential(0.5) );
        //     p( __globals.utility.math.curvePoint.exponential(0.6) );
        //     p( __globals.utility.math.curvePoint.exponential(0.7) );
        //     p( __globals.utility.math.curvePoint.exponential(0.8) );
        //     p( __globals.utility.math.curvePoint.exponential(0.9) );
        //     p( __globals.utility.math.curvePoint.exponential(1) );
        //     p();

    // //curveGenerator
    //     //linear
    //         p( __globals.utility.math.curveGenerator.linear() );
    //         p( __globals.utility.math.curveGenerator.linear(10) );
    //         p( __globals.utility.math.curveGenerator.linear(10,5,10) );
    //         p( __globals.utility.math.curveGenerator.linear(10,8) );
    //         p();
    //     //sin
    //         p( __globals.utility.math.curveGenerator.sin() );
    //         p( __globals.utility.math.curveGenerator.sin(10) );
    //         p( __globals.utility.math.curveGenerator.sin(10,5,10) );
    //         p( __globals.utility.math.curveGenerator.sin(10,8) );
    //         p();
    
    //     //cos
    //         p( __globals.utility.math.curveGenerator.cos() );
    //         p( __globals.utility.math.curveGenerator.cos(10) );
    //         p( __globals.utility.math.curveGenerator.cos(10,5,10) );
    //         p( __globals.utility.math.curveGenerator.cos(10,8) );
    //         p();
    
    //     //s
    //         p( __globals.utility.math.curveGenerator.s() );
    //         p( __globals.utility.math.curveGenerator.s(10) );
    //         p( __globals.utility.math.curveGenerator.s(10,5,10) );
    //         p( __globals.utility.math.curveGenerator.s(10,8) );
    //         p();
    
    //     //exponential
    //         p( __globals.utility.math.curveGenerator.exponential() );
    //         p( __globals.utility.math.curveGenerator.exponential(10) );
    //         p( __globals.utility.math.curveGenerator.exponential(10,5,10) );
    //         p( __globals.utility.math.curveGenerator.exponential(10,8) );
    //         p();
    
    //detectOverlap
        function handyDotPrinter(dotArrays){
            var colours = [
                'rgba(100,100,100,1)',
                'rgba(255,100,255,1)',
                'rgba(255,255,100,1)',
                'rgba(255,100,100,1)',
                'rgba(100,100,255,1)',
            ];
            for(var a = 0; a < dotArrays.length; a++){
                if(dotArrays[a].length > 2){
                    __globals.panes.foreground.append(
                        __globals.utility.experimental.elementMaker('path',null,{path:dotArrays[a], lineType:'L', style:'fill:'+colours[a%colours.length]+';'})
                    );
                }else{
                    __globals.panes.foreground.append(
                        __globals.utility.experimental.elementMaker('path',null,{path:
                            [
                                {x:dotArrays[a][0].x,y:dotArrays[a][0].y},
                                {x:dotArrays[a][1].x,y:dotArrays[a][0].y},
                                {x:dotArrays[a][1].x,y:dotArrays[a][1].y},
                                {x:dotArrays[a][0].x,y:dotArrays[a][1].y},
                                {x:dotArrays[a][0].x,y:dotArrays[a][0].y},
                            ], lineType:'L', style:'stroke:'+colours[a%colours.length]+';fill:none;'})
                    );
                }
                var style = 'fill:'+colours[a%colours.length]+'; font-size:3; font-family:Helvetica;';
                for(var b = 0; b < dotArrays[a].length; b++){
                    __globals.utility.workspace.dotMaker(
                        dotArrays[a][b].x,dotArrays[a][b].y,'('+dotArrays[a][b].x+','+dotArrays[a][b].y+')',2,style,true
                    ); 
                }
            }
        }

        //totally separate shapes -> false
        var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
        var poly_b = [{x:15,y:15},{x:25,y:15},{x:25,y:25},{x:15,y:25}];
        var box_a = [{x:10,y:10},{x:0,y:0}];
        var box_b = [{x:25,y:25},{x:15,y:15}];
        p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );

        //simple overlap -> true
        var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
        var poly_b = [{x:5,y:5},{x:15,y:5},{x:15,y:15},{x:5,y:15}];
        var box_a = [{x:10,y:10},{x:0,y:0}];
        var box_b = [{x:15,y:15},{x:5,y:5}];
        p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
        //the same shape twice, with bounding boxes -> true
        var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
        var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
        p( __globals.utility.math.detectOverlap(poly_a, poly_b, [poly_a[2],poly_a[0]], [poly_b[2],poly_b[0]]) );
        //the same shape twice, no bounding boxes -> true
        var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
        var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
        p( __globals.utility.math.detectOverlap(poly_a, poly_b) );
        p();

        //live examples (should all be 'true')
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":50,"y":50},{"x":105,"y":50},{"x":105,"y":105},{"x":50,"y":105}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":50,"y":50},{"x":105,"y":105}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":875,"y":50},{"x":930,"y":50},{"x":930,"y":105},{"x":875,"y":105}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":875,"y":50},{"x":930,"y":105}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":150,"y":50},{"x":345,"y":50},{"x":345,"y":160},{"x":150,"y":160}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":150,"y":50},{"x":345,"y":160}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":400,"y":50},{"x":500,"y":50},{"x":500,"y":105},{"x":400,"y":105}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":400,"y":50},{"x":500,"y":105}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":550,"y":50},{"x":790,"y":50},{"x":790,"y":90},{"x":740,"y":140},{"x":550,"y":140}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":550,"y":50},{"x":790,"y":140}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":25,"y":130},{"x":35,"y":120},{"x":59.166666666666664,"y":120},{"x":71.125,"y":130},{"x":81.375,"y":130},{"x":93.33333333333333,"y":120},{"x":117.5,"y":120},{"x":127.5,"y":130},{"x":127.5,"y":205},{"x":117.5,"y":215},{"x":93.33333333333333,"y":215},{"x":81.375,"y":205},{"x":71.125,"y":205},{"x":59.166666666666664,"y":215},{"x":35,"y":215},{"x":25,"y":205}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":25,"y":120},{"x":127.5,"y":215}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":160,"y":175},{"x":242.5,"y":175},{"x":252.5,"y":245},{"x":201.25,"y":275},{"x":150,"y":245}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":150,"y":175},{"x":252.5,"y":275}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":280,"y":180},{"x":331.25,"y":170},{"x":382.5,"y":180},{"x":382.5,"y":210},{"x":331.25,"y":220},{"x":280,"y":210}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":280,"y":170},{"x":382.5,"y":220}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":160},{"x":645,"y":160},{"x":645,"y":215},{"x":425,"y":215}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":160},{"x":645,"y":215}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":220},{"x":645,"y":220},{"x":645,"y":275},{"x":425,"y":275}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":220},{"x":645,"y":275}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":280},{"x":645,"y":280},{"x":645,"y":335},{"x":425,"y":335}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":280},{"x":645,"y":335}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":340},{"x":645,"y":340},{"x":645,"y":420},{"x":425,"y":420}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":340},{"x":645,"y":420}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":675,"y":160},{"x":895,"y":160},{"x":895,"y":545},{"x":675,"y":545}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":675,"y":160},{"x":895,"y":545}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":355,"y":110},{"x":530,"y":110},{"x":530,"y":150},{"x":355,"y":150}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":355,"y":110},{"x":530,"y":150}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":15,"y":285},{"x":25,"y":285},{"x":37.5,"y":275},{"x":52.5,"y":275},{"x":65,"y":285},{"x":260,"y":285},{"x":260,"y":315},{"x":65,"y":315},{"x":52.5,"y":325},{"x":37.5,"y":325},{"x":25,"y":315},{"x":15,"y":315}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":15,"y":275},{"x":260,"y":325}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":270,"y":225},{"x":395,"y":225},{"x":395,"y":275},{"x":370,"y":285},{"x":370,"y":325},{"x":270,"y":325}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":270,"y":225},{"x":395,"y":325}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":830,"y":50},{"x":820,"y":52.67949192431122},{"x":812.6794919243113,"y":60},{"x":810,"y":70},{"x":812.6794919243113,"y":80},{"x":820,"y":87.32050807568876},{"x":830,"y":90},{"x":840,"y":87.32050807568878},{"x":847.3205080756887,"y":80},{"x":850,"y":70},{"x":847.3205080756887,"y":60.000000000000014},{"x":840,"y":52.679491924311236}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":810,"y":50},{"x":850,"y":90}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":790,"y":120},{"x":800,"y":110},{"x":890,"y":110},{"x":905,"y":120},{"x":905,"y":140},{"x":890,"y":150},{"x":800,"y":150},{"x":790,"y":140}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
            var box_b = [{"x":790,"y":110},{"x":905,"y":150}];
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":80,"y":330},{"x":400,"y":330},{"x":400,"y":392.5},{"x":80,"y":392.5}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":80,"y":330},{"x":400,"y":392.5}];
            p( __globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b) );
    
    // //intersectionOfTwoLineSegments
    //     //simple crossing
    //     var segment1 = [{x:0,y:0},{x:5,y:5}];
    //     var segment2 = [{x:5,y:0},{x:0,y:5}];
    //     p( __globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2) );
    //     //no crossing
    //     var segment1 = [{x:0,y:0},{x:5,y:5}];
    //     var segment2 = [{x:0,y:2},{x:0,y:5}];
    //     p( __globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2) );
    //     //one segment touches the other
    //     var segment1 = [{x:0,y:0},{x:5,y:5}];
    //     var segment2 = [{x:2.5,y:2.5},{x:0,y:5}];
    //     p( __globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2) );
    //     p();
    
    // //boundingBoxFromPoints
    //     //simple box
    //     var poly = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
    //     p( __globals.utility.math.boundingBoxFromPoints(poly) );
    //     //triangle
    //     var poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}];
    //     p( __globals.utility.math.boundingBoxFromPoints(poly) );
    //     p();
    
    // //polar2cartesian
    //     var distance = 10;
    //     var angle = 0;
    //     p( __globals.utility.math.polar2cartesian(angle,distance) );
    //     var distance = -10;
    //     var angle = 0;
    //     p( __globals.utility.math.polar2cartesian(angle,distance) );
    //     var distance = 10;
    //     var angle = Math.PI/2;
    //     p( __globals.utility.math.polar2cartesian(angle,distance) );
    //     var distance = -10;
    //     var angle = Math.PI;
    //     p( __globals.utility.math.polar2cartesian(angle,distance) );
    //     var distance = 3.5355339059327378;
    //     var angle = Math.PI/4;
    //     p( __globals.utility.math.polar2cartesian(angle,distance) );
    //     p();
    // //cartesian2polar
    //     var x = 10;
    //     var y = 0;
    //     p( __globals.utility.math.cartesian2polar(x,y) );
    //     var x = -10;
    //     var y = 0;
    //     p( __globals.utility.math.cartesian2polar(x,y) );
    //     var x = 0;
    //     var y = 10;
    //     p( __globals.utility.math.cartesian2polar(x,y) );
    //     var x = 10;
    //     var y = 40;
    //     p( __globals.utility.math.cartesian2polar(x,y) );
    //     var x = 2.5;
    //     var y = 2.5;
    //     p( __globals.utility.math.cartesian2polar(x,y) );
    //     p();
    
    // //styleExtractor
    //     p( __globals.utility.experimental.styleExtractor('stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;') );
    //     p( __globals.utility.experimental.styleExtractor('stroke:rgba(0,255,0,1);stroke-width:0.5;stroke-linecap:round;') );
    //     p();

    // //getTransform
    //     var sudoElement = {style:{transform:'translate(-1.25px, 2.5px) scale(1) rotate(0rad)'}};
    //     p( __globals.utility.element.getTransform(sudoElement) );
    //     var sudoElement = {style:{transform:'translate(0px, 9.75e-05px) scale(1) rotate(0rad)'}};
    //     p( __globals.utility.element.getTransform(sudoElement) );
    //     p();
})();
    