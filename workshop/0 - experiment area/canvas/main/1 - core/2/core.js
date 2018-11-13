var core = this;
var elementLibrary = new function(){
    {{include:elementLibrary/*}} /**/
}
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



this.arrangement = new function(){
    var design = [];

    function checkElementIsValid(element, destination){
        //check for name
            if(element.name == undefined){return 'element has no name'}

        //check that the name is not already taken in this grouping
            for(var a = 0; a < destination.length; a++){
                if( destination[a].name == element.name ){ 
                    console.error('element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+parent.name+'"')+''); 
                    return;
                }
            }
        
        return;
    }

    this.get = function(){return design};
    this.createElement = function(type){ return elementLibrary[type].create(); };
    this.prepend = function(element){
        //check that the element is valid
            var temp = checkElementIsValid(element, design);
            if(temp != undefined){console.error('element invalid:',temp); return;}

        design.unshift(element);
        
        elementLibrary[element.type].computeExtremities(element);
    };
    this.append = function(element){
        //check that the element is valid
            var temp = checkElementIsValid(element, design);
            if(temp != undefined){console.error('element invalid:',temp); return;}

        design.push(element);
        
        elementLibrary[element.type].computeExtremities(element);
    };
    this.remove = function(element){
        if(element == undefined){return;}

        design.splice(design.indexOf(element), 1);
    };
    this.getElementUnderPoint = function(x,y){

        function recursiveSearch(x,y,group){
            //go through group in reverse;
            //  if the item is a group; check if the point is within its bounding box. If it is, use recursion
            //  otherwise; compute whether the point is within the items extremity points
            for(var a = group.length-1; a >= 0; a--){
                var item = group[a];
                var tempX = x;
                var tempY = y;

                //if the item declares that it should be ignored by this function; skip over it
                    if(item.ignored){continue;}
                
                //if this is a static object, adjust the x and y values accordingly
                    if( item.static ){
                        var p = adapter.workspacePoint2windowPoint(x,y);
                        tempX = p.x; 
                        tempY = p.y;
                    }

                //determine if the point lies within the bounds of this item
                    if(item.type == 'group'){
                        if( canvas.library.math.detectOverlap.pointWithinBoundingBox({x:tempX,y:tempY},item.boundingBox)){
                            var temp = recursiveSearch(tempX,tempY,item.children);
                            if(temp){return temp;}
                        }
                    }else{
                        if( !item.points ){continue;}//if this item doesn't have a bounding box; ignore all of this
                        if( canvas.library.math.detectOverlap.pointWithinPoly( {x:tempX,y:tempY}, item.points )){ return item; }
                    }
            }
        }

        return recursiveSearch(x,y,design);
    };

    this.forceRefresh = function(element){
        elementLibrary[element.type].computeExtremities(element);
    };
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
        stopScrollActive:true
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
    var context = canvas.getContext('2d', { alpha: false });
    var animationRequestId = undefined;

    function clearFrame(){
        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    function renderFrame(noClear=false){
        //clear the canvas
            if(!noClear){ clearFrame(); }

        //cycle through elements in design and activate their render functions
            var design = core.arrangement.get();
            for(var a = 0; a < design.length; a++){
                elementLibrary[design[a].type].render(context,design[a]);
            }
    }
    function animate(timestamp){
        animationRequestId = requestAnimationFrame(animate);

        //attempt to render frame, if there is a failure; stop animation loop and report the error
            try{
                renderFrame();
            }catch(e){
                core.render.active(false);
                console.error('major animation error');
                console.error(e);
            }

        //perform stats collection
            core.stats.collect(timestamp);
    }

    // this.makeDot = function(x,y){
    //     var r = 2;

    //     //actual render
    //         context.fillStyle = 'rgb(0,0,0)';
    //         context.strokeStyle = '';
    //         context.lineWidth = '';
    //         context.save();
    //         context.translate(x,y);
    //         context.beginPath();
    //         context.arc(0, 0, adapter.length(r), 0, 2 * Math.PI, false);
    //         context.closePath(); 
    //         context.fill();
    //         context.restore();
    // };
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
    var active = true;
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
    var callbacks = ['onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onkeydown', 'onkeyup'];
    for(var a = 0; a < callbacks.length; a++){
        //interface
            this[callbacks[a]] = function(x,y,event){};

        //attachment to canvas
            //default
                canvas[callbacks[a]] = function(callback){
                    return function(event){
                        if( !core.callback[callback] ){return;}
                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                        core.callback[callback](p.x,p.y,event);
                    }
                }(callbacks[a]);

            //special cases
                canvas.onmouseover = function(event){
                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = 'hidden'; }

                    if( !core.callback.onmouseover ){return;}
                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                    core.callback.onmouseover(p.x,p.y,event);
                };
                canvas.onmouseout = function(event){
                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = ''; }
                    
                    if( !core.callback.onmouseout ){return;}
                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                    core.callback.onmouseout(p.x,p.y,event);
                };
                canvas.onmousemove = function(event){
                    if( !core.callback.onmousemove ){return;}
                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                    core.callback.onmousemove(p.x,p.y,event);
                    core.viewport.mousePosition(p.x,p.y);
                };
                canvas.onkeydown = function(event){
                    if( !core.callback.onkeydown ){return;}
                    var p = core.viewport.mousePosition();
                    core.callback.onkeydown(p.x,p.y,event);
                };
                canvas.onkeyup = function(event){
                    if( !core.callback.onkeyup ){return;}
                    var p = core.viewport.mousePosition();
                    core.callback.onkeyup(p.x,p.y,event);
                };
    }
};

//initial viewport setup
    core.viewport.refresh();