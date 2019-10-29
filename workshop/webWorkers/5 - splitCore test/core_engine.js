var workspace = {library:{math:{}}};
workspace.library.math.cartesianAngleAdjust = function(x,y,angle){
    function cartesian2polar(x,y){
        var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
    
        if(x === 0){
            if(y === 0){ang = 0;}
            else if(y > 0){ang = 0.5*Math.PI;}
            else{ang = 1.5*Math.PI;}
        }
        else if(y === 0){
            if(x >= 0){ang = 0;}else{ang = Math.PI;}
        }
        else if(x >= 0){ ang = Math.atan(y/x); }
        else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
    
        return {'dis':dis,'ang':ang};
    };
    function polar2cartesian(angle,distance){
        return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
    };

    if(angle == 0 || angle%(Math.PI*2) == 0){ return {x:x,y:y}; }
    var polar = cartesian2polar( x, y );
    polar.ang += angle;
    return polar2cartesian( polar.ang, polar.dis );
};
workspace.library.math.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
var GSLS_utilityFunctions = `
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

        vec2 polar = cartesian2polar( xy );
        polar[0] += angle;
        return polar2cartesian( polar );
    }
`;
workspace.library.math.boundingBoxFromPoints = function(points){
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
workspace.library.math.detectOverlap = new function(){
    this.boundingBoxes = function(a, b){
        return !(
            (a.bottomRight.y < b.topLeft.y) ||
            (a.topLeft.y > b.bottomRight.y) ||
            (a.bottomRight.x < b.topLeft.x) ||
            (a.topLeft.x > b.bottomRight.x) );
    };
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
    this.lineSegments = function(segment1, segment2){
        var denominator = (segment2[1].y-segment2[0].y)*(segment1[1].x-segment1[0].x) - (segment2[1].x-segment2[0].x)*(segment1[1].y-segment1[0].y);
        if(denominator == 0){return null;}

        var u1 = ((segment2[1].x-segment2[0].x)*(segment1[0].y-segment2[0].y) - (segment2[1].y-segment2[0].y)*(segment1[0].x-segment2[0].x))/denominator;
        var u2 = ((segment1[1].x-segment1[0].x)*(segment1[0].y-segment2[0].y) - (segment1[1].y-segment1[0].y)*(segment1[0].x-segment2[0].x))/denominator;;
        return {
            'x':      (segment1[0].x + u1*(segment1[1].x-segment1[0].x)),
            'y':      (segment1[0].y + u1*(segment1[1].y-segment1[0].y)),
            'inSeg1': (u1 >= 0 && u1 <= 1),
            'inSeg2': (u2 >= 0 && u2 <= 1)
        };
    };
    this.overlappingPolygons = function(points_a,points_b){
        //a point from A is in B
            for(var a = 0; a < points_a.length; a++){
                if(this.pointWithinPoly(points_a[a],points_b)){ return true; }
            }

        //a point from B is in A
            for(var a = 0; a < points_b.length; a++){
                if(this.pointWithinPoly(points_b[a],points_a)){ return true; }
            }

        //side intersection
            var a_indexing = Array.apply(null, {length: points_a.length}).map(Number.call, Number).concat([0]);
            var b_indexing = Array.apply(null, {length: points_b.length}).map(Number.call, Number).concat([0]);

            for(var a = 0; a < a_indexing.length-1; a++){
                for(var b = 0; b < b_indexing.length-1; b++){
                    var tmp = this.lineSegments( 
                        [ points_a[a_indexing[a]], points_a[a_indexing[a+1]] ],
                        [ points_b[b_indexing[b]], points_b[b_indexing[b+1]] ]
                    );
                    if( tmp != null && tmp.inSeg1 && tmp.inSeg2 ){return true;}
                }
            }

        return false;
    };
    this.overlappingPolygonWithPolygons = function(poly,polys){ 
        for(var a = 0; a < polys.length; a++){
            if(this.boundingBoxes(poly.boundingBox, polys[a].boundingBox)){
                if(this.overlappingPolygons(poly.points, polys[a].points)){
                    return true;
                }
            }
        }
        return false;
    };
};
workspace.library.math.getIndexOfSequence = function(array,sequence){
    var index = 0;
    for(index = 0; index < array.length; index++){
        if( array[index] == sequence[0] ){

            var match = true;
            for(var a = 1; a < sequence.length; a++){
                if( array[index+a] != sequence[a] ){
                    match = false;
                    break;
                }
            }
            if(match){return index;}

        }
    }

    return undefined;
};
workspace.library.math.getDifferenceOfArrays = function(array_a,array_b){
    var out_a = []; var out_b = [];

    for(var a = 0; a < array_a.length; a++){
        if(array_b.indexOf(array_a[a]) == -1){ out_a.push(array_a[a]); }
    }

    for(var b = 0; b < array_b.length; b++){
        if(array_a.indexOf(array_b[b]) == -1){ out_b.push(array_b[b]); }
    }

    return {a:out_a,b:out_b};
};
workspace.library.math.getAngleOfTwoPoints = function(point_1,point_2){
    var xDelta = point_2.x - point_1.x;
    var yDelta = point_2.y - point_1.y;
    var angle = Math.atan( yDelta/xDelta );

    if(xDelta < 0){ angle = Math.PI + angle; }
    else if(yDelta < 0){ angle = Math.PI*2 + angle; }

    return angle;
};
workspace.library.math.pathToPolygonGenerator = function(path,thickness){
    var jointData = [];

    //parse path
        for(var a = 0; a < path.length/2; a++){
            jointData.push({ point:{ x:path[a*2], y:path[a*2 +1] } });
        }
    //calculate egment angles, joing angles, wing angles and wing widths; then generate wing points
        var outputPoints = [];
        for(var a = 0; a < jointData.length; a++){
            var item = jointData[a];

            //calculate segment angles
                if( a != jointData.length-1 ){
                    var tmp = workspace.library.math.getAngleOfTwoPoints( jointData[a].point, jointData[a+1].point );
                    if(jointData[a] != undefined){jointData[a].departAngle = tmp;}
                    if(jointData[a+1] != undefined){jointData[a+1].implimentAngle = tmp;}
                }

            //joing angles
                var joiningAngle = item.departAngle == undefined || item.implimentAngle == undefined ? Math.PI : item.departAngle - item.implimentAngle + Math.PI;

            //angle
                var segmentAngle = item.implimentAngle != undefined ? item.implimentAngle : item.departAngle;
                var wingAngle = segmentAngle + joiningAngle/2;

            //width
                var div = a == 0 || a == jointData.length-1 ? 1 : Math.sin(joiningAngle/2);
                var wingWidth = thickness / div;

            //wing points
                var plus =  workspace.library.math.cartesianAngleAdjust(0,  wingWidth, Math.PI/2 + wingAngle);
                var minus = workspace.library.math.cartesianAngleAdjust(0, -wingWidth, Math.PI/2 + wingAngle);
                outputPoints.push( plus.x+ item.point.x, plus.y+ item.point.y );
                outputPoints.push( minus.x+item.point.x, minus.y+item.point.y );
        }

    return outputPoints;
};






var core = new function(){
    var canvas = new OffscreenCanvas(800, 600);
    this.canvas = canvas;
    var core = this;

    this.shape = new function(){
        this.library = new function(){};

        this.create = function(type){ 
            try{ return new this.library[type](); }
            catch(e){
                console.warn('the shape type: "'+type+'" could not be found');
                console.error(e);
            }
        };
    };
    this.arrangement = new function(){
        var design;

        this.createElement = function(type){ return new shape[type]; };

        this.new = function(){ design = core.shape.create('group'); };
        this.get = function(){ return design; };
        this.set = function(arrangement){ design = arrangement; };
        this.prepend = function(element){ design.prepend(element); };
        this.append = function(element){ design.append(element); };
        this.remove = function(element){ design.remove(element); };
        this.clear = function(){ design.clear(); };

        this.getElementsUnderPoint = function(x,y){ return design.getElementsUnderPoint(x,y); };
        this.getElementsUnderArea = function(points){ return design.getElementsUnderArea(points); };
    };
    this.render = new function(){
        var pageData = {
            defaultSize:{width:640, height:480},
            windowWidth:0, windowHeight:0,
            selectedWidth:0, selectedHeight:0,
            width:0, height:0,
        };
        var context = canvas.getContext("webgl", {alpha:false, preserveDrawingBuffer:true, stencil:true });
        var animationRequestId = undefined;
        var clearColour = {r:1,g:1,b:1,a:1};

        //webGL setup
            context.enable(context.BLEND);
            context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

        //webGL program production
            var storedPrograms = {};
            this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource){
                function compileProgram(vertexShaderSource, fragmentShaderSource){
                    function createShader(type, source){
                        var shader = context.createShader(type);
                        context.shaderSource(shader, source);
                        context.compileShader(shader);
                        var success = context.getShaderParameter(shader, context.COMPILE_STATUS);
                        if(success){ return shader; }
                
                        console.error('major error in core\'s "'+ type +'" shader creation');
                        console.error(context.getShaderInfoLog(shader));
                        context.deleteShader(shader);
                    }
        
                    var program = context.createProgram();
                    context.attachShader(program, createShader(context.VERTEX_SHADER,vertexShaderSource) );
                    context.attachShader(program, createShader(context.FRAGMENT_SHADER,fragmentShaderSource) );
                    context.linkProgram(program);
                    var success = context.getProgramParameter(program, context.LINK_STATUS);
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
            }
        
        //canvas and webGL context adjustment
            this.clearColour = function(colour){
                if(colour == undefined){ return clearColour; }
                clearColour = colour;
                context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
            };
            this.refreshCoordinates = function(){
                var w = context.canvas.width;
                var h = context.canvas.height;
                var m = 1;//window.devicePixelRatio;

                var x, y, width, height = 0;
                if(m == 1){
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

                context.viewport( x, y, width, height );
            };
            this.refresh = function(){
                this.clearColour(clearColour);
                this.refreshCoordinates();
            };this.refresh();

        //actual render
            function renderFrame(){
                context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
                core.arrangement.get().render(context);
                var image = canvas.transferToImageBitmap();
                postMessage(image,[image]);
            }
            function animate(timestamp){
                animationRequestId = requestAnimationFrame(animate);
        
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

        //misc
            this.getCanvasDimensions = function(){ return {width:pageData.width, height:pageData.height}; };
            this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
                var dot = core.shape.create('circle');
                dot.x(x); dot.y(y);
                dot.colour = colour;
                dot.radius(r);
                dot.dotFrame = false;
                dot.render(context);
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
    
                this.rate = workspace.library.math.averageArray( this.frameTimeArray );
    
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
core.viewport = new function(){
    var state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
    };
    var viewbox = {
        canvas:{
            points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
            boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
        },
        camera:{
            points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
            boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
        },
    };

    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                var position = core.viewport.position();
                var scale = core.viewport.scale() / window.devicePixelRatio;
                var angle = core.viewport.angle();
        
                x = (x/scale) - position.x;
                y = (y/scale) - position.y;
        
                return workspace.library.math.cartesianAngleAdjust(x,y,-angle);
            };
            this.workspacePoint2windowPoint = function(x,y){
                var position = core.viewport.position();
                var scale = core.viewport.scale();
                var angle = core.viewport.angle();
    
                var point = workspace.library.math.cartesianAngleAdjust(x,y,angle);
    
                return {
                    x: (point.x+position.x) * scale,
                    y: (point.y+position.y) * scale
                };
            };
        };

    //camera position
        this.position = function(x,y){
            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
            state.position.x = x;
            state.position.y = y;

            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.x(state.position.x); item.y(state.position.y); }
            });

            calculateViewportExtremities();
        };
        this.scale = function(s){
            if(s == undefined){return state.scale;}
            state.scale = s <= 0 ? 1 : s;
            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.scale(state.scale); }
            });
            calculateViewportExtremities();
        };
        this.angle = function(a){
            if(a == undefined){return state.angle;}
            state.angle = a;
            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.angle(state.angle); }
            });
            calculateViewportExtremities();
        };

    //mouse interaction
        this.getElementUnderCanvasPoint = function(x,y){
            var xy = this.adapter.windowPoint2workspacePoint(x,y);
            return core.arrangement.getElementUnderPoint(xy.x,xy.y);
        };
        this.getElementsUnderCanvasArea = function(points){
            return core.arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2workspacePoint(a.x,a.y)));
        };

    //misc
        function calculateViewportExtremities(){
            var canvasDimensions = core.render.getCanvasDimensions();

            //canvas
                //for each corner of the viewport; find out where they lie on the workspace
                    viewbox.canvas.points.tl = {x:0, y:0};
                    viewbox.canvas.points.tr = {x:canvasDimensions.width, y:0};
                    viewbox.canvas.points.bl = {x:0, y:canvasDimensions.height};
                    viewbox.canvas.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
                //calculate a bounding box for the viewport from these points
                    viewbox.canvas.boundingBox = workspace.library.math.boundingBoxFromPoints([viewbox.canvas.points.tl, viewbox.canvas.points.tr, viewbox.canvas.points.br, viewbox.canvas.points.bl]);

            //camera
                //for each corner of the viewport; find out where they lie on the workspace
                viewbox.camera.points.tl = core.viewport.adapter.windowPoint2workspacePoint(0,0);
                viewbox.camera.points.tr = core.viewport.adapter.windowPoint2workspacePoint(canvasDimensions.width,0);
                viewbox.camera.points.bl = core.viewport.adapter.windowPoint2workspacePoint(0,canvasDimensions.height);
                viewbox.camera.points.br = core.viewport.adapter.windowPoint2workspacePoint(canvasDimensions.width,canvasDimensions.height);
        
            //calculate a bounding box for the viewport from these points
                viewbox.camera.boundingBox = workspace.library.math.boundingBoxFromPoints([viewbox.camera.points.tl, viewbox.camera.points.tr, viewbox.camera.points.br, viewbox.camera.points.bl]);
        }
        this.calculateViewportExtremities = calculateViewportExtremities;
        this.refresh = function(){
            this.calculateViewportExtremities();
        };
        this.getCanvasBoundingBox = function(){ return viewbox.canvas.boundingBox; };
        // this.getCameraBoundingBox = function(){ return viewbox.camera.boundingBox; };
};





core.shape.library.group = function(){
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
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '/') + this.name; };

    //group functions
        function getChildByName(name){ return children.find(a => a.name == name); }
        function checkForName(name){ return getChildByName(name) != undefined; }
        function isValidShape(shape){
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

                if(item.ignored){return;}

                if( workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, item.extremities.boundingBox ) ){
                    if( item.getType() == 'group' ){
                        returnList = returnList.concat( item.getElementsUnderPoint(x,y) );
                    }else{
                        if( workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, item.extremities.points ) ){
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

                if( workspace.library.math.detectOverlap.boundingBoxes( workspace.library.math.boundingBoxFromPoints(points), item.extremities.boundingBox ) ){
                    if( item.getType() == 'group' ){
                        returnList = returnList.concat( item.getElementUnderArea(points) );
                    }else{
                        if( workspace.library.math.detectOverlap.overlappingPolygons(points, item.extremities.points) ){
                            returnList = returnList.concat( item );
                        }
                    }
                }
            });

            return returnList;
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
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);
            //inform parent of change
                if(self.parent){self.parent.computeExtremities();}
        }
        function augmentExtremities_removeChild(departingShape){
            //if we're in clipping mode, no removal of a shape can effect the extremities 
                if(clipping.active && clipping.stencil != undefined){return;}
            //get offset from parent
                var offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
            //combine offset with group's position, angle and scale to produce new offset for chilren
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };
            //run computeExtremities on departing child
                departingShape.computeExtremities(false,newOffset);
            //remove matching points from points list
                var index = workspace.library.math.getIndexOfSequence(self.extremities.points,departingShape.extremities.points);
                if(index == undefined){console.error("group shape: departing shape points not found");}
                self.extremities.points.splice(index, index+departingShape.extremities.points.length);
            //recalculate bounding box
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);
            //inform parent of change
                if(self.parent){self.parent.computeExtremities();}
        }
        function computeExtremities(informParent=true,offset){
            //get offset from parent
                if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }

            //combine offset with group's position, angle and scale to produce new offset for chilren
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);

            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        this.computeExtremities = computeExtremities;
        this.getOffset = function(){
            if(this.parent){
                var offset = this.parent.getOffset();

                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };

                return adjust;
            }else{
                return {x:x ,y:y ,scale:scale ,angle:angle};
            }
        };

    //lead render
        function shouldRender(){
            return workspace.library.math.detectOverlap.boundingBoxes( core.viewport.getCanvasBoundingBox(), self.extremities.boundingBox );
        }
        function drawDotFrame(){
            // self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y,2,{r:0,g:0,b:1,a:1}) );

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //if this shape shouldn't be rendered, just bail on the whole thing
                if(!shouldRender()){return;}

            //combine offset with group's position, angle and scale to produce new offset for chilren
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
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
                children.forEach(a => a.render(context,newOffset));

            //disactivate clipping
                if(clipping.active){ context.disable(context.STENCIL_TEST); }

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        }
};
core.shape.library.rectangle = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'rectangle'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{}, isChanged:true };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};

        //attributes pertinent to extremity calculation
            var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); };
            var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); };
            var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); };
            var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); };
            var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); };
            var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); };
            var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); };

    //addressing
        this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };

    //webGL rendering functions
        var points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        var vertexShaderSource = `
            //constants
                attribute vec2 point;

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
                //(including scale adjust)
                    vec2 P = point * dimensions * adjust.scale;
                    P = vec2( P.x - dimensions.x*anchor.x, P.y - dimensions.y*anchor.y );
                    P = vec2( 
                        P.x*cos(adjust.angle) + P.y*sin(adjust.angle), 
                        P.y*cos(adjust.angle) - P.x*sin(adjust.angle)
                    );
                    P += adjust.xy;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        var fragmentShaderSource = `  
            precision mediump float;
            uniform vec4 colour;
                                                                        
            void main(){
                gl_FragColor = colour;
            }
        `;
        var pointBuffer;
        var pointAttributeLocation;
        var uniformLocations;
        function updateGLAttributes(context,adjust){
            //buffers
                //points
                    if(pointBuffer == undefined){
                        pointAttributeLocation = context.getAttribLocation(program, "point");
                        pointBuffer = context.createBuffer();
                        context.enableVertexAttribArray(pointAttributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                        context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                        context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
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
        var program;
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            //get offset from parent
                if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }

            //calculate points based on the offset
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };

                self.extremities.points = [];
                for(var a = 0; a < points.length; a+=2){
                    var P = {
                        x: adjusted.scale * width * (points[a] - anchor.x), 
                        y: adjusted.scale * height * (points[a+1] - anchor.y), 
                    };

                    self.extremities.points.push({ 
                        x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                        y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints(self.extremities.points);
            
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
        this.computeExtremities = function(informParent,offset){
            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }

            if(
                this.extremities.isChanged ||
                oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
            ){
                computeExtremities(informParent,offset);
                this.extremities.isChanged = false;
                oldOffset.x = offset.x;
                oldOffset.y = offset.y;
                oldOffset.scale = offset.scale;
                oldOffset.angle = offset.angle;
            }
        };

    //lead render
        function shouldRender(){
            return workspace.library.math.detectOverlap.boundingBoxes( core.viewport.getCanvasBoundingBox(), self.extremities.boundingBox );
        }
        function drawDotFrame(){
            self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            //if this shape shouldn't be rendered, just bail on the whole thing
                if(!shouldRender()){return;}

            //combine offset with shape's position, angle and scale to produce adjust value for render
                var point = workspace.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
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

core.arrangement.new();





var tmp = core.shape.create('rectangle');
tmp.name = 'rectangle_1';
tmp.x(0); tmp.y(0);
tmp.width(30);
tmp.height(30);
tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
core.arrangement.append(tmp);

core.render.frame();