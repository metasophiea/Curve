// this.pathWithRoundJointsAndEnds = function(){
//     console.warn('core::shapes::pathWithRoundJointsAndEnds - please use the "path" shape with the appropiate arguments sent');

//     var self = this;

//     //attributes 
//         //protected attributes
//             const type = 'pathWithRoundJointsAndEnds'; this.getType = function(){return type;}

//         //simple attributes
//             this.name = '';
//             this.parent = undefined;
//             this.dotFrame = false;
//             this.extremities = { points:[], boundingBox:{} };
//             this.ignored = false;
//             this.colour = {r:0,g:0,b:0,a:1};
//         //advanced use attributes
//             this.devMode = false;
//             this.stopAttributeStartedExtremityUpdate = false;

//         //attributes pertinent to extremity calculation
//             var pointsChanged = true; var generatedPathPolygon = [];
//             var points = [];   this.points =    function(a){ if(a==undefined){return points;} points = a; generatedPathPolygon = lineGenerator(); pointsChanged = true; if(this.devMode){console.log(this.getAddress()+'::points');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
//             var thickness = 1; this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a/2; generatedPathPolygon = lineGenerator(); pointsChanged = true; if(this.devMode){console.log(this.getAddress()+'::thickness');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
//             var scale = 1;     this.scale =     function(a){ if(a==undefined){return scale;} scale = a; computeExtremities(); };
//             var detail = 25;   this.detail =    function(a){ if(a==undefined){return detail;} detail = a/2; generatedPathPolygon = lineGenerator(); pointsChanged = true; if(this.devMode){console.log(this.getAddress()+'::detail');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };

//             function lineGenerator(){ return _canvas_.library.math.pathExtrapolation(points,thickness,'round','round',false,detail); }
//             this.pointsAsXYArray = function(a){
//                 if(this.devMode){console.log(this.getAddress()+'::pointsAsXYArray');}

//                 if(a==undefined){
//                     var output = [];
//                     for(var a = 0; a < points.length; a+=2){ output.push({ x:points[a], y:points[a+1] }); }
//                     return output;
//                 }

//                 this.points( a.map( a => [a.x,a.y] ).flat() );
//             };
            
//     //addressing
//         this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

//     //webGL rendering functions
//         var vertexShaderSource = 
//             _canvas_.library.gsls.geometry + `
//                 //variables
//                     struct location{
//                         vec2 xy;
//                         float scale;
//                         float angle;
//                     };
//                     uniform location offset;

//                     attribute vec2 point;
//                     uniform vec2 resolution;

//                 void main(){    
//                     //adjust point by offset
//                         vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;

//                     //convert from unit space to clipspace
//                         gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
//                 }
//             `;
//         var fragmentShaderSource = `  
//             precision mediump float;
//             uniform vec4 colour;
                                                                        
//             void main(){
//                 gl_FragColor = colour;
//             }
//         `;
//         var point = { buffer:undefined, attributeLocation:undefined };
//         var uniformLocations;
//         function updateGLAttributes(context,offset){
//             //buffers
//                 //points
//                     if(point.buffer == undefined || pointsChanged){
//                         point.attributeLocation = context.getAttribLocation(program, "point");
//                         point.buffer = context.createBuffer();
//                         context.enableVertexAttribArray(point.attributeLocation);
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                         context.bufferData(context.ARRAY_BUFFER, new Float32Array(generatedPathPolygon), context.STATIC_DRAW);
//                     }else{
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                     }

//             //uniforms
//                 if( uniformLocations == undefined ){
//                     uniformLocations = {
//                         "offset.xy": context.getUniformLocation(program, "offset.xy"),
//                         "offset.scale": context.getUniformLocation(program, "offset.scale"),
//                         "offset.angle": context.getUniformLocation(program, "offset.angle"),
//                         "resolution": context.getUniformLocation(program, "resolution"),
//                         "colour": context.getUniformLocation(program, "colour"),
//                     };
//                 }

//                 context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
//                 context.uniform1f(uniformLocations["offset.scale"], offset.scale);
//                 context.uniform1f(uniformLocations["offset.angle"], offset.angle);
//                 context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
//                 context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
//         }
//         var program;
//         function activateGLRender(context,adjust){
//             if(program == undefined){ program = core.render.produceProgram('polygon', vertexShaderSource, fragmentShaderSource); }

//             context.useProgram(program);
//             updateGLAttributes(context,adjust);
//             context.drawArrays(context.TRIANGLES, 0, generatedPathPolygon.length/2);
//             // context.drawArrays(context.LINE_STRIP, 0, generatedPathPolygon.length/2);
//         }

//     //extremities
//         function computeExtremities(informParent=true,offset){
//             if(self.devMode){console.log(self.getAddress()+'::computeExtremities');}

//             //get offset from parent, if one isn't provided
//                 if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }                
//             //calculate points based on the offset
//                 self.extremities.points = [];
//                 for(var a = 0; a < generatedPathPolygon.length; a+=2){
//                     var P = _canvas_.library.math.cartesianAngleAdjust(generatedPathPolygon[a]*offset.scale,generatedPathPolygon[a+1]*offset.scale, offset.angle);
//                     self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
//                 }
//                 self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
//             //if told to do so, inform parent (if there is one) that extremities have changed
//                 if(informParent){ if(self.parent){self.parent.updateExtremities();} }
//         }
//         this.computeExtremities = computeExtremities;

//     //lead render
//         function drawDotFrame(){
//             //draw shape extremity points
//                 self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
//             //draw bounding box top left and bottom right points
//                 core.render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
//                 core.render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
//         }
//         this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
//             //activate shape render code
//                 activateGLRender(context,offset);

//             //if requested; draw dot frame
//                 if(self.dotFrame){drawDotFrame();}
//         };
// };