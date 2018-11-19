var core = this;
var computeExtremities = function(isInitial,element,offset,elementCalculation){
    //if this is the initial object to have this command run upon it; compute points and
    // bounding box for provided element, and update the bounding boxes for all parents
        if(isInitial){
            //get and compute parent offsets
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
                        a: 0
                    };
                    for(var a = 1; a < offsetList.length; a++){
                        var point = canvas.library.math.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,-(offset.a+offsetList[a-1].a));
                        offset.a += offsetList[a-1].a;
                        offset.x += point.x;
                        offset.y += point.y;
                    }
                    offset.a += offsetList[offsetList.length-1]!=undefined ? offsetList[offsetList.length-1].a : 0;
        }

    //perform points and bounding box calculation for this element
        elementCalculation(element,offset);

    //if this is the initial object to have this command run upon it;; update all parents'
    // bounding boxes (if there are no changes to a parent's bounding box; don't update
    // and don't bother checking their parent (or higher))
        if(isInitial){
            var temp = element;
            while((temp=temp.parent) != undefined){
                //discover if this new object would effect the bounding box of it's parent
                    if( 
                        temp.extremities.boundingBox.topLeft.x > element.extremities.boundingBox.topLeft.x ||
                        temp.extremities.boundingBox.topLeft.y > element.extremities.boundingBox.topLeft.y ||
                        temp.extremities.boundingBox.bottomRight.x < element.extremities.boundingBox.bottomRight.x ||
                        temp.extremities.boundingBox.bottomRight.y < element.extremities.boundingBox.bottomRight.y 
                    ){
                        //it does effect, thus combine the current bounding box with this element's bounding 
                        //box to determine the new bounding box for the parent
                            temp.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints([
                                temp.extremities.boundingBox.topLeft, temp.extremities.boundingBox.bottomRight,
                                element.extremities.boundingBox.topLeft, element.extremities.boundingBox.bottomRight 
                            ]);
                    }else{
                        //it doesn't effect it, so don't bother going any higher
                            break;
                    }
            }   
        }

};
var makeDotFrame = function(element){
    //if dotFrame is set; insert all the  extremity points for this shape (in the middleground.front pane)
    if(element.dotFrame){
        function makePoint(x,y,id,r,colour){
            var el = core.arrangement.getChildByName(element.name+'_'+id);
            core.arrangement.remove(el);

            var point = canvas.core.arrangement.createElement('circle');
                point.name = element.name+'_'+id;
                point.x = x; point.y = y; point.r = r;
                point.style.fill = colour;
                point.ignored = true;
                core.arrangement.append(point);
        }

        makePoint(element.extremities.boundingBox.topLeft.x, element.extremities.boundingBox.topLeft.y, 'topLeft', 1, 'rgba(100,100,255,1)');
        makePoint(element.extremities.boundingBox.bottomRight.x, element.extremities.boundingBox.bottomRight.y, 'bottomRight', 1, 'rgba(100,100,255,1)');
        for(var a = 0; a < element.extremities.points.length; a++){
            makePoint(element.extremities.points[a].x, element.extremities.points[a].y, 'point_'+a, 0.5, 'rgba(255,100,100,1)');
        }
    }
};
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

    this.get = function(){return design};
    this.createElement = function(type){
        try{
            return elementLibrary[type].create();
        }catch(e){
            console.error('attempting to create unknown shape "'+type+'"');
        }
    };
    this.prepend = function(element){
        //check that the element is valid
            var temp = this.checkElementIsValid(element, design);
            if(temp != undefined){console.error('element invalid:',temp); return;}

        design.unshift(element);
        
        elementLibrary[element.type].computeExtremities(element);
    };
    this.append = function(element){
        //check that the element is valid
            var temp = this.checkElementIsValid(element, design);
            if(temp != undefined){console.error('element invalid:',temp); return;}

        design.push(element);
        
        elementLibrary[element.type].computeExtremities(element);
    };
    this.remove = function(element){
        if(element == undefined){return;}

        var index = design.indexOf(element);
        if(index < 0){return;}
        design.splice(index, 1);
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
                    if( canvas.library.math.detectOverlap.pointWithinBoundingBox({x:tempX,y:tempY},item.extremities.boundingBox) ){
                        if(item.type == 'group'){
                            var temp = recursiveSearch(tempX,tempY,item.children);
                            if(temp != undefined){return temp;}
                        }else{
                            if( elementLibrary[item.type].pointWithinCustomHitBox != undefined ){
                                if( elementLibrary[item.type].pointWithinCustomHitBox(item,{x:temp.x,y:temp.y}) ){ return item; }
                            }
                            else if( item.extremities.points != undefined ){
                                if( canvas.library.math.detectOverlap.pointWithinPoly( {x:tempX,y:tempY}, item.extremities.points )){ return item; }
                            }
                        }
                    }      
            }
        }

        return recursiveSearch(x,y,design);
    };

    this.getChildByName = function(name){
        for(var a = 0; a < design.length; a++){
            if( design[a].name == name ){return design[a];}
        }
    };
    this.forceRefresh = function(element){
        elementLibrary[element.type].computeExtremities(element);
    };
    this.checkElementIsValid = function(element,destination){
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
        scale:2,
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
    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 
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