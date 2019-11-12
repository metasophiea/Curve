const communicationModuleMaker = function(communicationObject,callerName){
    const self = this;
    const devMode = false;
    this.log = function(){
        if(!devMode){return;}
        let prefix = 'communicationModule['+callerName+']';
        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
    };
    this.function = {};
    this.delayedFunction = {};

    let messageId = 0;
    const messagingCallbacks = {};

    function generateMessageID(){
        self.log('::generateMessageID()'); //#development
        return messageId++;
    }

    communicationObject.onmessage = function(encodedPacket){
        self.log('::communicationObject.onmessage('+JSON.stringify(encodedPacket)+')'); //#development
        let message = encodedPacket.data;

        if(message.outgoing){
            self.log('::communicationObject.onmessage -> message is an outgoing one'); //#development
            if(message.cargo.function in self.function){
                self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" found'); //#development
                self.log('::communicationObject.onmessage -> function arguments: '+JSON.stringify(message.cargo.arguments)); //#development
                if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                if(message.id == null){
                    self.log('::communicationObject.onmessage -> message ID missing; will not return any data'); //#development
                    self.function[message.cargo.function](...message.cargo.arguments);
                }else{
                    self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data'); //#development
                    communicationObject.postMessage({
                        id:message.id,
                        outgoing:false,
                        cargo:self.function[message.cargo.function](...message.cargo.arguments),
                    });
                }
            }else if(message.cargo.function in self.delayedFunction){
                self.log('::communicationObject.onmessage -> delayed function "'+message.cargo.function+'" found'); //#development
                self.log('::communicationObject.onmessage -> delayed function arguments: '+JSON.stringify(message.cargo.arguments)); //#development
                if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                if(message.id == null){
                    self.log('::communicationObject.onmessage -> message ID missing; will not return any data'); //#development
                    self.delayedFunction[message.cargo.function](...message.cargo.arguments);
                }else{
                    self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data'); //#development
                    cargo:self.delayedFunction[message.cargo.function](...[function(returnedData){
                        communicationObject.postMessage({ id:message.id, outgoing:false, cargo:returnedData });
                    }].concat(message.cargo.arguments));
                }
            }else{
                self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" not found'); //#development
            }
        }else{
            self.log('::communicationObject.onmessage -> message is an incoming one'); //#development
            self.log('::communicationObject.onmessage -> message ID: '+message.id+' cargo: '+JSON.stringify(message.cargo)); //#development
            messagingCallbacks[message.id](message.cargo);
            delete messagingCallbacks[message.id];
        }
    };
    this.run = function(functionName,argumentList=[],callback,transferables){
        self.log('.run('+functionName+','+JSON.stringify(argumentList)+','+callback+','+JSON.stringify(transferables)+')'); //#development
        let id = null;
        if(callback != undefined){
            self.log('.run -> callback was defined; generating message ID'); //#development
            id = generateMessageID();
            self.log('.run -> message ID:',id); //#development
            messagingCallbacks[id] = callback;
        }
        communicationObject.postMessage({ id:id, outgoing:true, cargo:{function:functionName,arguments:argumentList} },transferables);
    };
};
const communicationModule = new communicationModuleMaker(this,'core_engine');

const library = {
    math:{
        averageArray: function(array){
            dev.log.library('math','.averageArray('+JSON.stringify(array)+')'); //#development
            // return array.reduce( ( p, c ) => p + c, 0 ) / array.length
        
            //this seems to be a little faster
            let sum = array[0];
            for(let a = 1; a < array.length; a++){ sum += array[a]; }
            return sum/array.length;
        },
        cartesianAngleAdjust: function(x,y,angle){
            dev.log.library('math','.cartesianAngleAdjust('+x+','+y+','+angle+')'); //#development
            if(angle == 0){ return {x:x,y:y}; }
            return { x:x*Math.cos(angle) - y*Math.sin(angle), y:y*Math.cos(angle) + x*Math.sin(angle) };
        },
        boundingBoxFromPoints: function(points){
            dev.log.library('math','.boundingBoxFromPoints('+JSON.stringify(points)+')'); //#development
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
                dev.log.library('math','.detectOverlap.boundingBoxes('+JSON.stringify(a)+','+JSON.stringify(b)+')'); //#development
                return a.bottomRight.y >= b.topLeft.y && 
                    a.bottomRight.x >= b.topLeft.x && 
                    a.topLeft.y <= b.bottomRight.y && 
                    a.topLeft.x <= b.bottomRight.x;
            };
            this.pointWithinBoundingBox = function(point,box){
                dev.log.library('math','.detectOverlap.pointWithinBoundingBox('+JSON.stringify(point)+','+JSON.stringify(box)+')'); //#development
                return !(
                    point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
                    point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
                );
            };
            this.pointWithinPoly = function(point,points){
                dev.log.library('math','.detectOverlap.pointWithinPoly('+JSON.stringify(point)+','+JSON.stringify(points)+')'); //#development
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
                dev.log.library('math','.detectOverlap.lineSegments('+JSON.stringify(segment1)+','+JSON.stringify(segment2)+')'); //#development
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
                dev.log.library('math','.detectOverlap.overlappingPolygons('+JSON.stringify(points_a)+','+JSON.stringify(points_b)+')'); //#development
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
                dev.log.library('math','.detectOverlap.overlappingPolygonWithPolygons('+JSON.stringify(poly)+','+JSON.stringify(polys)+')'); //#development
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
                dev.log.library('math','.detectOverlap::overlappingLineWithPolygon('+JSON.stringify(line)+','+JSON.stringify(poly)+')'); //#development
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
                dev.log.library('math','.detectOverlap.overlappingLineWithPolygons('+JSON.stringify(line)+','+JSON.stringify(polys)+')'); //#development
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
        getDifferenceOfArrays: function(array_a,array_b){
            dev.log.library('math','.getDifferenceOfArrays('+array_a+','+array_b+')'); //#development
            function arrayRemovals(a,b){
                a.forEach(item => {
                    var i = b.indexOf(item);
                    if(i != -1){ b.splice(i,1); }
                });
                return b;
            }
        
            return {
                a:arrayRemovals(array_b,array_a.slice()),
                b:arrayRemovals(array_a,array_b.slice())
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
    library:{active:!true,fontStyle:'color:rgb(87, 161, 80); font-style:italic;'},
    element:{active:!true,fontStyle:'color:rgb(161, 145, 80); font-style:italic;'},
    elementLibrary:{active:!true,fontStyle:'color:rgb(129, 80, 161); font-style:italic;'},
    arrangement:{active:!true,fontStyle:'color:rgb(80, 161, 141); font-style:italic;'},
    render:{active:!true,fontStyle:'color:rgb(161, 84, 80); font-style:italic;'},
    viewport:{active:!true,fontStyle:'color:rgb(80, 134, 161); font-style:italic;'},
    stats:{active:!true,fontStyle:'color:rgb(87, 80, 161); font-style:italic;'},
    callback:{active:!true,fontStyle:'color:rgb(122, 163, 82); font-style:italic;'},

    log:{
        library:function(subSection,data){
            if(!dev.library.active){return;}
            console.log('%c'+'core_engine.library.'+subSection+(new Array(...arguments).slice(1).join(' ')), dev.library.fontStyle );
        },
        element:function(data){
            if(!dev.element.active){return;}
            console.log('%c'+'core_engine.element'+(new Array(...arguments).join(' ')), dev.element.fontStyle );
        },
        elementLibrary:function(elementType,address,data){
            if(!dev.elementLibrary.active){return;}
            console.log('%c'+'core_engine.elementLibrary.'+elementType+'['+address+']'+(new Array(...arguments).slice(2).join(' ')), dev.elementLibrary.fontStyle );
        },
        arrangement:function(data){
            if(!dev.arrangement.active){return;}
            console.log('%c'+'core_engine.arrangement'+(new Array(...arguments).join(' ')), dev.arrangement.fontStyle );
        },
        render:function(data){
            if(!dev.render.active){return;}
            console.log('%c'+'core_engine.render'+(new Array(...arguments).join(' ')), dev.render.fontStyle );
        },
        viewport:function(data){
            if(!dev.viewport.active){return;}
            console.log('%c'+'core_engine.viewport'+(new Array(...arguments).join(' ')), dev.viewport.fontStyle );
        },
        stats:function(data){
            if(!dev.stats.active){return;}
            console.log('%c'+'core_engine.stats'+(new Array(...arguments).join(' ')), dev.stats.fontStyle );
        },
        callback:function(data){
            if(!dev.callback.active){return;}
            console.log('%c'+'core_engine.callback'+(new Array(...arguments).join(' ')), dev.callback.fontStyle );
        },
    },
};
const report = {
    info:function(){ console.log(...['core_engine.report.info:'].concat(...new Array(...arguments))); },
    warning:function(){ console.warn(...['core_engine.report.warning:'].concat(...new Array(...arguments))); },
    error:function(){ console.error(...['core_engine.report.error:'].concat(...new Array(...arguments))); },
};

const element = new function(){
    //element library
        const elementLibrary = new function(){
            this.group = function(name,_id){
                const self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'group'; 
                        this.getType = function(){return type;}
                        const id = _id; 
                        this.getId = function(){return id;}
            
                    //simple attributes
                        this.name = name;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        let ignored = false;
                        this.ignored = function(a){
                            if(a==undefined){return ignored;}     
                            ignored = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.ignored('+a+')'); //#development
                            computeExtremities();
                        };
                    
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
                            dev.log.elementLibrary(type,self.getAddress(),'.x('+a+')'); //#development
                            computeExtremities();
                        };
                        this.y = function(a){ 
                            if(a==undefined){return y;}     
                            y = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.y('+a+')'); //#development
                            computeExtremities();
                        };
                        this.angle = function(a){ 
                            if(a==undefined){return angle;} 
                            angle = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.angle('+a+')'); //#development
                            computeExtremities();
                        };
                        this.scale = function(a){ 
                            if(a==undefined){return scale;} 
                            scale = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.scale('+a+')'); //#development
                            computeExtremities();
                        };
                        this.heedCamera = function(a){
                            if(a==undefined){return heedCamera;}     
                            heedCamera = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.heedCamera('+a+')'); //#development
                            computeExtremities();
                        };
                        this.static = function(a){
                            if(a==undefined){return static;}  
                            static = a;  
                            dev.log.elementLibrary(type,self.getAddress(),'.static('+a+')'); //#development
                            computeExtremities();
                        };
                        this.unifiedAttribute = function(attributes){
                            if(attributes==undefined){ return {x:x, y:y, angle:angle, scale:scale, ignored:ignored, heedCamera:heedCamera, static:static}; } 
                            dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
            
                            if('ignored' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "ignored" to '+attributes.ignored); //#development
                                ignored = attributes.ignored;
                            }
            
                            if('x' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "x" to '+attributes.x); //#development
                                x = attributes.x;
                            }
                            if('y' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "y" to '+attributes.y); //#development
                                y = attributes.y;
                            }
                            if('angle' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "angle" to '+attributes.angle); //#development
                                angle = attributes.angle;
                            }
                            if('scale' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "scale" to '+attributes.scale); //#development
                                scale = attributes.scale;
                            }
                            if('heedCamera' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "heedCamera" to '+attributes.heedCamera); //#development
                                scale = attributes.heedCamera;
                            }
                            if('static' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "static" to '+attributes.static); //#development
                                scale = attributes.static;
                            }
            
                            computeExtremities();
                        };
            
                //addressing
                    this.getAddress = function(){
                        return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name;
                    };
            
                //group functions
                    let children = []; 
                    let childRegistry = {};
            
                    function getChildByName(name){ return childRegistry[name]; }
                    function checkForName(name){ return childRegistry[name] != undefined; }
                    function checkForElement(element){ return children.find(a => a == element); }
                    function isValidElement(element){
                        if( element == undefined ){ return false; }
                        if( element.name.length == 0 ){
                            console.warn('group error: element with no name being inserted into group "'+self.getAddress()+'", therefore; the element will not be added');
                            return false;
                        }
                        if( checkForName(element.name) ){
                            console.warn('group error: element with name "'+element.name+'" already exists in group "'+self.getAddress()+'", therefore; the element will not be added');
                            return false;
                        }
            
                        return true;
                    }
            
                    this.children = function(){return children;};
                    this.getChildByName = function(name){return getChildByName(name);};
                    this.getChildIndexByName = function(name){return children.indexOf(children.find(a => a.name == name)); };
                    this.contains = checkForElement;
                    this.append = function(element){
                        dev.log.elementLibrary(type,self.getAddress(),'.append('+JSON.stringify(element)+')'); //#development
            
                        if( !isValidElement(element) ){ return; }
            
                        children.push(element); 
                        element.parent = this;
                        augmentExtremities_add(element);
            
                        childRegistry[element.name] = element;
                        if(element.onadd != undefined){element.onadd(false);}
                    };
                    this.prepend = function(element){
                        dev.log.elementLibrary(type,self.getAddress(),'.prepend('+JSON.stringify(element)+')'); //#development
            
                        if( !isValidElement(element) ){ return; }
            
                        children.unshift(element); 
                        element.parent = this;
                        augmentExtremities_add(element);
            
                        childRegistry[element.name] = element;
                        if(element.onadd != undefined){element.onadd(true);}
                    };
                    this.remove = function(element){
                        dev.log.elementLibrary(type,self.getAddress(),'.remove('+JSON.stringify(element)+')'); //#development
                        if(element == undefined){return;}
                        if(element.onremove != undefined){element.onremove();}
                        children.splice(children.indexOf(element), 1);
                        augmentExtremities_remove(element);
            
                        element.parent = undefined;
                        delete childRegistry[element.name];
                    };
                    this.clear = function(){ children = []; childRegistry = {} };
                    this.getElementsUnderPoint = function(x,y){
                        dev.log.elementLibrary(type,self.getAddress(),'.getElementsUnderPoint('+x+','+y+')'); //#development
            
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
            
                        return returnList;
                    };
                    this.getElementsUnderArea = function(points){
                        dev.log.elementLibrary(type,self.getAddress(),'.getElementsUnderArea('+points+')'); //#development
            
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
            
                        return returnList;
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
                    this.stencil = function(element){
                        if(element == undefined){return clipping.stencil;}
                        dev.log.elementLibrary(type,self.getAddress(),'.stencil('+JSON.stringify(element)+')'); //#development
                        clipping.stencil = element;
                        clipping.stencil.parent = this;
                        if(clipping.active){ computeExtremities(); }
                    };
                    this.clipActive = function(bool){
                        if(bool == undefined){return clipping.active;}
                        dev.log.elementLibrary(type,self.getAddress(),'.clipActive('+bool+')'); //#development
                        clipping.active = bool;
                        computeExtremities();
                    };
            
                //extremities
                    function calculateExtremitiesBox(){
                        dev.log.elementLibrary(type,self.getAddress(),'::calculateExtremitiesBox()'); //#development
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
            
                        //generate extremity points
                            self.extremities.points = [];
            
                            //if clipping is active and possible, the extremities of this group are limited to those of the clipping element
                            //otherwise, gather extremities from children and calculate extremities here
                            if(clipping.active && clipping.stencil != undefined){
                                self.extremities.points = clipping.stencil.extremities.points.slice();
                            }else{
                                calculateExtremitiesBox();
                            }
                            dev.log.elementLibrary(type,self.getAddress(),'::updateExtremities -> extremities.points.length: '+self.extremities.points.length); //#development
            
                        //generate bounding box from points
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
            
                        //update parent
                            if(informParent){ if(self.parent){self.parent.updateExtremities();} }
                    }
                    function augmentExtremities(element){
                        dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities('+JSON.stringify(element)+')'); //#development
            
                        //get offset from parent
                            var offset = self.parent && !self.static() ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            element.computeExtremities(false,newOffset);
                        //augment points list
                            calculateExtremitiesBox();
                            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities -> extremities.points.length: '+self.extremities.points.length); //#development
                        //recalculate bounding box
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function computeExtremities(informParent=true,offset){
                        dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities('+informParent+','+JSON.stringify(offset)+')'); //#development
                        
                        //get offset from parent, if one isn't provided
                            if(offset == undefined){ offset = self.parent && !self.static() ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
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
                    function augmentExtremities_add(element){
                        dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_add('+JSON.stringify(element)+')'); //#development
            
                        //get offset from parent
                            var offset = self.parent && !self.static() ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            var point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            var newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            element.computeExtremities(false,newOffset);
            
                        //augment points list
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints( self.extremities.points.concat(element.extremities.points) );
                            self.extremities.points = [
                                { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.topLeft.y },
                                { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.topLeft.y },
                                { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.bottomRight.y },
                                { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.bottomRight.y },
                            ];
            
                            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_add -> extremities.points.length: '+self.extremities.points.length); //#development
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function augmentExtremities_remove(element){
                        dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove('+JSON.stringify(element)+')'); //#development
                        //this function assumes that the element has already been removed from the 'children' variable)
                        //is the element's bounding box within the bounding box of the group; if so, no recalculation need be done
                        //otherwise the element is touching the boundary, in which case search through the children for another 
                        //element that also touches the boundary, or find the closest element and adjust the boundary to touch that
            
                        var data = {
                            topLeft:{
                                x: self.extremities.boundingBox.topLeft.x - element.extremities.boundingBox.topLeft.x,
                                y: self.extremities.boundingBox.topLeft.y - element.extremities.boundingBox.topLeft.y,
                            },
                            bottomRight:{
                                x: element.extremities.boundingBox.bottomRight.x - self.extremities.boundingBox.bottomRight.x,
                                y: element.extremities.boundingBox.bottomRight.y - self.extremities.boundingBox.bottomRight.y,
                            }
                        };
                        if( data.topLeft.x != 0 && data.topLeft.y != 0 && data.bottomRight.x != 0 && data.bottomRight.y != 0 ){
                            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove -> easy remove: no changes to the group\'s bounding box required'); //#development
                            return;
                        }else{
                            ['topLeft','bottomRight'].forEach(cornerName => {
                                ['x','y'].forEach(axisName => {
                                    if(data[cornerName][axisName] == 0){
                                        dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove -> '+cornerName+'_'+axisName+' is at boundary'); //#development
            
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
                                            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove -> need to adjust the bounding box'); //#development
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
                        dev.log.elementLibrary(type,self.getAddress(),'.render(-context-,'+JSON.stringify(offset)+')'); //#development
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
                            children.forEach(function(a){
                                dev.log.elementLibrary(type,self.getAddress(),'.render -> '+JSON.stringify(clipping.active ? self.extremities.boundingBox : viewport.getBoundingBox())+' / '+JSON.stringify(a.extremities.boundingBox)); //#development
                                if(
                                    library.math.detectOverlap.boundingBoxes(
                                        clipping.active ? self.extremities.boundingBox : viewport.getBoundingBox(),
                                        a.extremities.boundingBox
                                    )
                                ){ 
                                    dev.log.elementLibrary(type,self.getAddress(),'.render -> rendering shape: '+a.name); //#development
                                    a.render(context,newOffset);
                                }else{
                                    dev.log.elementLibrary(type,self.getAddress(),'.render -> not rendering shape: '+a.name); //#development
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
            
                //info dump
                    this._dump = function(){
                        report.info(self.getAddress(),'._dump()');
                        report.info(self.getAddress(),'._dump -> id: '+id);
                        report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
                        report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
                        report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
                        report.info(self.getAddress(),'._dump -> ignored: '+ignored);
                        report.info(self.getAddress(),'._dump -> x: '+x);
                        report.info(self.getAddress(),'._dump -> y: '+y);
                        report.info(self.getAddress(),'._dump -> angle: '+angle);
                        report.info(self.getAddress(),'._dump -> scale: '+scale);
                        report.info(self.getAddress(),'._dump -> heedCamera: '+heedCamera);
                        report.info(self.getAddress(),'._dump -> static: '+static);
                        report.info(self.getAddress(),'._dump -> children: '+JSON.stringify(children));
                        report.info(self.getAddress(),'._dump -> childRegistry: '+JSON.stringify(childRegistry));
                        report.info(self.getAddress(),'._dump -> clipping: '+JSON.stringify(clipping));
                    };
                
                //interface
                    this.interface = new function(){
                        this.ignored = self.ignored;
                        this.x = self.x;
                        this.y = self.y;
                        this.angle = self.angle;
                        this.scale = self.scale;
                        this.heedCamera = self.heedCamera;
                        this.static = self.static;
                        this.unifiedAttribute = self.unifiedAttribute;
            
                        this.getAddress = self.getAddress;
            
                        this.children = function(){ return self.children().map(e => element.getIdFromElement(e)) };
                        this.getChildByName = function(name){ return element.getIdFromElement(self.getChildByName(name)); };
                        this.getChildIndexByName = self.getChildIndexByName;
                        this.contains = function(elementId){ return self.contains(element.getElementFromId(elementId)); };
                        this.append = function(elementId){ return self.append(element.getElementFromId(elementId)); };
                        this.prepend = function(elementId){ return self.prepend(element.getElementFromId(elementId)); };
                        this.remove = function(elementId){ return self.remove(element.getElementFromId(elementId)); };
                        this.clear = self.clear;
                        this.getElementsUnderPoint = function(x,y){ return element.getIdFromElement(self.getElementsUnderPoint(x,y)); };
                        this.getElementsUnderArea = function(points){ return element.getIdFromElement(self.getElementsUnderArea(points)); };
                        this.getTree = self.getTree;
                        this.stencil = self.stencil;
                        this.clipActive = self.clipActive;
            
                        this._dump = self._dump;
                    };
            };
            this.rectangle = function(name,_id){
                const self = this;
            
                //attributes 
                    //protected attributes
                        const type = 'rectangle'; 
                        this.getType = function(){return type;}
                        const id = _id; 
                        this.getId = function(){return id;}
            
                    //simple attributes
                        this.name = name;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        let ignored = false;
                        this.ignored = function(a){
                            if(a==undefined){return ignored;}     
                            ignored = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.ignored('+a+')'); //#development
                            computeExtremities();
                        };
                        let colour = {r:1,g:0,b:0,a:1};
                        this.colour = function(a){
                            if(a==undefined){return colour;}     
                            colour = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.colour('+JSON.stringify(a)+')'); //#development
                            computeExtremities();
                        };
                    
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
                            dev.log.elementLibrary(type,self.getAddress(),'.x('+a+')'); //#development
                            computeExtremities();
                        };
                        this.y = function(a){ 
                            if(a==undefined){return y;}     
                            y = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.y('+a+')'); //#development
                            computeExtremities();
                        };
                        this.angle = function(a){ 
                            if(a==undefined){return angle;} 
                            angle = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.angle('+a+')'); //#development
                            computeExtremities();
                        };
                        this.anchor = function(a){
                            if(a==undefined){return anchor;} 
                            anchor = a; 
                            dev.log.elementLibrary(type,self.getAddress(),'.anchor('+JSON.stringify(a)+')'); //#development
                            computeExtremities();
                        };
                        this.width = function(a){
                            if(a==undefined){return width;}  
                            width = a;  
                            dev.log.elementLibrary(type,self.getAddress(),'.width('+a+')'); //#development
                            computeExtremities();
                        };
                        this.height = function(a){
                            if(a==undefined){return height;} 
                            height = a; 
                            dev.log.elementLibrary(type,self.getAddress(),'.height('+a+')'); //#development
                            computeExtremities();
                        };
                        this.scale = function(a){ 
                            if(a==undefined){return scale;} 
                            scale = a;
                            dev.log.elementLibrary(type,self.getAddress(),'.scale('+a+')'); //#development
                            computeExtremities();
                        };
                        this.static = function(a){
                            if(a==undefined){return static;}  
                            static = a;  
                            dev.log.elementLibrary(type,self.getAddress(),'.static('+a+')'); //#development
                            computeExtremities();
                        };
                        this.unifiedAttribute = function(attributes){
                            if(attributes==undefined){ return {x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, ignored:ignored, colour:colour, static:static}; } 
                            dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
            
                            if('ignored' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "ignored" to '+attributes.ignored); //#development
                                ignored = attributes.ignored;
                            }
                            if('colour' in attributes){
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "colour" to '+attributes.colour); //#development
                                colour = attributes.colour;
                            }
            
                            if('x' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "x" to '+attributes.x); //#development
                                x = attributes.x;
                            }
                            if('y' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "y" to '+attributes.y); //#development
                                y = attributes.y;
                            }
                            if('angle' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "angle" to '+attributes.angle); //#development
                                angle = attributes.angle;
                            }
                            if('anchor' in attributes){
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "anchor" to '+attributes.anchor); //#development
                                anchor = attributes.anchor;
                            }
                            if('width' in attributes){
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "width" to '+attributes.width); //#development
                                width = attributes.width;
                            }
                            if('height' in attributes){
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "height" to '+attributes.height); //#development
                                height = attributes.height;
                            }
                            if('scale' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "scale" to '+attributes.scale); //#development
                                scale = attributes.scale;
                            }
                            if('static' in attributes){ 
                                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "static" to '+attributes.static); //#development
                                scale = attributes.static;
                            }
            
                            computeExtremities();
                        };
            
                //addressing
                    this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };
            
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
                        dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes(-context-,'+JSON.stringify(adjust)+')'); //#development
            
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
            
                            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
                            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
                            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
                            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> '+context.canvas.width+' '+context.canvas.height); //#development
                            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> width:'+width+' height:'+height); //#development
                            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> anchor.x:'+anchor.x+' anchor.y:'+anchor.y); //#development
                            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> colour:'+JSON.stringify(colour)); //#development
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
                        dev.log.elementLibrary(type,self.getAddress(),'::activateGLRender(-context-,'+JSON.stringify(adjust)+')'); //#development
                        if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                    }
            
                //extremities
                    function computeExtremities(informParent=true,offset){
                        dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities('+informParent+','+JSON.stringify(offset)+')'); //#development
                        
                        //get offset from parent, if one isn't provided
                            if(offset == undefined){ offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        //calculate adjusted offset based on the offset
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> point'+JSON.stringify(point)); //#development
                            let adjusted = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: -(offset.angle + angle),
                            };
                            dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> adjusted'+JSON.stringify(adjusted)); //#development
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
                            dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> self.extremities.points:'+JSON.stringify(self.extremities.points)); //#development
                            dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> self.extremities.boundingBox:'+JSON.stringify(self.extremities.boundingBox)); //#development
                    
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
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                        dev.log.elementLibrary(type,self.getAddress(),'.render(-context-,'+JSON.stringify(offset)+')'); //#development
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
            
                //info dump
                    this._dump = function(){
                        report.info(self.getAddress(),'._dump()');
                        report.info(self.getAddress(),'._dump -> id: '+id);
                        report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
                        report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
                        report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
                        report.info(self.getAddress(),'._dump -> ignored: '+ignored);
                        report.info(self.getAddress(),'._dump -> colour: '+JSON.stringify(colour));
                        report.info(self.getAddress(),'._dump -> x: '+x);
                        report.info(self.getAddress(),'._dump -> y: '+y);
                        report.info(self.getAddress(),'._dump -> angle: '+angle);
                        report.info(self.getAddress(),'._dump -> anchor: '+JSON.stringify(anchor));
                        report.info(self.getAddress(),'._dump -> width: '+width);
                        report.info(self.getAddress(),'._dump -> height: '+height);
                        report.info(self.getAddress(),'._dump -> scale: '+scale);
                        report.info(self.getAddress(),'._dump -> static: '+static);
                    };
                
                //interface
                    this.interface = new function(){
                        this.ignored = self.ignored;
                        this.colour = self.colour;
                        this.x = self.x;
                        this.y = self.y;
                        this.angle = self.angle;
                        this.angle = self.angle;
                        this.anchor = self.anchor;
                        this.width = self.width;
                        this.scale = self.scale;
                        this.static = self.static;
                        this.unifiedAttribute = self.unifiedAttribute;
            
                        this.getAddress = self.getAddress;
            
                        this._dump = self._dump;
                    };
            };
        };
        this.getAvailableElements = function(){ 
            dev.log.element('.getAvailableElements()');  //#development
            return Object.keys(elementLibrary);
        };

    //element control
        //database
            const createdElements = [];
            function generateElementId(){
                let id = createdElements.findIndex(item => item==undefined);
                return id != -1 ? id : createdElements.length;
            }
            function getElementFromId(id){ return createdElements[id]; }
            function getIdFromElement(element){ return element.getId(); }

            this.getElementFromId = getElementFromId;
            this.getIdFromElement = getIdFromElement;
            this.getCreatedElements = function(){ 
                dev.log.element('.getCreatedElements()');  //#development
                return createdElements;
            };

        //creation
            this.create_skipDatabase = function(type,name){
                dev.log.element('.create_skipDatabase('+type+','+name+')');  //#development
                return new elementLibrary[type](name,-1);
            };
            this.create = function(type,name){
                dev.log.element('.create('+type+','+name+')');  //#development

                if(type == undefined){ report.error('elememt.createElement: type argument not provided - element will not be produced'); return; }
                if(name == undefined){ report.error('elememt.createElement: name argument not provided - element will not be produced'); return; }
                if(elementLibrary[type] == undefined){ report.error('elememt.createElement: type "'+type+'" does not exist - element will not be produced'); return; }

                const newElement_id = generateElementId();
                createdElements[newElement_id] = new elementLibrary[type](name,newElement_id);
                return createdElements[newElement_id];
            };

        //deletion
            this.delete = function(element){ 
                dev.log.element('.delete('+element+')');  //#development
                createdElements[getIdFromElement(element)] = undefined;
            };
            this.deleteAllCreated = function(){ 
                dev.log.element('.deleteAllCreated()');  //#development
                for(let a = 0; a < createdElements.length; a++){this.delete(getElementFromId(a));}
            };

        //other
            this.getTypeById = function(element){ 
                dev.log.element('.getTypeById('+element+')'); //#development
                return element.getType();
            };
            this._dump = function(){
                report.info('element._dump()');
                Object.keys(elementLibrary).forEach(key => { report.info('element._dump -> elementLibrary: '+key); })
                createdElements.forEach(item => { report.info('element._dump -> createdElements: '+JSON.stringify(item)); });
            };
};
const arrangement = new function(){
    let design = element.create_skipDatabase('group','root');

    this.new = function(){ 
        dev.log.arrangement('.new()');  //#development
        design = core.shape.create('group');
    };
    this.get = function(){
        dev.log.arrangement('.get()');  //#development
        return design; 
    };
    this.set = function(arrangement){ 
        dev.log.arrangement('.set('+JSON.stringify(arrangement)+')');  //#development
        design = arrangement;
    };
    this.prepend = function(element){
        dev.log.arrangement('.prepend('+JSON.stringify(element)+')');  //#development
        design.prepend(element);
    };
    this.append = function(element){
        dev.log.arrangement('.append('+JSON.stringify(element)+')');  //#development
        design.append(element);
    };
    this.remove = function(element){ 
        dev.log.arrangement('.remove('+JSON.stringify(element)+')');  //#development
        design.remove(element); 
    };
    this.clear = function(){ 
        dev.log.arrangement('.clear()');  //#development
        design.clear(); 
    };

    this.getElementByAddress = function(address){
        dev.log.arrangement('.getElementByAddress('+JSON.stringify(address)+')'); //#development

        var route = address.split('/'); 
        route.shift(); 
        route.shift(); 

        var currentObject = design;
        route.forEach(function(a){
            currentObject = currentObject.getChildByName(a);
        });

        return currentObject;
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.arrangement('.getElementsUnderPoint('+x+','+y+')'); //#development
        return design.getElementsUnderPoint(x,y);
    };
    this.getElementsUnderArea = function(points){ 
        dev.log.arrangement('.getElementByAddress('+JSON.stringify(points)+')'); //#development
        return design.getElementsUnderArea(points); 
    };
        
    this.printTree = function(mode='spaced'){ //modes: spaced / tabular / address
        function recursivePrint(grouping,prefix=''){
            grouping.children.forEach(function(a){
                if(mode == 'spaced'){
                    console.log(prefix+'- '+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'- ') }
                }else if(mode == 'tabular'){
                    console.log(prefix+'- \t'+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                }else if(mode == 'address'){
                    console.log(prefix+'/'+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                }
            });
        }

        recursivePrint(design.getTree(), '/root');
    };

    this._dump = function(){ design._dump(); };
};
const render = new function(){
    const self = this; 

    let isBusy = true;
    this.isBusy = function(){ return isBusy };

    const pageData = {
        defaultCanvasSize:{width:800, height:600},
        currentCanvasSize:{width:800, height:600},
        selectedCanvasSize:{width:800, height:600},
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
            dev.log.render('.produceProgram('+name+','+vertexShaderSource+','+fragmentShaderSource+')'); //#development
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
                dev.log.render('.produceProgram -> program not found; will be compiled and stored as "'+name+'"'); //#development
                storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                context.useProgram(storedPrograms[name]);
            }else{
                dev.log.render('.produceProgram -> program found; using stored program'); //#development
            }

            return storedPrograms[name];
        };

    //canvas and webGL context adjustment
        this.clearColour = function(colour){
            dev.log.render('.clearColour('+JSON.stringify(colour)+')'); //#development
            if(colour == undefined){ return clearColour; }
            clearColour = colour;
            context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            dev.log.render('.adjustCanvasSize('+newWidth+','+newHeight+')'); //#development
            let adjustCanvasSize_isBusy = {width:false,height:false};
            isBusy = true;

            function updateInternalCanvasSize(direction,newValue){
                dev.log.render('.adjustCanvasSize::updateInternalCanvasSize('+direction+','+newValue+')'); //#development
                newValue *= pageData.devicePixelRatio;
                if(newValue != undefined){
                    if(pageData.currentCanvasSize[direction] != newValue){
                        pageData.currentCanvasSize[direction] = newValue;
                        canvas[direction] = pageData.currentCanvasSize[direction];
                    }
                }else{
                    if(pageData.currentCanvasSize[direction] != pageData.defaultCanvasSize[direction]){
                        pageData.currentCanvasSize[direction] = pageData.defaultCanvasSize[direction];
                        canvas[direction] = pageData.currentCanvasSize[direction];
                    }
                }

                self.refreshCoordinates();
                adjustCanvasSize_isBusy[direction] = false;
                isBusy = adjustCanvasSize_isBusy['width'] || adjustCanvasSize_isBusy['height'];
            }
            
            //request canvas data from the console, if none is provided in arguments
            // -> argument data > requested data > default data
            function updateSize_arguments(){
                dev.log.render('.adjustCanvasSize::updateSize_arguments()'); //#development
                adjustCanvasSize_isBusy = {width:true,height:true};

                if(newWidth != undefined){
                    updateInternalCanvasSize('width',newWidth*pageData.devicePixelRatio);
                }else{
                    dev.log.render('.adjustCanvasSize -> argument "newWidth" undefined; trying request...'); //#development
                    updateSize_dataRequest('width');
                }
                if(newHeight != undefined){
                    updateInternalCanvasSize('height',newHeight*pageData.devicePixelRatio);
                }else{
                    dev.log.render('.adjustCanvasSize -> argument "newHeight" undefined; trying request...'); //#development
                    updateSize_dataRequest('height');
                }
            }
            function updateSize_dataRequest(direction){
                dev.log.render('.adjustCanvasSize::updateSize_dataRequest('+direction+')'); //#development
                const capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);

                interface.getCanvasAttributes([capitalizedDirection],[true]).then(sizes => {
                    pageData.selectedCanvasSize[direction] = sizes[0];
                    dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> '+capitalizedDirection+':'+pageData.selectedCanvasSize[direction]); //#development
                    const attribute = pageData.selectedCanvasSize[direction];

                    function unparseableErrorMessage(direction,attribute){
                        report.error( 'Canvas element '+direction+' is of an unparseable format: '+attribute );
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> unparseable format: '+attribute+', will use default instead'); //#development
                        updateSize_usingDefault(direction);
                    }

                    if( attribute.indexOf('%') == (attribute.length-1) ){ //percentage
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> its a percentage'); //#development
                        interface.getCanvasParentAttributes(['offset'+capitalizedDirection]).then(sizes => {
                            dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> parent'+capitalizedDirection+':'+sizes[0]); //#development
                            const parentSize = sizes[0];
                            const percent = parseFloat(attribute.slice(0,-1)) / 100;
                            dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> parsed percent: '+percent*100); //#development
                            if( isNaN(percent) ){ unparseableErrorMessage(direction,attribute); return; }
                            dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> calculated size: '+parentSize*percent); //#development
                            updateInternalCanvasSize(direction,parentSize*percent);
                        });
                    }else if( attribute.indexOf('px') != -1 ){ //px value
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> its a pixel number'); //#development
                        const val = parseFloat(attribute.slice(0,-2));
                        if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> calculated size: '+val); //#development
                        updateInternalCanvasSize(direction,val);
                    }else{ //flat value
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> its a flat number'); //#development
                        const val = parseFloat(attribute);
                        if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> calculated size: '+val); //#development
                        updateInternalCanvasSize(direction,val);
                    }
                });
            }
            function updateSize_usingDefault(direction){
                dev.log.render('.adjustCanvasSize::updateSize_usingDefault('+direction+')'); //#development
                updateInternalCanvasSize(direction,pageData.defaultCanvasSize[direction]);
            }

            interface['window.devicePixelRatio']().then(value => {
                pageData.devicePixelRatio = value;
                updateSize_arguments();
            });
        };
        this.refreshCoordinates = function(){
            dev.log.render('.refreshCoordinates()'); //#development
            dev.log.render('.refreshCoordinates: -> pageData.devicePixelRatio: '+pageData.devicePixelRatio); //#development
            let w = context.canvas.width;
            let h = context.canvas.height;
            dev.log.render('.refreshCoordinates: -> w:'+w+' h:'+h); //#development

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

            dev.log.render('.refreshCoordinates: -> context.viewport('+x+', '+y+', '+width+', '+height+')'); //#development
            context.viewport(x, y, width, height);

            interface.setCanvasAttributes([{name:'width',value:w/pageData.devicePixelRatio},{name:'height',value:h/pageData.devicePixelRatio}]);
        };
        this.refresh = function(allDoneCallback){
            dev.log.render('.refresh()'); //#development
            this.clearColour(clearColour);
            this.frameRateLimit(this.frameRateLimit());
            this.adjustCanvasSize();

            const refresh_interval = setInterval(function(){
                if(!render.isBusy()){
                    clearInterval(refresh_interval);
                    if(allDoneCallback){allDoneCallback()};
                }
            },1);
        };

    //frame rate control
        const frameRateControl = {active:false, previousRenderTime:Date.now(), limit:30, interval:0};
        this.activeLimitToFrameRate = function(a){
            dev.log.render('.activeLimitToFrameRate('+a+')'); //#development
            if(a==undefined){return frameRateControl.active;}
            frameRateControl.active=a
        };
        this.frameRateLimit = function(a){
            dev.log.render('.frameRateLimit('+a+')'); //#development
            if(a==undefined){ return frameRateControl.limit; }
            frameRateControl.limit=a;
            frameRateControl.interval=1000/frameRateControl.limit;
        };

    //actual render
        function renderFrame(noClear=false){
            dev.log.render('::renderFrame('+noClear+')'); //#development
            if(!noClear){context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);}
            arrangement.get().render(context,{x:0,y:0,scale:1,angle:0});
            const transferableImage = canvas.transferToImageBitmap();
            communicationModule.run('printToScreen',[transferableImage],undefined,[transferableImage]);
        }
        function animate(timestamp){
            dev.log.render('::animate('+timestamp+')'); //#development
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
                    render.active(false);
                    console.error('major animation error');
                    console.error(error);
                }

            //perform stats collection
                stats.collect(timestamp);
        }
        this.frame = function(noClear=false){
            dev.log.render('.frame('+noClear+')'); //#development
            renderFrame(noClear);
        };
        this.active = function(bool){
            dev.log.render('.active('+bool+')'); //#development
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
        this.getCanvasDimensions = function(){ return {width:pageData.currentCanvasSize.width/pageData.devicePixelRatio, height:pageData.currentCanvasSize.height/pageData.devicePixelRatio}; };
        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
            // let dot = shape.create('circle');
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
            report.info('render._dump()');
            report.info('render._dump -> pageData: '+JSON.stringify(pageData));
            report.info('render._dump -> storedPrograms: '+JSON.stringify(storedPrograms));
            report.info('render._dump -> frameRateControl: '+JSON.stringify(frameRateControl));
            report.info('render._dump -> clearColour: '+JSON.stringify(clearColour));
        };
};
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
                dev.log.viewport('.adapter.windowPoint2workspacePoint('+x+','+y+')'); //#development
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
            dev.log.viewport('.position('+x+','+y+')'); //#development
            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
            state.position.x = x;
            state.position.y = y;

            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){
                    dev.log.viewport('.position -> adjusting: '+JSON.stringify(item)); //#development
                    item.unifiedAttribute({x:state.position.x,y:state.position.y});
                }
            });

            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.scale = function(s){
            dev.log.viewport('.scale('+s+')'); //#development
            if(s == undefined){return state.scale;}
            state.scale = s <= 0 ? 1 : s;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    dev.log.viewport('.scale -> adjusting: '+JSON.stringify(item)); //#development
                    item.scale(state.scale);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.angle = function(a){
            dev.log.viewport('.angle('+a+')'); //#development
            if(a == undefined){return state.angle;}
            state.angle = a;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    dev.log.viewport('.angle -> adjusting: '+JSON.stringify(item)); //#development
                    item.angle(state.angle);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };

    //mouse interaction
        this.getElementUnderCanvasPoint = function(x,y){
            dev.log.viewport('.getElementUnderCanvasPoint('+x+','+y+')'); //#development
            let xy = this.adapter.windowPoint2canvasPoint(x,y);
            return arrangement.getElementUnderPoint(xy.x,xy.y);
        };
        this.getElementsUnderCanvasArea = function(points){
            dev.log.viewport('.getElementsUnderCanvasArea('+JSON.stringify(points)+')'); //#development
            return arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2canvasPoint(a.x,a.y)));
        };
 
    //misc
        function calculateViewportExtremities(){
            dev.log.viewport('::calculateViewportExtremities()'); //#development
            const canvasDimensions = render.getCanvasDimensions();

            //for each corner of the viewport; find out where they lie on the canvas
                viewbox.points.tl = {x:0, y:0};
                viewbox.points.tr = {x:canvasDimensions.width, y:0};
                viewbox.points.bl = {x:0, y:canvasDimensions.height};
                viewbox.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
            //calculate a bounding box for the viewport from these points
                viewbox.boundingBox = library.math.boundingBoxFromPoints([viewbox.points.tl, viewbox.points.tr, viewbox.points.br, viewbox.points.bl]);
                dev.log.viewport('::calculateViewportExtremities -> viewbox.boundingBox: '+JSON.stringify(viewbox.boundingBox)); //#development
        }
        this.calculateViewportExtremities = calculateViewportExtremities;
        this.refresh = function(){
            dev.log.viewport('.refresh()'); //#development
            calculateViewportExtremities();
        };
        this.getBoundingBox = function(){ 
            dev.log.viewport('.getBoundingBox()'); //#development
            return viewbox.boundingBox;
        };
        this.mousePosition = function(x,y){
            dev.log.viewport('.mousePosition('+x+','+y+')'); //#development
            if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
            mouseData.x = x;
            mouseData.y = y;
        };
        this.stopMouseScroll = function(bool){
            dev.log.viewport('.stopMouseScroll('+bool+')'); //#development
            if(bool == undefined){return mouseData.stopScrollActive;}
            mouseData.stopScrollActive = bool;
    
            //just incase; make sure that scrolling is allowed again when 'stopMouseScroll' is turned off
            if(!bool){ interface['document.body.style.overflow'](''); }
        };
        this.clickVisibility = function(a){ 
            dev.log.viewport('.clickVisibility('+a+')'); //#development
            if(a==undefined){return mouseData.clickVisibility;} 
            mouseData.clickVisibility=a; 
        };
        this.getHeight = function(){ 
            dev.log.viewport('.getHeight()'); //#development
            return viewbox.points.br.y - viewbox.points.tl.y; 
        };
        this.getWidth= function(){ 
            dev.log.viewport('.getWidth()'); //#development
            return viewbox.points.br.x - viewbox.points.tl.x; 
        };
        this._dump = function(){
            report.info('viewport._dump()');
            report.info('viewport._dump -> state: '+JSON.stringify(state));
            report.info('viewport._dump -> viewbox: '+JSON.stringify(viewbox));
            report.info('viewport._dump -> mouseData: '+JSON.stringify(mouseData));
        };

    //callback
        this.onCameraAdjust = function(state){};
};
const stats = new function(){
    let active = false;
    let average = 30;
    let lastTimestamp = 0;

    const framesPerSecond = {
        compute:function(timestamp){
            dev.log.stats('::framesPerSecond.compute('+timestamp+')'); //#development

            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
            if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }

            this.rate = library.math.averageArray( this.frameTimeArray );

            lastTimestamp = timestamp;
        },
        counter:0,
        frameTimeArray:[],
        rate:0,
    };

    this.collect = function(timestamp){
        dev.log.stats('.collect('+timestamp+')'); //#development
        //if stats are turned off, just bail
            if(!active){return;}

        framesPerSecond.compute(timestamp);
    };
    this.active = function(bool){
        dev.log.stats('.active('+bool+')'); //#development
        if(bool==undefined){return active;} 
        active=bool;
    };
    this.getReport = function(){
        dev.log.stats('.getReport()'); //#development
        return {
            framesPerSecond: framesPerSecond.rate,
        };
    };
};
const callback = new function(){
    const self = this; 

    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onmouseenterelement', 'onmouseleaveelement',
        'onkeydown', 'onkeyup',
    ];
    this.listCallbackTypes = function(){
        return callbacks;
    };

    var elementCallbackStates = {}; 
    callbacks.forEach(callbackType => elementCallbackStates[callbackType] = true);
    this.getElementCallbackState = function(type){
        dev.log.callback('.getElementCallbackState('+type+')'); //#development
        return elementCallbackStates[type];
    };
    this.activateElementCallback = function(type){
        dev.log.callback('.activateElementCallback('+type+')'); //#development
        elementCallbackStates[type] = true;
    };
    this.disactivateElementCallback = function(type){
        dev.log.callback('.disactivateElementCallback('+type+')'); //#development
        elementCallbackStates[type] = false;
    };
    this.activateAllElementCallbacks = function(){ 
        dev.log.callback('.activateAllElementCallbacks()'); //#development
        callbacks.forEach(callback => this.activateElementCallback(callback)); 
    };
    this.disactivateAllElementCallbacks = function(){ 
        dev.log.callback('.disactivateAllElementCallbacks()'); //#development
        callbacks.forEach(callback => this.disactivateElementCallback(callback)); 
    };
    this.activateAllElementCallbacks();

    this.attachCallback = function(element,callbackType){
        dev.log.callback('.attachCallback('+JSON.stringify(element)+','+callbackType+')'); //#development
        element[callbackType] = function(){};
    };
    this.removeCallback = function(element,callbackType){
        dev.log.callback('.removeCallback('+JSON.stringify(element)+','+callbackType+')'); //#development
        element[callbackType] = undefined;
        delete element[callbackType];
    };

    function gatherDetails(event,callback,count){
        dev.log.callback('::gatherDetails('+JSON.stringify(event)+','+callback+','+count+')'); //#development
        //only calculate enough data for what will be needed
        return {
            point: count > 0 ? viewport.adapter.windowPoint2workspacePoint(event.X,event.Y) : undefined,
            elements: count > 3 ? arrangement.getElementsUnderPoint(event.X,event.Y) : undefined,
        };
    }
    this.functions = {};

    //coupling object
        this.coupling = {};

    //default
        for(var a = 0; a < callbacks.length; a++){
            this.coupling[callbacks[a]] = function(callbackName){
                return function(event){
                    dev.log.callback('.coupling.'+callbackName+'('+JSON.stringify(event)+')'); //#development
                    var data = gatherDetails(event,callbackName,self.functions[callbackName].length);
                    self.functions[callbackName]( data.point.x, data.point.y, event, data.elements );
                }
            }(callbacks[a]);
        }

    //special cases
        //canvas onmouseenter / onmouseleave
            this.coupling.onmouseenter = function(event){
                //if appropriate, remove the window scrollbars
                    if(viewport.stopMouseScroll()){ 
                        interface['document.body.style.overflow']('hidden');
                    }
            };
            this.coupling.onmouseleave = function(event){
                //if appropriate, replace the window scrollbars
                    if(viewport.stopMouseScroll()){ 
                        interface['document.body.style.overflow']('');
                    }
            };

        //onmousemove / onmouseenter / onmouseleave
            var elementMouseoverList = [];
            this.coupling.onmousemove = function(event){
                dev.log.callback('.coupling.onmousemove('+JSON.stringify(event)+')'); //#development
                viewport.mousePosition(event.X,event.Y);
                var elementsUnderPoint = arrangement.getElementsUnderPoint(event.X,event.Y);
                dev.log.callback('.coupling.onmousemove -> elementsUnderPoint.length: '+elementsUnderPoint.length); //#development
                var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                dev.log.callback('.coupling.onmousemove -> workspace point: '+JSON.stringify(point)); //#development

                //check for onmouseenter / onmouseleave
                    //go through the elementsUnderPoint list, comparing to the element transition list
                        var diff = library.math.getDifferenceOfArrays(elementMouseoverList,elementsUnderPoint);
                        //run both onmouseenterelement and onmouseenterelement, only if there's
                        //  elements to report, providing only the relevant set of elements
                        //elements only on elements list; add to elementMouseoverList
                        //elements only on elementMouseoverList; remove from elementMouseoverList
                        if(elementCallbackStates.onmouseenter){
                            if(diff.b.length > 0){ self.functions.onmouseenterelement( point.x, point.y, event, diff.b); }
                            if(diff.a.length > 0){ self.functions.onmouseleaveelement( point.x, point.y, event, diff.a); }
                        }
                        diff.b.forEach(function(element){ elementMouseoverList.push(element); });
                        diff.a.forEach(function(element){ elementMouseoverList.splice(elementMouseoverList.indexOf(element),1); });

                //perform regular onmousemove actions
                    if(self.functions.onmousemove){
                        self.functions.onmousemove( point.x, point.y, event, elementsUnderPoint );
                    }
            };

        //onwheel
            this.coupling.onwheel = function(event){
                dev.log.callback('.coupling.onwheel('+JSON.stringify(event)+')'); //#development

                if(self.functions.onwheel){
                    var data = gatherDetails(event,'onwheel',self.functions.onwheel.length);
                    self.functions.onwheel( data.point.x, data.point.y, event, data.elements );
                }
            };

        //onkeydown / onkeyup
            ['onkeydown', 'onkeyup'].forEach(callbackName => {
                this.coupling[callbackName] = function(callback){
                    return function(event){
                        dev.log.callback('.coupling.'+callbackName+'('+JSON.stringify(event)+')'); //#development
                        var p = viewport.mousePosition(); event.X = p.x; event.Y = p.y;
                        var point = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                        dev.log.callback('.coupling.'+callbackName+' -> guessed mouse point: '+JSON.stringify(point)); //#development
                
                        if(self.functions[callback]){
                            var data = gatherDetails(event,callback,self.functions[callback].length);
                            self.functions[callback]( point.x, point.y, event, data.elements );
                        }
                    }
                }(callbackName);
            });

        //onmousedown / onmouseup / onclick / ondblclick
            var elementMouseclickList = [];
            this.coupling.onmousedown = function(event){
                dev.log.callback('.coupling.onmousedown('+JSON.stringify(event)+')'); //#development
                if(viewport.clickVisibility()){ render.drawDot(event.offsetX,event.offsetY); }

                var elementsUnderPoint = arrangement.getElementsUnderPoint(event.X,event.Y);
                var workspacePoint = viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                //save current elements for use in the onclick part of the onmouseup callback
                    elementMouseclickList = elementsUnderPoint;

                //perform global function
                    if(self.functions.onmousedown){
                        self.functions.onmousedown( workspacePoint.x, workspacePoint.y, event, elementsUnderPoint );
                    }
            };
            this.coupling.onmouseup = function(event){
                dev.log.callback('.coupling.onmouseup('+JSON.stringify(event)+')'); //#development
                    
                //perform global function
                    if(self.functions.onmouseup){
                        var data = gatherDetails(event,'onmouseup',self.functions.onmouseup.length);
                        self.functions.onmouseup( data.point.x, data.point.y, event, data.elements );
                    }
            };
            var recentlyClickedDoubleClickableElementList = [];
            this.coupling.onclick = function(event){
                dev.log.callback('.coupling.onclick('+JSON.stringify(event)+')'); //#development
                if(self.functions.onclick){
                    var data = gatherDetails(event,'onclick',self.functions.onclick.length);
                    data.elements = data.elements.filter( element => elementMouseclickList.includes(element) );
                    recentlyClickedDoubleClickableElementList = data.elements;
                    self.functions.onclick( data.point.x, data.point.y, event, data.elements );
                }
            };
            this.coupling.ondblclick = function(event){
                dev.log.callback('.coupling.ondblclick('+JSON.stringify(event)+')'); //#development
                if(self.functions.ondblclick){
                    var data = gatherDetails(event,'ondblclick',self.functions.ondblclick.length);
                    data.elements = data.elements.filter( element => recentlyClickedDoubleClickableElementList.includes(element) );
                    self.functions.ondblclick( data.point.x, data.point.y, event, data.elements );
                }
            };
};

communicationModule.function.getAllFunctions = function(){
    return Object.keys(communicationModule.function);  
};

const interface = new function(){
    this['document.body.style.overflow'] = function(value){
        return new Promise((resolve, reject) => {
            communicationModule.run('document.body.style.overflow',[value],resolve);
        });
    };
    this['window.devicePixelRatio'] = function(state){
        return new Promise((resolve, reject) => {
            communicationModule.run('window.devicePixelRatio',[state],resolve);
        });
    };
    this.setCanvasAttributes = function(attributes=[]){
        communicationModule.run('setCanvasAttributes',[attributes]);
    };
    this.getCanvasAttributes = function(attributeNames,prefixActiveArray=[]){
        return new Promise((resolve, reject) => {
            communicationModule.run('getCanvasAttributes',[attributeNames,prefixActiveArray],resolve);
        });
    };
    this.getCanvasParentAttributes = function(attributeNames,prefixActiveArray=[]){
        return new Promise((resolve, reject) => {
            communicationModule.run('getCanvasParentAttributes',[attributeNames,prefixActiveArray],resolve);
        });
    };
    this.sendReadySignal = function(){
        communicationModule.run('ready');
    };
};

//overarch
    communicationModule.delayedFunction['refresh'] = function(responseFunction){
        render.refresh(() => {
            viewport.refresh();
            responseFunction();
        });
    };

//element
    communicationModule.function['element.getAvailableElements'] = function(){
        return element.getAvailableElements();
    };
    communicationModule.function['element.getCreatedElements'] = function(){
        return element.getCreatedElements().map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['element.create'] = function(type,name){
        return element.getIdFromElement(element.create(type,name));
    };
    communicationModule.function['element.delete'] = function(id){
        element.delete(element.getElementFromId(id));
    };
    communicationModule.function['element.deleteAllCreated'] = function(){
        element.deleteAllCreated();
    };
    communicationModule.function['element.getTypeById'] = function(id){
        return element.getTypeById(element.getElementFromId(id));
    };
    communicationModule.function['element.executeMethod'] = function(id,method,argumentList=[]){
        return element.getElementFromId(id).interface[method](...argumentList);
    };
    communicationModule.function['element.boatload_executeMethod'] = function(containers){
        containers.forEach(container => { communicationModule.function['element.executeMethod'](container.id,container.method,container.argumentList); });
    };
    communicationModule.function['element._dump'] = function(){
        element._dump();
    };

//arrangement
    communicationModule.function['arrangement.new'] = function(){
        arrangement.new();
    };
    communicationModule.function['arrangement.prepend'] = function(id){
        arrangement.prepend(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.append'] = function(id){
        arrangement.append(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.remove'] = function(id){
        arrangement.remove(element.getElementFromId(id));
    };
    communicationModule.function['arrangement.clear'] = function(){
        arrangement.clear();
    };
    communicationModule.function['arrangement.getElementByAddress'] = function(address){
        return element.getIdFromElement(arrangement.getElementByAddress(address));
    };
    communicationModule.function['arrangement.getElementsUnderPoint'] = function(x,y){
        return arrangement.getElementsUnderPoint(x,y).map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['arrangement.getElementsUnderArea'] = function(points){
        return arrangement.getElementsUnderArea(points).map(ele => element.getIdFromElement(ele));
    };
    communicationModule.function['arrangement.printTree'] = function(mode){
        arrangement.printTree(mode);
    };
    communicationModule.function['arrangement._dump'] = function(){
        arrangement._dump();
    };

//render
    communicationModule.function['render.clearColour'] = function(colour){
        return render.clearColour(colour);
    };
    communicationModule.function['render.adjustCanvasSize'] = function(newWidth, newHeight){
        render.adjustCanvasSize(newWidth, newHeight);
    };
    communicationModule.function['render.refreshCoordinates'] = function(){
        render.refreshCoordinates();
    };
    communicationModule.delayedFunction['render.refresh'] = function(responseFunction){
        render.refresh(responseFunction);
    };
    communicationModule.function['render.activeLimitToFrameRate'] = function(active){
        return render.activeLimitToFrameRate(active);
    };
    communicationModule.function['render.frameRateLimit'] = function(rate){
        return render.frameRateLimit(rate);
    };
    communicationModule.function['render.frame'] = function(){
        render.frame();
    };
    communicationModule.function['render.active'] = function(active){
        return render.active(active);
    };
    communicationModule.function['render.getCanvasDimensions'] = function(){
        return render.getCanvasDimensions();
    };
    communicationModule.function['render.drawDot'] = function(x,y,r,colour){
        render.drawDot(x,y,r,colour);
    };
    communicationModule.function['render._dump'] = function(){
        render._dump();
    };

//viewport
    communicationModule.function['viewport.position'] = function(x,y){
        return viewport.position(x,y);
    };
    communicationModule.function['viewport.scale'] = function(s){
        return viewport.scale(s);
    };
    communicationModule.function['viewport.angle'] = function(a){
        return viewport.angle(a);
    };
    communicationModule.function['viewport.getElementUnderCanvasPoint'] = function(x,y){
        return viewport.getElementUnderCanvasPoint(x,y);
    };
    communicationModule.function['viewport.getElementsUnderCanvasArea'] = function(points){
        return viewport.getElementsUnderCanvasArea(points);
    };
    communicationModule.function['viewport.calculateViewportExtremities'] = function(){
        viewport.calculateViewportExtremities();
    };
    communicationModule.function['viewport.refresh'] = function(){
        viewport.refresh();
    };
    communicationModule.function['viewport.getBoundingBox'] = function(){
        return viewport.getBoundingBox();
    };
    communicationModule.function['viewport.mousePosition'] = function(x,y){
        return viewport.mousePosition(x,y);
    };
    communicationModule.function['viewport.stopMouseScroll'] = function(bool){
        return viewport.stopMouseScroll(bool);
    };
    communicationModule.function['viewport.clickVisibility'] = function(bool){
        return viewport.clickVisibility(bool);
    };
    communicationModule.function['viewport.getHeight'] = function(){
        return viewport.getHeight();
    };
    communicationModule.function['viewport.getWidth'] = function(){
        return viewport.getWidth();
    };
    communicationModule.function['viewport._dump'] = function(){
        viewport._dump();
    };
    viewport.onCameraAdjust = function(state){
        communicationModule.run('viewport.onCameraAdjust',[state]);
    };

//stats
    communicationModule.function['stats.active'] = function(active){
        return stats.active(active);
    };
    communicationModule.function['stats.getReport'] = function(){
        return stats.getReport();
    };

//callback
    communicationModule.function['callback.listCallbackTypes'] = function(){
        return callback.listCallbackTypes();
    };
    communicationModule.function['callback.getShapeCallbackState'] = function(type){
        return callback.getShapeCallbackState(type);
    };
    communicationModule.function['callback.activateShapeCallback'] = function(type){
        callback.activateShapeCallback(type);
    };
    communicationModule.function['callback.disactivateShapeCallback'] = function(type){
        callback.disactivateShapeCallback(type);
    };
    communicationModule.function['callback.activateAllShapeCallbacks'] = function(){
        callback.activateAllShapeCallbacks();
    };
    communicationModule.function['callback.disactivateAllShapeCallbacks'] = function(){
        callback.disactivateAllShapeCallbacks();
    };

    communicationModule.function['callback.attachCallback'] = function(id,callbackType){
        callback.attachCallback(element.getElementFromId(id),callbackType);
    };
    communicationModule.function['callback.removeCallback'] = function(id,callbackType){
        callback.removeCallback(element.getElementFromId(id),callbackType);
    };

    callback.listCallbackTypes().forEach(callbackName => {
        communicationModule.function['callback.coupling.'+callbackName] = function(event){
            callback.coupling[callbackName](event);
        };
        callback.functions[callbackName] = function(x, y, event, elements){
            communicationModule.run('callback.'+callbackName,[x, y, event, elements.map(ele => element.getIdFromElement(ele))]);
        };
    });

render.refresh(() => {
    viewport.refresh();
    interface.sendReadySignal();
});
