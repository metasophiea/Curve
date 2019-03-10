this.characterString = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'characterString'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
            this.ignored = false;
            var colour = {r:1,g:0,b:0,a:1}; this.colour = function(a){ if(a==undefined){return colour;} colour = a; calculateStringCharacters(); };
        
        //attributes pertinent to extremity calculation
            var x = 0;               this.x =     function(a){ if(a==undefined){return x;}     x = a;        calculateStringCharacters(); computeExtremities(); };
            var y = 0;               this.y =     function(a){ if(a==undefined){return y;}     y = a;        calculateStringCharacters(); computeExtremities(); };
            var angle = 0;           this.angle = function(a){ if(a==undefined){return angle;} angle = a;    calculateStringCharacters(); computeExtremities(); };
            var width = 10;          this.width =  function(a){ if(a==undefined){return width;}  width = a;  calculateStringCharacters(); computeExtremities(); };
            var height = 10;         this.height = function(a){ if(a==undefined){return height;} height = a; calculateStringCharacters(); computeExtremities(); };
            var scale = 1;           this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  calculateStringCharacters(); computeExtremities(); };
            var calculationMode = 0; this.calculationMode = function(a){ if(a==undefined){return calculationMode;} calculationMode = a; calculateStringCharacters(); computeExtremities(); };

        //string
            var string = '';
            var children = [];
            function calculateStringCharacters(){
                children = [];
                var tmpString = String(string).split('');
                var cumulativeWidth = 0;
                var spacing = 0.1;

                switch(calculationMode){
                    default: case 0: 
                        var mux = 0;

                        tmpString.forEach(function(a){
                            if( library.character.vectorLibrary[a].ratio == undefined || library.character.vectorLibrary[a].ratio.x == undefined ){ mux += 1; }
                            else{ mux += library.character.vectorLibrary[a].ratio.x; }
                        });
                        mux += spacing * (tmpString.length-1);

                        var characterWidth = width/mux;
                        for(var a = 0; a < tmpString.length; a++){
                            if(tmpString[a] == ' '){ cumulativeWidth += characterWidth; continue; }

                            var tmp = _canvas_.core.shape.create('character');
                                tmp.character(tmpString[a]);
                                tmp.x(cumulativeWidth); 
                                tmp.y(height*tmp.offset().y);
                                tmp.width(characterWidth*tmp.ratio().x);
                                tmp.height(height*tmp.ratio().y);
                                tmp.colour = colour;
                                children.push(tmp);

                                cumulativeWidth += characterWidth*tmp.ratio().x + spacing*characterWidth;
                        }
                    break;
                    case 1: 
                        for(var a = 0; a < tmpString.length; a++){
                            if(tmpString[a] == ' '){ cumulativeWidth += width; continue; }

                            var tmp = _canvas_.core.shape.create('character');
                                tmp.character(tmpString[a]);
                                tmp.x(cumulativeWidth); 
                                tmp.y(height*tmp.offset().y);
                                tmp.width(width*tmp.ratio().x);
                                tmp.height(height*tmp.ratio().y);
                                tmp.colour = colour;
                                children.push(tmp);

                                cumulativeWidth += width*tmp.ratio().x + spacing*width;
                        }
                    break;
                    case 2: 
                        for(var a = 0; a < tmpString.length; a++){
                            if(tmpString[a] == ' '){ cumulativeWidth += width; continue; }

                            var tmp = _canvas_.core.shape.create('character');
                                tmp.character(tmpString[a]);
                                tmp.x(cumulativeWidth); 
                                tmp.y(height*tmp.offset().y - height/2);
                                tmp.width(width*tmp.ratio().x);
                                tmp.height(height*tmp.ratio().y);
                                tmp.colour = colour;
                                children.push(tmp);

                                cumulativeWidth += width*tmp.ratio().x + spacing*width;
                        }
                    break;
                    case 3: 
                        for(var a = 0; a < tmpString.length; a++){
                            if(tmpString[a] == ' '){ cumulativeWidth += width; continue; }

                            var tmp = _canvas_.core.shape.create('character');
                                tmp.character(tmpString[a]);
                                tmp.x(cumulativeWidth); 
                                tmp.y(height*tmp.offset().y - height/2);
                                tmp.width(width*tmp.ratio().x);
                                tmp.height(height*tmp.ratio().y);
                                tmp.colour = colour;
                                children.push(tmp);

                                cumulativeWidth += width*tmp.ratio().x + spacing*width;
                        }

                        children.forEach(a => a.x( a.x() - cumulativeWidth/2 ) );
                    break;
                    case 4: 
                        for(var a = 0; a < tmpString.length; a++){
                            if(tmpString[a] == ' '){ cumulativeWidth += width; continue; }

                            var tmp = _canvas_.core.shape.create('character');
                                tmp.character(tmpString[a]);
                                tmp.x(cumulativeWidth); 
                                tmp.y(height*tmp.offset().y - height/2);
                                tmp.width(width*tmp.ratio().x);
                                tmp.height(height*tmp.ratio().y);
                                tmp.colour = colour;
                                children.push(tmp);

                                cumulativeWidth += width*tmp.ratio().x + spacing*width;
                        }
                        children.forEach(a => a.x( a.x() - cumulativeWidth) );
                    break;
                }

                self.extremities.isChanged = true; 
                self.computeExtremities();
            }
            this.string = function(a){
                if(a==undefined){return string;}  
                string = a;
                calculateStringCharacters();
            };
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

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

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