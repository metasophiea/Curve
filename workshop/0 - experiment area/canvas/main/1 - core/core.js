var core = this;

var adapter = new function(){
    this.length = function(l){
        return l*core.viewport.scale();
    };
    this.windowPoint2workspacePoint = function(x,y){
        var position = core.viewport.position();
        var scale = core.viewport.scale();
        var angle = core.viewport.angle();

        x = (x/scale) - position.x;
        y = (y/scale) - position.y;

        return canvas.library.math.cartesianAngleAdjust(x,y,-angle);
    };
    this.workspacePoint2windowPoint = function(x,y){
        var position = core.viewport.position();
        var scale = core.viewport.scale();
        var angle = core.viewport.angle();

        var point = canvas.library.math.cartesianAngleAdjust(x,y,angle);

        return {
            x: (point.x+position.x) * scale,
            y: (point.y+position.y) * scale
        };
    };
};
var shapes = new function(){
    {{include:shapes/*}} /**/
}
function gatherParentOffset(element){
    var offset = {x:0,y:0,a:0};
        //gather x, y, and angle data from this element up
            var offsetList = [];
            var temp = element;
            while((temp=temp.parent) != undefined){
                offsetList.unshift( {x:temp.x, y:temp.y, a:temp.angle} );
            }

        //calculate them together into an offset
            offset = { 
                x: offsetList[0]!=undefined ? offsetList[0].x : 0,
                y: offsetList[0]!=undefined ? offsetList[0].y : 0,
                a: offsetList[0]!=undefined ? offsetList[0].a : 0,
            };
            for(var a = 1; a < offsetList.length; a++){
                var point = canvas.library.math.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,offsetList[a-1].a);
                offset.a += offsetList[a].a;
                offset.x += point.x;
                offset.y += point.y;
            }

    return offset;
}





this.arrangement = new function(){
    var design = new shapes.group;
    design.name = 'root';

    this.createElement = function(type){ return new shapes[type]; };
    this.clear = function(){ design.clear(); };
    this.get = function(){return design;};
    this.set = function(arrangement){design = arrangement;};
    this.prepend = function(element){ design.prepend(element); };
    this.append = function(element){ design.append(element); };
    this.remove = function(element){ design.remove(element); };
    this.getElementUnderPoint = function(x,y){ return design.getElementUnderPoint(x,y); };
    this.getElementsWithName = function(name){ return design.getElementsWithName(name); };
};
this.viewport = new function(){
    var pageData = {
        defaultSize:{width:640, height:480},
        width:0, height:0,
        windowWidth:0, windowHeight:0,
    };
    var state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
    };
    var mouseData = { 
        x:undefined, 
        y:undefined, 
        stopScrollActive:false
    };

    function adjustCanvasSize(){
        var changesMade = false;

        function dimensionAdjust(direction){
            var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)

            var attribute = canvas.getAttribute('workspace'+Direction);
            if( pageData[direction] != attribute || pageData['window'+Direction] != window['inner'+Direction] ){
                //save values for future reference
                    pageData[direction] = attribute;
                    pageData['window'+Direction] = window['inner'+Direction];

                //adjust canvas dimension based on the size requirement set out in the workspace attribute
                    if(attribute == undefined){
                        canvas[direction] = pageData.defaultSize[direction];
                    }else if( attribute.indexOf('%') == (attribute.length-1) ){
                        var parentSize = canvas.parentElement['offset'+Direction]
                        var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                        canvas[direction] = parentSize * percent;
                    }else{
                        canvas[direction] = attribute;
                    }

                changesMade = true;
            }
        }

        dimensionAdjust('width');
        dimensionAdjust('height');

        if(changesMade){ calculateViewportExtremities(); }
    }
    function calculateViewportExtremities(){
        //for each corner of the viewport; find out where they lie on the workspace
            state.points.tl = adapter.windowPoint2workspacePoint(0,0);
            state.points.tr = adapter.windowPoint2workspacePoint(canvas.width,0);
            state.points.bl = adapter.windowPoint2workspacePoint(0,canvas.height);
            state.points.br = adapter.windowPoint2workspacePoint(canvas.width,canvas.height);
        
        //calculate a bounding box for the viewport from these points
            state.boundingBox = canvas.library.math.boundingBoxFromPoints([state.points.tl, state.points.tr, state.points.br, state.points.bl]);
    }

    this.position = function(x,y){
        if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
        state.position.x = x;
        state.position.y = y;
        calculateViewportExtremities();
    };
    this.scale = function(s){
        if(s == undefined){return state.scale;}
        state.scale = s;
        calculateViewportExtremities();
    };
    this.angle = function(a){
        if(a == undefined){return state.angle;}
        state.angle = a;
        calculateViewportExtremities();
    };
    this.windowPoint2workspacePoint = function(x,y){ return adapter.windowPoint2workspacePoint(x,y); };

    this.refresh = function(){
        adjustCanvasSize();
        calculateViewportExtremities();
        canvas.setAttribute('tabIndex',1); //enables keyboard input
    };
    this.getBoundingBox = function(){return state.boundingBox;};
    this.mousePosition = function(x,y){
        if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
        mouseData.x = x;
        mouseData.y = y;
    };
    this.stopMouseScroll = function(bool){
        if(bool == undefined){return mouseData.stopScrollActive;}
        mouseData.stopScrollActive = bool;

        //just incase; make sure that scrolling is allowed again when 'stopMouseScroll' is turned off
        if(!bool){ document.body.style.overflow = ''; }
    };
};
this.render = new function(){
    var context = canvas.getContext('2d', { alpha: true });
    var animationRequestId = undefined;

    function clearFrame(){
        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    function renderFrame(noClear=false){
        //clear the canvas
            if(!noClear){ clearFrame(); }

        //activate root groups render function
            core.arrangement.get().render(context);
    }
    function animate(timestamp){
        animationRequestId = requestAnimationFrame(animate);

        //attempt to render frame, if there is a failure; stop animation loop and report the error
            var error = undefined;
            try{
                renderFrame();
            }catch(error){
                core.render.active(false);
                console.error('major animation error');
                console.error(error);
            }

        //perform stats collection
            core.stats.collect(timestamp);
    }

    this.drawDot = function(x,y,r=2,colour='rgba(150,150,255,1)'){
        context.fillStyle = colour;
        context.beginPath();
        context.arc(x,y, r, 0, 2*Math.PI, false);
        context.closePath(); 
        context.fill();
    };

    this.frame = function(noClear=false){renderFrame(noClear);};
    this.active = function(bool){
        if(bool == undefined){return animationRequestId!=undefined;}

        if(bool){
            if(animationRequestId != undefined){return;}
            animate();
        }else{
            if(animationRequestId == undefined){return;}
            cancelAnimationFrame(animationRequestId);
            animationRequestId = undefined;
        }
    };
};
this.stats = new function(){
    var active = false;
    var average = 30;
    var lastTimestamp = 0;

    var framesPerSecond = {
        compute:function(timestamp){
            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
            if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }

            this.rate = canvas.library.math.averageArray( this.frameTimeArray );

            lastTimestamp = timestamp;
        },
        counter:0,
        frameTimeArray:[],
        rate:0,
    };

    this.collect = function(timestamp){
        //if stats are turned off, just bail
            if(!active){return;}

        framesPerSecond.compute(timestamp);
    };
    this.active = function(bool){if(bool==undefined){return active;} active=bool;};
    this.getReport = function(){
        return {
            framesPerSecond: framesPerSecond.rate,
        };
    };
};
this.callback = new function(){
    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onkeydown', 'onkeyup',
        'touchstart', 'touchmove', 'touchend', 'touchenter', 'touchleave', 'touchcancel',
    ];

    for(var a = 0; a < callbacks.length; a++){
        //interface
            this[callbacks[a]] = function(x,y,event){};

        //attachment to canvas
            //default
                canvas[callbacks[a]] = function(callback){
                    return function(event){
                        if( !core.callback[callback] ){return;}
                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                        var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                        core.callback[callback](p.x,p.y,event,shape);
                    }
                }(callbacks[a]);

            //special cases
                canvas.onmouseover = function(event){
                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = 'hidden'; }

                    if( !core.callback.onmouseover ){return;}
                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                    core.callback.onmouseover(p.x,p.y,event,shape);
                };
                canvas.onmouseout = function(event){
                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = ''; }
                    
                    if( !core.callback.onmouseout ){return;}
                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                    core.callback.onmouseout(p.x,p.y,event,shape);
                };
                var lastShape;
                canvas.onmousemove = function(event){
                    if( !core.callback.onmousemove ){return;}
                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);

                    if( lastShape != shape ){
                        core.callback.onmouseleave(p.x,p.y,event,lastShape);
                        core.callback.onmouseenter(p.x,p.y,event,shape);
                    }
                    lastShape = shape;
                    
                    core.callback.onmousemove(p.x,p.y,event,shape);
                    core.viewport.mousePosition(p.x,p.y);
                };

                canvas.onkeydown = function(event){
                    if( !core.callback.onkeydown ){return;}
                    var p = core.viewport.mousePosition();
                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                    core.callback.onkeydown(p.x,p.y,event,shape);
                };
                canvas.onkeyup = function(event){
                    if( !core.callback.onkeyup ){return;}
                    var p = core.viewport.mousePosition();
                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                    core.callback.onkeyup(p.x,p.y,event,shape);
                };

    }
};

//initial viewport setup
    core.viewport.refresh();
    core.arrangement.clear();