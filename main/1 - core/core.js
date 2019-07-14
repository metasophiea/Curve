var core = this;

_canvas_.setAttribute('tabIndex',1);

this.devMode = false;

this.shape = new function(){
    this.library = new function(){
        const library = this;
        {{include:shapes/main.js}}
    };

    this.checkShape = function(name,shape){
        var tmp = new shape();

        if(name == undefined || shape == undefined){ return 'shape or name missing'; }
        if(tmp.getType() != name){ return 'internal type ('+tmp.getType()+') does not match key ('+name+')';  }

        return '';
    };
    this.checkShapes = function(list){
        for(item in list){
            var response = this.checkShape(item, list[item]);
            if(response.length != 0){ console.error('core.shapes error:', item, '::', response); }
        }
    };

    this.create = function(type){ 
        try{ return new this.library[type](); }
        catch(e){
            console.warn('the shape type: "'+type+'" could not be found');
            console.error(e);
        }
    };
};
this.shape.checkShapes(this.shape.library);

this.arrangement = new function(){
    var design = core.shape.create('group'); design.name = 'root';

    this.new = function(){ design = core.shape.create('group'); };
    this.get = function(){ return design; };
    this.set = function(arrangement){ design = arrangement; };
    this.prepend = function(element){ design.prepend(element); };
    this.append = function(element){ design.append(element); };
    this.remove = function(element){ design.remove(element); };
    this.clear = function(){ design.clear(); };

    this.getElementByAddress = function(address){
        var route = address.split('/'); route.shift();

        var currentObject = design;
        route.forEach(function(a){
            currentObject = currentObject.getChildByName(a);
        });

        return currentObject;
    };
    this.getElementsUnderPoint = function(x,y){ return design.getElementsUnderPoint(x,y); };
    this.getElementsUnderArea = function(points){ return design.getElementsUnderArea(points); };
    this.printTree = function(mode='spaced'){ //modes: spaced / tabular / address
        function recursivePrint(grouping,prefix=''){
            grouping.children.forEach(function(a){
                if(mode == 'spaced'){
                    console.log(prefix+'- '+a.type +': '+ a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'- ') }
                }else if(mode == 'tabular'){
                    console.log(prefix+'- \t'+a.type +': '+ a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                }else if(mode == 'address'){
                    console.log(prefix+'/'+a.type +':'+ a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                }
            });
        }

        recursivePrint(design.getTree(), '');
    };
};
this.render = new function(){
    var pageData = {
        defaultSize:{width:640, height:480},
        windowWidth:0, windowHeight:0,
        selectedWidth:0, selectedHeight:0,
        width:0, height:0,
    };
    var context = _canvas_.getContext("webgl", {alpha:false, preserveDrawingBuffer:true, stencil:true});
    var animationRequestId = undefined;
    var clearColour = {r:1,g:1,b:1,a:1};

    //webGL setup
        context.enable(context.BLEND);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

    //webGL program production
        var storedPrograms = {};
        this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource){
            function compileProgram(vertexShaderSource, fragmentShaderSource){
                function createShader(type, source){
                    var shader = context.createShader(type);
                    context.shaderSource(shader, source);
                    context.compileShader(shader);
                    var success = context.getShaderParameter(shader, context.COMPILE_STATUS);
                    if(success){ return shader; }
            
                    console.error('major error in core\'s "'+ type +'" shader creation');
                    console.error(context.getShaderInfoLog(shader));
                    context.deleteShader(shader);
                }
    
                var program = context.createProgram();
                context.attachShader(program, createShader(context.VERTEX_SHADER,vertexShaderSource) );
                context.attachShader(program, createShader(context.FRAGMENT_SHADER,fragmentShaderSource) );
                context.linkProgram(program);
                var success = context.getProgramParameter(program, context.LINK_STATUS);
                if(success){ return program; }
            
                console.error('major error in core\'s program creation');
                console.error(context.getProgramInfoLog(program));
                context.deleteProgram(program);
            };

            if( !(name in storedPrograms) ){
                storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                context.useProgram(storedPrograms[name]);
            }

            return storedPrograms[name];
        }
    
    //canvas and webGL context adjustment
        this.clearColour = function(colour){
            if(colour == undefined){ return clearColour; }
            clearColour = colour;
            context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
        };
        this.adjustCanvasSize = function(){
            var changesMade = false;
            var canvasElement = context.canvas;

            function dimensionAdjust(direction){
                var Direction = direction.charAt(0).toUpperCase() + direction.slice(1);
    
                var attribute = canvasElement.getAttribute(__canvasPrefix+'Element'+Direction);

                //save values for future reference
                    pageData['selected'+Direction] = attribute;
                    pageData['window'+Direction] = window['inner'+Direction];

                //adjust canvas dimension based on the size requirement set out in the canvasElement attribute
                    var size = {css:0, element:0};
                    if(attribute == undefined){
                        size.element = pageData.defaultSize[direction] * window.devicePixelRatio;
                        size.css = pageData.defaultSize[direction];
                    }else if( attribute.indexOf('%') == (attribute.length-1) ){
                        var parentSize = canvasElement.parentElement['offset'+Direction];
                        var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                        size.element = parentSize * percent * window.devicePixelRatio;
                        size.css = parentSize * percent;
                    }else{
                        size.element = attribute * window.devicePixelRatio;
                        size.css = attribute;
                    }

                    pageData[direction] = size.css;
                    canvasElement[direction] = size.element;
                    canvasElement.style[direction] = size.css + "px";

                changesMade = true;
            }
    
            //run everything twice, to cover the event of one of the
            //first two creating a scrollbar in the browser window
            dimensionAdjust('height');
            dimensionAdjust('width');
            dimensionAdjust('height');
            dimensionAdjust('width');

            return changesMade;
        };
        this.refreshCoordinates = function(){
            var w = context.canvas.width;
            var h = context.canvas.height;
            // var m = window.devicePixelRatio;

            var x, y, width, height = 0;
            if(window.devicePixelRatio == 1){
                x = 0;
                y = 0;
                width = w;
                height = h;
            }else{
                x = 0;
                y = -h;
                width = w*2;
                height = h*2;
            }

            context.viewport( x, y, width, height );
        };
        this.refresh = function(){
            this.clearColour(clearColour);
            this.adjustCanvasSize();
            this.refreshCoordinates();
        };this.refresh();

    //frame rate control
        var frameRateControl = { active:false, previousRenderTime:Date.now(), limit:30, interval:0 };
        this.activeLimitToFrameRate = function(a){if(a==undefined){return frameRateControl.active;}frameRateControl.active=a};
        this.frameRateLimit = function(a){if(a==undefined){return frameRateControl.limit;}frameRateControl.limit=a;frameRateControl.interval=1000/frameRateControl.limit;};
        this.frameRateLimit(this.frameRateLimit());

    //actual render
        function renderFrame(){
            context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
            core.arrangement.get().render(context,{x:0,y:0,scale:1,angle:0});
        }
        function animate(timestamp){
            animationRequestId = requestAnimationFrame(animate);

            //limit frame rate
                if(frameRateControl.active){
                    var currentRenderTime = Date.now();
                    var delta = currentRenderTime - frameRateControl.previousRenderTime;
                    if(delta < frameRateControl.interval){ return; }
                    frameRateControl.previousRenderTime = currentRenderTime - delta%frameRateControl.interval;
                }

            //attempt to render frame, if there is a failure; stop animation loop and report the error
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

    //misc
        this.getCanvasDimensions = function(){ return {width:pageData.width, height:pageData.height}; };
        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
            var dot = core.shape.create('circle');
            dot.name = 'core-drawDot-dot';
            dot.stopAttributeStartedExtremityUpdate = true;
            dot.dotFrame = false;
            dot.x(x); dot.y(y);
            dot.radius(r);
            dot.computeExtremities();
            dot.colour = colour;
            dot.render(context);
        };
        // this.__context = function(){return context;};
};
this.stats = new function(){
    var active = false;
    var average = 30;
    var lastTimestamp = 0;

    var framesPerSecond = {
        compute:function(timestamp){
            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
            if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }

            this.rate = _canvas_.library.math.averageArray( this.frameTimeArray );

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

this.viewport = new function(){
    var state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
    };
    var viewbox = {
        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
    };
    var mouseData = { 
        x:undefined, 
        y:undefined, 
        stopScrollActive:false,
        clickVisibility:false,
    };

    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                var position = core.viewport.position();
                var scale = core.viewport.scale();
                var angle = core.viewport.angle();

                var tmp = {x:x, y:y};
                tmp.x = (tmp.x - position.x)/scale;
                tmp.y = (tmp.y - position.y)/scale;
                tmp = _canvas_.library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);

                return tmp;
            };
            // this.workspacePoint2windowPoint = function(x,y){
            //     var position = core.viewport.position();
            //     var scale = core.viewport.scale();
            //     var angle = core.viewport.angle();

            //     var point = _canvas_.library.math.cartesianAngleAdjust(x,y,angle);

            //     return {
            //         x: (point.x+position.x) * scale,
            //         y: (point.y+position.y) * scale
            //     };
            // };
        };

    //camera position
        this.position = function(x,y){
            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
            state.position.x = x;
            state.position.y = y;

            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.x(state.position.x); item.y(state.position.y); }
            });

            calculateViewportExtremities();
        };
        this.scale = function(s){
            if(s == undefined){return state.scale;}
            state.scale = s <= 0 ? 1 : s;
            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.scale(state.scale); }
            });
            calculateViewportExtremities();
        };
        this.angle = function(a){
            if(a == undefined){return state.angle;}
            state.angle = a;
            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.angle(state.angle); }
            });
            calculateViewportExtremities();
        };

    //mouse interaction
        this.getElementUnderCanvasPoint = function(x,y){
            var xy = this.adapter.windowPoint2canvasPoint(x,y);
            return core.arrangement.getElementUnderPoint(xy.x,xy.y);
        };
        this.getElementsUnderCanvasArea = function(points){
            return core.arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2canvasPoint(a.x,a.y)));
        };

    //misc
        function calculateViewportExtremities(){
            var canvasDimensions = core.render.getCanvasDimensions();

            //for each corner of the viewport; find out where they lie on the canvas
                viewbox.points.tl = {x:0, y:0};
                viewbox.points.tr = {x:canvasDimensions.width, y:0};
                viewbox.points.bl = {x:0, y:canvasDimensions.height};
                viewbox.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
            //calculate a bounding box for the viewport from these points
                viewbox.boundingBox = _canvas_.library.math.boundingBoxFromPoints([viewbox.points.tl, viewbox.points.tr, viewbox.points.br, viewbox.points.bl]);
        }
        this.calculateViewportExtremities = calculateViewportExtremities;
        this.refresh = function(){
            core.render.refresh();
            calculateViewportExtremities();
        };
        this.getBoundingBox = function(){ return viewbox.boundingBox; };
        this.cursor = function(type){
            //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
            if(type == undefined){return document.body.style.cursor;}
            document.body.style.cursor = type;
        };
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
        this.clickVisibility = function(a){ if(a==undefined){return mouseData.clickVisibility;} mouseData.clickVisibility=a; };
        this.getHeight = function(){ return viewbox.points.br.y - viewbox.points.tl.y; };        
        this.getWidth= function(){ return viewbox.points.br.x - viewbox.points.tl.x; };   
};
this.viewport.refresh();

this.callback = new function(){
    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onkeydown', 'onkeyup',
    ];
    this.listCallbackTypes = function(){return callbacks;};

    var shapeCallbackStates = {}; callbacks.forEach(callbackType => shapeCallbackStates[callbackType] = true);
    this.getShapeCallbackState = function(type){return shapeCallbackStates[type];};
    this.activateShapeCallback = function(type){shapeCallbackStates[type] = true;};
    this.disactivateShapeCallback = function(type){shapeCallbackStates[type] = false;};
    this.activateAllShapeCallbacks = function(){ callbacks.forEach(callback => this.activateShapeCallback(callback)); };
    this.disactivateAllShapeCallbacks = function(){ callbacks.forEach(callback => this.disactivateShapeCallback(callback)); };
    this.activateAllShapeCallbacks();

    function gatherDetails(event,callback,count){
        //only calculate enough data for what will be needed
        return {
            point: count > 0 ? core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y) : undefined,
            shapes: count > 3 ? core.arrangement.getElementsUnderPoint(event.X,event.Y).filter(a => a[callback]!=undefined) : undefined,
        };
    }
    this.functions = {};








    //default
        for(var a = 0; a < callbacks.length; a++){
            _canvas_[callbacks[a]] = function(callback){
                return function(event){
                    if( !core.callback.functions[callback] ){return;}

                    event.X = event.offsetX; event.Y = event.offsetY;

                    var data = gatherDetails(event,callback,core.callback.functions[callback].length);
                    core.callback.functions[callback]( data.point.x, data.point.y, event, data.shapes );
                }
            }(callbacks[a]);
        }

    //special cases
        //canvas onmouseenter / onmouseleave
            _canvas_.onmouseenter = function(event){
                //if appropriate, remove the window scrollbars
                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = 'hidden'; }
            };
            _canvas_.onmouseleave = function(event){
                //if appropriate, replace the window scrollbars
                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = ''; }
            };

        //onmousemove / onmouseenter / onmouseleave
            var shapeMouseoverList = [];
            _canvas_.onmousemove = function(event){
                event.X = event.offsetX; event.Y = event.offsetY;
                core.viewport.mousePosition(event.X,event.Y);
                var shapesUnderPoint = core.arrangement.getElementsUnderPoint(event.X,event.Y);
                var point = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //check for onmouseenter / onmouseleave
                    //get all shapes under point that have onmousemove, onmouseenter or onmouseleave callbacks
                        var shapes = shapesUnderPoint.filter(shape => shape.onmousemove!=undefined || shape.onmouseenter!=undefined || shape.onmouseleave!=undefined);
                    //run all onmousemove callbacks for shapes
                        if(shapeCallbackStates.onmousemove){
                            shapes.forEach(shape => { if(shape.onmousemove){shape.onmousemove( point.x, point.y, event );} });
                        }
                    //go through this list, comparing to the shape transition list
                        //shapes only on shapes list; run onmouseenter and add to shapeMouseoverList
                        //shapes only on shapeMouseoverList; run onmouseleave and remove from shapeMouseoverList
                        var diff = _canvas_.library.math.getDifferenceOfArrays(shapeMouseoverList,shapes);
                        diff.b.forEach(function(shape){
                            if(shapeCallbackStates.onmouseenter && shape.onmouseenter){shape.onmouseenter( point.x, point.y, event );}
                            shapeMouseoverList.push(shape);
                        });
                        diff.a.forEach(function(shape){
                            if(shapeCallbackStates.onmouseleave && shape.onmouseleave){shape.onmouseleave( point.x, point.y, event );}
                            shapeMouseoverList.splice(shapeMouseoverList.indexOf(shape),1);
                        });

                //perform regular onmousemove actions
                    if(core.callback.functions.onmousemove){
                        core.callback.functions.onmousemove( point.x, point.y, event, shapesUnderPoint.filter(shape => shape.onmousemove!=undefined) );
                    }
            };

        //onwheel
            _canvas_.onwheel = function(event){
                event.X = event.offsetX; event.Y = event.offsetY;

                if(shapeCallbackStates.onwheel){
                    var point = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                    core.arrangement.getElementsUnderPoint(event.X,event.Y).filter(shape => shape.onwheel!=undefined).forEach(shape => { shape.onwheel(point.x,point.y,event); });
                }

                if(core.callback.functions.onwheel){
                    var data = gatherDetails(event,'onwheel',core.callback.functions.onwheel.length);
                    core.callback.functions.onwheel( data.point.x, data.point.y, event, data.shapes );
                }
            };

        //onkeydown / onkeyup
            ['onkeydown', 'onkeyup'].forEach(callbackName => {
                _canvas_[callbackName] = function(callback){
                    return function(event){
                        var p = core.viewport.mousePosition(); event.X = p.x; event.Y = p.y;
                        var point = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                        if(shapeCallbackStates[callback]){
                            core.arrangement.getElementsUnderPoint(event.X,event.Y).filter(shape => shape[callback]!=undefined).forEach(shape => { shape[callback](point.x,point.y,event); });
                        }
                
                        if(core.callback.functions[callback]){
                            var data = gatherDetails(event,callback,core.callback.functions[callback].length);
                            core.callback.functions[callback]( point.x, point.y, event, data.shapes );
                        }
                    }
                }(callbackName);
            });

        //onmousedown / onmouseup / onclick / ondblclick
            var shapeMouseclickList = [];
            var doubleClickCounter = 0;
            _canvas_.onmousedown = function(event){
                if(core.viewport.clickVisibility()){ core.render.drawDot(event.offsetX,event.offsetY); }

                event.X = event.offsetX; event.Y = event.offsetY;

                var shapesUnderPoint = core.arrangement.getElementsUnderPoint(event.X,event.Y);
                var workspacePoint = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //save current shapes for use in the onclick part of the onmouseup callback
                    shapeMouseclickList = shapesUnderPoint.filter(shape => shape.onclick!=undefined);

                //activate the onmousedown callback for all the shapes under this point
                    if(shapeCallbackStates.onmousedown){
                        shapesUnderPoint.filter(shape => shape.onmousedown!=undefined).forEach(shape => { 
                            if( shape.onmousedown ){ shape.onmousedown(workspacePoint.x,workspacePoint.y,event); }
                        });
                    }

                //perform global function
                    if(core.callback.functions.onmousedown){
                        core.callback.functions.onmousedown( workspacePoint.x, workspacePoint.y, event, shapesUnderPoint.filter(shape => shape.onmousedown!=undefined) );
                    }
            };
            _canvas_.onmouseup = function(event){
                event.X = event.offsetX; event.Y = event.offsetY;
                var point = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                
                //run callbacks for all shapes with the onmouseup callback
                    if(shapeCallbackStates.onmouseup){
                        core.arrangement.getElementsUnderPoint(event.X,event.Y).filter(shape => shape.onmouseup!=undefined).forEach(shape => { shape.onmouseup( point.x, point.y, event ); });
                    };

                //for the shapes under the mouse that are also on the shapeMouseclickList, activate their "onclick" callback
                    if(shapeCallbackStates.onclick){
                        core.arrangement.getElementsUnderPoint(event.X,event.Y).filter(shape => shape.onclick!=undefined).forEach(shape => { 
                            if( shapeMouseclickList.includes(shape) && shape.onclick ){ shape.onclick( point.x, point.y, event ); } 
                        });
                    }

                //for the shapes under the mouse that are also on the shapeMouseclickList, activate their "ondblclick" callback, if appropriate
                    if(shapeCallbackStates.ondblclick){
                        doubleClickCounter++;
                        setTimeout(function(){doubleClickCounter=0;},500);
                        if(doubleClickCounter >= 2){
                            core.arrangement.getElementsUnderPoint(event.X,event.Y).filter(shape => shape.ondblclick!=undefined).forEach(shape => { 
                                if( shapeMouseclickList.includes(shape) && shape.ondblclick ){ shape.ondblclick( point.x, point.y, event ); } 
                            });
                            doubleClickCounter = 0;
                        }
                    }
                    
                //perform global function
                    if(core.callback.functions.onmouseup){
                        var data = gatherDetails(event,'onmouseup',core.callback.functions.onmouseup.length);
                        core.callback.functions.onmouseup( data.point.x, data.point.y, event, data.shapes );
                    }

            };
            _canvas_.onclick = function(){
                if(core.callback.functions.onclick){
                    event.X = event.offsetX; event.Y = event.offsetY;
                    var data = gatherDetails(event,'onclick',core.callback.functions.onclick.length);
                    core.callback.functions.onclick( data.point.x, data.point.y, event, data.shapes );
                }
            };
            _canvas_.ondblclick = function(){
                if(core.callback.functions.ondblclick){
                    event.X = event.offsetX; event.Y = event.offsetY;
                    var data = gatherDetails(event,'ondblclick',core.callback.functions.ondblclick.length);
                    core.callback.functions.ondblclick( data.point.x, data.point.y, event, data.shapes );
                }
            };
};