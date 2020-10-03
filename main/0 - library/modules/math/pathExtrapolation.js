this.pathExtrapolation = function(path,thickness=10,capType='none',joinType='none',loopPath=false,detail=5,sharpLimit=thickness*4,returnTriangles=true){
    dev.log.math('.pathExtrapolation(',path,thickness,capType,joinType,loopPath,detail,sharpLimit,returnTriangles);
    dev.count('.math.pathExtrapolation'); //#development

    function loopThisPath(path){
        dev.log.math('.pathExtrapolation::loopThisPath(',path);
        dev.count('.math.pathExtrapolation::loopThisPath'); //#development
    
        const joinPoint = [ (path[0]+path[2])/2, (path[1]+path[3])/2 ];
        let loopingPath = [];
    
        loopingPath = loopingPath.concat(joinPoint);
        for(let a = 2; a < path.length; a+=2){
            loopingPath = loopingPath.concat( [path[a], path[a+1]] );
        }
        loopingPath = loopingPath.concat( [path[0], path[1]] );
        loopingPath = loopingPath.concat(joinPoint);

        return loopingPath;
    }
    function calculateJointData(path,thickness){
        dev.log.math('.pathExtrapolation::calculateJointData(',path,thickness);
        dev.count('.math.pathExtrapolation::calculateJointData'); //#development
    
        const jointData = [];
        //parse path
            for(let a = 0; a < path.length/2; a++){
                jointData.push({ point:{ x:path[a*2], y:path[a*2 +1] } });
            }
        //calculation of joint data
            for(let a = 0; a < jointData.length; a++){
                //calculate segment angles    
                    if( a != jointData.length-1 ){
                        const tmp = library.math.getAngleOfTwoPoints( jointData[a].point, jointData[a+1].point );
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
        dev.log.math('.pathExtrapolation::path_to_rectangleSeries(',path,thickness);
        dev.count('.math.pathExtrapolation::path_to_rectangleSeries'); //#development
    
        let outputPoints = [];
        for(let a = 1; a < path.length/2; a++){
            const angle = library.math.getAngleOfTwoPoints( {x:path[a*2-2], y:path[a*2 -1]}, {x:path[a*2], y:path[a*2 +1]});
            const left =  library.math.cartesianAngleAdjust(thickness, 0, Math.PI/2 + angle);
            const right = { x:-left.x, y:-left.y };
    
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
        dev.log.math('.pathExtrapolation::flatJoints(',jointData,thickness); //#development
        dev.count('.math.pathExtrapolation::flatJoints'); //#development
    
        const polygons = [];

        let perpenL = library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle - Math.PI/2);
        let perpenR = {x:-perpenL.x, y:-perpenL.y};
        for(let a = 1; a < jointData.length-1; a++){
            const last_perpenL = perpenL;
            const last_perpenR = perpenR;
            perpenL = library.math.cartesianAngleAdjust(thickness, 0, jointData[a].departAngle - Math.PI/2);
            perpenR = {x:-perpenL.x, y:-perpenL.y};

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
        dev.log.math('.pathExtrapolation::roundJoints(',jointData,thickness,detail); //#development
        dev.count('.math.pathExtrapolation::roundJoints'); //#development
    
        const polygons = [];
        if(detail < 1){detail = 1;}

        let perpenL = library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle - Math.PI/2);
        let perpenR = {x:-perpenL.x, y:-perpenL.y};
        for(let a = 1; a < jointData.length-1; a++){
            const newPolygon = [];
            const last_perpenL = perpenL;
            const last_perpenR = perpenR;
            perpenL = library.math.cartesianAngleAdjust(thickness, 0, jointData[a].departAngle - Math.PI/2);
            perpenR = {x:-perpenL.x, y:-perpenL.y};

            if(jointData[a].joiningAngle == Math.PI){
                //do nothing
            }else if(jointData[a].joiningAngle < Math.PI){
                newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                newPolygon.push( {x:jointData[a].point.x + last_perpenR.x, y:jointData[a].point.y + last_perpenR.y} );

                const gapSize = Math.PI - jointData[a].joiningAngle;
                const partialDetail = Math.floor((2+detail)*(Math.abs(gapSize)/Math.PI));
                for(let b = 1; b < partialDetail; b++){
                    const angle = b*(gapSize/partialDetail);
                    const p = library.math.cartesianAngleAdjust(last_perpenR.x, last_perpenR.y, -angle);
                    newPolygon.push( {x:jointData[a].point.x + p.x, y:jointData[a].point.y + p.y} );
                }

                newPolygon.push( {x:jointData[a].point.x + perpenR.x, y:jointData[a].point.y + perpenR.y} );
            }else if(jointData[a].joiningAngle > Math.PI){
                newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                newPolygon.push( {x:jointData[a].point.x + last_perpenL.x, y:jointData[a].point.y + last_perpenL.y} );

                const gapSize = Math.PI - jointData[a].joiningAngle;
                const partialDetail = Math.floor((2+detail)*(Math.abs(gapSize)/Math.PI));
                for(let b = 1; b < partialDetail; b++){
                    const angle = b*(gapSize/partialDetail);
                    const p = library.math.cartesianAngleAdjust(last_perpenL.x, last_perpenL.y, -angle);
                    newPolygon.push( {x:jointData[a].point.x + p.x, y:jointData[a].point.y + p.y} );
                }

                newPolygon.push( {x:jointData[a].point.x + perpenL.x, y:jointData[a].point.y + perpenL.y} );
            }

            polygons.push(newPolygon);
        }

        return polygons;
    }
    function sharpJoints(jointData,thickness,sharpLimit=thickness*4){
        dev.log.math('.pathExtrapolation::sharpJoints(',jointData,thickness,sharpLimit); //#development
        dev.count('.math.pathExtrapolation::sharpJoints'); //#development
    
        const polygons = [];

        let perpenL = library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle - Math.PI/2);
        let perpenR = {x:-perpenL.x, y:-perpenL.y};
        for(let a = 1; a < jointData.length-1; a++){
            const newPolygon = [];
            const last_perpenL = perpenL;
            const last_perpenR = perpenR;
            perpenL = library.math.cartesianAngleAdjust(thickness, 0, jointData[a].departAngle - Math.PI/2);
            perpenR = {x:-perpenL.x, y:-perpenL.y};

            if(jointData[a].joiningAngle == Math.PI){
                //do nothing
            }else if(jointData[a].joiningAngle < Math.PI){
                if( Math.abs(jointData[a].wingWidth) <= sharpLimit ){
                    const plus = library.math.cartesianAngleAdjust(0, jointData[a].wingWidth, Math.PI/2 + jointData[a].wingAngle);
                    newPolygon.push( {x:plus.x + jointData[a].point.x, y:plus.y + jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenR.x, y:jointData[a].point.y + last_perpenR.y} );
                    newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenR.x, y:jointData[a].point.y + perpenR.y} );
                }else{
                    const length = Math.cos(jointData[a].joiningAngle/2)*sharpLimit;
                    const partialWingA = library.math.cartesianAngleAdjust(0, -length, Math.PI/2 + jointData[a].implementAngle);
                    const partialWingB = library.math.cartesianAngleAdjust(0, length, Math.PI/2 + jointData[a].departAngle);

                    newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenR.x, y:jointData[a].point.y + last_perpenR.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenR.x + partialWingA.x, y:jointData[a].point.y + last_perpenR.y + partialWingA.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenR.x + partialWingB.x, y:jointData[a].point.y + perpenR.y + partialWingB.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenR.x, y:jointData[a].point.y + perpenR.y} );
                }
            }else if(jointData[a].joiningAngle > Math.PI){
                if( Math.abs(jointData[a].wingWidth) <= sharpLimit ){
                    const plus = library.math.cartesianAngleAdjust(0, -jointData[a].wingWidth, Math.PI/2 + jointData[a].wingAngle);
                    newPolygon.push( {x:plus.x + jointData[a].point.x, y:plus.y + jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + last_perpenL.x, y:jointData[a].point.y + last_perpenL.y} );
                    newPolygon.push( {x:jointData[a].point.x, y:jointData[a].point.y} );
                    newPolygon.push( {x:jointData[a].point.x + perpenL.x, y:jointData[a].point.y + perpenL.y} );
                }else{
                    const length = Math.cos(jointData[a].joiningAngle/2)*sharpLimit;
                    const partialWingA = library.math.cartesianAngleAdjust(0, length, Math.PI/2 + jointData[a].implementAngle);
                    const partialWingB = library.math.cartesianAngleAdjust(0, -length, Math.PI/2 + jointData[a].departAngle);

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
        dev.log.math('.pathExtrapolation::roundCaps(',jointData,thickness,detail); //#development
        dev.count('.math.pathExtrapolation::roundCaps'); //#development
    
        if(detail < 1){detail = 1;}

        const polygons = [];

        //top
            const newPolygon_top = [];
            newPolygon_top.push( { x:jointData[0].point.x, y:jointData[0].point.y } );
            for(let a = 0; a < detail+1; a++){
                const p = library.math.cartesianAngleAdjust(thickness, 0, jointData[0].departAngle + Math.PI/2 + (a/(detail))*(Math.PI) );
                newPolygon_top.push( {x:jointData[0].point.x + p.x, y:jointData[0].point.y + p.y} );
            }
            polygons.push(newPolygon_top);
        //bottom
            const newPolygon_bottom = [];
            newPolygon_bottom.push( { x:jointData[jointData.length-1].point.x, y:jointData[jointData.length-1].point.y } );
            for(let a = 0; a < detail+1; a++){
                const p = library.math.cartesianAngleAdjust(thickness, 0, jointData[jointData.length-1].implementAngle - Math.PI/2 + (a/(detail))*(Math.PI) );
                newPolygon_bottom.push( {x:jointData[jointData.length-1].point.x + p.x, y:jointData[jointData.length-1].point.y + p.y} );
            }
            polygons.push(newPolygon_bottom);

        return polygons;
    }


    if(loopPath){path = loopThisPath(path);}
    const jointData = calculateJointData(path,thickness);
    if(jointData.length == 0){return [];}

    //generate polygons
        let polygons = path_to_rectangleSeries(path,thickness);
        //joints
        if(joinType == 'flat'){ polygons = polygons.concat(flatJoints(jointData,thickness)); }
        if(joinType == 'round'){ polygons = polygons.concat(roundJoints(jointData,thickness,detail)); }
        if(joinType == 'sharp'){ polygons = polygons.concat(sharpJoints(jointData,thickness,sharpLimit)); }
        //caps
        if(capType == 'round'){ polygons = polygons.concat(roundCaps(jointData,thickness,detail)); }

    //union all polygons, convert to triangles and return
        if(returnTriangles){
            return library.math.polygonToSubTriangles( polygons.map(a=>[a]).reduce((conglomerate,polygon) => library.math.unionPolygons(conglomerate, polygon) ) );
        } else {
            let tmp = polygons.map(a=>[a]).reduce((conglomerate,polygon) => library.math.unionPolygons(conglomerate, polygon));
            tmp = tmp.map( points => points.map(point => [point.x,point.y]).flat() );
            return tmp;
        }
};