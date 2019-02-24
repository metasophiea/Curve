var core = new function(){
    var core = this;
    var canvas = document.getElementById("canvasElement");
    this.canvas = canvas;

    canvas.setAttribute('tabIndex',1);

    this.shape = new function(){
        this.library = new function(){
            this.group = function(){
                var self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'group'; this.getType = function(){return type;}
            
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        this.ignored = false;
                        this.heedCamera = false;
                    
                    //attributes pertinent to extremity calculation
                        var x = 0;     this.x =     function(a){ if(a==undefined){return x;}     x = a;     computeExtremities(); };
                        var y = 0;     this.y =     function(a){ if(a==undefined){return y;}     y = a;     computeExtremities(); };
                        var angle = 0; this.angle = function(a){ if(a==undefined){return angle;} angle = a; computeExtremities(); };
                        var scale = 1; this.scale = function(a){ if(a==undefined){return scale;} scale = a; computeExtremities(); };
            
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
                        augmentExtremities_addChild(shape); 
                    };
                    this.prepend = function(shape){
                        if( !isValidShape(shape) ){ return; }
            
                        children.unshift(shape); 
                        shape.parent = this;
                        augmentExtremities_addChild(shape);
                    };
                    this.remove = function(shape){ augmentExtremities_removeChild(shape); children.splice(children.indexOf(shape), 1); };
                    this.clear = function(){ children = []; };
                    this.getElementsUnderPoint = function(x,y){
                        var returnList = [];
            
                        for(var a = children.length-1; a >= 0; a--){
                            var item = children[a];
            
                            if(item.ignored){return;}
            
                            if( workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, item.extremities.boundingBox ) ){
                                if( item.getType() == 'group' ){
                                    returnList = returnList.concat( item.getElementsUnderPoint(x,y) );
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
            
                //clipping
                    var clipping = { stencil:undefined, active:false };
                    this.stencil = function(shape){
                        if(shape == undefined){return this.clipping.stencil;}
                        clipping.stencil = shape;
                        clipping.stencil.parent = this;
                        computeExtremities();
                    };
                    this.clipActive = function(bool){
                        if(bool == undefined){return clipping.active;}
                        clipping.active = bool;
                        computeExtremities();
                    };
            
                //extremities
                    function augmentExtremities_addChild(newShape){
                        //if we're in clipping mode, no addition of a shape can effect the extremities 
                            if(clipping.active && clipping.stencil != undefined){return;}
                        //get offset from parent
                            var offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for chilren
                            var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            newShape.computeExtremities(false,newOffset);
                        //add points to points list
                            self.extremities.points = self.extremities.points.concat( newShape.extremities.points );
                        //recalculate bounding box
                            self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);
                        //inform parent of change
                            if(self.parent){self.parent.computeExtremities();}
                    }
                    function augmentExtremities_removeChild(departingShape){
                        //if we're in clipping mode, no removal of a shape can effect the extremities 
                            if(clipping.active && clipping.stencil != undefined){return;}
                        //get offset from parent
                            var offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for chilren
                            var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on departing child
                            departingShape.computeExtremities(false,newOffset);
                        //remove matching points from points list
                            var index = workspace.library.math.getIndexOfSequence(self.extremities.points,departingShape.extremities.points);
                            if(index == undefined){console.error("group shape: departing shape points not found");}
                            self.extremities.points.splice(index, index+departingShape.extremities.points.length);
                        //recalculate bounding box
                            self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);
                        //inform parent of change
                            if(self.parent){self.parent.computeExtremities();}
                    }
                    function computeExtremities(informParent=true,offset){
                        //get offset from parent
                            if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
                        //combine offset with group's position, angle and scale to produce new offset for chilren
                            var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
            
                        //run computeExtremities on all children
                            children.forEach(a => a.computeExtremities(false,newOffset));
                        
                        //run computeExtremities on stencil (if applicable)
                            if( clipping.stencil != undefined ){ clipping.stencil.computeExtremities(false,newOffset); }
            
                        //if clipping is active and possible, the extremities of this group are limited to those of the clipping shape
                        //otherwise, gather extremities from children and calculate extremities here
                            self.extremities.points = [];
                            if(clipping.active && clipping.stencil != undefined){
                                self.extremities.points = self.extremities.points.concat(clipping.stencil.extremities.points);
                            }else{ 
                                children.forEach(a => self.extremities.points = self.extremities.points.concat(a.extremities.points));
                            }
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
                    function drawDotFrame(){
                        // self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y,2,{r:0,g:0,b:1,a:1}) );
            
                        var tl = self.extremities.boundingBox.topLeft;
                        var br = self.extremities.boundingBox.bottomRight;
                        core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                        //combine offset with group's position, angle and scale to produce new offset for chilren
                            var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
            
                        //activate clipping (if requested, and is possible)
                            if(clipping.active && clipping.stencil != undefined){
                                //active stencil drawing mode
                                    context.enable(context.STENCIL_TEST);
                                    context.colorMask(false,false,false,false);
                                    context.stencilFunc(context.ALWAYS,1,0xFF);
                                    context.stencilOp(context.KEEP,context.KEEP,context.REPLACE);
                                    context.stencilMask(0xFF);
                                //draw stencil
                                    clipping.stencil.render(context,newOffset);
                                //reactive regular rendering
                                    context.colorMask(true,true,true,true);
                                    context.stencilFunc(context.EQUAL,1,0xFF);
                                    context.stencilMask(0x00);
                            }
                        
                        //render children
                            children.forEach(function(a){
                                if(
                                    workspace.library.math.detectOverlap.boundingBoxes(
                                        clipping.active ? self.extremities.boundingBox : core.viewport.getCanvasBoundingBox(),
                                        a.extremities.boundingBox
                                    )
                                ){ a.render(context,newOffset); }
                            });
            
                        //disactivate clipping
                            if(clipping.active){ context.disable(context.STENCIL_TEST); }
            
                        //if requested; draw dot frame
                            if(self.dotFrame){drawDotFrame();}
                    }
            };
            this.rectangle = function(){
                var self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'rectangle'; this.getType = function(){return type;}
            
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{}, isChanged:true };
                        this.ignored = false;
                        this.colour = {r:1,g:0,b:0,a:1};
            
                    //attributes pertinent to extremity calculation
                        var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                        var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                        var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                        var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); };
                        var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                        var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); };
                        var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); };
            
                //addressing
                    this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
            
                //webGL rendering functions
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
                    var pointBuffer;
                    var pointAttributeLocation;
                    var uniformLocations;
                    function updateGLAttributes(context,adjust){
                        //buffers
                            //points
                                if(pointBuffer == undefined){
                                    pointAttributeLocation = context.getAttribLocation(program, "point");
                                    pointBuffer = context.createBuffer();
                                    context.enableVertexAttribArray(pointAttributeLocation);
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                }else{
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                }
                        
                        //uniforms
                            if( uniformLocations == undefined ){
                                uniformLocations = {
                                    "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                    "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                    "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                    "resolution": context.getUniformLocation(program, "resolution"),
                                    "dimensions": context.getUniformLocation(program, "dimensions"),
                                    "anchor": context.getUniformLocation(program, "anchor"),
                                    "colour": context.getUniformLocation(program, "colour"),
                                };
                            }
            
                            context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                            context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                            context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                            context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                            context.uniform2f(uniformLocations["dimensions"], width, height);
                            context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                            context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                    }
                    var program;
                    function activateGLRender(context,adjust){
                        if(program == undefined){ program = core.render.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource); }
                
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                    }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        //get offset from parent
                            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
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
                                    x: adjusted.scale * width * (points[a] - anchor.x), 
                                    y: adjusted.scale * height * (points[a+1] - anchor.y), 
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
                    var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                    this.computeExtremities = function(informParent,offset){
                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
                        if(
                            this.extremities.isChanged ||
                            oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                        ){
                            computeExtremities(informParent,offset);
                            this.extremities.isChanged = false;
                            oldOffset.x = offset.x;
                            oldOffset.y = offset.y;
                            oldOffset.scale = offset.scale;
                            oldOffset.angle = offset.angle;
                        }
                    };
            
                //lead render
                    function drawDotFrame(){
                        self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            
                        var tl = self.extremities.boundingBox.topLeft;
                        var br = self.extremities.boundingBox.bottomRight;
                        core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
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
            this.polygon = function(){
                var self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'polygon'; this.getType = function(){return type;}
            
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{}, isChanged:true };
                        this.ignored = false;
                        this.colour = {r:1,g:0,b:0,a:1};
            
                    //attributes pertinent to extremity calculation
                        var pointsChanged = true;
                        var points = []; this.points = function(a){ if(a==undefined){return points;} points = a; this.extremities.isChanged = true; computeExtremities(); pointsChanged = true; };
                        var scale = 1;   this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; computeExtremities(); };
                
                //addressing
                    this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
            
                //webGL rendering functions
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
                    var pointBuffer;
                    var pointAttributeLocation;
                    var uniformLocations;
                    function updateGLAttributes(context,offset){
                        //buffers
                            //points
                                if(pointBuffer == undefined || pointsChanged){
                                    pointAttributeLocation = context.getAttribLocation(program, "point");
                                    pointBuffer = context.createBuffer();
                                    context.enableVertexAttribArray(pointAttributeLocation);
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                    pointsChanged = false;
                                }else{
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                }
            
                        //uniforms
                            if( uniformLocations == undefined ){
                                uniformLocations = {
                                    "offset.xy": context.getUniformLocation(program, "offset.xy"),
                                    "offset.scale": context.getUniformLocation(program, "offset.scale"),
                                    "offset.angle": context.getUniformLocation(program, "offset.angle"),
                                    "resolution": context.getUniformLocation(program, "resolution"),
                                    "colour": context.getUniformLocation(program, "colour"),
                                };
                            }
            
                            context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
                            context.uniform1f(uniformLocations["offset.scale"], offset.scale);
                            context.uniform1f(uniformLocations["offset.angle"], offset.angle);
                            context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                            context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                    }
                    var program;
                    function activateGLRender(context,adjust){
                        if(program == undefined){ program = core.render.produceProgram('polygon', vertexShaderSource, fragmentShaderSource); }
                
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_FAN, 0, points.length/2);
                    }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        //get offset from parent
                            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
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
                    var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                    this.computeExtremities = function(informParent,offset){
                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
                        if(
                            this.extremities.isChanged ||
                            oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                        ){
                            computeExtremities(informParent,offset);
                            this.extremities.isChanged = false;
                            oldOffset.x = offset.x;
                            oldOffset.y = offset.y;
                            oldOffset.scale = offset.scale;
                            oldOffset.angle = offset.angle;
                        }
                    };
            
                //lead render
                    function drawDotFrame(){
                        self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            
                        var tl = self.extremities.boundingBox.topLeft;
                        var br = self.extremities.boundingBox.bottomRight;
                        core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                    }
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
                        //activate shape render code
                            activateGLRender(context,offset);
            
                        //if requested; draw dot frame
                            if(self.dotFrame){drawDotFrame();}
                    };
            };
            this.circle = function(){
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
                        var x = 0;          this.x =      function(a){ if(a==undefined){return x;}      x = a;      computeExtremities(); };
                        var y = 0;          this.y =      function(a){ if(a==undefined){return y;}      y = a;      computeExtremities(); };
                        var radius = 10;    this.radius = function(a){ if(a==undefined){return radius;} radius = a; computeExtremities(); };
                        var scale = 1;      this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  computeExtremities(); };
                        var detail = 25;    this.detail = function(a){ 
                                                if(a==undefined){return detail;} detail = a;
            
                                                points = [];
                                                for(var a = 0; a < detail; a++){
                                                    points.push(
                                                        Math.sin( 2*Math.PI * (a/detail) ),
                                                        Math.cos( 2*Math.PI * (a/detail) )
                                                    );
                                                }
            
                                                computeExtremities();
            
                                                pointsChanged = true;
                                            };
                       
                //addressing
                    this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
            
                //webGL rendering functions
                    var points = []; 
                    var pointsChanged = true;
                    this.detail(detail);
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
                var pointBuffer;
                var pointAttributeLocation;
                var uniformLocations;
                function updateGLAttributes(context,adjust){
                    //buffers
                        //points
                            if(pointBuffer == undefined || pointsChanged){
                                pointAttributeLocation = context.getAttribLocation(program, "point");
                                pointBuffer = context.createBuffer();
                                context.enableVertexAttribArray(pointAttributeLocation);
                                context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                pointsChanged = false;
                            }else{
                                context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                            }
            
                    //uniforms
                        if( uniformLocations == undefined ){
                            uniformLocations = {
                                "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                "resolution": context.getUniformLocation(program, "resolution"),
                                "radius": context.getUniformLocation(program, "radius"),
                                "colour": context.getUniformLocation(program, "colour"),
                            };
                        }
            
                        context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                        context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                        context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                        context.uniform1f(uniformLocations["radius"], radius);
                        context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                }
                var program;
                function activateGLRender(context,adjust){
                    if(program == undefined){ program = core.render.produceProgram('circle', vertexShaderSource, fragmentShaderSource); }
            
                    context.useProgram(program);
                    updateGLAttributes(context,adjust);
                    context.drawArrays(context.TRIANGLE_FAN, 0, points.length/2);
                }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        //get offset from parent
                            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
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
                    var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                    this.computeExtremities = function(informParent,offset){
                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
                        if(
                            this.extremities.isChanged ||
                            oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                        ){
                            computeExtremities(informParent,offset);
                            this.extremities.isChanged = false;
                            oldOffset.x = offset.x;
                            oldOffset.y = offset.y;
                            oldOffset.scale = offset.scale;
                            oldOffset.angle = offset.angle;
                        }
                    };
            
                //lead render
                    function drawDotFrame(){
                        self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            
                        var tl = self.extremities.boundingBox.topLeft;
                        var br = self.extremities.boundingBox.bottomRight;
                        core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
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
            this.path = function(){
                var self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'path'; this.getType = function(){return type;}
            
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{}, isChanged:true };
                        this.ignored = false;
                        this.colour = {r:1,g:0,b:0,a:1};
            
                    //attributes pertinent to extremity calculation
                        var scale = 1; this.scale = function(a){ if(a==undefined){return scale;}  scale = a; this.extremities.isChanged=true; this.computeExtremities(); };
                        var points = []; var pointsChanged = true; 
                        function lineGenerator(){ points = workspace.library.math.pathToPolygonGenerator( path, thickness ); }
                        var path = [];      this.path =  function(a){ if(a==undefined){return path;} path = a; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); pointsChanged = true; };
                        var thickness = 1;  this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); };
                        
                //addressing
                    this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
            
                //webGL rendering functions
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
                    var pointBuffer;
                    var pointAttributeLocation;
                    var uniformLocations;
                    function updateGLAttributes(context,offset){
                        //buffers
                            //points
                                if(pointBuffer == undefined || pointsChanged){
                                    pointAttributeLocation = context.getAttribLocation(program, "point");
                                    pointBuffer = context.createBuffer();
                                    context.enableVertexAttribArray(pointAttributeLocation);
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                    pointsChanged = false;
                                }else{
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                }
            
                        //uniforms
                            if( uniformLocations == undefined ){
                                uniformLocations = {
                                    "offset.xy": context.getUniformLocation(program, "offset.xy"),
                                    "offset.scale": context.getUniformLocation(program, "offset.scale"),
                                    "offset.angle": context.getUniformLocation(program, "offset.angle"),
                                    "resolution": context.getUniformLocation(program, "resolution"),
                                    "colour": context.getUniformLocation(program, "colour"),
                                };
                            }
            
                            context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
                            context.uniform1f(uniformLocations["offset.scale"], offset.scale);
                            context.uniform1f(uniformLocations["offset.angle"], offset.angle);
                            context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                            context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                    }
                    var program;
                    function activateGLRender(context,adjust){
                        if(program == undefined){ program = core.render.produceProgram('polygon', vertexShaderSource, fragmentShaderSource); }
            
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_STRIP, 0, points.length/2);
                    }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        //get offset from parent
                            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
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
                    var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                    this.computeExtremities = function(informParent,offset){
                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
                        if(
                            this.extremities.isChanged ||
                            oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                        ){
                            computeExtremities(informParent,offset);
                            this.extremities.isChanged = false;
                            oldOffset.x = offset.x;
                            oldOffset.y = offset.y;
                            oldOffset.scale = offset.scale;
                            oldOffset.angle = offset.angle;
                        }
                    };
            
                //lead render
                    function drawDotFrame(){
                        self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            
                        var tl = self.extremities.boundingBox.topLeft;
                        var br = self.extremities.boundingBox.bottomRight;
                        core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                    }
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                        //activate shape render code
                            activateGLRender(context,offset);
            
                        //if requested; draw dot frame
                            if(self.dotFrame){drawDotFrame();}
                    };
            };
            this.image = function(){
                var self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'image'; this.getType = function(){return type;}
            
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{}, isChanged:true };
                        this.ignored = false;
            
                    //attributes pertinent to extremity calculation
                        var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                        var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                        var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                        var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); };
                        var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                        var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); };
                        var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); };
            
                    //image data
                        var image = { object:undefined, url:'', isLoaded:false, isChanged:true };
                        this.imageURL = function(a){
                            if(a==undefined){return image.url;}
                            image.url = a;
            
                            image.object = new Image();
                            image.object.src = image.url;
                            image.isLoaded = false; image.object.onload = function(){ image.isLoaded = true; image.isChanged = true; };
                        };
            
                //addressing
                    this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
            
                //webGL rendering
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
            
                        //vertex/fragment shader transfer variables
                            varying vec2 textureCoordinates;
            
                        void main(){
                            //transfer point to fragment shader
                                textureCoordinates = point;
            
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
            
                        uniform sampler2D textureImage;
                        varying vec2 textureCoordinates;
                                                                                    
                        void main(){
                            gl_FragColor = texture2D(textureImage, textureCoordinates);
                        }
                    `;
                    var pointBuffer;
                    var pointAttributeLocation;
                    var uniformLocations;
                    var imageTexture;
                    function updateGLAttributes(context,adjust){
                        //buffers
                            //points
                                if(pointBuffer == undefined){
                                    pointAttributeLocation = context.getAttribLocation(program, "point");
                                    pointBuffer = context.createBuffer();
                                    context.enableVertexAttribArray(pointAttributeLocation);
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                }else{
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                }
            
                            //texture
                                if(image.isChanged){
                                    image.isChanged = false;
                                    imageTexture = context.createTexture();
                                    context.bindTexture(context.TEXTURE_2D, imageTexture);
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
                                    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image.object);
                                }else{
                                    context.bindTexture(context.TEXTURE_2D, imageTexture);
                                }
            
                        //uniforms
                            if( uniformLocations == undefined ){
                                uniformLocations = {
                                    "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                    "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                    "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                    "resolution": context.getUniformLocation(program, "resolution"),
                                    "dimensions": context.getUniformLocation(program, "dimensions"),
                                    "anchor": context.getUniformLocation(program, "anchor"),
                                };
                            }
            
                            context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                            context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                            context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                            context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                            context.uniform2f(uniformLocations["dimensions"], width, height);
                            context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                    }
                    var program;
                    function activateGLRender(context,adjust){
                        if(program == undefined){ program = core.render.produceProgram('image', vertexShaderSource, fragmentShaderSource); }
                        
                        if(!image.isLoaded){return;} //do not render, if the image has not yet been loaded
            
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                    }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        //get offset from parent
                            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
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
                                    x: adjusted.scale * width * (points[a] - anchor.x), 
                                    y: adjusted.scale * height * (points[a+1] - anchor.y), 
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
                    var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                    this.computeExtremities = function(informParent,offset){
                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
                        if(
                            this.extremities.isChanged ||
                            oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                        ){
                            computeExtremities(informParent,offset);
                            this.extremities.isChanged = false;
                            oldOffset.x = offset.x;
                            oldOffset.y = offset.y;
                            oldOffset.scale = offset.scale;
                            oldOffset.angle = offset.angle;
                        }
                    };
            
                //lead render
                    function drawDotFrame(){
                        self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            
                        var tl = self.extremities.boundingBox.topLeft;
                        var br = self.extremities.boundingBox.bottomRight;
                        core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
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
            this.canvas = function(){
                var self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'canvas'; this.getType = function(){return type;}
            
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{}, isChanged:true };
                        this.ignored = false;
            
                    //attributes pertinent to extremity calculation
                        var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                        var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                        var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                        var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                        var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                        var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                        var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
            
                    //canvas
                        var canvas = { object:document.createElement('canvas'), context:undefined, resolution:1, isChanged:true };
                        canvas.context = canvas.object.getContext('2d');
            
                        function updateDimentions(){
                            canvas.object.setAttribute('width',width*canvas.resolution);
                            canvas.object.setAttribute('height',height*canvas.resolution);
                            canvas.isChanged = true;
                        }
                        updateDimentions();
            
                        this._ = canvas.context;
                        this.$ = function(a){return a*canvas.resolution;};
                        this.resolution = function(a){
                            if(a == undefined){return canvas.resolution;}
                            canvas.resolution = a;
                            updateDimentions();
                        };
                        this.requestUpdate = function(){ canvas.isChanged = true; };
            
                //addressing
                    this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
            
                //webGL rendering
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
            
                        //vertex/fragment shader transfer variables
                            varying vec2 textureCoordinates;
            
                        void main(){
                            //transfer point to fragment shader
                                textureCoordinates = point;
            
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
            
                        uniform sampler2D textureImage;
                        varying vec2 textureCoordinates;
                                                                                    
                        void main(){
                            gl_FragColor = texture2D(textureImage, textureCoordinates);
                        }
                    `;
                    var pointBuffer;
                    var pointAttributeLocation;
                    var uniformLocations;
                    var canvasTexture;
                    function updateGLAttributes(context,adjust){
                        //buffers
                            //points
                                if(pointBuffer == undefined){
                                    pointAttributeLocation = context.getAttribLocation(program, "point");
                                    pointBuffer = context.createBuffer();
                                    context.enableVertexAttribArray(pointAttributeLocation);
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                }else{
                                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                }
            
                            //texture
                                if(canvas.isChanged){
                                    canvas.isChanged = false;
                                    canvasTexture = context.createTexture();
                                    context.bindTexture(context.TEXTURE_2D, canvasTexture);
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
                                    context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
                                    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, canvas.object);
                                }else{
                                    context.bindTexture(context.TEXTURE_2D, canvasTexture);
                                }
            
                        //uniforms
                            if( uniformLocations == undefined ){
                                uniformLocations = {
                                    "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                    "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                    "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                    "resolution": context.getUniformLocation(program, "resolution"),
                                    "dimensions": context.getUniformLocation(program, "dimensions"),
                                    "anchor": context.getUniformLocation(program, "anchor"),
                                };
                            }
            
                            context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                            context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                            context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                            context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                            context.uniform2f(uniformLocations["dimensions"], width, height);
                            context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                    }
                    var program;
                    function activateGLRender(context,adjust){
                        if(program == undefined){ program = core.render.produceProgram('canvas', vertexShaderSource, fragmentShaderSource); }
                        
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                    }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        //get offset from parent
                            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
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
                                    x: adjusted.scale * width * (points[a] - anchor.x), 
                                    y: adjusted.scale * height * (points[a+1] - anchor.y), 
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
                    var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                    this.computeExtremities = function(informParent,offset){
                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            
                        if(
                            this.extremities.isChanged ||
                            oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                        ){
                            computeExtremities(informParent,offset);
                            this.extremities.isChanged = false;
                            oldOffset.x = offset.x;
                            oldOffset.y = offset.y;
                            oldOffset.scale = offset.scale;
                            oldOffset.angle = offset.angle;
                        }
                    };
            
                //lead render
                    function drawDotFrame(){
                        self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            
                        var tl = self.extremities.boundingBox.topLeft;
                        var br = self.extremities.boundingBox.bottomRight;
                        core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
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
        };

        this.create = function(type){ 
            try{ return new this.library[type](); }
            catch(e){
                console.warn('the shape type: "'+type+'" could not be found');
                console.error(e);
            }
        };
    };
    
    this.arrangement = new function(){
        var design = core.shape.create('group');;

        this.createElement = function(type){ return new shape[type]; };

        this.new = function(){ design = core.shape.create('group'); };
        this.get = function(){ return design; };
        this.set = function(arrangement){ design = arrangement; };
        this.prepend = function(element){ design.prepend(element); };
        this.append = function(element){ design.append(element); };
        this.remove = function(element){ design.remove(element); };
        this.clear = function(){ design.clear(); };

        this.getElementsUnderPoint = function(x,y){ return design.getElementsUnderPoint(x,y); };
        this.getElementsUnderArea = function(points){ return design.getElementsUnderArea(points); };
    };
    this.render = new function(){
        var pageData = {
            defaultSize:{width:640, height:480},
            windowWidth:0, windowHeight:0,
            selectedWidth:0, selectedHeight:0,
            width:0, height:0,
        };
        var context = canvas.getContext("webgl", {alpha:false, preserveDrawingBuffer:true, stencil:true });
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

    this.viewport = new function(){
        var state = {
            position:{x:0,y:0},
            scale:1,
            angle:0,
        };
        var viewbox = {
            canvas:{
                points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
            },
            camera:{
                points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
            },
        };
    
        //adapter
            this.adapter = new function(){
                this.windowPoint2workspacePoint = function(x,y){
                    var position = core.viewport.position();
                    var scale = core.viewport.scale() / window.devicePixelRatio;
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
                var xy = this.adapter.windowPoint2workspacePoint(x,y);
                return core.arrangement.getElementUnderPoint(xy.x,xy.y);
            };
            this.getElementsUnderCanvasArea = function(points){
                return core.arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2workspacePoint(a.x,a.y)));
            };
    
        //misc
            function calculateViewportExtremities(){
                var canvasDimensions = core.render.getCanvasDimensions();
    
                //canvas
                    //for each corner of the viewport; find out where they lie on the workspace
                        viewbox.canvas.points.tl = {x:0, y:0};
                        viewbox.canvas.points.tr = {x:canvasDimensions.width, y:0};
                        viewbox.canvas.points.bl = {x:0, y:canvasDimensions.height};
                        viewbox.canvas.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
                    //calculate a bounding box for the viewport from these points
                        viewbox.canvas.boundingBox = workspace.library.math.boundingBoxFromPoints([viewbox.canvas.points.tl, viewbox.canvas.points.tr, viewbox.canvas.points.br, viewbox.canvas.points.bl]);
    
                //camera
                    //for each corner of the viewport; find out where they lie on the workspace
                        viewbox.camera.points.tl = core.viewport.adapter.windowPoint2workspacePoint(0,0);
                        viewbox.camera.points.tr = core.viewport.adapter.windowPoint2workspacePoint(canvasDimensions.width,0);
                        viewbox.camera.points.bl = core.viewport.adapter.windowPoint2workspacePoint(0,canvasDimensions.height);
                        viewbox.camera.points.br = core.viewport.adapter.windowPoint2workspacePoint(canvasDimensions.width,canvasDimensions.height);
            
                //calculate a bounding box for the viewport from these points
                    viewbox.camera.boundingBox = workspace.library.math.boundingBoxFromPoints([viewbox.camera.points.tl, viewbox.camera.points.tr, viewbox.camera.points.br, viewbox.camera.points.bl]);
            }
            this.calculateViewportExtremities = calculateViewportExtremities;
            this.refresh = function(){
                this.calculateViewportExtremities();
            };
            this.getCanvasBoundingBox = function(){ return viewbox.canvas.boundingBox; };
            this.getCameraBoundingBox = function(){ return viewbox.camera.boundingBox; };
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
                core.canvas[callbacks[a]] = function(callback){
                    return function(event){
                        //if core doesn't have this callback set up, just bail
                            if( !core.callback[callback] ){return;}
                
                        //convert the point
                            var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);
                
                        //get the shapes under this point that have this callback, in order of front to back
                            var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
                
                        //activate core's callback, providing the converted point, original event, and shapes
                            core.callback[callback]( p.x, p.y, event, shapes );
                    }
                }(callbacks[a]);
            }
    
        //special cases
            //onmousemove / onmouseenter / onmouseleave
                var shapeMouseoverList = [];
                core.canvas.onmousemove = function(event){
                    //convert the point
                        var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);
    
                    //update the stored mouse position
                        mouseposition = {x:p.x,y:p.y};
    
                    //check for onmouseenter / onmouseleave
                        //get all shapes under point that have onmouseenter or onmouseleave callbacks
                            var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a.onmouseenter!=undefined || a.onmouseleave!=undefined);
                        //go through this list, comparing to the shape transition list
                            //shapes only on shapes list; run onmouseenter and add to shapeMouseoverList
                            //shapes only on shapeMouseoverList; run onmouseleave and remove from shapeMouseoverList
                            var diff = workspace.library.math.getDifferenceOfArrays(shapeMouseoverList,shapes);
                            diff.b.forEach(function(a){
                                if(a.onmouseenter){a.onmouseenter( p.x, p.y, event, shapes );}
                                shapeMouseoverList.push(a);
                            });
                            diff.a.forEach(function(a){
                                if(a.onmouseleave){a.onmouseleave( p.x, p.y, event, shapes );}
                                shapeMouseoverList.splice(shapeMouseoverList.indexOf(a),1);
                            });
    
                    //perform regular onmousemove actions
                        var callback = 'onmousemove';
    
                        //if core doesn't have this callback set up, just bail
                            if( !core.callback[callback] ){return;}
                
                        //get the shapes under this point that have this callback, in order of front to back
                            var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
                
                        //activate core's callback, providing the converted point, original event, and shapes
                            core.callback[callback]( p.x, p.y, event, shapes );
                };
    
            //onkeydown / onkeyup
                var tmp = ['onkeydown', 'onkeyup'];
                for(var a = 0; a < tmp.length; a++){
                    core.canvas[tmp[a]] = function(callback){
                        return function(event){
                            //if core doesn't have this callback set up, just bail
                                if( !core.callback[callback] ){return;}
                
                            //gather the last (converted) mouse point
                                var p = mouseposition;
                        
                            //get the shapes under this point that have this callback, in order of front to back
                                var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
                
                            //activate core's callback, providing the converted point, original event, and shapes
                                core.callback[callback]( p.x, p.y, event, shapes );
                        }
                    }(tmp[a]);
                }
    
            //onmousedown / onmouseup / onclick
                var shapeMouseclickList = [];
                core.canvas.onclick = function(){};
                core.canvas.onmousedown = function(event){
                    //convert the point
                        var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);
    
                    //save current shapes for use in the onmouseup callback
                        shapeMouseclickList = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a.onclick!=undefined);
    
                    //perform regular onmousedown actions
                        var callback = 'onmousedown';
    
                        //if core doesn't have this callback set up, just bail
                            if( !core.callback[callback] ){return;}
                
                        //get the shapes under this point that have this callback, in order of front to back
                            var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
                
                        //activate core's callback, providing the converted point, original event, and shapes
                            core.callback[callback]( p.x, p.y, event, shapes );
                };
                core.canvas.onmouseup = function(event){
                    //convert the point
                        var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);
    
                    //for the shapes under the mouse that are also on the shapeMouseclickList, activate their "onclick" callback
                        var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a.onclick!=undefined);
                        shapes.forEach(function(a){ if( shapeMouseclickList.includes(a) ){ a.onclick(p.x, p.y, event, shapes); } });
    
                    //perform regular onmouseup actions
                        var callback = 'onmouseup';
    
                        //if core doesn't have this callback set up, just bail
                            if( !core.callback[callback] ){return;}
                
                        //get the shapes under this point that have this callback, in order of front to back
                            var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
                
                        //activate core's callback, providing the converted point, original event, and shapes
                            core.callback[callback]( p.x, p.y, event, shapes );
                };
    };
};