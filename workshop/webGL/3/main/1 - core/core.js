var core = this;

_canvas_.setAttribute('tabIndex',1);

this.shape = new function(){
    this.library = new function(){
        {{include:shapes/*}} */
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
    var design = core.shape.create('group');

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
    this.getTree = function(){ return design.getTree(); };
    this.printTree = function(mode='address'){ //modes: tabular / address
        function recursivePrint(grouping,prefix=''){
            grouping.children.forEach(function(a){
                if(mode == 'tabular'){
                    console.log(prefix+'- \t'+a.type +': '+ a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                }else if(mode == 'address'){
                    console.log(prefix+'/'+a.type +':'+ a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                }
            });
        }

        recursivePrint(this.getTree(), '');
    };
};
this.render = new function(){
    var pageData = {
        defaultSize:{width:640, height:480},
        windowWidth:0, windowHeight:0,
        selectedWidth:0, selectedHeight:0,
        width:0, height:0,
    };
    var context = _canvas_.getContext("webgl", {alpha:false, preserveDrawingBuffer:true, stencil:true });
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
                var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)
    
                var attribute = canvasElement.getAttribute(__canvasPrefix+'Element'+Direction);
                if( pageData['selected'+Direction] != attribute || pageData['window'+Direction] != window['inner'+Direction] ){
                    //save values for future reference
                        pageData['selected'+Direction] = attribute;
                        pageData['window'+Direction] = window['inner'+Direction];
    
                    //adjust canvas dimension based on the size requirement set out in the canvasElement attribute
                        var size = {css:0, element:0};
                        if(attribute == undefined){
                            size.element = pageData.defaultSize[direction] * window.devicePixelRatio;
                            size.css = pageData.defaultSize[direction];
                        }else if( attribute.indexOf('%') == (attribute.length-1) ){
                            var parentSize = canvasElement.parentElement['offset'+Direction]
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
            }
    
            dimensionAdjust('height');
            dimensionAdjust('width');

            return changesMade;
        };
        this.refreshCoordinates = function(){
            var w = context.canvas.width;
            var h = context.canvas.height;
            var m = window.devicePixelRatio;

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

    //actual render
        function renderFrame(){
            context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
            core.arrangement.get().render(context);
        }
        function animate(timestamp){
            animationRequestId = requestAnimationFrame(animate);
    
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
            dot.x(x); dot.y(y);
            dot.colour = colour;
            dot.radius(r);
            dot.dotFrame = false;
            dot.render(context);
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
            this.calculateViewportExtremities();
        };
        this.getBoundingBox = function(){ return viewbox.boundingBox; };
};
this.viewport.refresh();

this.callback = new function(){
    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onkeydown', 'onkeyup',
    ];
    var mouseposition = {x:undefined,y:undefined};

    //default
        for(var a = 0; a < callbacks.length; a++){
            _canvas_[callbacks[a]] = function(callback){
                return function(event){
                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the point, original event, and shapes
                        core.callback[callback]( event.x, event.y, event, shapes );
                }
            }(callbacks[a]);
        }

    //special cases
        //onmousemove / onmouseenter / onmouseleave
            var shapeMouseoverList = [];
            _canvas_.onmousemove = function(event){
                //update the stored mouse position
                    mouseposition = {x:event.x,y:event.y};

                //check for onmouseenter / onmouseleave
                    //get all shapes under point that have onmouseenter or onmouseleave callbacks
                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a.onmouseenter!=undefined || a.onmouseleave!=undefined);
                    //go through this list, comparing to the shape transition list
                        //shapes only on shapes list; run onmouseenter and add to shapeMouseoverList
                        //shapes only on shapeMouseoverList; run onmouseleave and remove from shapeMouseoverList
                        var diff = _canvas_.library.math.getDifferenceOfArrays(shapeMouseoverList,shapes);
                        diff.b.forEach(function(a){
                            if(a.onmouseenter){a.onmouseenter( event.x, event.y, event, shapes );}
                            shapeMouseoverList.push(a);
                        });
                        diff.a.forEach(function(a){
                            if(a.onmouseleave){a.onmouseleave( event.x, event.y, event, shapes );}
                            shapeMouseoverList.splice(shapeMouseoverList.indexOf(a),1);
                        });

                //perform regular onmousemove actions
                    var callback = 'onmousemove';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the point, original event, and shapes
                        core.callback[callback]( event.x, event.y, event, shapes );
            };

        //onkeydown / onkeyup
            var tmp = ['onkeydown', 'onkeyup'];
            for(var a = 0; a < tmp.length; a++){
                _canvas_[tmp[a]] = function(callback){
                    return function(event){
                        //if core doesn't have this callback set up, just bail
                            if( !core.callback[callback] ){return;}
                    
                        //get the shapes under this point that have this callback, in order of front to back
                            var shapes = core.arrangement.getElementsUnderPoint(mouseposition.x,mouseposition.y).filter(a => a[callback]!=undefined);

                        //activate core's callback, providing the point, original event, and shapes
                            core.callback[callback]( mouseposition.x, mouseposition.y, event, shapes );
                    }
                }(tmp[a]);
            }

        //onmousedown / onmouseup / onclick
            var shapeMouseclickList = [];
            _canvas_.onclick = function(){};
            _canvas_.onmousedown = function(event){
                //save current shapes for use in the onmouseup callback
                    shapeMouseclickList = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a.onclick!=undefined);

                //perform regular onmousedown actions
                    var callback = 'onmousedown';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the point, original event, and shapes
                        core.callback[callback]( event.x, event.y, event, shapes );
            };
            _canvas_.onmouseup = function(event){
                //for the shapes under the mouse that are also on the shapeMouseclickList, activate their "onclick" callback
                    var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a.onclick!=undefined);
                    shapes.forEach(function(a){ if( shapeMouseclickList.includes(a) ){ a.onclick(event.x, event.y, event, shapes); } });

                //perform regular onmouseup actions
                    var callback = 'onmouseup';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the point, original event, and shapes
                        core.callback[callback]( event.x, event.y, event, shapes );
            };
};