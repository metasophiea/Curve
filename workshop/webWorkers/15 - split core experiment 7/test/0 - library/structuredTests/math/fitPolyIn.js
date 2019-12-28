console.log('%cTesting - library.math.fitPolyIn', 'font-size:15px; font-weight:bold;');
let sceneValues = {
    environment: 0, // 0, 1 
    testPoly: 0, // 0, 1, 2
};

grapher.newCanvas();
grapher.clear();

//generate environment 
    let environmentPolys = [
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
        grapher.drawPoly(
            a,
            'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+',1)'
        );
    });

    environmentPolys = environmentPolys.map(a => {
        return { points: a, boundingBox: _canvas_.library.math.boundingBoxFromPoints(a) };
    });
    
//test poly
    let testPoly = [
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
    grapher.drawPoly(
        testPoly,
        'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+',1)',
        'rgba(255,0,0,1)',
        2
    );

    testPoly = {
        points: testPoly,
        boundingBox: _canvas_.library.math.boundingBoxFromPoints(testPoly),
    };















//correct polygon location
    //perform calculation
        console.time('_canvas_.library.math.fitPolyIn');
        let data = _canvas_.library.math.fitPolyIn(testPoly,environmentPolys,undefined,true);
        console.timeEnd('_canvas_.library.math.fitPolyIn');
    //adjust
        testPoly.points = testPoly.points.map(a => { return{x:a.x+data.offset.x,y:a.y+data.offset.y} } );
        testPoly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(testPoly.points);



















//draw new position
    grapher.drawPoly(
        testPoly.points,
        'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+',0.2)',
        'rgba(0,0,0,1)',
        2
    );

//draw in calculation paths
    for(let a = 0; a < data.paths.length; a++){
        if(data.paths[a].length == 0){continue;}

        let colour = 'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+',1)';
        for(let b = 0; b < data.paths[a].length-1; b++){
            grapher.drawLine( data.paths[a][b], data.paths[a][b+1], colour );
        }
    }

