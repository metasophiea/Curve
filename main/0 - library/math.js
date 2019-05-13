this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
this.averagePoint = function(points){
    var sum = points.reduce((a,b) => {return {x:(a.x+b.x),y:(a.y+b.y)};} );
    return {x:sum.x/points.length,y:sum.y/points.length};
};
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
this.cartesianAngleAdjust = function(x,y,angle){
    if(angle == 0 || angle%(Math.PI*2) == 0){ return {x:x,y:y}; }
    var polar = library.math.cartesian2polar( x, y );
    polar.ang += angle;
    return library.math.polar2cartesian( polar.ang, polar.dis );
};
this.convertColour = new function(){
    this.obj2rgba = obj => 'rgba('+obj.r*255+','+obj.g*255+','+obj.b*255+','+obj.a+')';
    this.rgba2obj = function(rgba){
        rgba = rgba.split(',');
        rgba[0] = rgba[0].replace('rgba(', '');
        rgba[3] = rgba[3].replace(')', '');
        rgba = rgba.map(function(a){return parseFloat(a);})
        return {r:rgba[0]/255,g:rgba[1]/255,b:rgba[2]/255,a:rgba[3]};
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

        outputArray = library.math.normalizeStretchArray(outputArray);

        var mux = end-start;
        for(var a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;
    };
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
        //Ray casting algorithm

        var inside = false;
        for(var a = 0, b = points.length - 1; a < points.length; b = a++){
            //if the point is on a point of the poly; bail and return true
            if( point.x == points[a].x && point.y == points[a].y ){ return true; }

            //discover if point is on the same level (y) as the poly, if both these tests return the same result, it is not
            if( (points[a].y > point.y) != (points[b].y > point.y) ){
                //discover if the point is on the far right of the line
                if( points[a].x < point.x && points[b].x < point.x ){
                    inside = !inside;
                }else{
                    var X = points[a].x < points[b].x ? {big:points[a].x,little:points[b].x} : {big:points[b].x,little:points[a].x};
                    var Y = points[a].y < points[b].y ? {big:points[a].y,little:points[b].y} : {big:points[b].y,little:points[a].y};
                    var areaLocation = (point.x-X.big)/(X.little-X.big) + (point.y-Y.big)/(Y.little-Y.big);

                    //is this point on the line (if so, bail and return true)
                    //if it's in the right side area; do the flip
                    if( areaLocation == 1 ){
                        return true;
                    }else if(areaLocation > 1){
                        inside = !inside;
                    }
                }
            }

            //old method (kinda magic)
            // if(
            //     ((points[a].y > point.y) != (points[b].y > point.y)) && 
            //     (point.x < ((((points[b].x-points[a].x)*(point.y-points[a].y)) / (points[b].y-points[a].y)) + points[a].x))
            // ){inside = !inside;}
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

    function overlappingLineWithPolygon(line,poly){
        //go through every side of the poly, and if one of them collides with the line, return true
        for(var a = poly.points.length-1, b = 0; b < poly.points.length; a = b++){
            var tmp = library.math.detectOverlap.lineSegments(
                [
                    { x:line.x1, y:line.y1 },
                    { x:line.x2, y:line.y2 }
                ],
                [
                    { x:poly.points[a].x, y:poly.points[a].y },
                    { x:poly.points[b].x, y:poly.points[b].y }
                ],
            );
            if(tmp != null && tmp.inSeg1 && tmp.inSeg2){ return true; }
        }

        return false;
    };
    this.overlappingLineWithPolygons = function(line,polys){
        //generate a bounding box for the line
            var line_boundingBox = { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
            if(line.x1 > line.x2){
                line_boundingBox.topLeft.x = line.x2;
                line_boundingBox.bottomRight.x = line.x1;
            }else{
                line_boundingBox.topLeft.x = line.x1;
                line_boundingBox.bottomRight.x = line.x2;
            }
            if(line.y1 > line.y2){
                line_boundingBox.topLeft.y = line.y2;
                line_boundingBox.bottomRight.y = line.y1;
            }else{
                line_boundingBox.topLeft.y = line.y1;
                line_boundingBox.bottomRight.y = line.y2;
            }

        //gather the indexes of the polys that collide with this line
            var collidingPolyIndexes = [];
            polys.forEach((poly,index) => {
                if( !library.math.detectOverlap.boundingBoxes(line_boundingBox,poly.boundingBox) ){return;}
                if( overlappingLineWithPolygon(line,poly) ){ collidingPolyIndexes.push(index); }
            });

        return collidingPolyIndexes;
    };
};
this.getAngleOfTwoPoints = function(point_1,point_2){
    if(point_1.x == point_2.x && point_1.y == point_2.y){return 0;}

    var xDelta = point_2.x - point_1.x;
    var yDelta = point_2.y - point_1.y;
    var angle = Math.atan( yDelta/xDelta );

    if(xDelta < 0){ angle = Math.PI + angle; }
    else if(yDelta < 0){ angle = Math.PI*2 + angle; }

    return angle;
};
this.getDifferenceOfArrays = function(array_a,array_b){
    function arrayRemovals(a,b){
        a.forEach(item => {
            var i = b.indexOf(item);
            if(i != -1){ b.splice(i,1); }
        });
        return b;
    }

    return {
        a:arrayRemovals(array_b,array_a.slice()),
        b:arrayRemovals(array_a,array_b.slice())
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

    if(array.length == 0 || sequence.length == 0){return undefined;}

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
this.largestValueFound = function(array){
    if(array.length == 0){return undefined;}
    return array.reduce(function(max,current){
        return Math.abs(max) > Math.abs(current) ? max : current;
    });
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
this.normalizeStretchArray = function(array){
    //discover the largest number
        var biggestIndex = array.reduce( function(oldIndex, currentValue, index, array){ return currentValue > array[oldIndex] ? index : oldIndex; }, 0);

    //divide everything by this largest number, making everything a ratio of this value 
        var dux = Math.abs(array[biggestIndex]);
        array = array.map(x => x / dux);

    //stretch the other side of the array to meet 0 or 1
        if(array[0] == 0 && array[array.length-1] == 1){return array;}
        var pertinentValue = array[0] != 0 ? array[0] : array[array.length-1];
        array = array.map(x => (x-pertinentValue)/(1-pertinentValue) );

    return array;
};
this.pathToPolygonGenerator = function(path,thickness,returnedPointsFormat='TRIANGLE_STRIP'){
    var jointData = [];
    var joinMuxLimit = 5;

    //parse path
        for(var a = 0; a < path.length/2; a++){
            jointData.push({ point:{ x:path[a*2], y:path[a*2 +1] } });
        }
    //calculate segment angles, joining angles, wing angles and wing widths; then generate wing points
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
                if( Math.abs(joiningAngle) == Math.PI*2 ){ joiningAngle = Math.PI; }

            //angle
                var segmentAngle = item.implimentAngle != undefined ? item.implimentAngle : item.departAngle;
                var wingAngle = segmentAngle + joiningAngle/2;

            //width
                var div = a == 0 || a == jointData.length-1 ? 1 : Math.sin(joiningAngle/2);
                var wingWidth = thickness / div; 
                if(Math.abs(wingWidth) > thickness*joinMuxLimit){ wingWidth = Math.sign(wingWidth)*thickness*joinMuxLimit; }

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
this.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
    var mux = (d - start)/(end - start);
    if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
    return mux*realLength;
};
this.removeTheseElementsFromThatArray = function(theseElements,thatArray){
    theseElements.forEach(a => thatArray.splice(thatArray.indexOf(a), 1) );
    return thatArray;
};
this.seconds2time = function(seconds){
    var result = {h:0, m:0, s:0};
    
    result.h = Math.floor(seconds/3600);
    seconds = seconds - result.h*3600;

    result.m = Math.floor(seconds/60);
    seconds = seconds - result.m*60;

    result.s = seconds;

    return result;
};

this.cartesian2polar = function(x,y){
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
this.polar2cartesian = function(angle,distance){
    return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
};

this.blendColours = function(rgba_1,rgba_2,ratio){
    return {
        r: (1-ratio)*rgba_1.r + ratio*rgba_2.r,
        g: (1-ratio)*rgba_1.g + ratio*rgba_2.g,
        b: (1-ratio)*rgba_1.b + ratio*rgba_2.b,
        a: (1-ratio)*rgba_1.a + ratio*rgba_2.a,
    };           
};
this.multiBlendColours = function(rgbaList,ratio){//console.log(rgbaList,ratio);
    //special cases
        if(ratio == 0){return rgbaList[0];}
        if(ratio == 1){return rgbaList[rgbaList.length-1];}
    //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
        var p = ratio*(rgbaList.length-1);
        return library.math.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
};












this.fitPolyIn = function(freshPoly,environmentPolys,snapping={active:false,x:10,y:10,angle:Math.PI/8},dev=false){
    function applyOffsetToPoints(offset,points){
        return points.map(a => { return{x:a.x+offset.x,y:a.y+offset.y} } );
    };
    function applyOffsetToPolygon(offset,poly){
        var newPolygon = { points: applyOffsetToPoints(offset,poly.points), boundingBox:{} };
        newPolygon.boundingBox = library.math.boundingBoxFromPoints(newPolygon.points);
        return newPolygon;
    };

    

    var offset = {x:0,y:0};
    var paths = [[],[],[]];

    //get the middle ("average") point of freshPoly
        var middlePoint = library.math.averagePoint(freshPoly.points);

    //circle out to find initial offsets
        var stepCount = 1;
        var maxItrationCount = 100;

        var sucessfulOffsets = [];
        for(stepCount = 1; stepCount < maxItrationCount+1; stepCount++){
            sucessfulOffsets = [];
            var stepsInThisCircle = 2*stepCount + 1;
            var circularStepSizeInRad = (2*Math.PI) / stepsInThisCircle;
            var radius = Math.pow(stepCount,2);
            
            //head round the circle, testing each point as an offset
                for(var a = 0; a < stepsInThisCircle; a++){
                    //calculate the current offset
                        var tmpOffset = library.math.polar2cartesian( circularStepSizeInRad*a, radius );
                        tmpOffset.x = snapping.active ? Math.round(tmpOffset.x/snapping.x)*snapping.x : tmpOffset.x;
                        tmpOffset.y = snapping.active ? Math.round(tmpOffset.y/snapping.y)*snapping.y : tmpOffset.y;

                        if(dev){paths[0].push( {x:tmpOffset.x+middlePoint.x, y:tmpOffset.y+middlePoint.y} );}
                    
                    //if offsetting the shape in this way results in no collision; save this offset in 'sucessfulOffsets'
                        if(!this.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon(tmpOffset,freshPoly),environmentPolys)){
                            sucessfulOffsets.push( {ang:circularStepSizeInRad*a, dis:radius} );
                        }
                }

            //if on this circle we've found at least one possible location; break out of this section and move on to the next
                if( sucessfulOffsets.length != 0 ){break;}
        }


    //use midpointing from these points to find the single closest circular offset
        var maxItrationCount = 10;
        var sucessfulOffset;

        if(sucessfulOffsets.length == 1){
            sucessfulOffset = sucessfulOffsets[0];
        }else{
            //there was more than one possible offset for this radius, so we need to edge each of them closer
            //to the original point, to whittle them down to the one angle that can provide the smallest radius

            var maxRadius = Math.pow(stepCount,2);
            var minRadius = Math.pow(stepCount-1,2);

            var provenFunctionalOffsets = [];
            for(var i = 0; i < maxItrationCount; i++){
                var tmpSucessfulOffsets = [];
                var midRadius = (maxRadius - minRadius)/2 + minRadius;

                //check this new midpoint radius with the sucessfulOffset values 
                    for(var a = 0; a < sucessfulOffsets.length; a++){
                        //calculate the current offset using the midpoint value
                            var tmpOffset = library.math.polar2cartesian( sucessfulOffsets[a].ang, midRadius );
                            tmpOffset.x = snapping.active ? Math.round(tmpOffset.x/snapping.x)*snapping.x : tmpOffset.x;
                            tmpOffset.y = snapping.active ? Math.round(tmpOffset.y/snapping.y)*snapping.y : tmpOffset.y;
                            if(dev){paths[1].push( {x:tmpOffset.x+middlePoint.x, y:tmpOffset.y+middlePoint.y} );}
                                    
                        //if offsetting the shape in this way results in no collision; save this offset in 'tmpSucessfulOffsets'
                            if(!this.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon(tmpOffset,freshPoly),environmentPolys)){
                                tmpSucessfulOffsets.push( {ang:sucessfulOffsets[a].ang, dis:midRadius} );
                                provenFunctionalOffsets.push( {ang:sucessfulOffsets[a].ang, dis:midRadius} );
                            }
                    }

                //check if there's only one offset left
                    if( tmpSucessfulOffsets.length == 1 ){ sucessfulOffset = tmpSucessfulOffsets[0]; break; }

                //decide whether to check further out or closer in
                    if( tmpSucessfulOffsets.length == 0 ){
                        minRadius = midRadius; //somewhere further out
                    }else{
                        maxRadius = midRadius; //somewhere further in
                    }
            }

            //if everything goes wrong with the midpoint method; and we end up with no offsets, use whatever the last proven functional offset was
                if(sucessfulOffset == undefined){ sucessfulOffset = provenFunctionalOffsets.pop(); }
        }

    //adjust along x and y to find the closest offset
        var maxItrationCount = 10;

        var offset = library.math.polar2cartesian( sucessfulOffset.ang, sucessfulOffset.dis );
        if(dev){paths[2].push( {x:offset.x+middlePoint.x, y:offset.y+middlePoint.y} );}
        var max = {x:offset.x, y:offset.y};
        var min = {x:0, y:0};
        
        //use midpoint methods to edge the shape (over x and y) to as close as it can be to the original point
            for(var i = 0; i < maxItrationCount; i++){
                var midpoint = { x:(max.x-min.x)/2 + min.x, y:(max.y-min.y)/2 + min.y };
                midpoint.x = snapping.active ? Math.round(midpoint.x/snapping.x)*snapping.x : midpoint.x;
                midpoint.y = snapping.active ? Math.round(midpoint.y/snapping.y)*snapping.y : midpoint.y;

                //can you make a x movement? you can? then do it
                    if(dev){paths[2].push( {x:midpoint.x+middlePoint.x, y:max.y+middlePoint.y} );}
                    if(!this.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon({x:midpoint.x, y:max.y},freshPoly),environmentPolys)){
                        max.x = midpoint.x; //too far
                    }else{ 
                        min.x = midpoint.x; //too close
                    }

                //can you make a y movement? you can? then do it
                    if(dev){paths[2].push( {x:max.x+middlePoint.x, y:midpoint.y+middlePoint.y} );}
                    if(!this.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon({x:max.x, y:midpoint.y},freshPoly),environmentPolys)){
                        max.y = midpoint.y; //too far
                    }else{
                        min.y = midpoint.y; //too close
                    }
            }

        offset = {x:max.x, y:max.y};

    return dev ? {offset:offset,paths:paths} : offset;
};