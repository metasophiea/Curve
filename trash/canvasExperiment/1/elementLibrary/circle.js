this.circle = {

    create:function(){
        var obj = new function(){
            this.type = 'circle';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;
            this.dotFrame = false;

            this.x = 0;
            this.y = 0;
            this.r = 2;

            this.style = {
                fill:'rgba(255,100,255,1)',
                stroke:'rgba(0,0,0,0)',
                lineWidth:1,
                shadowColour:'rgba(0,0,0,0)',
                shadowBlur:2,
                shadowOffset:{x:1, y:1},
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
                    element.extremities.points = canvas.library.math.pointsOfCircle(element.x, element.y, element.r, 20);
                    element.extremities.points = element.extremities.points.map(function(point){
                        point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
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
        //adjust offset for parent's angle
            var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
            offset.x += point.x-element.x;
            offset.y += point.y-element.y;

        //collect element position into a neat package
        //collect element position into a neat package
            var position = {
                location:{
                    x:(element.x+offset.x),
                    y:(element.y+offset.y)
                },
            };
            var temp = {
                r: element.r,
                lineWidth:element.style.lineWidth,
                shadowBlur:element.style.shadowBlur,
                shadowOffset:{
                    x:element.style.shadowOffset.x,
                    y:element.style.shadowOffset.y,
                }
            };

        //if the element isn't static; adjust it's position and line thickness to account for viewport position
            if(!static){
                position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);

                temp.r = adapter.length(element.r);
                temp.lineWidth = adapter.length(element.style.lineWidth);
                temp.shadowBlur = adapter.length(element.style.shadowBlur);
                temp.shadowOffset = {
                    x:adapter.length(element.style.shadowOffset.x),
                    y:adapter.length(element.style.shadowOffset.y),
                };
            }

        //actual render
            context.fillStyle = element.style.fill;
            context.strokeStyle = element.style.stroke;
            context.lineWidth = temp.lineWidth;
            context.shadowColor = element.style.shadowColour;
            context.shadowBlur = temp.shadowBlur;
            context.shadowOffsetX = temp.shadowOffset.x;
            context.shadowOffsetY = temp.shadowOffset.y;
            context.beginPath();
            context.arc(position.location.x,position.location.y, temp.r, 0, 2 * Math.PI, false);
            context.closePath(); 
            context.fill();
    },

};