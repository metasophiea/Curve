console.log('%cTesting - system.library.math', 'font-size:15px; font-weight:bold;');

    console.log('%c-- averageArray', 'font-weight: bold;');
        tester(workspace.library.math.averageArray([1]),1);
        tester(workspace.library.math.averageArray([1,1,1,1,1,1,1,1]),1);
        tester(workspace.library.math.averageArray([0,1,2,3,4,5,6,7,8,9]),4.5);

    console.log('%c-- boundingBoxFromPoints', 'font-weight: bold;');
        console.log('%c- simple box', 'font-weight: bold;');
            var poly = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            tester(workspace.library.math.boundingBoxFromPoints(poly),{topLeft:{x: 0, y: 0}, bottomRight:{x: 10, y: 10}});
        console.log('%c- triangle', 'font-weight: bold;');
            var poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}];
            tester(workspace.library.math.boundingBoxFromPoints(poly),{topLeft:{x: 0, y: 0}, bottomRight:{x: 10, y: 10}});

    console.log('%c-- polar2cartesian', 'font-weight: bold;');
        var distance = 10;
        var angle = 0;
        tester(workspace.library.math.polar2cartesian(angle,distance),{x: 10, y: 0});
        var distance = -10;
        var angle = 0;
        tester(workspace.library.math.polar2cartesian(angle,distance),{x: -10, y: -0});
        var distance = 10;
        var angle = Math.PI/2;
        tester(workspace.library.math.polar2cartesian(angle,distance),{x: 6.123233995736766e-16, y: 10});
        var distance = -10;
        var angle = Math.PI;
        tester(workspace.library.math.polar2cartesian(angle,distance),{x: 10, y: -1.2246467991473533e-15});
        var distance = 3.5355339059327378;
        var angle = Math.PI/4;
        tester(workspace.library.math.polar2cartesian(angle,distance),{x: 2.5000000000000004, y: 2.5});

    console.log('%c-- cartesian2polar', 'font-weight: bold;');
        var x = 10;
        var y = 0;
        tester(workspace.library.math.cartesian2polar(x,y),{dis: 10, ang: 0});
        var x = -10;
        var y = 0;
        tester(workspace.library.math.cartesian2polar(x,y),{dis: 10, ang: 3.141592653589793});
        var x = 0;
        var y = 10;
        tester( workspace.library.math.cartesian2polar(x,y),{dis: 10, ang: 1.5707963267948966});
        var x = 10;
        var y = 40;
        tester(workspace.library.math.cartesian2polar(x,y),{dis: 41.23105625617661, ang: 1.3258176636680326});
        var x = 2.5;
        var y = 2.5;
        tester(workspace.library.math.cartesian2polar(x,y),{dis: 3.5355339059327378, ang: 0.7853981633974483});
    
    console.log('%c-- pointsOfCircle', 'font-weight: bold;');
        tester(workspace.library.math.pointsOfCircle(0,0,10,4),[{x:0, y:10}, {x:10, y:0}, {x:0, y:-10}, {x:-10, y:0}]);

        












    console.log('%c-- intersectionOfTwoLineSegments', 'font-weight: bold;');
        //the function tells where the lines would intersect if they were infinitely long in both directions,
        //the next two bools reveal if this point if within the segment given (you need two 'true's for an intersectionOfTwoLineSegments)
        console.log('%c- simple crossing', 'font-weight: bold;');
            var segment1 = [{x:0,y:0},{x:5,y:5}];
            var segment2 = [{x:5,y:0},{x:0,y:5}];
            tester(workspace.library.math.detectOverlap.lineSegments(segment1, segment2), {x: 2.5, y: 2.5, inSeg1: true, inSeg2: true});
        console.log('%c- no crossing', 'font-weight: bold;');
            var segment1 = [{x:0,y:0},{x:5,y:5}];
            var segment2 = [{x:0,y:2},{x:0,y:5}];
            tester(workspace.library.math.detectOverlap.lineSegments(segment1, segment2),{x: 0, y: 0, inSeg1: true, inSeg2: false} );
        console.log('%c- one segment touches the other', 'font-weight: bold;');
            var segment1 = [{x:0,y:0},{x:5,y:5}];
            var segment2 = [{x:2.5,y:2.5},{x:0,y:5}];
            tester(workspace.library.math.detectOverlap.lineSegments(segment1, segment2),{x: 2.5, y: 2.5, inSeg1: true, inSeg2: true} );

    console.log('%c-- detectOverlap', 'font-weight: bold;');
        console.log('%c- totally separate shapes', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:15,y:15},{x:25,y:15},{x:25,y:25},{x:15,y:25}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b,), false);
        console.log('%c- simple overlap -> true', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:5,y:5},{x:15,y:5},{x:15,y:15},{x:5,y:15}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
        console.log('%c- the same shape twice, with bounding boxes -> true', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
        console.log('%c- the same shape twice, no bounding boxes -> true', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
        console.log('%c- overlapping sides (like a cross shape)', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:100,y:0},{x:100,y:10},{x:0,y:10}];
            var poly_b = [{x:50,y:-50},{x:60,y:-50},{x:60,y:50},{x:50,y:50}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
        console.log('%c- live examples (should all be \'true\')', 'font-weight: bold;');
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":50,"y":50},{"x":105,"y":50},{"x":105,"y":105},{"x":50,"y":105}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":875,"y":50},{"x":930,"y":50},{"x":930,"y":105},{"x":875,"y":105}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":150,"y":50},{"x":345,"y":50},{"x":345,"y":160},{"x":150,"y":160}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":400,"y":50},{"x":500,"y":50},{"x":500,"y":105},{"x":400,"y":105}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":550,"y":50},{"x":790,"y":50},{"x":790,"y":90},{"x":740,"y":140},{"x":550,"y":140}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":25,"y":130},{"x":35,"y":120},{"x":59.166666666666664,"y":120},{"x":71.125,"y":130},{"x":81.375,"y":130},{"x":93.33333333333333,"y":120},{"x":117.5,"y":120},{"x":127.5,"y":130},{"x":127.5,"y":205},{"x":117.5,"y":215},{"x":93.33333333333333,"y":215},{"x":81.375,"y":205},{"x":71.125,"y":205},{"x":59.166666666666664,"y":215},{"x":35,"y":215},{"x":25,"y":205}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":160,"y":175},{"x":242.5,"y":175},{"x":252.5,"y":245},{"x":201.25,"y":275},{"x":150,"y":245}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":280,"y":180},{"x":331.25,"y":170},{"x":382.5,"y":180},{"x":382.5,"y":210},{"x":331.25,"y":220},{"x":280,"y":210}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":160},{"x":645,"y":160},{"x":645,"y":215},{"x":425,"y":215}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":220},{"x":645,"y":220},{"x":645,"y":275},{"x":425,"y":275}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":280},{"x":645,"y":280},{"x":645,"y":335},{"x":425,"y":335}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":340},{"x":645,"y":340},{"x":645,"y":420},{"x":425,"y":420}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":675,"y":160},{"x":895,"y":160},{"x":895,"y":545},{"x":675,"y":545}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":355,"y":110},{"x":530,"y":110},{"x":530,"y":150},{"x":355,"y":150}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":15,"y":285},{"x":25,"y":285},{"x":37.5,"y":275},{"x":52.5,"y":275},{"x":65,"y":285},{"x":260,"y":285},{"x":260,"y":315},{"x":65,"y":315},{"x":52.5,"y":325},{"x":37.5,"y":325},{"x":25,"y":315},{"x":15,"y":315}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":270,"y":225},{"x":395,"y":225},{"x":395,"y":275},{"x":370,"y":285},{"x":370,"y":325},{"x":270,"y":325}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":830,"y":50},{"x":820,"y":52.67949192431122},{"x":812.6794919243113,"y":60},{"x":810,"y":70},{"x":812.6794919243113,"y":80},{"x":820,"y":87.32050807568876},{"x":830,"y":90},{"x":840,"y":87.32050807568878},{"x":847.3205080756887,"y":80},{"x":850,"y":70},{"x":847.3205080756887,"y":60.000000000000014},{"x":840,"y":52.679491924311236}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":790,"y":120},{"x":800,"y":110},{"x":890,"y":110},{"x":905,"y":120},{"x":905,"y":140},{"x":890,"y":150},{"x":800,"y":150},{"x":790,"y":140}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":80,"y":330},{"x":400,"y":330},{"x":400,"y":392.5},{"x":80,"y":392.5}];
            tester(workspace.library.math.detectOverlap.overlappingPolygons(poly_a, poly_b), true);

