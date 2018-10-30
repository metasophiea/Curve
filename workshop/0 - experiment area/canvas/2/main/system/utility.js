this.cartesian2polar = function(x,y){
    var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;

    if(x === 0 ){
        if(y === 0){ang = 0;}
        else if(y > 0){ang = 0.5*Math.PI;}
        else{ang = 1.5*Math.PI;}
    }
    else if(y === 0 ){
        if(x >= 0){ang = 0;}else{ang = Math.PI;}
    }
    else if(x >= 0){ ang = Math.atan(y/x); }
    else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }

    return {'dis':dis,'ang':ang};
};
this.polar2cartesian = function(angle,distance){
    return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
};
this.cartesianAngleAdjust = function(x,y,angle){
    var polar = this.cartesian2polar( x, y );
    polar.ang += angle;
    return this.polar2cartesian( polar.ang, polar.dis );
};
this.boundingBoxFromPoints = function(points){
    var left = points[0].x; var right = points[0].x;
    var top = points[0].y;  var bottom = points[0].y;

    for(var a = 1; a < points.length; a++){
        if( points[a].x < left ){ left = points[a].x; }
        else if(points[a].x > right){ right = points[a].x; }

        if( points[a].y < top ){ top = points[a].y; }
        else if(points[a].y > bottom){ bottom = points[a].y; }
    }

    return {
        topLeft:{x:left,y:top},
        bottomRight:{x:right,y:bottom}
    };
};
this.pointsOfRect = function(x,y,width,height,angle=0,anchor={x:0,y:0}){
    var corners = {};
    var offsetX = anchor.x*width;
    var offsetY = anchor.y*height;

    var polar = this.cartesian2polar( offsetX, offsetY );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.tl = { x:(x - point.x), y:(y - point.y) };

    var polar = this.cartesian2polar( offsetX-width, offsetY );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.tr = { x:(x - point.x), y:(y - point.y) };

    var polar = this.cartesian2polar( offsetX-width, offsetY-height );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.br = { x:(x - point.x), y:(y - point.y) };

    var polar = this.cartesian2polar( offsetX, offsetY-height );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.bl = { x:(x - point.x), y:(y - point.y) };

    return [
        corners.tl,
        corners.tr, 
        corners.br, 
        corners.bl, 
    ];
};
this.detectOverlap = new function(){
    this.boundingBoxOnly = function(a, b){
        return !(
            (a.bottomRight.y < b.topLeft.y) ||
            (a.topLeft.y > b.bottomRight.y) ||
            (a.bottomRight.x < b.topLeft.x) ||
            (a.topLeft.x > b.bottomRight.x)   
        );};
    this.pointWithinPoly = function(point,points){
        var inside = false;
        for(var a = 0, b = points.length - 1; a < points.length; b = a++) {
            if(
                ((points[a].y > point.y) != (points[b].y > point.y)) && 
                (point.x < ((((points[b].x-points[a].x)*(point.y-points[a].y)) / (points[b].y-points[a].y)) + points[a].x))
            ){inside = !inside;}
        }
        return inside;
    };
};
this.functionListRunner = function(list){
    //function builder for working with the 'functionList' format

    return function(event){
        //run through function list, and activate functions where necessary
            for(var a = 0; a < list.length; a++){
                var shouldRun = true;

                //determine if all the requirements of this function are met
                    for(var b = 0; b < list[a].specialKeys.length; b++){
                        shouldRun = shouldRun && event[list[a].specialKeys[b]];
                        if(!shouldRun){break;} //(one is already not a match, so save time and just bail here)
                    }

                //if all requirements were met, run the function
                if(shouldRun){  
                    //if the function returns 'false', continue with the list; otherwise stop here
                        if( list[a].function(event) ){ break; }
                }
            }
    }
};
this.vectorAddition = function(vector_1, vector_2){
    if(!vector_1){return vector_2;}
    if(!vector_2){return vector_1;}

    var outputObject = {};
    var keys = Object.keys(vector_1);
    for(var a = 0; a < keys.length; a++){
        outputObject[keys[a]] = vector_1[keys[a]] + vector_2[keys[a]];
    }
    return outputObject;
};