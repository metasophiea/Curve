this.character = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'character'; this.getType = function(){return type;}
            const vectorLibrary = library.character.vectorLibrary;

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
            var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      if(this.devMode){console.log(this.getAddress()+'::x');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      if(this.devMode){console.log(this.getAddress()+'::y');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  if(this.devMode){console.log(this.getAddress()+'::angle');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; if(this.devMode){console.log(this.getAddress()+'::anchor');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  if(this.devMode){console.log(this.getAddress()+'::width');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; if(this.devMode){console.log(this.getAddress()+'::height');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  if(this.devMode){console.log(this.getAddress()+'::scale');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var font = 'default';   this.font =   function(a){ 
                                        if(a==undefined){return font;}
                                        font = a == undefined || a === '' || vectorLibrary[font] == undefined ? 'default' : a;
                                        points = vectorLibrary[font][a] == undefined ? vectorLibrary[font][''].vector : vectorLibrary[font][a].vector;
                                        pointsChanged = true;

                                        if(this.devMode){console.log(this.getAddress()+'::font');} 
                                        computeExtremities(); 
                                    };
            var character = '';     this.character = function(a){
                                        if(a==undefined){return character;} 
                                        character = a; 
                                        points = vectorLibrary[font][a] == undefined ? vectorLibrary[font][''].vector : vectorLibrary[font][a].vector;
                                        pointsChanged = true;
                            
                                        if(this.devMode){console.log(this.getAddress()+'::character - '+a);}
                                        if(this.stopAttributeStartedExtremityUpdate){return;} 
                                        computeExtremities(); 
                                    };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

    //character data
        this.ratio = function(){
            if( vectorLibrary[font][character] == undefined || vectorLibrary[font][character].ratio == undefined ){ return {x:1,y:1}; }
            return {
                x:vectorLibrary[font][character].ratio.x != undefined ? vectorLibrary[font][character].ratio.x : 1,
                y:vectorLibrary[font][character].ratio.y != undefined ? vectorLibrary[font][character].ratio.y : 1,
            };
        };
        this.offset = function(){
            if( vectorLibrary[font][character] == undefined || vectorLibrary[font][character].offset == undefined ){ return {x:0,y:0}; }
            return {
                x:vectorLibrary[font][character].offset.x != undefined ? vectorLibrary[font][character].offset.x : 0,
                y:vectorLibrary[font][character].offset.y != undefined ? vectorLibrary[font][character].offset.y : 0,
            };
        };
        this.encroachUponList = function(){
            if( vectorLibrary[font][character] == undefined || vectorLibrary[font][character].encroachUpon == undefined ){ return []; }
            return vectorLibrary[font][character].encroachUpon;
        };

    //webGL rendering functions
        var points = [ 0,0, 1,0, 1,1,  0,0, 1,1, 0,1 ];
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
                uniform vec2 dimensions;
                uniform vec2 anchor;

            void main(){
                //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                    vec2 P = dimensions * adjust.scale * (point - anchor);
                    P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;

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
            if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }

            context.useProgram(program);
            updateGLAttributes(context,adjust);

            context.drawArrays(context.TRIANGLES, 0, points.length/2);
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

            //// "point in poly" detection currently doesn't understand polys with holes in them, so these complex
            //// shapes are being simplified to their boudning boxes
                self.extremities.points = [
                    {x:self.extremities.boundingBox.topLeft.x,y:self.extremities.boundingBox.topLeft.y},
                    {x:self.extremities.boundingBox.bottomRight.x,y:self.extremities.boundingBox.bottomRight.y},
                ];

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
















this.character.vectorLibrary = {};
this.character.vectorLibrary.default = {
    '':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,1, 0,1, 0,0, 0.2,0.2,  0.2,0.8, 0.8,0.8, 0.8,0.2, 0.2,0.2 ]) },


    'A':{ vector:_canvas_.library.thirdparty.earcut([ 0,1, 0.4,0, 0.6,0, 1,1, 0.8,1, 0.5,0.2, 0.4,0.5, 0.65,0.5, 0.7,0.7, 0.3,0.7, 0.2,1 ]) },
    'B':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.8, 0.7,0.8, 0.8,0.7, 0.8,0.6, 0.7,0.5, 0.2,0.5, 0.2,0.3, 0.7,0.3, 0.7,0.2, 0.2,0.2, 0.2,0, 0.8,0, 0.9,0.1, 0.9,0.3, 0.8,0.4, 1,0.6, 1,0.8, 0.8,1, 0,1 ]) },
    'C':{ vector:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.8,0, 1,0.2, 0.8,0.3, 0.7,0.2, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.7,0.8, 0.8,0.7, 1,0.8, 0.8,1, 0.3,1, 0,0.7, 0,0.3 ]) },
    'D':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.8, 0.7,0.8, 0.8,0.7, 0.8,0.3, 0.7,0.2, 0.2,0.2, 0.2,0, 0.8,0, 1,0.2, 1,0.8, 0.8,1, 0,1 ]) },
    'E':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.2,0.2, 0.2,0.4, 1,0.4, 1,0.6, 0.2,0.6, 0.2,0.8, 1,0.8, 1,1, 0,1 ]) },
    'F':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.2,0.2, 0.2,0.4, 1,0.4, 1,0.6, 0.2,0.6, 0.2,1, 0,1 ]) },
    'G':{ vector:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.8,0, 1,0.2, 0.8,0.3, 0.7,0.2, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.8,0.8, 0.8,0.6, 1,0.6, 1,1, 0.3,1, 0,0.7, 0,0.3 ]) },
    'H':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.4, 0.8,0.4, 0.8,0, 1,0, 1,1, 0.8,1, 0.8,0.6, 0.2,0.6, 0.2,1, 0,1 ]) },
    'I':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.6,0.2, 0.6,0.8, 1,0.8, 1,1, 0,1, 0,0.8, 0.4,0.8, 0.4,0.2, 0,0.2 ]) },
    'J':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.6,0.2, 0.6,0.8, 0.4,1, 0,1, 0,0.8, 0.3,0.8, 0.4,0.7, 0.4,0.2, 0,0.2 ]) },
    'K':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.3, 1,0, 1,0.2, 0.5,0.4, 1,1, 0.75,1, 0.3,0.45, 0.2,0.5, 0.2,1, 0,1 ]) },
    'L':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.8, 1,0.8, 1,1, 0,1 ]) },
    'M':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.5,0.4, 0.8,0, 1,0, 1,1, 0.8,1, 0.8,0.3, 0.5,0.7, 0.2,0.3, 0.2,1, 0,1 ]) },
    'N':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.8,0.7, 0.8,0, 1,0, 1,1, 0.8,1, 0.2,0.3, 0.2,1, 0,1 ]) },
    'O':{ vector:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.7,0, 1,0.3, 1,0.7, 0.7,1, 0.3,1, 0,0.7, 0,0.3, 0.3,0, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.6,0.8, 0.8,0.6, 0.8,0.4, 0.6,0.2, 0.4,0.2 ]) },
    'P':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.8,0, 1,0.2, 1,0.4, 0.8,0.6, 0.2,0.6, 0.2,0.4, 0.7,0.4, 0.8,0.3, 0.7,0.2, 0.2,0.2, 0.2,1, 0,1 ]) },
    'Q':{ vector:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.7,0, 1,0.3, 1,0.7, 0.95,0.75, 1,0.8, 1,1, 0.8,1, 0.5,0.7, 0.5,0.5, 0.7,0.5, 0.8,0.6, 0.8,0.4, 0.6,0.2, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.6,0.8, 0.75,0.95, 0.7,1, 0.3,1, 0,0.7, 0,0.3 ]) },
    'R':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.8,0, 1,0.2, 1,0.4, 0.8,0.6, 0.6,0.6, 1,1, 0.75,1, 0.35,0.6, 0.2,0.6, 0.2,0.4, 0.7,0.4, 0.8,0.3, 0.7,0.2, 0.2,0.2, 0.2,1, 0,1 ]) },
    'S':{ vector:_canvas_.library.thirdparty.earcut([ 0.2,0, 0.8,0, 1,0.2, 1,0.3, 0.8,0.3, 0.7,0.2, 0.3,0.2, 0.2,0.3, 0.3,0.4, 0.8,0.4, 1,0.6, 1,0.8, 0.8,1, 0.2,1, 0,0.8, 0,0.7, 0.2,0.7, 0.3,0.8, 0.7,0.8, 0.8,0.7, 0.7,0.6, 0.2,0.6, 0,0.4, 0,0.2 ]) },
    'T':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.6,0.2, 0.6,1, 0.4,1, 0.4,0.2, 0,0.2 ]) },
    'U':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.6, 0.4,0.8, 0.6,0.8, 0.8,0.6, 0.8,0, 1,0, 1,0.7, 0.7,1, 0.3,1, 0,0.7 ]) },
    'V':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.5,0.7, 0.8,0, 1,0, 0.6,1, 0.4,1 ]) },
    'W':{ vector:_canvas_.library.thirdparty.earcut([ 0,1, 0.2,1, 0.5,0.6, 0.8,1, 1,1, 1,0, 0.8,0, 0.8,0.7, 0.5,0.3, 0.2,0.7, 0.2,0, 0,0 ]) },
    'X':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.25,0, 0.5,0.35, 0.75,0, 1,0, 0.6,0.5, 1,1, 0.75,1, 0.5,0.65, 0.25,1, 0,1, 0.4,0.5 ]) },
    'Y':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.25,0, 0.5,0.35, 0.75,0, 1,0, 0.25,1, 0,1, 0.35,0.5 ]) },
    'Z':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.3,0.2, 1,0.8, 1,1, 0,1, 0,0.8, 0.7,0.8, 0,0.2 ]) },


    'a':{
        vector:_canvas_.library.thirdparty.earcut([  0.2/0.8,0.0/0.6, 0.5/0.8,0.0/0.6, 0.7/0.8,0.2/0.6, 0.7/0.8,0.5/0.6, 0.8/0.8,0.6/0.6, 0.5/0.8,0.6/0.6, 0.5/0.8,0.3/0.6, 0.4/0.8,0.2/0.6, 0.3/0.8,0.2/0.6, 0.2/0.8,0.3/0.6, 0.3/0.8,0.4/0.6, 0.5/0.8,0.4/0.6, 0.5/0.8,0.6/0.6, 0.2/0.8,0.6/0.6, 0.0/0.8,0.4/0.6, 0.0/0.8,0.2/0.6 ]),
        ratio:{x:0.8,y:0.6}, offset:{y:0.4},
        encroachUpon:['a','t'],
    },
    'b':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 0.2/0.7,0, 0.2/0.7,0.8, 0.4/0.7,0.8, 0.5/0.7,0.7, 0.4/0.7,0.6, 0.2/0.7,0.6, 0.2/0.7,0.4, 0.5/0.7,0.4, 0.7/0.7,0.6, 0.7/0.7,0.8, 0.5/0.7,1, 0,1 ]),
        ratio:{x:0.7}
    },
    'c':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2/0.7,0.0/0.6, 0.7/0.7,0.0/0.6, 0.7/0.7,0.2/0.6, 0.3/0.7,0.2/0.6, 0.2/0.7,0.3/0.6, 0.3/0.7,0.4/0.6, 0.7/0.7,0.4/0.6, 0.7/0.7,0.6/0.6, 0.2/0.7,0.6/0.6, 0.0/0.7,0.4/0.6, 0.0/0.7,0.2/0.6 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
        encroachUpon:['a'],
    },
    'd':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.6, 0.2/0.7,0.4, 0.5/0.7,0.4, 0.5/0.7,0.6, 0.3/0.7,0.6, 0.2/0.7,0.7, 0.3/0.7,0.8, 0.5/0.7,0.8, 0.5/0.7,0.0, 0.7/0.7,0.0, 0.7/0.7,1.0, 0.2/0.7,1.0, 0.0/0.7,0.8 ]),
        ratio:{x:0.7},
        encroachUpon:['a'],
    },
    'e':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2,0.0/0.8, 0.8,0.0/0.8, 1.0,0.2/0.8, 1.0,0.4/0.8, 0.9,0.5/0.8, 0.2,0.5/0.8, 0.2,0.3/0.8, 0.8,0.3/0.8, 0.7,0.2/0.8, 0.3,0.2/0.8, 0.2,0.3/0.8, 0.2,0.5/0.8, 0.3,0.6/0.8, 1.0,0.6/0.8, 0.8,0.8/0.8, 0.2,0.8/0.8, 0.0,0.6/0.8, 0.0,0.2/0.8 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
        encroachUpon:['t','x'],
    },
    'f':{
        vector:_canvas_.library.thirdparty.earcut([ 0.3/0.4,0.0, 0.4/0.4,0.0, 0.4/0.4,0.2, 0.3/0.4,0.3, 0.3/0.4,0.4, 0.4/0.4,0.4, 0.4/0.4,0.6, 0.3/0.4,0.6, 0.3/0.4,1.0, 0.1/0.4,1.0, 0.1/0.4,0.6, 0.0/0.4,0.6, 0.0/0.4,0.4, 0.1/0.4,0.4, 0.1/0.4,0.2 ]),
        ratio:{x:0.4}, 
    },
    'g':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2/0.7,0.0/1.1, 0.6/0.7,0.0/1.1, 0.7/0.7,0.1/1.1, 0.7/0.7,0.9/1.1, 0.5/0.7,1.1/1.1, 0.2/0.7,1.1/1.1, 0.0/0.7,0.9/1.1, 0.0/0.7,0.8/1.1, 0.2/0.7,0.8/1.1, 0.3/0.7,0.9/1.1, 0.4/0.7,0.9/1.1, 0.5/0.7,0.8/1.1, 0.5/0.7,0.2/1.1, 0.3/0.7,0.2/1.1, 0.2/0.7,0.3/1.1, 0.3/0.7,0.4/1.1, 0.5/0.7,0.4/1.1, 0.5/0.7,0.6/1.1, 0.2/0.7,0.6/1.1, 0.0/0.7,0.4/1.1, 0.0/0.7,0.2/1.1 ]),
        ratio:{x:0.7,y:1.1}, offset:{y:0.4},
    },
    'h':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0, 0.2/0.7,0.0, 0.2/0.7,0.4, 0.5/0.7,0.4, 0.7/0.7,0.6, 0.7/0.7,1.0, 0.5/0.7,1.0, 0.5/0.7,0.7, 0.4/0.7,0.6, 0.2/0.7,0.6, 0.2/0.7,1.0, 0.0/0.7,1.0 ]),
        ratio:{x:0.7}
    },
    'i':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0,0.2, 0,0.3, 1,0.3, 1,1, 0,1 ]),
        ratio:{x:0.2},
    },
    'j':{
        vector:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.7,0, 0.7,0.2, 0.3,0.2, 0.3,0.3, 0.7,0.3, 0.7,0.7, 0.4,1, 0,1, 0,0.8, 0.2,0.8, 0.3,0.7 ]),
        ratio:{x:0.5},
    },
    'k':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.75,0.0, 0.2/0.75,0.0, 0.2/0.75,0.5, 0.5/0.75,0.3, 0.75/0.75,0.3, 0.35/0.75,0.6, 0.75/0.75,1.0, 0.5/0.75,1.0, 0.2/0.75,0.7, 0.2/0.75,1.0, 0.0/0.75,1.0 ]),
        ratio:{x:0.75}
    },
    'l':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.5,0.0, 0.2/0.5,0.0, 0.2/0.5,0.7, 0.3/0.5,0.8, 0.5/0.5,0.8, 0.5/0.5,1.0, 0.2/0.5,1.0, 0.0/0.5,0.8 ]),
        ratio:{x:0.5},
        encroachUpon:['a'],
    },
    'm':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/1.2,0.0/0.6, 1.0/1.2,0.0/0.6, 1.2/1.2,0.2/0.6, 1.2/1.2,0.6/0.6, 1.0/1.2,0.6/0.6, 1.0/1.2,0.3/0.6, 0.9/1.2,0.2/0.6, 0.7/1.2,0.2/0.6, 0.7/1.2,0.6/0.6, 0.5/1.2,0.6/0.6, 0.5/1.2,0.3/0.6, 0.4/1.2,0.2/0.6, 0.2/1.2,0.2/0.6, 0.2/1.2,0.6/0.6, 0.0/1.2,0.6/0.6 ]),
        ratio:{x:1.2,y:0.6}, offset:{y:0.4},
    },
    'n':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0/0.6, 0.5/0.7,0.0/0.6, 0.7/0.7,0.2/0.6, 0.7/0.7,0.6/0.6, 0.5/0.7,0.6/0.6, 0.5/0.7,0.3/0.6, 0.4/0.7,0.2/0.6, 0.2/0.7,0.2/0.6, 0.2/0.7,0.6/0.6, 0.0/0.7,0.6/0.6 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
    },
    'o':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2/0.6,0.0/0.6, 0.4/0.6,0.0/0.6, 0.6/0.6,0.2/0.6, 0.6/0.6,0.4/0.6, 0.4/0.6,0.6/0.6, 0.2/0.6,0.6/0.6, 0.0/0.6,0.4/0.6, 0.0/0.6,0.2/0.6, 0.2/0.6,0.3/0.6, 0.3/0.6,0.4/0.6, 0.4/0.6,0.3/0.6, 0.3/0.6,0.2/0.6, 0.2/0.6,0.3/0.6, 0.0/0.6,0.2/0.6 ]),
        ratio:{x:0.6,y:0.6}, offset:{y:0.4},
        encroachUpon:['t'],
    },
    'p':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0, 0.5/0.7,0.0, 0.7/0.7,0.2, 0.7/0.7,0.4, 0.5/0.7,0.6, 0.2/0.7,0.6, 0.2/0.7,0.4, 0.4/0.7,0.4, 0.5/0.7,0.3, 0.4/0.7,0.2, 0.2/0.7,0.2, 0.2/0.7,1.0, 0.0/0.7,1.0 ]),
        ratio:{x:0.7}, offset:{y:0.4},
    },
    'q':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2/0.7,0.0, 0.7/0.7,0.0, 0.7/0.7,1.0, 0.5/0.7,1.0, 0.5/0.7,0.2, 0.3/0.7,0.2, 0.2/0.7,0.3, 0.3/0.7,0.4, 0.5/0.7,0.4, 0.5/0.7,0.6, 0.2/0.7,0.6, 0.0/0.7,0.4, 0.0/0.7,0.2 ]),
        ratio:{x:0.7}, offset:{y:0.4},
    },
    'r':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0/0.6, 0.2/0.7,0.0/0.6, 0.2/0.7,0.1/0.6, 0.4/0.7,0.0/0.6, 0.7/0.7,0.1/0.6, 0.7/0.7,0.3/0.6, 0.4/0.7,0.2/0.6, 0.2/0.7,0.3/0.6, 0.2/0.7,0.6/0.6, 0.0/0.7,0.6/0.6 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
    },
    's':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2/0.8,0.0/0.8, 0.7/0.8,0.0/0.8, 0.8/0.8,0.2/0.8, 0.3/0.8,0.2/0.8, 0.25/0.8,0.3/0.8, 0.7/0.8,0.3/0.8, 0.8/0.8,0.6/0.8, 0.6/0.8,0.8/0.8, 0.1/0.8,0.8/0.8, 0.0/0.8,0.6/0.8, 0.5/0.8,0.6/0.8, 0.55/0.8,0.5/0.8, 0.1/0.8,0.5/0.8, 0.0/0.8,0.2/0.8 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
    },
    't':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2/0.6,0.0, 0.4/0.6,0.0, 0.4/0.6,0.2, 0.6/0.6,0.2, 0.6/0.6,0.4, 0.4/0.6,0.4, 0.4/0.6,1.0, 0.2/0.6,1.0, 0.2/0.6,0.4, 0.0/0.6,0.4, 0.0/0.6,0.2, 0.2/0.6,0.2 ]),
        ratio:{x:0.6},
        encroachUpon:['a','l','n','o','p','r','s','u'],
    },
    'u':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0/0.6, 0.2/0.7,0.0/0.6, 0.2/0.7,0.3/0.6, 0.3/0.7,0.4/0.6, 0.5/0.7,0.4/0.6, 0.5/0.7,0.0/0.6, 0.7/0.7,0.0/0.6, 0.7/0.7,0.6/0.6, 0.2/0.7,0.6/0.6, 0.0/0.7,0.4/0.6 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
        encroachUpon:['A'],
    },
    'v':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0/0.6, 0.2/0.7,0.0/0.6, 0.35/0.7,0.35/0.6, 0.5/0.7,0.0/0.6, 0.7/0.7,0.0/0.6, 0.45/0.7,0.6/0.6, 0.25/0.7,0.6/0.6 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
    },
    'w':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/1.2,0.0/0.6, 0.2/1.2,0.0/0.6, 0.2/1.2,0.3/0.6, 0.3/1.2,0.4/0.6, 0.5/1.2,0.4/0.6, 0.5/1.2,0.0/0.6, 0.7/1.2,0.0/0.6, 0.7/1.2,0.3/0.6, 0.8/1.2,0.4/0.6, 1.0/1.2,0.4/0.6, 1.0/1.2,0.0/0.6, 1.2/1.2,0.0/0.6, 1.2/1.2,0.6/0.6, 0.2/1.2,0.6/0.6, 0.0/1.2,0.4/0.6 ]),
        ratio:{x:1.2,y:0.6}, offset:{y:0.4},
    },
    'x':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0/0.6, 0.2/0.7,0.0/0.6, 0.35/0.7,0.175/0.6, 0.5/0.7,0.0/0.6, 0.7/0.7,0.0/0.6, 0.45/0.7,0.3/0.6, 0.7/0.7,0.6/0.6, 0.5/0.7,0.6/0.6, 0.35/0.7,0.425/0.6, 0.2/0.7,0.6/0.6, 0.0/0.7,0.6/0.6, 0.25/0.7,0.3/0.6 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
    },
    'y':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0/1.1, 0.2/0.7,0.0/1.1, 0.2/0.7,0.3/1.1, 0.3/0.7,0.4/1.1, 0.5/0.7,0.4/1.1, 0.5/0.7,0.0/1.1, 0.7/0.7,0.0/1.1, 0.7/0.7,0.9/1.1, 0.5/0.7,1.1/1.1, 0.2/0.7,1.1/1.1, 0.0/0.7,0.9/1.1, 0.0/0.7,0.8/1.1, 0.2/0.7,0.8/1.1, 0.3/0.7,0.9/1.1, 0.4/0.7,0.9/1.1, 0.5/0.7,0.8/1.1, 0.5/0.7,0.6/1.1, 0.2/0.7,0.6/1.1, 0.0/0.7,0.4/1.1 ]),
        ratio:{x:0.7,y:1.1}, offset:{y:0.4},
        encroachUpon:['a'],
    },
    'z':{
        vector:_canvas_.library.thirdparty.earcut([ 0.0/0.7,0.0/0.6, 0.7/0.7,0.0/0.6, 0.7/0.7,0.2/0.6, 0.35/0.7,0.2/0.6, 0.7/0.7,0.4/0.6, 0.7/0.7,0.6/0.6, 0.0/0.7,0.6/0.6, 0.0/0.7,0.4/0.6, 0.35/0.7,0.4/0.6, 0.0/0.7,0.2/0.6 ]),
        ratio:{x:0.7,y:0.6}, offset:{y:0.4},
    },


    '0':{ vector:_canvas_.library.thirdparty.earcut([ 0.2,0, 0.8,0, 1,0.3, 1,0.7, 0.8,1, 0.2,1, 0,0.7, 0,0.3, 0.2,0, 0.3,0.2, 0.2,0.4, 0.2,0.6, 0.3,0.8, 0.7,0.8, 0.8,0.6, 0.8,0.4, 0.7,0.2, 0.3,0.2 ]), },
    '1':{ vector:_canvas_.library.thirdparty.earcut([ 1/2,0, 2/3,0, 2/3,0.8, 1,0.8, 1,1, 0,1, 0,0.8, 1/3,0.8, 1/3,0.3, 0,0.3, 0,0.2 ]), ratio:{x:2/3} },
    '2':{ vector:_canvas_.library.thirdparty.earcut([ 0,0.2, 0.2,0, 0.8,0, 1,0.2, 1,0.5, 0.4,0.8, 1,0.8, 1,1, 0,1, 0,0.8, 0.8,0.4, 0.7,0.2, 0.3,0.2, 0.2,0.3, 0,0.3 ]) },
    '3':{ vector:_canvas_.library.thirdparty.earcut([ 0,0.2, 0.2,0, 0.8,0, 1,0.2, 1,0.4, 0.9,0.5, 1,0.6, 1,0.8, 0.8,1, 0.2,1, 0,0.8, 0.2,0.7, 0.3,0.8, 0.7,0.8, 0.8,0.7, 0.7,0.6, 0.4,0.6, 0.4,0.4, 0.7,0.4, 0.8,0.3, 0.7,0.2, 0.3,0.2, 0.2,0.3 ]) },
    '4':{ vector:_canvas_.library.thirdparty.earcut([ 0.6,0, 0.8,0, 0.8,0.6, 1,0.6, 1,0.8, 0.8,0.8, 0.8,1, 0.6,1, 0.6,0.3, 0.3,0.6, 0.6,0.6, 0.6,0.8, 0,0.8, 0,0.6 ]) },
    '5':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.2,0.2, 0.2,0.4, 0.9,0.4, 1,0.5, 1,0.8, 0.8,1, 0.1,1, 0,0.9, 0,0.7, 0.2,0.7, 0.2,0.8, 0.7,0.8, 0.8,0.7, 0.8,0.6, 0,0.6 ]) },
    '6':{ vector:_canvas_.library.thirdparty.earcut([ 0.2,0, 0.8,0, 1,0.2, 1,0.3, 0.8,0.3, 0.7,0.2, 0.3,0.2, 0.2,0.3, 0.3,0.4, 0.8,0.4, 1,0.6, 1,0.8, 0.8,1, 0.2,1, 0,0.8, 0,0.2, 0.2,0.6, 0.2,0.7, 0.3,0.8, 0.7,0.8, 0.8,0.7, 0.7,0.6, 0.2,0.6, 0,0.2 ]) },
    '7':{ vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.5,1, 0.25,1, 0.75,0.2, 0,0.2 ]) },
    '8':{ vector:_canvas_.library.thirdparty.earcut([ 0.2,0, 0.8,0, 1,0.2, 1,0.4, 0.9,0.5, 1,0.6, 1,0.8, 0.8,1, 0.2,1, 0,0.8, 0,0.6, 0.2,0.7, 0.3,0.8, 0.7,0.8, 0.8,0.7, 0.7,0.6, 0.3,0.6, 0.2,0.7, 0,0.6, 0.1,0.5, 0,0.4, 0,0.2, 0.2,0.3, 0.3,0.4, 0.7,0.4, 0.8,0.3, 0.7,0.2, 0.3,0.2, 0.2,0.3, 0,0.2 ]) },
    '9':{ vector:_canvas_.library.thirdparty.earcut([ 0.8,1, 0.2,1, 0,0.8, 0,0.7, 0.2,0.7, 0.3,0.8, 0.7,0.8, 0.8,0.7, 0.7,0.6, 0.2,0.6, 0,0.4, 0,0.2, 0.2,0, 0.8,0, 1,0.2, 1,0.8, 0.8,0.4, 0.8,0.3, 0.7,0.2, 0.3,0.2, 0.2,0.3, 0.3,0.4, 0.8,0.4, 1,0.8 ]) },


    '.':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,1, 0,1 ]),
        ratio:{x:0.2, y:0.2}, offset:{y:0.8},
    },
    ',':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2,0., 1,0, 0.8,1, 0,1 ]),
        ratio:{x:0.2, y:0.4}, offset:{y:0.8},
    },
    ':':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.3, 0,0.3, 0,0.7, 1,0.7, 1,1, 0,1 ]),
        ratio:{x:0.2, y:0.8}, offset:{y:0.1},
    },
    ';':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2,0, 1,0, 1,0.3, 0.2,0.3, 0.2,0.7, 1,0.7, 0.8,1, 0,1, 0.2,0.7 ]),
        ratio:{x:0.2, y:0.8}, offset:{y:0.1},
    },
    '?':{
        vector:_canvas_.library.thirdparty.earcut([
            0,0.4, 0,0.1, 0.1,0, 0.9,0, 1,0.1, 1,0.5, 0.9,0.6, 0.6,0.6, 0.6,0.7, 0.4,0.7, 0.4,0.8, 0.6,0.8, 0.6,1, 0.4,1, 0.4,0.8, 0.4,0.7, 0.4,0.5, 0.5,0.4, 0.8,0.4, 0.8,0.2, 0.2,0.2, 0.2,0.4
        ]),
    },
    '!':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.7, 0,0.7, 0,0.8, 1,0.8, 1,1, 0,1 ]),
        ratio:{x:0.2},
    },
    '/':{
        vector:_canvas_.library.thirdparty.earcut([ 0.3,0, 1,0, 0.7,1, 0,1 ]),
        ratio:{x:1/4},
    },
   '\\':{
       vector:_canvas_.library.thirdparty.earcut([ 0.7,0, 0,0, 0.3,1, 1,1 ]),
       ratio:{x:1/4},
    },
    '(':{
        vector:_canvas_.library.thirdparty.earcut([ 0.6,0, 1,0, 0.6,0.2, 0.4,0.5, 0.6,0.8, 1,1, 0.6,1, 0.2,0.8, 0,0.5, 0.2,0.2 ]),
        ratio:{x:0.4},
    },
    ')':{
        vector:_canvas_.library.thirdparty.earcut([ 0.4,0, 0,0, 0.4,0.2, 0.6,0.5, 0.4,0.8, 0,1, 0.4,1, 0.8,0.8, 1,0.5, 0.8,0.2 ]),
        ratio:{x:0.4},
    },
    '[':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.4,0.2, 0.4,0.8, 1,0.8, 1,1, 0,1 ]),
        ratio:{x:0.4},
    },
    ']':{
        vector:_canvas_.library.thirdparty.earcut([ 1,0, 0,0, 0,0.2, 0.6,0.2, 0.6,0.8, 0,0.8, 0,1, 1,1  ]),
        ratio:{x:0.4},
    },
    '#':{
        vector:_canvas_.library.thirdparty.earcut([ 0.2,0, 0.4,0, 0.38,0.2, 0.68,0.2, 0.7,0, 0.9,0, 0.88,0.2, 1,0.2, 1,0.4, 0.86,0.4, 0.84,0.6, 1,0.6, 1,0.8, 0.82,0.8, 0.8,1, 0.6,1, 0.62,0.8, 0.32,0.8, 0.3,1, 0.1,1, 0.12,0.8, 0,0.8, 0,0.6, 0.14,0.6, 0.16,0.4, 0,0.4, 0,0.2, 0.18,0.2, 0.36,0.4, 0.34,0.6, 0.64,0.6, 0.66,0.4, 0.36,0.4, 0.18,0.2 ])
    },
    '-':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,1, 0,1 ]),
        ratio:{x:0.5, y:0.2}, offset:{y:0.4},
    },
    '_':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,1, 0,1 ]),
        ratio:{y:0.2}, offset:{y:1},
    },
    "'":{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,1, 0,1 ]),
        ratio:{x:0.2, y:0.4},
    },
    '"':{
        vector:_canvas_.library.thirdparty.earcut([ 0.4,0, 0,0, 0,1, 0.4,1, 0.4,0, 0.6,0, 0.6,1, 1,1, 1,0 ]),
        ratio:{x:0.5, y:0.4},
    },
    '|':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,1, 0,1  ]),
        ratio:{x:0.2},
    },
    '>':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0.4, 1,0.6, 0,1, 0,0.8, 0.7,0.5, 0,0.2 ])
    },
    '<':{
        vector:_canvas_.library.thirdparty.earcut([ 1,0, 0,0.4, 0,0.6, 1,1, 1,0.8, 0.3,0.5, 1,0.2 ])
    },
    '+':{
        vector:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.7,0, 0.7,0.3, 1,0.3, 1,0.7, 0.7,0.7, 0.7,1, 0.3,1, 0.3,0.7, 0,0.7, 0,0.3, 0.3,0.3 ]),
        ratio:{x:0.5, y:0.5}, offset:{y:0.25}
    },
    '=':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.3, 0,0.3, 0,0.7, 1,0.7, 1,1, 0,1 ]),
        ratio:{x:0.8, y:0.5}, offset:{y:0.25}
    },
    '&':{
        vector:_canvas_.library.thirdparty.earcut([ 0.1,0, 0.6,0, 0.7,0.2, 0.7,0.4, 0.6,0.5, 0.4,0.6, 0.6,0.7, 0.8,0.5, 0.9,0.6, 0.9,0.7, 0.8,0.8, 1,0.8, 1,1, 0.8,1, 0.6,0.9, 0.5,1, 0.1,1, 0,0.9, 0,0.6, 0.1,0.5, 0.2,0.65, 0.2,0.8, 0.4,0.8, 0.2,0.65, 0,0.4, 0,0.3, 0.1,0, 0.2,0.2, 0.2,0.3, 0.3,0.4, 0.5,0.4, 0.5,0.2, 0.2,0.2 ])
    },
    '*':{
        vector:_canvas_.library.thirdparty.earcut([ 0.4,0, 0.6,0, 0.6,0.25, 0.775,0.075, 0.925,0.225, 0.75,0.4, 1,0.4, 1,0.6, 0.75,0.6, 0.925,0.775, 0.775,0.925, 0.6,0.75, 0.6,1, 0.4,1, 0.4,0.75, 0.225,0.925, 0.075,0.775, 0.25,0.6, 0,0.6, 0,0.4, 0.25,0.4, 0.075,0.225, 0.225,0.075, 0.4,0.25 ]),
        ratio:{x:0.5, y:0.5}, offset:{y:0.25}
    },
    '~':{
        vector:_canvas_.library.thirdparty.earcut([ 0,0.25, 0.25,0.0, 0.75,0.5, 1,0.25, 1,0.75, 0.75,1, 0.25,0.5, 0,0.75 ]),
        ratio:{x:0.8, y:0.4}, offset:{y:0.25},
    },
    '%':{
        vector:_canvas_.library.thirdparty.earcut([ 0.8,0, 1,0.2, 0.2,1, 0,0.8, 0,0.2, 0,0.1, 0.1,0, 0.2,0, 0.3,0.1, 0.3,0.2, 0.3,0.2, 0.2,0.3, 0.1,0.3, 0,0.2, 0,0.8, 0.2,1, 0.8,1, 0.7,0.9, 0.7,0.8, 0.8,0.7, 0.9,0.7, 1,0.8, 1,0.9, 0.9,1, 0.8,1, 0.2,1, 0,0.8 ])
    },
};