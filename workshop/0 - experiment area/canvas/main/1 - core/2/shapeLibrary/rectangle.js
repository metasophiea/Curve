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
            this.angle = 0;
            this.anchor = {x:0,y:0};
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
        }

        return obj;
    },

    computeExtremities:function(element,offset){
        //if the offset isn't set; that means that this is the element that got the request for extrimity recomputation
        //in which case; gather the offset of all parents. Otherwise just use what was provided
            offset = offset == undefined ? gatherParentOffset(element) : offset;

        //reset variables
            element.extremities = {
                points:[],
                boundingBox:{},
            };

        //calculate points
            element.extremities.points = canvas.library.math.pointsOfRect(element.x, element.y, element.width, element.height, -element.angle, element.anchor);
            element.extremities.points = element.extremities.points.map(function(point){
                point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                point.x += offset.x;
                point.y += offset.y;
                return point;
            });
            //development drawing
                for(var a = 0; a < element.extremities.points.length; a++){
                    var temp = adapter.workspacePoint2windowPoint(element.extremities.points[a].x,element.extremities.points[a].y);
                    core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                }

        //calculate boundingBox
            element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
            //development drawing
                var temp = adapter.workspacePoint2windowPoint(element.extremities.boundingBox.topLeft.x,element.extremities.boundingBox.topLeft.y);
                core.render.drawDot( temp.x, temp.y );
                var temp = adapter.workspacePoint2windowPoint(element.extremities.boundingBox.bottomRight.x,element.extremities.boundingBox.bottomRight.y);
                core.render.drawDot( temp.x, temp.y );

        //update the points and bounding box of the parent
            if(element.parent != undefined){
                shapeLibrary[element.parent.type].computeExtremities(element.parent);
            }

    },
    isPointWithinBoundingBox:function(x,y,shape){
        if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
        return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
    },
    isPointWithinHitBox:function(x,y,shape){
        if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
        return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
    },
    shouldRender:function(element){return true;},
    
    render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){
        //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method)
        //just bail on the whole thing
            if(!shapeLibrary[element.type].shouldRender()){return;}

        //adjust offset for parent's angle
            var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
            offset.x += point.x-element.x;
            offset.y += point.y-element.y;
        
        //collect and consolidate shape values into a neat package
            var shapeValue = {
                location:{
                    x:(element.x+offset.x),
                    y:(element.y+offset.y)
                },
                angle:(element.angle+offset.a),
                width: element.width,
                height: element.height,
                lineWidth: element.style.lineWidth,
            };
        
        //adapt values
            shapeValue.location = adapter.workspacePoint2windowPoint(shapeValue.location.x,shapeValue.location.y);
            shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
            shapeValue.location.x += adapter.length(-element.anchor.x*shapeValue.width);
            shapeValue.location.y += adapter.length(-element.anchor.y*shapeValue.height);

            shapeValue.width = adapter.length(shapeValue.width);
            shapeValue.height = adapter.length(shapeValue.height);

            shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
            shapeValue.shadowBlur = adapter.length(element.style.shadowBlur);
            shapeValue.shadowOffset = {
                x:adapter.length(element.style.shadowOffset.x),
                y:adapter.length(element.style.shadowOffset.y),
            };

        //actual render
            context.fillStyle = element.style.fill;
            context.strokeStyle = element.style.stroke;
            context.lineWidth = shapeValue.lineWidth;
            context.shadowColor = element.style.shadowColour;
            context.shadowBlur = shapeValue.shadowBlur;
            context.shadowOffsetX = shapeValue.shadowOffset.x;
            context.shadowOffsetY = shapeValue.shadowOffset.y;
            context.save();
            context.rotate( shapeValue.angle );
            context.fillRect( shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
            context.strokeRect( shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
            context.restore();
    },
};