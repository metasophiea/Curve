this.loopedPath = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'loopedPath'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{}, isChanged:true };
            this.ignored = false;
            this.colour = {r:0,g:0,b:0,a:1};

        //attributes pertinent to extremity calculation
            var scale = 1; this.scale = function(a){ if(a==undefined){return scale;}  scale = a; this.extremities.isChanged=true; this.computeExtremities(); };
            var points = []; var pointsChanged = true; 
            function lineGenerator(){ points = _canvas_.library.math.loopedPathToPolygonGenerator( path, thickness ); }
            var path = [];      this.points =  function(a){ if(a==undefined){return path;} path = a; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); pointsChanged = true; };
            var thickness = 1;  this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a/2; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); pointsChanged = true; };
            
            this.pointsAsXYArray = function(a){
                if(a==undefined){
                    var output = [];
                    for(var a = 0; a < path.length; a+=2){ output.push({ x:path[a], y:path[a+1] }); }
                    return output;
                }

                var array = [];
                a.forEach(a => array = array.concat([a.x,a.y]));
                this.points(array);
            };
            
    //addressing
        this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };

    //webGL rendering functions
        var vertexShaderSource = 
            _canvas_.library.gsls.geometry + `
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
        var point = { buffer:undefined, attributeLocation:undefined };
        var uniformLocations;
        function updateGLAttributes(context,offset){
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
                    var P = _canvas_.library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                    self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
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
        }
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //activate shape render code
                activateGLRender(context,offset);

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        };
};