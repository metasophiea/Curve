{{include:../../main/1 - core/main.js}}




var sceneValues = {
    environment: 1,
    testPoly: 2,
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
        var temp = workspace.core.arrangement.createElement('polygon');
        temp.name = JSON.stringify(a);
        temp.points = a;
        temp.style.fill = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
        workspace.core.arrangement.append(temp);
    });

    environmentPolys = environmentPolys.map(a => {
        return { points: a, boundingBox: workspace.library.math.boundingBoxFromPoints(a) };
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
        var temp = workspace.core.arrangement.createElement('polygon');
        temp.name = 'testPoly';
        temp.points = testPoly.map(a => a)
        temp.style.fill = "rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",0)";
        temp.style.stroke = 'rgb(0,0,0)';
        temp.style.lineWidth = '2';
        workspace.core.arrangement.append(temp);

    testPoly = {
        points: testPoly,
        boundingBox: workspace.library.math.boundingBoxFromPoints(testPoly),
    };








//correct polygon location
    //perform calculation
        console.time('workspace.library.math.fitPolyIn');
        var data = workspace.library.math.fitPolyIn(testPoly,environmentPolys,true);
        console.timeEnd('workspace.library.math.fitPolyIn');
    //adjust
        testPoly.points = workspace.library.math.applyOffsetToPoints( data.offset, testPoly.points );
        testPoly.boundingBox = workspace.library.math.boundingBoxFromPoints(testPoly.points);







//draw new position
    var temp = workspace.core.arrangement.createElement('polygon');
    temp.name = 'testPoly_adjusted';
    temp.points = testPoly.points.map(a => a)
    temp.style.fill = "rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",0.5)";
    temp.style.stroke = 'rgb(0,0,0)';
    temp.style.lineWidth = '2';
    workspace.core.arrangement.append(temp);

//draw in calculation paths
    for(var a = 0; a < data.paths.length; a++){
        if(data.paths[a].length == 0){continue;}

        var temp = workspace.core.arrangement.createElement('path');
        temp.name = 'testPath_'+a;
        temp.points = data.paths[a];
        temp.style.stroke = "rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",1)";
        temp.style.lineWidth = 2;
        workspace.core.arrangement.append(temp);
    }








//actual render
    workspace.core.render.frame();