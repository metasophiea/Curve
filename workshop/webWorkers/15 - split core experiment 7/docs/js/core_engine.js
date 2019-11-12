const library = new function(){
    this._control = new function(){
        this.logflow = new function(){
            var logflowActive = false;
            var logflow = {};
            this.active = function(value){ if(value==undefined){return logflowActive;} logflowActive = value; };
            this.printResults = function(){ return logflow; };
            this.log = function(flowName){
                if(!logflowActive){return;}
                if(flowName in logflow){ logflow[flowName]++; }
                else{ logflow[flowName] = 1; }
            };
        };
    };
    
    this.math = new function(){
        this.averageArray = function(array){
            // return array.reduce( ( p, c ) => p + c, 0 ) / array.length
        
            //this seems to be a little faster
            var sum = array[0];
            for(var a = 1; a < array.length; a++){ sum += array[a]; }
            return sum/array.length;
        };
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
                return 'rgba('+obj.r*255+','+obj.g*255+','+obj.b*255+','+obj.a+')';
            };
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
            var detectOverlap = this;
        
            this.boundingBoxes = function(a, b){
                return a.bottomRight.y >= b.topLeft.y && 
                    a.bottomRight.x >= b.topLeft.x && 
                    a.topLeft.y <= b.bottomRight.y && 
                    a.topLeft.x <= b.bottomRight.x;
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
        
        
        
        this.polygonToSubTriangles = function(regions,inputFormat='XYArray'){
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
    };
};

const communicationModuleMaker = function(communicationObject,callerName){
    const self = this;
    const devMode = false;
    this.log = function(){
        if(!devMode){return;}
        let prefix = 'communicationModule['+callerName+']';
        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
    };
    this.function = {};
    this.delayedFunction = {};

    let messageId = 0;
    const messagingCallbacks = {};

    function generateMessageID(){
        return messageId++;
    }

    communicationObject.onmessage = function(encodedPacket){
        let message = encodedPacket.data;

        if(message.outgoing){
            if(message.cargo.function in self.function){
                if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                if(message.id == null){
                    self.function[message.cargo.function](...message.cargo.arguments);
                }else{
                    communicationObject.postMessage({
                        id:message.id,
                        outgoing:false,
                        cargo:self.function[message.cargo.function](...message.cargo.arguments),
                    });
                }
            }else if(message.cargo.function in self.delayedFunction){
                if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                if(message.id == null){
                    self.delayedFunction[message.cargo.function](...message.cargo.arguments);
                }else{
                    cargo:self.delayedFunction[message.cargo.function](...[function(returnedData){
                        communicationObject.postMessage({ id:message.id, outgoing:false, cargo:returnedData });
                    }].concat(message.cargo.arguments));
                }
            }else{
            }
        }else{
            messagingCallbacks[message.id](message.cargo);
            delete messagingCallbacks[message.id];
        }
    };
    this.run = function(functionName,argumentList=[],callback,transferables){
        let id = null;
        if(callback != undefined){
            id = generateMessageID();
            messagingCallbacks[id] = callback;
        }
        communicationObject.postMessage({ id:id, outgoing:true, cargo:{function:functionName,arguments:argumentList} },transferables);
    };
};
const communicationModule = new communicationModuleMaker(this,'core_engine');

const dev = {
    prefix:'core_engine',

    // library:{active:!true,fontStyle:'color:rgb(87, 161, 80); font-style:italic;'},
    element:{active:false,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    elementLibrary:{active:false,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
    arrangement:{active:false,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    render:{active:false,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    viewport:{active:false,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    stats:{active:false,fontStyle:'color:rgb(87, 80, 161); font-style:italic;'},
    callback:{active:false,fontStyle:'color:rgb(122, 163, 82); font-style:italic;'},
    interface:{active:false,fontStyle:'color:rgb(77, 171, 169); font-style:italic;'},

    log:{
        // library:function(subSection,data){
        //     if(!dev.library.active){return;}
        //     console.log('%c'+dev.prefix+'.library.'+subSection+(new Array(...arguments).slice(1).join(' ')), dev.library.fontStyle );
        // },
        element:function(data){
            if(!dev.element.active){return;}
            console.log('%c'+dev.prefix+'e.element'+(new Array(...arguments).join(' ')), dev.element.fontStyle );
        },
        elementLibrary:function(elementType,address,data){
            if(!dev.elementLibrary.active){return;}
            console.log('%c'+dev.prefix+'.elementLibrary.'+elementType+'['+address+']'+(new Array(...arguments).slice(2).join(' ')), dev.elementLibrary.fontStyle );
        },
        arrangement:function(data){
            if(!dev.arrangement.active){return;}
            console.log('%c'+dev.prefix+'.arrangement'+(new Array(...arguments).join(' ')), dev.arrangement.fontStyle );
        },
        render:function(data){
            if(!dev.render.active){return;}
            console.log('%c'+dev.prefix+'.render'+(new Array(...arguments).join(' ')), dev.render.fontStyle );
        },
        viewport:function(data){
            if(!dev.viewport.active){return;}
            console.log('%c'+dev.prefix+'e.viewport'+(new Array(...arguments).join(' ')), dev.viewport.fontStyle );
        },
        stats:function(data){
            if(!dev.stats.active){return;}
            console.log('%c'+dev.prefix+'.stats'+(new Array(...arguments).join(' ')), dev.stats.fontStyle );
        },
        callback:function(data){
            if(!dev.callback.active){return;}
            console.log('%c'+dev.prefix+'.callback'+(new Array(...arguments).join(' ')), dev.callback.fontStyle );
        },
        interface:function(data){
            if(!dev.interface.active){return;}
            console.log('%c'+dev.prefix+'.interface'+(new Array(...arguments).join(' ')), dev.interface.fontStyle );
        },
    },
};
const report = {
    info:function(){ console.log(...['core_engine.report.info:'].concat(...new Array(...arguments))); },
    warning:function(){ console.warn(...['core_engine.report.warning:'].concat(...new Array(...arguments))); },
    error:function(){ console.error(...['core_engine.report.error:'].concat(...new Array(...arguments))); },
};

const element = new function(){
    //element library
        const elementLibrary = new function(){
            this.rectangle = function(name,_id){
                const self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'rectangle'; 
                        this.getType = function(){return type;}
                        const id = _id; 
                        this.getId = function(){return id;}
            
                    //simple attributes
                        this.name = name;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        let ignored = false;
                        this.ignored = function(a){
                            if(a==undefined){return ignored;}     
                            ignored = a;
                            computeExtremities();
                        };
                        let colour = {r:1,g:0,b:0,a:1};
                        this.colour = function(a){
                            if(a==undefined){return colour;}     
                            colour = a;
                            computeExtremities();
                        };
                    
                    //attributes pertinent to extremity calculation
                        let x = 0;
                        let y = 0; 
                        let angle = 0;
                        let anchor = {x:0,y:0};
                        let width = 10;
                        let height = 10;
                        let scale = 1;
                        let static = false;
                        this.x = function(a){ 
                            if(a==undefined){return x;}     
                            x = a;     
                            computeExtremities();
                        };
                        this.y = function(a){ 
                            if(a==undefined){return y;}     
                            y = a;
                            computeExtremities();
                        };
                        this.angle = function(a){ 
                            if(a==undefined){return angle;} 
                            angle = a;
                            computeExtremities();
                        };
                        this.anchor = function(a){
                            if(a==undefined){return anchor;} 
                            anchor = a; 
                            computeExtremities();
                        };
                        this.width = function(a){
                            if(a==undefined){return width;}  
                            width = a;  
                            computeExtremities();
                        };
                        this.height = function(a){
                            if(a==undefined){return height;} 
                            height = a; 
                            computeExtremities();
                        };
                        this.scale = function(a){ 
                            if(a==undefined){return scale;} 
                            scale = a;
                            computeExtremities();
                        };
                        this.static = function(a){
                            if(a==undefined){return static;}  
                            static = a;  
                            computeExtremities();
                        };
                        this.unifiedAttribute = function(attributes){
                            if(attributes==undefined){ return {x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, ignored:ignored, colour:colour, static:static}; } 
            
                            if('ignored' in attributes){ 
                                ignored = attributes.ignored;
                            }
                            if('colour' in attributes){
                                colour = attributes.colour;
                            }
            
                            if('x' in attributes){ 
                                x = attributes.x;
                            }
                            if('y' in attributes){ 
                                y = attributes.y;
                            }
                            if('angle' in attributes){ 
                                angle = attributes.angle;
                            }
                            if('anchor' in attributes){
                                anchor = attributes.anchor;
                            }
                            if('width' in attributes){
                                width = attributes.width;
                            }
                            if('height' in attributes){
                                height = attributes.height;
                            }
                            if('scale' in attributes){ 
                                scale = attributes.scale;
                            }
                            if('static' in attributes){ 
                                scale = attributes.static;
                            }
            
                            computeExtremities();
                        };
            
                //addressing
                    this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };
            
                //webGL rendering functions
                    let points = [
                        0,0,
                        1,0,
                        1,1,
                        0,1,
                    ];
                    let vertexShaderSource = `#version 300 es
                        //constants
                            in vec2 point;
            
                        //variables
                            struct location{
                                vec2 xy;
                                float scale;
                                float angle;
                            };
                            uniform location adjust;
            
                            uniform vec2 resolution;
                            uniform vec2 dimensions;
                            uniform vec2 anchor;
            
                        void main(){
                            //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                                vec2 P = dimensions * adjust.scale * (point - anchor);
                                P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;
            
                            //convert from unit space to clipspace
                                gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                        }
                    `;
                    let fragmentShaderSource = `#version 300 es
                        precision mediump float;
                        out vec4 outputColor;
                        uniform vec4 colour;
                                                                                    
                        void main(){
                            outputColor = colour;
                        }
                    `;
                    let point = { buffer:undefined, attributeLocation:undefined };
                    let uniformLocations;
                    function updateGLAttributes(context,adjust){
            
                        //buffers
                            //points
                                if(point.buffer == undefined){
                                    point.attributeLocation = context.getAttribLocation(program, "point");
                                    point.buffer = context.createBuffer();
                                    context.enableVertexAttribArray(point.attributeLocation);
                                    context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                    context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                }else{
                                    context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                    context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                }
                        
                        //uniforms
                            if( uniformLocations == undefined ){
                                uniformLocations = {
                                    "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                    "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                    "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                    "resolution": context.getUniformLocation(program, "resolution"),
                                    "dimensions": context.getUniformLocation(program, "dimensions"),
                                    "anchor": context.getUniformLocation(program, "anchor"),
                                    "colour": context.getUniformLocation(program, "colour"),
                                };
                            }
            
                            context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                            context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                            context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                            context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                            context.uniform2f(uniformLocations["dimensions"], width, height);
                            context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                            context.uniform4f(uniformLocations["colour"], colour.r, colour.g, colour.b, colour.a);
                    }
                    let program;
                    function activateGLRender(context,adjust){
                        if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                    }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        
                        //get offset from parent, if one isn't provided
                            if(offset == undefined){ offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        //calculate adjusted offset based on the offset
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            let adjusted = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: -(offset.angle + angle),
                            };
                        //calculate points based on the adjusted offset
                            self.extremities.points = [];
                            for(let a = 0; a < points.length; a+=2){
                                let P = {
                                    x: adjusted.scale * width * (points[a] - anchor.x), 
                                    y: adjusted.scale * height * (points[a+1] - anchor.y), 
                                };
            
                                self.extremities.points.push({ 
                                    x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                                    y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                                });
                            }
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                    
                        //if told to do so, inform parent (if there is one) that extremities have changed
                            if(informParent){ if(self.parent){self.parent.updateExtremities();} }
                    }
                    this.computeExtremities = computeExtremities;
            
                //lead render
                    function drawDotFrame(){
                        //draw shape extremity points
                            self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
                        //draw bounding box top left and bottom right points
                            render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                            render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                        //combine offset with shape's position, angle and scale to produce adjust value for render
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            let adjust = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: -(offset.angle + angle),
                            };
            
                        //activate shape render code
                            activateGLRender(context,adjust);
            
                        //if requested; draw dot frame
                            if(self.dotFrame){drawDotFrame();}
                    };
            
                //info dump
                    this._dump = function(){
                        report.info(self.getAddress(),'._dump()');
                        report.info(self.getAddress(),'._dump -> id: '+id);
                        report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
                        report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
                        report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
                        report.info(self.getAddress(),'._dump -> ignored: '+ignored);
                        report.info(self.getAddress(),'._dump -> colour: '+JSON.stringify(colour));
                        report.info(self.getAddress(),'._dump -> x: '+x);
                        report.info(self.getAddress(),'._dump -> y: '+y);
                        report.info(self.getAddress(),'._dump -> angle: '+angle);
                        report.info(self.getAddress(),'._dump -> anchor: '+JSON.stringify(anchor));
                        report.info(self.getAddress(),'._dump -> width: '+width);
                        report.info(self.getAddress(),'._dump -> height: '+height);
                        report.info(self.getAddress(),'._dump -> scale: '+scale);
                        report.info(self.getAddress(),'._dump -> static: '+static);
                    };
                
                //interface
                    this.interface = new function(){
                        this.ignored = self.ignored;
                        this.colour = self.colour;
                        this.x = self.x;
                        this.y = self.y;
                        this.angle = self.angle;
                        this.angle = self.angle;
                        this.anchor = self.anchor;
                        this.width = self.width;
                        this.scale = self.scale;
                        this.static = self.static;
                        this.unifiedAttribute = self.unifiedAttribute;
            
                        this.getAddress = self.getAddress;
            
                        this._dump = self._dump;
                    };
            };
            this.group = function(name,_id){
                const self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'group'; 
                        this.getType = function(){return type;}
                        const id = _id; 
                        this.getId = function(){return id;}
            
                    //simple attributes
                        this.name = name;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        let ignored = false;
                        this.ignored = function(a){
                            if(a==undefined){return ignored;}     
                            ignored = a;
                            computeExtremities();
                        };
                    
                    //attributes pertinent to extremity calculation
                        let x = 0;     
                        let y = 0;     
                        let angle = 0; 
                        let scale = 1; 
                        let heedCamera = false;
                        let static = false;
                        this.x = function(a){ 
                            if(a==undefined){return x;}     
                            x = a;     
                            computeExtremities();
                        };
                        this.y = function(a){ 
                            if(a==undefined){return y;}     
                            y = a;
                            computeExtremities();
                        };
                        this.angle = function(a){ 
                            if(a==undefined){return angle;} 
                            angle = a;
                            computeExtremities();
                        };
                        this.scale = function(a){ 
                            if(a==undefined){return scale;} 
                            scale = a;
                            computeExtremities();
                        };
                        this.heedCamera = function(a){
                            if(a==undefined){return heedCamera;}     
                            heedCamera = a;
                            computeExtremities();
                        };
                        this.static = function(a){
                            if(a==undefined){return static;}  
                            static = a;  
                            computeExtremities();
                        };
                        this.unifiedAttribute = function(attributes){
                            if(attributes==undefined){ return {x:x, y:y, angle:angle, scale:scale, ignored:ignored, heedCamera:heedCamera, static:static}; } 
            
                            if('ignored' in attributes){ 
                                ignored = attributes.ignored;
                            }
            
                            if('x' in attributes){ 
                                x = attributes.x;
                            }
                            if('y' in attributes){ 
                                y = attributes.y;
                            }
                            if('angle' in attributes){ 
                                angle = attributes.angle;
                            }
                            if('scale' in attributes){ 
                                scale = attributes.scale;
                            }
                            if('heedCamera' in attributes){ 
                                scale = attributes.heedCamera;
                            }
                            if('static' in attributes){ 
                                scale = attributes.static;
                            }
            
                            computeExtremities();
                        };
            
                //addressing
                    this.getAddress = function(){
                        return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name;
                    };
            
                //group functions
                    let children = []; 
                    let childRegistry = {};
            
                    function getChildByName(name){ return childRegistry[name]; }
                    function checkForName(name){ return childRegistry[name] != undefined; }
                    function checkForElement(element){ return children.find(a => a == element); }
                    function isValidElement(element){
                        if( element == undefined ){ return false; }
                        if( element.name.length == 0 ){
                            console.warn('group error: element with no name being inserted into group "'+self.getAddress()+'", therefore; the element will not be added');
                            return false;
                        }
                        if( checkForName(element.name) ){
                            console.warn('group error: element with name "'+element.name+'" already exists in group "'+self.getAddress()+'", therefore; the element will not be added');
                            return false;
                        }
            
                        return true;
                    }
            
                    this.children = function(){return children;};
                    this.getChildByName = function(name){return getChildByName(name);};
                    this.getChildIndexByName = function(name){return children.indexOf(children.find(a => a.name == name)); };
                    this.contains = checkForElement;
                    this.append = function(element){
            
                        if( !isValidElement(element) ){ return; }
            
                        children.push(element); 
                        element.parent = this;
                        augmentExtremities_add(element);
            
                        childRegistry[element.name] = element;
                        if(element.onadd != undefined){element.onadd(false);}
                    };
                    this.prepend = function(element){
            
                        if( !isValidElement(element) ){ return; }
            
                        children.unshift(element); 
                        element.parent = this;
                        augmentExtremities_add(element);
            
                        childRegistry[element.name] = element;
                        if(element.onadd != undefined){element.onadd(true);}
                    };
                    this.remove = function(element){
                        if(element == undefined){return;}
                        if(element.onremove != undefined){element.onremove();}
                        children.splice(children.indexOf(element), 1);
                        augmentExtremities_remove(element);
            
                        element.parent = undefined;
                        delete childRegistry[element.name];
                    };
                    this.clear = function(){ children = []; childRegistry = {} };
                    this.getElementsUnderPoint = function(x,y){
            
                        var returnList = [];
            
                        //run though children backwords (thus, front to back)
                        for(var a = children.length-1; a >= 0; a--){
                            //if child wants to be ignored, just move on to the next one
                                if( children[a].ignored() ){ continue; }
            
                            //if the point is not within this child's bounding box, just move on to the next one
                                if( !library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, children[a].extremities.boundingBox ) ){ continue; }
            
                            //if the child is a group type; pass this point to it's "getElementsUnderPoint" function and collect the results, then move on to the next item
                                if( children[a].getType() == 'group' ){ returnList = returnList.concat( children[a].getElementsUnderPoint(x,y) ); continue; }
            
                            //if this point exists within the child; add it to the results list
                                if( library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, children[a].extremities.points ) ){ returnList = returnList.concat( children[a] ); }
                        }
            
                        return returnList;
                    };
                    this.getElementsUnderArea = function(points){
            
                        var returnList = [];
            
                        //run though children backwords (thus, front to back)
                        for(var a = children.length-1; a >= 0; a--){
                            //if child wants to be ignored, just move on to the next one
                                if( children[a].ignored() ){ continue; }
            
                            //if the area does not overlap with this child's bounding box, just move on to the next one
                                if( !library.math.detectOverlap.boundingBoxes( library.math.boundingBoxFromPoints(points), item.extremities.boundingBox ) ){ continue; }
            
                            //if the child is a group type; pass this area to it's "getElementsUnderArea" function and collect the results, then move on to the next item
                                if( children[a].getType() == 'group' ){ returnList = returnList.concat( item.getElementUnderArea(points) ); continue; }
            
                            //if this area overlaps with the child; add it to the results list
                                if( library.math.detectOverlap.overlappingPolygons(points, item.extremities.points) ){ returnList = returnList.concat( children[a] ); }
                        }
            
                        return returnList;
                    };
                    this.getTree = function(){
                        var result = {name:this.name,type:type,children:[]};
            
                        children.forEach(function(a){
                            if(a.getType() == 'group'){ result.children.push( a.getTree() ); }
                            else{ result.children.push({ type:a.getType(), name:a.name }); }
                        });
            
                        return result;
                    };
            
                //clipping
                    var clipping = { stencil:undefined, active:false };
                    this.stencil = function(element){
                        if(element == undefined){return clipping.stencil;}
                        clipping.stencil = element;
                        clipping.stencil.parent = this;
                        if(clipping.active){ computeExtremities(); }
                    };
                    this.clipActive = function(bool){
                        if(bool == undefined){return clipping.active;}
                        clipping.active = bool;
                        computeExtremities();
                    };
            
                //extremities
                    function calculateExtremitiesBox(){
                        var limits = {left:0,right:0,top:0,bottom:0};
                        children.forEach(child => {
                            var tmp = library.math.boundingBoxFromPoints(child.extremities.points);
                            if( tmp.bottomRight.x > limits.right ){ limits.right = tmp.bottomRight.x; }
                            else if( tmp.topLeft.x < limits.left ){ limits.left = tmp.topLeft.x; }
                            if( tmp.bottomRight.y > limits.top ){ limits.top = tmp.bottomRight.y; }
                            else if( tmp.topLeft.y < limits.bottom ){ limits.bottom = tmp.topLeft.y; }
                        });
                        self.extremities.points = [ {x:limits.left,y:limits.top}, {x:limits.right,y:limits.top}, {x:limits.right,y:limits.bottom}, {x:limits.left,y:limits.bottom} ];
                    }
                    function updateExtremities(informParent=true){
            
                        //generate extremity points
                            self.extremities.points = [];
            
                            //if clipping is active and possible, the extremities of this group are limited to those of the clipping element
                            //otherwise, gather extremities from children and calculate extremities here
                            if(clipping.active && clipping.stencil != undefined){
                                self.extremities.points = clipping.stencil.extremities.points.slice();
                            }else{
                                calculateExtremitiesBox();
                            }
            
                        //generate bounding box from points
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
            
                        //update parent
                            if(informParent){ if(self.parent){self.parent.updateExtremities();} }
                    }
                    function augmentExtremities(element){
            
                        //get offset from parent
                            var offset = self.parent && !self.static() ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            element.computeExtremities(false,newOffset);
                        //augment points list
                            calculateExtremitiesBox();
                        //recalculate bounding box
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function computeExtremities(informParent=true,offset){
                        
                        //get offset from parent, if one isn't provided
                            if(offset == undefined){ offset = self.parent && !self.static() ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        //combine offset with group's position, angle and scale to produce new offset for chilren
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on all children
                            children.forEach(a => a.computeExtremities(false,newOffset));
                        //run computeExtremities on stencil (if applicable)
                            if( clipping.stencil != undefined ){ clipping.stencil.computeExtremities(false,newOffset); }
                        //update extremities
                            updateExtremities(informParent,offset);
                    }
                    function augmentExtremities_add(element){
            
                        //get offset from parent
                            var offset = self.parent && !self.static() ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            element.computeExtremities(false,newOffset);
            
                        //augment points list
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints( self.extremities.points.concat(element.extremities.points) );
                            self.extremities.points = [
                                { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.topLeft.y },
                                { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.topLeft.y },
                                { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.bottomRight.y },
                                { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.bottomRight.y },
                            ];
            
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function augmentExtremities_remove(element){
                        //this function assumes that the element has already been removed from the 'children' variable)
                        //is the element's bounding box within the bounding box of the group; if so, no recalculation need be done
                        //otherwise the element is touching the boundary, in which case search through the children for another 
                        //element that also touches the boundary, or find the closest element and adjust the boundary to touch that
            
                        var data = {
                            topLeft:{
                                x: self.extremities.boundingBox.topLeft.x - element.extremities.boundingBox.topLeft.x,
                                y: self.extremities.boundingBox.topLeft.y - element.extremities.boundingBox.topLeft.y,
                            },
                            bottomRight:{
                                x: element.extremities.boundingBox.bottomRight.x - self.extremities.boundingBox.bottomRight.x,
                                y: element.extremities.boundingBox.bottomRight.y - self.extremities.boundingBox.bottomRight.y,
                            }
                        };
                        if( data.topLeft.x != 0 && data.topLeft.y != 0 && data.bottomRight.x != 0 && data.bottomRight.y != 0 ){
                            return;
                        }else{
                            ['topLeft','bottomRight'].forEach(cornerName => {
                                ['x','y'].forEach(axisName => {
                                    if(data[cornerName][axisName] == 0){
            
                                        var boundaryToucherFound = false;
                                        var closestToBoundary = {distance:undefined, position:undefined};
                                        for(var a = 0; a < children.length; a++){
                                            var tmp = Math.abs(children[a].extremities.boundingBox[cornerName][axisName] - self.extremities.boundingBox[cornerName][axisName]);
                                            if(closestToBoundary.distance == undefined || closestToBoundary.distance > tmp){
                                                closestToBoundary = { distance:tmp, position:children[a].extremities.boundingBox[cornerName][axisName] };
                                                if(closestToBoundary.distance == 0){ boundaryToucherFound = true; break; }
                                            }
                                        }
            
                                        if(!boundaryToucherFound){
                                            self.extremities.boundingBox[cornerName][axisName] = closestToBoundary.position;
                                        }
                                    }
                                });
                            });
                        }
                    }
            
                    this.getOffset = function(){
                        if(this.parent){
                            var offset = this.parent.getOffset();
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            return { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale * scale,
                                angle: offset.angle + angle,
                            };
                        }else{ return {x:x ,y:y ,scale:scale ,angle:angle}; }
                    };
                    this.computeExtremities = computeExtremities;
                    this.updateExtremities = updateExtremities;
                
            
                //lead render
                    function drawDotFrame(){
                        //draw bounding box top left and bottom right points
                        render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:0,b:0,a:0.75});
                        render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:0,b:0,a:0.75});
                    }
                    this.render = function(context, offset){
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
            
                        //activate clipping (if requested, and is possible)
                            if(clipping.active && clipping.stencil != undefined){
                                //active stencil drawing mode
                                    context.enable(context.STENCIL_TEST);
                                    context.colorMask(false,false,false,false);
                                    context.stencilFunc(context.ALWAYS,1,0xFF);
                                    context.stencilOp(context.KEEP,context.KEEP,context.REPLACE);
                                    context.stencilMask(0xFF);
                                //draw stencil
                                    clipping.stencil.render(context,newOffset);
                                //reactive regular rendering
                                    context.colorMask(true,true,true,true);
                                    context.stencilFunc(context.EQUAL,1,0xFF);
                            }
                        
                        //render children
                            children.forEach(function(a){
                                if(
                                    library.math.detectOverlap.boundingBoxes(
                                        clipping.active ? self.extremities.boundingBox : viewport.getBoundingBox(),
                                        a.extremities.boundingBox
                                    )
                                ){ 
                                    a.render(context,newOffset);
                                }else{
                                }
                            });
            
                        //deactivate clipping
                            if(clipping.active){ 
                                context.disable(context.STENCIL_TEST); 
                                context.clear(context.STENCIL_BUFFER_BIT);
                            }
            
                        //if requested; draw dot frame
                            if(self.dotFrame){drawDotFrame();}
                    };
            
                //info dump
                    this._dump = function(){
                        report.info(self.getAddress(),'._dump()');
                        report.info(self.getAddress(),'._dump -> id: '+id);
                        report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
                        report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
                        report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
                        report.info(self.getAddress(),'._dump -> ignored: '+ignored);
                        report.info(self.getAddress(),'._dump -> x: '+x);
                        report.info(self.getAddress(),'._dump -> y: '+y);
                        report.info(self.getAddress(),'._dump -> angle: '+angle);
                        report.info(self.getAddress(),'._dump -> scale: '+scale);
                        report.info(self.getAddress(),'._dump -> heedCamera: '+heedCamera);
                        report.info(self.getAddress(),'._dump -> static: '+static);
                        report.info(self.getAddress(),'._dump -> children: '+JSON.stringify(children));
                        report.info(self.getAddress(),'._dump -> childRegistry: '+JSON.stringify(childRegistry));
                        report.info(self.getAddress(),'._dump -> clipping: '+JSON.stringify(clipping));
                    };
                
                //interface
                    this.interface = new function(){
                        this.ignored = self.ignored;
                        this.x = self.x;
                        this.y = self.y;
                        this.angle = self.angle;
                        this.scale = self.scale;
                        this.heedCamera = self.heedCamera;
                        this.static = self.static;
                        this.unifiedAttribute = self.unifiedAttribute;
            
                        this.getAddress = self.getAddress;
            
                        this.children = function(){ return self.children().map(e => element.getIdFromElement(e)) };
                        this.getChildByName = function(name){ return element.getIdFromElement(self.getChildByName(name)); };
                        this.getChildIndexByName = self.getChildIndexByName;
                        this.contains = function(elementId){ return self.contains(element.getElementFromId(elementId)); };
                        this.append = function(elementId){ return self.append(element.getElementFromId(elementId)); };
                        this.prepend = function(elementId){ return self.prepend(element.getElementFromId(elementId)); };
                        this.remove = function(elementId){ return self.remove(element.getElementFromId(elementId)); };
                        this.clear = self.clear;
                        this.getElementsUnderPoint = function(x,y){ return element.getIdFromElement(self.getElementsUnderPoint(x,y)); };
                        this.getElementsUnderArea = function(points){ return element.getIdFromElement(self.getElementsUnderArea(points)); };
                        this.getTree = self.getTree;
                        this.stencil = self.stencil;
                        this.clipActive = self.clipActive;
            
                        this._dump = self._dump;
                    };
            };
        };
        this.getAvailableElements = function(){ 
            return Object.keys(elementLibrary);
        };

    //element control
        //database
            const createdElements = [];
            function generateElementId(){
                let id = createdElements.findIndex(item => item==undefined);
                return id != -1 ? id : createdElements.length;
            }
            function getElementFromId(id){ return createdElements[id]; }
            function getIdFromElement(element){ return element.getId(); }

            this.getElementFromId = getElementFromId;
            this.getIdFromElement = getIdFromElement;
            this.getCreatedElements = function(){ 
                return createdElements;
            };

        //creation
            this.create_skipDatabase = function(type,name){
                return new elementLibrary[type](name,-1);
            };
            this.create = function(type,name){

                if(type == undefined){ report.error('elememt.createElement: type argument not provided - element will not be produced'); return; }
                if(name == undefined){ report.error('elememt.createElement: name argument not provided - element will not be produced'); return; }
                if(elementLibrary[type] == undefined){ report.error('elememt.createElement: type "'+type+'" does not exist - element will not be produced'); return; }

                const newElement_id = generateElementId();
                createdElements[newElement_id] = new elementLibrary[type](name,newElement_id);
                return createdElements[newElement_id];
            };

        //deletion
            this.delete = function(element){ 
                createdElements[getIdFromElement(element)] = undefined;
            };
            this.deleteAllCreated = function(){ 
                for(let a = 0; a < createdElements.length; a++){this.delete(getElementFromId(a));}
            };

        //other
            this.getTypeById = function(element){ 
                return element.getType();
            };
            this._dump = function(){
                report.info('element._dump()');
                Object.keys(elementLibrary).forEach(key => { report.info('element._dump -> elementLibrary: '+key); })

                if(reatedElements.length == 0){ report.info('element._dump -> there are no created elements'); }
                else if(reatedElements.length == 1){ report.info('element._dump -> there is 1 created element'); }
                else{ report.info('element._dump -> there are '+createdElements.length+' created elements'); }
                
                createdElements.forEach(item => { report.info('element._dump -> createdElements: '+JSON.stringify(item)); });
            };
};
const arrangement = new function(){
    let design = element.create_skipDatabase('group','root');

    this.new = function(){ 
        design = core.shape.create('group');
    };
    this.get = function(){
        return design; 
    };
    this.set = function(arrangement){ 
        design = arrangement;
    };
    this.prepend = function(element){
        design.prepend(element);
    };
    this.append = function(element){
        design.append(element);
    };
    this.remove = function(element){ 
        design.remove(element); 
    };
    this.clear = function(){ 
        design.clear(); 
    };

    this.getElementByAddress = function(address){

        var route = address.split('/'); 
        route.shift(); 
        route.shift(); 

        var currentObject = design;
        route.forEach(function(a){
            currentObject = currentObject.getChildByName(a);
        });

        return currentObject;
    };
    this.getElementsUnderPoint = function(x,y){
        return design.getElementsUnderPoint(x,y);
    };
    this.getElementsUnderArea = function(points){ 
        return design.getElementsUnderArea(points); 
    };
        
    this.printTree = function(mode='spaced'){ //modes: spaced / tabular / address
        function recursivePrint(grouping,prefix=''){
            grouping.children.forEach(function(a){
                if(mode == 'spaced'){
                    console.log(prefix+'- '+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'- ') }
                }else if(mode == 'tabular'){
                    console.log(prefix+'- \t'+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                }else if(mode == 'address'){
                    console.log(prefix+'/'+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                }
            });
        }

        recursivePrint(design.getTree(), '/root');
    };

    this._dump = function(){ design._dump(); };
};
const render = new function(){
    const self = this; 

    let isBusy = true;
    this.isBusy = function(){ return isBusy };

    const pageData = {
        defaultCanvasSize:{width:800, height:600},
        currentCanvasSize:{width:800, height:600},
        selectedCanvasSize:{width:800, height:600},
        devicePixelRatio:1,
    };
    const canvas = new OffscreenCanvas(pageData.defaultCanvasSize.width, pageData.defaultCanvasSize.height);
    const context = canvas.getContext("webgl2", {alpha:false, preserveDrawingBuffer:true, stencil:true});
    let animationRequestId = undefined;
    let clearColour = {r:1,g:1,b:1,a:1};

    //webGL setup
        context.enable(context.BLEND);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

    //webGL program production
        let storedPrograms = {};
        this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource){
            function compileProgram(vertexShaderSource, fragmentShaderSource){
                function createShader(type, source){
                    let shader = context.createShader(type);
                    context.shaderSource(shader, source);
                    context.compileShader(shader);
                    let success = context.getShaderParameter(shader, context.COMPILE_STATUS);
                    if(success){ return shader; }
            
                    console.error('major error in core\'s "'+ type +'" shader creation');
                    console.error(context.getShaderInfoLog(shader));
                    context.deleteShader(shader);
                }

                let program = context.createProgram();
                context.attachShader(program, createShader(context.VERTEX_SHADER,vertexShaderSource) );
                context.attachShader(program, createShader(context.FRAGMENT_SHADER,fragmentShaderSource) );
                context.linkProgram(program);
                let success = context.getProgramParameter(program, context.LINK_STATUS);
                if(success){ return program; }
            
                console.error('major error in core\'s program creation');
                console.error(context.getProgramInfoLog(program));
                context.deleteProgram(program);
            };

            if( !(name in storedPrograms) ){
                storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                context.useProgram(storedPrograms[name]);
            }else{
            }

            return storedPrograms[name];
        };

    //canvas and webGL context adjustment
        this.clearColour = function(colour){
            if(colour == undefined){ return clearColour; }
            clearColour = colour;
            context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            let adjustCanvasSize_isBusy = {width:false,height:false};
            isBusy = true;

            function updateInternalCanvasSize(direction,newValue){
                newValue *= pageData.devicePixelRatio;
                if(newValue != undefined){
                    if(pageData.currentCanvasSize[direction] != newValue){
                        pageData.currentCanvasSize[direction] = newValue;
                        canvas[direction] = pageData.currentCanvasSize[direction];
                    }
                }else{
                    if(pageData.currentCanvasSize[direction] != pageData.defaultCanvasSize[direction]){
                        pageData.currentCanvasSize[direction] = pageData.defaultCanvasSize[direction];
                        canvas[direction] = pageData.currentCanvasSize[direction];
                    }
                }

                self.refreshCoordinates();
                adjustCanvasSize_isBusy[direction] = false;
                isBusy = adjustCanvasSize_isBusy['width'] || adjustCanvasSize_isBusy['height'];
            }
            
            //request canvas data from the console, if none is provided in arguments
            // -> argument data > requested data > default data
            function updateSize_arguments(){
                adjustCanvasSize_isBusy = {width:true,height:true};

                if(newWidth != undefined){
                    updateInternalCanvasSize('width',newWidth*pageData.devicePixelRatio);
                }else{
                    updateSize_dataRequest('width');
                }
                if(newHeight != undefined){
                    updateInternalCanvasSize('height',newHeight*pageData.devicePixelRatio);
                }else{
                    updateSize_dataRequest('height');
                }
            }
            function updateSize_dataRequest(direction){
                const capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);

                interface.getCanvasAttributes([capitalizedDirection],[true]).then(sizes => {
                    pageData.selectedCanvasSize[direction] = sizes[0];
                    const attribute = pageData.selectedCanvasSize[direction];

                    function unparseableErrorMessage(direction,attribute){
                        report.error( 'Canvas element '+direction+' is of an unparseable format: '+attribute );
                        updateSize_usingDefault(direction);
                    }

                    if( attribute.indexOf('%') == (attribute.length-1) ){ //percentage
                        interface.getCanvasParentAttributes(['offset'+capitalizedDirection]).then(sizes => {
                            const parentSize = sizes[0];
                            const percent = parseFloat(attribute.slice(0,-1)) / 100;
                            if( isNaN(percent) ){ unparseableErrorMessage(direction,attribute); return; }
                            updateInternalCanvasSize(direction,parentSize*percent);
                        });
                    }else if( attribute.indexOf('px') != -1 ){ //px value
                        const val = parseFloat(attribute.slice(0,-2));
                        if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                        updateInternalCanvasSize(direction,val);
                    }else{ //flat value
                        const val = parseFloat(attribute);
                        if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                        updateInternalCanvasSize(direction,val);
                    }
                });
            }
            function updateSize_usingDefault(direction){
                updateInternalCanvasSize(direction,pageData.defaultCanvasSize[direction]);
            }

            interface.getWindowAttributes(['devicePixelRatio']).then(values => {
                pageData.devicePixelRatio = values[0];
                updateSize_arguments();
            });
        };
        this.refreshCoordinates = function(){
            let w = context.canvas.width;
            let h = context.canvas.height;

            let x, y, width, height = 0;
            if(pageData.devicePixelRatio == 1){
                x = 0;
                y = 0;
                width = w;
                height = h;
            }else{
                x = 0;
                y = -h;
                width = w*2;
                height = h*2;
            }

            context.viewport(x, y, width, height);

            interface.setCanvasAttributes([{name:'width',value:w/pageData.devicePixelRatio},{name:'height',value:h/pageData.devicePixelRatio}]);
        };
        this.refresh = function(allDoneCallback){
            this.clearColour(clearColour);
            this.frameRateLimit(this.frameRateLimit());
            this.adjustCanvasSize();

            const refresh_interval = setInterval(function(){
                if(!render.isBusy()){
                    clearInterval(refresh_interval);
                    if(allDoneCallback){allDoneCallback()};
                }
            },1);
        };

    //frame rate control
        const frameRateControl = {active:false, previousRenderTime:Date.now(), limit:30, interval:0};
        this.activeLimitToFrameRate = function(a){
            if(a==undefined){return frameRateControl.active;}
            frameRateControl.active=a
        };
        this.frameRateLimit = function(a){
            if(a==undefined){ return frameRateControl.limit; }
            frameRateControl.limit=a;
            frameRateControl.interval=1000/frameRateControl.limit;
        };

    //actual render
        function renderFrame(noClear=false){
            if(!noClear){context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);}
            arrangement.get().render(context,{x:0,y:0,scale:1,angle:0});
            const transferableImage = canvas.transferToImageBitmap();
            interface.printToScreen(transferableImage);
        }
        function animate(timestamp){
            animationRequestId = requestAnimationFrame(animate);

            //limit frame rate
                if(frameRateControl.active){
                    let currentRenderTime = Date.now();
                    let delta = currentRenderTime - frameRateControl.previousRenderTime;
                    if(delta < frameRateControl.interval){ return; }
                    frameRateControl.previousRenderTime = currentRenderTime - delta%frameRateControl.interval;
                }

            //attempt to render frame, if there is a failure; stop animation loop and report the error
                try{
                    renderFrame();
                }catch(error){
                    render.active(false);
                    console.error('major animation error');
                    console.error(error);
                }

            //perform stats collection
                stats.collect(timestamp);
        }
        this.frame = function(noClear=false){
            renderFrame(noClear);
        };
        this.active = function(bool){
            if(bool == undefined){return animationRequestId!=undefined;}

            if(bool){
                if(animationRequestId != undefined){return;}
                animate();
            }else{
                if(animationRequestId == undefined){return;}
                cancelAnimationFrame(animationRequestId);
                animationRequestId = undefined;
            }
        };

    //misc
        this.getCanvasSize = function(){ return {width:pageData.currentCanvasSize.width/pageData.devicePixelRatio, height:pageData.currentCanvasSize.height/pageData.devicePixelRatio}; };
        this._dump = function(){
            report.info('render._dump()');
            report.info('render._dump -> pageData: '+JSON.stringify(pageData));
            report.info('render._dump -> storedPrograms: '+JSON.stringify(storedPrograms));
            report.info('render._dump -> frameRateControl: '+JSON.stringify(frameRateControl));
            report.info('render._dump -> clearColour: '+JSON.stringify(clearColour));
        };
};
const viewport = new function(){
    const self = this;
    const state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
    };
    const viewbox = {
        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
    };
    const mouseData = { 
        x:undefined, 
        y:undefined, 
        stopScrollActive:false,
    };

    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                const position = viewport.position();
                const scale = viewport.scale();
                const angle = viewport.angle();

                let tmp = {x:x, y:y};
                tmp.x = (tmp.x - position.x)/scale;
                tmp.y = (tmp.y - position.y)/scale;
                tmp = library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);

                return tmp;
            };
            // this.workspacePoint2windowPoint = function(x,y){
            //     let position = viewport.position();
            //     let scale = viewport.scale();
            //     let angle = viewport.angle();

            //     let point = library.math.cartesianAngleAdjust(x,y,angle);

            //     return {
            //         x: (point.x+position.x) * scale,
            //         y: (point.y+position.y) * scale
            //     };
            // };
        };

    //camera position
        this.position = function(x,y){
            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
            state.position.x = x;
            state.position.y = y;

            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){
                    item.unifiedAttribute({x:state.position.x,y:state.position.y});
                }
            });

            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.scale = function(s){
            if(s == undefined){return state.scale;}
            state.scale = s <= 0 ? 1 : s;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    item.scale(state.scale);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.angle = function(a){
            if(a == undefined){return state.angle;}
            state.angle = a;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    item.angle(state.angle);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };

    //mouse interaction
        this.getElementsUnderPoint = function(x,y){
            let xy = this.adapter.windowPoint2canvasPoint(x,y);
            return arrangement.getElementUnderPoint(xy.x,xy.y);
        };
        this.getElementsUnderArea = function(points){
            return arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2canvasPoint(a.x,a.y)));
        };
 
    //misc
        function calculateViewportExtremities(){
            const canvasDimensions = render.getCanvasSize();

            //for each corner of the viewport; find out where they lie on the canvas
                viewbox.points.tl = {x:0, y:0};
                viewbox.points.tr = {x:canvasDimensions.width, y:0};
                viewbox.points.bl = {x:0, y:canvasDimensions.height};
                viewbox.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
            //calculate a bounding box for the viewport from these points
                viewbox.boundingBox = library.math.boundingBoxFromPoints([viewbox.points.tl, viewbox.points.tr, viewbox.points.br, viewbox.points.bl]);
        }
        this.calculateViewportExtremities = calculateViewportExtremities;
        this.refresh = function(){
            calculateViewportExtremities();
        };
        this.getBoundingBox = function(){ 
            return viewbox.boundingBox;
        };
        this.mousePosition = function(x,y){
            if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
            mouseData.x = x;
            mouseData.y = y;
        };
        this.stopMouseScroll = function(bool){
            if(bool == undefined){return mouseData.stopScrollActive;}
            mouseData.stopScrollActive = bool;
    
            //just incase; make sure that scrolling is allowed again when 'stopMouseScroll' is turned off
            if(!bool){ interface['document.body.style.overflow'](''); }
        };
        this._dump = function(){
            report.info('viewport._dump()');
            report.info('viewport._dump -> state: '+JSON.stringify(state));
            report.info('viewport._dump -> viewbox: '+JSON.stringify(viewbox));
            report.info('viewport._dump -> mouseData: '+JSON.stringify(mouseData));
        };

    //callback
        this.onCameraAdjust = function(state){};
};
const stats = new function(){
    let active = false;
    let average = 30;
    let lastTimestamp = 0;

    const framesPerSecond = {
        compute:function(timestamp){

            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
            if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }

            this.rate = library.math.averageArray( this.frameTimeArray );

            lastTimestamp = timestamp;
        },
        counter:0,
        frameTimeArray:[],
        rate:0,
    };

    this.collect = function(timestamp){
        //if stats are turned off, just bail
            if(!active){return;}

        framesPerSecond.compute(timestamp);
    };
    this.active = function(bool){
        if(bool==undefined){return active;} 
        active=bool;
    };
    this.getReport = function(){
        return {
            framesPerSecond: framesPerSecond.rate,
        };
    };
};
const callback = new function(){
    const self = this; 

    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onmouseenterelement', 'onmouseleaveelement',
        'onkeydown', 'onkeyup',
    ];
    this.listCallbackTypes = function(){
        return callbacks;
    };

    var elementCallbackStates = {}; 
    callbacks.forEach(callbackType => elementCallbackStates[callbackType] = true);
    this.getElementCallbackState = function(type){
        return elementCallbackStates[type];
    };
    this.activateElementCallback = function(type){
        elementCallbackStates[type] = true;
    };
    this.disactivateElementCallback = function(type){
        elementCallbackStates[type] = false;
    };
    this.activateAllElementCallbacks = function(){ 
        callbacks.forEach(callback => this.activateElementCallback(callback)); 
    };
    this.disactivateAllElementCallbacks = function(){ 
        callbacks.forEach(callback => this.disactivateElementCallback(callback)); 
    };
    this.activateAllElementCallbacks();

    this.attachCallback = function(element,callbackType){
        element[callbackType] = function(){};
    };
    this.removeCallback = function(element,callbackType){
        element[callbackType] = undefined;
        delete element[callbackType];
    };

    function gatherDetails(event,callback,count){
        //only calculate enough data for what will be needed
        return {
            point: count > 0 ? viewport.adapter.windowPoint2workspacePoint(event.X,event.Y) : undefined,
            elements: count > 3 ? arrangement.getElementsUnderPoint(event.X,event.Y) : undefined,
        };
    }
    this.functions = {};

    //coupling object
        this.coupling = {};

    //default
        for(var a = 0; a < callbacks.length; a++){
            this.coupling[callbacks[a]] = function(callbackName){
                return function(event){
                    var data = gatherDetails(event,callbackName,self.functions[callbackName].length);
                    self.functions[callbackName]( data.point.x, data.point.y, event, data.elements );
                }
            }(callbacks[a]);
        }

    //special cases
        //canvas onmouseenter / onmouseleave
            this.coupling.onmouseenter = function(event){
                //if appropriate, remove the window scrollbars
                    if(viewport.stopMouseScroll()){ 
                        interface['document.body.style.overflow']('hidden');
                    }
            };
            this.coupling.onmouseleave = function(event){
                //if appropriate, replace the window scrollbars
                    if(viewport.stopMouseScroll()){ 
                        interface['document.body.style.overflow']('');
                    }
            };

        //onmousemove / onmouseenter / onmouseleave
            var elementMouseoverList = [];
            this.coupling.onmousemove = function(event){
                viewport.mousePosition(event.X,event.Y);
                var elementsUnderPoint = arrangement.getElementsUnderPoint(event.X,event.Y);
                var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //check for onmouseenter / onmouseleave
                    //go through the elementsUnderPoint list, comparing to the element transition list
                        var diff = library.math.getDifferenceOfArrays(elementMouseoverList,elementsUnderPoint);
                        //run both onmouseenterelement and onmouseenterelement, only if there's
                        //  elements to report, providing only the relevant set of elements
                        //elements only on elements list; add to elementMouseoverList
                        //elements only on elementMouseoverList; remove from elementMouseoverList
                        if(elementCallbackStates.onmouseenter){
                            if(diff.b.length > 0){ self.functions.onmouseenterelement( point.x, point.y, event, diff.b); }
                            if(diff.a.length > 0){ self.functions.onmouseleaveelement( point.x, point.y, event, diff.a); }
                        }
                        diff.b.forEach(function(element){ elementMouseoverList.push(element); });
                        diff.a.forEach(function(element){ elementMouseoverList.splice(elementMouseoverList.indexOf(element),1); });

                //perform regular onmousemove actions
                    if(self.functions.onmousemove){
                        self.functions.onmousemove( point.x, point.y, event, elementsUnderPoint );
                    }
            };

        //onwheel
            this.coupling.onwheel = function(event){

                if(self.functions.onwheel){
                    var data = gatherDetails(event,'onwheel',self.functions.onwheel.length);
                    self.functions.onwheel( data.point.x, data.point.y, event, data.elements );
                }
            };

        //onkeydown / onkeyup
            ['onkeydown', 'onkeyup'].forEach(callbackName => {
                this.coupling[callbackName] = function(callback){
                    return function(event){
                        var p = viewport.mousePosition(); event.X = p.x; event.Y = p.y;
                        var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                
                        if(self.functions[callback]){
                            var data = gatherDetails(event,callback,self.functions[callback].length);
                            self.functions[callback]( point.x, point.y, event, data.elements );
                        }
                    }
                }(callbackName);
            });

        //onmousedown / onmouseup / onclick / ondblclick
            var elementMouseclickList = [];
            this.coupling.onmousedown = function(event){

                var elementsUnderPoint = arrangement.getElementsUnderPoint(event.X,event.Y);
                var workspacePoint = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //save current elements for use in the onclick part of the onmouseup callback
                    elementMouseclickList = elementsUnderPoint;

                //perform global function
                    if(self.functions.onmousedown){
                        self.functions.onmousedown( workspacePoint.x, workspacePoint.y, event, elementsUnderPoint );
                    }
            };
            this.coupling.onmouseup = function(event){
                    
                //perform global function
                    if(self.functions.onmouseup){
                        var data = gatherDetails(event,'onmouseup',self.functions.onmouseup.length);
                        self.functions.onmouseup( data.point.x, data.point.y, event, data.elements );
                    }
            };
            var recentlyClickedDoubleClickableElementList = [];
            this.coupling.onclick = function(event){
                if(self.functions.onclick){
                    var data = gatherDetails(event,'onclick',self.functions.onclick.length);
                    data.elements = data.elements.filter( element => elementMouseclickList.includes(element) );
                    recentlyClickedDoubleClickableElementList = data.elements;
                    self.functions.onclick( data.point.x, data.point.y, event, data.elements );
                }
            };
            this.coupling.ondblclick = function(event){
                if(self.functions.ondblclick){
                    var data = gatherDetails(event,'ondblclick',self.functions.ondblclick.length);
                    data.elements = data.elements.filter( element => recentlyClickedDoubleClickableElementList.includes(element) );
                    self.functions.ondblclick( data.point.x, data.point.y, event, data.elements );
                }
            };
};

//dialing in
    //meta
        communicationModule.function['areYouReady'] = function(){
            return true;
        };
        communicationModule.delayedFunction['refresh'] = function(responseFunction){
            render.refresh(() => {
                viewport.refresh();
                responseFunction();
            });
        };
        communicationModule.function['createSetAppend'] = function(type,name,setList,appendingGroup){

            const newElement = element.create(type,name);
            const elementId = element.getIdFromElement(newElement);
            Object.keys(setList).forEach(key => { newElement[key](...[setList[key]]); });
            if(appendingGroup == -1 || appendingGroup == undefined){ arrangement.append(newElement); }
            else{ element.getElementFromId(appendingGroup)['append'](elementId); }
            return elementId;
        };

    //_dump
        communicationModule.function['_dump.element'] = function(){
            element._dump();
        };
        communicationModule.function['_dump.arrangement'] = function(){
            arrangement._dump();
        };
        communicationModule.function['_dump.render'] = function(){
            render._dump();
        };
        communicationModule.function['_dump.viewport'] = function(){
            viewport._dump();
        };
        communicationModule.function['_dump.callback'] = function(){
            callback._dump();
        };

    //boatload
        communicationModule.function['boatload.element.executeMethod'] = function(containers){
            containers.forEach(container => { 
                communicationModule.function['element.executeMethod'](container.id,container.method,container.argumentList); 
            });
        };

    //element
        communicationModule.function['element.getAvailableElements'] = function(){
            return element.getAvailableElements();
        };
        communicationModule.function['element.getCreatedElements'] = function(){
            return element.getCreatedElements().map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['element.create'] = function(type,name){
            return element.getIdFromElement(element.create(type,name));
        };
        communicationModule.function['element.delete'] = function(id){
            element.delete(element.getElementFromId(id));
        };
        communicationModule.function['element.deleteAllCreated'] = function(){
            element.deleteAllCreated();
        };
        communicationModule.function['element.getTypeById'] = function(id){
            return element.getTypeById(element.getElementFromId(id));
        };
        communicationModule.function['element.executeMethod'] = function(id,method,argumentList=[]){
            return element.getElementFromId(id).interface[method](...argumentList);
        };

    //arrangement
        communicationModule.function['arrangement.new'] = function(){
            arrangement.new();
        };
        communicationModule.function['arrangement.prepend'] = function(id){
            arrangement.prepend(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.append'] = function(id){
            arrangement.append(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.remove'] = function(id){
            arrangement.remove(element.getElementFromId(id));
        };
        communicationModule.function['arrangement.clear'] = function(){
            arrangement.clear();
        };
        communicationModule.function['arrangement.getElementAddress'] = function(id){
            return element.getElementFromId(id).getAddress();
        };
        communicationModule.function['arrangement.getElementByAddress'] = function(address){
            return element.getIdFromElement(arrangement.getElementByAddress(address));
        };
        communicationModule.function['arrangement.getElementsUnderPoint'] = function(x,y){
            return arrangement.getElementsUnderPoint(x,y).map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['arrangement.getElementsUnderArea'] = function(points){
            return arrangement.getElementsUnderArea(points).map(ele => element.getIdFromElement(ele));
        };
        communicationModule.function['arrangement.printTree'] = function(mode){
            arrangement.printTree(mode);
        };

    //render
        communicationModule.delayedFunction['render.refresh'] = function(responseFunction){
            render.refresh(responseFunction);
        };
        communicationModule.function['render.clearColour'] = function(colour){
            return render.clearColour(colour);
        };
        communicationModule.function['render.adjustCanvasSize'] = function(newWidth, newHeight){
            render.adjustCanvasSize(newWidth, newHeight);
        };
        communicationModule.function['render.getCanvasSize'] = function(){
            return render.getCanvasSize();
        };
        communicationModule.function['render.activeLimitToFrameRate'] = function(active){
            return render.activeLimitToFrameRate(active);
        };
        communicationModule.function['render.frameRateLimit'] = function(rate){
            return render.frameRateLimit(rate);
        };
        communicationModule.function['render.frame'] = function(){
            render.frame();
        };
        communicationModule.function['render.active'] = function(active){
            return render.active(active);
        };

    //viewport
        communicationModule.function['viewport.refresh'] = function(){
            viewport.refresh();
        };
        communicationModule.function['viewport.position'] = function(x,y){
            return viewport.position(x,y);
        };
        communicationModule.function['viewport.scale'] = function(s){
            return viewport.scale(s);
        };
        communicationModule.function['viewport.angle'] = function(a){
            return viewport.angle(a);
        };
        communicationModule.function['viewport.getElementsUnderPoint'] = function(x,y){
            return viewport.getElementsUnderPoint(x,y);
        };
        communicationModule.function['viewport.getElementsUnderArea'] = function(points){
            return viewport.getElementsUnderArea(points);
        };
        communicationModule.function['viewport.getMousePosition'] = function(){
            return viewport.mousePosition();
        };
        communicationModule.function['viewport.getBoundingBox'] = function(){
            return viewport.getBoundingBox();
        };
        communicationModule.function['viewport.stopMouseScroll'] = function(bool){
            return viewport.stopMouseScroll(bool);
        };

    //stats
        communicationModule.function['stats.active'] = function(active){
            return stats.active(active);
        };
        communicationModule.function['stats.getReport'] = function(){
            return stats.getReport();
        };

    //callback
        communicationModule.function['callback.listCallbackTypes'] = function(){
            return callback.listCallbackTypes();
        };
        communicationModule.function['callback.getCallbackTypeState'] = function(type){
            return callback.getCallbackTypeState(type);
        };
        communicationModule.function['callback.activateCallbackType'] = function(type){
            callback.activateCallbackType(type);
        };
        communicationModule.function['callback.disactivateCallbackType'] = function(type){
            callback.disactivateCallbackType(type);
        };
        communicationModule.function['callback.activateAllCallbackTypes'] = function(){
            callback.activateAllCallbackTypes();
        };
        communicationModule.function['callback.disactivateAllCallbackTypes'] = function(){
            callback.disactivateAllCallbackTypes();
        };
        communicationModule.function['callback.attachCallback'] = function(id, callbackType){
            callback.attachCallback(element.getElementFromId(id),callbackType);
        };
        communicationModule.function['callback.removeCallback'] = function(id, callbackType){
            callback.removeCallback(element.getElementFromId(id),callbackType);
        };
        callback.listCallbackTypes().forEach(callbackName => {
            //for accepting the callback signals from the window's canvas
            communicationModule.function['callback.coupling.'+callbackName] = function(event){
                callback.coupling[callbackName](event);
            };
        });

//dialing out
    const interface = new function(){
        this.go = function(){
            communicationModule.run('go');
        };
        this.printToScreen = function(imageData){
            communicationModule.run('printToScreen',[imageData],undefined,[imageData]);
        };
        this.onViewportAdjust = function(state){
            communicationModule.run('onViewportAdjust',[state]);
        };
        this.getCanvasAttributes = function(attributeNames=[],prefixActiveArray=[]){
            return new Promise((resolve, reject) => {
                communicationModule.run('getCanvasAttributes',[attributeNames,prefixActiveArray],resolve);
            });
        };
        this.setCanvasAttributes = function(attributeNames=[],values=[],prefixActiveArray=[]){
            communicationModule.run('setCanvasAttributes',[attributeNames,values,prefixActiveArray]);
        };
        this.getCanvasParentAttributes = function(attributeNames=[],prefixActiveArray=[]){
            return new Promise((resolve, reject) => {
                communicationModule.run('getCanvasParentAttributes',[attributeNames,prefixActiveArray],resolve);
            });
        };
        this.getDocumentAttributes = function(attributeNames=[]){
            return new Promise((resolve, reject) => {
                communicationModule.run('getDocumentAttributes',[attributeNames],resolve);
            });
        };
        this.setDocumentAttributes = function(attributeNames=[],values=[]){
            communicationModule.run('setDocumentAttributes',[attributeNames,values]);
        };
        this.getWindowAttributes = function(attributeNames=[]){
            return new Promise((resolve, reject) => {
                communicationModule.run('getWindowAttributes',[attributeNames],resolve);
            });
        };
        this.setWindowAttributes = function(attributeNames=[],values=[]){
            communicationModule.run('setWindowAttributes',[attributeNames,values]);
        };
    };
    callback.listCallbackTypes().forEach(callbackName => {
        //for sending core's callbacks back out
        callback.functions[callbackName] = function(x, y, event, elements){
            communicationModule.run('callback.'+callbackName,[x, y, event, elements.map(ele => element.getIdFromElement(ele))]);
        };
    });

render.refresh(() => {
    viewport.refresh();
    interface.go();
});

