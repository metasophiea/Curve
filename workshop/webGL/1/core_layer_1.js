var core = new function(){
    var core = this;

    this.shape = new function(){
        this.library = new function(){
            this.group = function(){
                this.x = 0;
                this.y = 0;
                this.scale = 1;
                this.angle = 0;
                var children = [];
    
                this.children = function(){return children;};
                this.append = function(shape){ children.push(shape); };
                this.prepend = function(shape){ children.unshift(shape); };
                this.remove = function(shape){ children.splice(children.indexOf(shape), 1); };
                this.clear = function(){ children = []; };
    
                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                    var point = workspace.library.math.cartesianAngleAdjust(this.x*offset.scale,this.y*offset.scale,offset.angle);
                    var result = { 
                        x: point.x + offset.x, 
                        y: point.y + offset.y, 
                        scale: offset.scale*this.scale,
                        angle: offset.angle + this.angle,
                    };
    
                    children.forEach(a => a.render(context,result));
                };
            };
            this.rectangle = function(){
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
                this.scale = 1;
                this.angle = 0;
                this.anchor = {x:0,y:0};
                this.colour = {r:1,g:0,b:0,a:1};
        
                var self = this;
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
                        uniform vec4 colour; varying vec4 FRAGMENTcolour;
    
                    void main(){
                        //pass colour through
                            FRAGMENTcolour = colour;
    
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
                            gl_Position = vec4( ((point+P) / resolution) * vec2(2, -2), 0, 1 );
                    }
                `;
                var fragmentShaderSource = `  
                    precision mediump float;
                    varying vec4 FRAGMENTcolour;
                                                                                
                    void main(){
                        gl_FragColor = FRAGMENTcolour;
                    }
                `;
                function setup(context, program){
                    //populate point buffer
                        var pointAttributeLocation = context.getAttribLocation(program, "point");
                        var pointBuffer = context.createBuffer();
                        context.enableVertexAttribArray(pointAttributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                        context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                };
                var program;
        
                function update(context,adjust){
                    context.uniform2f(context.getUniformLocation(program.p, "adjust.xy"), adjust.x, adjust.y);
                    context.uniform1f(context.getUniformLocation(program.p, "adjust.scale"), adjust.scale);
                    context.uniform1f(context.getUniformLocation(program.p, "adjust.angle"), adjust.angle);
                    context.uniform2f(context.getUniformLocation(program.p, "resolution"), context.canvas.width, context.canvas.height);
                    context.uniform2f(context.getUniformLocation(program.p, "dimensions"), self.width, self.height);
                    context.uniform2f(context.getUniformLocation(program.p, "anchor"), self.anchor.x, self.anchor.y);
                    context.uniform4f(context.getUniformLocation(program.p, "colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                }
    
                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                    // if(program == undefined){
                        program = {};
                        program.name = 'rectangle';
                        program.p = core.render.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource, setup);
                    // }
    
                    var point = workspace.library.math.cartesianAngleAdjust(this.x*offset.scale,this.y*offset.scale,offset.angle);
                    var result = { 
                        x: point.x + offset.x, 
                        y: point.y + offset.y, 
                        scale: offset.scale*this.scale,
                        angle: -(offset.angle + this.angle),
                    };
    
                    context.useProgram(program.p);
                    update(context,result);
                    context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                };
            };
            this.polygon = function(){
                this.points = [];
                this.scale = 1;
                this.colour = {r:1,g:0,b:0,a:1};
    
                var self = this;
    
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
                        uniform vec4 colour; varying vec4 FRAGMENTcolour;
    
                    void main(){
                        //pass colour through
                            FRAGMENTcolour = colour;
    
                        //adjust point by offset
                            vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;
    
                        //convert from unit space to clipspace
                            gl_Position = vec4( (P / resolution) * vec2(2, -2), 0, 1 );
                    }
                `;
                var fragmentShaderSource = `  
                    precision mediump float;
                    varying vec4 FRAGMENTcolour;
                                                                                
                    void main(){
                        gl_FragColor = FRAGMENTcolour;
                    }
                `;
                var program;
        
                function update(context,offset={x:0,y:0,scale:1,angle:0}){
                    var pointAttributeLocation = context.getAttribLocation(program.p, "point");
                    var pointBuffer = context.createBuffer();
                    context.enableVertexAttribArray(pointAttributeLocation);
                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(self.points), context.STATIC_DRAW);
    
                    context.uniform2f(context.getUniformLocation(program.p, "offset.xy"), offset.x, offset.y);
                    context.uniform1f(context.getUniformLocation(program.p, "offset.scale"), offset.scale);
                    context.uniform1f(context.getUniformLocation(program.p, "offset.angle"), offset.angle);
                    context.uniform2f(context.getUniformLocation(program.p, "resolution"), context.canvas.width, context.canvas.height);
                    context.uniform4f(context.getUniformLocation(program.p, "colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                }
    
                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                    // if(program == undefined){
                        program = {};
                        program.name = 'polygon';
                        program.p = core.render.produceProgram('polygon', vertexShaderSource, fragmentShaderSource);
                    // }
    
                    context.useProgram(program.p);
                    update(context,offset);
                    context.drawArrays(context.TRIANGLE_FAN, 0, this.points.length/2);
                };
            };
        };

        this.create = function(type){ return new this.library[type](); };
    };
    this.arrangement = new function(){
        var design = core.shape.create('group');

        this.createElement = function(type){ return new shape[type]; };
        this.get = function(){ return design; };
        this.set = function(arrangement){ design = arrangement; };
        this.prepend = function(element){ design.prepend(element); };
        this.append = function(element){ design.append(element); };
        this.remove = function(element){ design.remove(element); };
        this.clear = function(){ design.clear(); };
    };
    this.render = new function(){
        var pageData = {
            defaultSize:{width:640, height:480},
            windowWidth:0, windowHeight:0,
            selectedWidth:0, selectedHeight:0,
            width:0, height:0,
        };
        var context = document.getElementById("canvas").getContext("webgl", { alpha:false, preserveDrawingBuffer:true });
        var animationRequestId = undefined;
        var clearColour = {r:1,g:1,b:1,a:1};

        //webGL program production
            var storedPrograms = {};
            this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource, setup){
                function compileProgram(vertexShaderSource, fragmentShaderSource){
                    function createShader(type, source){
                        var shader = context.createShader(type);
                        context.shaderSource(shader, source);
                        context.compileShader(shader);
                        var success = context.getShaderParameter(shader, context.COMPILE_STATUS);
                        if(success){ return shader; }
                
                        console.error('major error in minicore\'s "'+ type +'" shader creation');
                        console.error(context.getShaderInfoLog(shader));
                        context.deleteShader(shader);
                    }
        
                    var program = context.createProgram();
                    context.attachShader(program, createShader(context.VERTEX_SHADER,vertexShaderSource) );
                    context.attachShader(program, createShader(context.FRAGMENT_SHADER,fragmentShaderSource) );
                    context.linkProgram(program);
                    var success = context.getProgramParameter(program, context.LINK_STATUS);
                    if(success){ return program; }
                
                    console.error('major error in minicore\'s program creation');
                    console.error(context.getProgramInfoLog(program));
                    context.deleteProgram(program);
                };

                // if( !(name in storedPrograms) ){
                    console.log('the program "'+name+'" does not exist. Creating it..');
                    storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                    context.useProgram(storedPrograms[name]);
                    if(setup){setup(context, storedPrograms[name]);}
                // }else{
                //     console.log('the program "'+name+'" already exists');
                // }
                console.log(storedPrograms);
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
                if(window.devicePixelRatio == 1){
                    context.viewport(0, 0, context.canvas.width, context.canvas.height);
                }else{
                    var w = context.canvas.width;
                    var h = context.canvas.height;
                    var m = window.devicePixelRatio;
                    context.viewport( -(w*m)/2, (2*h)/m - (h*m)/2, w*m, h*m );
                }
            };
            this.refresh = function(){
                this.clearColour(clearColour);
                this.adjustCanvasSize();
                this.refreshCoordinates();
            };
            this.refresh();

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