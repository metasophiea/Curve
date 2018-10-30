canvas.core = new function(){
    this.imageCache ={};
    this.state = {
        stats:{
            active:false,
            average:60,
        },
        element:{},
        viewport:{
            position:{x:0,y:0},
            zoom:3,
            angle:0,
            corners:{
                tl:{x:0,y:0},
                tr:{x:0,y:0},
                bl:{x:0,y:0},
                br:{x:0,y:0},
            },
            boundingBox:{
                topLeft:{x:0,y:0},
                bottomRight:{x:0,y:0}
            },
        },
    };
    this.adapter = {
        angle:function(a=0){
            return canvas.core.state.viewport.angle - a;
        },
        point:function(x,y){
            return canvas.core.adapter.workspacePoint2windowPoint(x,y);
        },
        length:function(l){
            return l*canvas.core.state.viewport.zoom;
        },
        windowPoint2workspacePoint:function(x,y){
            x = (x/canvas.core.state.viewport.zoom) - canvas.core.state.viewport.position.x;
            y = (y/canvas.core.state.viewport.zoom) - canvas.core.state.viewport.position.y;

            var polar = Math.cartesian2polar(x,y);
            polar.ang -= canvas.core.state.viewport.angle;
            return Math.polar2cartesian(polar.ang,polar.dis);
        },
        workspacePoint2windowPoint:function(x,y){
            var polar = Math.cartesian2polar(x,y);
            polar.ang += canvas.core.state.viewport.angle;
            var point = Math.polar2cartesian(polar.ang,polar.dis);

            return {
                x: (point.x+canvas.core.state.viewport.position.x) * canvas.core.state.viewport.zoom,
                y: (point.y+canvas.core.state.viewport.position.y) * canvas.core.state.viewport.zoom
            };
        },
    };
    this.draw = {
        context:canvas.getContext('2d', { alpha: false }),
        clear:function(){
            // this.context.clearRect(0, 0, canvas.width, canvas.height);

            var context = canvas.core.draw.context;
            context.fillStyle = 'rgb(255,255,255)';
            context.fillRect(0, 0, canvas.width, canvas.height);
        },
        dot:function(x,y,r=5,fillStyle='rgba(255,0,0,1)'){
            var context = canvas.core.draw.context;

            context.fillStyle = fillStyle;
            context.strokeStyle = '';
            context.lineWidth = '';
        
            context.save();
            var p = canvas.core.adapter.point(x,y); context.translate(p.x,p.y);
            context.beginPath();
            context.arc(0, 0, r, 0, 2 * Math.PI, false);
            context.fill();
            context.restore();
        },
        rect:function(x,y,width,height,angle=0,anchor={x:0,y:0},fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1){
            var context = canvas.core.draw.context;

            context.fillStyle = fillStyle;
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
        
            context.save();
            var p = canvas.core.adapter.point(x,y); context.translate(p.x,p.y);
            context.rotate( canvas.core.adapter.angle(angle) );
            context.fillRect(   -anchor.x*canvas.core.adapter.length(width), -anchor.y*canvas.core.adapter.length(height), canvas.core.adapter.length(width), canvas.core.adapter.length(height));
            context.strokeRect( -anchor.x*canvas.core.adapter.length(width), -anchor.y*canvas.core.adapter.length(height), canvas.core.adapter.length(width), canvas.core.adapter.length(height));	
            context.restore();
        },
        poly:function(points,fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,1)',lineWidth=1){
            var context = canvas.core.draw.context;

            context.fillStyle = fillStyle;
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
        
            context.beginPath(); 
            var p = canvas.core.adapter.point(points[0].x,points[0].y); context.moveTo(p.x,p.y);
            for(var a = 1; a < points.length; a++){ 
                var p = canvas.core.adapter.point(points[a].x,points[a].y); context.lineTo(p.x,p.y);
            }
        
            context.closePath(); 
            context.fill(); 
            context.stroke();
        },
        image:function(x,y,width,height,angle=0,anchor={x:0,y:0},url){
            //if the url is missing; draw the default shape
                if(url == undefined){
                    canvas.core.draw.rect(x,y,width,height,angle,anchor,"rgb(50,50,50)","rgb(255,0,0)",3);
                    return;
                }

            //if this image url is not cached; cache it
                if( !canvas.core.imageCache.hasOwnProperty(url) ){
                    canvas.core.imageCache[url] = new Image(); 
                    canvas.core.imageCache[url].src = url;
                }
        
            //main render (using cached image)
                var context = canvas.core.draw.context;
                context.save();
                var p = canvas.core.adapter.point(x,y); context.translate(p.x,p.y);
                context.rotate( canvas.core.adapter.angle(angle) );
                context.drawImage(canvas.core.imageCache[url], -anchor.x*width, -anchor.y*height, canvas.core.adapter.length(width), canvas.core.adapter.length(height));
                context.restore();
        },
    };
    this.getElementUnderPoint = function(x,y){
        //go through the item list in reverse. Return first item to have the point within it
            for(var a = this.renderList.length-1; a >= 0; a--){
                if( !this.renderList[a].points ){continue;} //if this item doesn't have a bounding box; ignore all of this
                if( Math.detectOverlap_pointWithinPoly( {x:x,y:y}, this.renderList[a].points )){ return this.renderList[a]; }
            }

        return undefined;
    };


    this.canvasSizeAdjust = function(){
        var width = canvas.getAttribute('workspaceWidth');
        if( this.state.element.width != width || this.state.element.windowWidth != window.innerWidth ){
            this.state.element.width = width;
            this.state.element.windowWidth = window.innerWidth;

            if(width == undefined){
                canvas.width = 640;
            }else if( width.indexOf('%') == (width.length-1) ){
                var parentSize = canvas.parentElement.offsetWidth
                var percent = parseFloat(width.slice(0,(width.length-1))) / 100;
                canvas.width = parentSize * percent;
            }else{
                canvas.width = width;
            }

            this.state.viewport.width = canvas.width;
        }

        var height = canvas.getAttribute('workspaceHeight');
        if( this.state.element.height != height || this.state.element.windowHeight != window.innerHeight ){
            this.state.element.height = height;
            this.state.element.windowHeight = window.innerHeight;

            if(height == undefined){
                canvas.height = 480;
            }else if( height.indexOf('%') == (height.length-1) ){
                var parentSize = canvas.parentElement.offsetHeight
                var percent = parseFloat(height.slice(0,(height.length-1))) / 100;
                canvas.height = parentSize * percent;
            }else{
                canvas.height = height;
            }

            this.state.viewport.width = canvas.height;
        }
    };


    this.renderList = [
        {type:'rect', data:{x:10, y:10, width:50, height:50}},
        {type:'rect', data:{x:150, y:35, width:50, height:50, angle:0.1, anchor:{x:0.5, y:0.5}}},
        {type:'image', data:{x:10, y:70, width:50, height:50, angle:0.1, url:'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg'}},
        {type:'rect', data:{x:-100, y:10, width:50, height:50, fillStyle:'rgba(255,50,50,1)'}},
        {type:'poly', data:{points: [{x:80,y:80},{x:160,y:80},{x:160,y:160}] }},
        {type:'dot', data:{x:0,y:0}},
        {type:'dot', data:{x:352,y:0}},
        {type:'dot', data:{x:352,y:158}},
        {type:'dot', data:{x:0,y:158}},
    ];
    this.render = function(){
        //perform resize of canvas
            this.canvasSizeAdjust();

        //clear the canvas
            this.draw.clear();

        //calculate viewport corner points, and bounding box
            var corners = this.state.viewport.corners;
            corners.tl = this.adapter.windowPoint2workspacePoint(0,0);
            corners.tr = this.adapter.windowPoint2workspacePoint(canvas.width,0);
            corners.br = this.adapter.windowPoint2workspacePoint(0,canvas.height);
            corners.br = this.adapter.windowPoint2workspacePoint(canvas.width,canvas.height);
            this.state.viewport.boundingBox = Math.boundingBoxFromPoints([corners.tl, corners.tr, corners.br, corners.bl]);

        //render everything on the render list, and append it's bounding box
            for(a in this.renderList){
                var item = this.renderList[a];
                var data = item.data;
                switch(item.type){
                    //for each shape:
                        //gather the bounding box and points for the shape (adding it to this item)
                        //render judgement
                            //determine if the viewport bounding box and the bounding box for this shape overlap in any way
                            //if they don't; don't bother rendering
                        //perform render
                    //(note: dot's do not have bounding boxes, thus none are saved for this item. Separate "no-render" is used here)
                    case 'rect': 
                        item.points = Math.pointsOfRect(data.x, data.y, data.width, data.height, data.angle, data.anchor, 1/*canvas.core.state.viewport.zoom*/);
                        item.boundingBox = Math.boundingBoxFromPoints( item.points );
                        if( !Math.detectOverlap_boundingBoxOnly(canvas.core.state.viewport.boundingBox, item.boundingBox) ){ continue; }
                        this.draw[item.type]( data.x, data.y, data.width, data.height, data.angle, data.anchor, data.fillStyle, data.strokeStyle, data.lineWidth );
                    break;
                    case 'poly': 
                        item.points = data.points;
                        item.boundingBox = Math.boundingBoxFromPoints( data.points );
                        if( !Math.detectOverlap_boundingBoxOnly(canvas.core.state.viewport.boundingBox, item.boundingBox) ){ continue; }
                        this.draw[item.type]( data.points, data.fillStyle, data.strokeStyle, data.lineWidth );
                    break;
                    case 'image':
                        item.points = Math.pointsOfRect(data.x, data.y, data.width, data.height, data.angle, data.anchor, canvas.core.state.viewport.zoom);
                        item.boundingBox = Math.boundingBoxFromPoints( item.points );
                        if( !Math.detectOverlap_boundingBoxOnly(canvas.core.state.viewport.boundingBox, item.boundingBox) ){ continue; }
                        this.draw[item.type]( data.x, data.y, data.width, data.height, data.angle, data.anchor, data.url );
                    break;
                    case 'dot':
                        var bb = canvas.core.state.viewport.boundingBox;
                        if( data.x < bb.topLeft.x || data.y < bb.topLeft.y || data.x > bb.bottomRight.x || data.y > bb.bottomRight.y ){ continue; }

                        this.draw[item.type]( data.x, data.y, data.r, data.fillStyle );
                    break;
                    default: console.warn('unknown shape type "'+item.type+'"'); break;
                }
            }
    };
    this.animate = function(timestamp){
        var requestId = requestAnimationFrame(canvas.core.animate);
        try{
            canvas.core.render();
        }catch(e){
            cancelAnimationFrame(requestId);
            console.error('major animation error');
            console.error(e);
        }


        //fps counter
            var stats = canvas.core.state.stats;
            if( stats.active ){
                if( !stats.hasOwnProperty('fpsCounter') ){
                    stats.fpsCounter = {};
                    stats.fpsCounter.frameTimeArray = [];
                }
                stats.fpsCounter.frameTimeArray.push( 1000/(timestamp-stats.oldTime) );
                if( stats.fpsCounter.frameTimeArray.length >= stats.average){
                    console.log( 'frames per second:', Math.averageArray( stats.fpsCounter.frameTimeArray) );
                    stats.fpsCounter.frameTimeArray = [];
                }
                stats.oldTime = timestamp;
            }

    };

    this.callback = {
        onmousedown:function(x,y,event){ /*console.log('onmousedown',x,y,event);*/ },
        onmouseup:function(x,y,event){ /*console.log('onmouseup',x,y,event);*/ },
        onmousemove:function(x,y,event){ /*console.log('onmousemove',x,y,event);*/ },
        onwheel:function(x,y,event){ /*console.log('onwheel',x,y,event);*/ },
    };
    canvas.onmousedown = function(event){ 
        if( !canvas.core.callback.onmousedown ){return;}
        var p = canvas.core.adapter.windowPoint2workspacePoint(event.x,event.y);
        canvas.core.callback.onmousedown(p.x,p.y,event);
    };
    canvas.onmouseup = function(event){ 
        if( !canvas.core.callback.onmouseup ){return;}
        var p = canvas.core.adapter.windowPoint2workspacePoint(event.x,event.y);
        canvas.core.callback.onmouseup(p.x,p.y,event);
    };
    canvas.onmousemove = function(event){ 
        if( !canvas.core.callback.onmousemove ){return;}
        var p = canvas.core.adapter.windowPoint2workspacePoint(event.x,event.y);
        canvas.core.callback.onmousemove(p.x,p.y,event);
    };
    canvas.onwheel = function(event){ 
        if( !canvas.core.callback.onwheel ){return;}
        var p = canvas.core.adapter.windowPoint2workspacePoint(event.x,event.y);
        canvas.core.callback.onwheel(p.x,p.y,event);
    };
};







// canvas.core.render();
canvas.core.animate();
canvas.core.callback.onmousedown = function(x,y){ 
    console.log( canvas.core.getElementUnderPoint(x,y) );
};