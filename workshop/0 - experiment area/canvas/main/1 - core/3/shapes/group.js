this.group = function(){

    this.type = 'group';

    this.name = '';
    this.ignored = false;
    this.static = false;
    this.parent = undefined;
    this.extremities = {
        points:[],
        boundingBox:{},
    };

    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.children = [];

    function checkElementIsValid(element,destination){
        //check for name
            if(element.name == undefined || element.name == ''){return 'element has no name'}
    
        //check that the name is not already taken in this grouping
            for(var a = 0; a < destination.length; a++){
                if( destination[a].name == element.name ){ 
                    console.error('element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+parent.name+'"')+''); 
                    return;
                }
            }
        
        return;
    }
    this.prepend = function(element){
        //check that the element is valid
            var temp = checkElementIsValid(element, this.children);
            if(temp != undefined){console.error('element invalid:',temp); return;}

        //actually add the element
            this.children.unshift(element);

        //inform element of who it's parent is
            element.parent = this;

        //computation of extremities
            element.computeExtremities();
    };
    this.append = function(element){
        //check that the element is valid
            var temp = checkElementIsValid(element, this.children);
            if(temp != undefined){console.error('element invalid:',temp); return;}

        //actually add the element
            this.children.push(element);

        //inform element of who it's parent is
            element.parent = this;

        //computation of extremities
            element.computeExtremities();
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
    this.getChildByName = function(name){};

    this.computeExtremities = function(offset){
        //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
        //in which case; gather the offset of all parents. Otherwise just use what was provided
            offset = offset == undefined ? gatherParentOffset(this) : offset;

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
            // //development drawing
            //     for(var a = 0; a < this.extremities.points.length; a++){
            //         var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
            //         core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
            //     }

        //calculate boundingBox
            this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
            // //development drawing
            //     var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
            //     core.render.drawDot( temp.x, temp.y );
            //     var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
            //     core.render.drawDot( temp.x, temp.y );

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
    this.getElementUnderPoint = function(x,y){
        //go through the children in reverse order, discovering if the point is within their bounding box
        //if so; if it's a group, follow the 'getElementUnderPoint' function down
        //if it's not, return that shape

        for(var a = this.children.length-1; a >= 0; a--){
            if( this.children[a].isPointWithin(x,y) ){
                if( this.children[a].type == 'group' ){
                    var temp = this.children[a].getElementUnderPoint(x,y);
                    if(temp != undefined){return temp;}
                }else{
                    return this.children[a];
                }
            }
        }
    };

    function shouldRender(shape){ return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox); };
    this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
        //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method)
        //just bail on the whole thing
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

    };
};