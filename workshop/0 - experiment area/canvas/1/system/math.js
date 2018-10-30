Math.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
Math.largestValueFound = function(array){
    return array.reduce(function(max,current){
        return Math.abs(max) > Math.abs(current) ? max : current;
    });
};
Math.polar2cartesian = function(angle,distance){
    return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
};
Math.cartesian2polar = function(x,y){
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
Math.pointsOfRect = function(x,y,width,height,angle=0,anchor={x:0,y:0}){
    var corners = {};
    var offsetX = anchor.x*width;
    var offsetY = anchor.y*height;

    var polar = Math.cartesian2polar( offsetX, offsetY );
    var point = Math.polar2cartesian( polar.ang-angle, polar.dis );
    corners.tl = { x:(x - point.x), y:(y - point.y) };

    var polar = Math.cartesian2polar( offsetX-width, offsetY );
    var point = Math.polar2cartesian( polar.ang-angle, polar.dis );
    corners.tr = { x:(x - point.x), y:(y - point.y) };

    var polar = Math.cartesian2polar( offsetX-width, offsetY-height );
    var point = Math.polar2cartesian( polar.ang-angle, polar.dis );
    corners.br = { x:(x - point.x), y:(y - point.y) };

    var polar = Math.cartesian2polar( offsetX, offsetY-height );
    var point = Math.polar2cartesian( polar.ang-angle, polar.dis );
    corners.bl = { x:(x - point.x), y:(y - point.y) };

    return [
        corners.tl,
        corners.tr, 
        corners.br, 
        corners.bl, 
    ];
};
Math.boundingBoxFromPoints = function(points){
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
Math.intersectionOfTwoLineSegments = function(segment1, segment2){
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
Math.seconds2time = function(seconds){
    var result = {h:0, m:0, s:0};
    
    result.h = Math.floor(seconds/3600);
    seconds = seconds - result.h*3600;

    result.m = Math.floor(seconds/60);
    seconds = seconds - result.m*60;

    result.s = seconds;

    return result;
};
Math.detectOverlap = function(poly_a, poly_b, box_a, box_b){
    var debugMode = true;

    // Quick Judgement with bounding boxes
    // (when bounding boxes are provided)
    if(box_a && box_b){

        //sort boxes ("largest points" should be first)
            if(box_a[0].x < box_a[1].x){
                if(debugMode){console.log('bounding box a sorting required');}
                var temp = box_a[0];
                box_a[0] = box_a[1];
                box_a[1] = temp;
            }
            if(box_b[0].x < box_b[1].x){
                if(debugMode){console.log('bounding box b sorting required');}
                var temp = box_b[0];
                box_b[0] = box_b[1];
                box_b[1] = temp;
            }

        if(
            (box_a[0].y < box_b[1].y) || //a_0_y (a's highest point) is below b_1_y (b's lowest point)
            (box_a[1].y > box_b[0].y) || //a_1_y (a's lowest point) is above b_0_y (b's highest point)
            (box_a[0].x < box_b[1].x) || //a_0_x (a's leftest point) is right of b_1_x (b's rightest point)
            (box_a[1].x > box_b[0].x)    //a_1_x (a's rightest point) is left of b_0_x (b's leftest point)
        ){if(debugMode){console.log('clearly separate shapes');}return false;}
    }

    // Detailed Judgement
        function distToSegmentSquared(p, a, b){
            function distanceBetweenTwoPoints(a, b){ return Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) }

            var lineLength = distanceBetweenTwoPoints(a, b);               //get length of line segment
            if (lineLength == 0){return distanceBetweenTwoPoints(p, a);}   //if line segment length is zero, just return the distance between a line point and the point
            
            var t = ((p.x-a.x) * (b.x-a.x) + (p.y-a.y) * (b.y-a.y)) / lineLength;
            t = Math.max(0, Math.min(1, t));
            return distanceBetweenTwoPoints(p, { 'x': a.x + t*(b.x-a.x), 'y': a.y + t*(b.y-a.y) });
        }
        function sideOfLineSegment(p, a, b){
            //get side that the point is on ('true' is 'inside')
            return ((b.x-a.x)*(p.y-a.y) - (p.x-a.x)*(b.y-a.y))>0;
        }


        //a point from A is in B
        // run through each point of poly 'A' and each side of poly 'B'
        // for each point in A, find the closest side of B and determine what side that point is on
        // if any point of A is inside B, declare an overlap
        var poly_b_clone = Object.assign([], poly_b); //because of referencing 
        poly_b_clone.push(poly_b[0]);
        for(var b = 0; b < poly_a.length; b++){
            var tempSmallestDistance = {'dis':Number.MAX_SAFE_INTEGER,'side':false};
            for(var a = 0; a < poly_b_clone.length-1; a++){
                var linePoint_1 = {'x':poly_b_clone[a].x,'y':poly_b_clone[a].y};
                var linePoint_2 = {'x':poly_b_clone[a+1].x,'y':poly_b_clone[a+1].y};
                var point = {'x':poly_a[b].x,'y':poly_a[b].y};
                    //reformat data into line-segment points and the point of interest

                var dis = distToSegmentSquared(point,linePoint_1,linePoint_2);
                    if(dis==0){if(debugMode){console.log('oh hay, collision - AinB');}return true; }
                    //get distance from point to line segment
                    //if zero, it's a collision and we can end early

                if( tempSmallestDistance.dis > dis ){ 
                    //if this distance is the smallest found in this round, save the distance and side
                    tempSmallestDistance.dis = dis; 
                    tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                }
            }
            if( tempSmallestDistance.side ){if(debugMode){console.log('a point from A is in B');}return true;}
        }
        //a point from B is in A
        // same as above, but the other way around
        var poly_a_clone = Object.assign([], poly_a); //because of referencing 
        poly_a_clone.push(poly_a[0]);
        for(var b = 0; b < poly_b.length; b++){
            var tempSmallestDistance = {'dis':Number.MAX_SAFE_INTEGER,'side':false};
            for(var a = 0; a < poly_a_clone.length-1; a++){
                var linePoint_1 = {'x':poly_a_clone[a].x,'y':poly_a_clone[a].y};
                var linePoint_2 = {'x':poly_a_clone[a+1].x,'y':poly_a_clone[a+1].y};
                var point = {'x':poly_a[b].x,'y':poly_a[b].y};
                    //reformat data into line-segment points and the point of interest

                var dis = distToSegmentSquared(point,linePoint_1,linePoint_2);
                    if(dis==0){if(debugMode){console.log('oh hay, line collision - BinA');}return true; }
                    //get distance from point to line segment
                    //if zero, it's a collision and we can end early

                if( tempSmallestDistance.dis > dis ){ 
                    //if this distance is the smallest found in this round, save the distance and side
                    tempSmallestDistance.dis = dis; 
                    tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                    testTemp = point;
                    testTempA = linePoint_1;
                    testTempB = linePoint_2;
                }
            }
            if( tempSmallestDistance.side ){if(debugMode){console.log('a point from B is in A');}return true;}
        }

        //side intersection
        // compare each side of each poly to every other side, looking for lines that
        // cross each other. If a crossing is found at any point; return true
            for(var a = 0; a < poly_a_clone.length-1; a++){
                for(var b = 0; b < poly_b_clone.length-1; b++){
                    var data = this.intersectionOfTwoLineSegments(poly_a_clone, poly_b_clone);
                    if(!data){continue;}
                    if(data.inSeg1 && data.inSeg2){if(debugMode){console.log('point intersection at ' + data.x + ' ' + data.y);}return true;}
                }
            }

    return false;
};
Math.detectOverlap_boundingBoxOnly = function(a, b){
    return !(
        (a.bottomRight.y < b.topLeft.y) ||
        (a.topLeft.y > b.bottomRight.y) ||
        (a.bottomRight.x < b.topLeft.x) ||
        (a.topLeft.x > b.bottomRight.x)   
    );
};
Math.detectOverlap_pointWithinPoly = function(point,points){
    function distToSegmentSquared(p, a, b){
        function distanceBetweenTwoPoints(a, b){ return Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) }

        var lineLength = distanceBetweenTwoPoints(a, b);               //get length of line segment
        if(lineLength == 0){return distanceBetweenTwoPoints(p, a);}   //if line segment length is zero, just return the distance between a line point and the point
        
        var t = ((p.x-a.x) * (b.x-a.x) + (p.y-a.y) * (b.y-a.y)) / lineLength;
        t = Math.max(0, Math.min(1, t));
        return distanceBetweenTwoPoints(p, { 'x': a.x + t*(b.x-a.x), 'y': a.y + t*(b.y-a.y) });
    }
    function sideOfLineSegment(point, a, b){
        //get side that the point is on ('true' is 'inside')
        return ((b.x-a.x)*(point.y-a.y) - (point.x-a.x)*(b.y-a.y)) > 0;
    }




    //go through each side of the poly, to determine if the point is on the 'correct' side (ie. the inside)
    //(virtualIndex allows the first point to also be last, without any copying of data)
        var tempSmallestDistance = {'dis':Number.MAX_SAFE_INTEGER,'side':false};
        var virtualIndex = Array.apply(null, {length: points.length}).map(Number.call, Number).concat(0);
        for(var a = 0; a < virtualIndex.length-1; a++){
            //reformat data into line-segment points
                var v1 = virtualIndex[a];
                var v2 = virtualIndex[a+1];
                var linePoint_1 = {x:points[v1].x, y:points[v1].y};
                var linePoint_2 = {x:points[v2].x, y:points[v2].y};

            //get distance from point to line segment
            //if zero, it's a collision and we can end early
                var dis = distToSegmentSquared(point,linePoint_1,linePoint_2);
                if(dis==0){return true;}

            //if this distance is the smallest found in this round, save the distance and side
                if( tempSmallestDistance.dis > dis ){ 
                    tempSmallestDistance.dis = dis;
                    tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                }
        }
        if( tempSmallestDistance.side ){return true;}

    return false;
};
Math.normalizeStretchArray = function(array){
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
Math.curvePoint = new function(){
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
        var temp = system.utility.math.normalizeStretchArray([
            1/( 1 + Math.exp(-sharpness*(0-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(x-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(1-0.5)) ),
        ]);
        return temp[1] *(end-start)+start;
    };
    this.exponential = function(x=0.5, start=0, end=1, sharpness=2){
        var temp = system.utility.math.normalizeStretchArray([
            (Math.exp(sharpness*0)-1)/(Math.E-1),
            (Math.exp(sharpness*x)-1)/(Math.E-1),
            (Math.exp(sharpness*1)-1)/(Math.E-1),
        ]);
        return temp[1] *(end-start)+start;
    };
};
Math.curveGenerator = new function(){
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

        var outputArray = system.utility.math.normalizeStretchArray(curve);

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
Math.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
    var mux = (d - start)/(end - start);
    if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
    return mux*realLength;
};
Math.lineCorrecter = function(points, maxheight, maxwidth){
    //this function detects line points that would exceed the view area, then replaces them with clipped points
    //(only corrects points that exceed the y limits. Those that exceed the X limits are simply dropped)

    if( points.x1 < 0 || points.x2 < 0 ){ return; }
    if( points.x1 > maxwidth || points.x2 > maxwidth ){ return; }

    if( points.y1 < 0 && points.y2 < 0 ){ return; }
    if( points.y1 > maxheight && points.y2 > maxheight ){ return; }

    var slope = (points.y2 - points.y1)/(points.x2 - points.x1);

    if( points.y1 < 0 ){ points.x1 = (0 - points.y1 + slope*points.x1)/slope; points.y1 = 0; }
    else if( points.y2 < 0 ){ points.x2 = (0 - points.y2 + slope*points.x2)/slope; points.y2 = 0; }
    if( points.y1 > maxheight ){ points.x1 = (maxheight - points.y1 + slope*points.x1)/slope; points.y1 = maxheight; }
    else if( points.y2 > maxheight ){ points.x2 = (maxheight - points.y2 + slope*points.x2)/slope; points.y2 = maxheight; }

    return points;
};