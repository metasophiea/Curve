this.rectangle = function(name,_id){
    let self = this;

    //attributes 
        //protected attributes
            const type = 'rectangle'; this.getType = function(){return type;}
            const id = _id; this.getId = function(){return id;}

        //simple attributes
            this.name = name;
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
            let ignored = false;
            let colour = {r:1,g:0,b:0,a:1};
            this.ignored = function(a){
                if(a==undefined){return ignored;}     
                ignored = a;
                dev.log('shapeLibrary','.group.ignored('+a+')');
                computeExtremities();
            };
            this.colour = function(a){
                if(a==undefined){return colour;}     
                colour = a;
                dev.log('shapeLibrary','.group.colour('+a+')');
                computeExtremities();
            };
        //advanced use attributes
            this.devMode = false;

        //attributes pertinent to extremity calculation
            let x = 0;
            let y = 0; 
            let angle = 0;
            let anchor = {x:0,y:0};
            let width = 10;
            let height = 10;
            let scale = 1;
            let static = false;
            this.x = function(a){
                if(a==undefined){return x;}      
                x = a;
                dev.log('shapeLibrary','.rectangle.x('+a+')');
                computeExtremities();
            };
            this.y = function(a){
                if(a==undefined){return y;}      
                y = a;      
                dev.log('shapeLibrary','.rectangle.y('+a+')');
                computeExtremities();
            };
            this.angle = function(a){
                if(a==undefined){return angle;}  
                angle = a;  
                dev.log('shapeLibrary','.rectangle.angle('+a+')');
                computeExtremities();
            };
            this.anchor = function(a){
                if(a==undefined){return anchor;} 
                anchor = a; 
                dev.log('shapeLibrary','.rectangle.anchor('+a+')');
                computeExtremities();
            };
            this.width = function(a){
                if(a==undefined){return width;}  
                width = a;  
                dev.log('shapeLibrary','.rectangle.width('+a+')');
                computeExtremities();
            };
            this.height = function(a){
                if(a==undefined){return height;} 
                height = a; 
                dev.log('shapeLibrary','.rectangle.height('+a+')');
                computeExtremities();
            };
            this.scale = function(a){
                if(a==undefined){return scale;}  
                scale = a;  
                dev.log('shapeLibrary','.rectangle.scale('+a+')');
                computeExtremities();
            };
            this.static = function(a){
                if(a==undefined){return static;}  
                static = a;  
                dev.log('shapeLibrary','.rectangle.static('+a+')');
                computeExtremities();
            };
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return {x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, ignored:ignored, colour:colour, static:static}; } 
                dev.log('shapeLibrary','.rectangle.unifiedAttribute('+JSON.stringify(attributes)+')');

                if('ignored' in attributes){ ignored = attributes.ignored; }
                if('colour' in attributes){ colour = attributes.colour; }

                if('x' in attributes){ x = attributes.x; }
                if('y' in attributes){ y = attributes.y; }
                if('angle' in attributes){ angle = attributes.angle; }
                if('anchor' in attributes){ anchor = attributes.anchor; }
                if('width' in attributes){ width = attributes.width; }
                if('height' in attributes){ height = attributes.height; }
                if('scale' in attributes){ scale = attributes.scale; }
                if('static' in attributes){ scale = attributes.static; }

                computeExtremities();
            };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

    //webGL rendering functions
        let points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        let vertexShaderSource = `#version 300 es
            //constants
                in vec2 point;

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
        let fragmentShaderSource = `#version 300 es
            precision mediump float;
            out vec4 outputColor;
            uniform vec4 colour;
                                                                        
            void main(){
                outputColor = colour;
            }
        `;
        let point = { buffer:undefined, attributeLocation:undefined };
        let uniformLocations;
        function updateGLAttributes(context,adjust){
            dev.log('shapeLibrary','.rectangle::updateGLAttributes(-context-,'+JSON.stringify(adjust)+')');

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
                        "anchor": context.getUniformLocation(program, "anchor"),
                        "colour": context.getUniformLocation(program, "colour"),
                    };
                }

                dev.log('shapeLibrary','.rectangle::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y);
                dev.log('shapeLibrary','.rectangle::updateGLAttributes -> adjust.scale:'+adjust.scale);
                dev.log('shapeLibrary','.rectangle::updateGLAttributes -> adjust.angle:'+adjust.angle);
                dev.log('shapeLibrary','.rectangle::updateGLAttributes -> '+context.canvas.width+' '+context.canvas.height);
                dev.log('shapeLibrary','.rectangle::updateGLAttributes -> width:'+width+' height:'+height);
                dev.log('shapeLibrary','.rectangle::updateGLAttributes -> anchor.x:'+anchor.x+' anchor.y:'+anchor.y);
                dev.log('shapeLibrary','.rectangle::updateGLAttributes -> colour:'+JSON.stringify(colour));
                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform2f(uniformLocations["dimensions"], width, height);
                context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                context.uniform4f(uniformLocations["colour"], colour.r, colour.g, colour.b, colour.a);
        }
        let program;
        function activateGLRender(context,adjust){
            dev.log('shapeLibrary','.rectangle::activateGLRender(-context-,'+JSON.stringify(adjust)+')');
            if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            dev.log('shapeLibrary','.rectangle::computeExtremities('+informParent+','+JSON.stringify(offset)+')');
            
            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //calculate adjusted offset based on the offset
                let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                let adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };
            //calculate points based on the adjusted offset
                self.extremities.points = [];
                for(let a = 0; a < points.length; a+=2){
                    let P = {
                        x: adjusted.scale * width * (points[a] - anchor.x), 
                        y: adjusted.scale * height * (points[a+1] - anchor.y), 
                    };

                    self.extremities.points.push({ 
                        x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                        y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
        
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;
        this.__ext = function(){return JSON.stringify(this.extremities);};

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            dev.log('shapeLibrary','.rectangle.render(-context-,'+JSON.stringify(offset)+')');
            //combine offset with shape's position, angle and scale to produce adjust value for render
                let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                let adjust = { 
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
this.rectangle.proxyableMethods = [
    {function:'ignored',arguments:['a']},
    {function:'colour',arguments:['a']},
    {function:'x',arguments:['a']},
    {function:'y',arguments:['a']},
    {function:'angle',arguments:['a']},
    {function:'anchor',arguments:['a']},
    {function:'width',arguments:['a']},
    {function:'height',arguments:['a']},
    {function:'scale',arguments:['a']},
    {function:'unifiedAttribute',arguments:['attributes']},
];