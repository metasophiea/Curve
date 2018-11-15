this.text = {

    create:function(){
        var obj = new function(){
            this.type = 'text';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;
            this.dotFrame = true;

            this.x = 0;
            this.y = 0;
            this.text = 'Hello';
            this.angle = 0;
            this.size = 0.5;

            this.style = {
                font:'100px Arial',
                align:'start', //start/end/center/lief/right 
                baseline:'alphabetic',  //alphabetic/top/hanging/middle/ideographic/bottom
                fill:'rgba(255,100,100,1)',
                stroke:'rgba(0,0,0,0)',
                lineWidth:1,
                shadowColour:'rgba(0,0,0,0.5)',
                shadowBlur:2,
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
                    element.extremities.points = canvas.library.math.pointsOfText(
                        element.text,
                        element.x, 
                        element.y, 
                        element.angle, 
                        element.size,
                        element.style.font,
                        element.style.align,
                        element.style.baseline,
                    );
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

        //collect element adjustable attributes into neat package
            var package = {
                location:{
                        x: (element.x+offset.x),
                        y: (element.y+offset.y)
                    },
                angle: (element.angle+offset.a),
                size: element.size,

                lineWidth: element.style.lineWidth,
                shadowBlur: element.style.shadowBlur,
                shadowOffsetX: element.style.shadowOffset.x,
                shadowOffsetY: element.style.shadowOffset.y,
            };

        //if the element isn't static; adjust the package
            if(!static){
                package.location = adapter.workspacePoint2windowPoint(package.location.x,package.location.y);
                package.location = canvas.library.math.cartesianAngleAdjust(package.location.x,package.location.y,-package.angle);

                package.size = adapter.length(package.size);
                
                package.lineWidth = adapter.length(package.lineWidth);
                package.shadowBlur = adapter.length(package.shadowBlur);
                package.shadowOffsetX = adapter.length(package.shadowOffsetX);
                package.shadowOffsetY = adapter.length(package.shadowOffsetY);
            }

        //actual render
            context.font = element.style.font;
            context.textAlign = element.style.align;
            context.textBaseline = element.style.baseline;
            context.fillStyle = element.style.fill;
            context.strokeStyle = element.style.stroke;
            context.lineWidth = package.lineWidth;
            context.shadowColor = element.style.shadowColour;
            context.shadowBlur = package.shadowBlur;
            context.shadowOffsetX = package.shadowOffsetX;
            context.shadowOffsetY = package.shadowOffsetY;

            context.save();
            context.rotate( package.angle );
            context.scale(package.size,package.size);
            context.fillText( element.text, package.location.x/package.size, package.location.y/package.size );
            context.shadowColor = 'rgba(0,0,0,0)'; //to stop stroke shadows drawing over the fill text (an uncreative solution)
            context.strokeText( element.text, package.location.x/package.size, package.location.y/package.size );
            context.restore();
    },

};