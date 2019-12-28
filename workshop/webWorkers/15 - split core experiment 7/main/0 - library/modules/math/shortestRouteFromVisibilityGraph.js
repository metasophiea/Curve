this.shortestRouteFromVisibilityGraph = function(visibilityGraph,start,end){
    dev.log.math('.shortestRouteFromVisibilityGraph(',visibilityGraph,start,end); //#development

    //set the 'current' location as the start
        let current = start;

    //if in a cruel twist of fate, the ending location is the starting location;
    //create a new starting location with all the same data, and set that as
    //the 'current' location
        if(start == end){
            visibilityGraph['_'+start] = JSON.parse(JSON.stringify(visibilityGraph[start]));
            current = '_'+start;
        }

    //generate the location set
    //(don't forget to set the current location's distance to zero)
        const locationSet = Object.keys(visibilityGraph).map( () => ({ distance:Infinity, visited:false, route:'' }) );
        locationSet[current].distance = 0;
        dev.log.math('.shortestRouteFromVisibilityGraph ->',locationSet); //#development

    //loop through locations, until the end location has been visited
        do{
            //update unvisited distance values
                for(let a = 0; a < visibilityGraph[current].destination.length; a++){
                    if( locationSet[visibilityGraph[current].destination[a].index].visited ){
                        continue;
                    }

                    //only update the value if this new value is smaller than the one it already has
                    const newValue = locationSet[current].distance + visibilityGraph[current].destination[a].distance;
                    if( newValue < locationSet[visibilityGraph[current].destination[a].index].distance ){
                        locationSet[visibilityGraph[current].destination[a].index].route = current;
                        locationSet[visibilityGraph[current].destination[a].index].distance = newValue;
                    }
                }

            //mark current location as visited
                locationSet[current].visited = true;

            //find location with smallest distance value - that is unvisited - and set it as the current
                let smallest = Infinity;
                Object.keys(locationSet).forEach(location => {
                    if(!locationSet[location].visited && locationSet[location].distance < smallest ){
                        smallest = locationSet[location].distance;
                        current = location;
                    }
                });
        }while( !locationSet[end].visited )
        dev.log.math('.shortestRouteFromVisibilityGraph ->',locationSet); //#development
    
    //go back through the location set to discover the shortest route
        let route = [];
        current = end;
        while(current != start){
            route.unshift(parseInt(current));
            current = locationSet[current].route;
        }
        route.unshift(parseInt(current));

    return route;
};