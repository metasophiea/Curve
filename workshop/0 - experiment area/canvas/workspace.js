var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var canvas = __canvasElements[__canvasElements_count];
        canvas.library = new function(){};
        canvas.library.math = new function(){
            this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
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
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
            
                context.font = font;
                context.textAlign = alignment;
                context.textBaseline = baseline;
            
                var d = context.measureText(text);
                var width = d.width*size;
            
                return [{x:x, y:y}, {x:x+width, y:y}];
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
                var computeExtremities = function(isInitial,element,offset,elementCalculation){
                    //if this is the initial object to have this command run upon it; compute points and
                    // bounding box for provided element, and update the bounding boxes for all parents
                        if(isInitial){
                            //get and compute parent offsets
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
                        }
                
                    //perform points and bounding box calculation for this element
                        elementCalculation(element,offset);
                
                    //if this is the initial object to have this command run upon it;; update all parents'
                    // bounding boxes (if there are no changes to a parent's bounding box; don't update
                    // and don't bother checking their parent (or higher))
                        if(isInitial){
                            var temp = element;
                            while((temp=temp.parent) != undefined){
                                //discover if this new object would effect the bounding box of it's parent
                                    if( 
                                        temp.extremities.boundingBox.topLeft.x > element.extremities.boundingBox.topLeft.x ||
                                        temp.extremities.boundingBox.topLeft.y > element.extremities.boundingBox.topLeft.y ||
                                        temp.extremities.boundingBox.bottomRight.x < element.extremities.boundingBox.bottomRight.x ||
                                        temp.extremities.boundingBox.bottomRight.y < element.extremities.boundingBox.bottomRight.y 
                                    ){
                                        //it does effect, thus combine the current bounding box with this element's bounding 
                                        //box to determine the new bounding box for the parent
                                            temp.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints([
                                                temp.extremities.boundingBox.topLeft, temp.extremities.boundingBox.bottomRight,
                                                element.extremities.boundingBox.topLeft, element.extremities.boundingBox.bottomRight 
                                            ]);
                                    }else{
                                        //it doesn't effect it, so don't bother going any higher
                                            break;
                                    }
                            }   
                        }
                
                };
                var makeDotFrame = function(element){
                    //if dotFrame is set; insert all the  extremity points for this shape (in the middleground.front pane)
                    if(element.dotFrame){
                        function makePoint(x,y,id,r,colour){
                            var el = core.arrangement.getChildByName(element.name+'_'+id);
                            core.arrangement.remove(el);
                
                            var point = canvas.core.arrangement.createElement('circle');
                                point.name = element.name+'_'+id;
                                point.x = x; point.y = y; point.r = r;
                                point.style.fill = colour;
                                point.ignored = true;
                                core.arrangement.append(point);
                        }
                
                        makePoint(element.extremities.boundingBox.topLeft.x, element.extremities.boundingBox.topLeft.y, 'topLeft', 1, 'rgba(100,100,255,1)');
                        makePoint(element.extremities.boundingBox.bottomRight.x, element.extremities.boundingBox.bottomRight.y, 'bottomRight', 1, 'rgba(100,100,255,1)');
                        for(var a = 0; a < element.extremities.points.length; a++){
                            makePoint(element.extremities.points[a].x, element.extremities.points[a].y, 'point_'+a, 0.5, 'rgba(255,100,100,1)');
                        }
                    }
                };
                var elementLibrary = new function(){
                    this.polygon = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'polygon';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                                this.dotFrame = false;
                    
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
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){
                            //if this shape is to be ignored anyway, don't bother with any of this
                                if(element.ignored){return;}
                    
                            //actual computation of extremities
                                computeExtremities(
                                    offset == undefined,
                                    element,
                                    offset,
                                    function(element,offset){
                                        element.extremities = {};
                                        element.extremities.points = element.points.map(function(point){
                                            point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,-offset.a);
                                            point.x += offset.x;
                                            point.y += offset.y;
                                            return point;
                                        });
                                        element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                                    },
                                );
                    
                            //perform dot frame render
                                makeDotFrame(element);
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){        
                            //run through all points in the poly, and account for the offsets
                                var points = element.points.map( function(a){
                                    //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                        if(offset.a != 0){
                                            a = canvas.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
                                        }
                                    //add positional offset to point
                                        return {x:a.x+offset.x, y:a.y+offset.y};
                                } );
                    
                            //draw polygon path
                                //get initial point and line thickness - if this element isn't static; adjust it's position and line thickness to account for viewport position
                                //otherwise just use the value as is
                                    var point = static ? {x:points[0].x,y:points[0].y} : adapter.workspacePoint2windowPoint(points[0].x,points[0].y);
                                    var lineWidth_temp = static ? element.style.lineWidth : adapter.length(element.style.lineWidth);
                    
                                //begin drawing and move the inital point
                                    context.beginPath(); 
                                    context.moveTo(point.x,point.y);
                                
                                //go through all points, drawing lines between each, still checking to see if this element is static, and adjusting
                                //the point's position if not
                                    for(var a = 1; a < points.length; a++){
                                        point = static ? {x:points[a].x,y:points[a].y} : adapter.workspacePoint2windowPoint(points[a].x,points[a].y);
                                        context.lineTo(point.x,point.y);
                                    }
                                    context.closePath(); 
                    
                    
                                //if the element isn't static; adjust it's shadow positions to account for viewport position
                                    var temp = {};
                                    if(!static){                    
                                        temp.shadowBlur = adapter.length(element.style.shadowBlur);
                                        temp.shadowOffset = {
                                            x:adapter.length(element.style.shadowOffset.x),
                                            y:adapter.length(element.style.shadowOffset.y),
                                        };
                                    }
                    
                            //paint this shape as requested
                                context.fillStyle = element.style.fill;
                                context.strokeStyle = element.style.stroke;
                                context.lineWidth = lineWidth_temp;
                                context.lineJoin = element.style.lineJoin;
                                context.miterLimit = element.style.miterLimit;
                                context.shadowColor = element.style.shadowColour;
                                context.shadowBlur = temp.shadowBlur;
                                context.shadowOffsetX = temp.shadowOffset.x;
                                context.shadowOffsetY = temp.shadowOffset.y;
                                context.fill(); 
                                context.stroke();
                        },
                    
                    };
                    this.circle = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'circle';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                                this.dotFrame = false;
                    
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
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){
                            //if this shape is to be ignored anyway, don't bother with any of this
                                if(element.ignored){return;}
                    
                            //actual computation of extremities
                                computeExtremities(
                                    offset == undefined,
                                    element,
                                    offset,
                                    function(element,offset){
                                        element.extremities = {};
                                        element.extremities.points = canvas.library.math.pointsOfCircle(element.x, element.y, element.r, 20);
                                        element.extremities.points = element.extremities.points.map(function(point){
                                            point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                            point.x += offset.x;
                                            point.y += offset.y;
                                            return point;
                                        });
                                        element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                                    },
                                );
                    
                            //perform dot frame render
                                makeDotFrame(element);
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
                                offset.x += point.x-element.x;
                                offset.y += point.y-element.y;
                    
                            //collect element position into a neat package
                            //collect element position into a neat package
                                var position = {
                                    location:{
                                        x:(element.x+offset.x),
                                        y:(element.y+offset.y)
                                    },
                                };
                                var temp = {
                                    r: element.r,
                                    lineWidth:element.style.lineWidth,
                                    shadowBlur:element.style.shadowBlur,
                                    shadowOffset:{
                                        x:element.style.shadowOffset.x,
                                        y:element.style.shadowOffset.y,
                                    }
                                };
                    
                            //if the element isn't static; adjust it's position and line thickness to account for viewport position
                                if(!static){
                                    position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);
                    
                                    temp.r = adapter.length(element.r);
                                    temp.lineWidth = adapter.length(element.style.lineWidth);
                                    temp.shadowBlur = adapter.length(element.style.shadowBlur);
                                    temp.shadowOffset = {
                                        x:adapter.length(element.style.shadowOffset.x),
                                        y:adapter.length(element.style.shadowOffset.y),
                                    };
                                }
                    
                            //actual render
                                context.fillStyle = element.style.fill;
                                context.strokeStyle = element.style.stroke;
                                context.lineWidth = temp.lineWidth;
                                context.shadowColor = element.style.shadowColour;
                                context.shadowBlur = temp.shadowBlur;
                                context.shadowOffsetX = temp.shadowOffset.x;
                                context.shadowOffsetY = temp.shadowOffset.y;
                                context.beginPath();
                                context.arc(position.location.x,position.location.y, temp.r, 0, 2 * Math.PI, false);
                                context.closePath(); 
                                context.fill();
                        },
                    
                    };
                    this.image = {
                    
                        cache:{},
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'image';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                                this.dotFrame = false;
                    
                                this.x = 0;
                                this.y = 0;
                                this.anchor = {x:0,y:0};
                                this.angle = 0;
                                this.width = 0;
                                this.height = 0;
                    
                                this.url = '';
                    
                                this.style = {
                                    shadowColour:'rgba(0,0,0,0)',
                                    shadowBlur:20,
                                    shadowOffset:{x:20, y:20},
                                };
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){
                            //if this shape is to be ignored anyway, don't bother with any of this
                                if(element.ignored){return;}
                    
                            //actual computation of extremities
                                computeExtremities(
                                    offset == undefined,
                                    element,
                                    offset,
                                    function(element,offset){
                                        element.extremities = {};
                                        element.extremities.points = canvas.library.math.pointsOfRect(element.x, element.y, element.width, element.height, element.angle, element.anchor);
                                        element.extremities.points = element.extremities.points.map(function(point){
                                            point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                            point.x += offset.x;
                                            point.y += offset.y;
                                            return point;
                                        });
                                        element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                                    },
                                );
                    
                            //perform dot frame render
                                makeDotFrame(element);
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
                                offset.x += point.x-element.x;
                                offset.y += point.y-element.y;
                    
                            //collect element position into a neat package
                                var position = {
                                    location:{
                                        x:(element.x+offset.x),
                                        y:(element.y+offset.y)
                                    },
                                    angle:(element.angle+offset.a)
                                };
                                var temp = {
                                    width: element.width,
                                    height: element.height,
                                };
                    
                            //if the element isn't static; adjust it's position to account for viewport position
                                if(!static){
                                    position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);
                                    position.location = canvas.library.math.cartesianAngleAdjust(position.location.x,position.location.y,-position.angle);
                                    position.location.x += adapter.length(-element.anchor.x*temp.width);
                                    position.location.y += adapter.length(-element.anchor.y*temp.height);
                    
                                    temp.width = adapter.length(temp.width);
                                    temp.height = adapter.length(temp.height);
                    
                                    temp.shadowBlur = adapter.length(element.style.shadowBlur);
                                    temp.shadowOffset = {
                                        x:adapter.length(element.style.shadowOffset.x),
                                        y:adapter.length(element.style.shadowOffset.y),
                                    };
                                }
                    
                            //if this image url is not cached; cache it
                                if( !this.cache.hasOwnProperty(element.url) ){
                                    this.cache[element.url] = new Image(); 
                                    this.cache[element.url].src = element.url;
                                }
                    
                            //actual render
                                context.shadowColor = element.style.shadowColour;
                                context.shadowBlur = temp.shadowBlur;
                                context.shadowOffsetX = temp.shadowOffset.x;
                                context.shadowOffsetY = temp.shadowOffset.y;
                                context.save();
                                context.rotate( position.angle );
                                context.drawImage( this.cache[element.url], position.location.x, position.location.y, temp.width, temp.height );
                                context.restore();
                        },
                    };
                    this.rectangle = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'rectangle';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                                this.dotFrame = false;
                    
                                this.x = 0;
                                this.y = 0;
                                this.anchor = {x:0,y:0};
                                this.angle = 0;
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
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){
                            //if this shape is to be ignored anyway, don't bother with any of this
                                if(element.ignored){return;}
                    
                            //actual computation of extremities
                                computeExtremities(
                                    offset == undefined,
                                    element,
                                    offset,
                                    function(element,offset){
                                        element.extremities = {};
                                        element.extremities.points = canvas.library.math.pointsOfRect(element.x, element.y, element.width, element.height, element.angle, element.anchor);
                                        element.extremities.points = element.extremities.points.map(function(point){
                                            point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                            point.x += offset.x;
                                            point.y += offset.y;
                                            return point;
                                        });
                                        element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                                    },
                                );
                    
                            //perform dot frame render
                                makeDotFrame(element);
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
                                offset.x += point.x-element.x;
                                offset.y += point.y-element.y;
                    
                            //collect element position into a neat package
                                var position = {
                                    location:{
                                        x:(element.x+offset.x),
                                        y:(element.y+offset.y)
                                    },
                                    angle:(element.angle+offset.a)
                                };
                                var temp = {
                                    width: element.width,
                                    height: element.height,
                                    lineWidth: element.style.lineWidth,
                                };
                    
                            //if the element isn't static; adjust it's position and line thickness to account for viewport position
                                if(!static){
                                    position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);
                                    position.location = canvas.library.math.cartesianAngleAdjust(position.location.x,position.location.y,-position.angle);
                                    position.location.x += adapter.length(-element.anchor.x*temp.width);
                                    position.location.y += adapter.length(-element.anchor.y*temp.height);
                    
                                    temp.width = adapter.length(temp.width);
                                    temp.height = adapter.length(temp.height);
                    
                                    temp.lineWidth = adapter.length(temp.lineWidth);
                                    temp.shadowBlur = adapter.length(element.style.shadowBlur);
                                    temp.shadowOffset = {
                                        x:adapter.length(element.style.shadowOffset.x),
                                        y:adapter.length(element.style.shadowOffset.y),
                                    };
                                }
                    
                            //actual render
                                context.fillStyle = element.style.fill;
                                context.strokeStyle = element.style.stroke;
                                context.lineWidth = temp.lineWidth;
                                context.shadowColor = element.style.shadowColour;
                                context.shadowBlur = temp.shadowBlur;
                                context.shadowOffsetX = temp.shadowOffset.x;
                                context.shadowOffsetY = temp.shadowOffset.y;
                                context.save();
                                context.rotate( position.angle );
                                context.fillRect( position.location.x, position.location.y, temp.width, temp.height );
                                context.strokeRect( position.location.x, position.location.y, temp.width, temp.height );
                                context.restore();
                        },
                    
                    };
                    this.advancedPolygon = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'advancedPolygon';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                    
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
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){},
                    
                        render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){  },
                    
                    };
                    this.group = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'group';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                                this.dotFrame = false;
                    
                                this.x = 0;
                                this.y = 0;
                                this.angle = 0;
                                this.children = [];
                    
                                this.prepend = function(element){
                                    //check that the element is valid
                                        var temp = core.arrangement.checkElementIsValid(element, this.children);
                                        if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                                    this.children.unshift(element);
                    
                                    element.parent = this;
                                    
                                    elementLibrary[element.type].computeExtremities(element);
                                };
                                this.append = function(element){            
                                    //check that the element is valid
                                        var temp = core.arrangement.checkElementIsValid(element, this.children);
                                        if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                                    this.children.push(element);
                    
                                    element.parent = this;
                                    
                                    elementLibrary[element.type].computeExtremities(element);
                    
                                };
                                this.remove = function(element){
                                    if(element == undefined){return;}
                    
                                    var index = this.children.indexOf(element);
                                    if(index < 0){return;}
                                    this.children.splice(index, 1);
                    
                                    element.parent = undefined;
                                };
                                this.getChildByName = function(name){
                                    for(var a = 0; a < this.children.length; a++){
                                        if( this.children[a].name == name ){return this.children[a];}
                                    }
                                };
                            };
                    
                            return obj;
                        },
                    
                        computeExtremities:function(element,offset){
                            //if this shape is to be ignored anyway, don't bother with any of this
                                if(element.ignored){return;}
                    
                            //actual computation of extremities
                                computeExtremities(
                                    offset == undefined,
                                    element,
                                    offset,
                                    function(element,offset){
                    
                                        element.extremities = {};
                                        element.extremities.points = [{x:element.x+offset.x, y:element.y+offset.y}];
                                        element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                                        for(var a = 0; a < element.children.length; a++){
                                            var child = element.children[a];
                                            elementLibrary[child.type].computeExtremities(child,offset);
                                        }
                    
                                    },
                                );
                    
                            //perform dot frame render
                                makeDotFrame(element);
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
                                offset.x += point.x-element.x;
                                offset.y += point.y-element.y;
                    
                            //cycle through all children
                                for(var a = 0; a < element.children.length; a++){
                                    var item = element.children[a];
                    
                                    elementLibrary[item.type].render(
                                        context,
                                        item,
                                        {
                                            a: offset.a + element.angle,
                                            x: offset.x + element.x,
                                            y: offset.y + element.y,
                                            parentAngle: element.angle,
                                        },
                                        (static||item.static)
                                    );
                                }
                    
                        },
                    
                    };
                    this.text = {
                    
                        create:function(){
                            var obj = new function(){
                                this.type = 'text';
                    
                                this.name = '';
                                this.ignored = false;
                                this.static = false;
                                this.parent = undefined;
                                this.dotFrame = true;
                    
                                this.x = 0;
                                this.y = 0;
                                this.text = 'Hello';
                                this.angle = 0;
                                this.size = 0.5;
                    
                                this.style = {
                                    font:'100px Arial',
                                    align:'start', //start/end/center/lief/right 
                                    baseline:'alphabetic',  //alphabetic/top/hanging/middle/ideographic/bottom
                                    fill:'rgba(255,100,100,1)',
                                    stroke:'rgba(0,0,0,0)',
                                    lineWidth:1,
                                    shadowColour:'rgba(0,0,0,0.5)',
                                    shadowBlur:2,
                                    shadowOffset:{x:20, y:20},
                                };
                            };
                    
                            return obj;  
                        },
                    
                        computeExtremities:function(element,offset){
                            //if this shape is to be ignored anyway, don't bother with any of this
                                if(element.ignored){return;}
                    
                            //actual computation of extremities
                                computeExtremities(
                                    offset == undefined,
                                    element,
                                    offset,
                                    function(element,offset){
                                        element.extremities = {};
                                        element.extremities.points = canvas.library.math.pointsOfText(
                                            element.text,
                                            element.x, 
                                            element.y, 
                                            element.angle, 
                                            element.size,
                                            element.style.font,
                                            element.style.align,
                                            element.style.baseline,
                                        );
                                        element.extremities.points = element.extremities.points.map(function(point){
                                            point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                            point.x += offset.x;
                                            point.y += offset.y;
                                            return point;
                                        });
                                        element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                                    },
                                );
                        
                            //perform dot frame render
                                makeDotFrame(element);
                        },
                    
                        render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){        
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
                                offset.x += point.x-element.x;
                                offset.y += point.y-element.y;
                    
                            //collect element adjustable attributes into neat package
                                var package = {
                                    location:{
                                            x: (element.x+offset.x),
                                            y: (element.y+offset.y)
                                        },
                                    angle: (element.angle+offset.a),
                                    size: element.size,
                    
                                    lineWidth: element.style.lineWidth,
                                    shadowBlur: element.style.shadowBlur,
                                    shadowOffsetX: element.style.shadowOffset.x,
                                    shadowOffsetY: element.style.shadowOffset.y,
                                };
                    
                            //if the element isn't static; adjust the package
                                if(!static){
                                    package.location = adapter.workspacePoint2windowPoint(package.location.x,package.location.y);
                                    package.location = canvas.library.math.cartesianAngleAdjust(package.location.x,package.location.y,-package.angle);
                    
                                    package.size = adapter.length(package.size);
                                    
                                    package.lineWidth = adapter.length(package.lineWidth);
                                    package.shadowBlur = adapter.length(package.shadowBlur);
                                    package.shadowOffsetX = adapter.length(package.shadowOffsetX);
                                    package.shadowOffsetY = adapter.length(package.shadowOffsetY);
                                }
                    
                            //actual render
                                context.font = element.style.font;
                                context.textAlign = element.style.align;
                                context.textBaseline = element.style.baseline;
                                context.fillStyle = element.style.fill;
                                context.strokeStyle = element.style.stroke;
                                context.lineWidth = package.lineWidth;
                                context.shadowColor = element.style.shadowColour;
                                context.shadowBlur = package.shadowBlur;
                                context.shadowOffsetX = package.shadowOffsetX;
                                context.shadowOffsetY = package.shadowOffsetY;
                    
                                context.save();
                                context.rotate( package.angle );
                                context.scale(package.size,package.size);
                                context.fillText( element.text, package.location.x/package.size, package.location.y/package.size );
                                context.shadowColor = 'rgba(0,0,0,0)'; //to stop stroke shadows drawing over the fill text (an uncreative solution)
                                context.strokeText( element.text, package.location.x/package.size, package.location.y/package.size );
                                context.restore();
                        },
                    
                    };
                }
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
                
                
                
                this.arrangement = new function(){
                    var design = [];
                
                    this.get = function(){return design};
                    this.createElement = function(type){
                        try{
                            return elementLibrary[type].create();
                        }catch(e){
                            console.error('attempting to create unknown shape "'+type+'"');
                        }
                    };
                    this.prepend = function(element){
                        //check that the element is valid
                            var temp = this.checkElementIsValid(element, design);
                            if(temp != undefined){console.error('element invalid:',temp); return;}
                
                        design.unshift(element);
                        
                        elementLibrary[element.type].computeExtremities(element);
                    };
                    this.append = function(element){
                        //check that the element is valid
                            var temp = this.checkElementIsValid(element, design);
                            if(temp != undefined){console.error('element invalid:',temp); return;}
                
                        design.push(element);
                        
                        elementLibrary[element.type].computeExtremities(element);
                    };
                    this.remove = function(element){
                        if(element == undefined){return;}
                
                        var index = design.indexOf(element);
                        if(index < 0){return;}
                        design.splice(index, 1);
                    };
                    this.getElementUnderPoint = function(x,y){
                
                        function recursiveSearch(x,y,group){
                            //go through group in reverse;
                            //  if the item is a group; check if the point is within its bounding box. If it is, use recursion
                            //  otherwise; compute whether the point is within the items extremity points
                            for(var a = group.length-1; a >= 0; a--){
                                var item = group[a];
                                var tempX = x;
                                var tempY = y;
                
                                //if the item declares that it should be ignored by this function; skip over it
                                    if(item.ignored){continue;}
                                
                                //if this is a static object, adjust the x and y values accordingly
                                    if( item.static ){
                                        var p = adapter.workspacePoint2windowPoint(x,y);
                                        tempX = p.x; 
                                        tempY = p.y;
                                    }
                
                                //determine if the point lies within the bounds of this item
                                    if( canvas.library.math.detectOverlap.pointWithinBoundingBox({x:tempX,y:tempY},item.extremities.boundingBox) ){
                                        if(item.type == 'group'){
                                            var temp = recursiveSearch(tempX,tempY,item.children);
                                            if(temp != undefined){return temp;}
                                        }else{
                                            if( elementLibrary[item.type].pointWithinCustomHitBox != undefined ){
                                                if( elementLibrary[item.type].pointWithinCustomHitBox(item,{x:temp.x,y:temp.y}) ){ return item; }
                                            }
                                            else if( item.extremities.points != undefined ){
                                                if( canvas.library.math.detectOverlap.pointWithinPoly( {x:tempX,y:tempY}, item.extremities.points )){ return item; }
                                            }
                                        }
                                    }      
                            }
                        }
                
                        return recursiveSearch(x,y,design);
                    };
                
                    this.getChildByName = function(name){
                        for(var a = 0; a < design.length; a++){
                            if( design[a].name == name ){return design[a];}
                        }
                    };
                    this.forceRefresh = function(element){
                        elementLibrary[element.type].computeExtremities(element);
                    };
                    this.checkElementIsValid = function(element,destination){
                        //check for name
                            if(element.name == undefined){return 'element has no name'}
                
                        //check that the name is not already taken in this grouping
                            for(var a = 0; a < destination.length; a++){
                                if( destination[a].name == element.name ){ 
                                    console.error('element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+parent.name+'"')+''); 
                                    return;
                                }
                            }
                        
                        return;
                    };
                };
                this.viewport = new function(){
                    var pageData = {
                        defaultSize:{width:640, height:480},
                        width:0, height:0,
                        windowWidth:0, windowHeight:0,
                    };
                    var state = {
                        position:{x:0,y:0},
                        scale:2,
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
                    var context = canvas.getContext('2d', { alpha: false });
                    var animationRequestId = undefined;
                
                    function clearFrame(){
                        context.fillStyle = 'rgb(255,255,255)';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    function renderFrame(noClear=false){
                        //clear the canvas
                            if(!noClear){ clearFrame(); }
                
                        //cycle through elements in design and activate their render functions
                            var design = core.arrangement.get();
                            for(var a = 0; a < design.length; a++){
                                elementLibrary[design[a].type].render(context,design[a]);
                            }
                    }
                    function animate(timestamp){
                        animationRequestId = requestAnimationFrame(animate);
                
                        //attempt to render frame, if there is a failure; stop animation loop and report the error
                            try{
                                renderFrame();
                            }catch(e){
                                core.render.active(false);
                                console.error('major animation error');
                                console.error(e);
                            }
                
                        //perform stats collection
                            core.stats.collect(timestamp);
                    }
                
                    // this.makeDot = function(x,y){
                    //     var r = 2;
                
                    //     //actual render
                    //         context.fillStyle = 'rgb(0,0,0)';
                    //         context.strokeStyle = '';
                    //         context.lineWidth = '';
                    //         context.save();
                    //         context.translate(x,y);
                    //         context.beginPath();
                    //         context.arc(0, 0, adapter.length(r), 0, 2 * Math.PI, false);
                    //         context.closePath(); 
                    //         context.fill();
                    //         context.restore();
                    // };
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
                    var active = true;
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
        var grou1 = canvas.core.arrangement.createElement('group');
            grou1.name = 'testGroup1';
            grou1.x = 50; grou1.y = 50;
            grou1.angle = 0.3;
            canvas.core.arrangement.append(grou1);
        
        var rect = canvas.core.arrangement.createElement('rectangle');
            rect.name = 'testRectangle1';
            rect.x = 0; rect.y = 0;
            rect.width = 30; rect.height = 30;
            rect.style.fill = 'rgba(0,255,0,0.3)';
            grou1.children.push(rect);
            rect.parent = grou1;
            canvas.core.arrangement.forceRefresh(rect);
        
        var rect = canvas.core.arrangement.createElement('rectangle');
            rect.name = 'testRectangle2';
            rect.x = 30; rect.y = 30;
            rect.width = 30; rect.height = 30;
            rect.style.fill = 'rgba(0,255,0,0.3)';
            grou1.children.push(rect);
            rect.parent = grou1;
            canvas.core.arrangement.forceRefresh(rect);
        
        var rect = canvas.core.arrangement.createElement('rectangle');
            rect.name = 'testRectangle2';
            rect.x = 10; rect.y = 100;
            rect.width = 30; rect.height = 30;
            rect.style.fill = 'rgba(255,0,0,0.4)';
            grou1.children.push(rect);
            rect.parent = grou1;
            canvas.core.arrangement.forceRefresh(rect);
        var text = canvas.core.arrangement.createElement('text');
            text.name = 'testText1';
            text.x = 10; text.y = 100;
            grou1.children.push(text);
            text.parent = grou1;
            canvas.core.arrangement.forceRefresh(text);
        
        
        canvas.core.render.frame();


    }
}
