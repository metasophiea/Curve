this.polygonsToVisibilityGraph = function(polys){
    dev.log.math('.polygonsToVisibilityGraph(',polys); //#development
    const graph = polys.flatMap((poly,polyIndex) => {
        return poly.points.map((point,pointIndex) => ({
            polyIndex:polyIndex,
            pointIndex:pointIndex,
            destination:[ /*{index:n, polyIndex:n, pointIndex:n, distance:n} */ ],
        }))
    });

    const scannedRoutes = {};

    graph.forEach((graphPoint_source,index_source) => {
        graph.forEach((graphPoint_destination,index_destination) => {
            if(index_source == index_destination){return;}
            // if( index_source != 4 ){return;} if( index_destination != 2 ){return;}

            const route_source = graphPoint_source.polyIndex+'_'+graphPoint_source.pointIndex;
            const route_destination = graphPoint_destination.polyIndex+'_'+graphPoint_destination.pointIndex;

            //check to see if we've scanned this route before
            if( scannedRoutes[route_destination] != undefined && scannedRoutes[route_destination][route_source] != undefined ){ return; }

            //convert for convenience
            const point_source = polys[graphPoint_source.polyIndex].points[graphPoint_source.pointIndex];
            const point_destination = polys[graphPoint_destination.polyIndex].points[graphPoint_destination.pointIndex];
            dev.log.math('.polygonsToVisibilityGraph -> point_source:',point_source,'point_destination:',point_destination); //#development

            //scan route
            let addRoute = true;
            for(let a = 0; a < polys.length; a++){
                dev.log.math('.polygonsToVisibilityGraph -> testing polygon:',a,':',polys[a]); //#development
                const result = library.math.detectIntersect.lineOnPoly( [point_source,point_destination], polys[a] );
                dev.log.math('.polygonsToVisibilityGraph -> result:',result); //#development
                if( result.intersect ){
                    addRoute = false;
                    break;
                }
            }

            //if route is valid, add to graph
            dev.log.math('.polygonsToVisibilityGraph -> addRoute:',addRoute); //#development
            if(addRoute){
                const distance = library.math.distanceBetweenTwoPoints(point_source,point_destination);

                //forward route
                if(scannedRoutes[route_source] == undefined){ scannedRoutes[route_source] = {}; }
                scannedRoutes[route_source][route_destination] = {
                    index: index_destination,
                    polyIndex: graphPoint_destination.polyIndex, 
                    pointIndex: graphPoint_destination.pointIndex,
                    distance: distance,
                };
                graphPoint_source.destination.push( scannedRoutes[route_source][route_destination] );

                //backward route
                if(scannedRoutes[route_destination] == undefined){ scannedRoutes[route_destination] = {}; }
                scannedRoutes[route_destination][route_source] = {
                    index: index_source,
                    polyIndex: graphPoint_source.polyIndex, 
                    pointIndex: graphPoint_source.pointIndex,
                    distance: distance,
                };
                graphPoint_destination.destination.push( scannedRoutes[route_destination][route_source] );
            }
        });
    });

    return graph;
};