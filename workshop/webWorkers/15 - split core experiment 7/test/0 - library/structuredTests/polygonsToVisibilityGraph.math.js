const grapher = new function(){
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const context = canvas.getContext('2d');
    document.body.append(canvas);

    this.clear = function(){
        context.fillStyle = 'rgba(255,255,255,1)';
        context.fillRect(0,0,canvas.width,canvas.height);
    }
    this.drawLine = function(point_a,point_b,style){
        context.strokeStyle = style;
        context.beginPath();
        context.moveTo(point_a.x,point_a.y);
        context.lineTo(point_b.x,point_b.y);
        context.stroke();
        context.fill();
    }
    this.drawCircle = function(x,y,r,style){
        context.fillStyle = style;
        context.beginPath();
        context.arc(x, y, r, 0, 2*Math.PI);
        context.fill();
    };
    this.drawPoly = function(poly,style){
        context.fillStyle = style;
        context.beginPath();

        context.moveTo(poly[0].x,poly[0].y);
        for(let a = 1; a < poly.length; a++){
            context.lineTo(poly[a].x,poly[a].y);
        }

        context.closePath();
        context.fill();
    }
};







const point_a = {x:10,y:10};
const point_b = {x:400,y:400};
let field = [
    [
        {x:400,y:400},
        {x:410,y:400},
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
        {x:225,y:200},
    ],
    [
        {x:300,y:400-40},
        {x:300,y:450-40},
        {x:350,y:450-40},
        {x:350,y:400-40},
    ],
    [
        {x:100,y:90},
        {x:200,y:90},
        {x:150,y:190},
    ],
];
field = field.map(a => {
    return { points: a, boundingBox: _canvas_.library.math.boundingBoxFromPoints(a) };
});

grapher.clear();
for(let a = 0; a < field.length; a++){
    grapher.drawPoly(field[a].points,'rgba(200,200,200,1)');
}
grapher.drawLine(point_a,point_b,'rgba(100,100,100,1)');







const visibilityGraph = _canvas_.library.math.polygonsToVisibilityGraph(field,grapher);

console.log(visibilityGraph);
visibilityGraph.forEach(point_source => {
    grapher.drawCircle(
        field[point_source.polyIndex].points[point_source.pointIndex].x,
        field[point_source.polyIndex].points[point_source.pointIndex].y,
        2.5,
        'rgba(255,0,0,1)'
    );

    let colour = ['rgba(255,0,0,1)','rgba(0,255,0,1)','rgba(0,0,255,1)','rgba(0,255,255,1)'][point_source.polyIndex];
    point_source.destination.forEach(destination => {
        grapher.drawLine(
            field[point_source.polyIndex].points[point_source.pointIndex],
            field[destination.polyIndex].points[destination.pointIndex],
            colour
        );
    });
});






// const path = _canvas_.library.math.pathFinder(
//     point_a, point_b, field, grapher
// );











// grapher.drawCircle(path[0].x,path[0].y,2.5,'rgba(255,0,0,1)');
// for(let a = 1; a < path.length-1; a++){
//     grapher.drawCircle(path[0].x,path[0].y,2.5,'rgba(0,255,0,1)');
// }
// grapher.drawCircle(path[path.length-1].x,path[path.length-1].y,2.5,'rgba(0,0,255,1)');
// for(let a = 0; a < path.length-1; a++){
//     grapher.drawLine(path[a],path[a+1],'rgba(0,0,0,1)');
// }