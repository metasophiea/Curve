console.log('%cTesting - __globals.utility.math', 'font-size:15px; font-weight:bold;');
    console.log('%c-- normalizeStretchArray', 'font-weight: bold;');
        tester(__globals.utility.math.normalizeStretchArray([0,1]),[0,1]);
        tester(__globals.utility.math.normalizeStretchArray([0,0.5,1]),[0,0.5,1]);
        tester(__globals.utility.math.normalizeStretchArray([0,0.9,1]),[0,0.9,1]);
        tester(__globals.utility.math.normalizeStretchArray([0.9,0.99,0.999]),[0, 0.9090909090909088, 1]);
        tester(__globals.utility.math.normalizeStretchArray([0,0.0001,1.9]),[0, 0.000052631578947368424, 1]);
        tester(__globals.utility.math.normalizeStretchArray([-1,-0.9999,0.9]),[0, 0.000052631578947397684, 1]);

    console.log('%c-- curvePoint', 'font-weight: bold;');
        console.log('%c- linear', 'font-weight: bold;');
            tester(__globals.utility.math.curvePoint.linear(),0.5);
            tester(__globals.utility.math.curvePoint.linear(0.1,0,1),.1);
            tester(__globals.utility.math.curvePoint.linear(0.1,0,2),0.2);
            tester(__globals.utility.math.curvePoint.linear(0.5,-1,1),0);
            tester(__globals.utility.math.curvePoint.linear(0.99,-5,10),9.85);
            for(var a = 0; a <= 10; a++){
                tester(__globals.utility.math.curvePoint.linear(a/10),a/10);
            }
            var answers = [0.025,0.1225,0.22,0.3175,0.41500000000000004,0.5125,0.61,0.7075,0.805,0.9025,1];
            for(var a = 0; a <= 10; a++){
                tester(__globals.utility.math.curvePoint.linear(a/10,0.025,1),answers[a] );
            }
        console.log('%c- sin', 'font-weight: bold;');
            tester(__globals.utility.math.curvePoint.sin(),           0.7071067811865475);
            tester(__globals.utility.math.curvePoint.sin(0.1,0,1),    0.15643446504023087);
            tester(__globals.utility.math.curvePoint.sin(0.1,0,2),    0.31286893008046174);
            tester(__globals.utility.math.curvePoint.sin(0.5,-1,1),   0.4142135623730949);
            tester(__globals.utility.math.curvePoint.sin(1/3,-1,1),   -1.1102230246251565e-16);
            tester(__globals.utility.math.curvePoint.sin(0.99,-5,10), 9.998149487224909);
        console.log('%c- cos', 'font-weight: bold;');
            tester(__globals.utility.math.curvePoint.cos(),             0.2928932188134524);
            tester(__globals.utility.math.curvePoint.cos(0.1,0,1),      0.01231165940486223);
            tester(__globals.utility.math.curvePoint.cos(0.1,0,2),      0.02462331880972446);
            tester(__globals.utility.math.curvePoint.cos(0.5,-1,1),     -0.41421356237309515);
            tester(__globals.utility.math.curvePoint.cos(2/3,-1,1),     -2.220446049250313e-16);
            tester(__globals.utility.math.curvePoint.cos(0.0001,-5,10), -4.999999814944917);
            tester(__globals.utility.math.curvePoint.cos(0.9999,-5,10), 9.997643805519496);
        console.log('%c- s', 'font-weight: bold;');
            tester(__globals.utility.math.curvePoint.s()   , 0.5000000000000001 );
            tester(__globals.utility.math.curvePoint.s(0.0), 0 );
            tester(__globals.utility.math.curvePoint.s(0.1), 0.021969820441244133 );
            tester(__globals.utility.math.curvePoint.s(0.2), 0.06761890207197617 );
            tester(__globals.utility.math.curvePoint.s(0.3), 0.15559244154839164 );
            tester(__globals.utility.math.curvePoint.s(0.4), 0.30293667416374986 );
            tester(__globals.utility.math.curvePoint.s(0.5), 0.5000000000000001 );
            tester(__globals.utility.math.curvePoint.s(0.6), 0.6970633258362502 );
            tester(__globals.utility.math.curvePoint.s(0.7), 0.8444075584516083 );
            tester(__globals.utility.math.curvePoint.s(0.8), 0.9323810979280239 );
            tester(__globals.utility.math.curvePoint.s(0.9), 0.9780301795587558 );
            tester(__globals.utility.math.curvePoint.s(1)  , 1 );
        console.log('%c- exponential', 'font-weight: bold;');
            tester(__globals.utility.math.curvePoint.exponential(),     0.2689414213699951 );
            tester(__globals.utility.math.curvePoint.exponential(0.0),  0 );
            tester(__globals.utility.math.curvePoint.exponential(0.1),  0.03465343780550409 );
            tester(__globals.utility.math.curvePoint.exponential(0.2),  0.07697924232087867 );
            tester(__globals.utility.math.curvePoint.exponential(0.3),  0.12867609669730537 );
            tester(__globals.utility.math.curvePoint.exponential(0.4),  0.19181877722087765 );
            tester(__globals.utility.math.curvePoint.exponential(0.5),  0.2689414213699951 );
            tester(__globals.utility.math.curvePoint.exponential(0.6),  0.3631392316503325 );
            tester(__globals.utility.math.curvePoint.exponential(0.7),  0.47819269693938515 );
            tester(__globals.utility.math.curvePoint.exponential(0.8),  0.6187193167793194 );
            tester(__globals.utility.math.curvePoint.exponential(0.9),  0.7903589178467405 );
            tester(__globals.utility.math.curvePoint.exponential(1),    1 );

    console.log('%c-- curveGenerator', 'font-weight: bold;');
        console.log('%c- linear', 'font-weight: bold;');
            tester(__globals.utility.math.curveGenerator.linear(),       [0, 1]);
            tester(__globals.utility.math.curveGenerator.linear(10),     [0, 0.1111111111111111, 0.2222222222222222, 0.3333333333333333, 0.4444444444444444, 0.5555555555555556, 0.6666666666666666, 0.7777777777777778, 0.8888888888888888, 1]);
            tester(__globals.utility.math.curveGenerator.linear(10,5,10),[5, 5.555555555555555, 6.111111111111111, 6.666666666666666, 7.222222222222222, 7.777777777777778, 8.333333333333332, 8.88888888888889, 9.444444444444445, 10]);
            tester(__globals.utility.math.curveGenerator.linear(10,8),   [8, 7.222222222222222, 6.444444444444445, 5.666666666666667, 4.888888888888889, 4.111111111111111, 3.333333333333334, 2.5555555555555554, 1.7777777777777786, 1]);
        console.log('%c- sin', 'font-weight: bold;');
            tester(__globals.utility.math.curveGenerator.sin(),        [0, 1] );
            tester(__globals.utility.math.curveGenerator.sin(10),      [0, 0.17364817766693033, 0.3420201433256687, 0.49999999999999994, 0.6427876096865393, 0.766044443118978, 0.8660254037844386, 0.9396926207859083, 0.984807753012208, 1] );
            tester(__globals.utility.math.curveGenerator.sin(10,5,10), [5, 5.868240888334651, 6.710100716628343, 7.5, 8.213938048432697, 8.83022221559489, 9.330127018922193, 9.69846310392954, 9.92403876506104, 10] );
            tester(__globals.utility.math.curveGenerator.sin(10,8),    [8, 6.784462756331488, 5.605858996720319, 4.5, 3.5004867321942257, 2.637688898167154, 1.9378221735089296, 1.4221516544986414, 1.106345728914544, 1] );
        console.log('%c- cos', 'font-weight: bold;');
            tester(__globals.utility.math.curveGenerator.cos(),        [0, 1] );
            tester(__globals.utility.math.curveGenerator.cos(10),      [0, 0.01519224698779198, 0.06030737921409157, 0.1339745962155613, 0.233955556881022, 0.35721239031346064, 0.4999999999999999, 0.6579798566743311, 0.8263518223330696, 1] );
            tester(__globals.utility.math.curveGenerator.cos(10,5,10), [5, 5.07596123493896, 5.301536896070457, 5.669872981077806, 6.16977778440511, 6.786061951567303, 7.5, 8.289899283371655, 9.131759111665348, 10]);
            tester(__globals.utility.math.curveGenerator.cos(10,8),    [8, 7.893654271085456, 7.5778483455013586, 7.062177826491071, 6.362311101832846, 5.499513267805776, 4.500000000000001, 3.3941410032796817, 2.2155372436685132, 1] );
        console.log('%c- s', 'font-weight: bold;');
            tester(__globals.utility.math.curveGenerator.s(),        [0, 1] );
            tester(__globals.utility.math.curveGenerator.s(10),      [0, 0.022463335897421843, 0.06913784818223383, 0.15908756682599312, 0.309741642431138, 0.5112316679487109, 0.712721693466284, 0.8633757690714288, 0.953325487715188, 1] );
            tester(__globals.utility.math.curveGenerator.s(10,5,10), [5, 5.112316679487109, 5.345689240911169, 5.795437834129966, 6.54870821215569, 7.556158339743554, 8.56360846733142, 9.316878845357143, 9.76662743857594, 10] );
            tester(__globals.utility.math.curveGenerator.s(10,8),    [8, 7.842756648718047, 7.516035062724363, 6.886387032218048, 5.8318085029820335, 4.421378324359024, 3.0109481457360117, 1.9563696164999982, 1.3267215859936838, 1] );
        console.log('%c- exponential', 'font-weight: bold;');
            tester(__globals.utility.math.curveGenerator.exponential(),        [0, 1] );
            tester(__globals.utility.math.curveGenerator.exponential(10),      [0, 0.03894923837706363, 0.08759095067273646, 0.1483370980594927, 0.2241998555196527, 0.3189409743731226, 0.4372583135012321, 0.5850187886546604, 0.7695492909331704, 1] );
            tester(__globals.utility.math.curveGenerator.exponential(10,5,10), [5, 5.194746191885318, 5.437954753363682, 5.7416854902974634, 6.120999277598264, 6.594704871865613, 7.18629156750616, 7.925093943273302, 8.847746454665852, 10] );
            tester(__globals.utility.math.curveGenerator.exponential(10,8),    [8, 7.727355331360554, 7.386863345290845, 6.961640313583551, 6.430601011362431, 5.767413179388142, 4.939191805491375, 3.9048684794173774, 2.6131549634678075, 1] );
    
    console.log('%c-- detectOverlap', 'font-weight: bold;');
        console.log('%c- totally separate shapes', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:15,y:15},{x:25,y:15},{x:25,y:25},{x:15,y:25}];
            var box_a = [{x:10,y:10},{x:0,y:0}];
            var box_b = [{x:25,y:25},{x:15,y:15}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), false);
        console.log('%c- simple overlap -> true', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:5,y:5},{x:15,y:5},{x:15,y:15},{x:5,y:15}];
            var box_a = [{x:10,y:10},{x:0,y:0}];
            var box_b = [{x:15,y:15},{x:5,y:5}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
        console.log('%c- the same shape twice, with bounding boxes -> true', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, [poly_a[2],poly_a[0]], [poly_b[2],poly_b[0]]), true);
        console.log('%c- the same shape twice, no bounding boxes -> true', 'font-weight: bold;');
            var poly_a = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            var poly_b = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b), true);
        console.log('%c- live examples (should all be \'true\')', 'font-weight: bold;');
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":50,"y":50},{"x":105,"y":50},{"x":105,"y":105},{"x":50,"y":105}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":50,"y":50},{"x":105,"y":105}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":875,"y":50},{"x":930,"y":50},{"x":930,"y":105},{"x":875,"y":105}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":875,"y":50},{"x":930,"y":105}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":150,"y":50},{"x":345,"y":50},{"x":345,"y":160},{"x":150,"y":160}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":150,"y":50},{"x":345,"y":160}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":400,"y":50},{"x":500,"y":50},{"x":500,"y":105},{"x":400,"y":105}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":400,"y":50},{"x":500,"y":105}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":550,"y":50},{"x":790,"y":50},{"x":790,"y":90},{"x":740,"y":140},{"x":550,"y":140}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":550,"y":50},{"x":790,"y":140}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":25,"y":130},{"x":35,"y":120},{"x":59.166666666666664,"y":120},{"x":71.125,"y":130},{"x":81.375,"y":130},{"x":93.33333333333333,"y":120},{"x":117.5,"y":120},{"x":127.5,"y":130},{"x":127.5,"y":205},{"x":117.5,"y":215},{"x":93.33333333333333,"y":215},{"x":81.375,"y":205},{"x":71.125,"y":205},{"x":59.166666666666664,"y":215},{"x":35,"y":215},{"x":25,"y":205}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":25,"y":120},{"x":127.5,"y":215}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":160,"y":175},{"x":242.5,"y":175},{"x":252.5,"y":245},{"x":201.25,"y":275},{"x":150,"y":245}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":150,"y":175},{"x":252.5,"y":275}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":280,"y":180},{"x":331.25,"y":170},{"x":382.5,"y":180},{"x":382.5,"y":210},{"x":331.25,"y":220},{"x":280,"y":210}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":280,"y":170},{"x":382.5,"y":220}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":160},{"x":645,"y":160},{"x":645,"y":215},{"x":425,"y":215}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":160},{"x":645,"y":215}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":220},{"x":645,"y":220},{"x":645,"y":275},{"x":425,"y":275}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":220},{"x":645,"y":275}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":280},{"x":645,"y":280},{"x":645,"y":335},{"x":425,"y":335}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":280},{"x":645,"y":335}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":425,"y":340},{"x":645,"y":340},{"x":645,"y":420},{"x":425,"y":420}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":425,"y":340},{"x":645,"y":420}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":675,"y":160},{"x":895,"y":160},{"x":895,"y":545},{"x":675,"y":545}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":675,"y":160},{"x":895,"y":545}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":355,"y":110},{"x":530,"y":110},{"x":530,"y":150},{"x":355,"y":150}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":355,"y":110},{"x":530,"y":150}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":15,"y":285},{"x":25,"y":285},{"x":37.5,"y":275},{"x":52.5,"y":275},{"x":65,"y":285},{"x":260,"y":285},{"x":260,"y":315},{"x":65,"y":315},{"x":52.5,"y":325},{"x":37.5,"y":325},{"x":25,"y":315},{"x":15,"y":315}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":15,"y":275},{"x":260,"y":325}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":270,"y":225},{"x":395,"y":225},{"x":395,"y":275},{"x":370,"y":285},{"x":370,"y":325},{"x":270,"y":325}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":270,"y":225},{"x":395,"y":325}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":830,"y":50},{"x":820,"y":52.67949192431122},{"x":812.6794919243113,"y":60},{"x":810,"y":70},{"x":812.6794919243113,"y":80},{"x":820,"y":87.32050807568876},{"x":830,"y":90},{"x":840,"y":87.32050807568878},{"x":847.3205080756887,"y":80},{"x":850,"y":70},{"x":847.3205080756887,"y":60.000000000000014},{"x":840,"y":52.679491924311236}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":810,"y":50},{"x":850,"y":90}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":790,"y":120},{"x":800,"y":110},{"x":890,"y":110},{"x":905,"y":120},{"x":905,"y":140},{"x":890,"y":150},{"x":800,"y":150},{"x":790,"y":140}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);
            var box_b = [{"x":790,"y":110},{"x":905,"y":150}];
            
            var poly_a = [{"x":1027,"y":34},{"x":1027,"y":355},{"x":68,"y":355},{"x":68,"y":34}]; 
            var poly_b = [{"x":80,"y":330},{"x":400,"y":330},{"x":400,"y":392.5},{"x":80,"y":392.5}];
            var box_a = [{"x":1027,"y":355},{"x":68,"y":34}];
            var box_b = [{"x":80,"y":330},{"x":400,"y":392.5}];
            tester(__globals.utility.math.detectOverlap(poly_a, poly_b, box_a, box_b), true);

    console.log('%c-- intersectionOfTwoLineSegments', 'font-weight: bold;');
        //the function tells where the lines would intersect if they were infinatly long in both directions,
        //the next two bools reveal if this point if within the segment given (you need two 'true's for an intersectionOfTwoLineSegments)
        console.log('%c- simple crossing', 'font-weight: bold;');
            var segment1 = [{x:0,y:0},{x:5,y:5}];
            var segment2 = [{x:5,y:0},{x:0,y:5}];
            tester(__globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2), {x: 2.5, y: 2.5, inSeg1: true, inSeg2: true});
        console.log('%c- no crossing', 'font-weight: bold;');
            var segment1 = [{x:0,y:0},{x:5,y:5}];
            var segment2 = [{x:0,y:2},{x:0,y:5}];
            tester(__globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2),{x: 0, y: 0, inSeg1: true, inSeg2: false} );
        console.log('%c- one segment touches the other', 'font-weight: bold;');
            var segment1 = [{x:0,y:0},{x:5,y:5}];
            var segment2 = [{x:2.5,y:2.5},{x:0,y:5}];
            tester(__globals.utility.math.intersectionOfTwoLineSegments(segment1, segment2),{x: 2.5, y: 2.5, inSeg1: true, inSeg2: true} );

    console.log('%c-- boundingBoxFromPoints', 'font-weight: bold;');
        console.log('%c- simple box', 'font-weight: bold;');
            var poly = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
            tester(__globals.utility.math.boundingBoxFromPoints(poly),[{x: 10, y: 10},{x: 0, y: 0}]);
        console.log('%c- triangle', 'font-weight: bold;');
            var poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}];
            tester(__globals.utility.math.boundingBoxFromPoints(poly),[{x: 10, y: 10},{x: 0, y: 0}]);

    console.log('%c-- polar2cartesian', 'font-weight: bold;');
        var distance = 10;
        var angle = 0;
        tester(__globals.utility.math.polar2cartesian(angle,distance),{x: 10, y: 0});
        var distance = -10;
        var angle = 0;
        tester(__globals.utility.math.polar2cartesian(angle,distance),{x: -10, y: -0});
        var distance = 10;
        var angle = Math.PI/2;
        tester(__globals.utility.math.polar2cartesian(angle,distance),{x: 6.123233995736766e-16, y: 10});
        var distance = -10;
        var angle = Math.PI;
        tester(__globals.utility.math.polar2cartesian(angle,distance),{x: 10, y: -1.2246467991473533e-15});
        var distance = 3.5355339059327378;
        var angle = Math.PI/4;
        tester(__globals.utility.math.polar2cartesian(angle,distance),{x: 2.5000000000000004, y: 2.5});

    console.log('%c-- cartesian2polar', 'font-weight: bold;');
        var x = 10;
        var y = 0;
        tester(__globals.utility.math.cartesian2polar(x,y),{dis: 10, ang: 0});
        var x = -10;
        var y = 0;
        tester(__globals.utility.math.cartesian2polar(x,y),{dis: 10, ang: 3.141592653589793});
        var x = 0;
        var y = 10;
        tester( __globals.utility.math.cartesian2polar(x,y),{dis: 10, ang: 1.5707963267948966});
        var x = 10;
        var y = 40;
        tester(__globals.utility.math.cartesian2polar(x,y),{dis: 41.23105625617661, ang: 1.3258176636680326});
        var x = 2.5;
        var y = 2.5;
        tester(__globals.utility.math.cartesian2polar(x,y),{dis: 3.5355339059327378, ang: 0.7853981633974483});

    console.log('%c-- relativeDistance', 'font-weight: bold;');
        tester(__globals.utility.math.relativeDistance(100, 0,1, 0),0);
        tester(__globals.utility.math.relativeDistance(100, 0,1, 1),100);
        tester(__globals.utility.math.relativeDistance(100, 0,1, 0.1),10);
        tester(__globals.utility.math.relativeDistance(100, 0,1, 0.5),50);
        tester(__globals.utility.math.relativeDistance(100, -1,1, 0),50);
        tester(__globals.utility.math.relativeDistance(100, -1,0, 0),100);
        tester(__globals.utility.math.relativeDistance(100, -1,0, 0.5),100);
        tester(__globals.utility.math.relativeDistance(100, -1,0, 0.5, true),150);
            
    console.log('%c-- lineCorrecter', 'font-weight: bold;');
        tester(__globals.utility.math.lineCorrecter({x1:0,y1:0,x2:10,y2:10}, 100, 100),{x1: 0, y1: 0, x2: 10, y2: 10});
        tester(__globals.utility.math.lineCorrecter({x1:0,y1:0,x2:10,y2:10}, 100, 1),undefined);
        tester(__globals.utility.math.lineCorrecter({x1:0,y1:0,x2:10,y2:10}, 1, 100),{x1: 0, y1: 0, x2: 1, y2: 1});