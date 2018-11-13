this.rectangle = {

    create:function(){
        var obj = new function(){
            this.type = 'rectangle';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;

            this.x = 0;
            this.y = 0;
            this.anchor = {x:0,y:0};
            this.angle = 0;
            this.width = 0;
            this.height = 0;

            this.style = {
                fill:'rgba(255,100,255,1)',
                stroke:'rgba(0,0,0,0)',
                lineWidth:1,
            };
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
            element.points = canvas.library.math.pointsOfRect(element.x, element.y, element.width, element.height, element.angle, element.anchor);
            element.points = element.points.map(function(point){
                point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                point.x += offset.x;
                point.y += offset.y;
                return point;
            });

            
            element.boundingBox = canvas.library.math.boundingBoxFromPoints( element.points );

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
            }

        //actual render
            context.fillStyle = element.style.fill;
            context.strokeStyle = element.style.stroke;
            context.lineWidth = temp.lineWidth;
            context.save();
            context.rotate( position.angle );
            context.fillRect( position.location.x, position.location.y, temp.width, temp.height );
            context.strokeRect( position.location.x, position.location.y, temp.width, temp.height );
            context.restore();
    },
};