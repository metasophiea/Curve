this.cable = function(
    name='cable', 
    x1=0, y1=0, x2=0, y2=0,
    dimStyle={r:1,g:0,b:0,a:1},
    glowStyle={r:1,g:0.39,b:0.39,a:1},
){
    //elements 
        //main
            var object = interfacePart.builder('basic','group',name);
        //cable shape
            var path = interfacePart.builder('basic','path','cable',{ points:[x1,y1,x2,y2], colour:dimStyle, thickness:5 });
            object.append(path);
    
    //controls
        object.activate = function(){ path.colour = glowStyle; };
        object.deactivate = function(){ path.colour = dimStyle; };
        object.draw = function(new_x1,new_y1,new_x2,new_y2){
            x1 = (new_x1!=undefined ? new_x1 : x1); 
            y1 = (new_y1!=undefined ? new_y1 : y1);
            x2 = (new_x2!=undefined ? new_x2 : x2); 
            y2 = (new_y2!=undefined ? new_y2 : y2);
            path.points([x1,y1,x2,y2]);
        };

    //identifier
        object._isCable = true;

    return object;
};












this.cable2 = function(
    name='cable2', 
    x1=0, y1=0, x2=0, y2=0,
    dimStyle={r:1,g:0,b:0,a:1},
    glowStyle={r:1,g:0.39,b:0.39,a:1},
){
    var a1 = 0;
    var a2 = 0;

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name);
        //cable shape
            var pathShape = interfacePart.builder('basic','path','cable',{ points:[x1,y1,x2,y2], colour:dimStyle, thickness:5 });
            // var pathShape = interfacePart.builder('pathWithRoundJointsAndEnds','cable',{ points:[x1,y1,x2,y2], colour:dimStyle, thickness:5 });
            object.append(pathShape);
    
    //controls
        object.activate = function(){ pathShape.colour = glowStyle; };
        object.deactivate = function(){ pathShape.colour = dimStyle; };
        object.draw = function(new_x1,new_y1,new_x2,new_y2,new_angle1,new_angle2){
            x1 = new_x1==undefined ? x1 : new_x1;
            y1 = new_y1==undefined ? y1 : new_y1;
            a1 = new_angle1==undefined ? a1 : new_angle1;
            x2 = new_x2==undefined ? x2 : new_x2;
            y2 = new_y2==undefined ? y2 : new_y2;
            a2 = new_angle2==undefined ? a2 : new_angle2;

            var push = 20;
            var path = [];

            //generate inital basic line 
                path.push(x1,y1);

                var offset = _canvas_.library.math.cartesianAngleAdjust(push,0,a1);
                path.push( x1+offset.x, y1+offset.y );

                var offset = _canvas_.library.math.cartesianAngleAdjust(push,0,a2);
                path.push( x2+offset.x, y2+offset.y );

                path.push(x2,y2);

            // //go through each segment to improve the line, so that it does not collide with any unit
            //     //gather together the relevant units 
            //     var otherUnits = _canvas_.system.pane.getMiddlegroundPane(this).children().filter(a => !a._isCable).map(a => a.space);

            //     //run though the cable to see what segments collide with units
            //         for(var a = 0; a < path.length-2; a +=2){
            //             //get cable segment
            //             let segment = {x1:path[a],y1:path[a+1],x2:path[a+2],y2:path[a+3]};

            //             //get the units this segment collides with
            //             let collidingPolys = _canvas_.library.math.detectOverlap.overlappingLineWithPolygons(segment,otherUnits).map(a => otherUnits[a]);
            //         }




                // for(var a = 0; a < path.length-2; a +=2){
                //     let line = {x1:path[a],y1:path[a+1],x2:path[a+2],y2:path[a+3]}; //console.log(line);
                //     let collidingPolys = _canvas_.library.math.detectOverlap.overlappingLineWithPolygons(line,otherUnits);

                //     if(collidingPolys.length > 0){
                //         collidingPolys.forEach(a => {
                //             console.log(a,line);
                //             otherUnits[a].points.forEach(point => {

                //             });
                //             // console.log(a,otherUnits[a].points);
                //             console.log('');



                //         });
                //         path.splice(a+2,0,300,550);
                //     }
                // }

            // console.log('');
            // console.log(path);
            pathShape.points(path);
        };

    //identifier
        object._isCable = true;

    return object;
};