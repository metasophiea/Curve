this.polygon = function(_id,_name){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'polygon'; 
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
            
        //advanced use attributes
            let allowComputeExtremities = true;
    
        //addressing
            this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };

        //attributes pertinent to extremity calculation
            let points = [];
            let pointsChanged = true;
            let scale = 1;
            this.points = function(a){
                if(points==undefined){return points;}     
                points = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].points(',points); //#development
                if(allowComputeExtremities){computeExtremities();}
                pointsChanged = true;
                render.shouldRenderFrame = true;
            };
            this.pointsAsXYArray = function(a){
                function pointsToXYArray(){ 
                    let output = [];
                    for(let a = 0; a < points.length; a+=2){ output.push({x:points[a], y:points[a+1]}); }
                    return output;
                }

                if(a==undefined){ return pointsToXYArray(); }
                dev.log.elementLibrary[type]('['+self.getAddress()+'].pointsAsXYArray(',a); //#development

                this.points( a.map((point) => [point.x,point.y]).flat() );
                render.shouldRenderFrame = true;
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].scale(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                render.shouldRenderFrame = true;
            };

        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return { ignored:ignored, colour:colour, points:points, pointsChanged:pointsChanged, scale:scale }; } 
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
        const vertexShaderSource = 
            '#version 300 es' + library.glsl.geometry + `
            //variables
                struct location{
                    vec2 xy;
                    float scale;
                    float angle;
                };
                uniform location adjust;

                in vec2 point;
                uniform vec2 resolution;

            void main(){    
                //adjust point by adjust
                    vec2 P = cartesianAngleAdjust(point*adjust.scale, adjust.angle) + adjust.xy;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        const fragmentShaderSource = `#version 300 es
            precision mediump float;
            out vec4 outputColour;
            uniform vec4 colour;
                                                                        
            void main(){
                outputColour = colour;
            }
        `;
        const point = { buffer:undefined, attributeLocation:undefined };
        let drawingPoints = [];
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
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(drawingPoints = library.math.polygonToSubTriangles(points,'flatArray')), context.STATIC_DRAW);
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> points:',points); //#development
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> drawingPoints:',points); //#development
                        pointsChanged = false;
                    }else{
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating point.buffer...'); //#development
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }

            //uniforms
                if( uniformLocations == undefined ){
                    dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> defining uniformLocations...'); //#development
                    uniformLocations = {
                        "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                        "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                        "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                        "resolution": context.getUniformLocation(program, "resolution"),
                        "colour": context.getUniformLocation(program, "colour"),
                    };
                }

                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> canvas.width:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> colour:',colour); //#development
                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform4f(uniformLocations["colour"], colour.r*colour.a, colour.g*colour.a, colour.b*colour.a, colour.a);
        }
        let program;
        function activateGLRender(context,adjust){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::activateGLRender(',context,adjust); //#development
            if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }

            context.useProgram(program);
            updateGLAttributes(context,adjust);

            context.drawArrays(context.TRIANGLES, 0, drawingPoints.length/2);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities(',informParent,offset); //#development
            
            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //calculate points based on the offset
                self.extremities.points = [];
                for(let a = 0; a < points.length; a+=2){
                    const P = library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                    self.extremities.points.push({ x:P.x+offset.x, y:P.y+offset.y });
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
                render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
        }
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].render(',context,offset); //#development

            //activate shape render code
                activateGLRender(context,offset);

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
            report.info(self.getAddress(),'._dump -> points: '+JSON.stringify(points));
            report.info(self.getAddress(),'._dump -> pointsAsXYArray: '+JSON.stringify(self.pointsAsXYArray()));
            report.info(self.getAddress(),'._dump -> scale: '+scale);
        };
    
    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.colour = self.colour;
            this.points = self.points;
            this.pointsAsXYArray = self.pointsAsXYArray;
            this.scale = self.scale;
            this.unifiedAttribute = self.unifiedAttribute;
            this.getAddress = self.getAddress;
            this._dump = self._dump;
        };
};