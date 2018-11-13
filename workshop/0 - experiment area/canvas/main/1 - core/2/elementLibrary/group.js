this.group = {

    create:function(){
        var obj = new function(){
            this.type = 'group';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;

            this.x = 0;
            this.y = 0;
            this.angle = 0;
            this.children = [];
        };

        return obj;
    },

    computeExtremities:function(element,offset){
        var original = offset == undefined;

        //if an offset has not been provided; compute points and bounding box for provided element, and
        // update the bounding boxes for all parents
            if(original){
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

        //create points and bounding box for this element
            element.points = [{x:element.x+offset.x, y:element.y+offset.y}];
            element.boundingBox = canvas.library.math.boundingBoxFromPoints( element.points );
            for(var a = 0; a < element.children.length; a++){
                var child = element.children[a];
                var temp = elementLibrary[child.type].computeExtremities(child,offset);
            }

        //if an offset has not been provided; update all parents' bounding boxes (if there are no
        // changes to a parent's bounding box; don't update and don't bother checking their parent
        // (or higher))
            if(original){
                var temp = element;
                while((temp=temp.parent) != undefined){
                    //discover if this new object would effect the bounding box of it's parent
                        if( 
                            temp.boundingBox.topLeft.x > element.boundingBox.topLeft.x ||
                            temp.boundingBox.topLeft.y > element.boundingBox.topLeft.y ||
                            temp.boundingBox.bottomRight.x < element.boundingBox.bottomRight.x ||
                            temp.boundingBox.bottomRight.y < element.boundingBox.bottomRight.y 
                        ){
                            //it does effect, thus combine the current bounding box with this element's bounding 
                            //box to determine the new bounding box for the parent
                                temp.boundingBox = canvas.library.math.boundingBoxFromPoints([
                                    temp.boundingBox.topLeft, temp.boundingBox.bottomRight,
                                    element.boundingBox.topLeft, element.boundingBox.bottomRight 
                                ]);
                        }else{
                            //it doesn't effect it, so don't bother going any higher
                                break;
                        }
                }   
            }
    },

    render:function(context,element,offset={x:0,y:0,a:0},static=false){

        for(var a = 0; a < element.children.length; a++){
            var item = element.children[a];
            var point = canvas.library.math.cartesianAngleAdjust(item.x,item.y,element.angle);

            elementLibrary[item.type].render(
                context,
                item,
                {
                    x: offset.x + element.x + ( point.x-item.x ),
                    y: offset.y + element.y + ( point.y-item.y ),
                    a: offset.a + element.angle,
                },
                (static||item.static)
            );
        }

    },

};