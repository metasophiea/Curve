this.rectangleWithOutline = function(_id,_name){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'rectangleWithOutline'; 
            this.getType = function(){return type;}
            const id = _id; 
            this.getId = function(){return id;}

        //simple attributes
            this.name = _name;
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
            let ignored = false;
            this.ignored = function(a){
                if(a==undefined){return ignored;}     
                ignored = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].ignored(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            let colour = {r:1,g:0,b:0,a:1};
            this.colour = function(a){
                if(a==undefined){return colour;}     
                colour = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].colour(',a); //#development
                render.shouldRenderFrame = true;
            };
            let lineColour = {r:1,g:0,b:0,a:1};
            this.lineColour = function(a){
                if(a==undefined){return lineColour;}     
                lineColour = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].lineColour(',a); //#development
                render.shouldRenderFrame = true;
            };
            
        //advanced use attributes
            let allowComputeExtremities = true;
            
        //addressing
            this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };

        //attributes pertinent to extremity calculation
            let x = 0;
            let y = 0; 
            let angle = 0;
            let anchor = {x:0,y:0};
            let width = 10;
            let height = 10;
            let scale = 1;
            let thickness = 0;

            this.x = function(a){ 
                if(a==undefined){return x;}     
                x = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].x(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            this.y = function(a){ 
                if(a==undefined){return y;}     
                y = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].y(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            this.angle = function(a){ 
                if(a==undefined){return angle;} 
                angle = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].angle(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            this.anchor = function(a){
                if(a==undefined){return anchor;} 
                anchor = a; 
                dev.log.elementLibrary[type]('['+self.getAddress()+'].anchor(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            this.width = function(a){
                if(a==undefined){return width;}  
                width = a;  
                dev.log.elementLibrary[type]('['+self.getAddress()+'].width(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            this.height = function(a){
                if(a==undefined){return height;} 
                height = a; 
                dev.log.elementLibrary[type]('['+self.getAddress()+'].height(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].scale(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };
            this.thickness = function(a){ 
                if(a==undefined){return thickness;} 
                thickness = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].thickness(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };

        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
            if(attributes==undefined){ return { ignored:ignored, colour:colour, lineColour:lineColour, x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, thickness:thickness }; } 
                dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute(',attributes); //#development

                allowComputeExtremities = false;
                Object.keys(attributes).forEach(key => {
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute -> updating "'+key+'" to '+JSON.stringify(attributes[key])); //#development
                    try{
                        self[key](attributes[key]);
                    }catch(err){
                        console.warn(type,id,self.getAddress(),'.unifiedAttribute -> unknown attribute "'+key+'" which was being set to "'+JSON.stringify(attributes[key])+'"');
                    }
                });
                allowComputeExtremities = true;

                computeExtremities();
                render.shouldRenderFrame = true;
            };

    //webGL rendering functions
        const points = [
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
        const vertexShaderSource = `#version 300 es
            //index
                in lowp float index;
                
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
                uniform float thickness;
                uniform vec2 anchor;

                uniform vec4 colour;
                uniform vec4 lineColour;
            
            //varyings
                out vec4 activeColour;

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
        const fragmentShaderSource = `#version 300 es
            precision mediump float;
            out vec4 outputColour;
            in vec4 activeColour;
                                                                        
            void main(){
                outputColour = activeColour;
            }
        `;
        const point = { buffer:undefined, attributeLocation:undefined };
        const index = { buffer:undefined, attributeLocation:undefined };
        let uniformLocations;
        function updateGLAttributes(context,adjust){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes(',context,adjust); //#development

            //buffers
                //points
                    if(point.buffer == undefined){
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> creating point.buffer...'); //#development
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                    }else{
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating point.buffer...'); //#development
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }
                //index
                    if(index.buffer == undefined){
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> creating index.buffer...'); //#development
                        index.attributeLocation = context.getAttribLocation(program, "index");
                        index.buffer = context.createBuffer();
                        context.enableVertexAttribArray(index.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, index.buffer); 
                        context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:points.length/2}).map(Number.call, Number)), context.STATIC_DRAW);
                    }else{
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating index.buffer...'); //#development
                        context.bindBuffer(context.ARRAY_BUFFER, index.buffer);
                        context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                    }
                
            //uniforms
                if(uniformLocations == undefined){
                    dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> defining uniformLocations...'); //#development
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

                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> canvas.width:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> width:'+width+' height:'+height); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> thickness:'+thickness); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> anchor:',anchor); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> colour:',colour); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> lineColour:',lineColour); //#development
                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform2f(uniformLocations["dimensions"], width, height);
                context.uniform1f(uniformLocations["thickness"], thickness);
                context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                context.uniform4f(uniformLocations["colour"], colour.r*colour.a, colour.g*colour.a, colour.b*colour.a, colour.a);
                context.uniform4f(uniformLocations["lineColour"], lineColour.r*lineColour.a, lineColour.g*lineColour.a, lineColour.b*lineColour.a, lineColour.a);
        }
        let program;
        function activateGLRender(context,adjust){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::activateGLRender(',context,adjust); //#development
            if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLES, 0, points.length/2);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities(',informParent,offset); //#development
                        
            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //calculate adjusted offset based on the offset
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> point',point); //#development
                const adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };
                dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> adjusted',adjusted); //#development
            //calculate points based on the adjusted offset
                self.extremities.points = [];
                for(let a = 0; a < points.length; a+=2){
                    const P = {
                        x: adjusted.scale * width * (points[a] - anchor.x), 
                        y: adjusted.scale * height * (points[a+1] - anchor.y), 
                    };

                    self.extremities.points.push({ 
                        x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                        y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> self.extremities.points:',self.extremities.points); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> self.extremities.boundingBox:',self.extremities.boundingBox); //#development
        
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
        }
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].render(',context,offset); //#development
            //combine offset with shape's position, angle and scale to produce adjust value for render
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                const adjust = { 
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

    //info dump
        this._dump = function(){
            report.info(self.getAddress(),'._dump()');
            report.info(self.getAddress(),'._dump -> id: '+id);
            report.info(self.getAddress(),'._dump -> type: '+type);
            report.info(self.getAddress(),'._dump -> name: '+self.name);
            report.info(self.getAddress(),'._dump -> address: '+self.getAddress());
            report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
            report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
            report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
            report.info(self.getAddress(),'._dump -> ignored: '+ignored);
            report.info(self.getAddress(),'._dump -> colour: '+JSON.stringify(colour));
            report.info(self.getAddress(),'._dump -> lineColour: '+JSON.stringify(lineColour));
            report.info(self.getAddress(),'._dump -> x: '+x);
            report.info(self.getAddress(),'._dump -> y: '+y);
            report.info(self.getAddress(),'._dump -> angle: '+angle);
            report.info(self.getAddress(),'._dump -> anchor: '+JSON.stringify(anchor));
            report.info(self.getAddress(),'._dump -> width: '+width);
            report.info(self.getAddress(),'._dump -> height: '+height);
            report.info(self.getAddress(),'._dump -> scale: '+scale);
            report.info(self.getAddress(),'._dump -> thickness: '+thickness);
        };
    
    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.colour = self.colour;
            this.lineColour = self.lineColour;
            this.x = self.x;
            this.y = self.y;
            this.angle = self.angle;
            this.anchor = self.anchor;
            this.width = self.width;
            this.height = self.height;
            this.scale = self.scale;
            this.thickness = self.thickness;
            this.unifiedAttribute = self.unifiedAttribute;
            this.getAddress = self.getAddress;
            this._dump = self._dump;
        };
};