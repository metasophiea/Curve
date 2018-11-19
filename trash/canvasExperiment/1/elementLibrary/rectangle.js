this.rectangle = {

    create:function(){
        var obj = new function(){
            this.type = 'rectangle';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;
            this.dotFrame = false;

            this.x = 0;
            this.y = 0;
            this.anchor = {x:0,y:0};
            this.angle = 0;
            this.width = 10;
            this.height = 10;

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
                    element.extremities.points = canvas.library.math.pointsOfRect(element.x, element.y, element.width, element.height, element.angle, element.anchor);
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
            var position = {
                location:{
                    x:(element.x+offset.x),
                    y:(element.y+offset.y)
                },
                angle:(element.angle+offset.a)
            };
            var temp = {
                width: element.width,
                height: element.height,
                lineWidth: element.style.lineWidth,
            };

        //if the element isn't static; adjust it's position and line thickness to account for viewport position
            if(!static){
                position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);
                position.location = canvas.library.math.cartesianAngleAdjust(position.location.x,position.location.y,-position.angle);
                position.location.x += adapter.length(-element.anchor.x*temp.width);
                position.location.y += adapter.length(-element.anchor.y*temp.height);

                temp.width = adapter.length(temp.width);
                temp.height = adapter.length(temp.height);

                temp.lineWidth = adapter.length(temp.lineWidth);
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
            context.save();
            context.rotate( position.angle );
            context.fillRect( position.location.x, position.location.y, temp.width, temp.height );
            context.strokeRect( position.location.x, position.location.y, temp.width, temp.height );
            context.restore();
    },

};