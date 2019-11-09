const library = {
    math:{
        averageArray: function(array){
            dev.log.library('math','.averageArray('+JSON.stringify(array)+')'); //#development
            // return array.reduce( ( p, c ) => p + c, 0 ) / array.length
        
            //this seems to be a little faster
            let sum = array[0];
            for(let a = 1; a < array.length; a++){ sum += array[a]; }
            return sum/array.length;
        },
        cartesianAngleAdjust: function(x,y,angle){
            dev.log.library('math','.cartesianAngleAdjust('+x+','+y+','+angle+')'); //#development
            if(angle == 0){ return {x:x,y:y}; }
            return { x:x*Math.cos(angle) - y*Math.sin(angle), y:y*Math.cos(angle) + x*Math.sin(angle) };
        },
        boundingBoxFromPoints: function(points){
            dev.log.library('math','.boundingBoxFromPoints('+JSON.stringify(points)+')'); //#development
            if(points.length == 0){
                return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
            }
        
            let left = points[0].x; let right = points[0].x;
            let top = points[0].y;  let bottom = points[0].y;
        
            for(let a = 1; a < points.length; a++){
                if( points[a].x < left ){ left = points[a].x; }
                else if(points[a].x > right){ right = points[a].x; }
        
                if( points[a].y < top ){ top = points[a].y; }
                else if(points[a].y > bottom){ bottom = points[a].y; }
            }
        
            return {
                topLeft:{x:left,y:top},
                bottomRight:{x:right,y:bottom}
            };
        },
        detectOverlap: new function(){
            const detectOverlap = this;
        
            this.boundingBoxes = function(a, b){
                dev.log.library('math','.detectOverlap.boundingBoxes('+JSON.stringify(a)+','+JSON.stringify(b)+')'); //#development
                return a.bottomRight.y >= b.topLeft.y && 
                    a.bottomRight.x >= b.topLeft.x && 
                    a.topLeft.y <= b.bottomRight.y && 
                    a.topLeft.x <= b.bottomRight.x;
            };
            this.pointWithinBoundingBox = function(point,box){
                dev.log.library('math','.detectOverlap.pointWithinBoundingBox('+JSON.stringify(point)+','+JSON.stringify(box)+')'); //#development
                return !(
                    point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
                    point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
                );
            };
            this.pointWithinPoly = function(point,points){
                dev.log.library('math','.detectOverlap.pointWithinPoly('+JSON.stringify(point)+','+JSON.stringify(points)+')'); //#development
                //Ray casting algorithm
        
                let inside = false;
                for(let a = 0, b = points.length - 1; a < points.length; b = a++){
                    //if the point is on a point of the poly; bail and return true
                    if( point.x == points[a].x && point.y == points[a].y ){ return true; }
        
                    //point must be on the same level of the line
                    if( (points[b].y >= point.y && points[a].y <= point.y) || (points[a].y >= point.y && points[b].y <= point.y) ){
                        //discover if the point is on the far right of the line
                        if( points[a].x < point.x && points[b].x < point.x ){
                            inside = !inside;
                        }else{
                            //calculate what side of the line this point is
                                let areaLocation = 0;
                                if( points[b].y > points[a].y && points[b].x > points[a].x ){
                                    areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) - (point.y-points[a].y)/(points[b].y-points[a].y) + 1;
                                }else if( points[b].y <= points[a].y && points[b].x <= points[a].x ){
                                    areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) - (point.y-points[b].y)/(points[a].y-points[b].y) + 1;
                                }else if( points[b].y > points[a].y && points[b].x < points[a].x ){
                                    areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) + (point.y-points[a].y)/(points[b].y-points[a].y);
                                }else if( points[b].y <= points[a].y && points[b].x >= points[a].x ){
                                    areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) + (point.y-points[b].y)/(points[a].y-points[b].y);
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
                dev.log.library('math','.detectOverlap.lineSegments('+JSON.stringify(segment1)+','+JSON.stringify(segment2)+')'); //#development
                const denominator = (segment2[1].y-segment2[0].y)*(segment1[1].x-segment1[0].x) - (segment2[1].x-segment2[0].x)*(segment1[1].y-segment1[0].y);
                if(denominator == 0){return null;}
        
                const u1 = ((segment2[1].x-segment2[0].x)*(segment1[0].y-segment2[0].y) - (segment2[1].y-segment2[0].y)*(segment1[0].x-segment2[0].x))/denominator;
                const u2 = ((segment1[1].x-segment1[0].x)*(segment1[0].y-segment2[0].y) - (segment1[1].y-segment1[0].y)*(segment1[0].x-segment2[0].x))/denominator;
                return {
                    'x':      (segment1[0].x + u1*(segment1[1].x-segment1[0].x)),
                    'y':      (segment1[0].y + u1*(segment1[1].y-segment1[0].y)),
                    'inSeg1': (u1 >= 0 && u1 <= 1),
                    'inSeg2': (u2 >= 0 && u2 <= 1)
                };
            };
            this.overlappingPolygons = function(points_a,points_b){
                dev.log.library('math','.detectOverlap.overlappingPolygons('+JSON.stringify(points_a)+','+JSON.stringify(points_b)+')'); //#development
                //a point from A is in B
                    for(let a = 0; a < points_a.length; a++){
                        if(detectOverlap.pointWithinPoly(points_a[a],points_b)){ return true; }
                    }
        
                //a point from B is in A
                    for(let a = 0; a < points_b.length; a++){
                        if(detectOverlap.pointWithinPoly(points_b[a],points_a)){ return true; }
                    }
        
                //side intersection
                    const a_indexing = Array.apply(null, {length: points_a.length}).map(Number.call, Number).concat([0]);
                    const b_indexing = Array.apply(null, {length: points_b.length}).map(Number.call, Number).concat([0]);
        
                    for(let a = 0; a < a_indexing.length-1; a++){
                        for(let b = 0; b < b_indexing.length-1; b++){
                            const tmp = detectOverlap.lineSegments( 
                                [ points_a[a_indexing[a]], points_a[a_indexing[a+1]] ],
                                [ points_b[b_indexing[b]], points_b[b_indexing[b+1]] ]
                            );
                            if( tmp != null && tmp.inSeg1 && tmp.inSeg2 ){return true;}
                        }
                    }
        
                return false;
            };
            this.overlappingPolygonWithPolygons = function(poly,polys){ 
                dev.log.library('math','.detectOverlap.overlappingPolygonWithPolygons('+JSON.stringify(poly)+','+JSON.stringify(polys)+')'); //#development
                for(let a = 0; a < polys.length; a++){
                    if(detectOverlap.boundingBoxes(poly.boundingBox, polys[a].boundingBox)){
                        if(detectOverlap.overlappingPolygons(poly.points, polys[a].points)){
                            return true;
                        }
                    }
                }
                return false;
            };
        
            function overlappingLineWithPolygon(line,poly){
                dev.log.library('math','.detectOverlap::overlappingLineWithPolygon('+JSON.stringify(line)+','+JSON.stringify(poly)+')'); //#development
                //go through every side of the poly, and if one of them collides with the line, return true
                for(let a = poly.points.length-1, b = 0; b < poly.points.length; a = b++){
                    const tmp = library.math.detectOverlap.lineSegments(
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
                dev.log.library('math','.detectOverlap.overlappingLineWithPolygons('+JSON.stringify(line)+','+JSON.stringify(polys)+')'); //#development
                //generate a bounding box for the line
                    const line_boundingBox = { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
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
                    const collidingPolyIndexes = [];
                    polys.forEach((poly,index) => {
                        if( !library.math.detectOverlap.boundingBoxes(line_boundingBox,poly.boundingBox) ){return;}
                        if( overlappingLineWithPolygon(line,poly) ){ collidingPolyIndexes.push(index); }
                    });
        
                return collidingPolyIndexes;
            };
        },
        getDifferenceOfArrays: function(array_a,array_b){
            dev.log.library('math','.getDifferenceOfArrays('+array_a+','+array_b+')'); //#development
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
        },
    },
    glsl:{
        geometry:`
            #define PI 3.141592653589793

            vec2 cartesian2polar(vec2 xy){
                float dis = pow(pow(xy.x,2.0)+pow(xy.y,2.0),0.5);
                float ang = 0.0;

                if(xy.x == 0.0){
                    if(xy.y == 0.0){ang = 0.0;}
                    else if(xy.y > 0.0){ang = 0.5*PI;}
                    else{ang = 1.5*PI;}
                }
                else if(xy.y == 0.0){
                    if(xy.x >= 0.0){ang = 0.0;}else{ang = PI;}
                }
                else if(xy.x >= 0.0){ ang = atan(xy.y/xy.x); }
                else{ /*if(xy.x < 0.0)*/ ang = atan(xy.y/xy.x) + PI; }

                return vec2(ang,dis);
            }
            vec2 polar2cartesian(vec2 ad){
                return vec2( ad[1]*cos(ad[0]), ad[1]*sin(ad[0]) );
            }
            vec2 cartesianAngleAdjust(vec2 xy, float angle){
                if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }
                return vec2( xy.x*cos(angle) - xy.y*sin(angle), xy.y*cos(angle) + xy.x*sin(angle) ); 
            }
        `,
    },
};