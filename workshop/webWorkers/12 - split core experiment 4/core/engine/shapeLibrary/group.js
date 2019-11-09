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