this.canvas = function(){

    this.type = 'canvas';

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

    var canvasObject = {
        isChanged:true, 
        element:document.createElement('canvas'),
        resolution:1,
    };
    canvasObject.context = canvasObject.element.getContext('2d',{ alpha: false });
    canvasObject.element.setAttribute('width',this.width*canvasObject.resolution);
    canvasObject.element.setAttribute('height',this.height*canvasObject.resolution);


    this.parameter = {};
    this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities();} }(this);
    this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities();} }(this);
    this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities();} }(this);
    this.parameter.anchor = function(shape){ return function(a){if(a==undefined){return shape.anchor;} shape.anchor = a; shape.computeExtremities();} }(this);
    this.parameter.width = function(shape){ return function(a){if(a==undefined){return shape.width;} shape.width = a; shape.computeExtremities(); canvasObject.element.setAttribute('width',shape.width*canvasObject.resolution); } }(this);
    this.parameter.height = function(shape){ return function(a){if(a==undefined){return shape.height;} shape.height = a; shape.computeExtremities(); canvasObject.element.setAttribute('height',shape.height*canvasObject.resolution); } }(this);




    this.resolution = function(a){
        if(a == undefined){return canvasObject.resolution;}
        canvasObject.resolution = a;
        canvasObject.element.setAttribute('width',this.width*canvasObject.resolution);
        canvasObject.element.setAttribute('height',this.height*canvasObject.resolution); 
        canvasObject.isChanged = true;
    };
    this._ = canvasObject.context;
    this.$ = function(a){return a*canvasObject.resolution;};




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
            this.extremities.points = workspace.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
            this.extremities.points = this.extremities.points.map(function(point){
                point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                point.x += offset.x;
                point.y += offset.y;
                return point;
            });

        //calculate boundingBox
            this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );

        //update the points and bounding box of the parent
            if(this.parent != undefined){
                this.parent.computeExtremities();
            }
    };
    function isPointWithinBoundingBox(x,y,shape){
        if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
        return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
    }
    function isPointWithinHitBox(x,y,shape){
        if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
        return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
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
            return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
    };



    
    this.render = function(context,offset={x:0,y:0,a:0},static=false){
        //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
            if(!shouldRender(this)){return;}

        //adjust offset for parent's angle
            var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
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
            };
        
        //adapt values
            if(!static){
                shapeValue.location = adapter.workspacePoint2windowPoint( (shapeValue.location.x - this.anchor.x*shapeValue.width), (shapeValue.location.y - this.anchor.y*shapeValue.height) );              
                shapeValue.width = adapter.length(shapeValue.width);
                shapeValue.height = adapter.length(shapeValue.height);
            }

        //post adaptation calculations
            shapeValue.location = workspace.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);

        //actual render
            context.save();
            context.rotate( shapeValue.angle );
            context.drawImage( canvasObject.element, shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
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