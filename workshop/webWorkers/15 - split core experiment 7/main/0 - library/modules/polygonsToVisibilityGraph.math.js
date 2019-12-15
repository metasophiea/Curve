this.polygonsToVisibilityGraph = function(polys){
    const graph = polys.flatMap((poly,polyIndex) => {
        return poly.points.map((point,pointIndex) => ({
            polyIndex:polyIndex,
            pointIndex:pointIndex,
            destination:[ /*{polyIndex:n, pointIndex:n, distance:n} */ ],
        }))
    });

    graph.forEach((graphPoint_source,index_source) => {
        graph.forEach((graphPoint_destination,index_destination) => {
            if(index_source == index_destination){return;}
                const point_source = polys[graphPoint_source.polyIndex].points[graphPoint_source.pointIndex];
                const point_destination = polys[graphPoint_destination.polyIndex].points[graphPoint_destination.pointIndex];

                let addLine = true;
                for(let a = 0; a < polys.length; a++){
                    if( this.detectIntersect.lineOnPoly( [point_source,point_destination], polys[a].points ).intersect ){
                        addLine = false;
                        break;
                    }
                }

                if(addLine){
                    graphPoint_source.destination.push({
                        polyIndex:graphPoint_destination.polyIndex,
                        pointIndex:graphPoint_destination.pointIndex,
                        distance:this.distanceBetweenTwoPoints(point_source,point_destination),
                    });
                }
        });
    });

    return graph;
};