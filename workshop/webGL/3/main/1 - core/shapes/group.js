this.group = function(){
    var self = this;

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
        
        //attributes pertinent to extremity calculation
            var x = 0;     this.x =     function(a){ if(a==undefined){return x;}     x = a;     computeExtremities(); };
            var y = 0;     this.y =     function(a){ if(a==undefined){return y;}     y = a;     computeExtremities(); };
            var angle = 0; this.angle = function(a){ if(a==undefined){return angle;} angle = a; computeExtremities(); };
            var scale = 1; this.scale = function(a){ if(a==undefined){return scale;} scale = a; computeExtremities(); };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

    //group functions
        function getChildByName(name){ return children.find(a => a.name == name); }
        function checkForName(name){ return getChildByName(name) != undefined; }
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

        var children = [];
        this.children = function(){return children;};
        this.getChildByName = getChildByName;
        this.contains = function(child){
            for(var a = 0; a < children.length; a++){
                if(children[a] === child){return true;}
            }
            return false;
        };
        this.append = function(shape){
            if( !isValidShape(shape) ){ return; }

            children.push(shape); 
            shape.parent = this;
            augmentExtremities_addChild(shape); 
        };
        this.prepend = function(shape){
            if( !isValidShape(shape) ){ return; }

            children.unshift(shape); 
            shape.parent = this;
            augmentExtremities_addChild(shape);
        };
        this.remove = function(shape){ augmentExtremities_removeChild(shape); children.splice(children.indexOf(shape), 1); };
        this.clear = function(){ children = []; };
        this.getElementsUnderPoint = function(x,y){
            var returnList = [];

            for(var a = children.length-1; a >= 0; a--){
                var item = children[a];

                if(item.ignored){continue;}

                if( _canvas_.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, item.extremities.boundingBox ) ){
                    if( item.getType() == 'group' ){
                        returnList = returnList.concat( item.getElementsUnderPoint(x,y) );
                    }else{
                        if( _canvas_.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, item.extremities.points ) ){
                            returnList = returnList.concat( item );
                        }
                    }
                }
            }

            return returnList;
        };
        this.getElementsUnderArea = function(points){
            var returnList = [];
            children.forEach(function(item){
                if(item.ignored){return;}

                if( _canvas_.library.math.detectOverlap.boundingBoxes( _canvas_.library.math.boundingBoxFromPoints(points), item.extremities.boundingBox ) ){
                    if( item.getType() == 'group' ){
                        returnList = returnList.concat( item.getElementUnderArea(points) );
                    }else{
                        if( _canvas_.library.math.detectOverlap.overlappingPolygons(points, item.extremities.points) ){
                            returnList = returnList.concat( item );
                        }
                    }
                }
            });

            return returnList;
        };
        this.getTree = function(){
            var result = {name:this.name,type:type,children:[]};

            children.forEach(function(a){
                if(a.getType() == 'group'){
                    result.children.push( a.getTree() );
                }else{
                    result.children.push({ type:a.getType(), name:a.name });
                }
            });

            return result;
        };

    //clipping
        var clipping = { stencil:undefined, active:false };
        this.stencil = function(shape){
            if(shape == undefined){return this.clipping.stencil;}
            clipping.stencil = shape;
            clipping.stencil.parent = this;
            computeExtremities();
        };
        this.clipActive = function(bool){
            if(bool == undefined){return clipping.active;}
            clipping.active = bool;
            computeExtremities();
        };

    //extremities
        function augmentExtremities_addChild(newShape){
            //if we're in clipping mode, no addition of a shape can effect the extremities 
                if(clipping.active && clipping.stencil != undefined){return;}
            //get offset from parent
                var offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
            //combine offset with group's position, angle and scale to produce new offset for chilren
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };
            //run computeExtremities on new child
                newShape.computeExtremities(false,newOffset);
            //add points to points list
                self.extremities.points = self.extremities.points.concat( newShape.extremities.points );
            //recalculate bounding box
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            //inform parent of change
                if(self.parent){self.parent.computeExtremities();}
        }
        function augmentExtremities_removeChild(departingShape){
            //if we're in clipping mode, no removal of a shape can effect the extremities 
                if(clipping.active && clipping.stencil != undefined){return;}
            //get offset from parent
                var offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
            //combine offset with group's position, angle and scale to produce new offset for chilren
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };
            //run computeExtremities on departing child
                departingShape.computeExtremities(false,newOffset);
            //remove matching points from points list
                var index = _canvas_.library.math.getIndexOfSequence(self.extremities.points,departingShape.extremities.points);
                if(index == undefined){console.error("core:: group shape: departing shape points not found");}
                self.extremities.points.splice(index, index+departingShape.extremities.points.length);
            //recalculate bounding box
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            //inform parent of change
                if(self.parent){self.parent.computeExtremities();}
        }
        function computeExtremities(informParent=true,offset){
            //get offset from parent
                if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }

            //combine offset with group's position, angle and scale to produce new offset for chilren
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
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

            //if clipping is active and possible, the extremities of this group are limited to those of the clipping shape
            //otherwise, gather extremities from children and calculate extremities here
                self.extremities.points = [];
                if(clipping.active && clipping.stencil != undefined){
                    self.extremities.points = self.extremities.points.concat(clipping.stencil.extremities.points);
                }else{ 
                    children.forEach(a => self.extremities.points = self.extremities.points.concat(a.extremities.points));
                }
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);

            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        this.computeExtremities = computeExtremities;
        this.getOffset = function(){
            if(this.parent){
                var offset = this.parent.getOffset();

                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale * scale,
                    angle: offset.angle + angle,
                };

                return adjust;
            }else{
                return {x:x ,y:y ,scale:scale ,angle:angle};
            }
        };

    //lead render
        function drawDotFrame(){
            // self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y,2,{r:0,g:0,b:1,a:1}) );

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //combine offset with group's position, angle and scale to produce new offset for children
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
                        context.stencilMask(0x00);
                }
            
            //render children
                children.forEach(function(a){
                    if(
                        _canvas_.library.math.detectOverlap.boundingBoxes(
                            clipping.active ? self.extremities.boundingBox : core.viewport.getBoundingBox(),
                            a.extremities.boundingBox
                        )
                    ){ a.render(context,newOffset); }
                });

            //disactivate clipping
                if(clipping.active){ context.disable(context.STENCIL_TEST); }

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        }
};