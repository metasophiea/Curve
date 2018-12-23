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

        return workspace.library.math.cartesianAngleAdjust(x,y,-angle);
    };
    this.workspacePoint2windowPoint = function(x,y){
        var position = core.viewport.position();
        var scale = core.viewport.scale();
        var angle = core.viewport.angle();

        var point = workspace.library.math.cartesianAngleAdjust(x,y,angle);

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
                var point = workspace.library.math.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,offsetList[a-1].a);
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
    this.getElementUnderPoint = function(x,y,static=false,getList=false){ return design.getElementUnderPoint(x,y,static,getList); };
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
        stopScrollActive:false,
    };

    function adjustCanvasSize(){
        var changesMade = false;

        function dimensionAdjust(direction){
            var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)

            var attribute = workspace.getAttribute('workspace'+Direction);
            if( pageData[direction] != attribute || pageData['window'+Direction] != window['inner'+Direction] ){
                //save values for future reference
                    pageData[direction] = attribute;
                    pageData['window'+Direction] = window['inner'+Direction];

                //adjust canvas dimension based on the size requirement set out in the workspace attribute
                    if(attribute == undefined){
                        workspace[direction] = pageData.defaultSize[direction];
                    }else if( attribute.indexOf('%') == (attribute.length-1) ){
                        var parentSize = workspace.parentElement['offset'+Direction]
                        var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                        workspace[direction] = parentSize * percent;
                    }else{
                        workspace[direction] = attribute;
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
            state.points.tr = adapter.windowPoint2workspacePoint(workspace.width,0);
            state.points.bl = adapter.windowPoint2workspacePoint(0,workspace.height);
            state.points.br = adapter.windowPoint2workspacePoint(workspace.width,workspace.height);
        
        //calculate a bounding box for the viewport from these points
            state.boundingBox = workspace.library.math.boundingBoxFromPoints([state.points.tl, state.points.tr, state.points.br, state.points.bl]);
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
        workspace.setAttribute('tabIndex',1); //enables keyboard input
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
    this.cursor = function(type){
        //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
        if(type == undefined){return document.body.style.cursor;}
        document.body.style.cursor = type;
    };
};
this.render = new function(){
    var context = workspace.getContext('2d', { alpha: false });
    var animationRequestId = undefined;

    function clearFrame(){
        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect(0, 0, workspace.width, workspace.height);
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

            this.rate = workspace.library.math.averageArray( this.frameTimeArray );

            lastTimestamp = timestamp;
        },
        counter:0,
        frameTimeArray:[],
        rate:0,
    };
    var shapeCount = {
        recursiveCount:function(item){
            if(item == undefined){
                this.counts = {
                    total:0, 
                    canvas:0,    circle:0,
                    group:0,     image:0,
                    path:0,      polygon:0,
                    rectangle:0, text:0,
                };
                item = workspace.core.arrangement.get();
            }

            this.counts.total++;
            switch(item.type){
                case 'canvas':    this.counts.canvas++;    break;
                case 'circle':    this.counts.circle++;    break;
                case 'group':     this.counts.group++;     break;
                case 'image':     this.counts.image++;     break;
                case 'path':      this.counts.path++;      break;
                case 'polygon':   this.counts.polygon++;   break;
                case 'rectangle': this.counts.rectangle++; break;
                case 'text':      this.counts.text++;      break;
            }

            if(item.children != undefined){
                for(var a = 0; a < item.children.length; a++){
                    this.recursiveCount( item.children[a] );
                }
            }
        },
        recursivePrint:function(item,spacing=''){
            if(item == undefined){item = workspace.core.arrangement.get()}

            console.log( spacing + item.name );

            if(item.children != undefined){
                for(var a = 0; a < item.children.length; a++){
                    this.recursivePrint( item.children[a], spacing+'- ' );
                }
            }
        },
        counts:{
            total:0, 
            canvas:0,    circle:0,
            group:0,     image:0,
            path:0,      polygon:0,
            rectangle:0, text:0,
        }
    };

    this.collect = function(timestamp){
        //if stats are turned off, just bail
            if(!active){return;}

        framesPerSecond.compute(timestamp);
    };
    this.active = function(bool){if(bool==undefined){return active;} active=bool;};
    this.getReport = function(){
        shapeCount.recursiveCount();
        return {
            framesPerSecond: framesPerSecond.rate,
            shapeCount: shapeCount.counts,
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
            var lastPoint = {x:0,y:0};
            function getRelevantShape(x,y,callback){
                //find the frontmost shape under this point
                    var shape = core.arrangement.getElementUnderPoint(x,y);

                //if the shape found doesn't have an appropriate callback, get the list of all shapes that 
                //this point touches, and find the one that does (in order of front to back)
                //if none is found, just return the frontmost shape
                    if(shape != undefined && shape[callback] == undefined){
                        var shapeList = core.arrangement.getElementUnderPoint(x,y,undefined,true);
                        for(var a = 0; a < shapeList.length; a++){
                            if( shapeList[a][callback] != undefined ){ shape = shapeList[a]; break; }
                        }
                    }

                return shape;
            }

            //default
                workspace[callbacks[a]] = function(callback){
                    return function(event){
                        //if core doesn't have this callback set up, just bail
                            if( !core.callback[callback] ){return;}

                        //convert the point
                            var p = adapter.windowPoint2workspacePoint(event.x,event.y);

                        //get the shape under this point that has this callback (if no shape
                        //meeting that criteria is found, just return the frontmost shape)
                            var shape = getRelevantShape(p.x,p.y,callback);
                    
                        //activate core's callback, providing the converted point, original event, and shape
                            core.callback[callback](p.x,p.y,event,shape);
                    }
                }(callbacks[a]);

            //special cases
                workspace.onmouseover = function(event){
                    var callback = 'onmouseover';

                    //if appropriate, remove the window scrollbars
                        if(core.viewport.stopMouseScroll()){ document.body.style.overflow = 'hidden'; }

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}

                    //convert the point
                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);

                    //get the shape under this point that has this callback (if no shape
                    //meeting that criteria is found, just return the frontmost shape)
                        var shape = getRelevantShape(p.x,p.y,callback);
                
                    //activate core's callback, providing the converted point, original event, and shape
                        core.callback[callback](p.x,p.y,event,shape);
                };
                workspace.onmouseout = function(event){
                    var callback = 'onmouseout';

                    //if appropriate, replace the window scrollbars
                        if(core.viewport.stopMouseScroll()){ document.body.style.overflow = ''; }

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}

                    //convert the point
                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);

                    //get the shape under this point that has this callback (if no shape
                    //meeting that criteria is found, just return the frontmost shape)
                        var shape = getRelevantShape(p.x,p.y,callback);
                
                    //activate core's callback, providing the converted point, original event, and shape
                        core.callback[callback](p.x,p.y,event,shape);
                };
                workspace.onmousemove = function(event){
                    var callback = 'onmousemove';

                    //convert the point
                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);

                    //update the stored mouse position (used in keydown callbacks)
                        core.viewport.mousePosition(p.x,p.y);

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}

                    //get the shapes under this point that have the callbacks "onmouseleave",
                    //"onmouseenter" and "onmousemove" However; use the 'lastPoint' for "onmouseleave"
                    //(as usual - for each callback - if no shape meeting that criteria is found,
                    //just return the frontmost shape)
                        var shape_mouseleave = getRelevantShape(lastPoint.x,lastPoint.y,'onmouseleave');
                        var shape_mouseenter = getRelevantShape(p.x,p.y,'onmouseenter');
                        var shape_mousemove = getRelevantShape(p.x,p.y,callback);
                    
                    //activate core's callbacks, providing the converted point, original event, and appropriate shape
                    //(only activate the "onmouseenter" and "onmouseleave" callbacks, if the shapes found for them
                    //are not the same)
                        if( shape_mouseleave != shape_mouseenter ){
                            core.callback['onmouseleave'](p.x,p.y,event,shape_mouseleave);
                            core.callback['onmouseenter'](p.x,p.y,event,shape_mouseenter);
                        }
                        core.callback[callback](p.x,p.y,event,shape_mousemove);

                    //update lastPoint data with the new point
                        lastPoint = {x:p.x,y:p.y};
                };

                workspace.onkeydown = function(event){
                    var callback = 'onkeydown';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}

                    //gather the last (converted) mouse point
                        var p = core.viewport.mousePosition();

                    //get the shape under this point that has this callback (if no shape
                    //meeting that criteria is found, just return the frontmost shape)
                        var shape = getRelevantShape(p.x,p.y,callback);
                
                    //activate core's callback, providing the converted point, original event, and shape
                        core.callback[callback](p.x,p.y,event,shape);
                };
                workspace.onkeyup = function(event){
                    var callback = 'onkeyup';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}

                    //gather the last (converted) mouse point
                        var p = core.viewport.mousePosition();

                    //get the shape under this point that has this callback (if no shape
                    //meeting that criteria is found, just return the frontmost shape)
                        var shape = getRelevantShape(p.x,p.y,callback);
                
                    //activate core's callback, providing the converted point, original event, and shape
                        core.callback[callback](p.x,p.y,event,shape);
                };

    }
};

//initial viewport setup
    core.viewport.refresh();
    core.arrangement.clear();