console.log('%cTesting - library.math.fitPolyIn', 'font-size:15px; font-weight:bold;');
{{include:../../../main/1 - core/main.js}}




_canvas_.core.meta.go = function(){
    var sceneValues = {
        environment: 1, // 0, 1 
        testPoly: 2, // 0, 1, 2
    };





    //generate environment 
        var environmentPolys = [
            [
                [{x:10,y:10},{x:110,y:10},{x:110,y:110},{x:10,y:110}],
                [{x:120,y:10},{x:220,y:10},{x:220,y:110},{x:120,y:110}],
                [{x:170,y:110},{x:270,y:110},{x:270,y:210},{x:170,y:210}],
            ],
            [
                [{x:10,y:10},{x:110,y:10},{x:110,y:110},{x:10,y:110}], //the one to the left
                [{x:150,y:30},{x:250,y:30},{x:250,y:130},{x:150,y:130}], //the one to the right
            ],
        ][sceneValues.environment];

        environmentPolys.forEach(a => {
            _canvas_.core.meta.createSetAppend(
                'polygon',JSON.stringify(a), 
                { 
                    pointsAsXYArray:a,
                    colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
                }
            );
        });

        environmentPolys = environmentPolys.map(a => {
            return { points: a, boundingBox: _canvas_.library.math.boundingBoxFromPoints(a) };
        });


    //test poly
        var testPoly = [
            [
                {x:70,y:60},{x:170,y:60},{x:170,y:160},{x:70,y:160}
            ],
            [
                {x:184.97070312499994, y:84.00439687354094},
                {x:184.97070312499994+100, y:84.00439687354094},
                {x:184.97070312499994+100, y:84.00439687354094+100},
                {x:184.97070312499994, y:84.00439687354094+100},
            ],
            [
                {x:110.07110595703125,y:21.0598977691692},
                {x:210.0711059570313,y:21.0598977691692},
                {x:210.0711059570313,y:121.05989776916923},
                {x:110.07110595703125,y:121.05989776916923},
            ],
        ][sceneValues.testPoly];
        _canvas_.core.meta.createSetAppend(
            'polygonWithOutline',testPoly, 
            { 
                pointsAsXYArray:testPoly.map(a => a), thickness:2,
                colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
                lineColour:{r:1,g:0,b:0,a:1},
            }
        );

        testPoly = {
            points: testPoly,
            boundingBox: _canvas_.library.math.boundingBoxFromPoints(testPoly),
        };








    //correct polygon location
        //perform calculation
            console.time('_canvas_.library.math.fitPolyIn');
            var data = _canvas_.library.math.fitPolyIn(testPoly,environmentPolys,undefined,true);
            console.timeEnd('_canvas_.library.math.fitPolyIn');
        //adjust
            testPoly.points = testPoly.points.map(a => { return{x:a.x+data.offset.x,y:a.y+data.offset.y} } );
            testPoly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(testPoly.points);







    //draw new position
        _canvas_.core.meta.createSetAppend(
            'polygonWithOutline','testPoly_adjusted', 
            { 
                pointsAsXYArray:testPoly.points.map(a => a), thickness:2,
                colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:0.2},
                lineColour:{r:0,g:0,b:0,a:1},
            }
        );

    //draw in calculation paths
        for(var a = 0; a < data.paths.length; a++){
            if(data.paths[a].length == 0){continue;}

            _canvas_.core.meta.createSetAppend(
                'path','testPath_'+a, 
                { 
                    pointsAsXYArray:data.paths[a], thickness:2,
                    colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
                }
            );
        }








    //actual render
        _canvas_.core.render.frame();
        setTimeout(_canvas_.core.render.frame,500);
        setTimeout(_canvas_.core.render.frame,1000);
    };

console.log('');