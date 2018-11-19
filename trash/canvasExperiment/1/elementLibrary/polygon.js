this.polygon = {

    create:function(){
        var obj = new function(){
            this.type = 'polygon';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;
            this.dotFrame = false;

            this.points = [];

            this.style = {
                fill:'rgba(100,255,255,1)',
                stroke:'rgba(0,0,0,0)',
                lineWidth:1,
                lineJoin:'round',
                miterLimit:2,
                shadowColour:'rgba(0,0,0,0)',
                shadowBlur:20,
                shadowOffset:{x:20, y:20},
            };
        };

        return obj;
    },

    computeExtremities:function(element,offset){
        //if this shape is to be ignored anyway, don't bother with any of this
            if(element.ignored){return;}

        //actual computation of extremities
            computeExtremities(
                offset == undefined,
                element,
                offset,
                function(element,offset){
                    element.extremities = {};
                    element.extremities.points = element.points.map(function(point){
                        point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,-offset.a);
                        point.x += offset.x;
                        point.y += offset.y;
                        return point;
                    });
                    element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                },
            );

        //perform dot frame render
            makeDotFrame(element);
    },

    render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){        
        //run through all points in the poly, and account for the offsets
            var points = element.points.map( function(a){
                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                    if(offset.a != 0){
                        a = canvas.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
                    }
                //add positional offset to point
                    return {x:a.x+offset.x, y:a.y+offset.y};
            } );

        //draw polygon path
            //get initial point and line thickness - if this element isn't static; adjust it's position and line thickness to account for viewport position
            //otherwise just use the value as is
                var point = static ? {x:points[0].x,y:points[0].y} : adapter.workspacePoint2windowPoint(points[0].x,points[0].y);
                var lineWidth_temp = static ? element.style.lineWidth : adapter.length(element.style.lineWidth);

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


            //if the element isn't static; adjust it's shadow positions to account for viewport position
                var temp = {};
                if(!static){                    
                    temp.shadowBlur = adapter.length(element.style.shadowBlur);
                    temp.shadowOffset = {
                        x:adapter.length(element.style.shadowOffset.x),
                        y:adapter.length(element.style.shadowOffset.y),
                    };
                }

        //paint this shape as requested
            context.fillStyle = element.style.fill;
            context.strokeStyle = element.style.stroke;
            context.lineWidth = lineWidth_temp;
            context.lineJoin = element.style.lineJoin;
            context.miterLimit = element.style.miterLimit;
            context.shadowColor = element.style.shadowColour;
            context.shadowBlur = temp.shadowBlur;
            context.shadowOffsetX = temp.shadowOffset.x;
            context.shadowOffsetY = temp.shadowOffset.y;
            context.fill(); 
            context.stroke();
    },

};