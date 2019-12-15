this.detectIntersect = new function(){
    this.boundingBoxes = function(box_a, box_b){
        return box_a.bottomRight.y >= box_b.topLeft.y && 
            box_a.bottomRight.x >= box_b.topLeft.x && 
            box_a.topLeft.y <= box_b.bottomRight.y && 
            box_a.topLeft.x <= box_b.bottomRight.x;
    };

    this.pointWithinBoundingBox = function(point,box){
        return !(
            point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
            point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
        );
    };
    this.pointOnLine = function(point,line){
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
    this.pointWithinPoly = function(point,points){
        // outside / onPoint / onEdge / inside

        //Ray casting algorithm
        let inside = false;
        for(let a = 0, b = points.length - 1; a < points.length; b = a++){

            //if the point is on a point of the poly; bail and return 'onPoint'
            if( point.x == points[a].x && point.y == points[a].y ){ return 'onPoint'; }

            //point must be on the same level of the line
            if( (points[b].y >= point.y && points[a].y <= point.y) || (points[a].y >= point.y && points[b].y <= point.y) ){
                //discover if the point is on the far right of the line
                // console.log( points[a].x, points[b].x, point.x );
                if( points[a].x < point.x && points[b].x < point.x ){
                    inside = !inside;
                //discover if the point is on the far left of the line, skip it if so
                }else if( points[a].x > point.x && points[b].x > point.x ){
                    continue;
                }else{
                    //calculate what side of the line this point is
                        let areaLocation;
                        if( points[b].y > points[a].y && points[b].x > points[a].x ){
                            areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) - (point.y-points[a].y)/(points[b].y-points[a].y) + 1;
                        }else if( points[b].y <= points[a].y && points[b].x <= points[a].x ){
                            areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) - (point.y-points[b].y)/(points[a].y-points[b].y) + 1;
                        }else if( points[b].y > points[a].y && points[b].x < points[a].x ){
                            areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) + (point.y-points[a].y)/(points[b].y-points[a].y);
                        }else if( points[b].y <= points[a].y && points[b].x >= points[a].x ){
                            areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) + (point.y-points[b].y)/(points[a].y-points[b].y);
                        }

                    //if its on the line, return 'onEdge' immediately, if it's just above 1 do a flip
                        if( areaLocation == 1 || isNaN(areaLocation) ){
                            return 'onEdge';
                        }else if(areaLocation > 1){
                            inside = !inside;
                        }
                }
            }
        }
        return inside ? 'inside' : 'outside';
    };

    this.lineOnLine = function(segment1,segment2){
        //identical segments
            if(
                (segment1[0].x == segment2[0].x && segment1[0].y == segment2[0].y) && (segment1[1].x == segment2[1].x && segment1[1].y == segment2[1].y) ||
                (segment1[0].x == segment2[1].x && segment1[0].y == segment2[1].y) && (segment1[1].x == segment2[0].x && segment1[1].y == segment2[0].y)
            ){
                return {x:undefined, y:undefined, intersect:false, contact:true};
            }
            
        //point on point
            if( (segment1[0].x == segment2[0].x && segment1[0].y == segment2[0].y) || (segment1[0].x == segment2[1].x && segment1[0].y == segment2[1].y) ){
                return {x:segment1[0].x, y:segment1[0].y, intersect:false, contact:true};
            }
            if( (segment1[1].x == segment2[0].x && segment1[1].y == segment2[0].y) || (segment1[1].x == segment2[1].x && segment1[1].y == segment2[1].y) ){
                return {x:segment1[1].x, y:segment1[1].y, intersect:false, contact:true};
            }

        const denominator = (segment2[1].y-segment2[0].y)*(segment1[1].x-segment1[0].x) - (segment2[1].x-segment2[0].x)*(segment1[1].y-segment1[0].y);
        if(denominator == 0){
            return {x:undefined, y:undefined, intersect:false, contact:false};
        }
            
        //point on line
            if( this.pointOnLine(segment1[0],segment2) ){ return {x:segment1[0].x, y:segment1[0].y, intersect:false, contact:true}; }
            if( this.pointOnLine(segment1[1],segment2) ){ return {x:segment1[1].x, y:segment1[1].y, intersect:false, contact:true}; }
            if( this.pointOnLine(segment2[0],segment1) ){ return {x:segment2[0].x, y:segment2[0].y, intersect:false, contact:true}; }
            if( this.pointOnLine(segment2[1],segment1) ){ return {x:segment2[1].x, y:segment2[1].y, intersect:false, contact:true}; }

        const u1 = ((segment2[1].x-segment2[0].x)*(segment1[0].y-segment2[0].y) - (segment2[1].y-segment2[0].y)*(segment1[0].x-segment2[0].x))/denominator;
        const u2 = ((segment1[1].x-segment1[0].x)*(segment1[0].y-segment2[0].y) - (segment1[1].y-segment1[0].y)*(segment1[0].x-segment2[0].x))/denominator;
        return {
            x:         (segment1[0].x + u1*(segment1[1].x-segment1[0].x)),
            y:         (segment1[0].y + u1*(segment1[1].y-segment1[0].y)),
            intersect: (u1 >= 0 && u1 <= 1) && (u2 >= 0 && u2 <= 1),
            contact:   (u1 >= 0 && u1 <= 1) && (u2 >= 0 && u2 <= 1),
        };
    };
    this.lineOnPoly  = function(line,poly){
        const output = {
            points:[],
            contact:false,
            intersect:false,
        };

        const point_a = this.pointWithinPoly(line[0],poly);
        const point_b = this.pointWithinPoly(line[1],poly);
        // outside / onPoint / onEdge / inside

        function oneWhileTheOtherIs(val_1,val_2,a,b){
            if( val_1 == a && val_2 == b ){return 1;}
            if( val_2 == a && val_1 == b ){return 2;}
            return 0;
        }

        let dir = 0;
        if( dir = oneWhileTheOtherIs(point_a,point_b,'outside','outside') ){
            //go through every side of the poly looking for intersections
                for(let a = poly.length-1, b = 0; b < poly.length; a = b++){
                    const result = this.lineOnLine(line,[poly[a],poly[b]]);
                    if(result.intersect){
                        output.points.push({x:result.x,y:result.y});
                        output.intersect = true;
                        output.contact = true;
                    }
                }
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'outside','onPoint') ){
            //go through every side of the poly looking for intersections
                for(let a = poly.length-1, b = 0; b < poly.length; a = b++){
                    const result = this.lineOnLine(line,[poly[a],poly[b]]);
                    if(result.intersect){
                        output.points.push({x:result.x,y:result.y});
                        output.intersect = true;
                        output.contact = true;
                    }
                }
            output.points.push(line[dir]);
            output.contact = true;
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'outside','onEdge') ){
            //go through every side of the poly looking for intersections
                for(let a = poly.length-1, b = 0; b < poly.length; a = b++){
                    const result = this.lineOnLine(line,[poly[a],poly[b]]);
                    if(result.intersect){
                        output.points.push({x:result.x,y:result.y});
                        output.intersect = true;
                        output.contact = true;
                    }
                }
            output.points.push(line[dir]);
            output.contact = true;
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'outside','inside') ){
            //go through every side of the poly looking for intersections
                for(let a = poly.length-1, b = 0; b < poly.length; a = b++){
                    const result = this.lineOnLine(line,[poly[a],poly[b]]);
                    if(result.intersect){
                        output.points.push({x:result.x,y:result.y});
                        output.intersect = true;
                    }
                }
                if(output.points.length == 0){
                    for(let a = 0; a < poly.length; a++){
                        if( this.pointOnLine(poly[a],line) ){
                            output.points.push(poly[a]);
                            output.intersect = true;
                        }
                    }
                }

            output.intersect = true;
            output.contact = true;

        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'onPoint','onPoint') ){
            output.points = [line[0],line[1]];
            output.contact = true;
            output.intersect = this.pointWithinPoly({ x:(output.points[0].x + output.points[1].x)/2, y:(output.points[0].y + output.points[1].y)/2 }, poly) == 'inside';
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'onPoint','onEdge') ){
            output.points = [line[0],line[1]];
            output.contact = true;
            output.intersect = this.pointWithinPoly({ x:(output.points[0].x + output.points[1].x)/2, y:(output.points[0].y + output.points[1].y)/2 }, poly) == 'inside';
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'onPoint','inside') ){
            output.points = [line[dir]];
            output.contact = true;
            output.intersect = true;

        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'onEdge','onEdge') ){
            output.points = [line[0],line[1]];
            output.contact = true;
            output.intersect = this.pointWithinPoly({ x:(output.points[0].x + output.points[1].x)/2, y:(output.points[0].y + output.points[1].y)/2 }, poly) == 'inside';
        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'onEdge','inside') ){
            output.points = [line[dir]];
            output.contact = true;
            output.intersect = true;

        }else if( dir = oneWhileTheOtherIs(point_a,point_b,'inside','inside') ){
            output.intersect = true;
            output.contact = false;
        }
        
        return output;
    };

    this.polyOnPoly = function(poly_a,poly_b){
        const results = {
            points:[],
            contact:false,
            intersect:false,
        };

        //identical polys
            const sudo_poly_a = Object.assign([],poly_a);
            poly_b.forEach(point_b => {
                const index = sudo_poly_a.indexOf(sudo_poly_a.find(point_a => point_a.x==point_b.x && point_a.y==point_b.y) );
                if(index != -1){sudo_poly_a.splice(index, 1);}
            });
            if(sudo_poly_a.length == 0){
                return {
                    points:Object.assign([],poly_a),
                    contact:true,
                    intersect:true,
                };
            }

        for(let a_a = poly_a.length-1, a_b = 0; a_b < poly_a.length; a_a = a_b++){
            const tmp = this.lineOnPoly([poly_a[a_a],poly_a[a_b]],poly_b);
            results.points = results.points.concat(tmp.points);
            results.contact = results.contact || tmp.contact;
            results.intersect = results.intersect || tmp.intersect;
        }
        for(let b_a = poly_b.length-1, b_b = 0; b_b < poly_b.length; b_a = b_b++){
            const tmp = this.lineOnPoly([poly_b[b_a],poly_b[b_b]],poly_a);
            results.points = results.points.concat(tmp.points);
            results.contact = results.contact || tmp.contact;
            results.intersect = results.intersect || tmp.intersect;
        }
        results.points = results.points.filter((point, index, self) =>
            index == self.findIndex((t) => t.x == point.x && t.y == point.y )
        );

        return results;
    };
};