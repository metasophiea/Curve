this.fitPolyIn = function(freshPoly,environmentPolys,snapping={active:false,x:10,y:10,angle:Math.PI/8},returnPathData=false){
    dev.log.math('.fitPolyIn(',freshPoly,environmentPolys,snapping);
    dev.count('.math.fitPolyIn'); //#development

    function applyOffsetToPoints(offset,points){
        dev.log.math('.fitPolyIn::applyOffsetToPoints(',offset,points); //#development
        dev.count('.math.fitPolyIn::applyOffsetToPoints'); //#development
    
        return points.map(a => { return{x:a.x+offset.x,y:a.y+offset.y} } );
    };
    function applyOffsetToPolygon(offset,poly){
        dev.log.math('.fitPolyIn::applyOffsetToPolygon(',offset,poly); //#development
        dev.count('.math.fitPolyIn::applyOffsetToPolygon'); //#development
    
        const newPolygon = { points: applyOffsetToPoints(offset,poly.points), boundingBox:{} };
        newPolygon.boundingBox = library.math.boundingBoxFromPoints(newPolygon.points);
        return newPolygon;
    };
    function polyOnPolys(polygon,environmentPolys){
        for(let a = 0; a < environmentPolys.length; a++){
            if(library.math.detectIntersect.polyOnPoly(polygon,environmentPolys[a]).intersect){
                return true;
            }
        }
        return false;
    }

    

    let offset = {x:0,y:0};
    const paths = [[],[],[]];

    //get the middle ("average") point of freshPoly
        const middlePoint = library.math.averagePoint(freshPoly.points);

    //circle out to find initial offsets
        let successfulOffsets = [];
        let stepCount = 1;
        {
            const maxIterationCount = 100;

            for(stepCount = 1; stepCount < maxIterationCount+1; stepCount++){
                successfulOffsets = [];
                const stepsInThisCircle = 2*stepCount + 1;
                const circularStepSizeInRad = (2*Math.PI) / stepsInThisCircle;
                const radius = Math.pow(stepCount,2);
                
                //head round the circle, testing each point as an offset
                    for(let a = 0; a < stepsInThisCircle; a++){
                        //calculate the current offset
                            const tmpOffset = library.math.polar2cartesian( circularStepSizeInRad*a, radius );
                            tmpOffset.x = snapping.active ? Math.round(tmpOffset.x/snapping.x)*snapping.x : tmpOffset.x;
                            tmpOffset.y = snapping.active ? Math.round(tmpOffset.y/snapping.y)*snapping.y : tmpOffset.y;

                            if(dev){paths[0].push( {x:tmpOffset.x+middlePoint.x, y:tmpOffset.y+middlePoint.y} );}
                        
                        //if offsetting the shape in this way results in no collision; save this offset in 'successfulOffsets'
                            if(!polyOnPolys(applyOffsetToPolygon(tmpOffset,freshPoly),environmentPolys)){
                                successfulOffsets.push( {ang:circularStepSizeInRad*a, dis:radius} );
                            }
                    }

                //if on this circle we've found at least one possible location; break out of this section and move on to the next
                    if( successfulOffsets.length != 0 ){break;}
            }
        }


    //use midpointing from these points to find the single closest circular offset
        let successfulOffset;
        {
            const maxIterationCount = 10;
            if(successfulOffsets.length == 1){
                successfulOffset = successfulOffsets[0];
            }else{
                //there was more than one possible offset for this radius, so we need to edge each of them closer
                //to the original point, to whittle them down to the one angle that can provide the smallest radius

                let maxRadius = Math.pow(stepCount,2);
                let minRadius = Math.pow(stepCount-1,2);

                const provenFunctionalOffsets = [];
                for(let i = 0; i < maxIterationCount; i++){
                    const tmp_successfulOffsets = [];
                    const midRadius = (maxRadius - minRadius)/2 + minRadius;

                    //check this new midpoint radius with the successfulOffset values 
                        for(let a = 0; a < successfulOffsets.length; a++){
                            //calculate the current offset using the midpoint value
                                const tmpOffset = library.math.polar2cartesian( successfulOffsets[a].ang, midRadius );
                                tmpOffset.x = snapping.active ? Math.round(tmpOffset.x/snapping.x)*snapping.x : tmpOffset.x;
                                tmpOffset.y = snapping.active ? Math.round(tmpOffset.y/snapping.y)*snapping.y : tmpOffset.y;
                                if(dev){paths[1].push( {x:tmpOffset.x+middlePoint.x, y:tmpOffset.y+middlePoint.y} );}
                                        
                            //if offsetting the shape in this way results in no collision; save this offset in 'tmp_successfulOffsets'
                                if(!polyOnPolys(applyOffsetToPolygon(tmpOffset,freshPoly),environmentPolys)){
                                    tmp_successfulOffsets.push( {ang:successfulOffsets[a].ang, dis:midRadius} );
                                    provenFunctionalOffsets.push( {ang:successfulOffsets[a].ang, dis:midRadius} );
                                }
                        }

                    //check if there's only one offset left
                        if( tmp_successfulOffsets.length == 1 ){ successfulOffset = tmp_successfulOffsets[0]; break; }

                    //decide whether to check further out or closer in
                        if( tmp_successfulOffsets.length == 0 ){
                            minRadius = midRadius; //somewhere further out
                        }else{
                            maxRadius = midRadius; //somewhere further in
                        }
                }

                //if everything goes wrong with the midpoint method; and we end up with no offsets, use whatever the last proven functional offset was
                    if(successfulOffset == undefined){ successfulOffset = provenFunctionalOffsets.pop(); }
            }
        }

    //adjust along x and y to find the closest offset
        {
            const maxIterationCount = 10;

            offset = library.math.polar2cartesian( successfulOffset.ang, successfulOffset.dis );
            if(dev){paths[2].push( {x:offset.x+middlePoint.x, y:offset.y+middlePoint.y} );}
            const max = {x:offset.x, y:offset.y};
            const min = {x:0, y:0};
            
            //use midpoint methods to edge the shape (over x and y) to as close as it can be to the original point
                for(let i = 0; i < maxIterationCount; i++){
                    const midpoint = { x:(max.x-min.x)/2 + min.x, y:(max.y-min.y)/2 + min.y };
                    midpoint.x = snapping.active ? Math.round(midpoint.x/snapping.x)*snapping.x : midpoint.x;
                    midpoint.y = snapping.active ? Math.round(midpoint.y/snapping.y)*snapping.y : midpoint.y;

                    //can you make a x movement? you can? then do it
                        if(dev){paths[2].push( {x:midpoint.x+middlePoint.x, y:max.y+middlePoint.y} );}
                        if(!polyOnPolys(applyOffsetToPolygon({x:midpoint.x, y:max.y},freshPoly),environmentPolys)){
                            max.x = midpoint.x; //too far
                        }else{ 
                            min.x = midpoint.x; //too close
                        }

                    //can you make a y movement? you can? then do it
                        if(dev){paths[2].push( {x:max.x+middlePoint.x, y:midpoint.y+middlePoint.y} );}
                        if(!polyOnPolys(applyOffsetToPolygon({x:max.x, y:midpoint.y},freshPoly),environmentPolys)){
                            max.y = midpoint.y; //too far
                        }else{
                            min.y = midpoint.y; //too close
                        }
                }

            offset = {x:max.x, y:max.y};
        }

    return returnPathData ? {offset:offset,paths:paths} : offset;
};