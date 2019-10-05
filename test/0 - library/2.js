function timeTest(func,loopCount,dataGenerator){
    var startTime = (new Date()).getTime();
    for(var a = 0; a < loopCount; a++){
        try{ func(...dataGenerator()); }
        catch(error){
            console.log('timeTest, only got to cycle:',a);
            console.error(error);
            return;
        }
    }
    var endTime = (new Date()).getTime();
    return endTime - startTime;
}
function printResults(functionName,time,cycles,limitedTo=-1){
    console.log( 
        _canvas_.library.misc.padString(functionName+':',60),
        _canvas_.library.misc.padString(
            ((limitedTo > -1 && cycles > limitedTo) ? limitedTo : cycles)+ ' cycles took ' + time/1000 +' seconds',
            35,
            ' ',
            'r'
        ),
        '- average cycle time:'+ (time/1000)/((limitedTo > -1 && cycles > limitedTo) ? limitedTo : cycles) +' seconds'
    );
    if(limitedTo > -1 && cycles > limitedTo){
        console.log( (new Array(60).fill(' ').join(''))+' (projected time to perform '+cycles+' cycles: '+ (time/1000)*(cycles/limitedTo) +' seconds)' );
    }
}



var loopCount = Math.pow(10,5);



var results = timeTest(
    _canvas_.library.math.averageArray,
    loopCount,
    function(){ return [(new Array(1024).fill(Math.random()))]; }
);
printResults('library.math.averageArray',results,loopCount);

var results = timeTest(
    _canvas_.library.math.averagePoint,
    loopCount,
    function(){ return [(new Array(1024).fill({x:Math.random(),y:Math.random()}))]; }
);
printResults('library.math.averagePoint',results,loopCount);

var results = timeTest(
    _canvas_.library.math.boundingBoxFromPoints,
    loopCount,
    function(){ return [(new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}))]; }
);
printResults('library.math.boundingBoxFromPoints',results,loopCount);

var results = timeTest(
    _canvas_.library.math.cartesianAngleAdjust,
    loopCount,
    function(){ return [Math.random(),Math.random(),Math.random()]; }
);
printResults('library.math.cartesianAngleAdjust',results,loopCount);

var results = timeTest(
    _canvas_.library.math.convertColour.obj2rgba,
    loopCount,
    function(){ return [{r:Math.random(),g:Math.random(),b:Math.random()}]; }
);
printResults('library.math.convertColour.obj2rgba',results,loopCount);

var results = timeTest(
    _canvas_.library.math.convertColour.rgba2obj,
    loopCount,
    function(){ return [('rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')')]; }
);
printResults('library.math.convertColour.rgba2obj',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curveGenerator.linear,
    loopCount,
    function(){ return [Math.floor(Math.random()*100),Math.random(),Math.random()]; }
);
printResults('library.math.curveGenerator.linear',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curveGenerator.sin,
    loopCount,
    function(){ return [Math.floor(Math.random()*100),Math.random(),Math.random()]; }
);
printResults('library.math.curveGenerator.sin',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curveGenerator.cos,
    loopCount,
    function(){ return [Math.floor(Math.random()*100),Math.random(),Math.random()]; }
);
printResults('library.math.curveGenerator.cos',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curveGenerator.s,
    loopCount,
    function(){ return [Math.floor(Math.random()*100),Math.random(),Math.random(),Math.floor(Math.random()*100)]; }
);
printResults('library.math.curveGenerator.s',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curveGenerator.exponential,
    loopCount,
    function(){ return [Math.floor(Math.random()*100),Math.random(),Math.random(),Math.floor(Math.random()*100)]; }
);
printResults('library.math.curveGenerator.exponential',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curvePoint.linear,
    loopCount,
    function(){ return [Math.random(),Math.random(),Math.random()]; }
);
printResults('library.math.curvePoint.linear',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curvePoint.sin,
    loopCount,
    function(){ return [Math.random(),Math.random(),Math.random()]; }
);
printResults('library.math.curvePoint.sin',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curvePoint.cos,
    loopCount,
    function(){ return [Math.random(),Math.random(),Math.random()]; }
);
printResults('library.math.curvePoint.cos',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curvePoint.s,
    loopCount,
    function(){ return [Math.random(),Math.random(),Math.random(),Math.floor(Math.random()*100)]; }
);
printResults('library.math.curvePoint.s',results,loopCount);

var results = timeTest(
    _canvas_.library.math.curvePoint.exponential,
    loopCount,
    function(){ return [Math.random(),Math.random(),Math.random(),Math.floor(Math.random()*100)]; }
);
printResults('library.math.curvePoint.exponential',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectOverlap.boundingBoxes,
    loopCount,
    function(){ return (new Array(2).fill( {topLeft:{x:Math.random(),y:Math.random()},bottomRight:{x:Math.random(),y:Math.random()}} )); }
);
printResults('library.math.detectOverlap.boundingBoxes',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectOverlap.pointWithinBoundingBox,
    loopCount,
    function(){ return [ {x:Math.random(),y:Math.random()}, {topLeft:{x:Math.random(),y:Math.random()},bottomRight:{x:Math.random(),y:Math.random()}} ]; }
);
printResults('library.math.detectOverlap.pointWithinBoundingBox',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectOverlap.pointWithinPoly,
    loopCount,
    function(){ return [{x:Math.random()*100,y:Math.random()*100},(new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}))]; }
);
printResults('library.math.detectOverlap.pointWithinPoly',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectOverlap.lineSegments,
    loopCount,
    function(){ return (new Array(2).fill( [{x:Math.random()*100,y:Math.random()*100},{x:Math.random()*100,y:Math.random()*100}] )); }
);
printResults('library.math.detectOverlap.lineSegments',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectOverlap.overlappingPolygons,
    loopCount,
    function(){ return (new Array(2).fill( (new Array(1024).fill({x:Math.random()*100,y:Math.random()*100})) )); }
);
printResults('library.math.detectOverlap.overlappingPolygons',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectOverlap.overlappingPolygonWithPolygons,
    loopCount,
    function(){ 
        var poly = {points:(new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}))};
        poly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(poly.points);

        var polys = (new Array(1024).fill(
            (function(){
                var poly = {points:(new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}))};
                poly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(poly.points);
                return poly;
            })()
        ));

        return [poly,polys];
    }
);
printResults('library.math.detectOverlap.overlappingPolygonWithPolygons',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectOverlap.overlappingLineWithPolygons,
    loopCount,    
    function(){ 
        var line = (new Array(2).fill( [{x:Math.random()*100,y:Math.random()*100},{x:Math.random()*100,y:Math.random()*100}] ));

        var polys = (new Array(1024).fill(
            (function(){
                var poly = {points:(new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}))};
                poly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(poly.points);
                return poly;
            })()
        ));

        return [line,polys];
    }
);
printResults('library.math.detectOverlap.overlappingLineWithPolygons',results,loopCount);

var results = timeTest(
    _canvas_.library.math.getAngleOfTwoPoints,
    loopCount,
    function(){ return (new Array(2).fill( {x:Math.random()*100,y:Math.random()*100} )); }
);
printResults('library.math.getAngleOfTwoPoints',results,loopCount);

var limit = 500;
var results = timeTest(
    _canvas_.library.math.getDifferenceOfArrays,
    loopCount > limit ? limit : loopCount,
    function(){ return [(new Array(1024).fill(Math.random())),(new Array(1024).fill(Math.random()))]; }
);
printResults('library.math.getDifferenceOfArrays',results,loopCount,limit);

var results = timeTest(
    _canvas_.library.math.getIndexOfSequence,
    loopCount,
    function(){
        var arr = (new Array(1024).fill(Math.random()));

        var index = Math.floor(Math.random()*1024);
        var length = Math.floor(Math.random()*(1024-index));
        var seq = arr.slice(index,length);

        return [arr,seq];
    }
);
printResults('library.math.getIndexOfSequence',results,loopCount);

var results = timeTest(
    _canvas_.library.math.largestValueFound,
    loopCount,
    function(){ return [(new Array(1024).fill(Math.random()))]; }
);
printResults('library.math.largestValueFound',results,loopCount);

var results = timeTest(
    _canvas_.library.math.normalizeStretchArray,
    loopCount,
    function(){ return [(new Array(1024).fill( Math.random() ))]; }
);
printResults('library.math.normalizeStretchArray',results,loopCount);


var results = timeTest(
    _canvas_.library.math.relativeDistance,
    loopCount,
    function(){ return [ Math.random(),Math.random(),Math.random(),Math.random(),false ]; }
);
printResults('library.math.relativeDistance',results,loopCount);

var results = timeTest(
    _canvas_.library.math.removeTheseElementsFromThatArray,
    loopCount,
    function(){
        var arr = (new Array(1024).fill(Math.random()));

        var index = Math.floor(Math.random()*1024);
        var length = Math.floor(Math.random()*(1024-index));
        var seq = arr.slice(index,length);

        return [seq,arr];
    }
);
printResults('library.math.removeTheseElementsFromThatArray',results,loopCount);

var results = timeTest(
    _canvas_.library.math.seconds2time,
    loopCount,
    function(){ return [Math.random()*3600]; }
);
printResults('library.math.seconds2time',results,loopCount);

var results = timeTest(
    _canvas_.library.math.cartesian2polar,
    loopCount,
    function(){ return [Math.random(),Math.random()]; }
);
printResults('library.math.cartesian2polar',results,loopCount);

var results = timeTest(
    _canvas_.library.math.polar2cartesian,
    loopCount,
    function(){ return [Math.random(),Math.random()]; }
);
printResults('library.math.polar2cartesian',results,loopCount);

var results = timeTest(
    _canvas_.library.math.blendColours,
    loopCount,
    function(){ return [
        {r:Math.random(),g:Math.random(),b:Math.random(),a:Math.random()},
        {r:Math.random(),g:Math.random(),b:Math.random(),a:Math.random()},
        Math.random()
    ]; }
);
printResults('library.math.blendColours',results,loopCount);

var results = timeTest(
    _canvas_.library.math.multiBlendColours,
    loopCount,
    function(){ return [
        (new Array(1024).fill( {r:Math.random(),g:Math.random(),b:Math.random(),a:Math.random()} )),
        Math.random()
    ]; }
);
printResults('library.math.multiBlendColours',results,loopCount);

//polygonToSubTriangles // ear cut is doing all the work here

//unionPolygons // PolyBool is doing all the work here

var limit = 100;
var results = timeTest(
    _canvas_.library.math.pathExtrapolation,
    loopCount > limit ? limit : loopCount,
    function(){ 
        return [
            (new Array(1024).fill( {x:Math.random()*100,y:Math.random()*100} ))
        ]; 
    }
);
printResults('library.math.pathExtrapolation',results,loopCount,limit);

var limit = 1000;
var results = timeTest(
    _canvas_.library.math.fitPolyIn,
    loopCount > limit ? limit : loopCount,
    function(){
        var poly = {points:(new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}))};
        poly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(poly.points);

        var polys = (new Array(1024).fill(
            (function(){
                var poly = {points:(new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}))};
                poly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(poly.points);
                return poly;
            })()
        ));

        return [poly,polys];
    }
);
printResults('library.math.fitPolyIn',results,loopCount,limit);






console.log('done!');