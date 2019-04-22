console.log('%cTesting - system.library.math.fitPolyIn', 'font-size:15px; font-weight:bold;');
{{include:../../main/1 - core/main.js}}




var sceneValues = {
    environment: 1,
    testPoly: 0,
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
        var temp = _canvas_.core.shape.create('polygon');
        temp.name = JSON.stringify(a);
        temp.pointsAsXYArray(a);
        temp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        _canvas_.core.arrangement.append(temp);
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
    var temp = _canvas_.core.shape.create('polygonWithOutline');
        temp.name = 'testPoly';
        temp.pointsAsXYArray(testPoly.map(a => a));
        temp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
        temp.lineColour = {r:0,g:0,b:0,a:1};
        temp.thickness(2);
        _canvas_.core.arrangement.append(temp);

    testPoly = {
        points: testPoly,
        boundingBox: _canvas_.library.math.boundingBoxFromPoints(testPoly),
    };








//correct polygon location
    //perform calculation
        console.time('_canvas_.library.math.fitPolyIn');
        var data = _canvas_.library.math.fitPolyIn(testPoly,environmentPolys,true);
        console.timeEnd('_canvas_.library.math.fitPolyIn');
    //adjust
        testPoly.points = testPoly.points.map(a => { return{x:a.x+data.offset.x,y:a.y+data.offset.y} } );
        testPoly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(testPoly.points);







//draw new position
    var temp = _canvas_.core.shape.create('polygonWithOutline');
    temp.name = 'testPoly_adjusted';
    temp.pointsAsXYArray(testPoly.points.map(a => a));
    temp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.2};
    temp.lineColour = {r:0,g:0,b:0,a:1};
    temp.thickness(2);
    _canvas_.core.arrangement.append(temp);

//draw in calculation paths
    for(var a = 0; a < data.paths.length; a++){
        if(data.paths[a].length == 0){continue;}

        var temp = _canvas_.core.shape.create('path');
        temp.name = 'testPath_'+a;
        temp.pointsAsXYArray(data.paths[a]);
        temp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        temp.thickness(2);
        _canvas_.core.arrangement.append(temp);
    }








//actual render
    _canvas_.core.render.frame();