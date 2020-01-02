this.cable2 = function(
    name='cable2', 
    x1=0, y1=0, x2=0, y2=0, a1=0, a2=0,
    dimStyle={r:1,g:0,b:0,a:1},
    glowStyle={r:1,g:0.39,b:0.39,a:1},
){
    dev.log.partDynamic('.cable2(...)');  //#development

    const push = 20;

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name);
        //cable shape
            const pathShape = interfacePart.builder('basic','path','cable',{ points:[x1,y1,x2,y2], colour:dimStyle, thickness:5 });
            object.append(pathShape);
    
    //controls
        object.activate = function(){ pathShape.colour(glowStyle); };
        object.deactivate = function(){ pathShape.colour(dimStyle); };
        object.draw = function(new_x1,new_y1,new_x2,new_y2,new_angle1,new_angle2,avoidUnits=true,generateVisibilityGraph=true){
            x1 = new_x1==undefined ? x1 : new_x1;
            y1 = new_y1==undefined ? y1 : new_y1;
            a1 = new_angle1==undefined ? a1 : new_angle1;
            x2 = new_x2==undefined ? x2 : new_x2;
            y2 = new_y2==undefined ? y2 : new_y2;
            a2 = new_angle2==undefined ? a2 : new_angle2;

            const offset_1 = _canvas_.library.math.cartesianAngleAdjust(push,0,a1);
            const offset_2 = _canvas_.library.math.cartesianAngleAdjust(push,0,a2);
            pathShape.points([
                x1,y1,
                x1+offset_1.x, y1+offset_1.y,
                x2+offset_2.x, y2+offset_2.y,
                x2,y2,
            ]);

            // //if we're not to avoid units, just calculate the simple line between the two points (with push of course)
            //     if(!avoidUnits){
            //         const offset_1 = _canvas_.library.math.cartesianAngleAdjust(push,0,a1);
            //         const offset_2 = _canvas_.library.math.cartesianAngleAdjust(push,0,a2);
            //         pathShape.points([
            //             x1,y1,
            //             x1+offset_1.x, y1+offset_1.y,
            //             x2+offset_2.x, y2+offset_2.y,
            //             x2,y2,
            //         ]);
            //         return;
            //     }

            // //calculate route while avoiding units
            //     let path = [];
            //     function calculateRoute(startPoint,endPoint,environment){
            //         //generate visibility graph
            //             const path = [];
            //             const startAndEndPoints = [ [startPoint], [endPoint] ].map(points => ({points:points, boundingBox:_canvas_.library.math.boundingBoxFromPoints(points)}) );
            //             const field = startAndEndPoints.concat(environment);
            //             const visibilityGraph = _canvas_.library.math.polygonsToVisibilityGraph( field );

            //         //determine shortest route from visibility graph
            //             let generatedPath = _canvas_.library.math.shortestRouteFromVisibilityGraph(visibilityGraph, 0, 1);
            //             if(generatedPath.length == 1){
            //                 return generatedPath;
            //             }
            //             generatedPath.forEach(index => {
            //                 const tmp = visibilityGraph[index];
            //                 const point = field[tmp.polyIndex].points[tmp.pointIndex];
            //                 path.push(point.x,point.y);
            //             });

            //         return path;
            //     }

            //     //place initial point
            //         path.push(x1,y1);

            //         if( _canvas_.system.pane.getMiddlegroundPane(this) == undefined ){ 
            //             pathShape.points( [x1,y1,x2,y2] );
            //             return;
            //         }

            //         const offset_1 = _canvas_.library.math.cartesianAngleAdjust(push,0,a1);
            //         const offset_2 = _canvas_.library.math.cartesianAngleAdjust(push,0,a2);
            //         const environment = _canvas_.system.pane.getMiddlegroundPane(this).getChildren().filter(a => !a._isCable).map(a => a.space);
            //         const generatedPath = calculateRoute( {x:x1+offset_1.x, y:y1+offset_1.y}, {x:x2+offset_2.x, y:y2+offset_2.y}, environment );
            //         if(generatedPath.length == 0){
            //         }else if(generatedPath.length == 1){
            //             if(generatedPath[0] == 0){
            //                 const offset_2 = _canvas_.library.math.cartesianAngleAdjust(0,0,a2);
            //             }
            //             if(generatedPath[0] == 1){
            //                 const offset_1 = _canvas_.library.math.cartesianAngleAdjust(0,0,a1);
            //             }
            //             if(generatedPath[0] != 0 && generatedPath[0] != 1){
            //                 console.error('cable2.draw: major error: unknown path point in error');
            //                 pathShape.points( [x1,y1,x2,y2] );
            //                 return;
            //             }

            //             const secondGeneratedPath = calculateRoute( {x:x1+offset_1.x, y:y1+offset_1.y}, {x:x2+offset_2.x, y:y2+offset_2.y}, environment );
            //             if(secondGeneratedPath.length == 1){
            //                 pathShape.points( [x1,y1,x2,y2] );
            //                 return;
            //             }
            //             path = path.concat( secondGeneratedPath );
            //         }else{
            //             path = path.concat( generatedPath );
            //         }

            //     //place final point
            //         path.push(x2,y2);

            //     pathShape.points(path);
        };
        object.draw();

    //identifier
        object._isCable = true;

    return object;
};
this.cable2.visibilityGraph = [];
this.cable2.globalDraw = function(pane=_canvas_.system.pane.mm){
    // pane.getChildren().filter(a => a._isCable).forEach(cable => cable.draw());
    // pane.getChildren().filter(a => a._isCable).forEach(cable => cable.draw(undefined,undefined,undefined,undefined,undefined,undefined,undefined,false));
};