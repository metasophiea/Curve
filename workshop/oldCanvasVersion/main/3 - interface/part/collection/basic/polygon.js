this.polygon = function(
    name=null, 
    points=[], 
    ignored=false,
    fillStyle='rgba(255,100,255,1)', 
    strokeStyle='rgba(0,0,0,0)', 
    lineWidth=1,
    lineJoin='round',
    miterLimit=2,
){
    var temp = workspace.core.arrangement.createElement('polygon');
    temp.name = name;
    temp.points = points;
    temp.ignored = ignored;
    temp.style.fill = fillStyle;
    temp.style.stroke = strokeStyle;
    temp.style.lineWidth = lineWidth;
    temp.style.lineJoin = lineJoin;
    temp.style.miterLimit = miterLimit;

    return temp;
};

// this.advancedPolygon = function(
//     name=null, 
//     points=[], 
//     fillStyle='rgba(255,100,255,1)', 
//     strokeStyle='rgba(0,0,0,1)', 
//     lineWidth=1,
//     lineJoin='round',
//     miterLimit=2,
// ){
//     var temp = workspace.core.arrangement.createElement('advancedPolygon');
//     temp.name = name;
//     temp.points = points;
//     temp.style.fill = fillStyle;
//     temp.style.stroke = strokeStyle;
//     temp.style.lineWidth = lineWidth;
//     temp.style.lineJoin = lineJoin;
//     temp.style.miterLimit = miterLimit;

//     return temp;
// };