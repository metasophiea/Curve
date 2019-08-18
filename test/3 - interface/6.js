_canvas_.core.shape.library.rectangleWithRoundEnds = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'rectangleWithRoundEnds'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{} };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};
        //advanced use attributes
            this.devMode = false;
            this.stopAttributeStartedExtremityUpdate = false;

        //attributes pertinent to extremity calculation
            var x = 0;          this.x =      function(a){ if(a==undefined){return x;}      x = a;      if(this.devMode){console.log(this.getAddress()+'::x');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var y = 0;          this.y =      function(a){ if(a==undefined){return y;}      y = a;      if(this.devMode){console.log(this.getAddress()+'::y');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var angle = 0;      this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  if(this.devMode){console.log(this.getAddress()+'::angle');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var width = 10;     this.width =  function(a){ if(a==undefined){return width;}  width = a;  if(this.devMode){console.log(this.getAddress()+'::width');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var height = 10;    this.height = function(a){ if(a==undefined){return height;} height = a; if(this.devMode){console.log(this.getAddress()+'::height');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var scale = 1;      this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  if(this.devMode){console.log(this.getAddress()+'::scale');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var detail = 25;    this.detail = function(a){ 
                                    if(a==undefined){return detail;} detail = a;
                                    if(this.devMode){console.log(this.getAddress()+'::detail');}

                                    points = [];
                                    points.push(-1,0);

                                    //round top
                                        var pointCount = detail+1;
                                        for(var a = 1; a < pointCount; a++){
                                            points.push(
                                                Math.sin( Math.PI * ((pointCount-a)/pointCount) + Math.PI/2 ),
                                                Math.cos( Math.PI * ((pointCount-a)/pointCount) + Math.PI/2 )
                                            );
                                        }

                                    points.push(1,0,1,0);

                                    //round bottom
                                        var pointCount = detail+1;
                                        for(var a = 1; a < pointCount; a++){
                                            points.push(
                                                Math.sin( Math.PI * ((pointCount-a)/pointCount) - Math.PI/2 ),
                                                Math.cos( Math.PI * ((pointCount-a)/pointCount) - Math.PI/2 )
                                            );
                                        }

                                    points.push(-1,0);
                                
                                    pointsChanged = true;

                                    if(this.stopAttributeStartedExtremityUpdate){return;} 
                                    computeExtremities();
                                };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

    //webGL rendering functions
        var points = []; 
        var pointsChanged = true;
        this.detail(detail);
        var vertexShaderSource = 
            _canvas_.library.gsls.geometry + `
            //index
                attribute lowp float index;

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
                uniform float width;
                uniform float height;
                uniform vec2 anchor;
                uniform lowp float detail;

            void main(){
                float push = detail+1.0 < index ? height : 0.0;
                
                //adjust points by width and xy offset
                    vec2 P = cartesianAngleAdjust(point*(width/2.0)*adjust.scale + vec2(0,push*adjust.scale), -adjust.angle) + adjust.xy;

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
        var index = { buffer:undefined, attributeLocation:undefined };
        var point = { buffer:undefined, attributeLocation:undefined };
        var uniformLocations;
        function updateGLAttributes(context,adjust){
            //buffers
                //points
                    if(point.buffer == undefined || pointsChanged){
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                        pointsChanged = false;
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }

                //index
                    if(index.buffer == undefined){
                        index.attributeLocation = context.getAttribLocation(program, "index");
                        index.buffer = context.createBuffer();
                        context.enableVertexAttribArray(index.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, index.buffer); 
                        context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:points.length/2}).map(Number.call, Number)), context.STATIC_DRAW);
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, index.buffer);
                        context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                    }

            //uniforms
                if( uniformLocations == undefined ){
                    uniformLocations = {
                        "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                        "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                        "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                        "resolution": context.getUniformLocation(program, "resolution"),
                        "width": context.getUniformLocation(program, "width"),
                        "height": context.getUniformLocation(program, "height"),
                        "colour": context.getUniformLocation(program, "colour"),
                        "detail": context.getUniformLocation(program, "detail"),
                    };
                }

                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform1f(uniformLocations["width"], width);
                context.uniform1f(uniformLocations["height"], height);
                context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                context.uniform1f(uniformLocations["detail"], detail);
        }
        var program;
        function activateGLRender(context,adjust){
            if(program == undefined){ program = _canvas_.core.render.produceProgram('rectangleWithRoundEnds', vertexShaderSource, fragmentShaderSource); }

            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, points.length/2);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            if(self.devMode){console.log(self.getAddress()+'::computeExtremities');}

            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //calculate adjusted offset based on the offset
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };
            //calculate points based on the adjusted offset
                self.extremities.points = [];
                for(var a = 0; a < points.length; a+=2){
                    var push = detail+1.0 < a/2 ? height : 0;

                    var P = _canvas_.library.math.cartesianAngleAdjust(
                        points[a]*(width/2)*adjusted.scale,
                        points[a+1]*(width/2)*adjusted.scale + push, 
                        -adjusted.angle
                    );
                    self.extremities.points.push({ x:P.x+adjusted.x, y:P.y+adjusted.y });
                }
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => _canvas_.core.render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                _canvas_.core.render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,2,{r:0,g:0,b:1,a:1});
                _canvas_.core.render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,2,{r:0,g:0,b:1,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
            //combine offset with shape's position, angle and scale to produce adjust value for render
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
_canvas_.interface.part.collection.basic.rectangleWithRoundEnds = function( name=null, x=0, y=0, angle=0, width=5, height=10, detail=25, ignored=false, colour={r:1,g:0,b:1,a:1} ){
    var temp = _canvas_.core.shape.create('rectangleWithRoundEnds');
    temp.name = name;
    temp.ignored = ignored;
    temp.colour = colour;
    
    temp.stopAttributeStartedExtremityUpdate = true;
    temp.x(x);
    temp.y(y);
    temp.angle(angle);
    temp.width(width)
    temp.height(height)
    temp.detail(detail);
    temp.stopAttributeStartedExtremityUpdate = false;

    return temp;
};
_canvas_.interface.part.partLibrary.basic.rectangleWithRoundEnds = function(name,data){ return _canvas_.interface.part.collection.basic.rectangleWithRoundEnds(
    name, data.x, data.y, data.angle, data.width, data.height, data.detail, data.ignored, data.colour
); }

_canvas_.interface.part.collection.control.dial_3_continuous = function(
    name='dial_3_continuous',
    x, y, radius=10, angle=0, interactable=true,
    value=0, resetValue=-1,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = {r:0.1,g:1,b:1,a:1},
    slotStyle =   {r:0,g:0,b:0,a:0},
    needleStyle = {r:1,g:1,b:1,a:1},

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = _canvas_.interface.part.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //slot
            var slot = _canvas_.interface.part.builder('basic','circle','slot',{radius:radius*1.1, detail:50, colour:slotStyle});
            object.append(slot);
        
        //handle
            var handle = _canvas_.interface.part.builder('basic','circle','handle',{radius:radius, detail:50, colour:handleStyle});
            object.append(handle);

        //needle group
            var needleGroup = _canvas_.interface.part.builder('basic','group','needleGroup',{ignored:true});
            object.append(needleGroup);

            //needle
                var needle = _canvas_.interface.part.builder('basic','rectangleWithRoundEnds','needle',{x:radius*0.8-radius/2, y:-radius/16, angle:-Math.PI/2, height:radius/2, width:radius/8, colour:needleStyle});
                needleGroup.append(needle);




    //graphical adjust
        function set(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            value = a;
            needleGroup.angle(startAngle + maxAngle*value);
        }




    //methods
        var grappled = false;

        object.set = function(value,update){
            if(grappled){return;}
            set(value,update);
        };
        object.get = function(){return value;};
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };




    //interaction
        var turningSpeed = radius*4;
        
        handle.ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue); 

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        handle.onwheel = function(event){
            if(!interactable){return;}
            if(grappled){return;}
            
            var move = event.deltaY/100;
            var globalScale = _canvas_.core.viewport.scale();
            set( value - move/(10*globalScale) );

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        handle.onmousedown = function(event){
            if(!interactable){return;}
            var initialValue = value;
            var initialY = event.Y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var value = initialValue;
                    var numerator = event.Y - initialY;
                    var divider = _canvas_.core.viewport.scale();
                    set( value - (numerator/(divider*turningSpeed) * window.devicePixelRatio), true );
                },
                function(event){
                    grappled = false;
                    if(object.onrelease != undefined){object.onrelease(value);}
                }
            );
        };




    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    //setup
        set(value);

    return object;
};
_canvas_.interface.part.collection.control.dial_3_discrete = function(
    name='dial_3_discrete',
    x, y, radius=10, angle=0, interactable=true,
    value=0, resetValue=0, optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleStyle = {r:1,g:0.1,b:0.1,a:1},
    slotStyle =   {r:0,g:0,b:0,a:0},
    needleStyle = {r:1,g:1,b:1,a:1},

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = _canvas_.interface.part.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //dial
            var dial = _canvas_.interface.part.builder('control','dial_3_continuous',name,{
                x:0, y:0, radius:radius, angle:0, interactable:interactable,
                startAngle:startAngle, maxAngle:maxAngle,
                style:{ handle:handleStyle, slot:slotStyle, needle:needleStyle }
            });
            //clean out built-in interaction
            dial.getChildByName('handle').ondblclick = undefined;
            dial.getChildByName('handle').onwheel = undefined;
            dial.getChildByName('handle').onmousedown = undefined;

            object.append(dial);
        





    //graphical adjust
        function set(a,update=true){ 
            a = (a>(optionCount-1) ? (optionCount-1) : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            a = Math.round(a);
            value = a;
            dial.set( value/(optionCount-1) );
        };




    //methods
        var grappled = false;

        object.set = function(value,update){
            if(grappled){return;}
            set(value,update);
        };
        object.get = function(){return value;};
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };




    //interaction
        var acc = 0;

        dial.getChildByName('handle').ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue);

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        dial.getChildByName('handle').onwheel = function(event){
            if(!interactable){return;}
            if(grappled){return;}

            var move = event.deltaY/100;

            acc += move;
            if( Math.abs(acc) >= 1 ){
                set( value -1*Math.sign(acc) );
                acc = 0;
                if(object.onrelease != undefined){object.onrelease(value);}
            }
        };
        dial.getChildByName('handle').onmousedown = function(event){
            if(!interactable){return;}
            var initialValue = value;
            var initialY = event.Y;

            grappled = true;
            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var diff = Math.round( (event.Y - initialY)/25 );
                    set( initialValue - diff );
                    if(object.onchange != undefined){object.onchange(value);}
                },
                function(event){
                    grappled = false;
                    if(object.onrelease != undefined){object.onrelease(value);}
                }
            );
        };




    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    //setup
        set(value);

    return object;
};


_canvas_.interface.part.partLibrary.control.dial_3_continuous = function(name,data){ return _canvas_.interface.part.collection.control.dial_3_continuous(
    name, data.x, data.y, data.width, data.height, data.angle,
    data.style.background, data.style.glow, data.style.dim
); }
_canvas_.interface.part.partLibrary.control.dial_3_discrete = function(name,data){ return _canvas_.interface.part.collection.control.dial_3_discrete(
    name, data.x, data.y, data.width, data.height, data.angle,
    data.style.background, data.style.glow, data.style.dim
); }
















































_canvas_.core.render.active(true);

_canvas_.core.viewport.scale(6);
var x = 0;
var y = 0;
_canvas_.core.viewport.position(-x*_canvas_.core.viewport.scale(),-y*_canvas_.core.viewport.scale());








var dc1 = _canvas_.interface.part.builder( 'control', 'dial_1_continuous', 'test_dial_1_continuous', {x:15,y:15} );
_canvas_.system.pane.mm.append( dc1 );
var dd1 = _canvas_.interface.part.builder( 'control', 'dial_1_discrete', 'test_dial_1_discrete', {x:15,y:40} );
_canvas_.system.pane.mm.append( dd1 );

var dc2 = _canvas_.interface.part.builder( 'control', 'dial_2_continuous', 'test_dial_2_continuous', {x:40,y:15} );
_canvas_.system.pane.mm.append( dc2 );
var dd2 = _canvas_.interface.part.builder( 'control', 'dial_2_discrete', 'test_dial_2_discrete', {x:40,y:40} );
_canvas_.system.pane.mm.append( dd2 );

var dc3 = _canvas_.interface.part.builder( 'control', 'dial_3_continuous', 'test_dial_3_continuous', {x:65,y:15} );
_canvas_.system.pane.mm.append( dc3 );
var dd3 = _canvas_.interface.part.builder( 'control', 'dial_3_discrete', 'test_dial_3_discrete', {x:65,y:40} );
_canvas_.system.pane.mm.append( dd3 );