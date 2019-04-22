console.log('%cTesting - system.library.math', 'font-size:15px; font-weight:bold;');

//averageArray
    console.log('%c- averageArray', 'font-weight: bold;');
        tester(_canvas_.library.math.averageArray([1]),1);
        tester(_canvas_.library.math.averageArray([1,1,1,1,1,1,1,1]),1);
        tester(_canvas_.library.math.averageArray([0,1,2,3,4,5,6,7,8,9]),4.5);
    console.log('');

//averagePoint
    console.log('%c- averagePoint', 'font-weight: bold;');
        tester(_canvas_.library.math.averagePoint([{x:0,y:0}]),{x:0,y:0});
        tester(_canvas_.library.math.averagePoint([{x:0,y:0},{x:10,y:0}]),{x:5,y:0});
        tester(_canvas_.library.math.averagePoint([{x:-10,y:0},{x:10,y:0}]),{x:0,y:0});
        tester(_canvas_.library.math.averagePoint([{x:0,y:0}, {x:10,y:0}, {x:10,y:10}, {x:0,y:10}]),{x:5,y:5});
    console.log('');

//boundingBoxFromPoints
    console.log('%c- boundingBoxFromPoints', 'font-weight: bold;');
        console.log('%c-- simple box', 'font-weight: bold;');
            var poly = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            tester(_canvas_.library.math.boundingBoxFromPoints(poly),{topLeft:{x: 0, y: 0}, bottomRight:{x: 10, y: 10}});
        console.log('%c-- triangle', 'font-weight: bold;');
            var poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}];
            tester(_canvas_.library.math.boundingBoxFromPoints(poly),{topLeft:{x: 0, y: 0}, bottomRight:{x: 10, y: 10}});
    console.log('');
    
//cartesianAngleAdjust
    console.log('%c- cartesianAngleAdjust', 'font-weight: bold;');
//convertColour
    console.log('%c- convertColour', 'font-weight: bold;');
    console.log('');
    //obj2rgba
        console.log('%c-- obj2rgba', 'font-weight: bold;');
    //rgba2obj
        console.log('%c-- rgba2obj', 'font-weight: bold;');
    console.log('');

//curveGenerator
    console.log('%c- curveGenerator', 'font-weight: bold;');
    console.log('');
    //linear
        console.log('%c-- linear', 'font-weight: bold;');
    //sin
        console.log('%c-- sin', 'font-weight: bold;');
    //cos
        console.log('%c-- cos', 'font-weight: bold;');
    //s
        console.log('%c-- s', 'font-weight: bold;');
    //exponential
        console.log('%c-- exponential', 'font-weight: bold;');
    console.log('');

//curvePoint
    console.log('%c- curvePoint', 'font-weight: bold;');
    //linear
        console.log('%c-- linear', 'font-weight: bold;');
    //sin
        console.log('%c-- sin', 'font-weight: bold;');
    //cos
        console.log('%c-- cos', 'font-weight: bold;');
    //s
        console.log('%c-- s', 'font-weight: bold;');
    //exponential
        console.log('%c-- exponential', 'font-weight: bold;');
    console.log('');

//detectOverlap
    console.log('%c- detectOverlap', 'font-weight: bold;');
    //boundingBoxes
        console.log('%c-- boundingBoxes', 'font-weight: bold;');
    //pointWithinBoundingBox
        console.log('%c-- pointWithinBoundingBox', 'font-weight: bold;');
    //pointWithinPoly
        console.log('%c-- pointWithinPoly', 'font-weight: bold;');
    //lineSegments
        console.log('%c-- lineSegments', 'font-weight: bold;');
            //the function tells where the lines would intersect if they were infinitely long in both directions,
            //the next two bools reveal if this point if within the segment given (you need two 'true's for an intersectionOfTwoLineSegments)
            console.log('%c--- simple crossing', 'font-weight: bold;');
                var segment1 = [{x:0,y:0},{x:5,y:5}];
                var segment2 = [{x:5,y:0},{x:0,y:5}];
                tester(_canvas_.library.math.detectOverlap.lineSegments(segment1, segment2), {x: 2.5, y: 2.5, inSeg1: true, inSeg2: true});
            console.log('%c--- no crossing', 'font-weight: bold;');
                var segment1 = [{x:0,y:0},{x:5,y:5}];
                var segment2 = [{x:0,y:2},{x:0,y:5}];
                tester(_canvas_.library.math.detectOverlap.lineSegments(segment1, segment2),{x: 0, y: 0, inSeg1: true, inSeg2: false} );
            console.log('%c--- one segment touches the other', 'font-weight: bold;');
                var segment1 = [{x:0,y:0},{x:5,y:5}];
                var segment2 = [{x:2.5,y:2.5},{x:0,y:5}];
                tester(_canvas_.library.math.detectOverlap.lineSegments(segment1, segment2),{x: 2.5, y: 2.5, inSeg1: true, inSeg2: true} );
        console.log('');
    //overlappingPolygons
        console.log('%c-- overlappingPolygons', 'font-weight: bold;');
            console.log('%c- totally separate shapes', 'font-weight: bold;');
                var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
                var poly_b = [{x:15,y:15},{x:25,y:15},{x:25,y:25},{x:15,y:25}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b,), false);
            console.log('%c- simple overlap -> true', 'font-weight: bold;');
                var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
                var poly_b = [{x:5,y:5},{x:15,y:5},{x:15,y:15},{x:5,y:15}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            console.log('%c- the same shape twice, with bounding boxes -> true', 'font-weight: bold;');
                var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
                var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            console.log('%c- the same shape twice, no bounding boxes -> true', 'font-weight: bold;');
                var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
                var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            console.log('%c- overlapping sides (like a cross shape)', 'font-weight: bold;');
                var poly_a = [{x:0,y:0},{x:100,y:0},{x:100,y:10},{x:0,y:10}];
                var poly_b = [{x:50,y:-50},{x:60,y:-50},{x:60,y:50},{x:50,y:50}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);

            console.log('%c- live examples (should all be \'true\')', 'font-weight: bold;');
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":50,"y":50},{"x":105,"y":50},{"x":105,"y":105},{"x":50,"y":105}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":875,"y":50},{"x":930,"y":50},{"x":930,"y":105},{"x":875,"y":105}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":150,"y":50},{"x":345,"y":50},{"x":345,"y":160},{"x":150,"y":160}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":400,"y":50},{"x":500,"y":50},{"x":500,"y":105},{"x":400,"y":105}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":550,"y":50},{"x":790,"y":50},{"x":790,"y":90},{"x":740,"y":140},{"x":550,"y":140}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":25,"y":130},{"x":35,"y":120},{"x":59.166666666666664,"y":120},{"x":71.125,"y":130},{"x":81.375,"y":130},{"x":93.33333333333333,"y":120},{"x":117.5,"y":120},{"x":127.5,"y":130},{"x":127.5,"y":205},{"x":117.5,"y":215},{"x":93.33333333333333,"y":215},{"x":81.375,"y":205},{"x":71.125,"y":205},{"x":59.166666666666664,"y":215},{"x":35,"y":215},{"x":25,"y":205}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":160,"y":175},{"x":242.5,"y":175},{"x":252.5,"y":245},{"x":201.25,"y":275},{"x":150,"y":245}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":280,"y":180},{"x":331.25,"y":170},{"x":382.5,"y":180},{"x":382.5,"y":210},{"x":331.25,"y":220},{"x":280,"y":210}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":425,"y":160},{"x":645,"y":160},{"x":645,"y":215},{"x":425,"y":215}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":425,"y":220},{"x":645,"y":220},{"x":645,"y":275},{"x":425,"y":275}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":425,"y":280},{"x":645,"y":280},{"x":645,"y":335},{"x":425,"y":335}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":425,"y":340},{"x":645,"y":340},{"x":645,"y":420},{"x":425,"y":420}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":675,"y":160},{"x":895,"y":160},{"x":895,"y":545},{"x":675,"y":545}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":355,"y":110},{"x":530,"y":110},{"x":530,"y":150},{"x":355,"y":150}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":15,"y":285},{"x":25,"y":285},{"x":37.5,"y":275},{"x":52.5,"y":275},{"x":65,"y":285},{"x":260,"y":285},{"x":260,"y":315},{"x":65,"y":315},{"x":52.5,"y":325},{"x":37.5,"y":325},{"x":25,"y":315},{"x":15,"y":315}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":270,"y":225},{"x":395,"y":225},{"x":395,"y":275},{"x":370,"y":285},{"x":370,"y":325},{"x":270,"y":325}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":830,"y":50},{"x":820,"y":52.67949192431122},{"x":812.6794919243113,"y":60},{"x":810,"y":70},{"x":812.6794919243113,"y":80},{"x":820,"y":87.32050807568876},{"x":830,"y":90},{"x":840,"y":87.32050807568878},{"x":847.3205080756887,"y":80},{"x":850,"y":70},{"x":847.3205080756887,"y":60.000000000000014},{"x":840,"y":52.679491924311236}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":790,"y":120},{"x":800,"y":110},{"x":890,"y":110},{"x":905,"y":120},{"x":905,"y":140},{"x":890,"y":150},{"x":800,"y":150},{"x":790,"y":140}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
                
                var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
                var poly_b = [{"x":80,"y":330},{"x":400,"y":330},{"x":400,"y":392.5},{"x":80,"y":392.5}];
                tester(_canvas_.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
        console.log('');
    //overlappingPolygonWithPolygons
        console.log('%c-- overlappingPolygonWithPolygons', 'font-weight: bold;');
    console.log('');

//getAngleOfTwoPoints
    console.log('%c- getAngleOfTwoPoints', 'font-weight: bold;');
    console.log('');
//getDifferenceOfArrays
    console.log('%c- getDifferenceOfArrays', 'font-weight: bold;');
    console.log('');
//getIndexOfSequence
    console.log('%c- getIndexOfSequence', 'font-weight: bold;');
    console.log('');
//largestValueFound
    console.log('%c- largestValueFound', 'font-weight: bold;');
    console.log('');
//pathToPolygonGenerator
    console.log('%c- pathToPolygonGenerator', 'font-weight: bold;');
    console.log('');
//loopedPathToPolygonGenerator
    console.log('%c- loopedPathToPolygonGenerator', 'font-weight: bold;');
    console.log('');
//normalizeStretchArray
    console.log('%c- normalizeStretchArray', 'font-weight: bold;');
    tester( _canvas_.library.math.normalizeStretchArray([0, 1]),[0, 1] );
    tester( _canvas_.library.math.normalizeStretchArray([0, 0.5, 1]),[0, 0.5, 1] );
    tester( _canvas_.library.math.normalizeStretchArray([0,1,2,3,4,5,6,7,8,9,10]),[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1] );
    tester( _canvas_.library.math.normalizeStretchArray([0, 11523.140939388142, 23046.27759202532]),[0, 0.5000000930031097, 1] );
    console.log('');
//relativeDistance
    console.log('%c- relativeDistance', 'font-weight: bold;');
    tester( _canvas_.library.math.relativeDistance(120, -1, 1, 0, false), 60 );
    tester( _canvas_.library.math.relativeDistance(60, -1, 1, 1, false), 60 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, 1, false), 57.272727272727266 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, 0.75, false), 50.45454545454545 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, 0.5, false), 43.63636363636364 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7096312918194273, true), 10.64641931401562 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7610384342079204, true), 9.24440633978399 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7528039816331866, true), 9.468982319094911 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7746699074885954, true), 8.872638886674672 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.8054839748931785, true), 8.032255230186044 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.8168779246382837, true), 7.721511146228629 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7989772731353805, true), 8.209710732671443 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7687872823270903, true), 9.033074118352085 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7542679542679545, true), 9.429055792692154 );
    tester( _canvas_.library.math.relativeDistance(60, -1.1, 1.1, -0.7687872823270891, true), 09.033074118352115 );
    console.log('');

//removeTheseElementsFromThatArray
    console.log('%c- removeTheseElementsFromThatArray', 'font-weight: bold;');
    tester( _canvas_.library.math.removeTheseElementsFromThatArray([],[]),[] );
    tester( _canvas_.library.math.removeTheseElementsFromThatArray([1,2,3,4],[1,2,3,4]),[] );
    tester( _canvas_.library.math.removeTheseElementsFromThatArray([1,2],[1,2,3,4]),[3,4] );
    tester( _canvas_.library.math.removeTheseElementsFromThatArray([],[1,2,3,4]),[1,2,3,4] );
    tester( _canvas_.library.math.removeTheseElementsFromThatArray([1,2,3,4],[]),[] );
    console.log('');

//seconds2time
    console.log('%c- seconds2time', 'font-weight: bold;');
    tester( _canvas_.library.math.seconds2time(10),{h:0, m:0, s:10} );
    tester( _canvas_.library.math.seconds2time(100),{h:0, m:1, s:40} )
    tester( _canvas_.library.math.seconds2time(900),{h:0, m:15, s:0} )
    tester( _canvas_.library.math.seconds2time(1000),{h:0, m:16, s:40} );
    console.log('');

//cartesian2polar
    console.log('%c- cartesian2polar', 'font-weight: bold;');
        var x = 10;
        var y = 0;
        tester(_canvas_.library.math.cartesian2polar(x,y),{dis: 10, ang: 0});
        var x = -10;
        var y = 0;
        tester(_canvas_.library.math.cartesian2polar(x,y),{dis: 10, ang: 3.141592653589793});
        var x = 0;
        var y = 10;
        tester( _canvas_.library.math.cartesian2polar(x,y),{dis: 10, ang: 1.5707963267948966});
        var x = 10;
        var y = 40;
        tester(_canvas_.library.math.cartesian2polar(x,y),{dis: 41.23105625617661, ang: 1.3258176636680326});
        var x = 2.5;
        var y = 2.5;
        tester(_canvas_.library.math.cartesian2polar(x,y),{dis: 3.5355339059327378, ang: 0.7853981633974483});
    console.log('');

//polar2cartesian
    console.log('%c- polar2cartesian', 'font-weight: bold;');
        var distance = 10;
        var angle = 0;
        tester(_canvas_.library.math.polar2cartesian(angle,distance),{x: 10, y: 0});
        var distance = -10;
        var angle = 0;
        tester(_canvas_.library.math.polar2cartesian(angle,distance),{x: -10, y: -0});
        var distance = 10;
        var angle = Math.PI/2;
        tester(_canvas_.library.math.polar2cartesian(angle,distance),{x: 6.123233995736766e-16, y: 10});
        var distance = -10;
        var angle = Math.PI;
        tester(_canvas_.library.math.polar2cartesian(angle,distance),{x: 10, y: -1.2246467991473533e-15});
        var distance = 3.5355339059327378;
        var angle = Math.PI/4;
        tester(_canvas_.library.math.polar2cartesian(angle,distance),{x: 2.5000000000000004, y: 2.5});
    console.log('');

//blendColours
    console.log('%c- blendColours', 'font-weight: bold;');
    tester( _canvas_.library.math.blendColours({r:0,g:0,b:0,a:0},{r:0,g:0,b:0,a:0},0.5), {r:0,g:0,b:0,a:0} );
    tester( _canvas_.library.math.blendColours({r:1,g:0,b:0,a:0},{r:0,g:0,b:0,a:0},0.0), {r:1,g:0,b:0,a:0} );
    tester( _canvas_.library.math.blendColours({r:1,g:0,b:0,a:0},{r:0,g:0,b:0,a:0},1.0), {r:0,g:0,b:0,a:0} );
    tester( _canvas_.library.math.blendColours({r:0.35,g:0.55,b:0.1,a:1},{r:0.2,g:1,b:0.01,a:0.99},0.25), {r:0.31249999999999994, g:0.6625000000000001, b:0.07750000000000001, a:0.9975} );
    console.log('');
//multiBlendColours
    console.log('%c- multiBlendColours', 'font-weight: bold;');
    tester(_canvas_.library.math.multiBlendColours([
        {r:0.5411,g:0.5411,b:0.5411,a:0.6},
        {r:0.5098,g:0.7803,b:0.8156,a:0.6},
        {r:0.5058,g:0.8196,b:0.6784,a:0.6},
        {r:0.9176,g:0.9333,b:0.4313,a:0.6},
        {r:0.9764,g:0.6980,b:0.4039,a:0.6},
        {r:1.0000,g:0.2705,b:0.2705,a:0.6}
    ],0.88),{r:0.98584,g:0.5269999999999998,b:0.35053999999999996,a:0.6} );
    tester(_canvas_.library.math.multiBlendColours([
        {r:0.5411,g:0.5411,b:0.6980,a:0.9333},
        {r:0.7803,g:0.5098,b:1.0000,a:0.6980},
        {r:0.8196,g:0.5058,b:0.6784,a:0.8196},
        {r:0.9333,g:0.9176,b:0.5411,a:0.5058},
        {r:0.6980,g:0.9764,b:0.4039,a:0.9176},
        {r:0.2705,g:1.0000,b:0.2705,a:0.9764}
    ],0.11),{r:0.67266,g:0.523885,b:0.8641,a:0.803885} );
    console.log('');