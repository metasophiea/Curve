_canvas_.core = new function(){
    var core = this;

    _canvas_.setAttribute('tabIndex',1);

    this.shape = new function(){
        {{include:shape.js}}
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
};