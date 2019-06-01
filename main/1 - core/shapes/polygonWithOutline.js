this.polygonWithOutline = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'polygonWithOutline'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{} };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};
            this.lineColour = {r:0,g:0,b:0,a:1};
        //advanced use attributes
            this.devMode = false;
            this.stopAttributeStartedExtremityUpdate = false;

        //attributes pertinent to extremity calculation
            function update(){
                generatedPathPolygon = loopedLineGenerator(); 
                pointsChanged = true; 
                if(this.stopAttributeStartedExtremityUpdate){return;}
                computeExtremities();
            }

            var pointsChanged = true; var generatedPathPolygon = [];
            var points = [];         this.points =      function(a){ if(a==undefined){return points;} points = a; if(this.devMode){console.log(this.getAddress()+'::points');} update(); };
            var thickness = 5;       this.thickness =   function(a){ if(a==undefined){return thickness;} thickness = a/2; if(this.devMode){console.log(this.getAddress()+'::thickness');} update(); };
            var scale = 1;           this.scale =       function(a){ if(a==undefined){return scale;} scale = a; if(this.devMode){console.log(this.getAddress()+'::scale');} update(); };
            var jointDetail = 25;    this.jointDetail = function(a){ if(a==undefined){return jointDetail;} jointDetail = a; if(this.devMode){console.log(this.getAddress()+'::jointDetail');} update(); }
            var jointType = 'sharp'; this.jointType =   function(a){ if(a==undefined){return jointType;} jointType = a; if(this.devMode){console.log(this.getAddress()+'::jointType');} update(); };
            var sharpLimit = 4;      this.sharpLimit =  function(a){ if(a==undefined){return sharpLimit;} sharpLimit = a; if(this.devMode){console.log(this.getAddress()+'::sharpLimit');} update(); };

            function loopedLineGenerator(){ return _canvas_.library.math.pathExtrapolation(points,thickness,'none',jointType,true,jointDetail,sharpLimit); }
            this.pointsAsXYArray = function(a){
                if(this.devMode){console.log(this.getAddress()+'::pointsAsXYArray');}

                if(a==undefined){
                    var output = [];
                    for(var a = 0; a < points.length; a+=2){ output.push({ x:points[a], y:points[a+1] }); }
                    return output;
                }

                this.points( a.map(function(a){
                    if( isNaN(a.x) || isNaN(a.y) ){ console.error('polygonWithOutline::'+self.getAddress()+'::pointsAsXYArray:: points entered contain NAN values'); }
                    return [a.x,a.y];
                }).flat() );
            };
    
    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

    //webGL rendering functions
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
                uniform location offset;
                uniform vec2 resolution;
                uniform vec4 colour;
                uniform vec4 lineColour;
                uniform lowp float indexParting;
        
            //varyings
                varying vec4 activeColour;

            void main(){    
                //adjust point by offset
                    vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;

                //select colour
                    activeColour = index < indexParting ? colour : lineColour;

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
        var point = { buffer:undefined, attributeLocation:undefined, triangles:[] };
        var drawingPoints = [];
        var uniformLocations;
        function updateGLAttributes(context,offset){                
            //buffers
                //points
                    if(point.buffer == undefined || pointsChanged){
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        point.triangles = _canvas_.library.math.polygonToSubTriangles(points,'flatArray');
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(drawingPoints = point.triangles.concat(generatedPathPolygon)), context.STATIC_DRAW);
                        pointsChanged = false;
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }

            //index
                if(index.buffer == undefined || pointsChanged){
                    index.attributeLocation = context.getAttribLocation(program, "index");
                    index.buffer = context.createBuffer();
                    context.enableVertexAttribArray(index.attributeLocation);
                    context.bindBuffer(context.ARRAY_BUFFER, index.buffer); 
                    context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:point.triangles.length/2 + generatedPathPolygon.length/2}).map(Number.call, Number)), context.STATIC_DRAW);
                }else{
                    context.bindBuffer(context.ARRAY_BUFFER, index.buffer);
                    context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                }

            //uniforms
                if( uniformLocations == undefined ){
                    uniformLocations = {
                        "offset.xy": context.getUniformLocation(program, "offset.xy"),
                        "offset.scale": context.getUniformLocation(program, "offset.scale"),
                        "offset.angle": context.getUniformLocation(program, "offset.angle"),
                        "resolution": context.getUniformLocation(program, "resolution"),
                        "colour": context.getUniformLocation(program, "colour"),
                        "indexParting": context.getUniformLocation(program, "indexParting"),
                        "lineColour": context.getUniformLocation(program, "lineColour"),
                    };
                }

                context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
                context.uniform1f(uniformLocations["offset.scale"], offset.scale);
                context.uniform1f(uniformLocations["offset.angle"], offset.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                context.uniform1f(uniformLocations["indexParting"], point.triangles.length/2);
                context.uniform4f(uniformLocations["lineColour"], self.lineColour.r, self.lineColour.g, self.lineColour.b, self.lineColour.a);
        }
        var program;
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }

            context.useProgram(program);
            updateGLAttributes(context,adjust);

            context.drawArrays(context.TRIANGLES, 0, drawingPoints.length/2);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            if(self.devMode){console.log(self.getAddress()+'::computeExtremities');}

            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }                
            //calculate points based on the offset
                self.extremities.points = [];
                for(var a = 0; a < points.length; a+=2){
                    var P = _canvas_.library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                    self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
                }
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                core.render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                core.render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
        }
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
            //activate shape render code
                activateGLRender(context,offset);

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        };
};