/////original
// this.image = function(_id,_name){
//     const self = this;

//     //attributes 
//         //protected attributes
//             const type = 'image'; 
//             this.getType = function(){return type;}
//             const id = _id; 
//             this.getId = function(){return id;}

//         //simple attributes
//             this.name = _name;
//             this.parent = undefined;
//             this.dotFrame = false;
//             this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
//             let ignored = false;
//             this.ignored = function(a){
//                 if(a==undefined){return ignored;}     
//                 ignored = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].ignored(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
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
//             let scale = 1;
//             this.x = function(a){ 
//                 if(a==undefined){return x;}     
//                 x = a;     
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].x(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.y = function(a){ 
//                 if(a==undefined){return y;}     
//                 y = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].y(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.angle = function(a){ 
//                 if(a==undefined){return angle;} 
//                 angle = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].angle(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.anchor = function(a){
//                 if(a==undefined){return anchor;} 
//                 anchor = a; 
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].anchor(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.width = function(a){
//                 if(a==undefined){return width;}  
//                 width = a;  
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].width(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.height = function(a){
//                 if(a==undefined){return height;} 
//                 height = a; 
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].height(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.scale = function(a){ 
//                 if(a==undefined){return scale;} 
//                 scale = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].scale(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };

//         //image data
//             const image = { 
//                 bitmap:undefined, 
//                 textureData:undefined, 
//                 url:'', 
//                 isLoaded:false, 
//                 isChanged:false, 
//                 defaultURL:'/images/noimageimage.png'
//             };
//             function loadImage(url,forceUpdate=false){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::loadImage(',url,forceUpdate); //#development
                
//                 if(url == ''){
//                     image.url = image.defaultURL;
//                     url = image.defaultURL;
//                 }

//                 image.isLoaded = false;

//                 library.misc.loadImageFromURL(
//                     url, 
//                     bitmap => {
//                         if(url != image.url){
//                             dev.log.elementLibrary[type]('['+self.getAddress()+']::loadImage -> URL has changed since this request started; re-requesting...'); //#development
//                             loadImage(image.url);
//                             return;
//                         }

//                         image.bitmap = bitmap;
//                         image.isLoaded = true;
//                         image.isChanged = true;
//                         activateShouldRenderFrame();
//                     },
//                     (errorType, response, error) => {
//                         if(errorType == 'badURL'){
//                             console.warn(type,id,self.getAddress(),'could not find image at: '+url);
//                             console.warn(response);
//                             loadImage(image.defaultURL);
//                         }else if(errorType == 'imageDecodingError'){
//                             console.error('Image decoding error :: url:',url);
//                             console.error('-- -- -- -- -- -- -- :: response:',response);
//                             console.error(error);
//                             loadImage(image.defaultURL);
//                         }else if(errorType == 'previousFailure'){
//                             console.warn('previous failure to load "'+url+'" - load not attempted this time');
//                         }else{
//                             console.error('Unknown error :: errorType:',errorType);
//                             loadImage(image.defaultURL);
//                         }
//                     },
//                     forceUpdate
//                 );
//             }
//             setTimeout(()=>{ if(image.url == ''){ loadImage(image.defaultURL); } },1000);

//             this.url = function(a,forceUpdate=false){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].url(',a,forceUpdate); //#development

//                 if(a==undefined){return image.url;}
//                 if(a==image.url){return;} //no need to reload the same image
//                 image.url = a;

//                 if(image.url == ''){ image.url = image.defaultURL; }

//                 loadImage(image.url,forceUpdate);
//             };
//             this.bitmap = function(a){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].bitmap(',a); //#development

//                 if(a==undefined){return image.bitmap;}
//                 image.bitmap = a;
//                 image.url = 'internal bitmap';

//                 image.isChanged = true;
//                 image.isLoaded = true;
//                 activateShouldRenderFrame();
//             };

//         //unifiedAttribute
//             this.unifiedAttribute = function(attributes){
//                 if(attributes==undefined){ return { ignored:ignored, colour:colour, x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, url:image.url }; } 
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute(',attributes); //#development

//                 allowComputeExtremities = false;
//                 Object.keys(attributes).forEach(key => {
//                     dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute -> updating "'+key+'" to '+JSON.stringify(attributes[key])); //#development
//                     try{
//                         self[key](attributes[key]);
//                     }catch(err){
//                         console.warn(type,id,self.getAddress(),'.unifiedAttribute -> unknown attribute "'+key+'" which was being set to "'+JSON.stringify(attributes[key])+'"');
//                     }
//                 });
//                 allowComputeExtremities = true;

//                 computeExtremities();
//             };

//     //webGL rendering functions
//         const points = [
//             0,0,
//             1,0,
//             1,1,
//             0,1,
//         ];
//         const vertexShaderSource = `#version 300 es
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
//                 uniform vec2 dimensions;
//                 uniform vec2 anchor;

//             //vertex/fragment shader transfer variables
//                 out vec2 textureCoordinates;

//             void main(){
//                 //transfer point to fragment shader
//                     textureCoordinates = point;

//                 //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
//                     vec2 P = dimensions * adjust.scale * (point - anchor);
//                     P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;

//                 //convert from unit space to clipspace
//                     gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
//             }
//         `;
//         const fragmentShaderSource = `#version 300 es
//             precision mediump float;
//             out vec4 outputColour;

//             uniform sampler2D textureImage;
//             in vec2 textureCoordinates;
                                                                        
//             void main(){
//                 outputColour = texture(textureImage, textureCoordinates);
//             }
//         `;
//         const point = { buffer:undefined, attributeLocation:undefined };
//         let uniformLocations;
//         function updateGLAttributes(context,adjust){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes(',context,adjust); //#development

//             //buffers
//                 //points
//                     if(point.buffer == undefined){
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> creating point.buffer...'); //#development
//                         point.attributeLocation = context.getAttribLocation(program, "point");
//                         point.buffer = context.createBuffer();
//                         context.enableVertexAttribArray(point.attributeLocation);
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                         context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
//                     }else{
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating point.buffer...'); //#development
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                     }

//                 //texture
//                     if(image.isChanged){
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> creating image.textureData...'); //#development
//                         image.isChanged = false;
//                         image.textureData = context.createTexture();
//                         context.bindTexture(context.TEXTURE_2D, image.textureData);
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
//                         context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image.bitmap);
//                     }else{
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating image.textureData...'); //#development
//                         context.bindTexture(context.TEXTURE_2D, image.textureData);
//                     }

//             //uniforms
//                 if( uniformLocations == undefined ){
//                     dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> defining uniformLocations...'); //#development
//                     uniformLocations = {
//                         "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
//                         "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
//                         "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
//                         "resolution": context.getUniformLocation(program, "resolution"),
//                         "dimensions": context.getUniformLocation(program, "dimensions"),
//                         "anchor": context.getUniformLocation(program, "anchor"),
//                     };
//                 }

//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> canvas.width:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> width:'+width+' height:'+height); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> anchor.x:'+anchor.x+' anchor.y:'+anchor.y); //#development
//                 context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
//                 context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
//                 context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
//                 context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
//                 context.uniform2f(uniformLocations["dimensions"], width, height);
//                 context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
//         }
//         let program;
//         function activateGLRender(context,adjust){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::activateGLRender(',context,adjust); //#development
//             if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
            
//             if(!image.isLoaded){return;} //do not render, if the image has not yet been loaded

//             context.useProgram(program);
//             updateGLAttributes(context,adjust);
//             context.drawArrays(context.TRIANGLE_FAN, 0, 4);
//         }
        
//     //extremities
//         function computeExtremities(informParent=true,offset){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities(',informParent,offset); //#development
            
//             //get offset from parent, if one isn't provided
//                 if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
//             //calculate adjusted offset based on the offset
//                 const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> point',point); //#development
//                 const adjusted = { 
//                     x: point.x*offset.scale + offset.x,
//                     y: point.y*offset.scale + offset.y,
//                     scale: offset.scale*scale,
//                     angle: -(offset.angle + angle),
//                 };
//             //calculate points based on the adjusted offset
//                 self.extremities.points = [];
//                 for(let a = 0; a < points.length; a+=2){
//                     const P = {
//                         x: adjusted.scale * width * (points[a] - anchor.x), 
//                         y: adjusted.scale * height * (points[a+1] - anchor.y), 
//                     };

//                     self.extremities.points.push({ 
//                         x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
//                         y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
//                     });
//                 }
//                 self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> self.extremities.points:',self.extremities.points); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> self.extremities.boundingBox:',self.extremities.boundingBox); //#development
        
//             //if told to do so, inform parent (if there is one) that extremities have changed
//                 if(informParent){ if(self.parent){self.parent.updateExtremities();} }
//         }
//         this.computeExtremities = computeExtremities;
        
//     //render
//         function drawDotFrame(){
//             //draw shape extremity points
//                 self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
//             //draw bounding box top left and bottom right points
//                 render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
//                 render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
//         };
//         function activateShouldRenderFrame(){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::activateShouldRenderFrame()'); //#development
//             if(render.shouldRenderFrame){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::activateShouldRenderFrame -> render.shouldRenderFrame is already true'); //#development
//                 return;
//             }
//             render.shouldRenderFrame = shouldThisElementRender();
//         }
//         function shouldThisElementRender(){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::shouldThisElementRender()'); //#development
//             if( self.parent == undefined || self.parent.clipActive == undefined ){
//                 return library.math.detectIntersect.boundingBoxes( viewport.getBoundingBox(), self.extremities.boundingBox );
//             }
//             return library.math.detectIntersect.boundingBoxes(
//                 self.parent.clipActive() ? self.parent.extremities.boundingBox : viewport.getBoundingBox(),
//                 self.extremities.boundingBox
//             );
//         }
//         this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
//             dev.log.elementLibrary[type]('['+self.getAddress()+'].render(',context,offset); //#development

//             //judge whether element should be rendered
//                 if( !shouldThisElementRender() ){
//                     dev.log.elementLibrary[type]('['+self.getAddress()+'].render -> not rendering'); //#development
//                     return;
//                 }
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].render -> rendering'); //#development

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
//             report.info(self.getAddress(),'._dump -> image: '+JSON.stringify(image));
//             report.info(self.getAddress(),'._dump -> x: '+x);
//             report.info(self.getAddress(),'._dump -> y: '+y);
//             report.info(self.getAddress(),'._dump -> angle: '+angle);
//             report.info(self.getAddress(),'._dump -> anchor: '+JSON.stringify(anchor));
//             report.info(self.getAddress(),'._dump -> width: '+width);
//             report.info(self.getAddress(),'._dump -> height: '+height);
//             report.info(self.getAddress(),'._dump -> scale: '+scale);
//             report.info(self.getAddress(),'._dump -> image: '+JSON.stringify(image));
//         };
    
//     //interface
//         this.interface = new function(){
//             this.ignored = self.ignored;
//             this.x = self.x;
//             this.y = self.y;
//             this.angle = self.angle;
//             this.anchor = self.anchor;
//             this.width = self.width;
//             this.height = self.height;
//             this.scale = self.scale;
//             this.url = self.url;
//             this.bitmap = self.bitmap;
//             this.unifiedAttribute = self.unifiedAttribute;
//             this.getAddress = self.getAddress;
//             this._dump = self._dump;
//         };
// };












































/////failed draft
// this.image = function(_id,_name){
//     const self = this;

//     //attributes 
//         //protected attributes
//             const type = 'image'; 
//             this.getType = function(){return type;}
//             const id = _id; 
//             this.getId = function(){return id;}

//         //simple attributes
//             this.name = _name;
//             this.parent = undefined;
//             this.dotFrame = false;
//             this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
//             let ignored = false;
//             this.ignored = function(a){
//                 if(a==undefined){return ignored;}     
//                 ignored = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].ignored(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
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
//             let scale = 1;
//             this.x = function(a){ 
//                 if(a==undefined){return x;}     
//                 x = a;     
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].x(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.y = function(a){ 
//                 if(a==undefined){return y;}     
//                 y = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].y(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.angle = function(a){ 
//                 if(a==undefined){return angle;} 
//                 angle = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].angle(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.anchor = function(a){
//                 if(a==undefined){return anchor;} 
//                 anchor = a; 
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].anchor(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.width = function(a){
//                 if(a==undefined){return width;}  
//                 width = a;  
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].width(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.height = function(a){
//                 if(a==undefined){return height;} 
//                 height = a; 
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].height(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };
//             this.scale = function(a){ 
//                 if(a==undefined){return scale;} 
//                 scale = a;
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].scale(',a); //#development
//                 if(allowComputeExtremities){computeExtremities();}
//                 activateShouldRenderFrame();
//             };

//         //image data
//             const image = { 
//                 bitmap:undefined, 
//                 url:'', 
//                 defaultURL:'/images/noimageimage.png'
//             };
//             function loadImage(url,forceUpdate=false){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::loadImage(',url,forceUpdate); //#development
                
//                 if(url == ''){
//                     image.url = image.defaultURL;
//                     url = image.defaultURL;
//                 }
//                 if( elementLibrary.image.webglDataStore[image.url] != undefined ){
//                     activateShouldRenderFrame();
//                     return;
//                 }

//                 elementLibrary.image.webglDataStore[image.url] = {isLoaded:false};
//                 console.log('loading:',image.url);

//                 library.misc.loadImageFromURL(
//                     url, 
//                     bitmap => {
//                         console.log('loaded:',image.url);
//                         if(url != image.url){
//                             dev.log.elementLibrary[type]('['+self.getAddress()+']::loadImage -> URL has changed since this request started; re-requesting...'); //#development
//                             loadImage(image.url);
//                             return;
//                         }

//                         elementLibrary.image.webglDataStore[image.url].isLoaded = true;
//                         elementLibrary.image.webglDataStore[image.url].bitmap = bitmap;
//                         activateShouldRenderFrame();
//                     },
//                     (errorType, response, error) => {
//                         if(errorType == 'badURL'){
//                             console.warn(type,id,self.getAddress(),'could not find image at: '+url);
//                             console.warn(response);
//                             loadImage(image.defaultURL);
//                         }else if(errorType == 'imageDecodingError'){
//                             console.error('Image decoding error :: url:',url);
//                             console.error('-- -- -- -- -- -- -- :: response:',response);
//                             console.error(error);
//                             loadImage(image.defaultURL);
//                         }else if(errorType == 'previousFailure'){
//                             console.warn('previous failure to load "'+url+'" - load not attempted this time');
//                         }else{
//                             console.error('Unknown error :: errorType:',errorType);
//                             loadImage(image.defaultURL);
//                         }
//                     },
//                     forceUpdate
//                 );
//             }
//             setTimeout(()=>{ if(image.url == ''){ loadImage(image.defaultURL); } },1000);

//             this.url = function(a,forceUpdate=false){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].url(',a,forceUpdate); //#development

//                 if(a==undefined){return image.url;}
//                 if(a==image.url){return;} //no need to reload the same image
//                 image.url = a;

//                 if(image.url == ''){ image.url = image.defaultURL; }

//                 loadImage(image.url,forceUpdate);
//             };
//             this.bitmap = function(a){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].bitmap(',a); //#development

//                 if(a==undefined){
//                     return elementLibrary.image.webglDataStore[image.url] != undefined ? elementLibrary.image.webglDataStore[image.url].bitmap : undefined;
//                 }
//                 image.url = id+':internalBitmap';
//                 elementLibrary.image.webglDataStore[image.url].bitmap = bitmap;

//                 activateShouldRenderFrame();
//             };

//         //unifiedAttribute
//             this.unifiedAttribute = function(attributes){
//                 if(attributes==undefined){ return { ignored:ignored, colour:colour, x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, url:image.url }; } 
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute(',attributes); //#development

//                 allowComputeExtremities = false;
//                 Object.keys(attributes).forEach(key => {
//                     dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute -> updating "'+key+'" to '+JSON.stringify(attributes[key])); //#development
//                     try{
//                         self[key](attributes[key]);
//                     }catch(err){
//                         console.warn(type,id,self.getAddress(),'.unifiedAttribute -> unknown attribute "'+key+'" which was being set to "'+JSON.stringify(attributes[key])+'"');
//                     }
//                 });
//                 allowComputeExtremities = true;

//                 computeExtremities();
//             };

//     //webGL rendering functions
//         const points = [
//             0,0,
//             1,0,
//             1,1,
//             0,1,
//         ];
//         const vertexShaderSource = `#version 300 es
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
//                 uniform vec2 dimensions;
//                 uniform vec2 anchor;

//             //vertex/fragment shader transfer variables
//                 out vec2 textureCoordinates;

//             void main(){
//                 //transfer point to fragment shader
//                     textureCoordinates = point;

//                 //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
//                     vec2 P = dimensions * adjust.scale * (point - anchor);
//                     P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;

//                 //convert from unit space to clipspace
//                     gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
//             }
//         `;
//         const fragmentShaderSource = `#version 300 es
//             precision mediump float;
//             out vec4 outputColour;

//             uniform sampler2D textureImage;
//             in vec2 textureCoordinates;
                                                                        
//             void main(){
//                 outputColour = texture(textureImage, textureCoordinates);
//             }
//         `;
//         const point = { buffer:undefined, attributeLocation:undefined };
//         let uniformLocations;
//         function updateGLAttributes(context,adjust){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes(',context,adjust); //#development

//             //buffers
//                 //points
//                     if(point.buffer == undefined){
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> creating point.buffer...'); //#development
//                         point.attributeLocation = context.getAttribLocation(program, "point");
//                         point.buffer = context.createBuffer();
//                         context.enableVertexAttribArray(point.attributeLocation);
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                         context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
//                     }else{
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating point.buffer...'); //#development
//                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
//                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
//                     }

//                 //texture
//                     if(elementLibrary.image.webglDataStore[image.url].texture == undefined){
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> generating new textureData...'); //#development
//                         elementLibrary.image.webglDataStore[image.url].texture = context.createTexture();
//                         context.bindTexture( context.TEXTURE_2D, elementLibrary.image.webglDataStore[image.url].texture );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
//                         context.texImage2D( context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, elementLibrary.image.webglDataStore[image.url].bitmap );

//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> mipmap generation...'); //#development
//                         context.generateMipmap( context.TEXTURE_2D );
//                         context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST_MIPMAP_LINEAR );
//                     }else{
//                         dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> this texture has been found in image\'s webglDataStore, using that data instead as new textureData...'); //#development
//                         context.bindTexture( context.TEXTURE_2D, elementLibrary.image.webglDataStore[image.url].texture );
//                     }

//             //uniforms
//                 if( uniformLocations == undefined ){
//                     dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> defining uniformLocations...'); //#development
//                     uniformLocations = {
//                         "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
//                         "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
//                         "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
//                         "resolution": context.getUniformLocation(program, "resolution"),
//                         "dimensions": context.getUniformLocation(program, "dimensions"),
//                         "anchor": context.getUniformLocation(program, "anchor"),
//                     };
//                 }

//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> canvas.width:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> width:'+width+' height:'+height); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> anchor.x:'+anchor.x+' anchor.y:'+anchor.y); //#development
//                 context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
//                 context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
//                 context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
//                 context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
//                 context.uniform2f(uniformLocations["dimensions"], width, height);
//                 context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
//         }
//         let program;
//         function activateGLRender(context,adjust){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::activateGLRender(',context,adjust); //#development
//             if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
            
//             if(!elementLibrary.image.webglDataStore[image.url].isLoaded){return;} //do not render, if the image has not yet been loaded

//             context.useProgram(program);
//             updateGLAttributes(context,adjust);
//             context.drawArrays(context.TRIANGLE_FAN, 0, 4);
//         }
        
//     //extremities
//         function computeExtremities(informParent=true,offset){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities(',informParent,offset); //#development
            
//             //get offset from parent, if one isn't provided
//                 if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
//             //calculate adjusted offset based on the offset
//                 const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> point',point); //#development
//                 const adjusted = { 
//                     x: point.x*offset.scale + offset.x,
//                     y: point.y*offset.scale + offset.y,
//                     scale: offset.scale*scale,
//                     angle: -(offset.angle + angle),
//                 };
//             //calculate points based on the adjusted offset
//                 self.extremities.points = [];
//                 for(let a = 0; a < points.length; a+=2){
//                     const P = {
//                         x: adjusted.scale * width * (points[a] - anchor.x), 
//                         y: adjusted.scale * height * (points[a+1] - anchor.y), 
//                     };

//                     self.extremities.points.push({ 
//                         x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
//                         y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
//                     });
//                 }
//                 self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> self.extremities.points:',self.extremities.points); //#development
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities -> self.extremities.boundingBox:',self.extremities.boundingBox); //#development
        
//             //if told to do so, inform parent (if there is one) that extremities have changed
//                 if(informParent){ if(self.parent){self.parent.updateExtremities();} }
//         }
//         this.computeExtremities = computeExtremities;
        
//     //render
//         function drawDotFrame(){
//             //draw shape extremity points
//                 self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
//             //draw bounding box top left and bottom right points
//                 render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
//                 render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
//         };
//         function activateShouldRenderFrame(){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::activateShouldRenderFrame()'); //#development
//             if(render.shouldRenderFrame){
//                 dev.log.elementLibrary[type]('['+self.getAddress()+']::activateShouldRenderFrame -> render.shouldRenderFrame is already true'); //#development
//                 return;
//             }
//             render.shouldRenderFrame = shouldThisElementRender();
//         }
//         function shouldThisElementRender(){
//             dev.log.elementLibrary[type]('['+self.getAddress()+']::shouldThisElementRender()'); //#development
//             if( self.parent == undefined || self.parent.clipActive == undefined ){
//                 return library.math.detectIntersect.boundingBoxes( viewport.getBoundingBox(), self.extremities.boundingBox );
//             }
//             return library.math.detectIntersect.boundingBoxes(
//                 self.parent.clipActive() ? self.parent.extremities.boundingBox : viewport.getBoundingBox(),
//                 self.extremities.boundingBox
//             );
//         }
//         this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
//             dev.log.elementLibrary[type]('['+self.getAddress()+'].render(',context,offset); //#development

//             //judge whether element should be rendered
//                 if( !shouldThisElementRender() ){
//                     dev.log.elementLibrary[type]('['+self.getAddress()+'].render -> not rendering'); //#development
//                     return;
//                 }
//                 dev.log.elementLibrary[type]('['+self.getAddress()+'].render -> rendering'); //#development

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
//             console.log(self.getAddress(),'._dump()');
//             console.log(self.getAddress(),'._dump -> id: '+id);
//             console.log(self.getAddress(),'._dump -> type: '+type);
//             console.log(self.getAddress(),'._dump -> name: '+self.name);
//             console.log(self.getAddress(),'._dump -> address: '+self.getAddress());
//             console.log(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
//             console.log(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
//             console.log(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
//             console.log(self.getAddress(),'._dump -> ignored: '+ignored);
//             console.log(self.getAddress(),'._dump -> image: ',image);
//             console.log(self.getAddress(),'._dump -> x: '+x);
//             console.log(self.getAddress(),'._dump -> y: '+y);
//             console.log(self.getAddress(),'._dump -> angle: '+angle);
//             console.log(self.getAddress(),'._dump -> anchor: '+JSON.stringify(anchor));
//             console.log(self.getAddress(),'._dump -> width: '+width);
//             console.log(self.getAddress(),'._dump -> height: '+height);
//             console.log(self.getAddress(),'._dump -> scale: '+scale);
//             console.log(self.getAddress(),'._dump -> image: '+JSON.stringify(image));
//             console.log(self.getAddress(),'._dump -> elementLibrary.image.webglDataStore:',elementLibrary.image.webglDataStore);
            
//         };
    
//     //interface
//         this.interface = new function(){
//             this.ignored = self.ignored;
//             this.x = self.x;
//             this.y = self.y;
//             this.angle = self.angle;
//             this.anchor = self.anchor;
//             this.width = self.width;
//             this.height = self.height;
//             this.scale = self.scale;
//             this.url = self.url;
//             this.bitmap = self.bitmap;
//             this.unifiedAttribute = self.unifiedAttribute;
//             this.getAddress = self.getAddress;
//             this._dump = self._dump;
//         };
// };
// this.image.webglDataStore = {};



























/////draft 2
this.image = function(_id,_name){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'image'; 
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
                activateShouldRenderFrame();
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
            this.x = function(a){ 
                if(a==undefined){return x;}     
                x = a;     
                dev.log.elementLibrary[type]('['+self.getAddress()+'].x(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                activateShouldRenderFrame();
            };
            this.y = function(a){ 
                if(a==undefined){return y;}     
                y = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].y(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                activateShouldRenderFrame();
            };
            this.angle = function(a){ 
                if(a==undefined){return angle;} 
                angle = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].angle(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                activateShouldRenderFrame();
            };
            this.anchor = function(a){
                if(a==undefined){return anchor;} 
                anchor = a; 
                dev.log.elementLibrary[type]('['+self.getAddress()+'].anchor(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                activateShouldRenderFrame();
            };
            this.width = function(a){
                if(a==undefined){return width;}  
                width = a;  
                dev.log.elementLibrary[type]('['+self.getAddress()+'].width(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                activateShouldRenderFrame();
            };
            this.height = function(a){
                if(a==undefined){return height;} 
                height = a; 
                dev.log.elementLibrary[type]('['+self.getAddress()+'].height(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                activateShouldRenderFrame();
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary[type]('['+self.getAddress()+'].scale(',a); //#development
                if(allowComputeExtremities){computeExtremities();}
                activateShouldRenderFrame();
            };

        //image data
            const state = {
                url:'',
                defaultURL:'/images/noimageimage.png'
            };
            function loadImage(url,forceUpdate=false){
                dev.log.elementLibrary[type]('['+self.getAddress()+']::loadImage(',url,forceUpdate); //#development
                
                if(url == ''){
                    state.url = state.defaultURL;
                    url = state.defaultURL;
                }
                if(elementLibrary.image.webglDataStore[state.url] != undefined && !forceUpdate){
                    activateShouldRenderFrame();
                    return;
                }

                elementLibrary.image.webglDataStore[state.url] = {
                    bitmap: undefined,
                    textureData: undefined,
                    isLoaded: false,
                    isProcessed: false,
                };

                library.misc.loadImageFromURL(
                    url, 
                    bitmap => {
                        elementLibrary.image.webglDataStore[url].bitmap = bitmap;
                        elementLibrary.image.webglDataStore[url].isLoaded = true;
                        elementLibrary.image.webglDataStore[url].isProcessed = false;

                        if(url != state.url){
                            dev.log.elementLibrary[type]('['+self.getAddress()+']::loadImage -> URL has changed since this request started; re-requesting...'); //#development
                            loadImage(state.url);
                            return;
                        }

                        activateShouldRenderFrame();
                    },
                    (errorType, response, error) => {
                        if(errorType == 'badURL'){
                            console.warn(type,id,self.getAddress(),'could not find image at: '+url);
                            console.warn(response);
                            loadImage(state.defaultURL);
                        }else if(errorType == 'imageDecodingError'){
                            console.error('Image decoding error :: url:',url);
                            console.error('-- -- -- -- -- -- -- :: response:',response);
                            console.error(error);
                            loadImage(state.defaultURL);
                        }else if(errorType == 'previousFailure'){
                            console.warn('previous failure to load "'+url+'" - load not attempted this time');
                        }else{
                            console.error('Unknown error :: errorType:',errorType);
                            loadImage(state.defaultURL);
                        }
                    },
                    forceUpdate
                );
            }
            setTimeout(()=>{ if(state.url == ''){ loadImage(state.defaultURL); } },1000);

            this.url = function(a,forceUpdate=false){
                dev.log.elementLibrary[type]('['+self.getAddress()+'].url(',a,forceUpdate); //#development

                if(a==undefined){return state.url;}
                if(a==state.url){return;} //no need to reload the same image
                state.url = a;

                if(state.url == ''){ state.url = state.defaultURL; }

                loadImage(state.url,forceUpdate);
            };
            this.bitmap = function(a){
                dev.log.elementLibrary[type]('['+self.getAddress()+'].bitmap(',a); //#development

                if(a==undefined){
                    return elementLibrary.image.webglDataStore[state.url] != undefined ? elementLibrary.image.webglDataStore[state.url].bitmap : undefined;
                }
                state.url = id+':internalBitmap';
                elementLibrary.image.webglDataStore[state.url] = {
                    bitmap: a,
                    textureData: undefined,
                    isLoaded: true,
                    isProcessed: false,
                };

                activateShouldRenderFrame();
            };

        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return { ignored:ignored, colour:colour, x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, url:image.url }; } 
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
        const points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        const vertexShaderSource = `#version 300 es
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

            //vertex/fragment shader transfer variables
                out vec2 textureCoordinates;

            void main(){
                //transfer point to fragment shader
                    textureCoordinates = point;

                //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                    vec2 P = dimensions * adjust.scale * (point - anchor);
                    P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        const fragmentShaderSource = `#version 300 es
            precision mediump float;
            out vec4 outputColour;

            uniform sampler2D textureImage;
            in vec2 textureCoordinates;
                                                                        
            void main(){
                outputColour = texture(textureImage, textureCoordinates);
            }
        `;
        const point = { buffer:undefined, attributeLocation:undefined };
        let uniformLocations;
        function updateGLAttributes(context,adjust){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes(',context,adjust); //#development

            //buffers
                //points
                    if(point.buffer == undefined){
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> creating point.buffer...'); //#development
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        context.enableVertexAttribArray( point.attributeLocation );
                        context.bindBuffer( context.ARRAY_BUFFER, point.buffer ); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData( context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW );
                    }else{
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> updating point.buffer...'); //#development
                        context.bindBuffer( context.ARRAY_BUFFER, point.buffer ); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }

                //texture
                    if( !elementLibrary.image.webglDataStore[state.url].isProcessed ){
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> generating new textureData...'); //#development
                        elementLibrary.image.webglDataStore[state.url].textureData = context.createTexture();
                        context.bindTexture( context.TEXTURE_2D, elementLibrary.image.webglDataStore[state.url].textureData );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
                        context.texImage2D( context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, elementLibrary.image.webglDataStore[state.url].bitmap );

                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> mipmap generation...'); //#development
                        context.generateMipmap( context.TEXTURE_2D );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST_MIPMAP_LINEAR );

                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> texture processing complete'); //#development
                        elementLibrary.image.webglDataStore[state.url].isProcessed = true;
                        activateShouldRenderFrame();
                    }else{
                        dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> this texture has been found in image\'s webglDataStore, using that data instead as new textureData...'); //#development
                        context.bindTexture( context.TEXTURE_2D, elementLibrary.image.webglDataStore[state.url].textureData );
                    }

            //uniforms
                if( uniformLocations == undefined ){
                    dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> defining uniformLocations...'); //#development
                    uniformLocations = {
                        "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                        "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                        "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                        "resolution": context.getUniformLocation(program, "resolution"),
                        "dimensions": context.getUniformLocation(program, "dimensions"),
                        "anchor": context.getUniformLocation(program, "anchor"),
                    };
                }

                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> canvas.width:'+context.canvas.width+' canvas.height:'+context.canvas.height); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> width:'+width+' height:'+height); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateGLAttributes -> anchor.x:'+anchor.x+' anchor.y:'+anchor.y); //#development
                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform2f(uniformLocations["dimensions"], width, height);
                context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
        }
        let program;
        function activateGLRender(context,adjust){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::activateGLRender(',context,adjust); //#development
            if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
            
            if(!elementLibrary.image.webglDataStore[state.url].isLoaded){return;} //do not render, if the image has not yet been loaded and processed

            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
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
        
    //render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
        };
        function activateShouldRenderFrame(){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::activateShouldRenderFrame()'); //#development
            if(render.shouldRenderFrame){
                dev.log.elementLibrary[type]('['+self.getAddress()+']::activateShouldRenderFrame -> render.shouldRenderFrame is already true'); //#development
                return;
            }
            render.shouldRenderFrame = shouldThisElementRender();
        }
        function shouldThisElementRender(){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::shouldThisElementRender()'); //#development
            if( self.parent == undefined || self.parent.clipActive == undefined ){
                return library.math.detectIntersect.boundingBoxes( viewport.getBoundingBox(), self.extremities.boundingBox );
            }
            return library.math.detectIntersect.boundingBoxes(
                self.parent.clipActive() ? self.parent.extremities.boundingBox : viewport.getBoundingBox(),
                self.extremities.boundingBox
            );
        }
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].render(',context,offset); //#development

            //judge whether element should be rendered
                if( !shouldThisElementRender() ){
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].render -> not rendering'); //#development
                    return;
                }
                dev.log.elementLibrary[type]('['+self.getAddress()+'].render -> rendering'); //#development

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
            console.log(self.getAddress(),'._dump()');
            console.log(self.getAddress(),'._dump -> id: '+id);
            console.log(self.getAddress(),'._dump -> type: '+type);
            console.log(self.getAddress(),'._dump -> name: '+self.name);
            console.log(self.getAddress(),'._dump -> address: '+self.getAddress());
            console.log(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
            console.log(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
            console.log(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
            console.log(self.getAddress(),'._dump -> ignored: '+ignored);
            console.log(self.getAddress(),'._dump -> state:',state);
            console.log(self.getAddress(),'._dump -> x: '+x);
            console.log(self.getAddress(),'._dump -> y: '+y);
            console.log(self.getAddress(),'._dump -> angle: '+angle);
            console.log(self.getAddress(),'._dump -> anchor: '+JSON.stringify(anchor));
            console.log(self.getAddress(),'._dump -> width: '+width);
            console.log(self.getAddress(),'._dump -> height: '+height);
            console.log(self.getAddress(),'._dump -> scale: '+scale);
            console.log(self.getAddress(),'._dump -> elementLibrary.image.webglDataStore:',elementLibrary.image.webglDataStore);
        };
    
    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.x = self.x;
            this.y = self.y;
            this.angle = self.angle;
            this.anchor = self.anchor;
            this.width = self.width;
            this.height = self.height;
            this.scale = self.scale;
            this.url = self.url;
            this.bitmap = self.bitmap;
            this.unifiedAttribute = self.unifiedAttribute;
            this.getAddress = self.getAddress;
            this._dump = self._dump;
        };
};
this.image.webglDataStore = {};