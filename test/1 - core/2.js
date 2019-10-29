var testGroup = _canvas_.core.shape.create('group');
    testGroup.name = 'testGroup';
    _canvas_.core.arrangement.append(testGroup);


_canvas_.library._control.logflow.active(true);
var shapeCount = 20000;
var startTime = (new Date()).getTime();
for(var a = 0; a < shapeCount; a++){
    // var tmp = _canvas_.core.shape.create('rectangle');
    // tmp.name = ''+a;
    // tmp.x( tmp.x() + a/1000 );
    // tmp.y( tmp.y() + a/1000 );
    // tmp.width(30);
    // tmp.height(30);
    // tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    // testGroup.append(tmp);
    var tmp = _canvas_.core.shape.create('polygon');
    tmp.name = 'polygon_'+a;
    tmp.pointsAsXYArray( [ {x:10,y:80}, {x:50,y:80}, {x:20,y:100}, {x:70,y:140}, {x:10,y:140} ].map( point => {return {x:point.x + a/1000, y:point.y + a/1000}}) );
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    _canvas_.core.arrangement.append(tmp);
}
var shapesAddedTime = (new Date()).getTime();
console.log( 'adding '+shapeCount+' shapes took '+(shapesAddedTime - startTime)/1000+' seconds' );



_canvas_.core.render.frame();
var firstFrameRenderedTime = (new Date()).getTime();
console.log( 'rendering first frame took '+(firstFrameRenderedTime - shapesAddedTime)/1000+' seconds' );

_canvas_.core.render.frame();
var secondFrameRenderedTime = (new Date()).getTime();
console.log( 'rendering second frame took '+(secondFrameRenderedTime - firstFrameRenderedTime)/1000+' seconds' );

_canvas_.core.render.frame();
var thirdFrameRenderedTime = (new Date()).getTime();
console.log( 'rendering third frame took '+(thirdFrameRenderedTime - secondFrameRenderedTime)/1000+' seconds' );



for(var a = 1; a < shapeCount-1; a++){testGroup.remove(testGroup.getChildByName(a));}
var shapeRemovedTime = (new Date()).getTime();
console.log( 'removing '+(shapeCount-2)+' shapes took '+(shapeRemovedTime - thirdFrameRenderedTime)/1000+' seconds' );



console.log('');
console.log( _canvas_.library._control.logflow.printResults() );






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