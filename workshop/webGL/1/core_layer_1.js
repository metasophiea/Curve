var core = new function(){
    var canvas = document.getElementById("canvas");
    var core = this;

    this.shape = new function(){
        this.library = new function(){};

        this.create = function(type){ 
            try{ return new this.library[type](); }
            catch(e){
                console.warn('the shape type: "'+type+'" could not be found');
            }
        };
    };
    this.arrangement = new function(){
        var design;

        this.createElement = function(type){ return new shape[type]; };

        this.new = function(){ design = core.shape.create('group'); };
        this.get = function(){ return design; };
        this.set = function(arrangement){ design = arrangement; };
        this.prepend = function(element){ design.prepend(element); };
        this.append = function(element){ design.append(element); };
        this.remove = function(element){ design.remove(element); };
        this.clear = function(){ design.clear(); };

        this.getElementUnderPoint = function(x,y){ return design.getElementUnderPoint(x,y); };
        this.getElementsUnderArea = function(points){ return design.getElementsUnderArea(points); };
    };
    this.render = new function(){
        var pageData = {
            defaultSize:{width:640, height:480},
            windowWidth:0, windowHeight:0,
            selectedWidth:0, selectedHeight:0,
            width:0, height:0,
        };
        var context = canvas.getContext("webgl", {alpha:false, preserveDrawingBuffer:true });
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
        
                    var attribute = canvasElement.getAttribute('canvasElement'+Direction);
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
                context.clear(context.COLOR_BUFFER_BIT);
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
    
                this.rate = workspace.library.math.averageArray( this.frameTimeArray );
    
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
};
















core.shape.library.group = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'group'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{} };
            this.ignored = false;
            this.heedCamera = false;
        
        //attributes pertinent to extremity calculation
            var x = 0;               this.x =      function(a){ if(a==undefined){return x;}     x = a;      computeExtremities(); };
            var y = 0;               this.y =      function(a){ if(a==undefined){return y;}     y = a;      computeExtremities(); };
            var angle = 0;           this.angle =  function(a){ if(a==undefined){return angle;} angle = a;  computeExtremities(); };
            var scale = 1;           this.scale =  function(a){ if(a==undefined){return scale;} scale = a;  computeExtremities(); };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '/') + this.name; };

    //group functions
        function getChildByName(name){ return children.find(a => a.name == name); }
        function checkForName(name){ return getChildByName(name) != undefined; }
        function isValidShape(shape){
            if( shape.name.length == 0 ){
                console.warn('group error: shape with no name being inserted into group "'+self.getAddress()+'", therefore; the shape will not be added');
                return false;
            }
            if( checkForName(shape.name) ){
                console.warn('group error: shape with name "'+shape.name+'" already exists in group "'+self.getAddress()+'", therefore; the shape will not be added');
                return false;
            }

            return true;
        }

        var children = [];
        this.children = function(){return children;};
        this.getChildByName = getChildByName;
        this.append = function(shape){
            if( !isValidShape(shape) ){ return; }

            children.push(shape); 
            shape.parent = this; 
            shape.computeExtremities(); 
        };
        this.prepend = function(shape){
            if( !isValidShape(shape) ){ return; }

            children.unshift(shape); 
            shape.parent = this; 
            shape.computeExtremities(); 
        };
        this.remove = function(shape){ children.splice(children.indexOf(shape), 1); };
        this.clear = function(){ children = []; };
        this.getElementUnderPoint = function(x,y){
            var returnList = [];

            for(var a = children.length-1; a >= 0; a--){
                var item = children[a];

                if(item.ignored){return;}

                if( workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, item.extremities.boundingBox ) ){
                    if( item.getType() == 'group' ){
                        returnList = returnList.concat( item.getElementUnderPoint(x,y) );
                    }else{
                        if( workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, item.extremities.points ) ){
                            returnList = returnList.concat( item );
                        }
                    }
                }
            }

            return returnList;
        };
        this.getElementsUnderArea = function(points){
            var returnList = [];
            children.forEach(function(item){
                if(item.ignored){return;}

                if( workspace.library.math.detectOverlap.boundingBoxes( workspace.library.math.boundingBoxFromPoints(points), item.extremities.boundingBox ) ){
                    if( item.getType() == 'group' ){
                        returnList = returnList.concat( item.getElementUnderArea(points) );
                    }else{
                        if( workspace.library.math.detectOverlap.overlappingPolygons(points, item.extremities.points) ){
                            returnList = returnList.concat( item );
                        }
                    }
                }
            });

            return returnList;
        };

    //extremities
        function computeExtremities(informParent=true){
            //get offset from parent
                offset = self.parent && ! self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};

            //run computeExtremities on all children
                children.forEach(a => a.computeExtremities(false,offset));

            //gather extremities from children and calculate extremities here
                self.extremities.points = [];
                children.forEach(a => self.extremities.points = self.extremities.points.concat(a.extremities.points));
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);

            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        this.computeExtremities = computeExtremities;
        this.getOffset = function(){
            if(this.parent){
                var offset = this.parent.getOffset();

                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };

                return adjust;
            }else{
                return {x:x ,y:y ,scale:scale ,angle:angle};
            }
        };

    //lead render
        function shouldRender(){
            return workspace.library.math.detectOverlap.boundingBoxes( core.viewport.getCanvasBoundingBox(), self.extremities.boundingBox );
        }
        function drawDotFrame(){
            // self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y,2,{r:0,g:0,b:1,a:1}) );

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //if this shape shouldn't be rendered, just bail on the whole thing
                if(!shouldRender()){return;}

            //combine offset with group's position, angle and scale to produce new offset for chilren
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };
            
            //render children
                children.forEach(a => a.render(context,newOffset));

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        }
};
core.shape.library.rectangle = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'rectangle'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{} };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};

        //attributes pertinent to extremity calculation
            var x = 0;               this.x =      function(a){ if(a==undefined){return x;}      x = a;      computeExtremities(); };
            var y = 0;               this.y =      function(a){ if(a==undefined){return y;}      y = a;      computeExtremities(); };
            var angle = 0;           this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  computeExtremities(); };
            var anchor = {x:0,y:0};  this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; computeExtremities(); };
            var width = 10;          this.width =  function(a){ if(a==undefined){return width;}  width = a;  computeExtremities(); };
            var height = 10;         this.height = function(a){ if(a==undefined){return height;} height = a; computeExtremities(); };
            var scale = 1;           this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  computeExtremities(); };

    //addressing
        this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };

    //webGL rendering functions
        var program;
        var points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        var vertexShaderSource = `
            //constants
                attribute vec2 point;

            //variables
                struct location{
                    vec2 xy;
                    float scale;
                    float angle;
                };
                uniform location adjust;

                uniform vec2 resolution;
                uniform vec2 dimensions;
                uniform vec2 anchor;

            void main(){
                //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                //(including scale adjust)
                    vec2 P = point * dimensions * adjust.scale;
                    P = vec2( P.x - dimensions.x*anchor.x, P.y - dimensions.y*anchor.y );
                    P = vec2( 
                        P.x*cos(adjust.angle) + P.y*sin(adjust.angle), 
                        P.y*cos(adjust.angle) - P.x*sin(adjust.angle)
                    );
                    P += adjust.xy;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        var fragmentShaderSource = `  
            precision mediump float;
            uniform vec4 colour;
                                                                        
            void main(){
                gl_FragColor = colour;
            }
        `;
        function updateGLAttributes(context,adjust){
            var pointAttributeLocation = context.getAttribLocation(program, "point");
            var pointBuffer = context.createBuffer();
            context.enableVertexAttribArray(pointAttributeLocation);
            context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
            context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
            context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
    
            context.uniform2f(context.getUniformLocation(program, "adjust.xy"), adjust.x, adjust.y);
            context.uniform1f(context.getUniformLocation(program, "adjust.scale"), adjust.scale);
            context.uniform1f(context.getUniformLocation(program, "adjust.angle"), adjust.angle);
            context.uniform2f(context.getUniformLocation(program, "resolution"), context.canvas.width, context.canvas.height);
            context.uniform2f(context.getUniformLocation(program, "dimensions"), width, height);
            context.uniform2f(context.getUniformLocation(program, "anchor"), anchor.x, anchor.y);
            context.uniform4f(context.getUniformLocation(program, "colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
        }
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
        }

    //extremities
        function computeExtremities(informParent=true){
            //get offset from parent
                offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};

            //calculate points based on the offset
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };

                self.extremities.points = [];
                for(var a = 0; a < points.length; a+=2){
                    var P = {
                        x: points[a]   * width  * adjusted.scale , 
                        y: points[a+1] * height * adjusted.scale ,
                    };

                    self.extremities.points.push({ 
                        x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                        y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);
            
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function shouldRender(){
            return workspace.library.math.detectOverlap.boundingBoxes( core.viewport.getCanvasBoundingBox(), self.extremities.boundingBox );
        }
        function drawDotFrame(){
            self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //if this shape shouldn't be rendered, just bail on the whole thing
                if(!shouldRender()){return;}

            //combine offset with shape's position, angle and scale to produce adjust value for render
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };

            //activate shape render code
                activateGLRender(context,adjust);

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        };
};
core.shape.library.polygon = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'polygon'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{} };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};

        //attributes pertinent to extremity calculation
            var points = [];         this.points = function(a){ if(a==undefined){return points;} points = a; computeExtremities(); };
            var scale = 1;           this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  computeExtremities(); };
    
    //addressing
        this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };

    //webGL rendering functions
        var program;
        var vertexShaderSource = 
        GSLS_utilityFunctions + `
            //variables
                struct location{
                    vec2 xy;
                    float scale;
                    float angle;
                };
                uniform location offset;
    
                attribute vec2 point;
                uniform vec2 resolution;
    
            void main(){    
                //adjust point by offset
                    vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;
    
                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        var fragmentShaderSource = `  
            precision mediump float;
            uniform vec4 colour;
                                                                        
            void main(){
                gl_FragColor = colour;
            }
        `;
        function updateGLAttributes(context,offset){
            var pointAttributeLocation = context.getAttribLocation(program, "point");
            var pointBuffer = context.createBuffer();
            context.enableVertexAttribArray(pointAttributeLocation);
            context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
            context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
            context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
    
            context.uniform2f(context.getUniformLocation(program, "offset.xy"), offset.x, offset.y);
            context.uniform1f(context.getUniformLocation(program, "offset.scale"), offset.scale);
            context.uniform1f(context.getUniformLocation(program, "offset.angle"), offset.angle);
            context.uniform2f(context.getUniformLocation(program, "resolution"), context.canvas.width, context.canvas.height);
            context.uniform4f(context.getUniformLocation(program, "colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
        }
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram('polygon', vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, points.length/2);
        }

    //extremities
        function computeExtremities(informParent=true){
            //get offset from parent
                offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};

            //calculate points based on the offset
                self.extremities.points = [];
                for(var a = 0; a < points.length; a+=2){
                    var P = workspace.library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                    self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
                }
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);

            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function shouldRender(){
            return workspace.library.math.detectOverlap.boundingBoxes( core.viewport.getCanvasBoundingBox(), self.extremities.boundingBox );
        }
        function drawDotFrame(){
            self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
        }
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //if this shape shouldn't be rendered, just bail on the whole thing
                if(!shouldRender()){return;}

            //activate shape render code
                activateGLRender(context,offset);

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        };
};
core.shape.library.circle = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'circle'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{} };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};

        //attributes pertinent to extremity calculation
            var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      computeExtremities(); };
            var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      computeExtremities(); };
            var radius = 10;        this.radius = function(a){ if(a==undefined){return radius;} radius = a; computeExtremities(); };
            var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  computeExtremities(); };
            var detail = 25;        this.detail = function(a){ 
                                        if(a==undefined){return detail;} detail = a;

                                        points = [];
                                        for(var a = 0; a < detail; a++){
                                            points.push(
                                                Math.sin( 2*Math.PI * (a/detail) ),
                                                Math.cos( 2*Math.PI * (a/detail) )
                                            );
                                        }

                                        computeExtremities();
                                    };
           
    //addressing
        this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };

    //webGL rendering functions
        var program;
        var points = []; this.detail(detail);
        var vertexShaderSource = `
        //constants
            attribute vec2 point;

        //variables
            struct location{
                vec2 xy;
                float scale;
                float angle;
            };
            uniform location adjust;

            uniform vec2 resolution;
            uniform float radius;
            uniform vec2 anchor;

        void main(){
            //adjust points by radius and xy offset
                vec2 P = point * radius * adjust.scale;
                P += adjust.xy;  

            //convert from unit space to clipspace
                gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
        }
    `;
    var fragmentShaderSource = `  
        precision mediump float;
        uniform vec4 colour;
                                                                    
        void main(){
            gl_FragColor = colour;
        }
    `;
    function updateGLAttributes(context,adjust){
        var pointAttributeLocation = context.getAttribLocation(program, "point");
        var pointBuffer = context.createBuffer();
        context.enableVertexAttribArray(pointAttributeLocation);
        context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
        context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);

        context.uniform2f(context.getUniformLocation(program, "adjust.xy"), adjust.x, adjust.y);
        context.uniform1f(context.getUniformLocation(program, "adjust.scale"), adjust.scale);
        context.uniform1f(context.getUniformLocation(program, "adjust.angle"), 0);
        context.uniform2f(context.getUniformLocation(program, "resolution"), context.canvas.width, context.canvas.height);
        context.uniform1f(context.getUniformLocation(program, "radius"), radius);
        context.uniform4f(context.getUniformLocation(program, "colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
    }
    function activateGLRender(context,adjust){
        if(program == undefined){ program = core.render.produceProgram('circle', vertexShaderSource, fragmentShaderSource); }

        context.useProgram(program);
        updateGLAttributes(context,adjust);
        context.drawArrays(context.TRIANGLE_FAN, 0, points.length/2);
    }

    //extremities
        function computeExtremities(informParent=true){
            //get offset from parent
                offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};

            //calculate points based on the offset
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -offset.angle,
                };

                self.extremities.points = [];
                for(var a = 0; a < points.length; a+=2){
                    self.extremities.points.push({
                        x: (points[a]   * radius * adjust.scale) + adjust.x,
                        y: (points[a+1] * radius * adjust.scale) + adjust.y,
                    });
                }
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);
            
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function shouldRender(){
            return workspace.library.math.detectOverlap.boundingBoxes( core.viewport.getCanvasBoundingBox(), self.extremities.boundingBox );
        }
        function drawDotFrame(){
            self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //if this shape shouldn't be rendered, just bail on the whole thing
                if(!shouldRender()){return;}

            //combine offset with shape's position, angle and scale to produce adjust value for render
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -offset.angle,
                };

            //activate shape render code
                activateGLRender(context,adjust);

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        };
};
















core.arrangement.new();