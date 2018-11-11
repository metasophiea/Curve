this.image = {

    cache:{},

    generate:function(){
        var element = {type:'image', name:undefined, ignored:false, static: false};
        element.x = 0;
        element.y = 0;
        element.anchor = {x:0,y:0};
        element.angle = 0;
        element.width = 0;
        element.height = 0;
        element.url = '';
        return element;
    },

    computeExtremities:function(element,offset){
        if(element.angle == undefined){element.angle = 0;}
    
        element.points = canvas.library.math.pointsOfRect(element.x, element.y, element.width, element.height, element.angle, element.anchor);
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
        //assuming the offset angle is not zero; calculate the correct position of the anchor point
            if(offsetAngle != 0){
                var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,-offsetAngle);
                offsetX -= element.x-point.x;
                offsetY -= element.y-point.y;
            }

        //render shape
            coreElement.image.draw( 
                context,
                element.x+offsetX, element.y+offsetY, 
                element.width, element.height, 
                element.angle+offsetAngle,
                element.anchor, 
                element.url,
                static
            );
    },

    draw:function(context,x,y,width,height,angle=0,anchor={x:0,y:0},url,static=false){
        //if the url is missing; draw the default shape
            if(url == undefined || url == ''){
                draw.rectangle(x,y,width,height,angle,anchor,"rgb(50,50,50)","rgb(255,0,0)",3);
                return;
            }

        //collect element position into a neat package
            var position = {location:{x:x,y:y}, angle:angle};

        //if the element isn't static; adjust it's position to account for viewport position
            if(!static){
                position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);
                position.location = canvas.library.math.cartesianAngleAdjust(position.location.x,position.location.y,-position.angle);
                position.location.x += adapter.length(-anchor.x*width);
                position.location.y += adapter.length(-anchor.y*height);

                width = adapter.length(width);
                height = adapter.length(height);
            }

        //if this image url is not cached; cache it
            if( !coreElement.image.cache.hasOwnProperty(url) ){
                coreElement.image.cache[url] = new Image(); 
                coreElement.image.cache[url].src = url;
            }
    
        //actual render (using cached image)
            context.save();
            context.rotate( position.angle );
            context.drawImage( coreElement.image.cache[url], position.location.x, position.location.y, width, height );
            context.restore();
    },

};