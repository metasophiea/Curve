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
        //advanced use attributes
            this.__stopExtremityUpdate = false;

        //attributes pertinent to extremity calculation
            var x = 0;          this.x =      function(a){ if(a==undefined){return x;}      x = a;      computeExtremities(); };
            var y = 0;          this.y =      function(a){ if(a==undefined){return y;}      y = a;      computeExtremities(); };
            var angle = 0;      this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  computeExtremities(); };
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
        var vertexShaderSource = 
            _canvas_.library.gsls.geometry + `
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
                    vec2 P = cartesianAngleAdjust(point*radius*adjust.scale, -adjust.angle) + adjust.xy;

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
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
        this.computeExtremities = function(informParent,offset){
            if(this.__stopExtremityUpdate){return;}
            
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