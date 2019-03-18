this.averagePoint = function(points){
    var sum = points.reduce((a,b) => {return {x:(a.x+b.x),y:(a.y+b.y)};} );
    return {x:sum.x/points.length,y:sum.y/points.length};
};
this.cartesianAngleAdjust = function(x,y,angle){
    function cartesian2polar(x,y){
        var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
    
        if(x === 0){
            if(y === 0){ang = 0;}
            else if(y > 0){ang = 0.5*Math.PI;}
            else{ang = 1.5*Math.PI;}
        }
        else if(y === 0){
            if(x >= 0){ang = 0;}else{ang = Math.PI;}
        }
        else if(x >= 0){ ang = Math.atan(y/x); }
        else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
    
        return {'dis':dis,'ang':ang};
    };
    function polar2cartesian(angle,distance){
        return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
    };

    if(angle == 0 || angle%(Math.PI*2) == 0){ return {x:x,y:y}; }
    var polar = cartesian2polar( x, y );
    polar.ang += angle;
    return polar2cartesian( polar.ang, polar.dis );
};
this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
this.boundingBoxFromPoints = function(points){
    if(points.length == 0){
        return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
    }

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
this.detectOverlap = new function(){
    this.boundingBoxes = function(a, b){
        return !(
            (a.bottomRight.y < b.topLeft.y) ||
            (a.topLeft.y > b.bottomRight.y) ||
            (a.bottomRight.x < b.topLeft.x) ||
            (a.topLeft.x > b.bottomRight.x) );
    };
    this.pointWithinBoundingBox = function(point,box){
        return !(
            point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
            point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
        );
    };
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
    this.lineSegments = function(segment1, segment2){
        var denominator = (segment2[1].y-segment2[0].y)*(segment1[1].x-segment1[0].x) - (segment2[1].x-segment2[0].x)*(segment1[1].y-segment1[0].y);
        if(denominator == 0){return null;}

        var u1 = ((segment2[1].x-segment2[0].x)*(segment1[0].y-segment2[0].y) - (segment2[1].y-segment2[0].y)*(segment1[0].x-segment2[0].x))/denominator;
        var u2 = ((segment1[1].x-segment1[0].x)*(segment1[0].y-segment2[0].y) - (segment1[1].y-segment1[0].y)*(segment1[0].x-segment2[0].x))/denominator;;
        return {
            'x':      (segment1[0].x + u1*(segment1[1].x-segment1[0].x)),
            'y':      (segment1[0].y + u1*(segment1[1].y-segment1[0].y)),
            'inSeg1': (u1 >= 0 && u1 <= 1),
            'inSeg2': (u2 >= 0 && u2 <= 1)
        };
    };
    this.overlappingPolygons = function(points_a,points_b){
        //a point from A is in B
            for(var a = 0; a < points_a.length; a++){
                if(this.pointWithinPoly(points_a[a],points_b)){ return true; }
            }

        //a point from B is in A
            for(var a = 0; a < points_b.length; a++){
                if(this.pointWithinPoly(points_b[a],points_a)){ return true; }
            }

        //side intersection
            var a_indexing = Array.apply(null, {length: points_a.length}).map(Number.call, Number).concat([0]);
            var b_indexing = Array.apply(null, {length: points_b.length}).map(Number.call, Number).concat([0]);

            for(var a = 0; a < a_indexing.length-1; a++){
                for(var b = 0; b < b_indexing.length-1; b++){
                    var tmp = this.lineSegments( 
                        [ points_a[a_indexing[a]], points_a[a_indexing[a+1]] ],
                        [ points_b[b_indexing[b]], points_b[b_indexing[b+1]] ]
                    );
                    if( tmp != null && tmp.inSeg1 && tmp.inSeg2 ){return true;}
                }
            }

        return false;
    };
    this.overlappingPolygonWithPolygons = function(poly,polys){ 
        for(var a = 0; a < polys.length; a++){
            if(this.boundingBoxes(poly.boundingBox, polys[a].boundingBox)){
                if(this.overlappingPolygons(poly.points, polys[a].points)){
                    return true;
                }
            }
        }
        return false;
    };
};
this.getIndexOfSequence = function(array,sequence){ 
    function comp(thing_A,thing_B){
        var keys = Object.keys(thing_A);
        if(keys.length == 0){ return thing_A == thing_B; }

        for(var a = 0; a < keys.length; a++){
            if( !thing_B.hasOwnProperty(keys[a]) ){ return false; }
            if( thing_A[keys[a]] != thing_B[keys[a]] ){ return false; }
        }
        return true;
    }

    var index = 0;
    for(index = 0; index < array.length - sequence.length + 1; index++){
        if( comp(array[index], sequence[0]) ){
            var match = true;
            for(var a = 1; a < sequence.length; a++){
                if( !comp(array[index+a],sequence[a]) ){
                    match = false;
                    break;
                }
            }
            if(match){return index;}
        }
    }

    return undefined;
};
this.removeTheseElementsFromThatArray = function(theseElements,thatArray){
    var leftOvers = [];
    theseElements.forEach(function(a){
        var index = thatArray.indexOf(a);
        if(index == -1){ leftOvers.push(a); }
        else{ thatArray.splice(index, 1); }
    });
    return leftOvers;
};
this.getDifferenceOfArrays = function(array_a,array_b){
    var out_a = []; var out_b = [];

    for(var a = 0; a < array_a.length; a++){
        if(array_b.indexOf(array_a[a]) == -1){ out_a.push(array_a[a]); }
    }

    for(var b = 0; b < array_b.length; b++){
        if(array_a.indexOf(array_b[b]) == -1){ out_b.push(array_b[b]); }
    }

    return {a:out_a,b:out_b};
};
this.getAngleOfTwoPoints = function(point_1,point_2){
    var xDelta = point_2.x - point_1.x;
    var yDelta = point_2.y - point_1.y;
    var angle = Math.atan( yDelta/xDelta );

    if(xDelta < 0){ angle = Math.PI + angle; }
    else if(yDelta < 0){ angle = Math.PI*2 + angle; }

    return angle;
};
this.pathToPolygonGenerator = function(path,thickness,returnedPointsFormat){
    var jointData = [];

    //parse path
        for(var a = 0; a < path.length/2; a++){
            jointData.push({ point:{ x:path[a*2], y:path[a*2 +1] } });
        }
    //calculate segment angles, joing angles, wing angles and wing widths; then generate wing points
        var outputPoints = [];
        for(var a = 0; a < jointData.length; a++){
            var item = jointData[a];

            //calculate segment angles
                if( a != jointData.length-1 ){
                    var tmp = _canvas_.library.math.getAngleOfTwoPoints( jointData[a].point, jointData[a+1].point );
                    if(jointData[a] != undefined){jointData[a].departAngle = tmp;}
                    if(jointData[a+1] != undefined){jointData[a+1].implimentAngle = tmp;}
                }

            //joining angles
                var joiningAngle = item.departAngle == undefined || item.implimentAngle == undefined ? Math.PI : item.departAngle - item.implimentAngle + Math.PI;

            //angle
                var segmentAngle = item.implimentAngle != undefined ? item.implimentAngle : item.departAngle;
                var wingAngle = segmentAngle + joiningAngle/2;

            //width
                var div = a == 0 || a == jointData.length-1 ? 1 : Math.sin(joiningAngle/2);
                var wingWidth = thickness / div;

            //wing points
                var plus =  _canvas_.library.math.cartesianAngleAdjust(0,  wingWidth, Math.PI/2 + wingAngle);
                var minus = _canvas_.library.math.cartesianAngleAdjust(0, -wingWidth, Math.PI/2 + wingAngle);
                outputPoints.push( plus.x+ item.point.x, plus.y+ item.point.y );
                outputPoints.push( minus.x+item.point.x, minus.y+item.point.y );
        }


    if(returnedPointsFormat == 'TRIANGLE_STRIP'){
        return outputPoints;
    }else if(returnedPointsFormat == 'TRIANGLES'){
        var replacementPoints = [];

        for(var a = 0; a < outputPoints.length/2-2; a++){
            replacementPoints.push( outputPoints[a*2+0],outputPoints[a*2+1] );
            replacementPoints.push( outputPoints[a*2+2],outputPoints[a*2+3] );
            replacementPoints.push( outputPoints[a*2+4],outputPoints[a*2+5] );
        }

        return replacementPoints;
    }

    return outputPoints;
};
this.loopedPathToPolygonGenerator = function(path,thickness,returnedPointsFormat){
    var joinPoint = [ (path[0]+path[2])/2, (path[1]+path[3])/2 ];
    var loopingPath = [];

    loopingPath = loopingPath.concat(joinPoint);
    for(var a = 2; a < path.length; a+=2){
        loopingPath = loopingPath.concat( [path[a], path[a+1]] );
    }
    loopingPath = loopingPath.concat( [path[0], path[1]] );
    loopingPath = loopingPath.concat(joinPoint);

    return this.pathToPolygonGenerator(loopingPath,thickness,returnedPointsFormat);
};
this.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
    var mux = (d - start)/(end - start);
    if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
    return mux*realLength;
};
this.blendColours = function(rgba_1,rgba_2,ratio){
    return {
        r: (1-ratio)*rgba_1.r + ratio*rgba_2.r,
        g: (1-ratio)*rgba_1.g + ratio*rgba_2.g,
        b: (1-ratio)*rgba_1.b + ratio*rgba_2.b,
        a: (1-ratio)*rgba_1.a + ratio*rgba_2.a,
    };           
};
this.multiBlendColours = function(rgbaList,ratio){
    //special cases
        if(ratio == 0){return rgbaList[0];}
        if(ratio == 1){return rgbaList[rgbaList.length-1];}
    //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
        var p = ratio*(rgbaList.length-1);
        return library.math.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
};
this.curvePoint = new function(){
    this.linear = function(x=0.5, start=0, end=1){
        return x *(end-start)+start;
    };
    this.sin = function(x=0.5, start=0, end=1){
        return Math.sin(Math.PI/2*x) *(end-start)+start;
    };
    this.cos = function(x=0.5, start=0, end=1){
        return (1-Math.cos(Math.PI/2*x)) *(end-start)+start;
    };
    this.s = function(x=0.5, start=0, end=1, sharpness=8){
        var temp = library.math.normalizeStretchArray([
            1/( 1 + Math.exp(-sharpness*(0-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(x-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(1-0.5)) ),
        ]);
        return temp[1] *(end-start)+start;
    };
    this.exponential = function(x=0.5, start=0, end=1, sharpness=2){
        var temp = library.math.normalizeStretchArray([
            (Math.exp(sharpness*0)-1)/(Math.E-1),
            (Math.exp(sharpness*x)-1)/(Math.E-1),
            (Math.exp(sharpness*1)-1)/(Math.E-1),
        ]);
        return temp[1] *(end-start)+start;
    };
};
this.curveGenerator = new function(){
    this.linear = function(stepCount=2, start=0, end=1){
        stepCount = Math.abs(stepCount)-1; var outputArray = [0];
        for(var a = 1; a < stepCount; a++){ 
            outputArray.push(a/stepCount);
        }
        outputArray.push(1); 

        var mux = end-start;
        for(var a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;
    };
    this.sin = function(stepCount=2, start=0, end=1){
        stepCount = Math.abs(stepCount) -1;
        var outputArray = [0];
        for(var a = 1; a < stepCount; a++){ 
            outputArray.push(
                Math.sin( Math.PI/2*(a/stepCount) )
            );
        }
        outputArray.push(1); 

        var mux = end-start;
        for(var a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;		
    };
    this.cos = function(stepCount=2, start=0, end=1){
        stepCount = Math.abs(stepCount) -1;
        var outputArray = [0];
        for(var a = 1; a < stepCount; a++){ 
            outputArray.push(
                1 - Math.cos( Math.PI/2*(a/stepCount) )
            );
        }
        outputArray.push(1); 

        var mux = end-start;
        for(var a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;	
    };
    this.s = function(stepCount=2, start=0, end=1, sharpness=8){
        if(sharpness == 0){sharpness = 1/1000000;}

        var curve = [];
        for(var a = 0; a < stepCount; a++){
            curve.push(
                1/( 1 + Math.exp(-sharpness*((a/stepCount)-0.5)) )
            );
        }

        var outputArray = library.math.normalizeStretchArray(curve);

        var mux = end-start;
        for(var a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;
    };
    this.exponential = function(stepCount=2, start=0, end=1, sharpness=2){
        var stepCount = stepCount-1;
        var outputArray = [];
        
        for(var a = 0; a <= stepCount; a++){
            outputArray.push( (Math.exp(sharpness*(a/stepCount))-1)/(Math.E-1) ); // Math.E == Math.exp(1)
        }

        outputArray = system.utility.math.normalizeStretchArray(outputArray);

        var mux = end-start;
        for(var a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;
    };
};
this.normalizeStretchArray = function(array){
    //discover the largest number
        var biggestIndex = array.reduce( function(oldIndex, currentValue, index, array){ return currentValue > array[oldIndex] ? index : oldIndex; }, 0);

    //devide everything by this largest number, making everything a ratio of this value 
        var dux = Math.abs(array[biggestIndex]);
        array = array.map(x => x / dux);

    //stretch the other side of the array to meet 0 or 1
        if(array[0] == 0 && array[array.length-1] == 1){return array;}
        var pertinentValue = array[0] != 0 ? array[0] : array[array.length-1];
        array = array.map(x => (x-pertinentValue)/(1-pertinentValue) );

    return array;
};