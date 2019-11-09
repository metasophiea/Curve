const communicationModuleMaker = function(communicationObject,callerName){
    const self = this;
    const devMode = false;
    this.log = function(){
        if(!devMode){return;}
        let prefix = 'communicationModule['+callerName+']';
        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
    };
    this.function = {};

    let messageId = 0;
    const messagingCallbacks = {};

    function generateMessageID(){
        self.log('::generateMessageID()');
        return messageId++;
    }

    communicationObject.onmessage = function(encodedPacket){
        self.log('::communicationObject.onmessage('+JSON.stringify(encodedPacket)+')');
        let message = encodedPacket.data;

        if(message.outgoing){
            self.log('::communicationObject.onmessage -> message is an outgoing one');
            if(message.cargo.function in self.function){
                self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" found');
                self.log('::communicationObject.onmessage -> function arguments: '+JSON.stringify(message.cargo.arguments));
                if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                if(message.id == null){
                    self.log('::communicationObject.onmessage -> message ID missing; will not return any data');
                    self.function[message.cargo.function](...message.cargo.arguments);
                }else{
                    self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data');
                    communicationObject.postMessage({
                        id:message.id,
                        outgoing:false,
                        cargo:self.function[message.cargo.function](...message.cargo.arguments),
                    });
                }
            }else{
                self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" not found');
            }
        }else{
            self.log('::communicationObject.onmessage -> message is an incoming one');
            self.log('::communicationObject.onmessage -> message ID: '+message.id+' cargo: '+JSON.stringify(message.cargo));
            messagingCallbacks[message.id](message.cargo);
            delete messagingCallbacks[message.id];
        }
    };
    this.run = function(functionName,argumentList=[],callback,transferables){
        self.log('.run('+functionName+','+JSON.stringify(argumentList)+','+callback+','+JSON.stringify(transferables)+')');
        let id = null;
        if(callback != undefined){
            self.log('.run -> callback was defined; generating message ID');
            id = generateMessageID();
            self.log('.run -> message ID:',id);
            messagingCallbacks[id] = callback;
        }
        communicationObject.postMessage({ id:id, outgoing:true, cargo:{function:functionName,arguments:argumentList} },transferables);
    };
};
const communicationModule = new communicationModuleMaker(this,'core_engine');
communicationModule.function['ready'] = function(){return false;};

const library = {
    devMode:true,
    log: function(){
        if(!library.devMode){return;}
        let prefix = 'core_engine.library';
        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(87, 161, 80); font-style:italic;' );
    },
    math:{
        averageArray: function(array){
            library.log('.math.averageArray('+JSON.stringify(array)+')');
            // return array.reduce( ( p, c ) => p + c, 0 ) / array.length
        
            //this seems to be a little faster
            let sum = array[0];
            for(let a = 1; a < array.length; a++){ sum += array[a]; }
            return sum/array.length;
        },
        cartesianAngleAdjust: function(x,y,angle){
            library.log('.math.cartesianAngleAdjust('+x+','+y+','+angle+')');
            if(angle == 0){ return {x:x,y:y}; }
            return { x:x*Math.cos(angle) - y*Math.sin(angle), y:y*Math.cos(angle) + x*Math.sin(angle) };
        },
        boundingBoxFromPoints: function(points){
            library.log('.math.boundingBoxFromPoints('+JSON.stringify(points)+')');
            if(points.length == 0){
                return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
            }
        
            let left = points[0].x; let right = points[0].x;
            let top = points[0].y;  let bottom = points[0].y;
        
            for(let a = 1; a < points.length; a++){
                if( points[a].x < left ){ left = points[a].x; }
                else if(points[a].x > right){ right = points[a].x; }
        
                if( points[a].y < top ){ top = points[a].y; }
                else if(points[a].y > bottom){ bottom = points[a].y; }
            }
        
            return {
                topLeft:{x:left,y:top},
                bottomRight:{x:right,y:bottom}
            };
        },
        detectOverlap: new function(){
            const detectOverlap = this;
        
            this.boundingBoxes = function(a, b){
                library.log('.math.detectOverlap.boundingBoxes('+JSON.stringify(a)+','+JSON.stringify(b)+')');
                return a.bottomRight.y >= b.topLeft.y && 
                    a.bottomRight.x >= b.topLeft.x && 
                    a.topLeft.y <= b.bottomRight.y && 
                    a.topLeft.x <= b.bottomRight.x;
            };
            this.pointWithinBoundingBox = function(point,box){
                library.log('.math.detectOverlap.pointWithinBoundingBox('+JSON.stringify(point)+','+JSON.stringify(box)+')');
                return !(
                    point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
                    point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
                );
            };
            this.pointWithinPoly = function(point,points){
                library.log('.math.detectOverlap.pointWithinPoly('+JSON.stringify(point)+','+JSON.stringify(points)+')');
                //Ray casting algorithm
        
                let inside = false;
                for(let a = 0, b = points.length - 1; a < points.length; b = a++){
                    //if the point is on a point of the poly; bail and return true
                    if( point.x == points[a].x && point.y == points[a].y ){ return true; }
        
                    //point must be on the same level of the line
                    if( (points[b].y >= point.y && points[a].y <= point.y) || (points[a].y >= point.y && points[b].y <= point.y) ){
                        //discover if the point is on the far right of the line
                        if( points[a].x < point.x && points[b].x < point.x ){
                            inside = !inside;
                        }else{
                            //calculate what side of the line this point is
                                let areaLocation = 0;
                                if( points[b].y > points[a].y && points[b].x > points[a].x ){
                                    areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) - (point.y-points[a].y)/(points[b].y-points[a].y) + 1;
                                }else if( points[b].y <= points[a].y && points[b].x <= points[a].x ){
                                    areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) - (point.y-points[b].y)/(points[a].y-points[b].y) + 1;
                                }else if( points[b].y > points[a].y && points[b].x < points[a].x ){
                                    areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) + (point.y-points[a].y)/(points[b].y-points[a].y);
                                }else if( points[b].y <= points[a].y && points[b].x >= points[a].x ){
                                    areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) + (point.y-points[b].y)/(points[a].y-points[b].y);
                                }
        
                            //if its on the line, return true immediatly, if it's just above 1 do a flip
                                if( areaLocation == 1 ){
                                    return true;
                                }else if(areaLocation > 1){
                                    inside = !inside;
                                }
                        }
                    }
                }
                return inside;
            };
            this.lineSegments = function(segment1, segment2){
                library.log('.math.detectOverlap.lineSegments('+JSON.stringify(segment1)+','+JSON.stringify(segment2)+')');
                const denominator = (segment2[1].y-segment2[0].y)*(segment1[1].x-segment1[0].x) - (segment2[1].x-segment2[0].x)*(segment1[1].y-segment1[0].y);
                if(denominator == 0){return null;}
        
                const u1 = ((segment2[1].x-segment2[0].x)*(segment1[0].y-segment2[0].y) - (segment2[1].y-segment2[0].y)*(segment1[0].x-segment2[0].x))/denominator;
                const u2 = ((segment1[1].x-segment1[0].x)*(segment1[0].y-segment2[0].y) - (segment1[1].y-segment1[0].y)*(segment1[0].x-segment2[0].x))/denominator;
                return {
                    'x':      (segment1[0].x + u1*(segment1[1].x-segment1[0].x)),
                    'y':      (segment1[0].y + u1*(segment1[1].y-segment1[0].y)),
                    'inSeg1': (u1 >= 0 && u1 <= 1),
                    'inSeg2': (u2 >= 0 && u2 <= 1)
                };
            };
            this.overlappingPolygons = function(points_a,points_b){
                library.log('.math.detectOverlap.overlappingPolygons('+JSON.stringify(points_a)+','+JSON.stringify(points_b)+')');
                //a point from A is in B
                    for(let a = 0; a < points_a.length; a++){
                        if(detectOverlap.pointWithinPoly(points_a[a],points_b)){ return true; }
                    }
        
                //a point from B is in A
                    for(let a = 0; a < points_b.length; a++){
                        if(detectOverlap.pointWithinPoly(points_b[a],points_a)){ return true; }
                    }
        
                //side intersection
                    const a_indexing = Array.apply(null, {length: points_a.length}).map(Number.call, Number).concat([0]);
                    const b_indexing = Array.apply(null, {length: points_b.length}).map(Number.call, Number).concat([0]);
        
                    for(let a = 0; a < a_indexing.length-1; a++){
                        for(let b = 0; b < b_indexing.length-1; b++){
                            const tmp = detectOverlap.lineSegments( 
                                [ points_a[a_indexing[a]], points_a[a_indexing[a+1]] ],
                                [ points_b[b_indexing[b]], points_b[b_indexing[b+1]] ]
                            );
                            if( tmp != null && tmp.inSeg1 && tmp.inSeg2 ){return true;}
                        }
                    }
        
                return false;
            };
            this.overlappingPolygonWithPolygons = function(poly,polys){ 
                library.log('.math.detectOverlap.overlappingPolygonWithPolygons('+JSON.stringify(poly)+','+JSON.stringify(polys)+')');
                for(let a = 0; a < polys.length; a++){
                    if(detectOverlap.boundingBoxes(poly.boundingBox, polys[a].boundingBox)){
                        if(detectOverlap.overlappingPolygons(poly.points, polys[a].points)){
                            return true;
                        }
                    }
                }
                return false;
            };
        
            function overlappingLineWithPolygon(line,poly){
                library.log('.math.detectOverlap::overlappingLineWithPolygon('+JSON.stringify(line)+','+JSON.stringify(poly)+')');
                //go through every side of the poly, and if one of them collides with the line, return true
                for(let a = poly.points.length-1, b = 0; b < poly.points.length; a = b++){
                    const tmp = library.math.detectOverlap.lineSegments(
                        [
                            { x:line.x1, y:line.y1 },
                            { x:line.x2, y:line.y2 }
                        ],
                        [
                            { x:poly.points[a].x, y:poly.points[a].y },
                            { x:poly.points[b].x, y:poly.points[b].y }
                        ],
                    );
                    if(tmp != null && tmp.inSeg1 && tmp.inSeg2){ return true; }
                }
        
                return false;
            };
            this.overlappingLineWithPolygons = function(line,polys){
                library.log('.math.detectOverlap.overlappingLineWithPolygons('+JSON.stringify(line)+','+JSON.stringify(polys)+')');
                //generate a bounding box for the line
                    const line_boundingBox = { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
                    if(line.x1 > line.x2){
                        line_boundingBox.topLeft.x = line.x2;
                        line_boundingBox.bottomRight.x = line.x1;
                    }else{
                        line_boundingBox.topLeft.x = line.x1;
                        line_boundingBox.bottomRight.x = line.x2;
                    }
                    if(line.y1 > line.y2){
                        line_boundingBox.topLeft.y = line.y2;
                        line_boundingBox.bottomRight.y = line.y1;
                    }else{
                        line_boundingBox.topLeft.y = line.y1;
                        line_boundingBox.bottomRight.y = line.y2;
                    }
        
                //gather the indexes of the polys that collide with this line
                    const collidingPolyIndexes = [];
                    polys.forEach((poly,index) => {
                        if( !library.math.detectOverlap.boundingBoxes(line_boundingBox,poly.boundingBox) ){return;}
                        if( overlappingLineWithPolygon(line,poly) ){ collidingPolyIndexes.push(index); }
                    });
        
                return collidingPolyIndexes;
            };
        },
    },
    glsl:{
        geometry:`
            #define PI 3.141592653589793

            vec2 cartesian2polar(vec2 xy){
                float dis = pow(pow(xy.x,2.0)+pow(xy.y,2.0),0.5);
                float ang = 0.0;

                if(xy.x == 0.0){
                    if(xy.y == 0.0){ang = 0.0;}
                    else if(xy.y > 0.0){ang = 0.5*PI;}
                    else{ang = 1.5*PI;}
                }
                else if(xy.y == 0.0){
                    if(xy.x >= 0.0){ang = 0.0;}else{ang = PI;}
                }
                else if(xy.x >= 0.0){ ang = atan(xy.y/xy.x); }
                else{ /*if(xy.x < 0.0)*/ ang = atan(xy.y/xy.x) + PI; }

                return vec2(ang,dis);
            }
            vec2 polar2cartesian(vec2 ad){
                return vec2( ad[1]*cos(ad[0]), ad[1]*sin(ad[0]) );
            }
            vec2 cartesianAngleAdjust(vec2 xy, float angle){
                if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }
                return vec2( xy.x*cos(angle) - xy.y*sin(angle), xy.y*cos(angle) + xy.x*sin(angle) ); 
            }
        `,
    },
};

const dev = {
    shape:{active:true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    arrangement:{active:true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    shapeLibrary:{active:true,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
    render:{active:true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    viewport:{active:true,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    stats:{active:true,fontStyle:''},
    log:function(section){ 
        if(dev[section].active){
            console.log('%c'+'core_engine.'+section+(new Array(...arguments).slice(1).join(' ')),dev[section].fontStyle );
        }
    },
};

const shape = new function(){
    //shapeLibrary
        const shapeLibrary = new function(){
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
            this.group = function(name,_id){
                var self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'group'; this.getType = function(){return type;}
                        const id = _id; this.getId = function(){return id;}
            
                    //simple attributes
                        this.name = name;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        let ignored = false;
                        this.ignored = function(a){
                            if(a==undefined){return ignored;}     
                            ignored = a;
                            dev.log('shapeLibrary','.group.ignored('+a+')');
                            computeExtremities();
                        };
                    //advanced use attributes
                        this.devMode = false;
                    
                    //attributes pertinent to extremity calculation
                        let x = 0;     
                        let y = 0;     
                        let angle = 0; 
                        let scale = 1; 
                        let heedCamera = false;
                        let static = false;
                        this.x = function(a){ 
                            if(a==undefined){return x;}     
                            x = a;     
                            dev.log('shapeLibrary','.group.x('+a+')');
                            computeExtremities();
                        };
                        this.y = function(a){ 
                            if(a==undefined){return y;}     
                            y = a;
                            dev.log('shapeLibrary','.group.y('+a+')');
                            computeExtremities();
                        };
                        this.angle = function(a){ 
                            if(a==undefined){return angle;} 
                            angle = a;
                            dev.log('shapeLibrary','.group.angle('+a+')');
                            computeExtremities();
                        };
                        this.scale = function(a){ 
                            if(a==undefined){return scale;} 
                            scale = a;
                            dev.log('shapeLibrary','.group.scale('+a+')');
                            computeExtremities();
                        };
                        this.heedCamera = function(a){
                            if(a==undefined){return heedCamera;}     
                            heedCamera = a;
                            dev.log('shapeLibrary','.group.heedCamera('+a+')');
                            computeExtremities();
                        };
                        this.static = function(a){
                            if(a==undefined){return static;}  
                            static = a;  
                            dev.log('shapeLibrary','.group.static('+a+')');
                            computeExtremities();
                        };
                        this.unifiedAttribute = function(attributes){
                            if(attributes==undefined){ return {x:x, y:y, angle:angle, scale:scale, ignored:ignored, heedCamera:heedCamera, static:static}; } 
                            dev.log('shapeLibrary','.group.unifiedAttribute('+JSON.stringify(attributes)+')');
            
                            if('ignored' in attributes){ ignored = attributes.ignored; }
            
                            if('x' in attributes){ x = attributes.x; }
                            if('y' in attributes){ y = attributes.y; }
                            if('angle' in attributes){ angle = attributes.angle; }
                            if('scale' in attributes){ scale = attributes.scale; }
                            if('heedCamera' in attributes){ scale = attributes.heedCamera; }
                            if('static' in attributes){ scale = attributes.static; }
            
                            computeExtremities();
                        };
            
                //addressing
                    this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };
            
                //group functions
                    let children = []; 
                    let childRegistry = {};
            
                    function getChildByName(name){ return childRegistry[name]; }
                    function checkForName(name){ return childRegistry[name] != undefined; }
                    function checkForShape(shape){ return children.find(a => a == shape); }
                    function isValidShape(shape){
                        if( shape == undefined ){ return false; }
                        if( shape.name.length == 0 ){
                            console.warn('group error: shape with no name being inserted into group "'+self.getAddress()+'", therefore; the shape will not be added');
                            return false;
                        }
                        if( checkForName(shape.name) ){
                            console.warn('group error: shape with name "'+shape.name+'" already exists in group "'+self.getAddress()+'", therefore; the shape will not be added');
                            return false;
                        }
            
                        return true;
                    }
            
                    this.children = function(){return children.map(shape => shape.getId());};
                    this.getChildByName = function(name){return getChildByName(name).getId();};
                    this._childRegistry = function(){return childRegistry;};
                    this.getChildIndexByName = function(name){return children.indexOf(children.find(a => a.name == name)); };
                    this.contains = checkForShape;
                    this.append = function(shapeId){
                        const shape = getShapeById(shapeId);
                        if(self.devMode){console.log(self.getAddress()+'::.append - type:'+shape.getType()+' - name:'+shape.name);}
            
                        if( !isValidShape(shape) ){ return; }
            
                        children.push(shape); 
                        shape.parent = this;
                        augmentExtremities_add(shape);
            
                        childRegistry[shape.name] = shape;
                        if(shape.onadd != undefined){shape.onadd(false);}
                    };
                    this.prepend = function(shapeId){
                        const shape = getShapeById(shapeId);
                        if( !isValidShape(shape) ){ return; }
            
                        children.unshift(shape); 
                        shape.parent = this;
                        augmentExtremities_add(shape);
            
                        childRegistry[shape.name] = shape;
                        if(shape.onadd != undefined){shape.onadd(true);}
                    };
                    this.remove = function(shapeId){
                        if(shapeId == undefined){return;}
                        const shape = getShapeById(shapeId);
                        if(shape.onremove != undefined){shape.onremove();}
                        children.splice(children.indexOf(shape), 1);
                        augmentExtremities_remove(shape);
            
                        shape.parent = undefined;
                        delete childRegistry[shape.name];
                    };
                    this.clear = function(){ children = []; childRegistry = {} };
                    this.getElementsUnderPoint = function(x,y){
                        var returnList = [];
            
                        //run though children backwords (thus, front to back)
                        for(var a = children.length-1; a >= 0; a--){
                            //if child wants to be ignored, just move on to the next one
                                if( children[a].ignored() ){ continue; }
            
                            //if the point is not within this child's bounding box, just move on to the next one
                                if( !library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, children[a].extremities.boundingBox ) ){ continue; }
            
                            //if the child is a group type; pass this point to it's "getElementsUnderPoint" function and collect the results, then move on to the next item
                                if( children[a].getType() == 'group' ){ returnList = returnList.concat( children[a].getElementsUnderPoint(x,y) ); continue; }
            
                            //if this point exists within the child; add it to the results list
                                if( library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, children[a].extremities.points ) ){ returnList = returnList.concat( children[a] ); }
                        }
            
                        return returnList.map(shape => getIdFromShape(shape));
                    };
                    this.getElementsUnderArea = function(points){
                        var returnList = [];
            
                        //run though children backwords (thus, front to back)
                        for(var a = children.length-1; a >= 0; a--){
                            //if child wants to be ignored, just move on to the next one
                                if( children[a].ignored() ){ continue; }
            
                            //if the area does not overlap with this child's bounding box, just move on to the next one
                                if( !library.math.detectOverlap.boundingBoxes( library.math.boundingBoxFromPoints(points), item.extremities.boundingBox ) ){ continue; }
            
                            //if the child is a group type; pass this area to it's "getElementsUnderArea" function and collect the results, then move on to the next item
                                if( children[a].getType() == 'group' ){ returnList = returnList.concat( item.getElementUnderArea(points) ); continue; }
            
                            //if this area overlaps with the child; add it to the results list
                                if( library.math.detectOverlap.overlappingPolygons(points, item.extremities.points) ){ returnList = returnList.concat( children[a] ); }
                        }
            
                        return returnList.map(shape => getIdFromShape(shape));
                    };
                    this.getTree = function(){
                        var result = {name:this.name,type:type,children:[]};
            
                        children.forEach(function(a){
                            if(a.getType() == 'group'){ result.children.push( a.getTree() ); }
                            else{ result.children.push({ type:a.getType(), name:a.name }); }
                        });
            
                        return result;
                    };
            
                //clipping
                    var clipping = { stencil:undefined, active:false };
                    this.stencil = function(shapeId){
                        if(shapeId == undefined){return clipping.stencil;}
                        const shape = getShapeById(shapeId);
                        clipping.stencil = shape;
                        clipping.stencil.parent = this;
                        if(clipping.active){ computeExtremities(); }
                    };
                    this.clipActive = function(bool){
                        if(bool == undefined){return clipping.active;}
                        clipping.active = bool;
                        computeExtremities();
                    };
            
                //extremities
                    function calculateExtremitiesBox(){
                        var limits = {left:0,right:0,top:0,bottom:0};
                        children.forEach(child => {
                            var tmp = library.math.boundingBoxFromPoints(child.extremities.points);
                            if( tmp.bottomRight.x > limits.right ){ limits.right = tmp.bottomRight.x; }
                            else if( tmp.topLeft.x < limits.left ){ limits.left = tmp.topLeft.x; }
                            if( tmp.bottomRight.y > limits.top ){ limits.top = tmp.bottomRight.y; }
                            else if( tmp.topLeft.y < limits.bottom ){ limits.bottom = tmp.topLeft.y; }
                        });
                        self.extremities.points = [ {x:limits.left,y:limits.top}, {x:limits.right,y:limits.top}, {x:limits.right,y:limits.bottom}, {x:limits.left,y:limits.bottom} ];
                    }
                    function updateExtremities(informParent=true){
                        if(self.devMode){console.log(self.getAddress()+'::updateExtremities');}
            
                        //generate extremity points
                            self.extremities.points = [];
            
                            //if clipping is active and possible, the extremities of this group are limited to those of the clipping shape
                            //otherwise, gather extremities from children and calculate extremities here
                            if(clipping.active && clipping.stencil != undefined){
                                self.extremities.points = clipping.stencil.extremities.points.slice();
                            }else{
                                calculateExtremitiesBox();
                            }
                            if(self.devMode){console.log('\t--> '+self.getAddress()+'::extremities.points.length:',self.extremities.points.length);}
            
                        //generate bounding box from points
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
            
                        //update parent
                            if(informParent){ if(self.parent){self.parent.updateExtremities();} }
                    }
                    function augmentExtremities(shape){
                        if(self.devMode){console.log(self.getAddress()+'::augmentExtremities');}
            
                        //get offset from parent
                            var offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            shape.computeExtremities(false,newOffset);
                        //augment points list
                            calculateExtremitiesBox();
                            if(self.devMode){console.log('\t--> '+self.getAddress()+'::extremities.points.length:',self.extremities.points.length);}
                        //recalculate bounding box
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function computeExtremities(informParent=true,offset){
                        if(self.devMode){console.log(self.getAddress()+'::computeExtremities');}
                        
                        //get offset from parent, if one isn't provided
                            if(offset == undefined){ offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        //combine offset with group's position, angle and scale to produce new offset for chilren
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on all children
                            children.forEach(a => a.computeExtremities(false,newOffset));
                        //run computeExtremities on stencil (if applicable)
                            if( clipping.stencil != undefined ){ clipping.stencil.computeExtremities(false,newOffset); }
                        //update extremities
                            updateExtremities(informParent,offset);
                    }
                    function augmentExtremities_add(shape){
                        if(self.devMode){console.log(self.getAddress()+'::augmentExtremities_add');}
            
                        //get offset from parent
                            var offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            shape.computeExtremities(false,newOffset);
            
                        //augment points list
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints( self.extremities.points.concat(shape.extremities.points) );
                            self.extremities.points = [
                                { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.topLeft.y },
                                { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.topLeft.y },
                                { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.bottomRight.y },
                                { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.bottomRight.y },
                            ];
            
                            if(self.devMode){console.log('\t--> '+self.getAddress()+'::extremities.points.length:',self.extremities.points.length);}
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function augmentExtremities_remove(shape){
                        //this function assumes that the shape has already been removed from the 'children' variable)
                        if(self.devMode){console.log(self.getAddress()+'::augmentExtremities_remove');}
                        //is the shape's bounding box within the bounding box of the group; if so, no recalculation need be done
                        //otherwise the shape is touching the boundary, in which case search through the children for another 
                        //shape that also touches the boundary, or find the closest shape and adjust the boundary to touch that
            
                        var data = {
                            topLeft:{
                                x: self.extremities.boundingBox.topLeft.x - shape.extremities.boundingBox.topLeft.x,
                                y: self.extremities.boundingBox.topLeft.y - shape.extremities.boundingBox.topLeft.y,
                            },
                            bottomRight:{
                                x: shape.extremities.boundingBox.bottomRight.x - self.extremities.boundingBox.bottomRight.x,
                                y: shape.extremities.boundingBox.bottomRight.y - self.extremities.boundingBox.bottomRight.y,
                            }
                        };
                        if( data.topLeft.x != 0 && data.topLeft.y != 0 && data.bottomRight.x != 0 && data.bottomRight.y != 0 ){
                            if(self.devMode){console.log(self.getAddress()+'::'+'-> easy remove: no changes to the group\'s bounding box required');}
                            return;
                        }else{
                            ['topLeft','bottomRight'].forEach(cornerName => {
                                ['x','y'].forEach(axisName => {
                                    if(data[cornerName][axisName] == 0){
                                        if(self.devMode){console.log(self.getAddress()+'::'+'-> '+cornerName+'_'+axisName+' is at boundary');}
            
                                        var boundaryToucherFound = false;
                                        var closestToBoundary = {distance:undefined, position:undefined};
                                        for(var a = 0; a < children.length; a++){
                                            var tmp = Math.abs(children[a].extremities.boundingBox[cornerName][axisName] - self.extremities.boundingBox[cornerName][axisName]);
                                            if(closestToBoundary.distance == undefined || closestToBoundary.distance > tmp){
                                                closestToBoundary = { distance:tmp, position:children[a].extremities.boundingBox[cornerName][axisName] };
                                                if(closestToBoundary.distance == 0){ boundaryToucherFound = true; break; }
                                            }
                                        }
            
                                        if(!boundaryToucherFound){
                                            if(self.devMode){console.log(self.getAddress()+'::'+'-> need to adjust the bounding box');}
                                            self.extremities.boundingBox[cornerName][axisName] = closestToBoundary.position;
                                        }
                                    }
                                });
                            });
                        }
                    }
                     
            
                    this.getOffset = function(){
                        if(this.parent){
                            var offset = this.parent.getOffset();
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            return { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale * scale,
                                angle: offset.angle + angle,
                            };
                        }else{ return {x:x ,y:y ,scale:scale ,angle:angle}; }
                    };
                    this.computeExtremities = computeExtremities;
                    this.updateExtremities = updateExtremities;
            
                //lead render
                    function drawDotFrame(){
                        //draw bounding box top left and bottom right points
                        render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:0,b:0,a:0.75});
                        render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:0,b:0,a:0.75});
                    }
                    this.render = function(context, offset){
                        dev.log('shapeLibrary','.group.render(-context-,'+JSON.stringify(offset)+')');
            
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
            
                        //activate clipping (if requested, and is possible)
                            if(clipping.active && clipping.stencil != undefined){
                                //active stencil drawing mode
                                    context.enable(context.STENCIL_TEST);
                                    context.colorMask(false,false,false,false);
                                    context.stencilFunc(context.ALWAYS,1,0xFF);
                                    context.stencilOp(context.KEEP,context.KEEP,context.REPLACE);
                                    context.stencilMask(0xFF);
                                //draw stencil
                                    clipping.stencil.render(context,newOffset);
                                //reactive regular rendering
                                    context.colorMask(true,true,true,true);
                                    context.stencilFunc(context.EQUAL,1,0xFF);
                            }
                        
                        //render children
                            dev.log('shapeLibrary','.group.render -> rendering children');
                            children.forEach(function(a){
                                if(
                                    library.math.detectOverlap.boundingBoxes(
                                        clipping.active ? self.extremities.boundingBox : viewport.getBoundingBox(),
                                        a.extremities.boundingBox
                                    )
                                ){ 
                                    dev.log('shapeLibrary','.group.render -> rendering: '+JSON.stringify(a.getAddress()));
                                    a.render(context,newOffset);
                                }else{
                                    dev.log('shapeLibrary','.group.render ->  not rendering: '+JSON.stringify(a.getAddress()));
                                }
                            });
            
                        //deactivate clipping
                            if(clipping.active){ 
                                context.disable(context.STENCIL_TEST); 
                                context.clear(context.STENCIL_BUFFER_BIT);
                            }
            
                        //if requested; draw dot frame
                            if(self.dotFrame){drawDotFrame();}
                    };
            };
            this.rectangle.proxyableMethods = [
                {function:'heedCamera',arguments:['a']},
                {function:'x',arguments:['a']},
                {function:'y',arguments:['a']},
                {function:'angle',arguments:['a']},
                {function:'scale',arguments:['a']},
                {function:'unifiedAttribute',arguments:['attributes']},
            
                {function:'children',arguments:[]},
                {function:'getChildByName',arguments:['name']},
                {function:'getChildIndexByName',arguments:['name']},
                {function:'contains',arguments:['shapeId']},
                {function:'append',arguments:['shapeId']},
                {function:'prepend',arguments:['shapeId']},
                {function:'remove',arguments:['shapeId']},
                {function:'clear',arguments:[]},
                {function:'getElementsUnderPoint',arguments:['x','y']},
                {function:'getElementsUnderArea',arguments:['points']},
                {function:'getTree',arguments:[]},
                {function:'stencil',arguments:['shapeId']},
                {function:'clipActive',arguments:['active']},
            ];
        };
        this.getAvailableShapes = function(){ 
            dev.log('shape','.getAvailableShapes()'); 
            return Object.keys(shapeLibrary);
        };
        this.getProxyableShapeMethods = function(type){ 
            dev.log('shape','.getProxyableShapeMethods()'); 
            return shapeLibrary[type].proxyableMethods;
        };

    //controls
        const createdShapes = [];

        function generateShapeId(){
            let id = createdShapes.findIndex(item => item==undefined);
            return id != -1 ? id : createdShapes.length;
        }
        function getShapeById(id){ return createdShapes[id]; }
        function getIdFromShape(shape){ return shape.getId(); }
        this.getShapeById = getShapeById;
        this.getIdFromShape = getIdFromShape;
        this.getCreatedShapes = function(){ 
            dev.log('shape','.getCreatedShapes()'); 
            return createdShapes.map(shape => getIdFromShape(shape));
        };

        this.createShape_raw = function(type,name){
            dev.log('shape','.createShape_raw('+type+','+name+')');
            return new shapeLibrary[type](name);
        };
        this.createShape = function(type,name){
            dev.log('shape','.createShape('+type+','+name+')'); 
            const newShape_id = generateShapeId();
            createdShapes[newShape_id] = new shapeLibrary[type](name,newShape_id);
            return newShape_id;
        };        
        this.deleteShape = function(id){ 
            dev.log('shape','.deleteShape('+id+')'); 
            createdShapes[id] = undefined;
        };
        this.deleteAllCreatedShapes = function(){ 
            dev.log('shape','.deleteAllCreatedShapes()'); 
            for(let a = 0; a < createdShapes.length; a++){this.deleteShape(a);}
        };
        this.getShapeTypeById = function(id){ 
            dev.log('shape','.getShapeTypeById('+id+')');
            return getShapeById(id).getType();
        };
        this.executeShapeMethod = function(id,methodName,argumentList=[]){
            dev.log('shape','.executeShapeMethod('+id+','+methodName+','+JSON.stringify(argumentList)+')');
            return getShapeById(id)[methodName](...argumentList);
        };
        
    //mapping
        [
            {function:'getAvailableShapes', arguments:[]},
            {function:'getProxyableShapeMethods', arguments:['type']},
        
            {function:'createShape', arguments:['type','name']},
            {function:'deleteShape', arguments:['id']},
            {function:'deleteAllCreatedShapes', arguments:[]},
            {function:'getCreatedShapes', arguments:[]},
            {function:'getShapeTypeById', arguments:['id']},
            {function:'executeShapeMethod', arguments:['id','methodName','arguments']},
        ].forEach( method => {
            communicationModule.function['shape.'+method.function] = new Function( ...(method.arguments.concat('return shape.'+method.function+'('+method.arguments.join(',')+');')) );
        });
};
const arrangement = new function(){
    //scene
        const scene = shape.createShape_raw('group','root');
        this.new = function(){
            dev.log('arrangement','.new()');
            scene.clear();
        };
        this.getChildren = function(){
            dev.log('arrangement','.getChildren()');
            return scene.children();
        };
        this.getChildByName = function(name){
            dev.log('arrangement','.getChildByName('+name+')');
            return scene.getChildByName(name);
        };
        this.prepend = function(id){
            dev.log('arrangement','.prepend('+id+')');
            scene.prepend(id);
        };
        this.append = function(id){
            dev.log('arrangement','.append('+id+')');
            scene.append(id);
        };
        this.remove = function(id){
            dev.log('arrangement','.remove('+id+')');
            scene.remove(id);
        };
        this.getElementByAddress = function(address){
            dev.log('arrangement','.getElementByAddress('+address+')');

            var route = address.split('/');
            route.shift(); route.shift();
    
            var currentObject = scene;
            route.forEach(function(a){
                currentObject = shape.getShapeById(currentObject.getChildByName(a));
            });
    
            return shape.getIdFromShape(currentObject);
        };
        this.getElementsUnderPoint = function(x,y){
            dev.log('arrangement','.getElementsUnderPoint('+x+','+y+')');
            return scene.getElementsUnderPoint(x,y);
        };
        this.getElementsUnderArea = function(points){
            dev.log('arrangement','.getElementsUnderArea('+points+')');
            return scene.getElementsUnderArea(points);
        };
        this.printTree = function(mode='spaced'){//modes: spaced / tabular / address
            dev.log('arrangement','.printTree('+mode+')');
             
            function recursivePrint(grouping,prefix=''){
                grouping.children.forEach(function(a){
                    if(mode == 'spaced'){
                        console.log(prefix+'- '+a.type +': '+ a.name);
                        if(a.type == 'group'){ recursivePrint(a, prefix+'- ') }
                    }else if(mode == 'tabular'){
                        console.log(prefix+'- \t'+a.type +': '+ a.name);
                        if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                    }else if(mode == 'address'){
                        console.log(prefix+'/'+a.type +':'+ a.name);
                        if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                    }
                });
            }

            recursivePrint(scene.getTree(), '');
        };

    //rendering
        this.getScene = function(){ return scene };
        
    //mapping
        [
            {function:'new', arguments:[]},
            {function:'getChildren',arguments:[]},
            {function:'getChildByName',arguments:['name']},
            {function:'get', arguments:[]},
            {function:'set', arguments:[]},
            {function:'prepend', arguments:['id']},
            {function:'append', arguments:['id']},
            {function:'remove', arguments:['id']},
            {function:'getElementByAddress', arguments:['address']},
            {function:'getElementsUnderPoint', arguments:['x','y']},
            {function:'getElementsUnderArea', arguments:['points']},
            {function:'printTree', arguments:['mode']},
        ].forEach( method => {
            communicationModule.function['arrangement.'+method.function] = new Function( ...(method.arguments.concat('return arrangement.'+method.function+'('+method.arguments.join(',')+');')) );
        });
};
const render = new function(){
    const pageData = {
        defaultCanvasSize:{width:800, height:600},
        currentCanvasSize:{width:800, height:600},
        devicePixelRatio:1,
    };
    const canvas = new OffscreenCanvas(pageData.defaultCanvasSize.width, pageData.defaultCanvasSize.height);
    const context = canvas.getContext("webgl2", {alpha:false, preserveDrawingBuffer:true, stencil:true});
    let animationRequestId = undefined;
    let clearColour = {r:1,g:1,b:1,a:1};

    //webGL setup
        context.enable(context.BLEND);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

    //webGL program production
        let storedPrograms = {};
        this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource){
            dev.log('render','.produceProgram("'+name+'",'+vertexShaderSource+','+fragmentShaderSource+')');
            function compileProgram(vertexShaderSource, fragmentShaderSource){
                function createShader(type, source){
                    let shader = context.createShader(type);
                    context.shaderSource(shader, source);
                    context.compileShader(shader);
                    let success = context.getShaderParameter(shader, context.COMPILE_STATUS);
                    if(success){ return shader; }
            
                    console.error('major error in core\'s "'+ type +'" shader creation');
                    console.error(context.getShaderInfoLog(shader));
                    context.deleteShader(shader);
                }

                let program = context.createProgram();
                context.attachShader(program, createShader(context.VERTEX_SHADER,vertexShaderSource) );
                context.attachShader(program, createShader(context.FRAGMENT_SHADER,fragmentShaderSource) );
                context.linkProgram(program);
                let success = context.getProgramParameter(program, context.LINK_STATUS);
                if(success){ return program; }
            
                console.error('major error in core\'s program creation');
                console.error(context.getProgramInfoLog(program));
                context.deleteProgram(program);
            };

            if( !(name in storedPrograms) ){
                storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                context.useProgram(storedPrograms[name]);
            }

            return storedPrograms[name];
        };

    //canvas and webGL context adjustment
        this.clearColour = function(colour){
            dev.log('render','.clearColour('+JSON.stringify(colour)+')');
            if(colour == undefined){ return clearColour; }
            clearColour = colour;
            context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            dev.log('render','.adjustCanvasSize('+newWidth+','+newHeight+')');
            let changesMade = false;

            //request canvas data from the console, if none is provided in arguments
            // -> argument data > requested data > default data
            //(request portion currently missing)
            function func(direction,newValue){
                if(newValue != undefined){
                    if(pageData.currentCanvasSize[direction] != newValue){
                        pageData.currentCanvasSize[direction] = newValue;
                        canvas[direction] = pageData.currentCanvasSize[direction];
                        return true;
                    }
                }else{
                    if(pageData.currentCanvasSize[direction] != pageData.defaultCanvasSize[direction]){
                        pageData.currentCanvasSize[direction] = pageData.defaultCanvasSize[direction];
                        canvas[direction] = pageData.currentCanvasSize[direction];
                        return true;
                    }
                }
                return false;
            }
            changesMade = func('width',newWidth) || func('height',newHeight);

            return changesMade;
        };
        this.refreshCoordinates = function(){
            dev.log('render','.refreshCoordinates()');
            let w = context.canvas.width;
            let h = context.canvas.height;

            let x, y, width, height = 0;
            if(pageData.devicePixelRatio == 1){
                x = 0;
                y = 0;
                width = w;
                height = h;
            }else{
                x = 0;
                y = -h;
                width = w*2;
                height = h*2;
            }

            context.viewport(x, y, width, height);
        };
        this.refresh = function(){
            dev.log('render','.refresh()');
            this.clearColour(clearColour);
            this.adjustCanvasSize();
            this.refreshCoordinates();
            this.frameRateLimit(this.frameRateLimit());
        };

    //frame rate control
        const frameRateControl = {active:false, previousRenderTime:Date.now(), limit:30, interval:0};
        this.activeLimitToFrameRate = function(a){
            dev.log('render','.activeLimitToFrameRate('+a+')');
            if(a==undefined){return frameRateControl.active;}
            frameRateControl.active=a
        };
        this.frameRateLimit = function(a){
            dev.log('render','.frameRateLimit('+a+')');
            if(a==undefined){ return frameRateControl.limit; }
            frameRateControl.limit=a;
            frameRateControl.interval=1000/frameRateControl.limit;
        };

    //actual render
        function renderFrame(){
            dev.log('render','::renderFrame()');
            context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
            arrangement.getScene().render(context,{x:0,y:0,scale:1,angle:0});
            const transferableImage = canvas.transferToImageBitmap();
            communicationModule.run('printToScreen',[transferableImage],undefined,[transferableImage]);
        }
        function animate(timestamp){
            dev.log('render','::animate('+timestamp+')');
            animationRequestId = requestAnimationFrame(animate);

            //limit frame rate
                if(frameRateControl.active){
                    let currentRenderTime = Date.now();
                    let delta = currentRenderTime - frameRateControl.previousRenderTime;
                    if(delta < frameRateControl.interval){ return; }
                    frameRateControl.previousRenderTime = currentRenderTime - delta%frameRateControl.interval;
                }

            //attempt to render frame, if there is a failure; stop animation loop and report the error
                try{
                    renderFrame();
                }catch(error){
                    core.render.active(false);
                    console.error('major animation error');
                    console.error(error);
                }

            //perform stats collection
                core.stats.collect(timestamp);
        }
        this.frame = function(noClear=false){dev.log('render','.frame('+noClear+')');renderFrame(noClear);};
        this.active = function(bool){
            dev.log('render','.active('+bool+')');
            if(bool == undefined){return animationRequestId!=undefined;}

            if(bool){
                if(animationRequestId != undefined){return;}
                animate();
            }else{
                if(animationRequestId == undefined){return;}
                cancelAnimationFrame(animationRequestId);
                animationRequestId = undefined;
            }
        };

    //misc
        this.getCanvasDimensions = function(){ return {width:pageData.currentCanvasSize.width, height:pageData.currentCanvasSize.height}; };
        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
            // let dot = core.shape.create('circle');
            // dot.name = 'core-drawDot-dot';
            // dot.stopAttributeStartedExtremityUpdate = true;
            // dot.dotFrame = false;
            // dot.x(x); dot.y(y);
            // dot.radius(r);
            // dot.computeExtremities();
            // dot.colour = colour;
            // dot.render(context);
        };
        this._dump = function(){
            dev.log('render','._dump()');
            dev.log('render','._dump -> pageData:'+JSON.stringify(pageData));
            dev.log('render','._dump -> storedPrograms:'+JSON.stringify(storedPrograms));
            dev.log('render','._dump -> frameRateControl:'+JSON.stringify(frameRateControl));
            dev.log('render','._dump -> clearColour:'+JSON.stringify(clearColour));
        };

    //mapping
        [
            {functionName:'clearColour',argumentList:['colour']},
            {functionName:'adjustCanvasSize',argumentList:['height','width']},
            {functionName:'refreshCoordinates',argumentList:[]},
            {functionName:'refresh',argumentList:[]},
            {functionName:'activeLimitToFrameRate',argumentList:['active']},
            {functionName:'frameRateLimit',argumentList:['limit']},
            {functionName:'frame',argumentList:[]},
            {functionName:'active',argumentList:['active']},
            {functionName:'getCanvasDimensions',argumentList:[]},
            {functionName:'drawDot',argumentList:['x','y','r','colour']},
            {functionName:'_dump',argumentList:[]},
        ].forEach( method => {
            communicationModule.function['render.'+method.functionName] = new Function( ...(method.argumentList.concat('return render.'+method.functionName+'('+method.argumentList.join(',')+');')) );
        });
};
render.refresh();
const viewport = new function(){
    const self = this;

    const state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
    };
    const viewbox = {
        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
    };
    const mouseData = { 
        x:undefined, 
        y:undefined, 
        stopScrollActive:false,
        clickVisibility:false,
    };

    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                dev.log('viewport','.adapter.windowPoint2workspacePoint('+x+','+y+')');
                const position = viewport.position();
                const scale = viewport.scale();
                const angle = viewport.angle();

                let tmp = {x:x, y:y};
                tmp.x = (tmp.x - position.x)/scale;
                tmp.y = (tmp.y - position.y)/scale;
                tmp = library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);

                return tmp;
            };
            // this.workspacePoint2windowPoint = function(x,y){
            //     let position = viewport.position();
            //     let scale = viewport.scale();
            //     let angle = viewport.angle();

            //     let point = library.math.cartesianAngleAdjust(x,y,angle);

            //     return {
            //         x: (point.x+position.x) * scale,
            //         y: (point.y+position.y) * scale
            //     };
            // };
        };

    //camera position
        this.position = function(x,y){
            dev.log('viewport','.position('+x+','+y+')');
            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
            state.position.x = x;
            state.position.y = y;

            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    dev.log('viewport','.position -> adjusting:',JSON.stringify(item));
                    item.stopAttributeStartedExtremityUpdate = true;
                    item.x(state.position.x); 
                    item.stopAttributeStartedExtremityUpdate = false;
                    item.y(state.position.y);
                }
            });

            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.scale = function(s){
            dev.log('viewport','.scale('+s+')');
            if(s == undefined){return state.scale;}
            state.scale = s <= 0 ? 1 : s;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    dev.log('viewport','.scale -> adjusting:',JSON.stringify(item));
                    item.scale(state.scale);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.angle = function(a){
            dev.log('viewport','.angle('+a+')');
            if(a == undefined){return state.angle;}
            state.angle = a;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    dev.log('viewport','.angle -> adjusting:',JSON.stringify(item));
                    item.angle(state.angle);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };

    //mouse interaction
        this.getElementUnderCanvasPoint = function(x,y){
            dev.log('viewport','.getElementUnderCanvasPoint('+x+','+y+')');
            let xy = this.adapter.windowPoint2canvasPoint(x,y);
            return arrangement.getElementUnderPoint(xy.x,xy.y);
        };
        this.getElementsUnderCanvasArea = function(points){
            dev.log('viewport','.getElementUnderCanvasPoint('+JSON.stringify(points)+')');
            return arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2canvasPoint(a.x,a.y)));
        };

    //misc
        function calculateViewportExtremities(){
            dev.log('viewport','::calculateViewportExtremities()');
            const canvasDimensions = render.getCanvasDimensions();

            //for each corner of the viewport; find out where they lie on the canvas
                viewbox.points.tl = {x:0, y:0};
                viewbox.points.tr = {x:canvasDimensions.width, y:0};
                viewbox.points.bl = {x:0, y:canvasDimensions.height};
                viewbox.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
            //calculate a bounding box for the viewport from these points
                viewbox.boundingBox = library.math.boundingBoxFromPoints([viewbox.points.tl, viewbox.points.tr, viewbox.points.br, viewbox.points.bl]);
        }
        this.calculateViewportExtremities = calculateViewportExtremities;
        this.refresh = function(){
            dev.log('viewport','.refresh()');
            render.refresh();
            calculateViewportExtremities();
        };
        this.getBoundingBox = function(){ dev.log('viewport','.getBoundingBox()'); return viewbox.boundingBox; };
        this.mousePosition = function(x,y){
            dev.log('viewport','.mousePosition('+x+','+y+')');
            if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
            mouseData.x = x;
            mouseData.y = y;
        };
        this.clickVisibility = function(a){ dev.log('viewport','.mousePosition('+a+')'); if(a==undefined){return mouseData.clickVisibility;} mouseData.clickVisibility=a; };
        this.getHeight = function(){ dev.log('viewport','.getHeight()'); return viewbox.points.br.y - viewbox.points.tl.y; };        
        this.getWidth= function(){ dev.log('viewport','.getWidth()'); return viewbox.points.br.x - viewbox.points.tl.x; };
        this._dump = function(){
            dev.log('viewport','._dump()');
            dev.log('viewport','._dump -> state:'+JSON.stringify(state));
            dev.log('viewport','._dump -> viewbox:'+JSON.stringify(viewbox));
            dev.log('viewport','._dump -> mouseData:'+JSON.stringify(mouseData));
        };

    //callback
        this.onCameraAdjust = function(state){};

    //mapping
        [
            {functionName:'position',argumentList:['x','y']},
            {functionName:'scale',argumentList:['s']},
            {functionName:'angle',argumentList:['a']},
            {functionName:'getElementUnderCanvasPoint',argumentList:['x','y']},
            {functionName:'getElementsUnderCanvasArea',argumentList:['points']},
            {functionName:'mousePosition',argumentList:['x','y']},
            {functionName:'clickVisibility',argumentList:['a']},
            {functionName:'getHeight',argumentList:[]},
            {functionName:'getWidth',argumentList:[]},
            {functionName:'_dump',argumentList:[]},
        ].forEach( method => {
            communicationModule.function['viewport.'+method.functionName] = new Function( ...(method.argumentList.concat('return viewport.'+method.functionName+'('+method.argumentList.join(',')+');')) );
        });
};
viewport.refresh();

communicationModule.function['ready'] = function(){return true;};
