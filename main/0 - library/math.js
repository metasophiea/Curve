this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
this.averagePoint = function(points){
    var sum = points.reduce((a,b) => {return {x:(a.x+b.x),y:(a.y+b.y)};} );
    return {x:sum.x/points.length,y:sum.y/points.length};
};
this.distanceBetweenTwoPoints = function(a, b){ return Math.pow(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2),0.5) };
this.seconds2time = function(seconds){
    var result = {h:0, m:0, s:0};
    
    result.h = Math.floor(seconds/3600);
    seconds = seconds - result.h*3600;

    result.m = Math.floor(seconds/60);
    seconds = seconds - result.m*60;

    result.s = seconds;

    return result;
};
this.largestValueFound = function(array){
    return array.reduce(function(max,current){
        return Math.abs(max) > Math.abs(current) ? max : current;
    });
};
this.smallestValueFound = function(array){
    return array.reduce(function(min,current){
        return Math.abs(min) < Math.abs(current) ? min : current;
    });
};
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
    if(angle == 0 || angle%Math.PI*2 == 0){ return {x:x,y:y}; }
    var polar = this.cartesian2polar( x, y );
    polar.ang += angle;
    return this.polar2cartesian( polar.ang, polar.dis );
};
this.applyOffsetToPoints = function(offset,points){
    return points.map(a => { return{x:a.x+offset.x,y:a.y+offset.y} } );
};
this.applyOffsetToPolygon = function(offset,poly){
    var newPolygon = { points: this.applyOffsetToPoints(offset,poly.points), boundingBox:{} };
    newPolygon.boundingBox = this.boundingBoxFromPoints(newPolygon.points);
    return newPolygon;
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
this.pointsOfCircle = function(x,y,r,pointCount=3){
    var output = [];
    for(var a = 0; a < pointCount; a++){
        output.push({
            x: x + r*Math.sin(2*Math.PI*(a/pointCount)),
            y: y + r*Math.cos(2*Math.PI*(a/pointCount)),
        });
    }
    return output;
};
this.pointsOfText = function(text, x, y, angle, size, font, alignment, baseline){
    //requires that the font size be in 'pt'

    //determine text width
        var width = 0;
        var cnv = document.createElement('canvas');
        var context = cnv.getContext('2d');

        context.font = font;
        context.textAlign = alignment;
        context.textBaseline = baseline;

        var d = context.measureText(text);
        width = d.width/size;

    //determine text height
        var height = -font.split('pt')[0].split(' ').pop();
        if(isNaN(height)){ height = -7.5; }
        height = height/size;

    //generate points
        var points = [{x:x, y:y}, {x:x+width, y:y}, {x:x+width, y:y-height}, {x:x, y:y-height}];

    //adjust for alignment and baseline
        var leftPush = { start:0, end:0, center:width/2, left:width, right:width };
        var downPush = { alphabetic:height, top:0, hanging:0, middle:height/2, ideographic:0, bottom:height };
        for(var a = 0; a < points.length; a++){
            points[a] = { x:points[a].x-leftPush[alignment], y:points[a].y+downPush[baseline] };
        }
    
    //adjust for angle
        for(var a = 0; a < points.length; a++){
            points[a] = this.cartesianAngleAdjust(points[a].x-x,points[a].y-y,angle);
            points[a].x += x;
            points[a].y += y;
        }

    return points;
};
this.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
    var mux = (d - start)/(end - start);
    if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
    return mux*realLength;
};
this.lineCorrecter = function(points, maxheight, maxwidth){
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
this.fitPolyIn = function(newPoly,existingPolys,dev=false){
    var offset = {x:0,y:0};
    var paths = [[],[],[]];

    //get the middle ("average") point of newPoly
        var middlePoint = workspace.library.math.averagePoint(newPoly.points);

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
                        if(dev){paths[0].push( {x:tmpOffset.x+middlePoint.x, y:tmpOffset.y+middlePoint.y} );}
                    
                    //if offsetting the shape in this way results in no collision; save this offset in 'sucessfulOffsets'
                        if(!this.detectOverlap.overlappingPolygonWithPolygons(this.applyOffsetToPolygon(tmpOffset,newPoly),existingPolys)){
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
                            if(dev){paths[1].push( {x:tmpOffset.x+middlePoint.x, y:tmpOffset.y+middlePoint.y} );}
                                    
                        //if offsetting the shape in this way results in no collision; save this offset in 'tmpSucessfulOffsets'
                            if(!this.detectOverlap.overlappingPolygonWithPolygons(this.applyOffsetToPolygon(tmpOffset,newPoly),existingPolys)){
                                tmpSucessfulOffsets.push( {ang:sucessfulOffsets[a].ang, dis:midRadius} );
                                provenFunctionalOffsets.push( {ang:sucessfulOffsets[a].ang, dis:midRadius} );
                            }
                    }

                //check if there's only one offset left
                    if( tmpSucessfulOffsets.length == 1 ){ sucessfulOffset = tmpSucessfulOffsets[0]; break; }

                //decide wherther to check further out or closer in
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

                //can you make a x movement? you can? then do it
                    if(dev){paths[2].push( {x:midpoint.x+middlePoint.x, y:max.y+middlePoint.y} );}
                    if(!this.detectOverlap.overlappingPolygonWithPolygons(this.applyOffsetToPolygon({x:midpoint.x, y:max.y},newPoly),existingPolys)){
                        max.x = midpoint.x; //too far
                    }else{ 
                        min.x = midpoint.x; //too close
                    }

                //can you make a y movement? you can? then do it
                    if(dev){paths[2].push( {x:max.x+middlePoint.x, y:midpoint.y+middlePoint.y} );}
                    if(!this.detectOverlap.overlappingPolygonWithPolygons(this.applyOffsetToPolygon({x:max.x, y:midpoint.y},newPoly),existingPolys)){
                        max.y = midpoint.y; //too far
                    }else{
                        min.y = midpoint.y; //too close
                    }
            }

        offset = {x:max.x, y:max.y};

    return dev ? {offset:offset,paths:paths} : offset;
};