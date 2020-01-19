this.circleWithOutline = function(_id,_name){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'circleWithOutline'; 
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
            };
            let colour = {r:1,g:0,b:0,a:1};
            this.colour = function(a){
                if(a==undefined){return colour;}     
                colour = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].colour(',a); //#development
            };
            let lineColour = {r:1,g:0,b:0,a:1};
            this.lineColour = function(a){
                if(a==undefined){return lineColour;}     
                lineColour = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].lineColour(',a); //#development
            };
        
        //advanced use attributes
            let allowComputeExtremities = true;

        //addressing
            this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

        //attributes pertinent to extremity calculation
            let x = 0;
            let y = 0; 
            let angle = 0;
            let radius = 10;
            let detail = 25;
            let scale = 1;
            let thickness = 0;
            let isStatic = false;
            this.x = function(a){ 
                if(a==undefined){return x;}     
                x = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].x(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.y = function(a){ 
                if(a==undefined){return y;}     
                y = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].y(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.radius = function(a){ 
                if(a==undefined){return radius;} 
                radius = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].radius(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.detail = function(a){ 
                if(a==undefined){return detail;}
                detail = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].detail(',a); //#development
                calculateCirclePoints();
                if(allowComputeExtremities){computeExtremities();}
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].scale(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.thickness = function(a){ 
                if(a==undefined){return thickness;} 
                thickness = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].thickness(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.static = function(a){
                if(a==undefined){return isStatic;}  
                isStatic = a;  
                dev.log.elementLibrary[type]('['+self.getAddress()+'].static(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };

        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return { ignored:ignored, colour:colour, lineColour:lineColour, x:x, y:y, angle:angle, radius:radius, detail:detail, scale:scale, thickness:thickness, static:isStatic}; } 
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
            };

    //webGL rendering functions
        let points = []; 
        let pointsChanged = true;
        function calculateCirclePoints(){
            points = [];
            //outline
                for(let a = 0; a < detail; a++){
                    points.push(0,0);
                    points.push( Math.sin( 2*Math.PI * (a/detail) ), Math.cos( 2*Math.PI * (a/detail) ) );
                    points.push( Math.sin( 2*Math.PI * ((a+1)/detail) ), Math.cos( 2*Math.PI * ((a+1)/detail) ) );
                }
            //main circle
                for(let a = 0; a < detail; a++){
                    points.push(0,0);
                    points.push( Math.sin( 2*Math.PI * (a/detail) ), Math.cos( 2*Math.PI * (a/detail) ) );
                    points.push( Math.sin( 2*Math.PI * ((a+1)/detail) ), Math.cos( 2*Math.PI * ((a+1)/detail) ) );
                }
            pointsChanged = true;
        }
        calculateCirclePoints();

        const vertexShaderSource = 
            '#version 300 es' + library.glsl.geometry + `
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
                uniform float radius;
                uniform float thickness;
                uniform vec4 colour;
                uniform vec4 lineColour;
                uniform lowp float indexParting;
        
            //varyings
                out vec4 activeColour;

            void main(){    
                //adjust points by radius and xy adjust
                    float tmpRadius = radius + (thickness/2.0) * (index < indexParting ? 1.0 : -1.0);
                    vec2 P = cartesianAngleAdjust(point*tmpRadius*adjust.scale, -adjust.angle) + adjust.xy;

                //select colour
                    activeColour = index >= indexParting ? colour : lineColour;

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
                    if(point.buffer == undefined || pointsChanged){
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> creating point.buffer...'); //#development
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                        pointsChanged = false;
                    }else{
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating point.buffer...'); //#development
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                }
                //index
                    if(index.buffer == undefined || pointsChanged){
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
                        "radius": context.getUniformLocation(program, "radius"),
                        "thickness": context.getUniformLocation(program, "thickness"),
                        "colour": context.getUniformLocation(program, "colour"),
                        "indexParting": context.getUniformLocation(program, "indexParting"),
                        "lineColour": context.getUniformLocation(program, "lineColour"),
                    };
                }

                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> canvas.width:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> radius:'+radius); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> thickness:'+thickness); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> colour:',colour); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> lineColour:',lineColour); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> indexParting:'+points.length/4); //#development
                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform1f(uniformLocations["radius"], radius);
                context.uniform1f(uniformLocations["thickness"], thickness);
                context.uniform4f(uniformLocations["colour"], colour.r*colour.a, colour.g*colour.a, colour.b*colour.a, colour.a);
                context.uniform4f(uniformLocations["lineColour"], lineColour.r*lineColour.a, lineColour.g*lineColour.a, lineColour.b*lineColour.a, lineColour.a);
                context.uniform1f(uniformLocations["indexParting"], points.length/4);
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
                if(offset == undefined){ offset = self.parent && !self.static() ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //calculate adjusted offset based on the offset
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                const adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };
            //calculate points based on the adjusted offset
                self.extremities.points = [];
                for(let a = 0; a < points.length; a+=2){
                    self.extremities.points.push({
                        x: (points[a]   * radius * adjusted.scale) + adjusted.x,
                        y: (points[a+1] * radius * adjusted.scale) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,2,{r:0,g:0,b:1,a:1});
                render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,2,{r:0,g:0,b:1,a:1});
        };
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
            report.info(self.getAddress(),'._dump -> radius: '+radius);
            report.info(self.getAddress(),'._dump -> detail: '+detail);
            report.info(self.getAddress(),'._dump -> scale: '+scale);
            report.info(self.getAddress(),'._dump -> thickness: '+thickness);
            report.info(self.getAddress(),'._dump -> static: '+self.static());
        };
    
    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.colour = self.colour;
            this.lineColour = self.lineColour;
            this.x = self.x;
            this.y = self.y;
            this.radius = self.radius;
            this.scale = self.scale;
            this.thickness = self.thickness;
            this.static = self.static;
            this.unifiedAttribute = self.unifiedAttribute;
            this.getAddress = self.getAddress;
            this._dump = self._dump;
        };
};