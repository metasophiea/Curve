var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var canvas = __canvasElements[__canvasElements_count];
        canvas.library = new function(){};
        canvas.library.math = new function(){
            this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
            this.distanceBetweenTwoPoints = function(a, b){ return Math.pow(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2),0.5) };
            this.cartesian2polar = function(x,y){
                var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
            
                if(x === 0 ){
                    if(y === 0){ang = 0;}
                    else if(y > 0){ang = 0.5*Math.PI;}
                    else{ang = 1.5*Math.PI;}
                }
                else if(y === 0 ){
                    if(x >= 0){ang = 0;}else{ang = Math.PI;}
                }
                else if(x >= 0){ ang = Math.atan(y/x); }
                else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
            
                return {'dis':dis,'ang':ang};
            };
            this.polar2cartesian = function(angle,distance){
                return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
            };
            this.cartesianAngleAdjust = function(x,y,angle){
                var polar = this.cartesian2polar( x, y );
                polar.ang += angle;
                return this.polar2cartesian( polar.ang, polar.dis );
            };
            this.boundingBoxFromPoints = function(points){
                if(points.length == 0){
                    return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
                }
            
                var left = points[0].x; var right = points[0].x;
                var top = points[0].y;  var bottom = points[0].y;
            
                for(var a = 1; a < points.length; a++){
                    if( points[a].x < left ){ left = points[a].x; }
                    else if(points[a].x > right){ right = points[a].x; }
            
                    if( points[a].y < top ){ top = points[a].y; }
                    else if(points[a].y > bottom){ bottom = points[a].y; }
                }
            
                return {
                    topLeft:{x:left,y:top},
                    bottomRight:{x:right,y:bottom}
                };
            };
            this.pointsOfRect = function(x,y,width,height,angle=0,anchor={x:0,y:0}){
                var corners = {};
                var offsetX = anchor.x*width;
                var offsetY = anchor.y*height;
            
                var polar = this.cartesian2polar( offsetX, offsetY );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.tl = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX-width, offsetY );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.tr = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX-width, offsetY-height );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.br = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX, offsetY-height );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.bl = { x:(x - point.x), y:(y - point.y) };
            
                return [
                    corners.tl,
                    corners.tr, 
                    corners.br, 
                    corners.bl, 
                ];
            };
            this.pointsOfCircle = function(x,y,r,pointCount=3){
                var output = [];
                for(var a = 0; a < pointCount; a++){
                    output.push({
                        x: x + r*Math.sin(2*Math.PI*(a/pointCount)),
                        y: y + r*Math.cos(2*Math.PI*(a/pointCount)),
                    });
                }
                return output;
            };
            this.pointsOfText = function(text, x, y, angle, size, font, alignment, baseline){
                //requires that the font size be in 'pt'
            
                //determine text width
                    var width = 0;
                    var cnv = document.createElement('canvas');
                    var context = cnv.getContext('2d');
            
                    context.font = font;
                    context.textAlign = alignment;
                    context.textBaseline = baseline;
            
                    var d = context.measureText(text);
                    width = d.width/size;
            
                //determine text height
                    var height = font.split('pt')[0].split(' ').pop();
                    height = height/size;
            
                //adjust for angle
                    var points = [{x:x, y:y}, {x:x+width, y:y}, {x:x+width, y:y-height}, {x:x, y:y-height}];
                    for(var a = 0; a < points.length; a++){
                        points[a] = this.cartesianAngleAdjust(points[a].x-x,points[a].y-y,angle);
                        points[a].x += x;
                        points[a].y += y;
                    }
            
                return points;
            };
            this.detectOverlap = new function(){
                this.boundingBoxes = function(a, b){
                    return !(
                        (a.bottomRight.y < b.topLeft.y) ||
                        (a.topLeft.y > b.bottomRight.y) ||
                        (a.bottomRight.x < b.topLeft.x) ||
                        (a.topLeft.x > b.bottomRight.x)   
                );};
                this.pointWithinBoundingBox = function(point,box){
                    return !(
                        point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
                        point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
                    );
                };
                this.pointWithinPoly = function(point,points){
                    var inside = false;
                    for(var a = 0, b = points.length - 1; a < points.length; b = a++) {
                        if(
                            ((points[a].y > point.y) != (points[b].y > point.y)) && 
                            (point.x < ((((points[b].x-points[a].x)*(point.y-points[a].y)) / (points[b].y-points[a].y)) + points[a].x))
                        ){inside = !inside;}
                    }
                    return inside;
                };
            };

        };
        canvas.library.structure = new function(){
            this.functionListRunner = function(list){
                //function builder for working with the 'functionList' format
            
                return function(event,data){
                    //run through function list, and activate functions where necessary
                        for(var a = 0; a < list.length; a++){
                            var shouldRun = true;
            
                            //determine if all the requirements of this function are met
                                for(var b = 0; b < list[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[list[a].specialKeys[b]];
                                    if(!shouldRun){break;} //(one is already not a match, so save time and just bail here)
                                }
            
                            //if all requirements were met, run the function
            	            if(shouldRun){  
                   	                //if the function returns 'false', continue with the list; otherwise stop here
                    	            if( list[a].function(event,data) ){ break; }
                            	}
                        }
                }
            };

        };
        canvas.library.audio = new function(){

        };
        

        canvas.core = new function(){
            var core = new function(){
                var core = this;
                
                var adapter = new function(){
                    this.length = function(l){
                        return l*core.viewport.scale();
                    };
                    this.windowPoint2workspacePoint = function(x,y){
                        var position = core.viewport.position();
                        var scale = core.viewport.scale();
                        var angle = core.viewport.angle();
                
                        x = (x/scale) - position.x;
                        y = (y/scale) - position.y;
                
                        return canvas.library.math.cartesianAngleAdjust(x,y,-angle);
                    };
                    this.workspacePoint2windowPoint = function(x,y){
                        var position = core.viewport.position();
                        var scale = core.viewport.scale();
                        var angle = core.viewport.angle();
                
                        var point = canvas.library.math.cartesianAngleAdjust(x,y,angle);
                
                        return {
                            x: (point.x+position.x) * scale,
                            y: (point.y+position.y) * scale
                        };
                    };
                };
                var shapes = new function(){
                    this.polygon = function(){
                    
                        this.type = 'polygon';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.points = [];
                    
                        this.style = {
                            fill:'rgba(100,255,255,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            lineJoin:'round',
                            miterLimit:2,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:20,
                            shadowOffset:{x:20, y:20},
                        };
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = this.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    points: this.points.map( function(a){
                                        a = canvas.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
                                        return { x:a.x+offset.x, y:a.y+offset.y };
                                    } ),
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.points = shapeValue.points.map( function(a){ return adapter.workspacePoint2windowPoint(a.x, a.y); } );
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //paint this shape as requested
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.lineJoin = this.style.lineJoin;
                                context.miterLimit = this.style.miterLimit;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                                context.beginPath(); 
                                context.moveTo(shapeValue.points[0].x,shapeValue.points[0].y);
                                for(var a = 1; a < shapeValue.points.length; a++){
                                    context.lineTo(shapeValue.points[a].x,shapeValue.points[a].y);
                                }
                                context.closePath(); 
                    
                                context.fill(); 
                                context.stroke();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    
                    };
                    this.circle = function(){
                    
                        this.type = 'circle';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.r = 2;
                    
                        this.style = {
                            fill:'rgba(255,100,255,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:1, y:1},
                        };
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = canvas.library.math.pointsOfCircle(this.x, this.y, this.r, 10);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            return canvas.library.math.distanceBetweenTwoPoints( {x:x,y:y},shape ) <= shape.r;
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                            if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.parentAngle);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    radius:this.r,
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.location = adapter.workspacePoint2windowPoint(shapeValue.location.x,shapeValue.location.y);
                                shapeValue.radius = adapter.length(shapeValue.radius);
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //paint this shape as requested
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                                context.beginPath();
                                context.arc(shapeValue.location.x,shapeValue.location.y, shapeValue.radius, 0, 2 * Math.PI, false);
                                context.closePath(); 
                                context.fill();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                    this.image = function(){
                    
                        this.type = 'image';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.angle = 0;
                        this.anchor = {x:0,y:0};
                        this.width = 10;
                        this.height = 10;
                    
                        this.url = '';
                        var imageObject = {};
                    
                        this.style = {
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:1, y:1},
                        };
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = canvas.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.parentAngle);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    angle:(this.angle+offset.a),
                                    width: this.width,
                                    height: this.height,
                                    lineWidth: this.style.lineWidth,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.location = adapter.workspacePoint2windowPoint( (shapeValue.location.x - this.anchor.x*shapeValue.width), (shapeValue.location.y - this.anchor.y*shapeValue.height) );              
                                shapeValue.width = adapter.length(shapeValue.width);
                                shapeValue.height = adapter.length(shapeValue.height);
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //post adaptation calculations
                                shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
                            //if this image url is not cached; cache it
                                if( !imageObject.hasOwnProperty(this.url) ){
                                    imageObject[this.url] = new Image(); 
                                    imageObject[this.url].src = this.url;
                                }
                    
                            //actual render
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                                context.save();
                                context.rotate( shapeValue.angle );
                                context.drawImage( imageObject[this.url], shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
                                context.restore();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        }
                    
                    };
                    this.path = function(){
                    
                        this.type = 'path';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.points = [];
                    
                        this.style = {
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            lineCap:'round',
                            lineJoin:'round',
                            miterLimit:2,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:20,
                            shadowOffset:{x:20, y:20},
                        };
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = this.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    points: this.points.map( function(a){
                                        a = canvas.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
                                        return { x:a.x+offset.x, y:a.y+offset.y };
                                    } ),
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.points = shapeValue.points.map( function(a){ return adapter.workspacePoint2windowPoint(a.x, a.y); } );
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //paint this shape as requested
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.lineCap = this.style.lineCap;
                                context.lineJoin = this.style.lineJoin;
                                context.miterLimit = this.style.miterLimit;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                                context.beginPath(); 
                                context.moveTo(shapeValue.points[0].x,shapeValue.points[0].y);
                                for(var a = 1; a < shapeValue.points.length; a++){
                                    context.lineTo(shapeValue.points[a].x,shapeValue.points[a].y);
                                }
                    
                                context.stroke();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                    this.rectangle = function(){
                    
                        this.type = 'rectangle';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.angle = 0;
                        this.anchor = {x:0,y:0};
                        this.width = 10;
                        this.height = 10;
                    
                        this.style = {
                            fill:'rgba(255,100,255,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:1, y:1},
                        };
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = canvas.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.parentAngle);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    angle:(this.angle+offset.a),
                                    width: this.width,
                                    height: this.height,
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                if(!static){
                                    shapeValue.location = adapter.workspacePoint2windowPoint( (shapeValue.location.x - this.anchor.x*shapeValue.width), (shapeValue.location.y - this.anchor.y*shapeValue.height) );              
                                    shapeValue.width = adapter.length(shapeValue.width);
                                    shapeValue.height = adapter.length(shapeValue.height);
                                    shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                    shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                    shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                    shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                                }
                    
                            //post adaptation calculations
                                shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
                            //actual render
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                                context.save();
                                context.rotate( shapeValue.angle );
                                context.fillRect( shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
                                context.strokeRect( shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
                                context.restore();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        }
                    };
                    this.group = function(){
                    
                        this.type = 'group';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.angle = 0;
                        this.children = [];
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        function checkElementIsValid(group,element){
                            if(element == undefined){return group.getAddress()+' >> no element provided';}
                    
                            //check for name
                                if(element.name == undefined || element.name == ''){return group.getAddress()+' >> element has no name'}
                        
                            //check that the name is not already taken in this grouping
                                for(var a = 0; a < group.children.length; a++){
                                    if( group.children[a].name == element.name ){ 
                                        console.error('element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+parent.name+'"')+''); 
                                        return;
                                    }
                                }
                        }
                        this.prepend = function(element){
                            //check that the element is valid
                                var temp = checkElementIsValid(this,element);
                                if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                            //actually add the element
                                this.children.unshift(element);
                    
                            //inform element of who it's parent is
                                element.parent = this;
                    
                            //computation of extremities
                                element.computeExtremities(undefined,true);
                        };
                        this.append = function(element){
                            //check that the element is valid
                                var temp = checkElementIsValid(this, element);
                                if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                            //actually add the element
                                this.children.push(element);
                    
                            //inform element of who it's parent is
                                element.parent = this;
                    
                            //computation of extremities
                                element.computeExtremities(undefined,true);
                        };
                        this.remove = function(element){
                            //check that an element was provided
                                if(element == undefined){return;}
                    
                            //get index of element (if this element isn't in the group, just bail)
                                var index = this.children.indexOf(element);
                                if(index < 0){return;}
                    
                            //actual removal
                                this.children.splice(index, 1);
                    
                            //computation of extremities
                                this.computeExtremities();
                        };
                        this.clear = function(){
                            //empty out children
                                this.children = [];
                    
                            //computation of extremities
                                this.computeExtremities();
                        };
                        this.getChildByName = function(name){
                            for(var a = 0; a < this.children.length; a++){
                                if( this.children[a].name == name ){ return this.children[a]; }
                            }
                        };
                        this.getElementsWithName = function(name){
                            var result = [];
                            for(var a = 0; a < this.children.length; a++){
                                if( this.children[a].name == name ){
                                    result.push(this.children[a]);
                                }
                                if( this.children[a].type == 'group' ){
                                    var list = this.children[a].getElementsWithName(name);
                                    for(var b = 0; b < list.length; b++){ result.push( list[b] ); } //because concat doesn't work
                                }
                            }
                            return result;
                        };
                    
                        this.computeExtremities = function(offset,deepCompute=false){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //if 'deepCompute' is set, recalculate the extremities for all children
                                if(deepCompute){
                                    for(var a = 0; a < this.children.length; a++){
                                        this.children[a].computeExtremities({
                                            x: this.x     + (offset.x != undefined ? offset.x : 0),
                                            y: this.y     + (offset.y != undefined ? offset.y : 0),
                                            a: this.angle + (offset.a != undefined ? offset.a : 0),
                                        },true);
                                    }
                                }
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                //the points for a group, is just the four corners of the bounding box, calculated using
                                //the bounding boxes of all the children
                                //  -> this method needs to be trashed <-
                                var temp = [];
                                for(var a = 0; a < this.children.length; a++){
                                    temp.push(this.children[a].extremities.boundingBox.topLeft);
                                    temp.push(this.children[a].extremities.boundingBox.bottomRight);
                                }
                                temp = canvas.library.math.boundingBoxFromPoints( temp );
                                this.extremities.points = [
                                    { x: temp.topLeft.x, y: temp.topLeft.y, },
                                    { x: temp.bottomRight.x, y: temp.topLeft.y, },
                                    { x: temp.bottomRight.x, y: temp.bottomRight.y, },
                                    { x: temp.topLeft.x, y: temp.bottomRight.y, },
                                ];
                                
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                        this.getElementUnderPoint = function(x,y,static=false){
                            //go through the children in reverse order, discovering if
                            //  the object is not ignored and,
                            //  the point is within their bounding box
                            //if so; if it's a group, follow the 'getElementUnderPoint' function down
                            //if it's not, return that shape
                            //otherwise, carry onto the next shape
                    
                            for(var a = this.children.length-1; a >= 0; a--){
                                //if child shape is statc (or any of its parents), use adjusted x and y values for 'isPointWithin' judgement
                                    var point = (this.children[a].static || static) ? adapter.workspacePoint2windowPoint(x,y) : {x:x,y:y};
                    
                                    if( !this.children[a].ignored && this.children[a].isPointWithin(point.x,point.y) ){
                                        if( this.children[a].type == 'group' ){
                                            var temp = this.children[a].getElementUnderPoint(x,y,(this.children[a].static || static));
                                            if(temp != undefined){return temp;}
                                        }else{
                                            return this.children[a];
                                        }
                                    }
                            }
                        };
                    
                        function shouldRender(shape){
                            //if this shape is static, always render
                                if(shape.static){return true;}
                    
                            //if any of this shape's children are static, render the group (and let the individuals decide to render themselves or not)
                                for(var a = 0; a < shape.children.length; a++){ if(shape.children[a].static){return true;} }
                    
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.parentAngle);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                    
                            //cycle through all children, activating their render functions
                                for(var a = 0; a < this.children.length; a++){
                                    var item = this.children[a];
                    
                                    item.render(
                                        context,
                                        {
                                            a: offset.a + this.angle,
                                            x: offset.x + this.x,
                                            y: offset.y + this.y,
                                            parentAngle: this.angle,
                                        },
                                        (static||item.static)
                                    );
                                }
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                    this.text = function(){
                    
                        this.type = 'text';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.text = 'curvie-gH';
                        this.angle = 0;
                        this.size = 1;
                    
                        this.style = {
                            font:'30pt Arial',
                            align:'start',                  // start/end/center/lief/right 
                            baseline:'alphabetic',          // alphabetic/top/hanging/middle/ideographic/bottom
                            fill:'rgba(255,100,100,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:20, y:20},
                        };
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = canvas.library.math.pointsOfText( this.text, this.x, this.y, this.angle, 1/this.size, this.style.font, this.style.align, this.style.baseline );
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.parentAngle);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    size: this.size,
                                    angle:(this.angle+offset.a),
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.location = adapter.workspacePoint2windowPoint( shapeValue.location.x, shapeValue.location.y );   
                          
                                shapeValue.size = adapter.length(shapeValue.size);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //post adaptation calculations
                                shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
                            //actual render
                                context.font = this.style.font;
                                context.textAlign = this.style.align;
                                context.textBaseline = this.style.baseline;
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                                context.save();
                                context.rotate( shapeValue.angle );
                                context.scale(shapeValue.size,shapeValue.size);
                                context.fillText( this.text, shapeValue.location.x/shapeValue.size, shapeValue.location.y/shapeValue.size );
                                context.shadowColor = 'rgba(0,0,0,0)'; //to stop stroke shadows drawing over the fill text (an uncreative solution)
                                context.strokeText( this.text, shapeValue.location.x/shapeValue.size, shapeValue.location.y/shapeValue.size );
                                context.restore();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                }
                function gatherParentOffset(element){
                    var offset = {x:0,y:0,a:0};
                        //gather x, y, and angle data from this element up
                            var offsetList = [];
                            var temp = element;
                            while((temp=temp.parent) != undefined){
                                offsetList.unshift( {x:temp.x, y:temp.y, a:temp.angle} );
                            }
                        //calculate them together into an offset
                            offset = { 
                                x: offsetList[0]!=undefined ? offsetList[0].x : 0,
                                y: offsetList[0]!=undefined ? offsetList[0].y : 0,
                                a: 0
                            };
                            for(var a = 1; a < offsetList.length; a++){
                                var point = canvas.library.math.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,-(offset.a+offsetList[a-1].a));
                                offset.a += offsetList[a-1].a;
                                offset.x += point.x;
                                offset.y += point.y;
                            }
                            offset.a += offsetList[offsetList.length-1]!=undefined ? offsetList[offsetList.length-1].a : 0;
                
                    return offset;
                }
                
                
                
                
                
                this.arrangement = new function(){
                    var design = new shapes.group;
                    design.name = 'root';
                
                    this.createElement = function(type){ return new shapes[type]; };
                    this.clear = function(){ design.clear(); };
                    this.get = function(){return design;};
                    this.set = function(arrangement){design = arrangement;};
                    this.prepend = function(element){ design.prepend(element); };
                    this.append = function(element){ design.append(element); };
                    this.remove = function(element){ design.remove(element); };
                    this.getElementUnderPoint = function(x,y){ return design.getElementUnderPoint(x,y); };
                    this.getElementsWithName = function(name){ return design.getElementsWithName(name); };
                };
                this.viewport = new function(){
                    var pageData = {
                        defaultSize:{width:640, height:480},
                        width:0, height:0,
                        windowWidth:0, windowHeight:0,
                    };
                    var state = {
                        position:{x:0,y:0},
                        scale:1,
                        angle:0,
                        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
                    };
                    var mouseData = { 
                        x:undefined, 
                        y:undefined, 
                        stopScrollActive:true
                    };
                
                    function adjustCanvasSize(){
                        var changesMade = false;
                
                        function dimensionAdjust(direction){
                            var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)
                
                            var attribute = canvas.getAttribute('workspace'+Direction);
                            if( pageData[direction] != attribute || pageData['window'+Direction] != window['inner'+Direction] ){
                                //save values for future reference
                                    pageData[direction] = attribute;
                                    pageData['window'+Direction] = window['inner'+Direction];
                
                                //adjust canvas dimension based on the size requirement set out in the workspace attribute
                                    if(attribute == undefined){
                                        canvas[direction] = pageData.defaultSize[direction];
                                    }else if( attribute.indexOf('%') == (attribute.length-1) ){
                                        var parentSize = canvas.parentElement['offset'+Direction]
                                        var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                                        canvas[direction] = parentSize * percent;
                                    }else{
                                        canvas[direction] = attribute;
                                    }
                
                                changesMade = true;
                            }
                        }
                
                        dimensionAdjust('width');
                        dimensionAdjust('height');
                
                        if(changesMade){ calculateViewportExtremities(); }
                    }
                    function calculateViewportExtremities(){
                        //for each corner of the viewport; find out where they lie on the workspace
                            state.points.tl = adapter.windowPoint2workspacePoint(0,0);
                            state.points.tr = adapter.windowPoint2workspacePoint(canvas.width,0);
                            state.points.bl = adapter.windowPoint2workspacePoint(0,canvas.height);
                            state.points.br = adapter.windowPoint2workspacePoint(canvas.width,canvas.height);
                        
                        //calculate a bounding box for the viewport from these points
                            state.boundingBox = canvas.library.math.boundingBoxFromPoints([state.points.tl, state.points.tr, state.points.br, state.points.bl]);
                    }
                
                    this.position = function(x,y){
                        if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
                        state.position.x = x;
                        state.position.y = y;
                        calculateViewportExtremities();
                    };
                    this.scale = function(s){
                        if(s == undefined){return state.scale;}
                        state.scale = s;
                        calculateViewportExtremities();
                    };
                    this.angle = function(a){
                        if(a == undefined){return state.angle;}
                        state.angle = a;
                        calculateViewportExtremities();
                    };
                    this.windowPoint2workspacePoint = function(x,y){ return adapter.windowPoint2workspacePoint(x,y); };
                
                    this.refresh = function(){
                        adjustCanvasSize();
                        calculateViewportExtremities();
                        canvas.setAttribute('tabIndex',1); //enables keyboard input
                    };
                    this.getBoundingBox = function(){return state.boundingBox;};
                    this.mousePosition = function(x,y){
                        if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
                        mouseData.x = x;
                        mouseData.y = y;
                    };
                    this.stopMouseScroll = function(bool){
                        if(bool == undefined){return mouseData.stopScrollActive;}
                        mouseData.stopScrollActive = bool;
                
                        //just incase; make sure that scrolling is allowed again when 'stopMouseScroll' is turned off
                        if(!bool){ document.body.style.overflow = ''; }
                    };
                };
                this.render = new function(){
                    var context = canvas.getContext('2d', { alpha: true });
                    var animationRequestId = undefined;
                
                    function clearFrame(){
                        context.fillStyle = 'rgb(255,255,255)';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    function renderFrame(noClear=false){
                        //clear the canvas
                            if(!noClear){ clearFrame(); }
                
                        //activate root groups render function
                            core.arrangement.get().render(context);
                    }
                    function animate(timestamp){
                        animationRequestId = requestAnimationFrame(animate);
                
                        //attempt to render frame, if there is a failure; stop animation loop and report the error
                            var error = undefined;
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
                
                    this.drawDot = function(x,y,r=2,colour='rgba(150,150,255,1)'){
                        context.fillStyle = colour;
                        context.beginPath();
                        context.arc(x,y, r, 0, 2*Math.PI, false);
                        context.closePath(); 
                        context.fill();
                    };
                
                    this.frame = function(noClear=false){renderFrame(noClear);};
                    this.active = function(bool){
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
                };
                this.stats = new function(){
                    var active = false;
                    var average = 30;
                    var lastTimestamp = 0;
                
                    var framesPerSecond = {
                        compute:function(timestamp){
                            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
                            if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }
                
                            this.rate = canvas.library.math.averageArray( this.frameTimeArray );
                
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
                this.callback = new function(){
                    var callbacks = [
                        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 
                        'onkeydown', 'onkeyup',
                        'touchstart', 'touchmove', 'touchend', 'touchenter', 'touchleave', 'touchcancel',
                    ];
                
                    for(var a = 0; a < callbacks.length; a++){
                        //interface
                            this[callbacks[a]] = function(x,y,event){};
                
                        //attachment to canvas
                            //default
                                canvas[callbacks[a]] = function(callback){
                                    return function(event){
                                        if( !core.callback[callback] ){return;}
                                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                        core.callback[callback](p.x,p.y,event);
                                    }
                                }(callbacks[a]);
                
                            //special cases
                                canvas.onmouseover = function(event){
                                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = 'hidden'; }
                
                                    if( !core.callback.onmouseover ){return;}
                                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                    core.callback.onmouseover(p.x,p.y,event);
                                };
                                canvas.onmouseout = function(event){
                                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = ''; }
                                    
                                    if( !core.callback.onmouseout ){return;}
                                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                    core.callback.onmouseout(p.x,p.y,event);
                                };
                                canvas.onmousemove = function(event){
                                    if( !core.callback.onmousemove ){return;}
                                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                    core.callback.onmousemove(p.x,p.y,event);
                                    core.viewport.mousePosition(p.x,p.y);
                                };
                                canvas.onkeydown = function(event){
                                    if( !core.callback.onkeydown ){return;}
                                    var p = core.viewport.mousePosition();
                                    core.callback.onkeydown(p.x,p.y,event);
                                };
                                canvas.onkeyup = function(event){
                                    if( !core.callback.onkeyup ){return;}
                                    var p = core.viewport.mousePosition();
                                    core.callback.onkeyup(p.x,p.y,event);
                                };
                    }
                };
                
                //initial viewport setup
                    core.viewport.refresh();
                    core.arrangement.clear();
            };
            var surface = this;
            
            this.arrangement = new function(){
                this.get = function(){return core.arrangement.get();};
                this.set = function(arrangement){return core.arrangement.set(arrangement);};
                this.createElement = function(type){return core.arrangement.createElement(type);};
                this.append = function(element){return core.arrangement.append(element);};
                this.prepend = function(element){return core.arrangement.prepend(element);};
                this.remove = function(element){return core.arrangement.remove(element);};
                this.getElementUnderPoint = function(x,y){return core.arrangement.getElementUnderPoint(x,y);};
                
                this.forceRefresh = function(element){return core.arrangement.forceRefresh(element);};
            };
            this.viewport = new function(){
                this.position = function(x,y){return core.viewport.position(x,y);};
                this.scale = function(s){return core.viewport.scale(s);};
                this.angle = function(a){return core.viewport.angle(a);};
                this.windowPoint2workspacePoint = function(x,y){ return core.viewport.windowPoint2workspacePoint(x,y); };
            };
            this.render = new function(){
                this.frame = function(noClear=false){return core.render.frame(noClear);};
                this.active = function(bool){return core.render.active(bool);};
            };
            this.stats = new function(){
                this.active = function(bool){return core.stats.active(bool);};
                this.getReport = function(){return core.stats.getReport();};
            };
            this.callback = new function(){
                this.onmousedown = function(x,y,event){};
                core.callback.onmousedown = function(surface){
                    return function(x,y,event){ surface.onmousedown(x,y,event); };
                }(this);
                this.onmouseup = function(x,y,event){};
                core.callback.onmouseup = function(surface){
                    return function(x,y,event){ surface.onmouseup(x,y,event); };
                }(this);
                this.onmousemove = function(x,y,event){};
                core.callback.onmousemove = function(surface){
                    return function(x,y,event){ surface.onmousemove(x,y,event); };
                }(this);
                this.onmouseenter = function(x,y,event){};
                core.callback.onmouseenter = function(surface){
                    return function(x,y,event){ surface.onmouseenter(x,y,event); };
                }(this);
                this.onmouseleave = function(x,y,event){};
                core.callback.onmouseleave = function(surface){
                    return function(x,y,event){ surface.onmouseleave(x,y,event); };
                }(this);
                this.onwheel = function(x,y,event){};
                core.callback.onwheel = function(surface){
                    return function(x,y,event){ surface.onwheel(x,y,event); };
                }(this);
            
            
                this.onkeydown = function(x,y,event){};
                core.callback.onkeydown = function(surface){
                    return function(x,y,event){ surface.onkeydown(x,y,event); };
                }(this);
                this.onkeyup = function(x,y,event){};
                core.callback.onkeyup = function(surface){
                    return function(x,y,event){ surface.onkeyup(x,y,event); };
                }(this);
            
            
                this.touchstart = function(x,y,event){};
                core.callback.touchstart = function(surface){
                    return function(x,y,event){ surface.touchstart(x,y,event); };
                }(this);
                this.touchmove = function(x,y,event){};
                core.callback.touchmove = function(surface){
                    return function(x,y,event){ surface.touchmove(x,y,event); };
                }(this);
                this.touchend = function(x,y,event){};
                core.callback.touchend = function(surface){
                    return function(x,y,event){ surface.touchend(x,y,event); };
                }(this);
                this.touchenter = function(x,y,event){};
                core.callback.touchenter = function(surface){
                    return function(x,y,event){ surface.touchenter(x,y,event); };
                }(this);
                this.touchleave = function(x,y,event){};
                core.callback.touchleave = function(surface){
                    return function(x,y,event){ surface.touchleave(x,y,event); };
                }(this);
                this.touchcancel = function(x,y,event){};
                core.callback.touchcancel = function(surface){
                    return function(x,y,event){ surface.touchcancel(x,y,event); };
                }(this);
            };
        };
        canvas.system = new function(){};
        canvas.system.mouse = new function(){
            //connect callbacks to mouse function lists
                canvas.core.callback.onmousedown = function(x,y,event){
                    console.log( canvas.core.arrangement.getElementUnderPoint(x,y) );
                    // canvas.core.arrangement.remove( canvas.core.arrangement.getElementUnderPoint(x,y) );
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousedown)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmousemove = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousemove)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmouseup = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseup)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmouseleave = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseleave)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmouseenter = function(x,y,event){ 
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseenter)({event:event,x:x,y:y});
                };
                canvas.core.callback.onwheel = function(x,y,event){
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onwheel)({event:event,x:x,y:y});
                };
            
            
            //setup basic function lists
            //(plus a '.tmp' for storing values)
                this.tmp = {};
                this.functionList = {};
            
                this.functionList.onmousedown = [
                    {
                        'specialKeys':[],
                        'function':function(data){
                            //save the old listener functions of the canvas
                                canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
                                canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
                                canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;
            
                            //save the viewport position and click position
                                canvas.system.mouse.tmp.oldPosition = canvas.core.viewport.position();
                                canvas.system.mouse.tmp.clickPosition = {x:data.event.x, y:data.event.y};
            
                            //replace the canvas's listeners 
                                canvas.onmousemove = function(event){
                                    //update the viewport position
                                        canvas.core.viewport.position(
                                            canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.core.viewport.scale()),
                                            canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.core.viewport.scale()),
                                        );
                                };
            
                                canvas.onmouseup = function(){
                                    //put back the old listeners 
                                        this.onmousemove = canvas.system.mouse.tmp.onmousemove_old;
                                        this.onmouseleave = canvas.system.mouse.tmp.onmouseleave_old;
                                        this.onmouseup = canvas.system.mouse.tmp.onmouseup_old;
            
                                    //delete all the tmp data
                                        canvas.system.mouse.tmp = {};
                                };
            
                                canvas.onmouseleave = canvas.onmouseup;
            
                            //request that the function list stop here
                                return true;
                        }
                    }
                ];
                this.functionList.onmousemove = [];
                this.functionList.onmouseup = [];
                this.functionList.onmouseleave = [];
                this.functionList.onmouseenter = [];
                this.functionList.onwheel = [
                {
                    'specialKeys':[],
                    'function':function(data){
                        var scaleLimits = {'max':20, 'min':0.1};
            
                        //perform scale and associated pan
                            //discover point under mouse
                                var originalPoint = {x:data.x, y:data.y};
                            //perform actual scaling
                                var scale = canvas.core.viewport.scale();
                                scale -= scale*(data.event.deltaY/100);
                                if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                                if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                                canvas.core.viewport.scale(scale);
                            //discover new point under mouse
                                var newPoint = canvas.core.viewport.windowPoint2workspacePoint(data.event.x,data.event.y);
                            //pan so we're back at the old point (accounting for angle)
                                var pan = canvas.library.math.cartesianAngleAdjust(
                                    (newPoint.x - originalPoint.x),
                                    (newPoint.y - originalPoint.y),
                                    canvas.core.viewport.angle()
                                );
                                var temp = canvas.core.viewport.position();
                                canvas.core.viewport.position(temp.x+pan.x,temp.y+pan.y)
            
                        //request that the function list stop here
                            return true;
                    }
                }
            ];
        };
        canvas.system.keyboard = new function(){
            canvas.core.callback.onkeydown = function(x,y,event){
                //if key is already pressed, don't press it again
                    if(canvas.system.keyboard.pressedKeys[event.code]){ return; }
                    canvas.system.keyboard.pressedKeys[event.code] = true;
                
                //perform action
                    canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeydown)(event,{x:x,y:y});
            };
            canvas.core.callback.onkeyup = function(x,y,event){
                //if key isn't pressed, don't release it
                    if(!canvas.system.keyboard.pressedKeys[event.code]){return;}
                    delete canvas.system.keyboard.pressedKeys[event.code];
                
                //perform action
                    canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeyup)(event,{x:x,y:y});
            };
            
            this.releaseAll = function(){
                for(var a = 0; a < this.pressedKeys.length; a++){
                    this.releaseKey(this.pressedKeys[a]);
                }
            };
            this.releaseKey = function(keyCode){
                canvas.onkeyup( new KeyboardEvent('keyup',{'key':keyCode}) );
            }
            
            this.pressedKeys = {};
            
            this.functionList = {};
            this.functionList.onkeydown = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
            this.functionList.onkeyup = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
        };
        
        //add main panes to arrangement
        canvas.system.pane = {};
        
        //background
            canvas.system.pane.background = canvas.core.arrangement.createElement('group');
            canvas.system.pane.background.name = 'background'
            canvas.system.pane.background.static = true;
            canvas.system.pane.background.ignored = true;
            canvas.core.arrangement.append( canvas.system.pane.background );
        
        //middleground
            canvas.system.pane.middleground = canvas.core.arrangement.createElement('group');
            canvas.system.pane.middleground.name = 'middleground'
            canvas.core.arrangement.append( canvas.system.pane.middleground );
        
                //back
                    canvas.system.pane.middleground.back = canvas.core.arrangement.createElement('group');
                    canvas.system.pane.middleground.back.name = 'back'
                    canvas.system.pane.middleground.append( canvas.system.pane.middleground.back );
        
                //middle
                    canvas.system.pane.middleground.middle = canvas.core.arrangement.createElement('group');
                    canvas.system.pane.middleground.middle.name = 'middle'
                    canvas.system.pane.middleground.append( canvas.system.pane.middleground.middle );
        
                //front
                    canvas.system.pane.middleground.front = canvas.core.arrangement.createElement('group');
                    canvas.system.pane.middleground.front.name = 'front'
                    canvas.system.pane.middleground.append( canvas.system.pane.middleground.front );
        
        //foreground
            canvas.system.pane.foreground = canvas.core.arrangement.createElement('group');
            canvas.system.pane.foreground.name = 'foreground'
            canvas.system.pane.foreground.static = true;
            canvas.core.arrangement.append( canvas.system.pane.foreground );
        
        
            
        //shortcuts
            canvas.system.pane.b = canvas.system.pane.background;
            canvas.system.pane.mb = canvas.system.pane.middleground.back;
            canvas.system.pane.mm = canvas.system.pane.middleground.middle;
            canvas.system.pane.mf = canvas.system.pane.middleground.front;
            canvas.system.pane.f = canvas.system.pane.foreground;
        
        canvas.core.render.active(true);
        canvas.part = new function(){};
        
        canvas.part.element = new function(){
            this.basic = new function(){
                this.polygon = function(
                    name=null, 
                    points=[], 
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,0)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('polygon');
                    temp.name = name;
                    temp.points = points;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                
                    return temp;
                };
                
                this.advancedPolygon = function(
                    name=null, 
                    points=[], 
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,1)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('advancedPolygon');
                    temp.name = name;
                    temp.points = points;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                
                    return temp;
                };
                this.circle = function(
                    name=null, 
                    x=0, 
                    y=0, 
                    r=2,
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,1)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('circle');
                    temp.name = name;
                    temp.x = x; temp.y = y;
                    temp.r = r;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    return temp;
                };
                this.image = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, url=''){
                    var temp = canvas.core.arrangement.createElement('image');
                    temp.name = name;
                    temp.x = x; temp.y = y;
                    temp.width = width; temp.height = height;
                    temp.angle = angle;
                    temp.anchor = anchor;
                    temp.url = url;
                    return temp;
                };
                this.path = function(
                    name=null, 
                    points=[],
                    strokeStyle='rgba(0,0,0,1)', 
                    lineWidth=1,
                    lineCap='round',
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('path');
                    temp.name = name;
                    temp.points = points;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineCap = lineCap;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    
                    return temp;
                };
                this.rectangle = function(
                    name=null, 
                    x=0, 
                    y=0, 
                    width=10, 
                    height=10, 
                    angle=0,
                    anchor={x:0,y:0}, 
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,0)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('rectangle');
                    temp.name = name;
                    temp.x = x; temp.y = y;
                    temp.width = width; temp.height = height;
                    temp.angle = angle;
                    temp.anchor = anchor;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    return temp;
                };
                this.group = function(name=null, x=0, y=0, angle=0){
                    var temp = canvas.core.arrangement.createElement('group');
                    temp.name = name;
                    temp.x = x; 
                    temp.y = y;
                    temp.angle = angle;
                    return temp;
                };
                this.text = function(
                    name=null,
                    x=0,
                    y=0, 
                    text='Hello',
                    angle=0, 
                    anchor={x:0,y:0},
                    font='30pt Arial',
                    textAlign='start', //start/end/center/lief/right 
                    textBaseline='alphabetic', //alphabetic/top/hanging/middle/ideographic/bottom
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,0)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('text');
                    temp.name = name;
                    temp.x = x; 
                    temp.y = y;
                    temp.text = text;
                    temp.angle = angle;
                    temp.anchor = anchor;
                    temp.style.font = font;
                    temp.style.textAlign = textAlign;
                    temp.style.textBaseline = textBaseline;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    return temp;
                };
            };
            
            this.display = new function(){
                this.sevenSegmentDisplay = function(
                    name='sevenSegmentDisplay',
                    x, y, width=20, height=30,
                    backgroundStyle='rgb(0,0,0)',
                    glowStyle='rgb(200,200,200)',
                    dimStyle='rgb(20,20,20)'
                ){
                    var margin = width/8;
                    var division = width/8;
                    var shapes = {
                        segments:{
                            points: {
                                top:{
                                    left:[
                                        {x:division*1.0+margin,         y:division*1.0+margin},
                                        {x:division*0.5+margin,         y:division*0.5+margin},
                                        {x:division*1.0+margin,         y:division*0.0+margin},
                                        {x:division*0.0+margin,         y:division*1.0+margin},
                                    ],
                                    right:[
                                        {x:width-division*1.0-margin,   y:division*0.0+margin},
                                        {x:width-division*0.5-margin,   y:division*0.5+margin},
                                        {x:width-division*1.0-margin,   y:division*1.0+margin},
                                        {x:width-division*0.0-margin,   y:division*1.0+margin}
                                    ]
                                },
                                middle: {
                                    left:[
                                        {x:division*1.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                                        {x:division*0.5+margin,         y:height*0.5-division*0.5+margin*0.5},
                                        {x:division*1.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                                        {x:division*0.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                                        {x:division*0.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                                    ],
                                    right:[
                                        {x:width-division*1.0-margin,   y:height*0.5-division*0.0+margin*0.5},
                                        {x:width-division*0.5-margin,   y:height*0.5-division*0.5+margin*0.5},
                                        {x:width-division*1.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                                        {x:width-division*0.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                                        {x:width-division*0.0-margin,   y:height*0.5-division*0.0+margin*0.5}
                                    ]
                                },
                                bottom: {
                                    left:[
                                        {x:division*1.0+margin,         y:height-division*1.0-margin},
                                        {x:division*0.5+margin,         y:height-division*0.5-margin},
                                        {x:division*1.0+margin,         y:height-division*0.0-margin},
                                        {x:division*0.0+margin,         y:height-division*1.0-margin},
                                    ],
                                    right:[
                                        {x:width-division*1.0-margin,   y:height-division*0.0-margin},
                                        {x:width-division*0.5-margin,   y:height-division*0.5-margin},
                                        {x:width-division*1.0-margin,   y:height-division*1.0-margin},
                                        {x:width-division*0.0-margin,   y:height-division*1.0-margin}
                                    ]
                                }
                            }
                        }
                    };
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y});
                
                        //backing
                            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backgroundStyle} });
                                object.append(rect);
                
                        //segments
                            var segments = [];
                            var points = [
                                [
                                    shapes.segments.points.top.left[0],
                                    shapes.segments.points.top.right[2],
                                    shapes.segments.points.top.right[1],
                                    shapes.segments.points.top.right[0],
                                    shapes.segments.points.top.left[2],
                                    shapes.segments.points.top.left[1],
                                ],
                                [
                                    shapes.segments.points.top.left[1],
                                    shapes.segments.points.top.left[3],
                                    shapes.segments.points.middle.left[3],
                                    shapes.segments.points.middle.left[1],
                                    shapes.segments.points.middle.left[0],
                                    shapes.segments.points.top.left[0],  
                                ],
                                [
                                    shapes.segments.points.top.right[1],  
                                    shapes.segments.points.top.right[3],  
                                    shapes.segments.points.middle.right[3],
                                    shapes.segments.points.middle.right[1],
                                    shapes.segments.points.middle.right[2],
                                    shapes.segments.points.top.right[2],  
                                ],
                                [
                                    shapes.segments.points.middle.left[0], 
                                    shapes.segments.points.middle.right[2],
                                    shapes.segments.points.middle.right[1],
                                    shapes.segments.points.middle.right[0],
                                    shapes.segments.points.middle.left[2], 
                                    shapes.segments.points.middle.left[1], 
                                ],
                                [
                                    shapes.segments.points.middle.left[1],
                                    shapes.segments.points.middle.left[4],
                                    shapes.segments.points.bottom.left[3],
                                    shapes.segments.points.bottom.left[1],
                                    shapes.segments.points.bottom.left[0],
                                    shapes.segments.points.middle.left[2],
                                ],
                                [
                                    shapes.segments.points.middle.right[1],
                                    shapes.segments.points.middle.right[4],
                                    shapes.segments.points.bottom.right[3],
                                    shapes.segments.points.bottom.right[1],
                                    shapes.segments.points.bottom.right[2],
                                    shapes.segments.points.middle.right[0],
                                ],
                                [
                                    shapes.segments.points.bottom.left[0],
                                    shapes.segments.points.bottom.right[2],
                                    shapes.segments.points.bottom.right[1],
                                    shapes.segments.points.bottom.right[0],
                                    shapes.segments.points.bottom.left[2],
                                    shapes.segments.points.bottom.left[1],
                                ]
                            ];
                            for(var a = 0; a < points.length; a++){
                                var temp = {
                                    segment: canvas.part.builder('polygon','segment_'+a,{points:points[a], style:{fill:dimStyle}}),
                                    state: false
                                };
                                segments.push( temp );
                                object.append( temp.segment );
                            }
                
                    //methods
                        object.set = function(segment,state){
                            segments[segment].state = state;
                            if(state){ segments[segment].segment.style.fill = glowStyle; }
                            else{ segments[segment].segment.style.fill = dimStyle; }
                        };
                        object.get = function(segment){ return segments[segment].state; };
                        object.clear = function(){
                            for(var a = 0; a < segments.length; a++){
                                this.set(a,false);
                            }
                        };
                
                        object.enterCharacter = function(char){
                            var stamp = [];
                            switch(char){
                                case 0: case '0': stamp = [1,1,1,0,1,1,1]; break;
                                case 1: case '1': stamp = [0,0,1,0,0,1,0]; break;
                                case 2: case '2': stamp = [1,0,1,1,1,0,1]; break;
                                case 3: case '3': stamp = [1,0,1,1,0,1,1]; break;
                                case 4: case '4': stamp = [0,1,1,1,0,1,0]; break;
                                case 5: case '5': stamp = [1,1,0,1,0,1,1]; break;
                                case 6: case '6': stamp = [1,1,0,1,1,1,1]; break;
                                case 7: case '7': stamp = [1,0,1,0,0,1,0]; break;
                                case 8: case '8': stamp = [1,1,1,1,1,1,1]; break;
                                case 9: case '9': stamp = [1,1,1,1,0,1,1]; break;
                                default:  stamp = [0,0,0,0,0,0,0]; break;
                            }
                
                            for(var a = 0; a < stamp.length; a++){
                                this.set(a, stamp[a]==1);
                            }
                        };
                
                    return object;
                };
                this.sixteenSegmentDisplay = function(
                    name='sixteenSegmentDisplay',
                    x, y, width=20, height=30,
                    backgroundStyle='rgb(0,0,0)',
                    glowStyle='rgb(200,200,200)',
                    dimStyle='rgb(20,20,20)'
                ){
                    var margin = width/8;
                    var division = width/8;
                    var shapes = {
                        segments:{
                            points: {
                                top:{
                                    left:[
                                        {x:division*0.5+margin,         y:division*0.5+margin},  //centre
                                        {x:division*1.0+margin,         y:division*0.0+margin},  //top
                                        {x:division*0.0+margin,         y:division*1.0+margin},  //left
                                        {x:division*1.0+margin,         y:division*1.0+margin},  //inner point
                                        {x:division*1.75+margin,        y:division*1.0+margin},  //inner point right
                                        {x:division*1.0+margin,         y:division*1.75+margin}, //inner point down
                                    ],
                                    centre:[
                                        {x:width/2,                     y:division*0.5+margin}, //central point
                                        {x:width/2-division*0.5,        y:division*1.0+margin}, //lower left
                                        {x:width/2+division*0.5,        y:division*1.0+margin}, //lower right
                                        {x:width/2-division*0.5,        y:division*0.0+margin}, //upper left
                                        {x:width/2+division*0.5,        y:division*0.0+margin}, //upper right
                                    ],
                                    right:[
                                        {x:width-division*0.5-margin,   y:division*0.5+margin},  //centre
                                        {x:width-division*1.0-margin,   y:division*0.0+margin},  //top
                                        {x:width-division*0.0-margin,   y:division*1.0+margin},  //right
                                        {x:width-division*1.0-margin,   y:division*1.0+margin},  //inner point
                                        {x:width-division*1.0-margin,   y:division*1.75+margin}, //inner point down
                                        {x:width-division*1.75-margin,  y:division*1.0+margin},  //inner point left
                                    ]
                                },
                                middle:{
                                    left:[
                                        {x:division*0.0+margin,         y:height*0.5-division*0.5}, //top left
                                        {x:division*1.0+margin,         y:height*0.5-division*0.5}, //top right
                                        {x:division*0.5+margin,         y:height*0.5-division*0.0}, //centre
                                        {x:division*0.0+margin,         y:height*0.5+division*0.5}, //bottom left
                                        {x:division*1.0+margin,         y:height*0.5+division*0.5}, //bottom right
                                    ],
                                    centre:[
                                        {x:width/2,                     y:height/2},                //central point
                                        {x:width/2-division*0.5,        y:division*0.5+height/2},   //lower left
                                        {x:width/2-division*0.25,       y:division*1.25+height/2},  //lower left down
                                        {x:width/2-division*1.0,        y:division*0.5+height/2},   //lower left left
                                        {x:width/2+division*0.5,        y:division*0.5+height/2},   //lower right
                                        {x:width/2+division*0.5,        y:division*1.75+height/2},  //lower right down
                                        {x:width/2+division*1.0,        y:division*0.5+height/2},   //lower right right
                                        {x:width/2-division*0.5,        y:-division*0.5+height/2},  //upper left
                                        {x:width/2-division*0.25,       y:-division*1.25+height/2}, //upper left up
                                        {x:width/2-division*1.0,        y:-division*0.25+height/2}, //upper left left
                                        {x:width/2+division*0.5,        y:-division*0.5+height/2},  //upper right
                                        {x:width/2+division*0.5,        y:-division*1.75+height/2}, //upper right up
                                        {x:width/2+division*1.0,        y:-division*0.25+height/2}, //upper right right
                                    ],
                                    right:[
                                        {x:width-division*1.0-margin,   y:height*0.5-division*0.5}, //top left
                                        {x:width-division*0.0-margin,   y:height*0.5-division*0.5}, //top right
                                        {x:width-division*0.5-margin,   y:height*0.5-division*0.0}, //centre
                                        {x:width-division*1.0-margin,   y:height*0.5+division*0.5}, //bottom left
                                        {x:width-division*0.0-margin,   y:height*0.5+division*0.5}  //bottom right
                                    ]
                                },
                                bottom: {
                                    left:[
                                        {x:division*0.5+margin,         y:height-division*0.5-margin}, //centre
                                        {x:division*0.0+margin,         y:height-division*1.0-margin}, //left
                                        {x:division*1.0+margin,         y:height-division*0.0-margin}, //bottom
                                        {x:division*1.0+margin,         y:height-division*1.0-margin}, //inner point
                                        {x:division*1.0+margin,         y:height-division*1.75-margin},//inner point up
                                        {x:division*1.75+margin,        y:height-division*1.0-margin}, //inner point right
                                    ],
                                    centre:[
                                        {x:width/2-division*0.5,        y:height-division*1.0-margin}, //upper left
                                        {x:width/2+division*0.5,        y:height-division*1.0-margin}, //upper right
                                        {x:width/2,                     y:height-division*0.5-margin}, //central point
                                        {x:width/2-division*0.5,        y:height-division*0.0-margin}, //lower left
                                        {x:width/2+division*0.5,        y:height-division*0.0-margin}, //lower right
                                    ],
                                    right:[
                                        {x:width-division*0.5-margin,   y:height-division*0.5-margin}, //centre
                                        {x:width-division*0.0-margin,   y:height-division*1.0-margin}, //right
                                        {x:width-division*1.0-margin,   y:height-division*0.0-margin}, //bottom
                                        {x:width-division*1.0-margin,   y:height-division*1.0-margin}, //inner point
                                        {x:width-division*1.0-margin,   y:height-division*1.75-margin},//inner point up
                                        {x:width-division*1.75-margin,  y:height-division*1.0-margin}, //inner point left
                                    ]
                                }
                            }
                        }
                    };
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y});
                
                        //backing
                            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backgroundStyle} });
                                object.append(rect);
                
                
                        //segments
                            var segments = [];
                            var points = [
                                [
                                    shapes.segments.points.top.left[1],
                                    shapes.segments.points.top.left[0],
                                    shapes.segments.points.top.left[3],
                                    shapes.segments.points.top.centre[1],
                                    shapes.segments.points.top.centre[0],
                                    shapes.segments.points.top.centre[3],
                                ],
                                [
                                    shapes.segments.points.top.centre[4],
                                    shapes.segments.points.top.centre[0],
                                    shapes.segments.points.top.centre[2],
                                    shapes.segments.points.top.right[3],
                                    shapes.segments.points.top.right[0],
                                    shapes.segments.points.top.right[1],
                                ],
                
                                [
                                    shapes.segments.points.top.left[0],
                                    shapes.segments.points.top.left[2],
                                    shapes.segments.points.middle.left[0],
                                    shapes.segments.points.middle.left[2],
                                    shapes.segments.points.middle.left[1],
                                    shapes.segments.points.top.left[3],
                                ],
                                [
                                    shapes.segments.points.top.left[4],
                                    shapes.segments.points.top.left[3],
                                    shapes.segments.points.top.left[5],
                                    shapes.segments.points.middle.centre[9],
                                    shapes.segments.points.middle.centre[7],
                                    shapes.segments.points.middle.centre[8],
                                ],
                                [
                                    shapes.segments.points.top.centre[0],
                                    shapes.segments.points.top.centre[1],
                                    shapes.segments.points.middle.centre[7],
                                    shapes.segments.points.middle.centre[0],
                                    shapes.segments.points.middle.centre[10],
                                    shapes.segments.points.top.centre[2],
                                ],
                                [
                                    shapes.segments.points.top.right[4],
                                    shapes.segments.points.top.right[3],
                                    shapes.segments.points.top.right[5],
                                    shapes.segments.points.middle.centre[11],
                                    shapes.segments.points.middle.centre[10],
                                    shapes.segments.points.middle.centre[12],
                                ],
                                [
                                    shapes.segments.points.top.right[0],
                                    shapes.segments.points.top.right[2],
                                    shapes.segments.points.middle.right[1],
                                    shapes.segments.points.middle.right[2],
                                    shapes.segments.points.middle.right[0],
                                    shapes.segments.points.top.right[3],
                                ],
                
                                [
                                    shapes.segments.points.middle.left[4],
                                    shapes.segments.points.middle.left[2],
                                    shapes.segments.points.middle.left[1],
                                    shapes.segments.points.middle.centre[7],
                                    shapes.segments.points.middle.centre[0],
                                    shapes.segments.points.middle.centre[1],
                                ],
                                [
                                    shapes.segments.points.middle.right[3],
                                    shapes.segments.points.middle.right[2],
                                    shapes.segments.points.middle.right[0],
                                    shapes.segments.points.middle.centre[10],
                                    shapes.segments.points.middle.centre[0],
                                    shapes.segments.points.middle.centre[4],
                                ],
                
                                [
                                    shapes.segments.points.bottom.left[0],
                                    shapes.segments.points.bottom.left[1],
                                    shapes.segments.points.middle.left[3],
                                    shapes.segments.points.middle.left[2],
                                    shapes.segments.points.middle.left[4],
                                    shapes.segments.points.bottom.left[3],
                                ],
                                [
                                    shapes.segments.points.bottom.left[4],
                                    shapes.segments.points.bottom.left[3],
                                    shapes.segments.points.bottom.left[5],
                                    shapes.segments.points.middle.centre[2],
                                    shapes.segments.points.middle.centre[1],
                                    shapes.segments.points.middle.centre[3],
                                ],
                                [
                                    shapes.segments.points.bottom.centre[0],
                                    shapes.segments.points.bottom.centre[2],
                                    shapes.segments.points.bottom.centre[1],
                                    shapes.segments.points.middle.centre[4],
                                    shapes.segments.points.middle.centre[0],
                                    shapes.segments.points.middle.centre[1],
                                ],
                                [
                                    shapes.segments.points.bottom.right[4],
                                    shapes.segments.points.bottom.right[3],
                                    shapes.segments.points.bottom.right[5],
                                    shapes.segments.points.middle.centre[5],
                                    shapes.segments.points.middle.centre[4],
                                    shapes.segments.points.middle.centre[6],
                                ],
                                [
                                    shapes.segments.points.bottom.right[3],
                                    shapes.segments.points.middle.right[3],
                                    shapes.segments.points.middle.right[2],
                                    shapes.segments.points.middle.right[4],
                                    shapes.segments.points.bottom.right[1],
                                    shapes.segments.points.bottom.right[0],
                                ],
                
                                [
                                    shapes.segments.points.bottom.left[2],
                                    shapes.segments.points.bottom.left[0],
                                    shapes.segments.points.bottom.left[3],
                                    shapes.segments.points.bottom.centre[0],
                                    shapes.segments.points.bottom.centre[2],
                                    shapes.segments.points.bottom.centre[3],
                                ],
                                [
                                    shapes.segments.points.bottom.right[2],
                                    shapes.segments.points.bottom.right[0],
                                    shapes.segments.points.bottom.right[3],
                                    shapes.segments.points.bottom.centre[1],
                                    shapes.segments.points.bottom.centre[2],
                                    shapes.segments.points.bottom.centre[4],
                                ],
                            ];
                            for(var a = 0; a < points.length; a++){
                                var temp = {
                                    segment: canvas.part.builder('polygon','segment_'+a,{points:points[a], style:{fill:dimStyle}}),
                                    state: false
                                };
                                segments.push( temp );
                                object.append( temp.segment );
                            }
                
                
                    //methods
                        object.set = function(segment,state){
                            segments[segment].state = state;
                            if(state){ segments[segment].segment.style.fill = glowStyle; }
                            else{ segments[segment].segment.style.fill = dimStyle; }
                        };
                        object.get = function(segment){ return segments[segment].state; };
                        object.clear = function(){
                            for(var a = 0; a < segments.length; a++){
                                this.set(a,false);
                            }
                        };
                
                        object.enterCharacter = function(char){
                            var stamp = [];
                            switch(char){
                                case '!': 
                                    stamp = [
                                        1,1,
                                        0,1,1,1,0,
                                        0,0,
                                        0,0,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case '?': 
                                    stamp = [
                                        1,1,
                                        0,0,0,0,1,
                                        0,1,
                                        0,0,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case '.': 
                                    stamp = [
                                        0,0,
                                        0,0,0,0,0,
                                        0,0,
                                        0,0,0,0,0,
                                        1,0,
                                    ]; 
                                break;
                                case ',': 
                                    stamp = [
                                        0,0,
                                        0,0,0,0,0,
                                        0,0,
                                        0,0,1,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case '\'': 
                                    stamp = [
                                        0,0,
                                        1,0,0,0,0,
                                        0,0,
                                        0,0,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case ':':
                                    stamp = [
                                        0,0,
                                        0,1,0,1,0,
                                        0,0,
                                        0,1,0,1,0,
                                        0,0,
                                    ]; 
                                break;
                                case '"': 
                                    stamp = [
                                        0,0,
                                        1,0,1,0,0,
                                        0,0,
                                        0,0,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case '_': 
                                    stamp = [
                                        0,0,
                                        0,0,0,0,0,
                                        0,0,
                                        0,0,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case '-': 
                                    stamp = [
                                        0,0,
                                        0,0,0,0,0,
                                        1,1,
                                        0,0,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case '\\': 
                                    stamp = [
                                        0,0,
                                        0,1,0,0,0,
                                        0,0,
                                        0,0,0,1,0,
                                        0,0,
                                    ]; 
                                break;
                                case '/': 
                                    stamp = [
                                        0,0,
                                        0,0,0,1,0,
                                        0,0,
                                        0,1,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case '*': 
                                    stamp = [
                                        0,0,
                                        0,1,1,1,0,
                                        1,1,
                                        0,1,1,1,0,
                                        0,0,
                                    ]; 
                                break;
                                case '#': 
                                    stamp = [
                                        1,1,
                                        1,0,1,0,1,
                                        1,1,
                                        1,0,1,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case '<': 
                                    stamp = [
                                        0,0,
                                        0,0,0,1,0,
                                        0,0,
                                        0,0,0,1,0,
                                        0,0,
                                    ]; 
                                break;
                                case '>': 
                                    stamp = [
                                        0,0,
                                        0,1,0,0,0,
                                        0,0,
                                        0,1,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case '(': 
                                    stamp = [
                                        0,1,
                                        0,0,1,0,0,
                                        0,0,
                                        0,0,1,0,0,
                                        0,1,
                                    ]; 
                                break;
                                case ')': 
                                    stamp = [
                                        1,0,
                                        0,0,1,0,0,
                                        0,0,
                                        0,0,1,0,0,
                                        1,0,
                                    ]; 
                                break;
                                case '[': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        0,0,
                                        1,0,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case ']': 
                                    stamp = [
                                        1,1,
                                        0,0,0,0,1,
                                        0,0,
                                        0,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case '{': 
                                    stamp = [
                                        1,1,
                                        0,1,0,0,0,
                                        1,0,
                                        0,1,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case '}': 
                                    stamp = [
                                        1,1,
                                        0,0,0,1,0,
                                        0,1,
                                        0,0,0,1,0,
                                        1,1,
                                    ]; 
                                break;
                
                                case '0': 
                                    stamp = [
                                        1,1,
                                        1,0,0,1,1,
                                        0,0,
                                        1,1,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case '1': 
                                    stamp = [
                                        1,0,
                                        0,0,1,0,0,
                                        0,0,
                                        0,0,1,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case '2': 
                                    stamp = [
                                        1,1,
                                        0,0,0,0,1,
                                        0,1,
                                        0,1,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case '3': 
                                    stamp = [
                                        1,1,
                                        0,0,0,0,1,
                                        1,1,
                                        0,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case '4': 
                                    stamp = [
                                        0,0,
                                        1,0,0,0,1,
                                        1,1,
                                        0,0,0,0,1,
                                        0,0,
                                    ]; 
                                break;
                                case '5': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        1,1,
                                        0,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case '6': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        1,1,
                                        1,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case '7': 
                                    stamp = [
                                        1,1,
                                        0,0,0,1,0,
                                        0,0,
                                        0,1,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case '8': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,1,
                                        1,1,
                                        1,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case '9': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,1,
                                        1,1,
                                        0,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                
                                case 'a': case 'A': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,1,
                                        1,1,
                                        1,0,0,0,1,
                                        0,0,
                                    ]; 
                                break;
                                case 'b': case 'B': 
                                    stamp = [
                                        1,1,
                                        0,0,1,0,1,
                                        0,1,
                                        0,0,1,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case 'c': case 'C': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        0,0,
                                        1,0,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case 'd': case 'D': 
                                    stamp = [
                                        1,1,
                                        0,0,1,0,1,
                                        0,0,
                                        0,0,1,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case 'e': case 'E': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        1,1,
                                        1,0,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case 'f': case 'F': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        1,1,
                                        1,0,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case 'g': case 'G': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        0,1,
                                        1,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case 'h': case 'H': 
                                    stamp = [
                                        0,0,
                                        1,0,0,0,1,
                                        1,1,
                                        1,0,0,0,1,
                                        0,0,
                                    ]; 
                                break;
                                case 'i': case 'I': 
                                    stamp = [
                                        1,1,
                                        0,0,1,0,0,
                                        0,0,
                                        0,0,1,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case 'j': case 'J': 
                                    stamp = [
                                        1,1,
                                        0,0,1,0,0,
                                        0,0,
                                        0,0,1,0,0,
                                        1,0,
                                    ]; 
                                break;
                                case 'k': case 'K': 
                                    stamp = [
                                        0,0,
                                        1,0,0,1,0,
                                        1,0,
                                        1,0,0,1,0,
                                        0,0,
                                    ]; 
                                break;
                                case 'l': case 'L': 
                                    stamp = [
                                        0,0,
                                        1,0,0,0,0,
                                        0,0,
                                        1,0,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                                case 'm': case 'M': 
                                    stamp = [
                                        0,0,
                                        1,1,0,1,1,
                                        0,0,
                                        1,0,0,0,1,
                                        0,0,
                                    ]; 
                                break;
                                case 'n': case 'N': 
                                    stamp = [
                                        0,0,
                                        1,1,0,0,1,
                                        0,0,
                                        1,0,0,1,1,
                                        0,0,
                                    ]; 
                                break;
                                case 'o': case 'O': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,1,
                                        0,0,
                                        1,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case 'p': case 'P': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,1,
                                        1,1,
                                        1,0,0,0,0,
                                        0,0,
                                    ];
                                break;
                                case 'q': case 'Q': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,1,
                                        0,0,
                                        1,0,0,1,1,
                                        1,1,
                                    ]; 
                                break;
                                case 'r': case 'R': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,1,
                                        1,1,
                                        1,0,0,1,0,
                                        0,0,
                                    ]; 
                                break;
                                case 's': case 'S': 
                                    stamp = [
                                        1,1,
                                        1,0,0,0,0,
                                        1,1,
                                        0,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case 't': case 'T': 
                                    stamp = [
                                        1,1,
                                        0,0,1,0,0,
                                        0,0,
                                        0,0,1,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case 'u': case 'U': 
                                    stamp = [
                                        0,0,
                                        1,0,0,0,1,
                                        0,0,
                                        1,0,0,0,1,
                                        1,1,
                                    ]; 
                                break;
                                case 'v': case 'V': 
                                    stamp = [
                                        0,0,
                                        1,0,0,1,0,
                                        0,0,
                                        1,1,0,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case 'w': case 'W': 
                                    stamp = [
                                        0,0,
                                        1,0,0,0,1,
                                        0,0,
                                        1,1,0,1,1,
                                        0,0,
                                    ]; 
                                break;
                                case 'x': case 'X': 
                                    stamp = [
                                        0,0,
                                        0,1,0,1,0,
                                        0,0,
                                        0,1,0,1,0,
                                        0,0,
                                    ]; 
                                break;
                                case 'y': case 'Y': 
                                    stamp = [
                                        0,0,
                                        0,1,0,1,0,
                                        0,0,
                                        0,0,1,0,0,
                                        0,0,
                                    ]; 
                                break;
                                case 'z': case 'Z': 
                                    stamp = [
                                        1,1,
                                        0,0,0,1,0,
                                        0,0,
                                        0,1,0,0,0,
                                        1,1,
                                    ]; 
                                break;
                
                                case 'all': stamp = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; break;
                                default:
                                    stamp = [
                                        0,0,
                                        0,0,0,0,0,
                                        0,0,
                                        0,0,0,0,0,
                                        0,0,
                                    ];
                                break;
                            }
                
                            for(var a = 0; a < stamp.length; a++){
                                this.set(a, stamp[a]==1);
                            }
                        };
                
                
                    return object;      
                };
                this.glowbox_rect = function(
                    name='glowbox_rect',
                    x, y, width=30, height=30, angle=0,
                    glowStyle = 'rgba(244,234,141,1)',
                    dimStyle = 'rgba(80,80,80,1)'
                ){
                
                    //elements 
                        var object = canvas.part.builder('group',name,{x:x, y:y});
                        var rect = canvas.part.builder('rectangle','light',{ width:width, height:height, angle:angle, style:{fill:dimStyle} });
                            object.append(rect);
                
                    //methods
                        object.on = function(){
                            rect.style.fill = glowStyle;
                        };
                        object.off = function(){
                            rect.style.fill = dimStyle;
                        };
                
                    return object;
                };
                this.readout_sixteenSegmentDisplay = function(
                    name='readout_sixteenSegmentDisplay',
                    x, y, width=100, height=30, count=5, angle=0,
                    backgroundStyle='rgb(0,0,0)',
                    glowStyle='rgb(200,200,200)',
                    dimStyle='rgb(20,20,20)'
                ){
                    //values
                        var text = '';
                        var displayInterval = null;
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y});
                
                        //display units
                            var units = [];
                            for(var a = 0; a < count; a++){
                                var temp = canvas.part.builder('sixteenSegmentDisplay', ''+a, {
                                    x:(width/count)*a, width:width/count, height:height, 
                                    style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                                });
                                object.append( temp );
                                units.push(temp);
                            }
                
                    //methods
                        object.text = function(a){
                            if(a==null){return text;}
                            text = a;
                        };
                
                        object.print = function(style){
                            clearInterval(displayInterval);
                            switch(style){
                                case 'smart':
                                    if(text.length > units.length){this.print('r2lSweep');}
                                    else{this.print('regular')}
                                break;
                                case 'r2lSweep':
                                    var displayIntervalTime = 100;
                                    var displayStage = 0;
                
                                    displayInterval = setInterval(function(){
                                        for(var a = units.length-1; a >= 0; a--){
                                            units[a].enterCharacter(text[displayStage-((units.length-1)-a)]);
                                        }
                
                                        displayStage++;if(displayStage > units.length+text.length-1){displayStage=0;}
                                    },displayIntervalTime);
                                break;
                                case 'regular': default:
                                    for(var a = 0; a < units.length; a++){
                                        units[a].enterCharacter(text[a]);
                                    }
                                break;
                            }
                        };
                
                    return object;
                };
            };
        };
        
        canvas.part.builder = function(type,name,data){
            if(!data){data={};}
            if(data.style == undefined){data.style={};}
        
            switch(type){
                default: console.warn('Unknown element: '+ type); return null; break;
        
                //basic
                    case 'group': return this.element.basic.group(
                        name, data.x, data.y, data.angle
                    );
                    case 'rectangle': return this.element.basic.rectangle(
                        name, data.x, data.y, data.width, data.height, data.angle, data.anchor, 
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin,
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
                    );
                    case 'image': return this.element.basic.image(
                        name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.url
                    );
                    case 'polygon': return this.element.basic.polygon(
                        name, data.points, 
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
                        );
                    case 'text':   return this.element.basic.text(
                        name, data.x, data.y, data.text, data.angle, data.anchor, 
                        data.style.font, data.style.textAlign, data.style.textBaseLine,
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
                        ); break;
                    case 'circle': return this.element.basic.circle(
                        name, data.x, data.y, data.r, data.angle, 
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
                    ); break;
                    case 'path':   return this.element.basic.path(
                        name, data.points, 
                        data.style.stroke, data.style.lineWidth, data.style.lineCap,  data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
                    ); break;
            
                //display
                    case 'glowbox_rect': return this.element.display.glowbox_rect(
                        name, data.x, data.y, data.width, data.height, data.angle, 
                        data.style.glow, data.style.dim
                    ); break;
                    case 'sevenSegmentDisplay': return this.element.display.sevenSegmentDisplay(
                        name, data.x, data.y, data.width, data.height,
                        data.style.background, data.style.glow, data.style.dim
                    ); break;
                    case 'sixteenSegmentDisplay': return this.element.display.sixteenSegmentDisplay(
                        name, data.x, data.y, data.width, data.height, 
                        data.style.background, data.style.glow, data.style.dim
                    ); break;
                    case 'readout_sixteenSegmentDisplay': return this.element.display.readout_sixteenSegmentDisplay(
                        name, data.x, data.y, data.width, data.height, data.count, data.angle, 
                        data.style.background, data.style.glow, data.style.dime
                    ); break;
                    
                    
                    
            }
            
        }


        function tester(item1,item2){
            function getType(obj){
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
            }
            function comparer(item1,item2){
                if(getType(item1) != getType(item2)){ return false; }
                if(typeof item1 == 'boolean' || typeof item1 == 'string'){ return item1 === item2; }
                if(typeof item1 == 'number'){
                    if( Math.abs(item1) < 1.0e-14 ){item1 = 0;}
                    if( Math.abs(item2) < 1.0e-14 ){item2 = 0;}
                    return item1 === item2;
                }
                if(typeof item1 === 'undefined' || typeof item2 === 'undefined' || item1 === null || item2 === null){ return item1 === item2;  }
                if(getType(item1) == 'function'){
                    item1 = item1.toString();
                    item2 = item2.toString();
        
                    var item1_functionHead = item1.substring(0,item1.indexOf('{'));
                    item1_functionHead = item1_functionHead.substring(item1_functionHead.indexOf('(')+1, item1_functionHead.lastIndexOf(')'));
                    var item1_functionBody = item1.substring(item1.indexOf('{')+1, item1.lastIndexOf('}'));
        
                    var item2_functionHead = item2.substring(0,item2.indexOf('{'));
                    item2_functionHead = item2_functionHead.substring(item2_functionHead.indexOf('(')+1, item2_functionHead.lastIndexOf(')'));
                    var item2_functionBody = item2.substring(item2.indexOf('{')+1, item2.lastIndexOf('}'));
        
                    return item1_functionHead.trim() == item2_functionHead.trim() && item1_functionBody.trim() == item2_functionBody.trim();
                }
                if(typeof item1 == 'object'){
                    var keys = Object.keys(item1);
                    var result = true;
                    for(var a = 0; a < keys.length; a++){
                        result = result && comparer(item1[keys[a]],item2[keys[a]]);
                    }
                    return result;
                }
                return false;
            }
        
            if( comparer(item1,item2) ){
                console.log('%cpass', 'color: green;'); return true;
            }else{
                console.log(item1 ,'!=', item2);
                console.log('%cfail', 'color: red;'); return false;
            }
        }
        
        

        
        // -- Only one test per time -- //
        //basic
            var basicGroup = canvas.part.builder( 'group', 'basic', { x:10, y:10, angle:0 } );
            canvas.system.pane.mm.append( basicGroup );
            basicGroup.append( canvas.part.builder( 'rectangle', 'testRectangle', { x:5, y:5, width:30, height:30, style:{ fill:'rgba(255,0,0,1)' } } ) );
            basicGroup.append( canvas.part.builder( 'circle', 'testCircle', { x:20, y:55, r:15 } ) );
            basicGroup.append( canvas.part.builder( 'image', 'testImage', { x:40, y:40, width:30, height:30, url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg' } ) );
            basicGroup.append( canvas.part.builder( 'polygon', 'testPolygon', { points:[{x:55,y:5}, {x:70,y:35}, {x:40,y:35}], style:{ fill:'rgba(0,255,0,1)' } } ) );
            basicGroup.append( canvas.part.builder( 'text', 'testText', { x:7.5, y:95, text:'Hello', style:{font:'20pt Arial', fill:'rgba(150,150,255,1)' } } ) );
            basicGroup.append( canvas.part.builder( 'path', 'testPath', { points:[{x:0,y:0},{x:0,y:90},{x:2.5,y:90},{x:2.5,y:72.5},{x:75,y:72.5}] }) );
        
        //display
            var displayGroup = canvas.part.builder( 'group', 'display', { x:100, y:10, angle:0 } );
            canvas.system.pane.mm.append( displayGroup );
            displayGroup.append( canvas.part.builder( 'glowbox_rect', 'test_glowbox_rect', {x:0,y:0} ) );
            displayGroup.append( canvas.part.builder( 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35,y:0} ) );
            displayGroup.append( canvas.part.builder( 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60,y:0} ) );
            displayGroup.append( canvas.part.builder( 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:85,y:0} ) );
        
        



    }
}
