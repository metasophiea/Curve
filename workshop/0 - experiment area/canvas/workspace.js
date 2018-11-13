var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var canvas = __canvasElements[__canvasElements_count];
        canvas.library = new function(){};
        canvas.library.math = new function(){
            this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
            this.cartesian2polar = function(x,y){
                var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
            
                if(x === 0 ){
                    if(y === 0){ang = 0;}
                    else if(y > 0){ang = 0.5*Math.PI;}
                    else{ang = 1.5*Math.PI;}
                }
                else if(y === 0 ){
                    if(x >= 0){ang = 0;}else{ang = Math.PI;}
                }
                else if(x >= 0){ ang = Math.atan(y/x); }
                else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
            
                return {'dis':dis,'ang':ang};
            };
            this.polar2cartesian = function(angle,distance){
                return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
            };
            this.cartesianAngleAdjust = function(x,y,angle){
                var polar = this.cartesian2polar( x, y );
                polar.ang += angle;
                return this.polar2cartesian( polar.ang, polar.dis );
            };
            this.boundingBoxFromPoints = function(points){
                if(points.length == 0){
                    return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
                }
            
                var left = points[0].x; var right = points[0].x;
                var top = points[0].y;  var bottom = points[0].y;
            
                for(var a = 1; a < points.length; a++){
                    if( points[a].x < left ){ left = points[a].x; }
                    else if(points[a].x > right){ right = points[a].x; }
            
                    if( points[a].y < top ){ top = points[a].y; }
                    else if(points[a].y > bottom){ bottom = points[a].y; }
                }
            
                return {
                    topLeft:{x:left,y:top},
                    bottomRight:{x:right,y:bottom}
                };
            };
            this.pointsOfRect = function(x,y,width,height,angle=0,anchor={x:0,y:0}){
                var corners = {};
                var offsetX = anchor.x*width;
                var offsetY = anchor.y*height;
            
                var polar = this.cartesian2polar( offsetX, offsetY );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.tl = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX-width, offsetY );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.tr = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX-width, offsetY-height );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.br = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX, offsetY-height );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.bl = { x:(x - point.x), y:(y - point.y) };
            
                return [
                    corners.tl,
                    corners.tr, 
                    corners.br, 
                    corners.bl, 
                ];
            };
            this.detectOverlap = new function(){
                this.boundingBoxes = function(a, b){
                    return !(
                        (a.bottomRight.y < b.topLeft.y) ||
                        (a.topLeft.y > b.bottomRight.y) ||
                        (a.bottomRight.x < b.topLeft.x) ||
                        (a.topLeft.x > b.bottomRight.x)   
                );};
                this.pointWithinBoundingBox = function(point,box){
                    return !(
                        point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
                        point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
                    );
                };
                this.pointWithinPoly = function(point,points){
                    var inside = false;
                    for(var a = 0, b = points.length - 1; a < points.length; b = a++) {
                        if(
                            ((points[a].y > point.y) != (points[b].y > point.y)) && 
                            (point.x < ((((points[b].x-points[a].x)*(point.y-points[a].y)) / (points[b].y-points[a].y)) + points[a].x))
                        ){inside = !inside;}
                    }
                    return inside;
                };
            };

        };
        canvas.library.structure = new function(){
            this.functionListRunner = function(list){
                //function builder for working with the 'functionList' format
            
                return function(event,data){
                    //run through function list, and activate functions where necessary
                        for(var a = 0; a < list.length; a++){
                            var shouldRun = true;
            
                            //determine if all the requirements of this function are met
                                for(var b = 0; b < list[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[list[a].specialKeys[b]];
                                    if(!shouldRun){break;} //(one is already not a match, so save time and just bail here)
                                }
            
                            //if all requirements were met, run the function
            	            if(shouldRun){  
                   	                //if the function returns 'false', continue with the list; otherwise stop here
                    	            if( list[a].function(event,data) ){ break; }
                            	}
                        }
                }
            };

        };
        canvas.library.audio = new function(){

        };
        canvas.core = new function(){
            var core = new function(){
                var core = this;
                var elementLibrary = new function(){
                    this.rectangle = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'rectangle';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                    
                                this.x = 0;
                                this.y = 0;
                                this.anchor = {x:0,y:0};
                                this.angle = 0;
                                this.width = 0;
                                this.height = 0;
                    
                                this.style = {
                                    fill:'rgba(255,100,255,1)',
                                    stroke:'rgba(0,0,0,0)',
                                    lineWidth:1,
                                };
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){
                            var original = offset == undefined;
                    
                            //if an offset has not been provided; compute points and bounding box for provided element, and
                            // update the bounding boxes for all parents
                                if(original){
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
                    
                            //create points and bounding box for this element
                                element.points = canvas.library.math.pointsOfRect(element.x, element.y, element.width, element.height, element.angle, element.anchor);
                                element.points = element.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                                
                                element.boundingBox = canvas.library.math.boundingBoxFromPoints( element.points );
                    
                            //if an offset has not been provided; update all parents' bounding boxes (if there are no
                            // changes to a parent's bounding box; don't update and don't bother checking their parent
                            // (or higher))
                                if(original){
                                    var temp = element;
                                    while((temp=temp.parent) != undefined){
                                        //discover if this new object would effect the bounding box of it's parent
                                            if( 
                                                temp.boundingBox.topLeft.x > element.boundingBox.topLeft.x ||
                                                temp.boundingBox.topLeft.y > element.boundingBox.topLeft.y ||
                                                temp.boundingBox.bottomRight.x < element.boundingBox.bottomRight.x ||
                                                temp.boundingBox.bottomRight.y < element.boundingBox.bottomRight.y 
                                            ){
                                                //it does effect, thus combine the current bounding box with this element's bounding 
                                                //box to determine the new bounding box for the parent
                                                    temp.boundingBox = canvas.library.math.boundingBoxFromPoints([
                                                        temp.boundingBox.topLeft, temp.boundingBox.bottomRight,
                                                        element.boundingBox.topLeft, element.boundingBox.bottomRight 
                                                    ]);
                                            }else{
                                                //it doesn't effect it, so don't bother going any higher
                                                    break;
                                            }
                                    }   
                                }
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0},static=false){
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
                                }
                    
                            //actual render
                                context.fillStyle = element.style.fill;
                                context.strokeStyle = element.style.stroke;
                                context.lineWidth = temp.lineWidth;
                                context.save();
                                context.rotate( position.angle );
                                context.fillRect( position.location.x, position.location.y, temp.width, temp.height );
                                context.strokeRect( position.location.x, position.location.y, temp.width, temp.height );
                                context.restore();
                        },
                    };
                    this.group = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'group';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                    
                                this.x = 0;
                                this.y = 0;
                                this.angle = 0;
                                this.children = [];
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){
                            var original = offset == undefined;
                    
                            //if an offset has not been provided; compute points and bounding box for provided element, and
                            // update the bounding boxes for all parents
                                if(original){
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
                    
                            //create points and bounding box for this element
                                element.points = [{x:element.x+offset.x, y:element.y+offset.y}];
                                element.boundingBox = canvas.library.math.boundingBoxFromPoints( element.points );
                                for(var a = 0; a < element.children.length; a++){
                                    var child = element.children[a];
                                    var temp = elementLibrary[child.type].computeExtremities(child,offset);
                                }
                    
                            //if an offset has not been provided; update all parents' bounding boxes (if there are no
                            // changes to a parent's bounding box; don't update and don't bother checking their parent
                            // (or higher))
                                if(original){
                                    var temp = element;
                                    while((temp=temp.parent) != undefined){
                                        //discover if this new object would effect the bounding box of it's parent
                                            if( 
                                                temp.boundingBox.topLeft.x > element.boundingBox.topLeft.x ||
                                                temp.boundingBox.topLeft.y > element.boundingBox.topLeft.y ||
                                                temp.boundingBox.bottomRight.x < element.boundingBox.bottomRight.x ||
                                                temp.boundingBox.bottomRight.y < element.boundingBox.bottomRight.y 
                                            ){
                                                //it does effect, thus combine the current bounding box with this element's bounding 
                                                //box to determine the new bounding box for the parent
                                                    temp.boundingBox = canvas.library.math.boundingBoxFromPoints([
                                                        temp.boundingBox.topLeft, temp.boundingBox.bottomRight,
                                                        element.boundingBox.topLeft, element.boundingBox.bottomRight 
                                                    ]);
                                            }else{
                                                //it doesn't effect it, so don't bother going any higher
                                                    break;
                                            }
                                    }   
                                }
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0},static=false){
                    
                            for(var a = 0; a < element.children.length; a++){
                                var item = element.children[a];
                                var point = canvas.library.math.cartesianAngleAdjust(item.x,item.y,element.angle);
                    
                                elementLibrary[item.type].render(
                                    context,
                                    item,
                                    {
                                        x: offset.x + element.x + ( point.x-item.x ),
                                        y: offset.y + element.y + ( point.y-item.y ),
                                        a: offset.a + element.angle,
                                    },
                                    (static||item.static)
                                );
                            }
                    
                        },
                    
                    };
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
            };
            var surface = this;
            
            this.arrangement = new function(){
                this.get = function(){return core.arrangement.get();};
                this.set = function(arrangement){return core.arrangement.set(arrangement);};
                this.createElement = function(type){return core.arrangement.createElement(type);};
                this.append = function(element){return core.arrangement.append(element);};
                this.prepend = function(element){return core.arrangement.prepend(element);};
                this.remove = function(element){return core.arrangement.remove(element);};
                this.getElementUnderPoint = function(x,y){return core.arrangement.getElementUnderPoint(x,y);};
                this.forceRefresh = function(element){return core.arrangement.forceRefresh(element);};
            };
            this.viewport = new function(){
                this.position = function(x,y){return core.viewport.position(x,y);};
                this.scale = function(s){return core.viewport.scale(s);};
                this.angle = function(a){return core.viewport.angle(a);};
            };
            this.render = new function(){
                this.frame = function(noClear=false){return core.render.frame(noClear);};
                this.active = function(bool){return core.render.active(bool);};
            };
            this.stats = new function(){
                this.active = function(bool){return core.stats.active(bool);};
                this.getReport = function(){return core.stats.getReport();};
            };
            this.callback = new function(){
                this.onmousedown = function(x,y,event){};
                core.callback.onmousedown = function(surface){
                    return function(x,y,event){ surface.onmousedown(x,y,event); };
                }(this);
            
                this.onmouseup = function(x,y,event){};
                core.callback.onmouseup = function(surface){
                    return function(x,y,event){ surface.onmouseup(x,y,event); };
                }(this);
            
                this.onmousemove = function(x,y,event){};
                core.callback.onmousemove = function(surface){
                    return function(x,y,event){ surface.onmousemove(x,y,event); };
                }(this);
            
                this.onmouseenter = function(x,y,event){};
                core.callback.onmouseenter = function(surface){
                    return function(x,y,event){ surface.onmouseenter(x,y,event); };
                }(this);
            
                this.onmouseleave = function(x,y,event){};
                core.callback.onmouseleave = function(surface){
                    return function(x,y,event){ surface.onmouseleave(x,y,event); };
                }(this);
            
                this.onwheel = function(x,y,event){};
                core.callback.onwheel = function(surface){
                    return function(x,y,event){ surface.onwheel(x,y,event); };
                }(this);
            
                this.onkeydown = function(x,y,event){};
                core.callback.onkeydown = function(surface){
                    return function(x,y,event){ surface.onkeydown(x,y,event); };
                }(this);
                
                this.onkeyup = function(x,y,event){};
                core.callback.onkeyup = function(surface){
                    return function(x,y,event){ surface.onkeyup(x,y,event); };
                }(this);
            };
        };
        canvas.system = new function(){};
        canvas.system.mouse = new function(){
            //connect callbacks to mouse function lists
                canvas.core.callback.onmousedown = function(x,y,event){
                    console.log( canvas.core.arrangement.getElementUnderPoint(x,y) );
                    // canvas.core.arrangement.remove( canvas.core.arrangement.getElementUnderPoint(x,y) );
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousedown)(event,{x:x,y:y});
                };
                canvas.core.callback.onmousemove = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousemove)(event,{x:x,y:y});
                };
                canvas.core.callback.onmouseup = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseup)(event,{x:x,y:y});
                };
                canvas.core.callback.onmouseleave = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseleave)(event,{x:x,y:y});
                };
                canvas.core.callback.onmouseenter = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseenter)(event,{x:x,y:y});
                };
                canvas.core.callback.onwheel = function(x,y,event){
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onwheel)(event,{x:x,y:y});
                };
            
            
            //setup basic function lists
            //(plus a '.tmp' for storing values)
                this.tmp = {};
                this.functionList = {};
            
                this.functionList.onmousedown = [
                    {
                        'specialKeys':[],
                        'function':function(event,data){
                            //save the old listener functions of the canvas
                                canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
                                canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
                                canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;
            
                            //save the viewport position and click position
                                canvas.system.mouse.tmp.oldPosition = canvas.core.viewport.position();
                                canvas.system.mouse.tmp.clickPosition = {x:event.x, y:event.y};
            
                            //replace the canvas's listeners 
                                canvas.onmousemove = function(event){
                                    //update the viewport position
                                        canvas.core.viewport.position(
                                            canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.core.viewport.scale()),
                                            canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.core.viewport.scale()),
                                        );
                                };
            
                                canvas.onmouseup = function(){
                                    //put back the old listeners 
                                        this.onmousemove = canvas.system.mouse.tmp.onmousemove_old;
                                        this.onmouseleave = canvas.system.mouse.tmp.onmouseleave_old;
                                        this.onmouseup = canvas.system.mouse.tmp.onmouseup_old;
            
                                    //delete all the tmp data
                                        canvas.system.mouse.tmp = {};
                                };
            
                                canvas.onmouseleave = canvas.onmouseup;
            
                            //request that the function list stop here
                                return true;
                        }
                    }
                ];
                this.functionList.onmousemove = [];
                this.functionList.onmouseup = [];
                this.functionList.onmouseleave = [];
                this.functionList.onmouseenter = [];
                this.functionList.onwheel = [
                {
                    'specialKeys':[],
                    'function':function(event,data){
                        var scaleLimits = {'max':20, 'min':0.1};
            
                        //perform scale and associated pan
                            //discover point under mouse
                                var originalPoint = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                            //perform actual scaling
                                var scale = canvas.core.viewport.scale();
                                scale -= scale*(event.deltaY/100);
                                if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                                if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                                canvas.core.viewport.scale(scale);
                            //discover point under mouse
                                var newPoint = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                            //pan so we're back at the old point (accounting for angle)
                                var pan = canvas.library.math.cartesianAngleAdjust(
                                    (newPoint.x - originalPoint.x),
                                    (newPoint.y - originalPoint.y),
                                    canvas.core.viewport.angle()
                                );
                                var temp = canvas.core.viewport.position();
                                canvas.core.viewport.position(temp.x+pan.x,temp.y+pan.y)
            
                        //request that the function list stop here
                            return true;
                    }
                }
            ];
        };
        canvas.system.keyboard = new function(){
            canvas.core.callback.onkeydown = function(x,y,event){
                //if key is already pressed, don't press it again
                    if(canvas.system.keyboard.pressedKeys[event.code]){ return; }
                    canvas.system.keyboard.pressedKeys[event.code] = true;
                
                //perform action
                    canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeydown)(event,{x:x,y:y});
            };
            canvas.core.callback.onkeyup = function(x,y,event){
                //if key isn't pressed, don't release it
                    if(!canvas.system.keyboard.pressedKeys[event.code]){return;}
                    delete canvas.system.keyboard.pressedKeys[event.code];
                
                //perform action
                    canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeyup)(event,{x:x,y:y});
            };
            
            this.releaseAll = function(){
                for(var a = 0; a < this.pressedKeys.length; a++){
                    this.releaseKey(this.pressedKeys[a]);
                }
            };
            this.releaseKey = function(keyCode){
                canvas.onkeyup( new KeyboardEvent('keyup',{'key':keyCode}) );
            }
            
            this.pressedKeys = {};
            
            this.functionList = {};
            this.functionList.onkeydown = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
            this.functionList.onkeyup = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
        };
        
        
        canvas.core.render.active(true);

        function tester(item1,item2){
            function getType(obj){
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
            }
            function comparer(item1,item2){
                if(getType(item1) != getType(item2)){ return false; }
                if(typeof item1 == 'boolean' || typeof item1 == 'number' || typeof item1 == 'string'){ return item1 === item2; }
                if(typeof item1 === 'undefined' || typeof item2 === 'undefined' || item1 === null || item2 === null){ return item1 === item2;  }
                if(getType(item1) == 'function'){
                    item1 = item1.toString();
                    item2 = item2.toString();
        
                    var item1_functionHead = item1.substring(0,item1.indexOf('{'));
                    item1_functionHead = item1_functionHead.substring(item1_functionHead.indexOf('(')+1, item1_functionHead.lastIndexOf(')'));
                    var item1_functionBody = item1.substring(item1.indexOf('{')+1, item1.lastIndexOf('}'));
        
                    var item2_functionHead = item2.substring(0,item2.indexOf('{'));
                    item2_functionHead = item2_functionHead.substring(item2_functionHead.indexOf('(')+1, item2_functionHead.lastIndexOf(')'));
                    var item2_functionBody = item2.substring(item2.indexOf('{')+1, item2.lastIndexOf('}'));
        
                    return item1_functionHead.trim() == item2_functionHead.trim() && item1_functionBody.trim() == item2_functionBody.trim();
                }
                if(typeof item1 == 'object'){
                    var keys = Object.keys(item1);
                    var result = true;
                    for(var a = 0; a < keys.length; a++){
                        result = result && comparer(item1[keys[a]],item2[keys[a]]);
                    }
                    return result;
                }
                return false;
            }
        
            if( comparer(item1,item2) ){
                console.log('%cpass', 'color: green;'); return true;
            }else{
                console.log(item1 ,'!=', item2);
                console.log('%cfail', 'color: red;'); return false;
            }
        }
        
        

        
        // -- Only one test per time -- //
        var grou1 = canvas.core.arrangement.createElement('group');
            grou1.name = 'testGroup1';
            grou1.x = 50; grou1.y = 50;
            grou1.angle = 0.3;
            canvas.core.arrangement.append(grou1);
        
        var rect = canvas.core.arrangement.createElement('rectangle');
            rect.name = 'testRectangle1';
            rect.x = 0; rect.y = 0;
            rect.width = 30; rect.height = 30;
            rect.style.fill = 'rgba(0,255,0,0.3)';
            grou1.children.push(rect);
            rect.parent = grou1;
            canvas.core.arrangement.forceRefresh(rect);
        
        var rect = canvas.core.arrangement.createElement('rectangle');
            rect.name = 'testRectangle2';
            rect.x = 30; rect.y = 30;
            rect.width = 30; rect.height = 30;
            rect.style.fill = 'rgba(0,255,0,0.3)';
            grou1.children.push(rect);
            rect.parent = grou1;
            canvas.core.arrangement.forceRefresh(rect);
        
        canvas.core.render.frame();


    }
}
