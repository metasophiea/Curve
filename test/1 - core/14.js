function adjustShapeCount(newShapeCount){
    var currentCount = _canvas_.core.arrangement.get().children().length;

    if( newShapeCount > currentCount ){
        for(var a = 0; a < newShapeCount - currentCount; a++){
            var tmp = _canvas_.core.shape.create('rectangle');
                tmp.name = 'rectangle_'+(currentCount+a);
                tmp.stopAttributeStartedExtremityUpdate = true;
                tmp.x(10+Math.random()*500);
                tmp.y(10+Math.random()*500); 
                tmp.width(10);
                tmp.height(10);
                tmp.stopAttributeStartedExtremityUpdate = false;
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                _canvas_.core.arrangement.append(tmp);
        }
    }
    else if( newShapeCount < currentCount ){
        for(var a = currentCount-1; a > newShapeCount-1; a--){
            _canvas_.core.arrangement.get().remove(
                _canvas_.core.arrangement.get().getChildByName('rectangle_'+a)
            );
        }
    }
}












var shapeCount = 0;
var shapeCountStats = {max:0,rollingAverage:0,rollingAverageBuffer:[],rollingAverageBufferLength:100};

_canvas_.core.render.active(true);
_canvas_.core.stats.active(true);
var averages = [];
var rollingAverage = 0;
var interval = setInterval(function(){
    var tmp = _canvas_.core.stats.getReport();
    averages.push(tmp.framesPerSecond);
    console.log( 'rollingAverage:',_canvas_.library.math.averageArray(averages),tmp );

    if(shapeCount > shapeCountStats.max){shapeCountStats.max = shapeCount;}
    shapeCountStats.rollingAverageBuffer.push(shapeCount); if(shapeCountStats.rollingAverageBuffer.length > shapeCountStats.rollingAverageBufferLength){shapeCountStats.rollingAverageBuffer.shift();}
    console.log( 'current shape count:',shapeCount, 'highest shape count:',shapeCountStats.max, 'rolling average:',_canvas_.library.math.averageArray(shapeCountStats.rollingAverageBuffer));

    if(tmp.framesPerSecond > 40){
        shapeCount += 100;
    }else{
        shapeCount -= 100;
    }
    adjustShapeCount(shapeCount);
},100);
function stop(){ clearInterval(interval); }








_canvas_.library._control.logflow.active(true);
console.log( _canvas_.library._control.logflow.printResults() );