this.polygon = {

    generate:function(){
        var element = {type:'polygon', name:undefined, ignored:false, static: false};
        element.points = [];
        element.fillStyle = 'rgba(100,255,255,1)';
        element.strokeStyle = 'rgba(0,0,0,1)';
        element.lineWidth = 1;
        return element;
    },

    computeExtremities:function(element,offset){
        element.points = element.points.map(function(point){
            point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,-offset.a);
            point.x += offset.x;
            point.y += offset.y;
            return point;
        });
        element.boundingBox = canvas.library.math.boundingBoxFromPoints( element.points );
        
        return element;
    },

    render:function(context,element,offsetX=0,offsetY=0,offsetAngle=0,static=false){
        //run through all points in the poly, and account for the offsets
            var points = element.points.map( function(a){
                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                    if(offsetAngle != 0){
                        a = canvas.library.math.cartesianAngleAdjust(a.x,a.y,-offsetAngle);
                    }
                //add positional offset to point
                    return {x:a.x+offsetX, y:a.y+offsetY};
            } );

        //render shape
            elementLibrary.polygon.draw( 
                context,
                points, 
                element.fillStyle, 
                element.strokeStyle, 
                element.lineWidth,
                static
            );
    },

    draw:function(context,points,fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1,static=false){
        //draw polygon path
            //get initial point and line thickness - if this element isn't static; adjust it's position and line thickness to account for viewport position
            //otherwise just use the value as is
                var point = static ? {x:points[0].x,y:points[0].y} : adapter.workspacePoint2windowPoint(points[0].x,points[0].y);
                var lineWidth_temp = static ? lineWidth : adapter.length(lineWidth);

            //begin drawing and move the inital point
                context.beginPath(); 
                context.moveTo(point.x,point.y);
            
            //go through all points, drawing lines between each, still checking to see if this element is static, and adjusting
            //the point's position if not
                for(var a = 1; a < points.length; a++){
                    point = static ? {x:points[a].x,y:points[a].y} : adapter.workspacePoint2windowPoint(points[a].x,points[a].y);
                    context.lineTo(point.x,point.y);
                }
                context.closePath(); 

        //paint this shape as requested
            context.fillStyle = fillStyle;
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth_temp;
            context.fill(); 
            context.stroke();
    },

};