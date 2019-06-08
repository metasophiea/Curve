//Work Laptop (dell/linux): 10000/~30fps
//Desktop Mac: 10000/~45fps
//Laptop Mac: 10000/~28fps

var startTime = (new Date()).getTime();
for(var a = 0; a < 1000; a++){
    var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = ''+a;
    tmp.x( tmp.x() + a/100 );
    tmp.y( 0 );
    tmp.width(30);
    tmp.height(30);
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
}
var shapesAddedTime = (new Date()).getTime();
console.log( (shapesAddedTime - startTime)/1000 );




_canvas_.core.arrangement.remove(tmp);

_canvas_.core.render.frame();

// _canvas_.core.render.active(true);
// _canvas_.core.stats.active(true);
// var averages = [];
// var rollingAverage = 0;
// var rollingAverageIndex = 1;
// setInterval(function(){
//     var tmp = _canvas_.core.stats.getReport();
//     averages.push(tmp.framesPerSecond);
//     console.log( 'rollingAverage:',_canvas_.library.math.averageArray(averages),tmp );
// },1000);