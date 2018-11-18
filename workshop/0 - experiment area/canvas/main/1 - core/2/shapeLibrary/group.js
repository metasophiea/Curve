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
                    var temp = checkElementIsValid(element, this.children);
                    if(temp != undefined){console.error('element invalid:',temp); return;}

                //actually add the element
                    this.children.unshift(element);

                //inform element of who it's parent is
                    element.parent = this;

                //computation of this element's extremities
                    shapeLibrary[element.type].computeExtremities(element);
            };
            this.append = function(element){
                //check that the element is valid
                    var temp = checkElementIsValid(element, this.children);
                    if(temp != undefined){console.error('element invalid:',temp); return;}

                //actually add the element
                    this.children.push(element);

                //inform element of who it's parent is
                    element.parent = this;

                //computation of this element's extremities
                    shapeLibrary[element.type].computeExtremities(element);
            };
            this.remove = function(element){
                //check that an element was provoded
                    if(element == undefined){return;}

                //get index of element (if this element isn't in the group, just bail)
                    var index = this.children.indexOf(element);
                    if(index < 0){return;}

                //actual removal
                    this.children.splice(index, 1);
            };
            this.getChildByName = function(name){
                //just go through all children until you find one that has a matching name
                for(var a = 0; a < this.children.length; a++){
                    if( this.children[a].name == name ){return this.children[a];}
                }
            };
        };

        return obj;
        
    },

    computeExtremities:function(element,offset){
        //if the offset isn't set; that means that this is the element that got the request for extrimity recomputation
        //in which case; gather the offset of all parents. Otherwise just use what was provided
            offset = offset == undefined ? gatherParentOffset(element) : offset;

        //reset variables
            element.extremities = {
                points:[],
                boundingBox:{},
            };


        //calculate points
            //the points for a group, is just the four corners of the bounding box, calculated using
            //the bouding boxes of all the children
            //  -> this method needs to be trashed <-
            var temp = [];
            for(var a = 0; a < element.children.length; a++){
                temp.push(element.children[a].extremities.boundingBox.topLeft);
                temp.push(element.children[a].extremities.boundingBox.bottomRight);
            }
            temp = canvas.library.math.boundingBoxFromPoints( temp );
            element.extremities.points = [
                { x: temp.topLeft.x, y: temp.topLeft.y, },
                { x: temp.bottomRight.x, y: temp.topLeft.y, },
                { x: temp.bottomRight.x, y: temp.bottomRight.y, },
                { x: temp.topLeft.x, y: temp.bottomRight.y, },
            ];

            //development drawing
                for(var a = 0; a < element.extremities.points.length; a++){
                    var temp = adapter.workspacePoint2windowPoint(element.extremities.points[a].x,element.extremities.points[a].y);
                    core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                }

        //calculate boundingBox
            element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
            //development drawing
                var temp = adapter.workspacePoint2windowPoint(element.extremities.boundingBox.topLeft.x,element.extremities.boundingBox.topLeft.y);
                core.render.drawDot( temp.x, temp.y );
                var temp = adapter.workspacePoint2windowPoint(element.extremities.boundingBox.bottomRight.x,element.extremities.boundingBox.bottomRight.y);
                core.render.drawDot( temp.x, temp.y );

        //update the points and bounding box of the parent
            if(element.parent != undefined){
                shapeLibrary[element.parent.type].computeExtremities(element.parent);
            }
    },
    isPointWithinBoundingBox:function(x,y,element){},
    isPointWithinHitBox:function(x,y,element){},
    shouldRender:function(element){return true;},
    
    render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){
        //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method)
        //just bail on the whole thing
            if(!shapeLibrary[element.type].shouldRender()){return;}

        //adjust offset for parent's angle
            var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
            offset.x += point.x-element.x;
            offset.y += point.y-element.y;

        //cycle through all children
            for(var a = 0; a < element.children.length; a++){
                var item = element.children[a];

                shapeLibrary[item.type].render(
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