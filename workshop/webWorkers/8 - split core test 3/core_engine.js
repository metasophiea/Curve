const communicationModule = new function(communicationObject,callerName){
    const self = this;
    const devMode = true;
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
    this.run = function(cargo,callback){
        self.log('.run('+JSON.stringify(cargo)+','+callback+')');
        let id = null;
        if(callback != undefined){
            self.log('run -> callback was defined; generating message ID');
            id = generateMessageID();
            self.log('.run -> message ID:',id);
            messagingCallbacks[id] = callback;
        }
        communicationObject.postMessage({ id:id, outgoing:true, cargo:cargo });
    };
}(this,'core_engine');

const library = {
    devMode:false,
    log: function(){
        if(!library.devMode){return;}
        let prefix = 'library';
        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(80, 161, 141); font-style:italic;' );
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
                                if( points[b].y > points[a].y && points[b].x > points[a].x ){
                                    let areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) - (point.y-points[a].y)/(points[b].y-points[a].y) + 1;
                                }else if( points[b].y <= points[a].y && points[b].x <= points[a].x ){
                                    let areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) - (point.y-points[b].y)/(points[a].y-points[b].y) + 1;
                                }else if( points[b].y > points[a].y && points[b].x < points[a].x ){
                                    let areaLocation = (point.x-points[b].x)/(points[a].x-points[b].x) + (point.y-points[a].y)/(points[b].y-points[a].y);
                                }else if( points[b].y <= points[a].y && points[b].x >= points[a].x ){
                                    let areaLocation = (point.x-points[a].x)/(points[b].x-points[a].x) + (point.y-points[b].y)/(points[a].y-points[b].y);
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

const core = new function(){
    this.devMode = {
        shape:!true,
        arrangement:!true,
        render:!true,
        viewport:!true,
    };

    this.shape = new function(){
        const self = this;
        this.log = function(){
            if(!core.devMode.shape){return;}
            let prefix = 'core.shape';
            console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(80, 161, 141); font-style:italic;' );
        };
    
        this.library = new function(){
            this.group = function(){
                let self = this;
        
                //reporting
                    this.log = function(){
                        if(!self.devMode){return;}
                        let prefix = 'core.shape.library.group ' + self.getAddress() + ' ';
                        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(129, 80, 161); font-style:italic;' );
                    };
        
                //attributes 
                    //protected attributes
                        const type = 'group'; this.getType = function(){return type;}
        
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        this.ignored = false;
                        this.heedCamera = false;
                    //advanced use attributes
                        this.devMode = false;
                        this.stopAttributeStartedExtremityUpdate = false;
                        this.alwaysRenderChildren = true;
                    
                    //attributes pertinent to extremity calculation
                        let x = 0;     this.x =     function(a){ if(a==undefined){return x;}     x = a;     self.log(this.getAddress()+'.x('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let y = 0;     this.y =     function(a){ if(a==undefined){return y;}     y = a;     self.log(this.getAddress()+'.y('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let angle = 0; this.angle = function(a){ if(a==undefined){return angle;} angle = a; self.log(this.getAddress()+'.angle('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let scale = 1; this.scale = function(a){ if(a==undefined){return scale;} scale = a; self.log(this.getAddress()+'.scale('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
        
                //addressing
                    this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };
        
                //group functions
                    const children = []; 
                    const childRegistry = {};
        
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
        
                    this.children = function(){return children;};
                    this.getChildByName = getChildByName; this._childRegistry = function(){return childRegistry;};
                    this.getChildIndexByName = function(name){return children.indexOf(children.find(a => a.name == name)); };
                    this.contains = checkForShape;
                    this.append = function(shape){
                        self.log('.append('+JSON.stringify(shape)+')');
        
                        if( !isValidShape(shape) ){ return; }
        
                        children.push(shape); 
                        shape.parent = this;
                        augmentExtremities_add(shape);
        
                        childRegistry[shape.name] = shape;
                        if(shape.onadd != undefined){shape.onadd(false);}
                    };
                    this.prepend = function(shape){
                        self.log('.prepend('+JSON.stringify(shape)+')');
                        if( !isValidShape(shape) ){ return; }
        
                        children.unshift(shape); 
                        shape.parent = this;
                        augmentExtremities_add(shape);
        
                        childRegistry[shape.name] = shape;
                        if(shape.onadd != undefined){shape.onadd(true);}
                    };
                    this.remove = function(shape){
                        self.log('.remove('+JSON.stringify(shape)+')');
                        if(shape == undefined){return;}
                        if(shape.onremove != undefined){shape.onremove();}
                        children.splice(children.indexOf(shape), 1);
                        augmentExtremities_remove(shape);
        
                        shape.parent = undefined;
                        delete childRegistry[shape.name];
                    };
                    this.clear = function(){ children = []; childRegistry = {} };
                    this.getElementsUnderPoint = function(x,y){
                        self.log('.getElementsUnderPoint('+x+','+y+')');
                        let returnList = [];
        
                        //run though children backwords (thus, front to back)
                        for(let a = children.length-1; a >= 0; a--){
                            //if child wants to be ignored, just move on to the next one
                                if( children[a].ignored ){ continue; }
        
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
                        self.log('.getElementsUnderPoint('+JSON.stringify(points)+')');
                        let returnList = [];
        
                        //run though children backwords (thus, front to back)
                        for(let a = children.length-1; a >= 0; a--){
                            //if child wants to be ignored, just move on to the next one
                                if( children[a].ignored ){ continue; }
        
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
                        let result = {name:this.name,type:type,children:[]};
        
                        children.forEach(function(a){
                            if(a.getType() == 'group'){ result.children.push( a.getTree() ); }
                            else{ result.children.push({ type:a.getType(), name:a.name }); }
                        });
        
                        return result;
                    };
        
                //clipping
                    let clipping = { stencil:undefined, active:false };
                    this.stencil = function(shape){
                        self.log('.stencil('+JSON.stringify(shape)+')');
                        if(shape == undefined){return clipping.stencil;}
                        clipping.stencil = shape;
                        clipping.stencil.parent = this;
                        if(clipping.active){ computeExtremities(); }
                    };
                    this.clipActive = function(bool){
                        self.log('.clipActive('+bool+')');
                        if(bool == undefined){return clipping.active;}
                        clipping.active = bool;
                        computeExtremities();
                    };
        
                //extremities
                    function calculateExtremitiesBox(){
                        self.log('::calculateExtremitiesBox()');
                        let limits = {left:0,right:0,top:0,bottom:0};
                        children.forEach(child => {
                            let tmp = library.math.boundingBoxFromPoints(child.extremities.points);
                            if( tmp.bottomRight.x > limits.right ){ limits.right = tmp.bottomRight.x; }
                            else if( tmp.topLeft.x < limits.left ){ limits.left = tmp.topLeft.x; }
                            if( tmp.bottomRight.y > limits.top ){ limits.top = tmp.bottomRight.y; }
                            else if( tmp.topLeft.y < limits.bottom ){ limits.bottom = tmp.topLeft.y; }
                        });
                        self.extremities.points = [ {x:limits.left,y:limits.top}, {x:limits.right,y:limits.top}, {x:limits.right,y:limits.bottom}, {x:limits.left,y:limits.bottom} ];
                    }
                    function updateExtremities(informParent=true){
                        self.log('::updateExtremities('+informParent+')');
        
                        //generate extremity points
                            self.extremities.points = [];
        
                            //if clipping is active and possible, the extremities of this group are limited to those of the clipping shape
                            //otherwise, gather extremities from children and calculate extremities here
                            if(clipping.active && clipping.stencil != undefined){
                                self.extremities.points = clipping.stencil.extremities.points.slice();
                            }else{
                                calculateExtremitiesBox();
                            }
                            if(self.devMode){self.log('::updateExtremities -> ' + 'extremities.points.length:',self.extremities.points.length);}
        
                        //generate bounding box from points
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
        
                        //update parent
                            if(informParent){ if(self.parent){self.parent.updateExtremities();} }
                    }
                    function augmentExtremities(shape){
                        self.log('::augmentExtremities('+JSON.stringify(shape)+')');
        
                        //get offset from parent
                            let offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            let newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
                        //run computeExtremities on new child
                            shape.computeExtremities(false,newOffset);
                        //augment points list
                            calculateExtremitiesBox();
                            if(self.devMode){self.log('::augmentExtremities -> ' + 'extremities.points.length:',self.extremities.points.length);}
                        //recalculate bounding box
                            self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function computeExtremities(informParent=true,offset){
                        self.log('::computeExtremities('+informParent+','+JSON.stringify(offset)+')');
                        
                        //get offset from parent, if one isn't provided
                            if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        //combine offset with group's position, angle and scale to produce new offset for chilren
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            let newOffset = { 
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
                        self.log('::augmentExtremities_add('+JSON.stringify(shape)+')');
        
                        //get offset from parent
                            let offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                        //combine offset with group's position, angle and scale to produce new offset for children
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            let newOffset = { 
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
                            self.log('::augmentExtremities_add -> ' + 'extremities.points.length:', self.extremities.points.length);
        
                        //inform parent of change
                            if(self.parent){self.parent.updateExtremities();}
                    }
                    function augmentExtremities_remove(shape){
                        self.log('::augmentExtremities_remove('+JSON.stringify(shape)+')');
                        //(this function assumes that the shape has already been removed from the 'children' variable)
                        //is the shape's bounding box within the bounding box of the group; if so, no recalculation need be done
                        //otherwise the shape is touching the boundary, in which case search through the children for another 
                        //shape that also touches the boundary, or find the closest shape and adjust the boundary to touch that
        
                        let data = {
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
                            self.log('::augmentExtremities_remove -> easy remove: no changes to the group\'s bounding box required');
                            return;
                        }else{
                            ['topLeft','bottomRight'].forEach(cornerName => {
                                ['x','y'].forEach(axisName => {
                                    if(data[cornerName][axisName] == 0){
                                        self.log('::augmentExtremities_remove -> ' + cornerName+'_'+axisName+' is at boundary');
        
                                        let boundaryToucherFound = false;
                                        let closestToBoundary = {distance:undefined, position:undefined};
                                        for(let a = 0; a < children.length; a++){
                                            let tmp = Math.abs(children[a].extremities.boundingBox[cornerName][axisName] - self.extremities.boundingBox[cornerName][axisName]);
                                            if(closestToBoundary.distance == undefined || closestToBoundary.distance > tmp){
                                                closestToBoundary = { distance:tmp, position:children[a].extremities.boundingBox[cornerName][axisName] };
                                                if(closestToBoundary.distance == 0){ boundaryToucherFound = true; break; }
                                            }
                                        }
        
                                        if(!boundaryToucherFound){
                                            self.log('::augmentExtremities_remove -> need to adjust the bounding box');
                                            self.extremities.boundingBox[cornerName][axisName] = closestToBoundary.position;
                                        }
                                    }
                                });
                            });
                        }
                    }
                    
                    this.getOffset = function(){
                        if(this.parent){
                            let offset = this.parent.getOffset();
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
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
                        core.render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:0,b:0,a:0.75});
                        core.render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:0,b:0,a:0.75});
                    }
                    this.render = function(context, offset){
                        self.log('.render(-context-,'+JSON.stringify(offset)+')');
        
                        //combine offset with group's position, angle and scale to produce new offset for children
                            let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                            let newOffset = { 
                                x: point.x*offset.scale + offset.x,
                                y: point.y*offset.scale + offset.y,
                                scale: offset.scale*scale,
                                angle: offset.angle + angle,
                            };
        
                        //activate clipping (if requested, and is possible)
                            self.log('.render -> clipping:',JSON.stringify(clipping));
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
                            self.log('.render -> child count:',children.length);
                            children.forEach(function(a){
                                if(
                                    self.alwaysRenderChildren ||
                                    library.math.detectOverlap.boundingBoxes(
                                        clipping.active ? self.extremities.boundingBox : core.viewport.getBoundingBox(),
                                        a.extremities.boundingBox
                                    )
                                ){ 
                                    self.log('.render -> rendering:',JSON.stringify(a));
                                    a.render(context,newOffset);
                                }else{
                                    self.log('.render -> not rendering child');
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
            this.rectangle = function(){
                let self = this;
        
                //reporting
                    this.log = function(){
                        if(!self.devMode){return;}
                        let prefix = 'core.shape.library.rectangle ' + self.getAddress() + ' ';
                        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(129, 80, 161); font-style:italic;' );
                    };
        
                //attributes 
                    //protected attributes
                        const type = 'rectangle'; this.getType = function(){return type;}
        
                    //simple attributes
                        this.name = '';
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                        this.ignored = false;
                        this.colour = {r:1,g:0,b:0,a:1};
                    //advanced use attributes
                        this.devMode = false;
                        this.stopAttributeStartedExtremityUpdate = false;
        
                    //attributes pertinent to extremity calculation
                        let x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      self.log('.x('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      self.log('.y('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  self.log('.angle('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; self.log('.anchor('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  self.log('.width('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; self.log('.height('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
                        let scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  self.log('.scale('+a+')'); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
        
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
        
                            context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                            context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                            context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                            context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                            context.uniform2f(uniformLocations["dimensions"], width, height);
                            context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                            context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                    }
                    let program;
                    function activateGLRender(context,adjust){
                        if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                
                        context.useProgram(program);
                        updateGLAttributes(context,adjust);
                        context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                    }
        
                //extremities
                    function computeExtremities(informParent=true,offset){
                        self.log('::computeExtremities('+informParent+','+JSON.stringify(offset)+')');
                        
                        //get offset from parent, if one isn't provided
                            if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
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
                            self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        //draw bounding box top left and bottom right points
                            core.render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                            core.render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
                    };
                    this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                        self.log('.render(-context-,'+JSON.stringify(offset)+')');
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
        };
    
        this.checkShape = function(name,shape){
            self.log('.checkShape('+JSON.stringify(name)+','+(typeof(shape)=='function'?'-function code-':'-not function code-')+')');
            let tmp = new shape();
    
            if(name == undefined || shape == undefined){ return 'shape or name missing'; }
            if(tmp.getType() != name){ return 'internal type ('+tmp.getType()+') does not match key ('+name+')';  }
    
            self.log('.checkShape -> all good');
            return '';
        };
        this.checkShapes = function(list){
            self.log('.checkShapes('+JSON.stringify(list)+')');
            for(item in list){
                let response = this.checkShape(item, list[item]);
                if(response.length != 0){ console.error('core.shapes error:', item, '::', response); }
            }
        };
        this.create = function(type){
            self.log('.create('+JSON.stringify(type)+')');
            try{ return new this.library[type](); }
            catch(e){
                console.warn('the shape type: "'+type+'" could not be found');
                console.error(e);
            }
        };

        this.selfTest = function(){
            self.log('.selfTest() - '+Object.keys(this.library).length+' to test');
            this.checkShapes(this.library);
        };
    };
    this.arrangement = new function(){
        const self = this;
        this.log = function(){
            if(!core.devMode.arrangement){return;}
            let prefix = 'core.arrangement';
            console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(161, 108, 80); font-style:italic;' );
        };
    
        let design;
       
        this.new = function(){ self.log('.new()'); design = core.shape.create('group'); design.name = 'root'; };
        this.get = function(){ self.log('.get()'); return design; };
        this.set = function(arrangement){ self.log('.set('+JSON.stringify(arrangement)+')'); design = arrangement; };
        this.prepend = function(element){ self.log('.prepend('+JSON.stringify(element)+')'); design.prepend(element); };
        this.append = function(element){ self.log('.append('+JSON.stringify(element)+')'); design.append(element); };
        this.remove = function(element){ self.log('.remove('+JSON.stringify(element)+')'); design.remove(element); };
        this.clear = function(){ self.log('.clear()'); design.clear(); };
    
        this.getElementByAddress = function(address){
            self.log('.getElementByAddress('+address+')');
            let route = address.split('/'); route.shift(); route.shift(); 
    
            let currentObject = design;
            route.forEach(function(a){
                currentObject = currentObject.getChildByName(a);
            });
    
            return currentObject;
        };
        this.getElementsUnderPoint = function(x,y){ self.log('.getElementsUnderPoint('+x+','+y+')'); return design.getElementsUnderPoint(x,y); };
        this.getElementsUnderArea = function(points){ self.log('.getElementsUnderArea('+JSON.stringify(points)+')'); return design.getElementsUnderArea(points); };
        this.printTree = function(mode='spaced'){//modes: spaced / tabular / address
            if(mode == 'spaced'){
                console.log('- '+design.getType() +': '+ design.name);
            }else if(mode == 'tabular'){
                console.log('- \t'+design.getType() +': '+ design.name);
            }else if(mode == 'address'){
                console.log('/'+design.getType() +':'+ design.name);
            }

            function recursivePrint(grouping,prefix=''){
                grouping.children.forEach((a) => {
                    let newPrefix = prefix;
                    if(mode == 'spaced'){        newPrefix += '- ';
                    }else if(mode == 'tabular'){ newPrefix += '- \t';
                    }else if(mode == 'address'){ newPrefix += '/';
                    }

                    console.log(newPrefix+a.type +':'+ a.name);
                    if(a.type == 'group'){ recursivePrint(a, newPrefix+a.name) }
                });
            }
    
            recursivePrint(design.getTree(), '');
        };

        this.selfTest = function(){
            self.log('.selfTest()');
            this.printTree();
        };
    };
    this.render = new function(){
        const self = this;
        this.log = function(){
            if(!core.devMode.render){return;}
            let prefix = 'core.render';
            console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(80, 134, 161); font-style:italic;' );
        };

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
                self.log('.produceProgram("'+name+'",'+vertexShaderSource+','+fragmentShaderSource+')');
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
                self.log('.clearColour('+colour+')');
                if(colour == undefined){ return clearColour; }
                clearColour = colour;
                context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
            };
            this.adjustCanvasSize = function(newWidth, newHeight){
                self.log('.adjustCanvasSize('+newWidth+','+newHeight+')');
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
                self.log('.refreshCoordinates()');
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
                self.log('.refresh()');
                this.clearColour(clearColour);
                this.adjustCanvasSize();
                this.refreshCoordinates();
                this.frameRateLimit(this.frameRateLimit());
            };

        //frame rate control
            const frameRateControl = {active:false, previousRenderTime:Date.now(), limit:30, interval:0};
            this.activeLimitToFrameRate = function(a){
                self.log('.activeLimitToFrameRate('+a+')');
                if(a==undefined){return frameRateControl.active;}
                frameRateControl.active=a
            };
            this.frameRateLimit = function(a){
                self.log('.frameRateLimit('+a+')');
                if(a==undefined){ return frameRateControl.limit; }
                frameRateControl.limit=a;
                frameRateControl.interval=1000/frameRateControl.limit;
            };

        //actual render
            function renderFrame(){
                self.log('::renderFrame()');
                context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
                core.arrangement.get().render(context,{x:0,y:0,scale:1,angle:0});
                let transferableImage = canvas.transferToImageBitmap();
                communicationModule.run({function:'printToScreen',arguments:[transferableImage]},undefined,[transferableImage])
            }
            function animate(timestamp){
                self.log('::animate('+timestamp+')');
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
            this.frame = function(noClear=false){self.log('.frame('+noClear+')');renderFrame(noClear);};
            this.active = function(bool){
                self.log('.active('+bool+')');
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

        this.selfTest = function(){
            self.log('.selfTest()');
            self.log('.selfTest -> pageData:'+JSON.stringify(pageData));
            self.log('.selfTest -> storedPrograms:'+JSON.stringify(storedPrograms));
            self.log('.selfTest -> frameRateControl:'+JSON.stringify(frameRateControl));
        };
    };
    this.viewport = new function(){
        const self = this;
        this.log = function(){
            if(!core.devMode.viewport){return;}
            let prefix = 'core.viewport';
            console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(161, 84, 80); font-style:italic;' );
        };

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
                    self.log('.adapter.windowPoint2workspacePoint('+x+','+y+')');
                    const position = core.viewport.position();
                    const scale = core.viewport.scale();
                    const angle = core.viewport.angle();

                    let tmp = {x:x, y:y};
                    tmp.x = (tmp.x - position.x)/scale;
                    tmp.y = (tmp.y - position.y)/scale;
                    tmp = library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);

                    return tmp;
                };
                // this.workspacePoint2windowPoint = function(x,y){
                //     let position = core.viewport.position();
                //     let scale = core.viewport.scale();
                //     let angle = core.viewport.angle();

                //     let point = library.math.cartesianAngleAdjust(x,y,angle);

                //     return {
                //         x: (point.x+position.x) * scale,
                //         y: (point.y+position.y) * scale
                //     };
                // };
            };

        //camera position
            this.position = function(x,y){
                self.log('.position('+x+','+y+')');
                if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
                state.position.x = x;
                state.position.y = y;

                core.arrangement.get().children().forEach(function(item){
                    if(item.heedCamera){ 
                        self.log('.position -> adjusting:',JSON.stringify(item));
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
                self.log('.scale('+s+')');
                if(s == undefined){return state.scale;}
                state.scale = s <= 0 ? 1 : s;
                core.arrangement.get().children().forEach(function(item){
                    if(item.heedCamera){ 
                        self.log('.scale -> adjusting:',JSON.stringify(item));
                        item.scale(state.scale);
                    }
                });
                calculateViewportExtremities();

                self.onCameraAdjust( Object.assign({},state) );
            };
            this.angle = function(a){
                self.log('.angle('+a+')');
                if(a == undefined){return state.angle;}
                state.angle = a;
                core.arrangement.get().children().forEach(function(item){
                    if(item.heedCamera){ 
                        self.log('.angle -> adjusting:',JSON.stringify(item));
                        item.angle(state.angle);
                    }
                });
                calculateViewportExtremities();

                self.onCameraAdjust( Object.assign({},state) );
            };

        //mouse interaction
            this.getElementUnderCanvasPoint = function(x,y){
                self.log('.getElementUnderCanvasPoint('+x+','+y+')');
                let xy = this.adapter.windowPoint2canvasPoint(x,y);
                return core.arrangement.getElementUnderPoint(xy.x,xy.y);
            };
            this.getElementsUnderCanvasArea = function(points){
                self.log('.getElementUnderCanvasPoint('+JSON.stringify(points)+')');
                return core.arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2canvasPoint(a.x,a.y)));
            };

        //misc
            function calculateViewportExtremities(){
                self.log('::calculateViewportExtremities()');
                const canvasDimensions = core.render.getCanvasDimensions();

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
                self.log('.refresh()');
                core.render.refresh();
                calculateViewportExtremities();
            };
            this.getBoundingBox = function(){ self.log('.getBoundingBox()'); return viewbox.boundingBox; };
            this.mousePosition = function(x,y){
                self.log('.mousePosition('+x+','+y+')');
                if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
                mouseData.x = x;
                mouseData.y = y;
            };
            this.clickVisibility = function(a){ self.log('.mousePosition('+a+')'); if(a==undefined){return mouseData.clickVisibility;} mouseData.clickVisibility=a; };
            this.getHeight = function(){ self.log('.getHeight()'); return viewbox.points.br.y - viewbox.points.tl.y; };        
            this.getWidth= function(){ self.log('.getWidth()'); return viewbox.points.br.x - viewbox.points.tl.x; };

        //callback
            this.onCameraAdjust = function(){};

        this.selfTest = function(){
            self.log('.selfTest()');
            self.log('.selfTest -> state:'+JSON.stringify(state));
            self.log('.selfTest -> viewbox:'+JSON.stringify(viewbox));
            self.log('.selfTest -> mouseData:'+JSON.stringify(mouseData));
        };
    };
    this.stats = new function(){
        let active = false;
        let average = 30;
        let lastTimestamp = 0;
    
        const framesPerSecond = {
            compute:function(timestamp){
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
            //if stats are turned off, just bail
                if(!active){return;}
    
            framesPerSecond.compute(timestamp);
        };
        this.active = function(bool){if(bool==undefined){return active;} active=bool;};
        this.getReport = function(){
            return {
                framesPerSecond: framesPerSecond.rate,
            };
        };
    };
};

//setup
    core.arrangement.new();
    core.viewport.refresh();

//attach communicationModule to core
    communicationModule.function['viewport.position'] = core.viewport.position;
    communicationModule.function['viewport.scale'] = core.viewport.scale;
    communicationModule.function['viewport.angle'] = core.viewport.angle;
    communicationModule.function['viewport.getElementUnderCanvasPoint'] = core.viewport.getElementUnderCanvasPoint;
    communicationModule.function['viewport.getElementsUnderCanvasArea'] = core.viewport.getElementsUnderCanvasArea;
    communicationModule.function['viewport.calculateViewportExtremities'] = core.viewport.calculateViewportExtremities;
    communicationModule.function['viewport.refresh'] = core.viewport.refresh;
    communicationModule.function['viewport.getBoundingBox'] = core.viewport.getBoundingBox;
    communicationModule.function['viewport.mousePosition'] = core.viewport.mousePosition;
    communicationModule.function['viewport.clickVisibility'] = core.viewport.clickVisibility;
    communicationModule.function['viewport.getHeight'] = core.viewport.getHeight;
    communicationModule.function['viewport.getWidth'] = core.viewport.getWidth;




//test
    console.log('-self test-');
    core.shape.selfTest();
    core.arrangement.selfTest();
    core.render.selfTest();
    core.viewport.selfTest();

    console.log('-render test-');
    console.log('-> add camera heeding group');
    let main = core.shape.create('group');
    main.name = 'main';
    main.heedCamera = true;
    core.arrangement.append(main);
    console.log('');

    console.log('-> add rectangle');
    let tmp = core.shape.create('rectangle');
    tmp.name = 'rectangle_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(10); 
    tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    main.append(tmp);
    console.log('');

    console.log('-> adjust camera position');
    core.viewport.position(10,10);
    console.log('');

    console.log('-> render frame');
    core.render.frame();
    console.log('');