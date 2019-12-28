// const rectangleWithRoundEnds = function(name,_id){
//     const self = this;

//     //attributes 
//         //protected attributes
//                 const type = 'rectangleWithRoundEnds'; 
//                 this.getType = function(){return type;}
//                 const id = _id; 
//                 this.getId = function(){return id;}

//         //simple attributes
//             this.name = name;
//             this.parent = undefined;
//             this.dotFrame = false;
//             this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
//             let ignored = false;
//             this.ignored = function(a){
//                 if(a==undefined){return ignored;}     
//                 ignored = a;
//                 dev.log.elementLibrary(type,self.getAddress(),'.ignored('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             let colour = {r:1,g:0,b:0,a:1};
//             this.colour = function(a){
//                 if(a==undefined){return colour;}     
//                 colour = a;
//                 dev.log.elementLibrary(type,self.getAddress(),'.colour('+JSON.stringify(a)+')'); //#development
//             };
                
//         //advanced use attributes
//             let allowComputeExtremities = true;

//         //addressing
//             this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };

//         //attributes pertinent to extremity calculation
//             let x = 0;
//             let y = 0; 
//             let angle = 0;
//             let anchor = {x:0,y:0};
//             let width = 10;
//             let height = 10;
//             let detail = 25;
//             let scale = 1;
//             let static = false;
//             this.x = function(a){ 
//                 if(a==undefined){return x;}     
//                 x = a;     
//                 dev.log.elementLibrary(type,self.getAddress(),'.x('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.y = function(a){ 
//                 if(a==undefined){return y;}     
//                 y = a;
//                 dev.log.elementLibrary(type,self.getAddress(),'.y('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.angle = function(a){ 
//                 if(a==undefined){return angle;} 
//                 angle = a;
//                 dev.log.elementLibrary(type,self.getAddress(),'.angle('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.anchor = function(a){
//                 if(a==undefined){return anchor;} 
//                 anchor = a; 
//                 dev.log.elementLibrary(type,self.getAddress(),'.anchor('+JSON.stringify(a)+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.width = function(a){
//                 if(a==undefined){return width;}  
//                 width = a;  
//                 dev.log.elementLibrary(type,self.getAddress(),'.width('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.height = function(a){
//                 if(a==undefined){return height;} 
//                 height = a; 
//                 dev.log.elementLibrary(type,self.getAddress(),'.height('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.detail = function(a){ 
//                 if(a==undefined){return detail;}
//                 detail = a;
//                 dev.log.elementLibrary(type,self.getAddress(),'.detail('+a+')'); //#development
//                 calculateCirclePoints();
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.scale = function(a){ 
//                 if(a==undefined){return scale;} 
//                 scale = a;
//                 dev.log.elementLibrary(type,self.getAddress(),'.scale('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };
//             this.static = function(a){
//                 if(a==undefined){return static;}  
//                 static = a;  
//                 dev.log.elementLibrary(type,self.getAddress(),'.static('+a+')'); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//             };

//         //unifiedAttribute
//             this.unifiedAttribute = function(attributes){
//                 if(attributes==undefined){ return { ignored:ignored, colour:colour, x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, static:static }; } 
//                 dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development

//                 allowComputeExtremities = false;
//                 Object.keys(attributes).forEach(key => {
//                     dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "'+key+'" to '+attributes[key]); //#development
//                     self[key](attributes[key]);
//                 });
//                 allowComputeExtremities = true;

//                 computeExtremities();
//             };

//     //webGL rendering functions
//         let points = []; 
//         let pointsChanged = true;
//         function calculateCirclePoints(){
//             points = [];
//             points.push(-1,0);

//             //round top
//                 {
//                     const pointCount = detail+1;
//                     for(let a = 1; a < pointCount; a++){
//                         points.push(
//                             Math.sin( Math.PI * ((pointCount-a)/pointCount) + Math.PI/2 ),
//                             Math.cos( Math.PI * ((pointCount-a)/pointCount) + Math.PI/2 )
//                         );
//                     }
//                 }

//             points.push(1,0,1,0);

//             //round bottom
//                 {
//                     const pointCount = detail+1;
//                     for(let a = 1; a < pointCount; a++){
//                         points.push(
//                             Math.sin( Math.PI * ((pointCount-a)/pointCount) - Math.PI/2 ),
//                             Math.cos( Math.PI * ((pointCount-a)/pointCount) - Math.PI/2 )
//                         );
//                     }
//                 }

//             points.push(-1,0);
        
//             pointsChanged = true;
//         }
//         calculateCirclePoints();

//         const vertexShaderSource = 
//             '#version 300 es' + library.glsl.geometry + `
//             //index
//                 in lowp float index;

//             //constants
//                 in vec2 point;

//             //variables
//                 struct location{
//                     vec2 xy;
//                     float scale;
//                     float angle;
//                 };
//                 uniform location adjust;

//                 uniform vec2 resolution;
//                 uniform float width;
//                 uniform float height;
//                 uniform vec2 anchor;
//                 uniform lowp float detail;

//             void main(){
//                 float push = detail+1.0 < index ? height : 0.0;
                
//                 //adjust points by width and xy offset
//                     vec2 P = cartesianAngleAdjust(point*(width/2.0)*adjust.scale + vec2(0,push*adjust.scale), -adjust.angle) + adjust.xy;

//                 //convert from unit space to clipspace
//                     gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
//             }
//         `;
//         const fragmentShaderSource = `#version 300 es
//             precision mediump float;
//             out vec4 outputColour;
//             uniform vec4 colour;
                                                                        
//             void main(){
//                 outputColour = colour;
//             }
//         `;
//         const index = { buffer:undefined, attributeLocation:undefined };
//         const point = { buffer:undefined, attributeLocation:undefined };
//         let uniformLocations;
//         function updateGLAttributes(context,adjust){       
//             dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes(-context-,'+JSON.stringify(adjust)+')'); //#development
    
//             //buffers
//                 //points
//                     if(point.buffer == undefined || pointsChanged){
//                         dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> creating point.buffer...'); //#development
//                         point.attributeLocation = context.getAttribLocation(program, "point");
//                         point.buffer = context.createBuffer();
//                         context.enableVertexAttribArray(point.attributeLocation);
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                         context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
//                         pointsChanged = false;
//                     }else{
//                         dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> updating point.buffer...'); //#development
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                     }

//                 //index
//                     if(index.buffer == undefined){
//                         dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> creating index.buffer...'); //#development
//                         index.attributeLocation = context.getAttribLocation(program, "index");
//                         index.buffer = context.createBuffer();
//                         context.enableVertexAttribArray(index.attributeLocation);
//                         context.bindBuffer(context.ARRAY_BUFFER, index.buffer); 
//                         context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
//                         context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:points.length/2}).map(Number.call, Number)), context.STATIC_DRAW);
//                     }else{
//                         dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> updating index.buffer...'); //#development
//                         context.bindBuffer(context.ARRAY_BUFFER, index.buffer);
//                         context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
//                     }

//             //uniforms
//                 if( uniformLocations == undefined ){
//                     dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> defining uniformLocations...'); //#development
//                     uniformLocations = {
//                         "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
//                         "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
//                         "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
//                         "resolution": context.getUniformLocation(program, "resolution"),
//                         "width": context.getUniformLocation(program, "width"),
//                         "height": context.getUniformLocation(program, "height"),
//                         "colour": context.getUniformLocation(program, "colour"),
//                         "detail": context.getUniformLocation(program, "detail"),
//                     };
//                 }

//                 dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
//                 dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
//                 dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
//                 dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> resolution:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
//                 dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> width:'+width+' height:'+height); //#development
//                 dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> colour:'+JSON.stringify(colour)); //#development
//                 dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> detail:'+detail); //#development
//                 context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
//                 context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
//                 context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
//                 context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
//                 context.uniform1f(uniformLocations["width"], width);
//                 context.uniform1f(uniformLocations["height"], height);
//                 context.uniform4f(uniformLocations["colour"], colour.r, colour.g, colour.b, colour.a);
//                 context.uniform1f(uniformLocations["detail"], detail);
//         }
//         let program;
//         function activateGLRender(context,adjust){
//             dev.log.elementLibrary(type,self.getAddress(),'::activateGLRender(-context-,'+JSON.stringify(adjust)+')'); //#development
//             if(program == undefined){ program = render.produceProgram('rectangleWithRoundEnds', vertexShaderSource, fragmentShaderSource); }

//             context.useProgram(program);
//             updateGLAttributes(context,adjust);
//             context.drawArrays(context.TRIANGLE_FAN, 0, points.length/2);
//         }

//     //extremities
//         function computeExtremities(informParent=true,offset){
//             dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities('+informParent+','+JSON.stringify(offset)+')'); //#development
            
//             //get offset from parent, if one isn't provided
//                 if(offset == undefined){ offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
//             //calculate adjusted offset based on the offset
//                 const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
//                 let adjusted = { 
//                     x: point.x*offset.scale + offset.x,
//                     y: point.y*offset.scale + offset.y,
//                     scale: offset.scale*scale,
//                     angle: -(offset.angle + angle),
//                 };
//             //calculate points based on the adjusted offset
//                 self.extremities.points = [];
//                 for(let a = 0; a < points.length; a+=2){
//                     const push = detail+1.0 < a/2 ? height : 0;
//                     const P = library.math.cartesianAngleAdjust(
//                         points[a]*(width/2)*adjusted.scale,
//                         points[a+1]*(width/2)*adjusted.scale + push, 
//                         -adjusted.angle
//                     );
//                     self.extremities.points.push({ x:P.x+adjusted.x, y:P.y+adjusted.y });
//                 }
//                 self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
//             //if told to do so, inform parent (if there is one) that extremities have changed
//                 if(informParent){ if(self.parent){self.parent.updateExtremities();} }
//         }
//         this.computeExtremities = computeExtremities;

//     //lead render
//         function drawDotFrame(){
//             //draw shape extremity points
//                 self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
//             //draw bounding box top left and bottom right points
//                 render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,2,{r:0,g:0,b:1,a:1});
//                 render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,2,{r:0,g:0,b:1,a:1});
//         };
//         this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){     
//             dev.log.elementLibrary(type,self.getAddress(),'.render(-context-,'+JSON.stringify(offset)+')'); //#development     

//             //combine offset with shape's position, angle and scale to produce adjust value for render
//                 const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
//                 const adjust = { 
//                     x: point.x*offset.scale + offset.x,
//                     y: point.y*offset.scale + offset.y,
//                     scale: offset.scale*scale,
//                     angle: -(offset.angle + angle),
//                 };

//             //activate shape render code
//                 activateGLRender(context,adjust);

//             //if requested; draw dot frame
//                 if(self.dotFrame){drawDotFrame();}
//         };

//     //info dump
//         this._dump = function(){
//             report.info(self.getAddress(),'._dump()');
//             report.info(self.getAddress(),'._dump -> id: '+id);
//             report.info(self.getAddress(),'._dump -> type: '+type);
//             report.info(self.getAddress(),'._dump -> name: '+self.name);
//             report.info(self.getAddress(),'._dump -> address: '+self.getAddress());
//             report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
//             report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
//             report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
//             report.info(self.getAddress(),'._dump -> ignored: '+ignored);
//             report.info(self.getAddress(),'._dump -> colour: '+JSON.stringify(colour));
//             report.info(self.getAddress(),'._dump -> x: '+x);
//             report.info(self.getAddress(),'._dump -> y: '+y);
//             report.info(self.getAddress(),'._dump -> width: '+width);
//             report.info(self.getAddress(),'._dump -> height: '+height);
//             report.info(self.getAddress(),'._dump -> detail: '+detail);
//             report.info(self.getAddress(),'._dump -> scale: '+scale);
//             report.info(self.getAddress(),'._dump -> static: '+static);
//         };
    
//     //interface
//         this.interface = new function(){
//             this.ignored = self.ignored;
//             this.colour = self.colour;
//             this.x = self.x;
//             this.y = self.y;
//             this.width = self.width;
//             this.height = self.height;
//             this.detail = self.detail;
//             this.scale = self.scale;
//             this.static = self.static;
//             this.unifiedAttribute = self.unifiedAttribute;
//             this.getAddress = self.getAddress;
//             this._dump = self._dump;
//         };
// };
// const rectangleWithRoundEnds_proxy = function(_id,_name,communicationModule,dev){
//     dev.log.elementLibrary(' - new rectangleWithRoundEnds_proxy('+_id+')'); //#development
//     const id = _id;
//     this.getId = function(){return id;};
//     const name = _name;
//     this.getName = function(){return name;};
//     this.getType = function(){return 'rectangleWithRoundEnds_proxy';};

//     this.ignored = function(bool){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.ignored('+bool+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'ignored',[bool]],resolve);
//         });
//     };
//     this.colour = function(colour){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.colour('+colour+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'colour',[colour]],resolve);
//         });
//     };
//     this.x = function(number){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.x('+number+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'x',[number]],resolve);
//         });
//     };
//     this.y = function(number){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.y('+number+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'y',[number]],resolve);
//         });
//     };
//     this.width = function(number){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.width('+number+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'width',[number]],resolve);
//         });
//     };
//     this.height = function(number){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.height('+number+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'height',[number]],resolve);
//         });
//     };
//     this.detail = function(number){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.detail('+number+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'detail',[number]],resolve);
//         });
//     };
//     this.scale = function(number){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.scale('+number+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'scale',[number]],resolve);
//         });
//     };
//     this.static = function(bool){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.static('+bool+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'static',[bool]],resolve);
//         });
//     };
//     this.unifiedAttribute = function(attributes){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[attributes]],resolve);
//         });
//     };
//     this.getAddress = function(){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy.getAddress()'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'getAddress',[]],resolve);
//         });
//     };
//     this._dump = function(){
//         dev.log.elementLibrary(' - rectangleWithRoundEnds_proxy._dump()'); //#development
//         return new Promise((resolve, reject) => {
//             communicationModule.run('element.executeMethod',[id,'_dump',[number]]);
//         });
//     };
// };

// _canvas_.core.meta.go = function(){
//     _canvas_.core.element.installElement( 'rectangleWithRoundEnds', rectangleWithRoundEnds, rectangleWithRoundEnds_proxy );

//     setTimeout(() => {
//         // _canvas_.core.element.create('rectangle','test_rectangle_1').then(rectangle => {
//         //     rectangle.unifiedAttribute({
//         //         x:10, y:10, width:60, height:60, 
//         //         colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
//         //     });
//         //     _canvas_.core.arrangement.append(rectangle);
//         // });

//         _canvas_.core.element.create('rectangleWithRoundEnds','test_rectangleWithRoundEnds_1').then(rectangleWithRoundEnds => {
//             // rectangleWithRoundEnds.unifiedAttribute({
//             //     x:110, y:40, width:60, height:120, detail:4, angle:1,
//             //     colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
//             // });
//             _canvas_.core.arrangement.append(rectangleWithRoundEnds);
//         });
//         // _canvas_.core.element.create('rectangleWithRoundEnds','test_rectangleWithRoundEnds_2').then(rectangleWithRoundEnds => {
//         //     rectangleWithRoundEnds.unifiedAttribute({
//         //         x:180, y:40, width:60, height:120, detail:3, angle:1,
//         //         colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
//         //     });
//         //     _canvas_.core.arrangement.append(rectangleWithRoundEnds);
//         // });
//         // _canvas_.core.element.create('rectangleWithRoundEnds','test_rectangleWithRoundEnds_3').then(rectangleWithRoundEnds => {
//         //     rectangleWithRoundEnds.unifiedAttribute({
//         //         x:250, y:40, width:60, height:120, detail:10, angle:1,
//         //         colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
//         //     });
//         //     _canvas_.core.arrangement.append(rectangleWithRoundEnds);
//         // });
//     },500);


//     setTimeout(()=>{
//         _canvas_.core.render.frame();
//     },1500);
// };