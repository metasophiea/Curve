this.group = function(){

    this.type = 'group';

    this.name = '';
    this.ignored = false;
    this.static = false;
    this.clipActive = false;
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
    this.clippingStencil;


    this.parameter = {};
    this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities(undefined,true);} }(this);
    this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities(undefined,true);} }(this);
    this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities(undefined,true);} }(this);



    function checkElementIsValid(group,element){
        if(element == undefined){return group.getAddress()+' >> no element provided';}

        //check for name
            if(element.name == undefined || element.name == ''){return group.getAddress()+' >> element has no name'}
    
        //check that the name is not already taken in this grouping
            for(var a = 0; a < group.children.length; a++){
                if( group.children[a].name == element.name ){ 
                    return 'element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+group.name+'"'); 
                }
            }
    }

    this.getAddress = function(){
        var address = '';
        var tmp = this;
        do{
            address = tmp.name + '/' + address;
        }while((tmp = tmp.parent) != undefined)

        return '/'+address;
    };
    this.clip = function(bool){
        if(bool == undefined){return this.clipActive;}
        this.clipActive = (this.clippingStencil == undefined) ? false : bool;

        //computation of extremities
            this.computeExtremities();
    };
    this.stencil = function(shape){
        if(shape == undefined){return this.clippingStencil;}
        this.clippingStencil = shape;

        //computation of extremities
            this.computeExtremities();
    };
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
    this.contains = function(element){
        for(var a = 0; a < this.children.length; a++){
            if(this.children[a] == element){return true;}
        }

        return false;
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

    this.getOffset = function(){return gatherParentOffset(this);};
    this.computeExtremities = function(offset,deepCompute=false){
        //root calculation element
            var rootCalculationElement = offset == undefined;

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
                //calculate offset to be sent down to this group's children
                    var combinedOffset = { x: offset.x, y: offset.y, a: offset.a + this.angle };
                    var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                        combinedOffset.x += point.x;
                        combinedOffset.y += point.y;

                //request deep calculation from all children
                    for(var a = 0; a < this.children.length; a++){
                        this.children[a].computeExtremities(combinedOffset,true);
                    }
            }

        //reset variables
            this.extremities = {
                points:[],
                boundingBox:{},
            };

        //calculate points
            //assuming clipping is turned off
                if(!this.clipActive){
                    //the points for a group, is just the four corners of the bounding box, calculated using
                    //the bounding boxes of all the children
                    //  -> this method needs to be trashed <-
                        var temp = [];
                        for(var a = 0; a < this.children.length; a++){
                            temp.push(this.children[a].extremities.boundingBox.topLeft);
                            temp.push(this.children[a].extremities.boundingBox.bottomRight);
                        }
                        temp = workspace.library.math.boundingBoxFromPoints( temp );
                        this.extremities.points = [
                            { x: temp.topLeft.x,     y: temp.topLeft.y,     },
                            { x: temp.bottomRight.x, y: temp.topLeft.y,     },
                            { x: temp.bottomRight.x, y: temp.bottomRight.y, },
                            { x: temp.topLeft.x,     y: temp.bottomRight.y, },
                        ];
            //assuming clipping is turned on
                }else{
                    //the points for this group are the same as the stencil shape's
                        var combinedOffset = { x: offset.x, y: offset.y, a: offset.a + this.angle };
                        var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                            combinedOffset.x += point.x;
                            combinedOffset.y += point.y;
                        this.clippingStencil.computeExtremities(combinedOffset);
                        this.extremities.points = this.clippingStencil.extremities.points;
                }

        //calculate boundingBox
            this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );

        //update the points and bounding box of the parent
            if(this.parent != undefined && rootCalculationElement){
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
        if(this.clipActive){ return this.clippingStencil.isPointWithin(x,y); }

        if( isPointWithinBoundingBox(x,y,this) ){
            return isPointWithinHitBox(x,y,this);
        }
        return false;
    };
    this.getElementUnderPoint = function(x,y,static=false,getList=false){
        //go through the children in reverse order, discovering if
        //  the object is not ignored and,
        //  the point is within their bounding box
        //if so; if it's a group, follow the 'getElementUnderPoint' function down
        //if it's not, return that shape
        //otherwise, carry onto the next shape

        var returnList = [];

        for(var a = this.children.length-1; a >= 0; a--){
            //if child shape is static (or any of its parents), use adjusted x and y values for 'isPointWithin' judgement
                var point = (this.children[a].static || static) ? adapter.workspacePoint2windowPoint(x,y) : {x:x,y:y};

                if( !this.children[a].ignored && this.children[a].isPointWithin(point.x,point.y) ){
                    if( this.children[a].type == 'group' ){
                        var temp = this.children[a].getElementUnderPoint(x,y,(this.children[a].static || static),getList);
                        if(temp != undefined){
                            if(getList){ returnList = returnList.concat(temp); }
                            else{ return temp; }
                        }
                    }else{
                        if(getList){ returnList.push(this.children[a]); }
                        else{ return this.children[a]; }
                    }
                }
        }

        if(getList){return returnList;}
    };

    function shouldRender(shape){
        //if this shape is static, always render
            if(shape.static){return true;}

        //if any of this shape's children are static, render the group (and let the individuals decide to render themselves or not)
            for(var a = 0; a < shape.children.length; a++){ if(shape.children[a].static){return true;} }

        //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
            return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
    };
    this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
        //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
            if(!shouldRender(this)){return;}

        //adjust offset for parent's angle
            var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
            var packagedOffset = {
                a: offset.a + this.angle,
                x: offset.x + point.x,
                y: offset.y + point.y,
            };


        //draw clipping (if active)
            if(this.clipActive || isClipper){
                context.save();
                this.clippingStencil.render( context, Object.assign({},packagedOffset), (static||this.clippingStencil.static), (isClipper||this.clipActive) );
            }

        //cycle through all children, activating their render functions
            for(var a = 0; a < this.children.length; a++){
                var item = this.children[a];
                item.render( context, Object.assign({},packagedOffset), (static||item.static) );
            }

        //undo the clipping (only if there was clipping, ofcourse)
            if(this.clipActive){ context.restore(); }

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



































// this.group = function(){

//     this.type = 'group';

//     this.name = '';
//     this.ignored = false;
//     this.static = false;
//     this.parent = undefined;
//     this.dotFrame = false;
//     this.extremities = {
//         points:[],
//         boundingBox:{},
//     };

//     this.x = 0;
//     this.y = 0;
//     this.angle = 0;
//     this.children = [];


//     this.parameter = {};
//     this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities(undefined,true);} }(this);
//     this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities(undefined,true);} }(this);
//     this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities(undefined,true);} }(this);

    

//     this.getAddress = function(){
//         var address = '';
//         var tmp = this;
//         do{
//             address = tmp.name + '/' + address;
//         }while((tmp = tmp.parent) != undefined)

//         return '/'+address;
//     };
    
//     function checkElementIsValid(group,element){
//         if(element == undefined){return group.getAddress()+' >> no element provided';}

//         //check for name
//             if(element.name == undefined || element.name == ''){return group.getAddress()+' >> element has no name'}
    
//         //check that the name is not already taken in this grouping
//             for(var a = 0; a < group.children.length; a++){
//                 if( group.children[a].name == element.name ){ 
//                     return 'element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+group.name+'"'); 
//                 }
//             }
//     }
//     this.prepend = function(element){
//         //check that the element is valid
//             var temp = checkElementIsValid(this,element);
//             if(temp != undefined){console.error('element invalid:',temp); return;}

//         //actually add the element
//             this.children.unshift(element);

//         //inform element of who it's parent is
//             element.parent = this;

//         //computation of extremities
//             element.computeExtremities(undefined,true);
//     };
//     this.append = function(element){
//         //check that the element is valid
//             var temp = checkElementIsValid(this, element);
//             if(temp != undefined){console.error('element invalid:',temp); return;}

//         //actually add the element
//             this.children.push(element);

//         //inform element of who it's parent is
//             element.parent = this;

//         //computation of extremities
//             element.computeExtremities(undefined,true);
//     };
//     this.remove = function(element){
//         //check that an element was provided
//             if(element == undefined){return;}

//         //get index of element (if this element isn't in the group, just bail)
//             var index = this.children.indexOf(element);
//             if(index < 0){return;}

//         //actual removal
//             this.children.splice(index, 1);

//         //computation of extremities
//             this.computeExtremities();
//     };
//     this.clear = function(){
//         //empty out children
//             this.children = [];

//         //computation of extremities
//             this.computeExtremities();
//     };
//     this.getChildByName = function(name){
//         for(var a = 0; a < this.children.length; a++){
//             if( this.children[a].name == name ){ return this.children[a]; }
//         }
//     };
//     this.getElementsWithName = function(name){
//         var result = [];
//         for(var a = 0; a < this.children.length; a++){
//             if( this.children[a].name == name ){
//                 result.push(this.children[a]);
//             }
//             if( this.children[a].type == 'group' ){
//                 var list = this.children[a].getElementsWithName(name);
//                 for(var b = 0; b < list.length; b++){ result.push( list[b] ); } //because concat doesn't work
//             }
//         }
//         return result;
//     };

//     this.getOffset = function(){return gatherParentOffset(this);};
//     this.computeExtremities = function(offset,deepCompute=false){
//         //root calculation element
//             var rootCalculationElement = offset == undefined;

//         //discover if this shape should be static
//             var isStatic = this.static;
//             var tmp = this;
//             while((tmp = tmp.parent) != undefined && !isStatic){
//                 isStatic = isStatic || tmp.static;
//             }
//             this.static = isStatic;

//         //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
//         //in which case; gather the offset of all parents. Otherwise just use what was provided
//             offset = offset == undefined ? gatherParentOffset(this) : offset;

//         //if 'deepCompute' is set, recalculate the extremities for all children
//             if(deepCompute){
//                 //calculate offset to be sent down to this group's children
//                     var combinedOffset = { x: offset.x, y: offset.y, a: offset.a + this.angle };
//                     var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
//                         combinedOffset.x += point.x;
//                         combinedOffset.y += point.y;

//                 //request deep calculation from all children
//                     for(var a = 0; a < this.children.length; a++){
//                         this.children[a].computeExtremities(combinedOffset,true);
//                     }
//             }

//         //reset variables
//             this.extremities = {
//                 points:[],
//                 boundingBox:{},
//             };

//         //calculate points
//             //the points for a group, is just the four corners of the bounding box, calculated using
//             //the bounding boxes of all the children
//             //  -> this method needs to be trashed <-
//             var temp = [];
//             for(var a = 0; a < this.children.length; a++){
//                 temp.push(this.children[a].extremities.boundingBox.topLeft);
//                 temp.push(this.children[a].extremities.boundingBox.bottomRight);
//             }
//             temp = workspace.library.math.boundingBoxFromPoints( temp );
//             this.extremities.points = [
//                 { x: temp.topLeft.x,     y: temp.topLeft.y,     },
//                 { x: temp.bottomRight.x, y: temp.topLeft.y,     },
//                 { x: temp.bottomRight.x, y: temp.bottomRight.y, },
//                 { x: temp.topLeft.x,     y: temp.bottomRight.y, },
//             ];            

//         //calculate boundingBox
//             this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );

//         //update the points and bounding box of the parent
//             if(this.parent != undefined && rootCalculationElement){
//                 this.parent.computeExtremities();
//             }
//     };
//     function isPointWithinBoundingBox(x,y,shape){
//         if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
//         return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
//     }
//     function isPointWithinHitBox(x,y,shape){
//         if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
//         return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
//     }
//     this.isPointWithin = function(x,y){
//         if( isPointWithinBoundingBox(x,y,this) ){
//             return isPointWithinHitBox(x,y,this);
//         }
//         return false;
//     };
//     this.getElementUnderPoint = function(x,y,static=false,getList=false){
//         //go through the children in reverse order, discovering if
//         //  the object is not ignored and,
//         //  the point is within their bounding box
//         //if so; if it's a group, follow the 'getElementUnderPoint' function down
//         //if it's not, return that shape
//         //otherwise, carry onto the next shape

//         var returnList = [];

//         for(var a = this.children.length-1; a >= 0; a--){
//             //if child shape is static (or any of its parents), use adjusted x and y values for 'isPointWithin' judgement
//                 var point = (this.children[a].static || static) ? adapter.workspacePoint2windowPoint(x,y) : {x:x,y:y};

//                 if( !this.children[a].ignored && this.children[a].isPointWithin(point.x,point.y) ){
//                     if( this.children[a].type == 'group' ){
//                         var temp = this.children[a].getElementUnderPoint(x,y,(this.children[a].static || static),getList);
//                         if(temp != undefined){
//                             if(getList){ returnList = returnList.concat(temp); }
//                             else{ return temp; }
//                         }
//                     }else{
//                         if(getList){ returnList.push(this.children[a]); }
//                         else{ return this.children[a]; }
//                     }
//                 }
//         }

//         if(getList){return returnList;}
//     };

//     function shouldRender(shape){
//         //if this shape is static, always render
//             if(shape.static){return true;}

//         //if any of this shape's children are static, render the group (and let the individuals decide to render themselves or not)
//             for(var a = 0; a < shape.children.length; a++){ if(shape.children[a].static){return true;} }

//         //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
//             return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
//     };
//     this.render = function(context,offset={x:0,y:0,a:0},static=false){
//         //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
//             if(!shouldRender(this)){return;}

//         //adjust offset for parent's angle
//             var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
//             offset.x += point.x - this.x;
//             offset.y += point.y - this.y;

//         //cycle through all children, activating their render functions
//             for(var a = 0; a < this.children.length; a++){
//                 var item = this.children[a];

//                 item.render(
//                     context,
//                     {
//                         a: offset.a + this.angle,
//                         x: offset.x + this.x,
//                         y: offset.y + this.y,
//                         parentAngle: this.angle,
//                     },
//                     (static||item.static)
//                 );
//             }

//         //if dotFrame is set, draw in dots fot the points and bounding box extremities
//             if(this.dotFrame){
//                 //points
//                     for(var a = 0; a < this.extremities.points.length; a++){
//                         var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
//                         core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
//                     }
//                 //boudning box
//                     var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
//                     core.render.drawDot( temp.x, temp.y );
//                     var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
//                     core.render.drawDot( temp.x, temp.y );
//             }
//     };
// };