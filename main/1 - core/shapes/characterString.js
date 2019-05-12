this.characterString = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'characterString'; this.getType = function(){return type;}
            const vectorLibrary = library.character.vectorLibrary;
            const defaultFontName = 'defaultThin';

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
            this.ignored = false;
            var colour = {r:1,g:0,b:0,a:1}; this.colour = function(a){ if(a==undefined){return colour;} colour = a; recolourCharacters(); };
        //advanced use attributes
            this.onFontUpdateCallback = function(){};
            this.devMode = false;
            this.stopAttributeStartedExtremityUpdate = false;
        
        //attributes pertinent to extremity calculation
            var x = 0;           this.x =     function(a){   if(a==undefined){return x;}     x = a;         if(this.devMode){console.log(this.getAddress()+'::x');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var y = 0;           this.y =     function(a){   if(a==undefined){return y;}     y = a;         if(this.devMode){console.log(this.getAddress()+'::y');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var angle = 0;       this.angle = function(a){   if(a==undefined){return angle;} angle = a;     if(this.devMode){console.log(this.getAddress()+'::angle');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var width = 10;      this.width =  function(a){  if(a==undefined){return width;}  width = a;    if(this.devMode){console.log(this.getAddress()+'::width');} generateStringCharacters(); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var height = 10;     this.height = function(a){  if(a==undefined){return height;} height = a;   if(this.devMode){console.log(this.getAddress()+'::height');} generateStringCharacters(); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var scale = 1;       this.scale = function(a){   if(a==undefined){return scale;} scale = a;     if(this.devMode){console.log(this.getAddress()+'::scale');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var string = '';     this.string = function(a){  if(a==undefined){return string;} string = a;   if(this.devMode){console.log(this.getAddress()+'::string');} generateStringCharacters(); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var spacing = 0.5;   this.spacing = function(a){ if(a==undefined){return spacing;} spacing = a; if(this.devMode){console.log(this.getAddress()+'::spacing');} generateStringCharacters(); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); }
            var interCharacterSpacing = 0; 
                this.interCharacterSpacing = function(a){ if(a==undefined){return interCharacterSpacing;} interCharacterSpacing = a; if(this.devMode){console.log(this.getAddress()+'::interCharacterSpacing');} generateStringCharacters(); if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); }
            var font = defaultFontName;
                this.font =   function(newFont){
                    if(newFont==undefined){return font;}

                    if( library.character.isApprovedFont(newFont) ){
                        if( !library.character.fontLoadAttempted(newFont) ){ library.character.loadFont(newFont); }
                        if( !library.character.isFontLoaded(newFont) ){ setTimeout(function(){ self.font(newFont); },100,newFont); }
                        if(this.devMode){console.log(this.getAddress()+'::font - isLoaded:',library.character.isFontLoaded(newFont));} 

                        font = !library.character.isFontLoaded(newFont) ? defaultFontName : newFont;
                    }else{
                        console.warn('library.characterString : error : unknown font:',newFont);
                        font = defaultFontName;
                    }

                    generateStringCharacters(); 
                    if(this.devMode){console.log(this.getAddress()+'::font');} 
                    computeExtremities(); 
                    self.onFontUpdateCallback();
                };
            var printingMode = {
                widthCalculation:'absolute', //filling / absolute
                horizontal:'left',           //left    / middle   / right
                vertical:'bottom',           //top     / middle   / verymiddle / bottom
            };
                this.printingMode = function(a){
                    if(a==undefined){return printingMode;} 
                    printingMode = {
                        widthCalculation: a.widthCalculation != undefined || a.widthCalculation != '' ? a.widthCalculation : printingMode.widthCalculation,
                        horizontal: a.horizontal != undefined || a.horizontal != '' ? a.horizontal : printingMode.horizontal,
                        vertical: a.vertical != undefined || a.vertical != '' ? a.vertical : printingMode.vertical,
                    };

                    if(this.devMode){console.log(this.getAddress()+'::printingMode');} 
                    generateStringCharacters(); 

                    if(this.stopAttributeStartedExtremityUpdate){return;} 
                    computeExtremities(); 
                };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };
        
    //string
        var resultingWidth = 0;
        function recolourCharacters(){ children.forEach(a => a.colour = colour); }
        function generateStringCharacters(){
            if(self.devMode){console.log(self.getAddress()+'::generateStringCharacters');}

            clear();
            var tmpString = String(string).split('');
            var characterWidth = width;

            //printingMode
                //widthCalculation
                    if(printingMode.widthCalculation == 'filling'){
                        var internalWidth = 0;
                        tmpString.forEach(a => { internalWidth += vectorLibrary[font][a] ? vectorLibrary[font][a].right : spacing; });
                        characterWidth = characterWidth/internalWidth;
                    }
                //vertical
                    var verticalOffset = 0;
                    var highestPoint = 0;
                    if( printingMode.vertical == 'top'){ 
                        tmpString.forEach(a => {
                            var tmp = vectorLibrary[font][a] ? vectorLibrary[font][a].top : 0;
                            highestPoint = highestPoint > tmp ? tmp : highestPoint;
                        });
                        verticalOffset = height*-highestPoint;
                    }
                    if( printingMode.vertical == 'verymiddle' ){
                        tmpString.forEach(a => {
                            var tmp = vectorLibrary[font][a] ? vectorLibrary[font][a].top : 0;
                            highestPoint = highestPoint > tmp ? tmp : highestPoint;
                        });
                        verticalOffset = -(height/2)*highestPoint;
                    }                 
                    if( printingMode.vertical == 'middle' ){
                        highestPoint = vectorLibrary[font]['o'] ? vectorLibrary[font]['o'].top : 0;
                        verticalOffset = -(height/2)*highestPoint;
                    }                 

            //create character and add it to the group
                var cumulativeWidth = 0;
                for(var a = 0; a < tmpString.length; a++){
                    if(tmpString[a] == ' '){ cumulativeWidth += characterWidth*spacing; continue; }

                    var tmp = _canvas_.core.shape.create('character');
                        tmp.name = ''+a;
                        tmp.stopAttributeStartedExtremityUpdate = true;
                        tmp.character(tmpString[a]);
                        tmp.font(font);
                        tmp.x(cumulativeWidth);
                        tmp.y(verticalOffset);
                        tmp.width(characterWidth);
                        tmp.height(height);
                        tmp.stopAttributeStartedExtremityUpdate = false;
                        tmp.colour = colour;
                        append(tmp);

                    cumulativeWidth += (interCharacterSpacing + tmp.right()) * characterWidth;
                }

                resultingWidth = cumulativeWidth;

            //printingMode - horizontal
                if( printingMode.horizontal == 'middle' ){ children.forEach(a => a.x( a.x() - cumulativeWidth/2 ) ); }
                else if( printingMode.horizontal == 'right' ){ children.forEach(a => a.x( a.x() - cumulativeWidth) ); }
        }
        this.resultingWidth = function(){ return resultingWidth; };

    //group functions
        var children = [];

        function checkForName(name){ return children.find(a => a.name === name) != undefined; }
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
        function clear(){  children = []; }
        function append(shape){
            if( !isValidShape(shape) ){ return; }

            children.push(shape); 
            shape.parent = self;
            augmentExtremities_addChild(shape); 
        }

    //clipping
        var clipping = { stencil:undefined, active:false };
        this.stencil = function(shape){
            if(shape == undefined){return clipping.stencil;}
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
        function updateExtremities(informParent=true){
            if(self.devMode){console.log(self.getAddress()+'::updateExtremities');}

            //generate extremity points
                self.extremities.points = [];

                //if clipping is active and possible, the extremities of this group are limited to those of the clipping shape
                //otherwise, gather extremities from children and calculate extremities here
                if(clipping.active && clipping.stencil != undefined){
                    self.extremities.points = clipping.stencil.extremities.points.slice();
                }else{
                    children.forEach(a => self.extremities.points = self.extremities.points.concat(a.extremities.points));
                }

            //generate bounding box from points
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);

            //update parent
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        function augmentExtremities(shape){
            if(self.devMode){console.log(self.getAddress()+'::augmentExtremities');}

            //if we're in clipping mode, no addition of a shape can effect the extremities 
                if(clipping.active && clipping.stencil != undefined){return true;}
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
                shape.computeExtremities(false,newOffset);
        }
        function augmentExtremities_addChild(newShape){
            if(self.devMode){console.log(self.getAddress()+'::augmentExtremities_addChild - type:'+newShape.getType()+' - name:'+newShape.name);}

            //augment extremities, and bail if it was found that clipping is active
                if( augmentExtremities(newShape) ){ return; }
            //add points to points list
                self.extremities.points = self.extremities.points.concat( newShape.extremities.points );
            //recalculate bounding box
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            //inform parent of change
                if(self.parent){self.parent.updateExtremities();}
        }
        function computeExtremities(informParent=true,offset){
            if(self.devMode){console.log(self.getAddress()+'::computeExtremities');}
            
            //get offset from parent, if one isn't provided
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
            //update extremities
                updateExtremities(informParent,offset);
        }

        this.getOffset = function(){
            if(this.parent){
                var offset = this.parent.getOffset();
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
        };
};