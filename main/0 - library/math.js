this.averageArray = function(array){
    library._control.logflow.log('math.averageArray');
    // return array.reduce( ( p, c ) => p + c, 0 ) / array.length

    //this seems to be a little faster
    var sum = array[0];
    for(var a = 1; a < array.length; a++){ sum += array[a]; }
    return sum/array.length;
};

this.averagePoint = function(points){
    library._control.logflow.log('math.averagePoint');
    var sum = points.reduce((a,b) => {return {x:(a.x+b.x),y:(a.y+b.y)};} );
    return {x:sum.x/points.length,y:sum.y/points.length};
};
this.boundingBoxFromPoints = function(points){
    library._control.logflow.log('math.boundingBoxFromPoints');
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
    library._control.logflow.log('math.cartesianAngleAdjust');

    // //v1    
    //     if(angle == 0){ return {x:x,y:y}; }
    //     if(angle == Math.PI){ return {x:-x,y:-y}; }
    //     if(angle == Math.PI*0.5){ return {x:-y,y:x}; }
    //     if(angle == Math.PI*1.5){ return {x:y,y:-x}; }

    //     var polar = library.math.cartesian2polar( x, y );
    //     polar.ang += angle;
    //     return library.math.polar2cartesian( polar.ang, polar.dis );
    
    //v2    
        if(angle == 0){ return {x:x,y:y}; }
        return { x:x*Math.cos(angle) - y*Math.sin(angle), y:y*Math.cos(angle) + x*Math.sin(angle) };
};
this.convertColour = new function(){
    this.obj2rgba = function(obj){
        library._control.logflow.log('math.convertColour.obj2rgba');
        return 'rgba('+obj.r*255+','+obj.g*255+','+obj.b*255+','+obj.a+')';
    };
    this.rgba2obj = function(rgba){
        library._control.logflow.log('math.convertColour.rgba2obj');
        rgba = rgba.split(',');
        rgba[0] = rgba[0].replace('rgba(', '');
        rgba[3] = rgba[3].replace(')', '');
        rgba = rgba.map(function(a){return parseFloat(a);})
        return {r:rgba[0]/255,g:rgba[1]/255,b:rgba[2]/255,a:rgba[3]};
    };
};
this.curveGenerator = new function(){
    this.linear = function(stepCount=2, start=0, end=1){
        library._control.logflow.log('math.curveGenerator.linear');
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
        library._control.logflow.log('math.curveGenerator.sin');
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
        library._control.logflow.log('math.curveGenerator.cos');
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
        library._control.logflow.log('math.curveGenerator.s');
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
        library._control.logflow.log('math.curveGenerator.exponential');
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
        library._control.logflow.log('math.curvePoint.linear');
        return x *(end-start)+start;
    };
    this.sin = function(x=0.5, start=0, end=1){
        library._control.logflow.log('math.curvePoint.sin');
        return Math.sin(Math.PI/2*x) *(end-start)+start;
    };
    this.cos = function(x=0.5, start=0, end=1){
        return (1-Math.cos(Math.PI/2*x)) *(end-start)+start;
    };
    this.s = function(x=0.5, start=0, end=1, sharpness=8){
        library._control.logflow.log('math.curvePoint.s');
        var temp = library.math.normalizeStretchArray([
            1/( 1 + Math.exp(-sharpness*(0-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(x-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(1-0.5)) ),
        ]);
        return temp[1] *(end-start)+start;
    };
    this.exponential = function(x=0.5, start=0, end=1, sharpness=2){
        library._control.logflow.log('math.curvePoint.exponential');
        var temp = library.math.normalizeStretchArray([
            (Math.exp(sharpness*0)-1)/(Math.E-1),
            (Math.exp(sharpness*x)-1)/(Math.E-1),
            (Math.exp(sharpness*1)-1)/(Math.E-1),
        ]);
        return temp[1] *(end-start)+start;
    };
};
this.detectOverlap = new function(){
    var detectOverlap = this;

    this.boundingBoxes = function(a, b){
        library._control.logflow.log('math.detectOverlap.boundingBoxes');
        return a.bottomRight.y >= b.topLeft.y && 
            a.bottomRight.x >= b.topLeft.x && 
            a.topLeft.y <= b.bottomRight.y && 
            a.topLeft.x <= b.bottomRight.x;
    };
    this.pointWithinBoundingBox = function(point,box){
        library._control.logflow.log('math.detectOverlap.pointWithinBoundingBox');
        return !(
            point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
            point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
        );
    };
    this.pointWithinPoly = function(point,points){
        library._control.logflow.log('math.detectOverlap.pointWithinPoly');
        //Ray casting algorithm

        var inside = false;
        for(var a = 0, b = points.length - 1; a < points.length; b = a++){
            //if the point is on a point of the poly; bail and return true
            if( point.x == points[a].x && point.y == points[a].y ){ return true; }

            //point must be on the same level of the line
            if( (points[b].y >= point.y && points[a].y <= point.y) || (points[a].y >= point.y && points[b].y <= point.y) ){
                //discover if the point is on the far right of the line
                if( points[a].x < point.x && points[b].x < point.x ){
                    inside = !inside;
                }else{
                    //calculate what side of the line this point is
                        if( points[b].y > points[a].y && points[b].x > points[a].x ){
                            var areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) - (point.y-points[a].y)/(points[b].y-points[a].y) + 1;
                        }else if( points[b].y <= points[a].y && points[b].x <= points[a].x ){
                            var areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) - (point.y-points[b].y)/(points[a].y-points[b].y) + 1;
                        }else if( points[b].y > points[a].y && points[b].x < points[a].x ){
                            var areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) + (point.y-points[a].y)/(points[b].y-points[a].y);
                        }else if( points[b].y <= points[a].y && points[b].x >= points[a].x ){
                            var areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) + (point.y-points[b].y)/(points[a].y-points[b].y);
                        }

                    //if its on the line, return true immediatly, if it's just above 1 do a flip
                        if( areaLocation == 1 ){
                            return true;
                        }else if(areaLocation > 1){
                            inside = !inside;
                        }
                }
            }
        }
        return inside;
    };
    this.lineSegments = function(segment1, segment2){
        library._control.logflow.log('math.detectOverlap.lineSegments');
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
        library._control.logflow.log('math.detectOverlap.overlappingPolygons');
        //a point from A is in B
            for(var a = 0; a < points_a.length; a++){
                if(detectOverlap.pointWithinPoly(points_a[a],points_b)){ return true; }
            }

        //a point from B is in A
            for(var a = 0; a < points_b.length; a++){
                if(detectOverlap.pointWithinPoly(points_b[a],points_a)){ return true; }
            }

        //side intersection
            var a_indexing = Array.apply(null, {length: points_a.length}).map(Number.call, Number).concat([0]);
            var b_indexing = Array.apply(null, {length: points_b.length}).map(Number.call, Number).concat([0]);

            for(var a = 0; a < a_indexing.length-1; a++){
                for(var b = 0; b < b_indexing.length-1; b++){
                    var tmp = detectOverlap.lineSegments( 
                        [ points_a[a_indexing[a]], points_a[a_indexing[a+1]] ],
                        [ points_b[b_indexing[b]], points_b[b_indexing[b+1]] ]
                    );
                    if( tmp != null && tmp.inSeg1 && tmp.inSeg2 ){return true;}
                }
            }

        return false;
    };
    this.overlappingPolygonWithPolygons = function(poly,polys){ 
        library._control.logflow.log('math.detectOverlap.overlappingPolygonWithPolygons');
        for(var a = 0; a < polys.length; a++){
            if(detectOverlap.boundingBoxes(poly.boundingBox, polys[a].boundingBox)){
                if(detectOverlap.overlappingPolygons(poly.points, polys[a].points)){
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
        library._control.logflow.log('math.detectOverlap.overlappingLineWithPolygons');
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
    library._control.logflow.log('math.getAngleOfTwoPoints');
    if(point_1.x == point_2.x && point_1.y == point_2.y){return 0;}

    var xDelta = point_2.x - point_1.x;
    var yDelta = point_2.y - point_1.y;
    var angle = Math.atan( yDelta/xDelta );

    if(xDelta < 0){ angle = Math.PI + angle; }
    else if(yDelta < 0){ angle = Math.PI*2 + angle; }

    return angle;
};
this.getDifferenceOfArrays = function(array_a,array_b){
    library._control.logflow.log('math.getDifferenceOfArrays');
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
    library._control.logflow.log('math.getIndexOfSequence');
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
this.normalizeStretchArray = function(array){
    library._control.logflow.log('math.normalizeStretchArray');
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

this.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
    library._control.logflow.log('math.relativeDistance');
    var mux = (d - start)/(end - start);
    if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
    return mux*realLength;
};
this.removeTheseElementsFromThatArray = function(theseElements,thatArray){
    library._control.logflow.log('math.removeTheseElementsFromThatArray');
    theseElements.forEach(a => thatArray.splice(thatArray.indexOf(a), 1) );
    return thatArray;
};
this.seconds2time = function(seconds){
    library._control.logflow.log('math.seconds2time');
    var result = {h:0, m:0, s:0};
    
    result.h = Math.floor(seconds/3600);
    seconds = seconds - result.h*3600;

    result.m = Math.floor(seconds/60);
    seconds = seconds - result.m*60;

    result.s = seconds;

    return result;
};

this.cartesian2polar = function(x,y){
    library._control.logflow.log('math.cartesian2polar');
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
    library._control.logflow.log('math.polar2cartesian');
    return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
};

this.blendColours = function(rgba_1,rgba_2,ratio){
    library._control.logflow.log('math.blendColours');
    return {
        r: (1-ratio)*rgba_1.r + ratio*rgba_2.r,
        g: (1-ratio)*rgba_1.g + ratio*rgba_2.g,
        b: (1-ratio)*rgba_1.b + ratio*rgba_2.b,
        a: (1-ratio)*rgba_1.a + ratio*rgba_2.a,
    };           
};
this.multiBlendColours = function(rgbaList,ratio){//console.log(rgbaList,ratio);
    library._control.logflow.log('math.multiBlendColours');
    //special cases
        if(ratio == 0){return rgbaList[0];}
        if(ratio == 1){return rgbaList[rgbaList.length-1];}
    //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
        var p = ratio*(rgbaList.length-1);
        return library.math.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
};



this.polygonToSubTriangles = function(regions,inputFormat='XYArray'){
    library._control.logflow.log('math.polygonToSubTriangles');
    if(inputFormat == 'flatArray'){
        var tmp = [];
        for(var a = 0; a < regions.length; a+=2){ tmp.push( {x:regions[a+0], y:regions[a+1]} ); }
        regions = [tmp];
    }

    var holes = regions.reverse().map(region => region.length);
    holes.forEach((item,index) => { if(index > 0){ holes[index] = item + holes[index-1]; } });
    holes.pop();

    return _thirdparty.earcut(regions.flat().map(item => [item.x,item.y]).flat(),holes);
};
this.unionPolygons = function(polygon1,polygon2){
    library._control.logflow.log('math.unionPolygons');
    //martinez (not working)
    // for(var a = 0; a < polygon1.length; a++){
    //     polygon1[a].push( polygon1[a][0] );
    // }
    // for(var a = 0; a < polygon2.length; a++){
    //     polygon2[a].push( polygon2[a][0] );
    // }

    // var ans = _thirdparty.martinez.union(
    //     polygon1.map(region => region.map(item => [item.x,item.y])  ),
    //     polygon2.map(region => region.map(item => [item.x,item.y])  )
    // );
    // return ans.flat().map(region => region.map(item => ({x:item[0],y:item[1]})));

    //PolyBool
    return _thirdparty.PolyBool.union(
        {regions:polygon1.map(region => region.map(item => [item.x,item.y]))}, 
        {regions:polygon2.map(region => region.map(item => [item.x,item.y]))}
    ).regions.map(region => region.map(item => ({x:item[0],y:item[1]})));
}
this.pathExtrapolation = function(path,thickness=10,capType='none',joinType='none',loopPath=false,detail=5,sharpLimit=thickness*4){
    library._control.logflow.log('math.pathExtrapolation');
    function loopThisPath(path){
        var joinPoint = [ (path[0]+path[2])/2, (path[1]+path[3])/2 ];
        var loopingPath = [];
    
        loopingPath = loopingPath.concat(joinPoint);
        for(var a = 2; a < path.length; a+=2){
            loopingPath = loopingPath.concat( [path[a], path[a+1]] );
        }
        loopingPath = loopingPath.concat( [path[0], path[1]] );
        loopingPath = loopingPath.concat(joinPoint);

        return loopingPath;
    }
    function calculateJointData(path,thickness){
        var jointData = [];
        //parse path
            for(var a = 0; a < path.length/2; a++){
                jointData.push({ point:{ x:path[a*2], y:path[a*2 +1] } });
            }
        //calculation of joint data
            for(var a = 0; a < jointData.length; a++){
                //calculate segment angles    
                    if( a != jointData.length-1 ){
                        var tmp = _canvas_.library.math.getAngleOfTwoPoints( jointData[a].point, jointData[a+1].point );
                        if(jointData[a] != undefined){jointData[a].departAngle = tmp;}
                        if(jointData[a+1] != undefined){jointData[a+1].implementAngle = tmp;}
                    }
                //wing angle and width
                    if( jointData[a].departAngle != undefined && jointData[a].implementAngle != undefined ){
                        jointData[a].joiningAngle = jointData[a].departAngle - jointData[a].implementAngle + Math.PI;
                        while(jointData[a].joiningAngle < 0){jointData[a].joiningAngle += Math.PI*2;}
                        while(jointData[a].joiningAngle >= Math.PI*2){jointData[a].joiningAngle -= Math.PI*2;} 
                        jointData[a].wingAngle = jointData[a].implementAngle + jointData[a].joiningAngle/2 - Math.PI;
                        while(jointData[a].wingAngle < 0){jointData[a].wingAngle += Math.PI*2;}
                        while(jointData[a].wingAngle > Math.PI*2){jointData[a].wingAngle -= Math.PI*2;} 
                        jointData[a].wingWidth = thickness / Math.sin(jointData[a].joiningAngle/2);
                    }
            }

        return jointData;
    }
    function path_to_rectangleSeries(path,thickness){
        var outputPoints = [];
        for(var a = 1; a < path.length/2; a++){
            var angle = _canvas_.library.math.getAngleOfTwoPoints( {x:path[a*2-2], y:path[a*2 -1]}, {x:path[a*2], y:path[a*2 +1]});
            var left =  _canvas_.library.math.cartesianAngleAdjust(thickness, 0, Math.PI/2 + angle);
            var right = { x:-left.x, y:-left.y };
    
            outputPoints.push([
                {x:path[a*2-2]+left.x,  y:path[a*2-1]+left.y},
                {x:path[a*2-2]+right.x, y:path[a*2-1]+right.y},
                {x:path[a*2]+right.x,   y:path[a*2+1]+right.y},
                {x:path[a*2]+left.x,    y:path[a*2+1]+left.y},
            ]);
        }
    
        return outputPoints;
    }

    function flatJoints(jointData,thickness){
        var polygons = [];

        var perpenL = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle - Math.PI/2);
        var perpenR = {x:-perpenL.x, y:-perpenL.y};
        for(var a = 1; a < jointData.length-1; a++){
            var last_perpenL = perpenL;
            var last_perpenR = perpenR;
            var perpenL = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[a].departAngle - Math.PI/2);
            var perpenR = {x:-perpenL.x, y:-perpenL.y};

            if(jointData[a].joiningAngle == Math.PI){
                //do nothing
            }else if(jointData[a].joiningAngle < Math.PI){
                polygons.push([
                    {x:jointData[a].point.x, y:jointData[a].point.y},
                    {x:jointData[a].point.x + last_perpenR.x, y:jointData[a].point.y + last_perpenR.y},
                    {x:jointData[a].point.x + perpenR.x, y:jointData[a].point.y + perpenR.y},
                ]);
            }else if(jointData[a].joiningAngle > Math.PI){
                polygons.push([
                    {x:jointData[a].point.x, y:jointData[a].point.y},
                    {x:jointData[a].point.x + last_perpenL.x, y:jointData[a].point.y + last_perpenL.y},
                    {x:jointData[a].point.x + perpenL.x, y:jointData[a].point.y + perpenL.y},
                ]);
            }
        }

        return polygons;
    }
    function roundJoints(jointData,thickness,detail=5){
        var polygons = [];
        if(detail < 1){detail = 1;}

        var perpenL = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle - Math.PI/2);
        var perpenR = {x:-perpenL.x, y:-perpenL.y};
        for(var a = 1; a < jointData.length-1; a++){
            var newPolygon = [];
            var last_perpenL = perpenL;
            var last_perpenR = perpenR;
            var perpenL = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[a].departAngle - Math.PI/2);
            var perpenR = {x:-perpenL.x, y:-perpenL.y};

            if(jointData[a].joiningAngle == Math.PI){
                //do nothing
            }else if(jointData[a].joiningAngle < Math.PI){
                newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                newPolygon.push( {x:jointData[a].point.x + last_perpenR.x, y:jointData[a].point.y + last_perpenR.y} );

                var gapSize = Math.PI - jointData[a].joiningAngle;
                var partialDetail = Math.floor((2+detail)*(Math.abs(gapSize)/Math.PI));
                for(var b = 1; b < partialDetail; b++){
                    var angle = b*(gapSize/partialDetail);
                    var p = _canvas_.library.math.cartesianAngleAdjust(last_perpenR.x, last_perpenR.y, -angle);
                    newPolygon.push( {x:jointData[a].point.x + p.x, y:jointData[a].point.y + p.y} );
                }

                newPolygon.push( {x:jointData[a].point.x + perpenR.x, y:jointData[a].point.y + perpenR.y} );
            }else if(jointData[a].joiningAngle > Math.PI){
                newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                newPolygon.push( {x:jointData[a].point.x + last_perpenL.x, y:jointData[a].point.y + last_perpenL.y} );

                var gapSize = Math.PI - jointData[a].joiningAngle;
                var partialDetail = Math.floor((2+detail)*(Math.abs(gapSize)/Math.PI));
                for(var b = 1; b < partialDetail; b++){
                    var angle = b*(gapSize/partialDetail);
                    var p = _canvas_.library.math.cartesianAngleAdjust(last_perpenL.x, last_perpenL.y, -angle);
                    newPolygon.push( {x:jointData[a].point.x + p.x, y:jointData[a].point.y + p.y} );
                }

                newPolygon.push( {x:jointData[a].point.x + perpenL.x, y:jointData[a].point.y + perpenL.y} );
            }

            polygons.push(newPolygon);
        }

        return polygons;
    }
    function sharpJoints(jointData,thickness,sharpLimit=thickness*4){
        var polygons = [];

        var perpenL = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle - Math.PI/2);
        var perpenR = {x:-perpenL.x, y:-perpenL.y};
        for(var a = 1; a < jointData.length-1; a++){
            var newPolygon = [];
            var last_perpenL = perpenL;
            var last_perpenR = perpenR;
            var perpenL = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[a].departAngle - Math.PI/2);
            var perpenR = {x:-perpenL.x, y:-perpenL.y};

            if(jointData[a].joiningAngle == Math.PI){
                //do nothing
            }else if(jointData[a].joiningAngle < Math.PI){
                if( Math.abs(jointData[a].wingWidth) <= sharpLimit ){
                    var plus = _canvas_.library.math.cartesianAngleAdjust(0, jointData[a].wingWidth, Math.PI/2 + jointData[a].wingAngle);
                    newPolygon.push( {x:plus.x + jointData[a].point.x, y:plus.y + jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenR.x, y:jointData[a].point.y + last_perpenR.y} );
                    newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenR.x, y:jointData[a].point.y + perpenR.y} );
                }else{
                    var length = Math.cos(jointData[a].joiningAngle/2)*sharpLimit;
                    var partialWingA = _canvas_.library.math.cartesianAngleAdjust(0, -length, Math.PI/2 + jointData[a].implementAngle);
                    var partialWingB = _canvas_.library.math.cartesianAngleAdjust(0, length, Math.PI/2 + jointData[a].departAngle);

                    newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenR.x, y:jointData[a].point.y + last_perpenR.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenR.x + partialWingA.x, y:jointData[a].point.y + last_perpenR.y + partialWingA.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenR.x + partialWingB.x, y:jointData[a].point.y + perpenR.y + partialWingB.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenR.x, y:jointData[a].point.y + perpenR.y} );
                }
            }else if(jointData[a].joiningAngle > Math.PI){
                if( Math.abs(jointData[a].wingWidth) <= sharpLimit ){
                    var plus = _canvas_.library.math.cartesianAngleAdjust(0, -jointData[a].wingWidth, Math.PI/2 + jointData[a].wingAngle);
                    newPolygon.push( {x:plus.x + jointData[a].point.x, y:plus.y + jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenL.x, y:jointData[a].point.y + last_perpenL.y} );
                    newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenL.x, y:jointData[a].point.y + perpenL.y} );
                }else{
                    var length = Math.cos(jointData[a].joiningAngle/2)*sharpLimit;
                    var partialWingA = _canvas_.library.math.cartesianAngleAdjust(0, length, Math.PI/2 + jointData[a].implementAngle);
                    var partialWingB = _canvas_.library.math.cartesianAngleAdjust(0, -length, Math.PI/2 + jointData[a].departAngle);

                    newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenL.x, y:jointData[a].point.y + last_perpenL.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenL.x + partialWingA.x, y:jointData[a].point.y + last_perpenL.y + partialWingA.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenL.x + partialWingB.x, y:jointData[a].point.y + perpenL.y + partialWingB.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenL.x, y:jointData[a].point.y + perpenL.y} );
                }
            }

            polygons.push(newPolygon);
        }

        return polygons;
    }

    function roundCaps(jointData,thickness,detail=5){
        if(detail < 1){detail = 1;}

        var polygons = [];

        //top
            var newPolygon = [];
            newPolygon.push( { x:jointData[0].point.x, y:jointData[0].point.y } );
            for(var a = 0; a < detail+1; a++){
                var p = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle + Math.PI/2 + (a/(detail))*(Math.PI) );
                newPolygon.push( {x:jointData[0].point.x + p.x, y:jointData[0].point.y + p.y} );
            }
            polygons.push(newPolygon);
        //bottom
            var newPolygon = [];
            newPolygon.push( { x:jointData[jointData.length-1].point.x, y:jointData[jointData.length-1].point.y } );
            for(var a = 0; a < detail+1; a++){
                var p = _canvas_.library.math.cartesianAngleAdjust(thickness, 0, jointData[jointData.length-1].implementAngle - Math.PI/2 + (a/(detail))*(Math.PI) );
                newPolygon.push( {x:jointData[jointData.length-1].point.x + p.x, y:jointData[jointData.length-1].point.y + p.y} );
            }
            polygons.push(newPolygon);

        return polygons;
    }


    if(loopPath){path = loopThisPath(path);}
    var jointData = calculateJointData(path,thickness);
    if(jointData.length == 0){return [];}

    //generate polygons
        var polygons = path_to_rectangleSeries(path,thickness);
        //joints
        if(joinType == 'flat'){ polygons = polygons.concat(flatJoints(jointData,thickness)); }
        if(joinType == 'round'){ polygons = polygons.concat(roundJoints(jointData,thickness,detail)); }
        if(joinType == 'sharp'){ polygons = polygons.concat(sharpJoints(jointData,thickness,sharpLimit)); }
        //caps
        if(capType == 'round'){ polygons = polygons.concat(roundCaps(jointData,thickness,detail)); }

    //union all polygons, convert to triangles and return
        return library.math.polygonToSubTriangles( polygons.map(a=>[a]).reduce((conglomerate,polygon) => library.math.unionPolygons(conglomerate, polygon) ) );
};


this.fitPolyIn = function(freshPoly,environmentPolys,snapping={active:false,x:10,y:10,angle:Math.PI/8},dev=false){
    library._control.logflow.log('math.fitPolyIn');
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
        var maxIterationCount = 100;

        var successfulOffsets = [];
        for(stepCount = 1; stepCount < maxIterationCount+1; stepCount++){
            successfulOffsets = [];
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
                    
                    //if offsetting the shape in this way results in no collision; save this offset in 'successfulOffsets'
                        if(!library.math.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon(tmpOffset,freshPoly),environmentPolys)){
                            successfulOffsets.push( {ang:circularStepSizeInRad*a, dis:radius} );
                        }
                }

            //if on this circle we've found at least one possible location; break out of this section and move on to the next
                if( successfulOffsets.length != 0 ){break;}
        }


    //use midpointing from these points to find the single closest circular offset
        var maxIterationCount = 10;
        var successfulOffset;

        if(successfulOffsets.length == 1){
            successfulOffset = successfulOffsets[0];
        }else{
            //there was more than one possible offset for this radius, so we need to edge each of them closer
            //to the original point, to whittle them down to the one angle that can provide the smallest radius

            var maxRadius = Math.pow(stepCount,2);
            var minRadius = Math.pow(stepCount-1,2);

            var provenFunctionalOffsets = [];
            for(var i = 0; i < maxIterationCount; i++){
                var tmpsuccessfulOffsets = [];
                var midRadius = (maxRadius - minRadius)/2 + minRadius;

                //check this new midpoint radius with the successfulOffset values 
                    for(var a = 0; a < successfulOffsets.length; a++){
                        //calculate the current offset using the midpoint value
                            var tmpOffset = library.math.polar2cartesian( successfulOffsets[a].ang, midRadius );
                            tmpOffset.x = snapping.active ? Math.round(tmpOffset.x/snapping.x)*snapping.x : tmpOffset.x;
                            tmpOffset.y = snapping.active ? Math.round(tmpOffset.y/snapping.y)*snapping.y : tmpOffset.y;
                            if(dev){paths[1].push( {x:tmpOffset.x+middlePoint.x, y:tmpOffset.y+middlePoint.y} );}
                                    
                        //if offsetting the shape in this way results in no collision; save this offset in 'tmpsuccessfulOffsets'
                            if(!library.math.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon(tmpOffset,freshPoly),environmentPolys)){
                                tmpsuccessfulOffsets.push( {ang:successfulOffsets[a].ang, dis:midRadius} );
                                provenFunctionalOffsets.push( {ang:successfulOffsets[a].ang, dis:midRadius} );
                            }
                    }

                //check if there's only one offset left
                    if( tmpsuccessfulOffsets.length == 1 ){ successfulOffset = tmpsuccessfulOffsets[0]; break; }

                //decide whether to check further out or closer in
                    if( tmpsuccessfulOffsets.length == 0 ){
                        minRadius = midRadius; //somewhere further out
                    }else{
                        maxRadius = midRadius; //somewhere further in
                    }
            }

            //if everything goes wrong with the midpoint method; and we end up with no offsets, use whatever the last proven functional offset was
                if(successfulOffset == undefined){ successfulOffset = provenFunctionalOffsets.pop(); }
        }

    //adjust along x and y to find the closest offset
        var maxIterationCount = 10;

        var offset = library.math.polar2cartesian( successfulOffset.ang, successfulOffset.dis );
        if(dev){paths[2].push( {x:offset.x+middlePoint.x, y:offset.y+middlePoint.y} );}
        var max = {x:offset.x, y:offset.y};
        var min = {x:0, y:0};
        
        //use midpoint methods to edge the shape (over x and y) to as close as it can be to the original point
            for(var i = 0; i < maxIterationCount; i++){
                var midpoint = { x:(max.x-min.x)/2 + min.x, y:(max.y-min.y)/2 + min.y };
                midpoint.x = snapping.active ? Math.round(midpoint.x/snapping.x)*snapping.x : midpoint.x;
                midpoint.y = snapping.active ? Math.round(midpoint.y/snapping.y)*snapping.y : midpoint.y;

                //can you make a x movement? you can? then do it
                    if(dev){paths[2].push( {x:midpoint.x+middlePoint.x, y:max.y+middlePoint.y} );}
                    if(!library.math.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon({x:midpoint.x, y:max.y},freshPoly),environmentPolys)){
                        max.x = midpoint.x; //too far
                    }else{ 
                        min.x = midpoint.x; //too close
                    }

                //can you make a y movement? you can? then do it
                    if(dev){paths[2].push( {x:max.x+middlePoint.x, y:midpoint.y+middlePoint.y} );}
                    if(!library.math.detectOverlap.overlappingPolygonWithPolygons(applyOffsetToPolygon({x:max.x, y:midpoint.y},freshPoly),environmentPolys)){
                        max.y = midpoint.y; //too far
                    }else{
                        min.y = midpoint.y; //too close
                    }
            }

        offset = {x:max.x, y:max.y};

    return dev ? {offset:offset,paths:paths} : offset;
};