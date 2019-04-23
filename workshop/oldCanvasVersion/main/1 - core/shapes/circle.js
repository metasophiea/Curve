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
    };

    
    this.parameter = {};
    this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities();} }(this);
    this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities();} }(this);
    this.parameter.r = function(shape){ return function(a){if(a==undefined){return shape.r;} shape.r = a; shape.computeExtremities();} }(this);





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
                origin:{},
            };

        //calculate origin
            point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
            this.extremities.origin = {
                x: this.x + offset.x,
                y: this.y + offset.y,
            };

        //calculate points
            this.extremities.points = workspace.library.math.pointsOfCircle(this.x, this.y, this.r, 10);
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
        var circleCentre = {
            x: shape.x + shape.extremities.origin.x,
            y: shape.y + shape.extremities.origin.y,
        };

        return workspace.library.math.distanceBetweenTwoPoints( {x:x,y:y},circleCentre ) <= shape.r;
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
    this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
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
                radius:this.r,
                lineWidth: this.style.lineWidth,
            };
        
        //adapt values
            if(!static){
                shapeValue.location = adapter.workspacePoint2windowPoint(shapeValue.location.x,shapeValue.location.y);
                shapeValue.radius = adapter.length(shapeValue.radius);
                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
            }

        //clipping
            if(isClipper){
                var region = new Path2D();
                region.arc(shapeValue.location.x,shapeValue.location.y, shapeValue.radius, 0, 2 * Math.PI, false);
                context.clip(region);
                return;
            }
            
        //paint this shape as requested
            context.fillStyle = this.style.fill;
            context.strokeStyle = this.style.stroke;
            context.lineWidth = shapeValue.lineWidth;

        //actual render
            context.beginPath();
            context.arc(shapeValue.location.x,shapeValue.location.y, shapeValue.radius, 0, 2 * Math.PI, false);
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

                    var temp = adapter.workspacePoint2windowPoint(this.extremities.origin.x,this.extremities.origin.y);
                    core.render.drawDot( temp.x, temp.y );
            }
    };
};