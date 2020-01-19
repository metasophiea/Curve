this.detectIntersect = new function(){
    this.boundingBoxes = function(box_a, box_b){
        dev.log.math('.detectIntersect.boundingBoxes(',box_a,box_b); //#development
        dev.count('.math.detectIntersect.boundingBoxes'); //#development

        return box_a.bottomRight.y >= box_b.topLeft.y && 
            box_a.bottomRight.x >= box_b.topLeft.x && 
            box_a.topLeft.y <= box_b.bottomRight.y && 
            box_a.topLeft.x <= box_b.bottomRight.x;
    };

    this.pointWithinBoundingBox = function(point,box){
        dev.log.math('.detectIntersect.pointWithinBoundingBox(',point,box); //#development
        dev.count('.math.detectIntersect.pointWithinBoundingBox'); //#development
        return !(
            point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
            point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
        );
    };
    this.pointOnLine = function(point,line){
        dev.log.math('.detectIntersect.pointOnLine(',point,line); //#development
        dev.count('.math.detectIntersect.pointOnLine'); //#development
        
        if( 
            point.x < line[0].x && point.x < line[1].x ||
            point.y < line[0].y && point.y < line[1].y ||
            point.x > line[0].x && point.x > line[1].x ||
            point.y > line[0].y && point.y > line[1].y
        ){return false;}

        if(point.x == line[0].x && point.y == line[0].y){ return true; }
        if(point.x == line[1].x && point.y == line[1].y){ return true; }
        if(line[0].x == line[1].x && point.x == line[0].x){
            return (line[0].y > point.y && point.y > line[1].y) || (line[1].y > point.y && point.y > line[0].y);
        }
        if(line[0].y == line[1].y && point.y == line[0].y){
            return (line[0].x > point.x && point.x > line[1].x) || (line[1].x > point.x && point.x > line[0].x);
        }

        return ((line[1].y - line[0].y) / (line[1].x - line[0].x))*(point.x - line[0].x) + line[0].y - point.y == 0;
    }
    this.pointWithinPoly = function(point,poly){
        dev.log.math('.detectIntersect.pointWithinPoly(',point,poly.points); //#development
        dev.count('.math.detectIntersect.pointWithinPoly'); //#development

        if(poly.boundingBox == undefined){ poly.boundingBox = library.math.boundingBoxFromPoints(poly.points); }
        if( !library.math.detectIntersect.boundingBoxes( library.math.boundingBoxFromPoints([point]), poly.boundingBox ) ){ return 'outside'; }

        // outside / onPoint / onEdge / inside

        //check if the point is on a point of the poly; bail and return 'onPoint'
        for(let a = 0; a < poly.points.length; a++){
            if( point.x == poly.points[a].x && point.y == poly.points[a].y ){
                dev.log.math('.detectIntersect.pointWithinPoly -> point on a poly ',a,':',poly.points[a]); //#development
                return 'onPoint';
            }
        }

        function pointLevelWithPolyPointChecker(poly,point,a,b){
            dev.log.math('.detectIntersect.pointWithinPoly::pointLevelWithPolyPointChecker(',poly,point,a,b); //#development
            //only flip, if the point is not perfectly level with point a of the line 
            //or if you can prove that the a's two adjacent points are higher and lower than the matching point's level
            //(the system will come round to having this same point be point b)
            if( poly.points[a].y != point.y && poly.points[b].y != point.y ){
                return true;
            }else if(poly.points[a].y == point.y){
                dev.log.math('.detectIntersect.pointWithinPoly -> point is perfectly level with a point on the poly (line point a)'); //#development
                const pointInFront = a+1 >= poly.points.length ? 0 : a+1;
                const pointBehind = a-1 <= 0 ? poly.points.length-1 : a-1;
                if(
                    poly.points[pointBehind].y <= poly.points[a].y && poly.points[pointInFront].y <= poly.points[a].y ||
                    poly.points[pointBehind].y >= poly.points[a].y && poly.points[pointInFront].y >= poly.points[a].y
                ){
                    dev.log.math('.detectIntersect.pointWithinPoly -> all above or all below; no need for a flip'); //#development
                }else{
                    dev.log.math('.detectIntersect.pointWithinPoly -> crossing fround; time for a flip'); //#development
                    return true;
                }
            }

            return false;
        }

        //Ray casting algorithm
        let inside = false;
        for(let a = 0, b = poly.points.length - 1; a < poly.points.length; b = a++){
            dev.log.math('.detectIntersect.pointWithinPoly -> point:',point,'poly.points[a]:',poly.points[a],'poly.points[b]:',poly.points[b]); //#development

            //point must be on the same level of the line
            if( (poly.points[b].y >= point.y && poly.points[a].y <= point.y) || (poly.points[a].y >= point.y && poly.points[b].y <= point.y) ){
                //discover if the point is on the far right of the line
                if( poly.points[a].x < point.x && poly.points[b].x < point.x ){
                    dev.log.math('.detectIntersect.pointWithinPoly -> point is on far right of line'); //#development
                    //only flip if the line is not perfectly level (which would make the ray skirt the line)
                    if( poly.points[a].y != poly.points[b].y ){
                        if( pointLevelWithPolyPointChecker(poly,point,a,b) ){
                            inside = !inside;
                            dev.log.math('.detectIntersect.pointWithinPoly -> flip (',inside,')'); //#development
                        }
                    }

                //discover if the point is on the far left of the line, skip it if so
                }else if( poly.points[a].x > point.x && poly.points[b].x > point.x ){
                    dev.log.math('.detectIntersect.pointWithinPoly -> point is on far left of line'); //#development
                    continue;
                }else{
                    //calculate what side of the line this point is
                        let areaLocation;
                        if( poly.points[b].y > poly.points[a].y && poly.points[b].x > poly.points[a].x ){
                            areaLocation = (point.x-poly.points[a].x)/(poly.points[b].x-poly.points[a].x) - (point.y-poly.points[a].y)/(poly.points[b].y-poly.points[a].y) + 1;
                        }else if( poly.points[b].y <= poly.points[a].y && poly.points[b].x <= poly.points[a].x ){
                            areaLocation = (point.x-poly.points[b].x)/(poly.points[a].x-poly.points[b].x) - (point.y-poly.points[b].y)/(poly.points[a].y-poly.points[b].y) + 1;
                        }else if( poly.points[b].y > poly.points[a].y && poly.points[b].x < poly.points[a].x ){
                            areaLocation = (point.x-poly.points[b].x)/(poly.points[a].x-poly.points[b].x) + (point.y-poly.points[a].y)/(poly.points[b].y-poly.points[a].y);
                        }else if( poly.points[b].y <= poly.points[a].y && poly.points[b].x >= poly.points[a].x ){
                            areaLocation = (point.x-poly.points[a].x)/(poly.points[b].x-poly.points[a].x) + (point.y-poly.points[b].y)/(poly.points[a].y-poly.points[b].y);
                        }

                    //if its on the line, return 'onEdge' immediately, if it's above 1 do a flip
                        dev.log.math('.detectIntersect.pointWithinPoly -> areaLocation:',areaLocation); //#development
                        if( areaLocation == 1 || isNaN(areaLocation) ){
                            return 'onEdge';
                        }else if(areaLocation > 1){
                            if( pointLevelWithPolyPointChecker(poly,point,a,b) ){
                                inside = !inside;
                                dev.log.math('.detectIntersect.pointWithinPoly -> flip (',inside,')'); //#development
                            }
                        }
                }
            }else{
                dev.log.math('.detectIntersect.pointWithinPoly -> point is not on the same level as the line'); //#development
            }
        }

        dev.log.math('.detectIntersect.pointWithinPoly -> inside:',inside); //#development
        return inside ? 'inside' : 'outside';
    };

    this.lineOnLine = function(segment1,segment2){
        dev.log.math('.detectIntersect.lineOnLine(',segment1,segment2); //#development
        dev.count('.math.detectIntersect.lineOnLine'); //#development

        if( !library.math.detectIntersect.boundingBoxes( library.math.boundingBoxFromPoints(segment1), library.math.boundingBoxFromPoints(segment2) ) ){
            return {x:undefined, y:undefined, intersect:false, contact:false};
        }

        //identical segments
        if(
            (segment1[0].x == segment2[0].x && segment1[0].y == segment2[0].y) && (segment1[1].x == segment2[1].x && segment1[1].y == segment2[1].y) ||
            (segment1[0].x == segment2[1].x && segment1[0].y == segment2[1].y) && (segment1[1].x == segment2[0].x && segment1[1].y == segment2[0].y)
        ){
            dev.log.math('.detectIntersect.lineOnLine -> identical segments'); //#development
            return {x:undefined, y:undefined, intersect:false, contact:true};
        }
            
        //point on point
        if( (segment1[0].x == segment2[0].x && segment1[0].y == segment2[0].y) || (segment1[0].x == segment2[1].x && segment1[0].y == segment2[1].y) ){
            dev.log.math('.detectIntersect.lineOnLine -> point on point : segment1[0]:',segment1[0]); //#development
            return {x:segment1[0].x, y:segment1[0].y, intersect:false, contact:true};
        }
        if( (segment1[1].x == segment2[0].x && segment1[1].y == segment2[0].y) || (segment1[1].x == segment2[1].x && segment1[1].y == segment2[1].y) ){
            dev.log.math('.detectIntersect.lineOnLine -> point on point : segment1[1]:',segment1[1]); //#development
            return {x:segment1[1].x, y:segment1[1].y, intersect:false, contact:true};
        }

        //calculate denominator
        const denominator = (segment2[1].y-segment2[0].y)*(segment1[1].x-segment1[0].x) - (segment2[1].x-segment2[0].x)*(segment1[1].y-segment1[0].y);
        dev.log.math('.detectIntersect.lineOnLine -> denominator:',denominator); //#development
        if(denominator == 0){
            const points = [];
            const output = {x1:undefined, y1:undefined, x2:undefined, y2:undefined, intersect:false, contact:true};
            if( library.math.detectIntersect.pointOnLine(segment1[0],segment2) ){
                output.x1 = segment1[0].x;
                output.y1 = segment1[0].y;
            }
            if( library.math.detectIntersect.pointOnLine(segment1[1],segment2) ){
                if(output.x1 == undefined){
                    output.x1 = segment1[1].x;
                    output.y1 = segment1[1].y;
                }else{
                    output.x2 = segment1[1].x;
                    output.y2 = segment1[1].y;
                    return output;
                }
            }
            if( library.math.detectIntersect.pointOnLine(segment2[0],segment1) ){
                if(output.x1 == undefined){
                    output.x1 = segment2[0].x;
                    output.y1 = segment2[0].y;
                }else{
                    output.x2 = segment2[0].x;
                    output.y2 = segment2[0].y;
                    return output;
                }
            }
            if( library.math.detectIntersect.pointOnLine(segment2[1],segment1) ){
                if(output.x1 == undefined){
                    output.x1 = segment2[1].x;
                    output.y1 = segment2[1].y;
                }else{
                    output.x2 = segment2[1].x;
                    output.y2 = segment2[1].y;
                    return output;
                }
            }

            return output;
        }
            
        //point on line
        if( library.math.detectIntersect.pointOnLine(segment1[0],segment2) ){ return {x:segment1[0].x, y:segment1[0].y, intersect:false, contact:true}; }
        if( library.math.detectIntersect.pointOnLine(segment1[1],segment2) ){ return {x:segment1[1].x, y:segment1[1].y, intersect:false, contact:true}; }
        if( library.math.detectIntersect.pointOnLine(segment2[0],segment1) ){ return {x:segment2[0].x, y:segment2[0].y, intersect:false, contact:true}; }
        if( library.math.detectIntersect.pointOnLine(segment2[1],segment1) ){ return {x:segment2[1].x, y:segment2[1].y, intersect:false, contact:true}; }

        //produce output
        const u1 = ((segment2[1].x-segment2[0].x)*(segment1[0].y-segment2[0].y) - (segment2[1].y-segment2[0].y)*(segment1[0].x-segment2[0].x))/denominator;
        const u2 = ((segment1[1].x-segment1[0].x)*(segment1[0].y-segment2[0].y) - (segment1[1].y-segment1[0].y)*(segment1[0].x-segment2[0].x))/denominator;
        const intersect = (u1 >= 0 && u1 <= 1) && (u2 >= 0 && u2 <= 1);
        return {
            x:         (segment1[0].x + u1*(segment1[1].x-segment1[0].x)),
            y:         (segment1[0].y + u1*(segment1[1].y-segment1[0].y)),
            intersect: intersect,
            contact:   intersect,
        };
    };
    this.lineOnPoly = function(line,poly){
        dev.log.math('.detectIntersect.lineOnPoly(',line,poly); //#development
        dev.count('.math.detectIntersect.lineOnPoly'); //#development

        if(poly.boundingBox == undefined){ poly.boundingBox = library.math.boundingBoxFromPoints(poly.points); }
        if( !library.math.detectIntersect.boundingBoxes( library.math.boundingBoxFromPoints(line), poly.boundingBox ) ){
            return { points:[], intersect:false, contact:false };
        }

        function oneWhileTheOtherIs(val_1,val_2,a,b){
            if( val_1 == a && val_2 == b ){return 1;}
            if( val_2 == a && val_1 == b ){return 2;}
            return 0;
        }
        function huntForIntersection(line,polyPoints){
            dev.log.math('.detectIntersect.lineOnPoly::huntForIntersection(',line,polyPoints); //#development
            for(let a = polyPoints.length-1, b = 0; b < polyPoints.length; a = b++){
                dev.log.math('.detectIntersect.lineOnPoly::huntForIntersection -> line:',line,'polyPoints[a]:',polyPoints[a],'polyPoints[b]:',polyPoints[b]); //#development
                const result = library.math.detectIntersect.lineOnLine(line,[polyPoints[a],polyPoints[b]]);
                dev.log.math('.detectIntersect.lineOnPoly::huntForIntersection -> result:',result); //#development
                if(result.contact){
                    output.contact = true;
                    if(result.intersect){
                        output.intersect = true;
                    }

                    if( result.x != undefined && (result.x != line[0].x && result.x != line[1].x) ){
                        dev.log.math('.detectIntersect.lineOnPoly::huntForIntersection -> odd contact'); //#development
                        output.intersect = true;
                    }

                    //if the result is a range of values, add the ends of this range
                        if( result.x2 != undefined ){
                            if( output.points.find(item => item.x == result.x1 && item.y == result.y1 ) == undefined ){
                                output.points.push({x:result.x1,y:result.y1});
                            }
                            if( output.points.find(item => item.x == result.x2 && item.y == result.y2 ) == undefined ){
                                output.points.push({x:result.x2,y:result.y2});
                            }
                            break;
                        }

                    //add point, but don't add duplicate points
                        if( output.points.find(item => item.x == result.x && item.y == result.y ) == undefined ){
                            output.points.push({x:result.x,y:result.y});
                        }
                }
            }

            //situation where the line passes perfectly through a point on the poly
            dev.log.math('.detectIntersect.lineOnPoly::huntForIntersection -> output.points.length:',output.points.length); //#development
            if(output.points.length == 0){
                for(let a = 0; a < poly.points.length; a++){
                    if( poly.points[a].x != line[0].x && poly.points[a].y != line[0].y && poly.points[a].x != line[1].x && poly.points[a].y != line[1].y){
                        if( library.math.detectIntersect.pointOnLine(poly.points[a],line) ){
                            output.points.push(poly.points[a]);
                            output.intersect = true;
                        }
                    }
                }
            }
        }

        const output = { points:[], contact:false, intersect:false };
        const point_a = library.math.detectIntersect.pointWithinPoly(line[0],poly);
        const point_b = library.math.detectIntersect.pointWithinPoly(line[1],poly);
        dev.log.math('.detectIntersect.lineOnPoly -> point_a:',point_a,'point_b:',point_b); //#development

        let dir = 0;
        if( oneWhileTheOtherIs(point_a,point_b,'outside','outside') ){
            huntForIntersection(line,poly.points);
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'outside','onPoint') ){
            huntForIntersection(line,poly.points);
            // if(dir == 1){
            //     output.points.push(line[1]);
            // }else if(dir == 2){
            //     output.points.push(line[0]);
            // }
            output.contact = true;
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'outside','onEdge') ){
            huntForIntersection(line,poly.points);
            // if(dir == 1){
            //     output.points.push(line[1]);
            // }else if(dir == 2){
            //     output.points.push(line[0]);
            // }
            output.contact = true;
        }else if( oneWhileTheOtherIs(point_a,point_b,'outside','inside') ){
            huntForIntersection(line,poly.points);
            output.intersect = true;
            output.contact = true;
        }else if( oneWhileTheOtherIs(point_a,point_b,'onPoint','onPoint') ){
            output.points = [line[0],line[1]];
            output.contact = true;
            output.intersect = library.math.detectIntersect.pointWithinPoly({ x:(output.points[0].x + output.points[1].x)/2, y:(output.points[0].y + output.points[1].y)/2 }, poly) == 'inside';
        }else if( oneWhileTheOtherIs(point_a,point_b,'onPoint','onEdge') ){
            output.points = [line[0],line[1]];
            output.contact = true;
            output.intersect = library.math.detectIntersect.pointWithinPoly({ x:(output.points[0].x + output.points[1].x)/2, y:(output.points[0].y + output.points[1].y)/2 }, poly) == 'inside';
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'onPoint','inside') ){
            if(dir == 1){
                output.points.push(line[1]);
            }else if(dir == 2){
                output.points.push(line[0]);
            }
            output.contact = true;
            output.intersect = true;
        }else if( oneWhileTheOtherIs(point_a,point_b,'onEdge','onEdge') ){
            output.points = [line[0],line[1]];
            output.contact = true;
            output.intersect = library.math.detectIntersect.pointWithinPoly({ x:(output.points[0].x + output.points[1].x)/2, y:(output.points[0].y + output.points[1].y)/2 }, poly) == 'inside';
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'onEdge','inside') ){
            if(dir == 1){
                output.points.push(line[1]);
            }else if(dir == 2){
                output.points.push(line[0]);
            }
            output.contact = true;
            output.intersect = true;
        }else if( oneWhileTheOtherIs(point_a,point_b,'inside','inside') ){
            output.intersect = true;
            output.contact = false;
        }
        
        dev.log.math('.detectIntersect.lineOnPoly -> output:',output); //#development
        return output;
    };

    this.polyOnPoly = function(poly_a,poly_b){
        dev.log.math('.detectIntersect.polyOnPoly(',poly_a,poly_b); //#development
        dev.count('.math.detectIntersect.polyOnPoly'); //#development

        if(poly_a.boundingBox == undefined){ 
            dev.log.math('.detectIntersect.polyOnPoly -> poly_a boundingBox not found, generating...'); //#development
            poly_a.boundingBox = library.math.boundingBoxFromPoints(poly_a.points);
        }
        if(poly_b.boundingBox == undefined){ 
            dev.log.math('.detectIntersect.polyOnPoly -> poly_b boundingBox not found, generating...'); //#development
            poly_b.boundingBox = library.math.boundingBoxFromPoints(poly_b.points);
        }
        if( !library.math.detectIntersect.boundingBoxes( poly_a.boundingBox, poly_b.boundingBox ) ){
            dev.log.math('.detectIntersect.polyOnPoly -> boundingBox\'s are totally seperate!'); //#development
            return { points:[], intersect:false, contact:false };
        }

        dev.log.math('.detectIntersect.polyOnPoly -> boundingBox\'s do collide, proceeding with search'); //#development

        const results = {
            points:[],
            contact:false,
            intersect:false,
        };

        //identical polys
            const sudo_poly_a_points = Object.assign([],poly_a.points);
            poly_b.points.forEach(point_b => {
                const index = sudo_poly_a_points.indexOf(sudo_poly_a_points.find(point_a => point_a.x==point_b.x && point_a.y==point_b.y) );
                if(index != -1){sudo_poly_a_points.splice(index, 1);}
            });
            if(sudo_poly_a_points.length == 0){
                dev.log.math('.detectIntersect.polyOnPoly -> these two polys are exactly the same'); //#development
                return {
                    points:Object.assign([],poly_a.points),
                    contact:true,
                    intersect:true,
                };
            }
            dev.log.math('.detectIntersect.polyOnPoly -> these two polys are not exactly the same (though they do share '+(poly_a.points.length-sudo_poly_a_points.length)+' of the same points)'); //#development

        //find all side intersection points
            for(let a_a = poly_a.points.length-1, a_b = 0; a_b < poly_a.points.length; a_a = a_b++){
                dev.log.math('.detectIntersect.polyOnPoly -> testing line on poly:',[poly_a.points[a_a],poly_a.points[a_b]],poly_b); //#development
                const tmp = library.math.detectIntersect.lineOnPoly([poly_a.points[a_a],poly_a.points[a_b]],poly_b);
                dev.log.math('.detectIntersect.polyOnPoly -> lineOnPoly-results:',tmp); //#development

                results.points = results.points.concat(
                    tmp.points.filter(point => results.points.find(item => item.x == point.x && item.y == point.y ) == undefined )
                );

                results.contact = results.contact || tmp.contact;
                results.intersect = results.intersect || tmp.intersect;
            }
            dev.log.math('.detectIntersect.polyOnPoly -> results:',results); //#development
    
        //check if poly_a is totally inside poly_b (if necessary)
            for(let a = 0; a < poly_b.points.length; a++){
                if( results.intersect ){break;}
                if( library.math.detectIntersect.pointWithinPoly(poly_b.points[a],poly_a) != 'outside' ){   
                    results.intersect = true;
                }
            }

        return results;
    };
};