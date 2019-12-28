const point_a = {x:10,y:10};
const point_b = {x:490,y:490};
let field = [
    [point_a],
    [point_b],
    [
        {x:400,y:400},
        {x:410,y:380},
        {x:420,y:410},
        {x:430,y:420},
        {x:430,y:450},
        {x:400,y:450},
    ],
    [
        {x:200,y:270},
        {x:200,y:320},
        {x:250,y:320},
        {x:250,y:260},
        {x:225,y:220},
    ],
    [
        {x:300,y:360},
        {x:300,y:410},
        {x:350,y:410},
        {x:350,y:360},
    ],
    [
        {x:100,y:90},
        {x:200,y:90},
        {x:150,y:190},
    ],
    [
        {x:350,y:90},
        {x:450,y:90},
        {x:400,y:190},
    ],
    [
        {x:80,y:290},
        {x:180,y:250},
        {x:130,y:390},
        {x:85,y:360},
    ],
];
field = field.map(a => {
    return { points: a, boundingBox: _canvas_.library.math.boundingBoxFromPoints(a) };
});

grapher.newCanvas();
grapher.clear();
for(let a = 0; a < field.length; a++){
    grapher.drawPoly(field[a].points,'rgba(200,200,200,1)');
}








const visibilityGraph = _canvas_.library.math.polygonsToVisibilityGraph( field );
// console.log(visibilityGraph);
visibilityGraph.forEach(point_source => {
    grapher.drawCircle(
        field[point_source.polyIndex].points[point_source.pointIndex].x,
        field[point_source.polyIndex].points[point_source.pointIndex].y,
        2.5,
        'rgba(255,0,0,1)'
    );

    let colour = [
        'rgba(200,200,0,1)',
        'rgba(255,0,0,1)',
        'rgba(0,255,0,1)',
        'rgba(0,0,255,1)',
        'rgba(0,255,255,1)',
        'rgba(255,0,255,1)',
        'rgba(200,200,255,1)',
        'rgba(100,0,200,1)',
    ][point_source.polyIndex];
    point_source.destination.forEach(destination => {
        grapher.drawLine(
            field[point_source.polyIndex].points[point_source.pointIndex],
            field[destination.polyIndex].points[destination.pointIndex],
            colour
        );
    });
});








let path = _canvas_.library.math.shortestRouteFromVisibilityGraph( visibilityGraph, 0, 1 );
path = path.map(step => visibilityGraph[step] );
path = path.map(step => field[step.polyIndex].points[step.pointIndex] );
for(let a = 0; a < path.length-1; a++){
    grapher.drawLine( path[a], path[a+1], 'rgba(0,0,0,0.5)', 10);
}