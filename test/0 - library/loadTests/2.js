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
    const cycleTime = _canvas_.library.math.seconds2time((time/1000)/((limitedTo > -1 && cycles > limitedTo) ? limitedTo : cycles)); 
    const cycleTime_formatted = cycleTime.s+'s '+cycleTime.ms+'ms '+cycleTime.µs+'µs '+cycleTime.ns+'ns '+cycleTime.ps+'ps '+cycleTime.fs+'fs';

    console.log( 
        _canvas_.library.misc.padString(functionName+':',60),
        _canvas_.library.misc.padString(
            ((limitedTo > -1 && cycles > limitedTo) ? limitedTo : cycles)+ ' cycles took ' + time/1000 +' seconds',
            35,
            ' ',
            'r'
        ),
        '- average cycle time:'+ cycleTime_formatted +''
    );
    if(limitedTo > -1 && cycles > limitedTo){
        const cycleTime = _canvas_.library.math.seconds2time( (time/1000)*(cycles/limitedTo) ); 
        const cycleTime_formatted =cycleTime.h+'h '+cycleTime.m+'m '+cycleTime.s+'s '+cycleTime.ms+'ms '+cycleTime.µs+'µs '+cycleTime.ns+'ns '+cycleTime.ps+'ps '+cycleTime.fs+'fs';

        console.log( (new Array(60).fill(' ').join(''))+' (projected time to perform '+cycles+' cycles: '+ cycleTime_formatted +')' );
    }
}



var loopCount = Math.pow(10,5);



var results = timeTest(
    _canvas_.library.math.averageArray,
    loopCount,
    function(){ return [(new Array(1024).fill().map( () => Math.random()))]; }
);
printResults('library.math.averageArray',results,loopCount);

var limit = 10000;
var results = timeTest(
    _canvas_.library.math.averagePoint,
    loopCount > limit ? limit : loopCount,
    function(){ return [(new Array(1024).fill().map( () => {return{x:Math.random(),y:Math.random()}} ))]; }
);
printResults('library.math.averagePoint',results,loopCount,limit);

var results = timeTest(
    _canvas_.library.math.boundingBoxFromPoints,
    loopCount,
    function(){ return [(new Array(1).fill().map( () => {return {x:Math.random()*100,y:Math.random()*100}} ))]; }
);
printResults('library.math.boundingBoxFromPoints (1 point)',results,loopCount);
var results = timeTest(
    _canvas_.library.math.boundingBoxFromPoints,
    loopCount,
    function(){ return [(new Array(2).fill().map( () => {return {x:Math.random()*100,y:Math.random()*100}} ))]; }
);
printResults('library.math.boundingBoxFromPoints (2 points)',results,loopCount);
var results = timeTest(
    _canvas_.library.math.boundingBoxFromPoints,
    loopCount,
    function(){ return [(new Array(3).fill().map( () => {return {x:Math.random()*100,y:Math.random()*100}} ))]; }
);
printResults('library.math.boundingBoxFromPoints (3 points)',results,loopCount);
var results = timeTest(
    _canvas_.library.math.boundingBoxFromPoints,
    loopCount,
    function(){ return [(new Array(1024).fill().map( () => {return {x:Math.random()*100,y:Math.random()*100}} ))]; }
);
printResults('library.math.boundingBoxFromPoints (1024 points)',results,loopCount);

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
    _canvas_.library.math.getAngleOfTwoPoints,
    loopCount,
    function(){ return (new Array(2).fill().map( () => {return {x:Math.random()*100,y:Math.random()*100}} )); }
);
printResults('library.math.getAngleOfTwoPoints',results,loopCount);

var results = timeTest(
    _canvas_.library.math.getIndexOfSequence,
    loopCount,
    function(){
        var arr = (new Array(1024).fill().map( () => Math.random() ));

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
    function(){ return [(new Array(1024).fill().map( () => Math.random() ))]; }
);
printResults('library.math.largestValueFound',results,loopCount);

var results = timeTest(
    _canvas_.library.math.normalizeStretchArray,
    loopCount,
    function(){ return [(new Array(1024).fill().map( () => Math.random() ))]; }
);
printResults('library.math.normalizeStretchArray',results,loopCount);


var results = timeTest(
    _canvas_.library.math.relativeDistance,
    loopCount,
    function(){ return [ Math.random(),Math.random(),Math.random(),Math.random(),false ]; }
);
printResults('library.math.relativeDistance',results,loopCount);

var results = timeTest(
    _canvas_.library.math.seconds2time,
    loopCount,
    function(){ return [Math.random()*3600]; }
);
printResults('library.math.seconds2time',results,loopCount);

var results = timeTest(
    _canvas_.library.math.distanceBetweenTwoPoints,
    loopCount,
    function(){ return [{x:Math.random()*100,y:Math.random()*100},{x:Math.random()*100,y:Math.random()*100}]; }
);
printResults('library.math.distanceBetweenTwoPoints',results,loopCount);

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
        (new Array(1024).fill().map( () => {return {r:Math.random(),g:Math.random(),b:Math.random(),a:Math.random()}} )),
        Math.random()
    ]; }
);
printResults('library.math.multiBlendColours',results,loopCount);

////////polygonToSubTriangles // ear cut is doing all the work here

////////unionPolygons // PolyBool is doing all the work here

var results = timeTest(
    _canvas_.library.math.detectIntersect.boundingBoxes,
    loopCount,
    function(){ return (new Array(2).fill().map( () => { return {topLeft:{x:Math.random(),y:Math.random()},bottomRight:{x:Math.random(),y:Math.random()}}} )); }
);
printResults('library.math.detectIntersect.boundingBoxes',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectIntersect.pointWithinBoundingBox,
    loopCount,
    function(){ return [ {x:Math.random(),y:Math.random()}, {topLeft:{x:Math.random(),y:Math.random()},bottomRight:{x:Math.random(),y:Math.random()}} ]; }
);
printResults('library.math.detectIntersect.pointWithinBoundingBox',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectIntersect.pointOnLine,
    loopCount,
    function(){ return [{x:Math.random()*100,y:Math.random()*100},[{x:Math.random()*100,y:Math.random()*100},{x:Math.random()*100,y:Math.random()*100}]]; }
);
printResults('library.math.detectIntersect.pointOnLine',results,loopCount);

var points = (new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}));
var results = timeTest(
    _canvas_.library.math.detectIntersect.pointWithinPoly,
    loopCount,
    function(){ return [
        {x:Math.random()*100,y:Math.random()*100},
        {points:points,boundingBox:_canvas_.library.math.boundingBoxFromPoints(points)}
    ]; }
);
printResults('library.math.detectIntersect.pointWithinPoly',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectIntersect.lineOnLine,
    loopCount,
    function(){ return (new Array(2).fill().map( () => [{x:Math.random()*100,y:Math.random()*100},{x:Math.random()*100,y:Math.random()*100}] )); }
);
printResults('library.math.detectIntersect.lineOnLine',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectIntersect.lineOnPoly,
    loopCount,
    function(){ 
        var points = (new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}));
        return [
            [{x:Math.random()*100,y:Math.random()*100},{x:Math.random()*100,y:Math.random()*100}],
            {points:points,boundingBox:_canvas_.library.math.boundingBoxFromPoints(points)}
        ]; 
    }
);
printResults('library.math.detectIntersect.lineOnPoly',results,loopCount);

var results = timeTest(
    _canvas_.library.math.detectIntersect.polyOnPoly,
    loopCount,
    function(){ 
        var points_a = (new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}));
        var points_b = (new Array(1024).fill({x:Math.random()*100,y:Math.random()*100}));
        return [
            {points:points_a,boundingBox:_canvas_.library.math.boundingBoxFromPoints(points_a)},
            {points:points_b,boundingBox:_canvas_.library.math.boundingBoxFromPoints(points_b)}
        ];
     }
);
printResults('library.math.detectIntersect.polyOnPoly',results,loopCount);

var limit = 4;
var results = timeTest(
    _canvas_.library.math.pathExtrapolation,
    loopCount > limit ? limit : loopCount,
    function(){ 
        return [
            (new Array(1024*2).fill().map( () => Math.random()*100 ))
        ]; 
    }
);
printResults('library.math.pathExtrapolation',results,loopCount,limit);

var limit = 5;
var results = timeTest(
    _canvas_.library.math.fitPolyIn,
    loopCount > limit ? limit : loopCount,
    function(){
        var poly = {points:(new Array(128).fill().map( () => {return {x:Math.random()*100,y:Math.random()*100}} ))};
        poly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(poly.points);

        var polys = (new Array(128).fill().map(
            function(){
                var poly = {points:(new Array(128).fill().map( () => {return {x:Math.random()*100,y:Math.random()*100}} ))};
                poly.boundingBox = _canvas_.library.math.boundingBoxFromPoints(poly.points);
                return poly;
            }
        ));

        return [poly,polys];
    }
);
printResults('library.math.fitPolyIn',results,loopCount,limit);

var limit = 100;
var results = timeTest(
    _canvas_.library.math.polygonsToVisibilityGraph,
    loopCount > limit ? limit : loopCount,
    function(){ 
        const polyCount = 10;
        const pointPerPolyCount = 10;

        let field = (new Array(polyCount)).fill().map(() => (
            new Array(pointPerPolyCount).fill().map( () => ({x:Math.random()*100,y:Math.random()*100}))
        ));

        field = field.map(a => {
            return { points: a, boundingBox: _canvas_.library.math.boundingBoxFromPoints(a) };
        });

        return [field];
    }
);
printResults('library.math.polygonsToVisibilityGraph',results,loopCount,limit);







// var results = timeTest(
//     _canvas_.library.misc.removeTheseElementsFromThatArray,
//     loopCount,
//     function(){
//         var arr = (new Array(1024).fill().map( () => Math.random() ));

//         var index = Math.floor(Math.random()*1024);
//         var length = Math.floor(Math.random()*(1024-index));
//         var seq = arr.slice(index,length);

//         return [seq,arr];
//     }
// );
// printResults('library.misc.removeTheseElementsFromThatArray',results,loopCount);

// var limit = 5;
// var results = timeTest(
//     _canvas_.library.misc.getDifferenceOfArrays,
//     loopCount > limit ? limit : loopCount,
//     function(){ return [(new Array(1024).fill().map( () => Math.random())),(new Array(1024).fill().map( () => Math.random()))]; }
// );
// printResults('library.misc.getDifferenceOfArrays',results,loopCount,limit);










console.log('done!');