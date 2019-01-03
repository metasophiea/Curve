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

    
    this.parameter = {};
    this.parameter.points = function(shape){ return function(a){if(a==undefined){return shape.points;} shape.points = a; shape.computeExtremities();} }(this);




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
    this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
        //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
            if(!shouldRender(this)){return;}
        
        //collect and consolidate shape values into a neat package
            var shapeValue = {
                points: this.points.map( function(a){
                    a = workspace.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
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

        //clipping
            if(isClipper){
                var region = new Path2D();
                region.moveTo(shapeValue.points[0].x,shapeValue.points[0].y);
                for(var a = 1; a < shapeValue.points.length; a++){
                    region.lineTo(shapeValue.points[a].x,shapeValue.points[a].y);
                }
                context.clip(region);
                return;
            }

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