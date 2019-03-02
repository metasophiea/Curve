this.rectangleWithOutline = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'rectangleWithOutline'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{}, isChanged:true };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};
            this.lineColour = {r:0,g:0,b:0,a:0};

        //attributes pertinent to extremity calculation
            var x = 0;              this.x =         function(a){ if(a==undefined){return x;}         x = a;         this.extremities.isChanged = true; this.computeExtremities(); };
            var y = 0;              this.y =         function(a){ if(a==undefined){return y;}         y = a;         this.extremities.isChanged = true; this.computeExtremities(); };
            var angle = 0;          this.angle =     function(a){ if(a==undefined){return angle;}     angle = a;     this.extremities.isChanged = true; this.computeExtremities(); };
            var anchor = {x:0,y:0}; this.anchor =    function(a){ if(a==undefined){return anchor;}    anchor = a;    this.extremities.isChanged = true; this.computeExtremities(); };
            var width = 10;         this.width =     function(a){ if(a==undefined){return width;}     width = a;     this.extremities.isChanged = true; this.computeExtremities(); };
            var height = 10;        this.height =    function(a){ if(a==undefined){return height;}    height = a;    this.extremities.isChanged = true; this.computeExtremities(); };
            var scale = 1;          this.scale =     function(a){ if(a==undefined){return scale;}     scale = a;     this.extremities.isChanged = true; this.computeExtremities(); };
            var thickness = 0;      this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a; this.extremities.isChanged = true; this.computeExtremities(); };

    //addressing
        this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };

    //webGL rendering functions
        var points = [
            0,0,
            1,0,
            1,1,
            0,0,
            1,1,
            0,1,

            0,0,
            1,0,
            1,1,
            0,0,
            1,1,
            0,1,

            0,0,
            1,0,
            1,1,
            0,0,
            1,1,
            0,1,

            0,0,
            1,0,
            1,1,
            0,0,
            1,1,
            0,1,

            0,0,
            1,0,
            1,1,
            0,0,
            1,1,
            0,1,
        ];
        var vertexShaderSource = `
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
                uniform vec2 dimensions;
                uniform float thickness;
                uniform vec2 anchor;

                uniform vec4 colour;
                uniform vec4 lineColour;
            
            //varyings
                varying vec4 activeColour;

            void main(){
                //create triangle
                    vec2 P = vec2(0,0);

                    if(index < 6.0){ //body
                        P = dimensions * (point * adjust.scale - anchor);
                    }else if(index < 12.0){ //outline: top
                        P = vec2( dimensions.x + thickness, thickness ) * ((point - vec2(0.0,0.5)) * adjust.scale - anchor) - vec2(thickness/2.0,0.0)*adjust.scale;
                    }else if(index < 18.0){ //outline: bottom
                        P = vec2( dimensions.x + thickness, thickness ) * ((point - vec2(0.0,-dimensions.y/thickness + 0.5)) * adjust.scale - anchor) - vec2(thickness/2.0,0.0)*adjust.scale;;
                    }else if(index < 24.0){ //outline: left
                        P = vec2( thickness, dimensions.y - thickness ) * ((point - vec2(0.5,0.0)) * adjust.scale - anchor) + vec2(0.0,thickness/2.0)*adjust.scale;
                    }else if(index < 30.0){ //outline: right
                        P = vec2( thickness, dimensions.y - thickness ) * ((point - vec2(-dimensions.x/thickness + 0.5,0.0)) * adjust.scale - anchor) + vec2(0.0,thickness/2.0)*adjust.scale;
                    }
                    
                    //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                        P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;

                //select colour
                    activeColour = index < 6.0 ? colour : lineColour;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        var fragmentShaderSource = `  
            precision mediump float;
            varying vec4 activeColour;
                                                                        
            void main(){
                gl_FragColor = activeColour;
            }
        `;

        var index = { buffer:undefined, attributeLocation:undefined };
        var point = { buffer:undefined, attributeLocation:undefined };
        var uniformLocations;
        function updateGLAttributes(context,adjust){
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

            //buffers
                //points
                    if(point.buffer == undefined){
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }
            
            //uniforms
                if( uniformLocations == undefined ){
                    uniformLocations = {
                        "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                        "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                        "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                        "resolution": context.getUniformLocation(program, "resolution"),
                        "dimensions": context.getUniformLocation(program, "dimensions"),
                        "thickness": context.getUniformLocation(program, "thickness"),
                        "anchor": context.getUniformLocation(program, "anchor"),
                        "colour": context.getUniformLocation(program, "colour"),
                        "lineColour": context.getUniformLocation(program, "lineColour"),
                    };
                }

                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform2f(uniformLocations["dimensions"], width, height);
                context.uniform1f(uniformLocations["thickness"], thickness);
                context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                context.uniform4f(uniformLocations["lineColour"], self.lineColour.r, self.lineColour.g, self.lineColour.b, self.lineColour.a);
        }
        var program;
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLES, 0, points.length/2);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            //get offset from parent
                if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }

            //calculate points based on the offset
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            
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