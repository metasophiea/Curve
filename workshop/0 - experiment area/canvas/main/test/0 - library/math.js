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

        