this.polygonWithOutline = function(_id,_name){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'polygonWithOutline'; 
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
            this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };

        //attributes pertinent to extremity calculation
            let points = [];
            let pointsChanged = true;
            let scale = 1;   
            let thickness = 0;       
            let jointDetail = 25;   
            let jointType = 'sharp';
            let sharpLimit = 4;     
            let static = false;
            this.points = function(a){
                if(points==undefined){return points;}     
                points = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].points(',points); //#development
                if(allowComputeExtremities){computeExtremities();}
                pointsChanged = true;
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
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].scale(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.thickness = function(a){
                if(thickness==undefined){return thickness;}     
                thickness = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].thickness('+thickness+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
                pointsChanged = true;
            };
            this.jointDetail = function(a){
                if(jointDetail==undefined){return jointDetail;}     
                jointDetail = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].jointDetail('+jointDetail+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
                pointsChanged = true;
            };
            this.jointType = function(a){
                if(jointType==undefined){return jointType;}     
                jointType = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].jointType('+jointType+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
                pointsChanged = true;
            };
            this.sharpLimit = function(a){
                if(sharpLimit==undefined){return sharpLimit;}     
                sharpLimit = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].sharpLimit('+sharpLimit+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
                pointsChanged = true;
            };
            this.static = function(a){
                if(a==undefined){return static;}  
                static = a;  
                dev.log.elementLibrary[type]('['+self.getAddress()+'].static(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
            };

        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return { ignored:ignored, colour:colour, lineColour:lineColour, points:points, pointsChanged:pointsChanged, scale:scale, thickness:thickness, jointDetail:jointDetail, jointType:jointType, sharpLimit:sharpLimit, static:static }; } 
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
        function loopedLineGenerator(){ return library.math.pathExtrapolation(points,thickness/2,'none',jointType,true,jointDetail,sharpLimit); }
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
                uniform vec4 colour;
                uniform vec4 lineColour;
                uniform lowp float indexParting;
        
            //varyings
                out vec4 activeColour;

            void main(){    
                //adjust point by adjust
                    vec2 P = cartesianAngleAdjust(point*adjust.scale, adjust.angle) + adjust.xy;

                //select colour
                    activeColour = index < indexParting ? colour : lineColour;

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
        const point = { buffer:undefined, attributeLocation:undefined, triangles:[] };
        const index = { buffer:undefined, attributeLocation:undefined };
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
                        point.triangles = library.math.polygonToSubTriangles(points,'flatArray');
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(drawingPoints = point.triangles.concat(loopedLineGenerator())), context.STATIC_DRAW);
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> points:',points); //#development
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> drawingPoints:',drawingPoints); //#development
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
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:point.triangles.length/2 + loopedLineGenerator().length/2}).map(Number.call, Number)), context.STATIC_DRAW);
                        pointsChanged = false;
                    }else{
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating index.buffer...'); //#development
                        context.bindBuffer(context.ARRAY_BUFFER, index.buffer);
                        context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
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
                        "indexParting": context.getUniformLocation(program, "indexParting"),
                        "lineColour": context.getUniformLocation(program, "lineColour"),
                    };
                }

                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> canvas.width:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> colour:',colour); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> lineColour:',lineColour); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> indexParting:'+point.triangles.length/2); //#development
                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform4f(uniformLocations["colour"], colour.r*colour.a, colour.g*colour.a, colour.b*colour.a, colour.a);
                context.uniform4f(uniformLocations["lineColour"], lineColour.r*lineColour.a, lineColour.g*lineColour.a, lineColour.b*lineColour.a, lineColour.a);
                context.uniform1f(uniformLocations["indexParting"], point.triangles.length/2);
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
                if(offset == undefined){ offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }                
            //calculate points based on the offset
                self.extremities.points = [];
                for(let a = 0; a < points.length; a+=2){
                    const P = library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                    self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
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
            report.info(self.getAddress(),'._dump -> thickness: '+thickness);
            report.info(self.getAddress(),'._dump -> jointDetail: '+jointDetail);
            report.info(self.getAddress(),'._dump -> jointType: '+jointType);
            report.info(self.getAddress(),'._dump -> sharpLimit: '+sharpLimit);
            report.info(self.getAddress(),'._dump -> static: '+static);
        };

    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.colour = self.colour;
            this.lineColour = self.lineColour;
            this.points = self.points;
            this.pointsAsXYArray = self.pointsAsXYArray;
            this.scale = self.scale;
            this.thickness = self.thickness;
            this.jointDetail = self.jointDetail;
            this.jointType = self.jointType;
            this.sharpLimit = self.sharpLimit;
            this.static = self.static;
            this.unifiedAttribute = self.unifiedAttribute;
            this.getAddress = self.getAddress;
            this._dump = self._dump;
        };
};