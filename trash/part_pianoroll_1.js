parts.elements.control.pianoroll_1 = function(
    id='pianoroll_1',
    x, y, width, height, angle=0,
    xCount=20, yCount=10, 
){
    var style = {
        backing:'fill:rgba(50,50,50,1);',
        divisions:'stroke:rgba(150,50,50,1);stroke-width:0.5;',
        block:'fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;',
    };

    //internal functions
    function addBlock(line,x){
        var temp = __globals.utility.experimental.elementMaker('rect',null,{
            x:x*width, y:(height/yCount)*line,
            width:0, height:height/yCount, 
            style:style.block,
        });
        object.appendChild(temp);

        var click_initialPosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
        var initialWidth = 0;

        object.onmouseup = function(){ object.onmousemove = null; object.onmouseup = null; };
        object.onmouseleave = object.onmouseup;
        object.onmousemove = function(event){
            var click_livePosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
            var Xdiff = width*(click_livePosition.x-click_initialPosition.x);
            temp.width.baseVal.value = initialWidth + Xdiff;
        };

        temp.ondblclick = function(){ this.remove(); };

        temp.onmousedown = function(event){
            var click_initialPosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
            var click_positionInBlock = __globals.utility.element.getPositionWithinFromMouse(event,this,temp.width.baseVal.value,height/yCount);

            if(click_positionInBlock.x < 0.1){
                var initialX = __globals.utility.element.getTransform(this).x;
                var initialWidth = temp.width.baseVal.value;

                object.onmouseup = function(){ object.onmousemove = null; object.onmouseup = null; };
                object.onmouseleave = object.onmouseup;
                object.onmousemove = function(event){
                    var click_livePosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
                    var Xdiff = width*(click_livePosition.x-click_initialPosition.x);
                    temp.width.baseVal.value = initialWidth - Xdiff;

                    __globals.utility.element.setTransform_XYonly(temp,initialX + Xdiff);
                };
            }
            else if(click_positionInBlock.x > 0.9){
                var initialWidth = temp.width.baseVal.value;

                object.onmouseup = function(){ object.onmousemove = null; object.onmouseup = null; };
                object.onmouseleave = object.onmouseup;
                object.onmousemove = function(event){
                    var click_livePosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
                    var Xdiff = width*(click_livePosition.x-click_initialPosition.x);
                    temp.width.baseVal.value = initialWidth + Xdiff;
                };
            }
            else{
                var block_initialPosition = __globals.utility.element.getTransform(this);

                object.onmouseup = function(){ object.onmousemove = null; object.onmouseup = null; };
                object.onmouseleave = object.onmouseup;
                object.onmousemove = function(event){
                    var click_livePosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
                    var Xdiff = width*(click_livePosition.x-click_initialPosition.x);
                    var newY = Math.floor(click_livePosition.y*yCount); if(newY>=yCount){newY=yCount-1;}
                    __globals.utility.element.setTransform_XYonly(temp,block_initialPosition.x + Xdiff, (height/yCount)*newY);
                };
            }
        };

    }


    // elements 
        var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});

        //workarea
        var workarea = __globals.utility.experimental.elementMaker('rect','workarea',{width:width,height:height, style:style.backing});
        object.appendChild(workarea);
        workarea.onmousedown = function(event){
            var position = __globals.utility.element.getPositionWithinFromMouse(event,this,width,height);
            var lineNumber = Math.floor(position.y*yCount); if(lineNumber>=yCount){lineNumber=yCount-1;}
            addBlock(lineNumber,position.x);
        };

        //division lines
        for(var a = 0; a < yCount; a++){
            object.appendChild(__globals.utility.experimental.elementMaker('line',null,{x1:0,x2:width,y1:a*(height/yCount),y2:a*(height/yCount), style:style.divisions}));
        }

        




    return object;
};