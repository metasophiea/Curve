var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var canvas = __canvasElements[__canvasElements_count];
        canvas.system = new function(){};
        
        canvas.system.utility = new function(){
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
            this.detectOverlap = new function(){
                this.boundingBoxOnly = function(a, b){
                    return !(
                        (a.bottomRight.y < b.topLeft.y) ||
                        (a.topLeft.y > b.bottomRight.y) ||
                        (a.bottomRight.x < b.topLeft.x) ||
                        (a.topLeft.x > b.bottomRight.x)   
                    );};
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
            this.functionListRunner = function(list){
                //function builder for working with the 'functionList' format
            
                return function(event){
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
                                    if( list[a].function(event) ){ break; }
                            }
                        }
                }
            };
        };
        canvas.system.core = new function(){
            //stored values
                this.imageCache = {};
                this.stats = {
                    active:false,
                    average:60,
                };
                this.element = {};
                this.viewport = {
                    position:{x:0,y:0},
                    scale:3,
                    angle:0,
                    corners:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                    boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} }
                };
            
            //"workspace -> canvas" and "canvas -> workspace" adaptation
                this.adapter = new function(){
                    this.angle = function(a=0){
                        return canvas.system.core.viewport.angle - a;
                    };
                    this.point_cache = [];
                    this.point = function(x,y){
                        return this.workspacePoint2windowPoint(x,y);
                    };
                    this.length = function(l){
                        return l*canvas.system.core.viewport.scale;
                    };
                    this.windowPoint2workspacePoint = function(x,y){
                        x = (x/canvas.system.core.viewport.scale) - canvas.system.core.viewport.position.x;
                        y = (y/canvas.system.core.viewport.scale) - canvas.system.core.viewport.position.y;
            
                        return canvas.system.utility.cartesianAngleAdjust(x,y,-canvas.system.core.viewport.angle);
                    };
                    this.workspacePoint2windowPoint = function(x,y){
                        var point = canvas.system.utility.cartesianAngleAdjust(x,y,canvas.system.core.viewport.angle);
            
                        return {
                            x: (point.x+canvas.system.core.viewport.position.x) * canvas.system.core.viewport.scale,
                            y: (point.y+canvas.system.core.viewport.position.y) * canvas.system.core.viewport.scale
                        };
                    };
                };
            
            //canvas adjustment
                this.canvasSizeAdjust = function(){
                    var element = canvas.system.core.element;
            
                    var width = canvas.getAttribute('workspaceWidth');
                    if( element.width != width || element.windowWidth != window.innerWidth ){
                        element.width = width;
                        element.windowWidth = window.innerWidth;
            
                        if(width == undefined){
                            canvas.width = 640;
                        }else if( width.indexOf('%') == (width.length-1) ){
                            var parentSize = canvas.parentElement.offsetWidth
                            var percent = parseFloat(width.slice(0,(width.length-1))) / 100;
                            canvas.width = parentSize * percent;
                        }else{
                            canvas.width = width;
                        }
            
                        canvas.system.core.viewport.width = canvas.width;
                    }
            
                    var height = canvas.getAttribute('workspaceHeight');
                    if( element.height != height || element.windowHeight != window.innerHeight ){
                        element.height = height;
                        element.windowHeight = window.innerHeight;
            
                        if(height == undefined){
                            canvas.height = 480;
                        }else if( height.indexOf('%') == (height.length-1) ){
                            var parentSize = canvas.parentElement.offsetHeight
                            var percent = parseFloat(height.slice(0,(height.length-1))) / 100;
                            canvas.height = parentSize * percent;
                        }else{
                            canvas.height = height;
                        }
            
                        canvas.system.core.viewport.width = canvas.height;
                    }
                };
            
            //element
                this.element = {};
                this.element.arrangement = [];
                this.element.draw = {
                    context:canvas.getContext('2d', { alpha: false }),
                    clear:function(){
                        // this.context.clearRect(0, 0, canvas.width, canvas.height);
            
                        var context = canvas.system.core.element.draw.context;
                        context.fillStyle = 'rgb(255,255,255)';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    },
                    dot:function(x,y,r=1,fillStyle='rgba(255,0,0,1)'){
                        var context = this.context;
            
                        context.fillStyle = fillStyle;
                        context.strokeStyle = '';
                        context.lineWidth = '';
                    
                        context.save();
                        var p = canvas.system.core.adapter.point(x,y); context.translate(p.x,p.y);
                        context.beginPath();
                        context.arc(0, 0, canvas.system.core.adapter.length(r), 0, 2 * Math.PI, false);
                        context.fill();
                        context.restore();
                    },
                    rect:function(x,y,width,height,angle=0,anchor={x:0,y:0},fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1){
                        var context = canvas.system.core.element.draw.context;
            
                        context.fillStyle = fillStyle;
                        context.strokeStyle = strokeStyle;
                        context.lineWidth = lineWidth;
            
                        var p = canvas.system.core.adapter.point(x,y);
                        p = canvas.system.utility.cartesianAngleAdjust(p.x,p.y,angle);
            
                        context.save();
                        context.rotate( canvas.system.core.adapter.angle(angle) );
                        context.fillRect(   
                            canvas.system.core.adapter.length(-anchor.x*width) + p.x, 
                            canvas.system.core.adapter.length(-anchor.y*height) + p.y, 
                            canvas.system.core.adapter.length(width), 
                            canvas.system.core.adapter.length(height)
                        );
                        context.strokeRect( 
                            canvas.system.core.adapter.length(-anchor.x*width) + p.x, 
                            canvas.system.core.adapter.length(-anchor.y*height) + p.y, 
                            canvas.system.core.adapter.length(width), 
                            canvas.system.core.adapter.length(height)
                        );	
                        context.restore();
                    },
                    poly:function(points,fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1){
                        var context = canvas.system.core.element.draw.context;
            
                        context.fillStyle = fillStyle;
                        context.strokeStyle = strokeStyle;
                        context.lineWidth = lineWidth;
                    
                        context.beginPath(); 
                        var p = canvas.system.core.adapter.point(points[0].x,points[0].y); context.moveTo(p.x,p.y);
                        for(var a = 1; a < points.length; a++){ 
                            var p = canvas.system.core.adapter.point(points[a].x,points[a].y); context.lineTo(p.x,p.y);
                        }
                    
                        context.closePath(); 
                        context.fill(); 
                        context.stroke();
                    },
                    image:function(x,y,width,height,angle=0,anchor={x:0,y:0},url){
                        //if the url is missing; draw the default shape
                            if(url == undefined){
                                canvas.system.core.element.draw.rect(x,y,width,height,angle,anchor,"rgb(50,50,50)","rgb(255,0,0)",3);
                                return;
                            }
            
                        //if this image url is not cached; cache it
                            if( !canvas.system.core.imageCache.hasOwnProperty(url) ){
                                canvas.system.core.imageCache[url] = new Image(); 
                                canvas.system.core.imageCache[url].src = url;
                            }
                    
                        //main render (using cached image)
                            var context = canvas.system.core.element.draw.context;
                            context.save();
                            var p = canvas.system.core.adapter.point(x,y); context.translate(p.x,p.y);
                            context.rotate( canvas.system.core.adapter.angle(angle) );
                            context.drawImage(canvas.system.core.imageCache[url], canvas.system.core.adapter.length(-anchor.x*width), canvas.system.core.adapter.length(-anchor.y*height), canvas.system.core.adapter.length(width), canvas.system.core.adapter.length(height));
                            context.restore();
                    },
                };
                // this.element.recompute = function(element,offset={x:0,y:0,angle:0},parent){
                //     var data = element.data;
                //     data.angle = data.angle?data.angle:0;
            
                //     // //collection of offset values from the element's parents (if it has any)
                //     //     if(element.parent != undefined){
                //     //         // console.log(element.parent);
                //     //         var tempParent = element;
            
                //     //         do{
                //     //             console.log(tempParent);
                //     //             tempParent = tempParent.parent;
                //     //         }while(tempParent != undefined)
                //     //         console.log('--');
                //     //     }
                    
                //     //computation of all outter points and bounding boxes for element (and it's children if it has any)
                //     switch(element.type){
                //         case 'group':
                //             if(offset.angle != 0){
                //                 var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offset.angle);
                //                 offset.x -= data.x - point.x;
                //                 offset.y -= data.y - point.y;
                //             }
            
                //             var points = [{x:data.x,y:data.y}];
                //             for(var a = 0; a < element.children.length; a++){
                //                 var bb = this.recompute( 
                //                     element.children[a], 
                //                     {x:data.x+offset.x, y:data.y+offset.y, angle:data.angle+offset.angle},
                //                     element
                //                 );
                //                 points.push(
                //                     {x:bb.topLeft.x, y:bb.topLeft.y},
                //                     {x:bb.bottomRight.x, y:bb.bottomRight.y}
                //                 );
                //             }
                            
                //             element.boundingBox = canvas.system.utility.boundingBoxFromPoints(points);
                //         break;
                //         case 'dot': 
                //             if(offset.angle != 0){
                //                 var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offset.angle);
                //                 offset.x -= data.x - point.x;
                //                 offset.y -= data.y - point.y;
                //             }
            
                //             element.points = [{x:data.x+offset.x,y:data.y+offset.y}];
                //             element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                //         break;
                //         case 'rect': case 'image':
                //             if(offset.angle != 0){
                //                 var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offset.angle);
                //                 offset.x -= data.x - point.x;
                //                 offset.y -= data.y - point.y;
                //             }
            
                //             element.points = canvas.system.utility.pointsOfRect(data.x+offset.x, data.y+offset.y, data.width, data.height, data.angle+offset.angle, data.anchor);
                //             element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                //         break;
                //         case 'poly':
                //             element.points = data.points.map( function(a){
                //                 if(offset.angle != 0){ a = canvas.system.utility.cartesianAngleAdjust(a.x,a.y,-offset.angle); }
                //                 return {x:a.x+offset.x, y:a.y+offset.y};
                //             } );
            
                //             element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                //         break;
                //     }
            
                //     return element.boundingBox;
                // };
                this.element.recompute2 = function(element){
                    //computes points and bounding box for provided element, and updates the bounding boxes for all all parents
            
                    //get and compute parent offsets
                        //gather x, y, and angle data from this element up
                            var offsetList = [];
                            var temp = element;
                            do{
                                offsetList.unshift( {x:temp.data.x, y:temp.data.y, a:temp.data.angle} );
                            }while((temp=temp.parent) != undefined)
            
                        //calculate them together into on offset
                            var offset = { x:offsetList[0].x, y:offsetList[0].y, a:0 };
                            for(var a = 1; a < offsetList.length; a++){
                                var point = canvas.system.utility.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,-(offset.a+offsetList[a-1].a));
                                offset.a += offsetList[a-1].a;
                                offset.x += point.x;
                                offset.y += point.y;
                            }
                            canvas.system.core.element.draw.dot( offset.x,offset.y,undefined,'rgba(255,0,0,1)' );
            
                    //create points and bouding box for this element
                        switch(element.type){
                            case 'group': 
                                element.points = [{x:element.data.x, y:element.data.y}];
                                element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                            break;
                            case 'dot': 
                                element.points = [{x:element.data.x, y:element.data.y}];
                                element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                            break;
                            case 'rect':
                                element.points = canvas.system.utility.pointsOfRect(offset.x, offset.y, element.data.width, element.data.height, offset.a, element.data.anchor);
                                element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                                for(var a = 0; a < element.points.length; a++){ canvas.system.core.element.draw.dot( element.points[a].x,element.points[a].y,undefined,'rgba(0,255,0,1)' ); }
                            break;
                        }
            
                    //update all parents' bounding boxes
                        var temp = element;
                        while((temp=temp.parent) != undefined){
                            var boundingBoxPoints = [];
                            for(var a = 0; a < temp.children.length; a++){
                                boundingBoxPoints.push( temp.children[a].boundingBox.topLeft );
                                boundingBoxPoints.push( temp.children[a].boundingBox.bottomRight );
                            }
                            temp.boundingBox = canvas.system.utility.boundingBoxFromPoints( boundingBoxPoints );
            
                            canvas.system.core.element.draw.dot( temp.boundingBox.topLeft.x,temp.boundingBox.topLeft.y,undefined,'rgba(0,0,255,1)' );
                            canvas.system.core.element.draw.dot( temp.boundingBox.bottomRight.x,temp.boundingBox.bottomRight.y,undefined,'rgba(0,0,255,1)' );
                        }
                };
                this.element.add = function(element,parent,index){
                    if(parent == undefined){
                        if(index == undefined){ this.arrangement.push(element);             }
                        else{                   this.arrangement.splice(index, 0, element); }
                        // this.recompute(element);
                        this.recompute2(element);
                    }else{
                        if(index == undefined){ 
                            parent.children.push(element);
                            element.parent = parent;
                        }
                        else{
                            parent.children.splice(index, 0, element);
                            element.parent = parent;
                        }
                        // this.recompute(parent);
                        this.recompute2(element);
                    }
            
                    // for(var a = 0; a < this.arrangement.length; a++){ this.recompute(this.arrangement[a]); }
                    return element;
                };
                this.element.remove = function(element){
                    var index = element.parent.children.indexOf(element);
                    element.parent.children.splice(index, 1);
                    this.recompute(element.parent);
                };
                this.element.getArrangement = function(){ return this.arrangement; };
                this.element.getParent = function(element){ return element.parent; };
                this.element.getChildren = function(element){ return element.children; };
                this.element.getElementUnderPoint = function(x,y){
            
                    function recursiveTrawl(group,x,y){
                        //go through group in reverse;
                        //  if the item is group; use recursion
                        //  otherwise; computer whether the point is within the poly
                            for(var a = group.length-1; a >= 0; a--){
                                var item = group[a];
            
                                if(item.type == 'group'){
                                    var temp = recursiveTrawl(item.children,x,y);
                                    if(temp){return temp;}
                                }else{
                                    if( !item.points ){continue;}//if this item doesn't have a bounding box; ignore all of this
                                    if( canvas.system.utility.detectOverlap.pointWithinPoly( {x:x,y:y}, item.points )){ return item; }
                                }
            
                            }
                    }
                    
                    return recursiveTrawl(this.arrangement,x,y);
                };
            
            //rendering and animation
                this.renderElement = function(element,offsetX=0,offsetY=0,offsetAngle=0){
                    //use bounding box to determine whether this shape should be rendered
                        if( !canvas.system.utility.detectOverlap.boundingBoxOnly(this.viewport.boundingBox, element.boundingBox) ){ return; }
            
                    //main rendering area
                        var data = element.data;
                        switch(element.type){
                            case 'rect':
                                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offsetAngle);
                                        offsetX -= data.x-point.x;
                                        offsetY -= data.y-point.y;
                                    }
            
                                //account for missing values
                                    data.angle = data.angle ? data.angle : 0;
                                    data.anchor = data.anchor ? data.anchor : {x:0,y:0};
            
                                //render shape
                                    this.element.draw[element.type]( 
                                        data.x+offsetX, 
                                        data.y+offsetY, 
                                        data.width, 
                                        data.height, 
                                        data.angle+offsetAngle, 
                                        data.anchor, 
                                        data.fillStyle, 
                                        data.strokeStyle, 
                                        data.lineWidth 
                                    );
                            break;
                            case 'poly':
                                //run through all points in the poly, and account for the offsets
                                    var points = data.points.map( function(a){
                                        //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                            if(offsetAngle != 0){
                                                a = canvas.system.utility.cartesianAngleAdjust(a.x,a.y,-offsetAngle);
                                            }
                                        //add positional offset to point
                                            return {x:a.x+offsetX, y:a.y+offsetY};
                                    } );
            
                                //render shape
                                    this.element.draw[element.type]( 
                                        points, 
                                        data.fillStyle, 
                                        data.strokeStyle, 
                                        data.lineWidth
                                    );
                            break;
                            case 'image':
                                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offsetAngle);
                                        offsetX -= data.x-point.x;
                                        offsetY -= data.y-point.y;
                                    }
            
                                //account for missing values
                                    data.angle = data.angle ? data.angle : 0;
                                    data.anchor = data.anchor ? data.anchor : {x:0,y:0};
            
                                //render shape
                                    this.element.draw[element.type]( 
                                        data.x+offsetX, 
                                        data.y+offsetY, 
                                        data.width, 
                                        data.height, 
                                        data.angle+offsetAngle,
                                        data.anchor, 
                                        data.url
                                    );
                            break;
                            case 'dot':
                                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offsetAngle);
                                        offsetX -= data.x-point.x;
                                        offsetY -= data.y-point.y;
                                    }
            
                                //render shape
                                    this.element.draw[element.type]( 
                                        data.x+offsetX, 
                                        data.y+offsetY, 
                                        data.r, 
                                        data.fillStyle
                                    );
                            break;
                            default: console.warn('unknown shape type "'+element.type+'"'); break;
                        }
            
                };
                this.render = function(noClear=false){
                    // canvas.system.core.element.arrangement[1].data.angle += -0.03;
            
                    //perform resize of canvas
                        this.canvasSizeAdjust();
            
                    //clear the canvas
                        if(!noClear){ this.element.draw.clear(); }
            
                    //calculate viewport corner points, and bounding box
                        var corners = this.viewport.corners;
                        corners.tl = this.adapter.windowPoint2workspacePoint(0,0);
                        corners.tr = this.adapter.windowPoint2workspacePoint(canvas.width,0);
                        corners.bl = this.adapter.windowPoint2workspacePoint(0,canvas.height);
                        corners.br = this.adapter.windowPoint2workspacePoint(canvas.width,canvas.height);
                        this.viewport.boundingBox = canvas.system.utility.boundingBoxFromPoints([corners.tl, corners.tr, corners.br, corners.bl]);
            
                    //sequentially - and recursively - render everything on the elements list
                        function recursiveRender(group,offsetX=0,offsetY=0,offsetAngle=0){
                            for(var a = 0; a < group.length; a++){
                                var item = group[a];
                                if(item.type == 'group'){ 
                                    var angle = item.data.angle?item.data.angle:0;
            
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(item.data.x,item.data.y,-offsetAngle);
                                        offsetX -= item.data.x-point.x;
                                        offsetY -= item.data.y-point.y;
                                    }
            
                                    recursiveRender( item.children, item.data.x+offsetX, item.data.y+offsetY, angle+offsetAngle );
                                }else{
                                    canvas.system.core.renderElement( item, offsetX, offsetY, offsetAngle );
                                }
                            }
                        }
                        recursiveRender(canvas.system.core.element.arrangement);
                };
                this.animate = function(timestamp){
                    var requestId = requestAnimationFrame(canvas.system.core.animate);
                    try{
                        canvas.system.core.render();
                    }catch(e){
                        cancelAnimationFrame(requestId);
                        console.error('major animation error');
                        console.error(e);
                    }
            
                    canvas.system.core.statCollection.fps(timestamp);
                };
            
            //stat collection
                this.statCollection = new function(){
                    this.fps = function(timestamp){
                        var stats = canvas.system.core.stats;
                        if( stats.active ){
                            if( !stats.hasOwnProperty('fpsCounter') ){
                                stats.fpsCounter = {};
                                stats.fpsCounter.frameTimeArray = [];
                            }
                            stats.fpsCounter.frameTimeArray.push( 1000/(timestamp-stats.oldTime) );
                            if( stats.fpsCounter.frameTimeArray.length >= stats.average){
                                console.log( 'frames per second:', canvas.system.utility.averageArray( stats.fpsCounter.frameTimeArray) );
                                stats.fpsCounter.frameTimeArray = [];
                            }
                            stats.oldTime = timestamp;
                        }
                    };
                };
            
            //callback
                var callbacks = ['onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel'];
                this.callback = {};
                for(var a = 0; a < callbacks.length; a++){
                    //interface
                        this.callback[callbacks[a]] = function(x,y,event){};
            
                    //attachment to canvas
                        canvas[callbacks[a]] = function(callback){
                            return function(event){
                                if( !canvas.system.core.callback[callback] ){return;}
                                var p = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                                canvas.system.core.callback[callback](p.x,p.y,event);
                            }
                        }(callbacks[a]);
                }
        };
        canvas.system.mouse = new function(){
            canvas.system.core.callback.onmousedown = function(x,y,event){ 
                // console.log( canvas.system.core.element.getElementUnderPoint(x,y) );
            
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmousedown)(event);
            };
            canvas.system.core.callback.onwheel = function(x,y,event){
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onwheel)(event);
            };
            
            
            
            this.tmp = {};
            this.functionList = {};
            
            
            this.functionList.onmousedown = [
                {
                    'specialKeys':[],
                    'function':function(event){
                        //save the old listener functions of the canvas
                            canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
                            canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
                            canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;
            
                        //save the viewport position and click position
                            canvas.system.mouse.tmp.oldPosition = canvas.system.core.viewport.position;
                            canvas.system.mouse.tmp.clickPosition = {x:event.x, y:event.y};
            
                        //replace the canvas's listeners 
                            canvas.onmousemove = function(event){
                                //update the viewport position
                                    canvas.system.core.viewport.position = {
                                        x: canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.system.core.viewport.scale),
                                        y: canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.system.core.viewport.scale),
                                    };
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
                    'function':function(event){
                        var zoomLimits = {'max':10, 'min':0.1};
            
                        //get the viewport position and zoom
                            var position = canvas.system.core.viewport.position;
                            var zoom = canvas.system.core.viewport.scale;
            
                        //perform zoom and associated pan
                            //discover point under mouse
                                var originalPoint = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                            //perform actual scaling
                                zoom -= zoom*(event.deltaY/100);
                                if( zoom > zoomLimits.max ){zoom = zoomLimits.max;}
                                if( zoom < zoomLimits.min ){zoom = zoomLimits.min;}
                                canvas.system.core.viewport.scale = zoom;
                            //discover point under mouse
                                var newPoint = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                            //pan so we're back at the old point (accounting for angle)
                                var pan = canvas.system.utility.cartesianAngleAdjust(
                                    (newPoint.x - originalPoint.x),
                                    (newPoint.y - originalPoint.y),
                                    canvas.system.core.viewport.angle
                                );
                                canvas.system.core.viewport.position.x += pan.x;
                                canvas.system.core.viewport.position.y += pan.y;
            
                        //request that the function list stop here
                            return true;
                    }
                }
            ];
        };
        
        
        
        
        canvas.system.core.render();
        canvas.system.core.animate();
        
        // canvas.system.core.element.add( {type:'rect', data:{x:150, y:50, width:50, height:50, fillStyle:'rgba(0,255,0,1)'}} );
        
        var g = canvas.system.core.element.add( {type:'group', data:{x:0, y:0, angle:-0.2}, children:[]} );
            canvas.system.core.element.add( {type:'dot', data:{x:0,y:0}}, g );
            canvas.system.core.element.add( {type:'rect', data:{x:0, y:0, width:10, height:10}}, g );
            canvas.system.core.element.add( {type:'rect', data:{x:20, y:0, width:10, height:10}}, g );
            // canvas.system.core.element.add( {type:'poly', data:{points: [{x:0,y:20},{x:20,y:20},{x:20,y:0}] }}, g );
            // canvas.system.core.element.add( {type:'image', data:{x:0, y:30, width:20, height:20, angle:0.3, url:'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg'}}, g );
            canvas.system.core.element.add( {type:'dot', data:{x:40,y:40}}, g );
        
        // canvas.system.core.element.add( {type:'rect', data:{x:58, y:60, width:50, height:50, fillStyle:'rgba(255,0,0,1)'}} );
        
        var g = canvas.system.core.element.add( {type:'group', data:{x:58, y:60, angle:-0.5}, children:[]} );
            canvas.system.core.element.add( {type:'dot', data:{x:0,y:0}}, g );
            canvas.system.core.element.add( {type:'rect', data:{x:0, y:0, width:10, height:10}}, g );
            var g = canvas.system.core.element.add( {type:'group', data:{x:10, y:10, angle:-0.5}, children:[]}, g );
                canvas.system.core.element.add( {type:'dot', data:{x:0,y:0}}, g );
                canvas.system.core.element.add( {type:'rect', data:{x:0, y:0, width:10, height:10}}, g );
                canvas.system.core.element.add( {type:'rect', data:{x:10, y:10, width:10, height:10}}, g );
        //         canvas.system.core.element.add( {type:'poly', data:{points: [{x:0,y:20},{x:20,y:20},{x:20,y:0}] }}, g );
        
        // canvas.system.core.element.add( {type:'image', data:{x:100, y:30, width:200, height:200, angle:0.3, url:'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg'}} );
        
        
        
        
        
        canvas.system.core.render(true);
        
        
        
        
        
        
        //lots of rects test
        // canvas.system.core.element.add( {type:'rect', data:{x:10, y:10, width:10, height:10, angle:-0.0, fillStyle:'rgba(0,255,0,1)'}} );
        // canvas.system.core.element.add( {type:'rect', data:{x:25, y:10, width:10, height:10, angle:-0.1, fillStyle:'rgba(0,255,0,1)'}} );
        // canvas.system.core.element.add( {type:'rect', data:{x:40, y:10, width:10, height:10, angle:-0.2, fillStyle:'rgba(0,255,0,1)'}} );
        // canvas.system.core.element.add( {type:'rect', data:{x:55, y:10, width:10, height:10, angle:-0.3, fillStyle:'rgba(0,255,0,1)'}} );
        // for(var a = 0; a < 1000; a++){
        //     canvas.system.core.element.add( {type:'rect', data:{x:10, y:10, width:10, height:10, angle:-0.0, fillStyle:'rgba(0,255,0,1)'}} );
        //     console.log(a);
        // }
        
        
        // //lots of polys test
        // for(var a = 0; a < 1000; a++){
        //     canvas.system.core.element.add( {type:'poly', data:{points: [{x:10,y:10},{x:20,y:10},{x:20,y:20},{x:10,y:20}] }} );
        //     console.log(a);
        // }
    }
}
