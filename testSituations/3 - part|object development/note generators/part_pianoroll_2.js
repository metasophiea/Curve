parts.elements.control.pianoroll_2 = function(
    id='pianoroll_2',
    x, y, width, height, angle=0,
    xCount=80, yCount=10, xEmphasisCount=4, yEmphasisCount=12,
){
    var snapping = true;
    // var blockInfo = [];
    var style = {
        backing:'fill:rgba(50,50,50,1);',
        division:'stroke:rgba(120,120,120,1);stroke-width:0.5;pointer-events:none;',
        emphasisDivision:'stroke:rgba(220,220,220,1);stroke-width:0.5;pointer-events:none;',
        block:{
            body:'fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;',
            bodyGlow:'fill:rgba(150,100,100,0.9);stroke:rgba(200,100,100,1);stroke-width:0.5;',
            handle:'fill:rgba(255,0,0,0.75);cursor:col-resize;',
        },
    };

    //internal functions
        //block info control
            var blockInfo = new function(){
                var registry = [];
                this.info = function(id){return registry[id];};
                this.update = function(id,data){
                    if('line' in data){ registry[id].line = data.line; }
                    if('position' in data){ registry[id].position = data.position; }
                    if('length' in data){ registry[id].length = data.length < 0 ? 0 : data.length; }
                };
                this.add = function(line,position,length){
                    var newID = 0;
                    while(registry[newID] != undefined){newID++;}
                    registry[newID] = { line:line, position:position, length:length };
                    return newID;
                };
                this.remove = function(id){ delete registry[id]; };
            };

        function adaptPosition(pos){
            var out = { x:Math.floor(pos.x*xCount), y:Math.floor(pos.y*yCount) };

            if(out.x >= xCount){out.x = xCount-1;}
            if(out.y >= yCount){out.y = yCount-1;}

            out.x = out.x/xCount;
            out.y = out.y/yCount;

            if(!snapping){ out.x = pos.x; }

            if(out.x < 0){out.x = 0;} if(out.y < 0){out.y = 0;}
            if(out.x > 1){out.x = 1;} if(out.y > 1){out.y = 1;}

            return out;
        }
        function makeBlock(x,y,length=1/xCount){
            var id = blockInfo.add(y,x,length);

            var handleWidth = 2;
            var block = __globals.utility.experimental.elementMaker('g','noteblock_'+id,{x:x*width, y:y*height});

            //body
                var body = __globals.utility.experimental.elementMaker('rect','body',{
                    width:width*(blockInfo.info(id).length), height:height/yCount,
                    style:style.block.body
                });
                block.append(body);
                body.ondblclick = function(){
                    blockInfo.remove( parseInt(block.id.split('_')[1]) );
                    block.remove();
                };
                body.onmousedown = function(event){
                    var blockID = parseInt(block.id.split('_')[1]);
                    var info = blockInfo.info( blockID );

                    if(event.ctrlKey){
                        //cloning
                        var temp = makeBlock(info.position,info.line,info.length)
                        object.appendChild(temp);
                        temp.children.body.onmousedown({
                            ctrlKey:false,
                            offsetX:event.offsetX,
                            offsetY:event.offsetY,
                        });
                    }else{
                        //standard movement
                        var oldPosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
                        var oldBlockPosition = {x:info.position, y:info.line};
                        object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                        object.onmouseleave = object.onmouseup;
                        object.onmousemove = function(event){
                            var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,this,width,height);
                            var position = {
                                x:oldBlockPosition.x+livePosition.x-oldPosition.x,
                                y:oldBlockPosition.y+livePosition.y-oldPosition.y,
                            };

                            position = adaptPosition(position); 
                            if( (position.x+info.length) > 1 ){ position.x = 1-info.length; } //stop block from hanging off the right side ('adaptPosition' already handles the left)
                            
                            blockInfo.update(blockID,{
                                line:position.y,
                                position:position.x,
                            });

                            //recompute block position
                            __globals.utility.element.setTransform_XYonly(block,position.x*width,position.y*height);
                        };
                    }
                };

            //leftHandle
                var leftHandle = __globals.utility.experimental.elementMaker('rect','leftHandle',{
                    x:-handleWidth/2,
                    width:handleWidth, height:height/yCount,
                    style:style.block.handle
                });
                block.append(leftHandle);
                leftHandle.onmousedown = function(event){
                    var blockID = parseInt(block.id.split('_')[1]);
                    var info = blockInfo.info( blockID );

                    var oldPosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
                    var oldLength = info.length;
                    var oldBlockPosition = info.position;
                    object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseleave = object.onmouseup;
                    object.onmousemove = function(event){
                        var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,this,width,height);
                        var diff = livePosition.x-oldPosition.x;
                        var length = adaptPosition({x:(oldLength-diff),y:0}).x;
                        var position = oldBlockPosition + oldLength-length;

                        blockInfo.update(blockID,{
                            length:length,
                            position:position,
                        });

                        //recompute block position, rightHandle position and body length
                        __globals.utility.element.setTransform_XYonly(block, width*position, height*blockInfo.info(blockID).line);
                        __globals.utility.element.setTransform_XYonly(rightHandle,(width*length)-handleWidth/2,0);
                        body.width.baseVal.value = width*length;
                    };
                };

            //rightHandle
                // console.log( (width/xCount-handleWidth/2) );
                var rightHandle = __globals.utility.experimental.elementMaker('rect','rightHandle',{
                    x:width*(blockInfo.info(id).length)-handleWidth/2,
                    width:handleWidth, height:height/yCount,
                    style:style.block.handle
                });
                block.append(rightHandle);
                rightHandle.onmousedown = function(event){
                    var blockID = parseInt(block.id.split('_')[1]);
                    var info = blockInfo.info( blockID );

                    var oldPosition = __globals.utility.element.getPositionWithinFromMouse(event,object,width,height);
                    var oldLength = info.length;
                    object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                    object.onmouseleave = object.onmouseup;
                    object.onmousemove = function(event){
                        var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,this,width,height);
                        var length = adaptPosition({x:(oldLength+livePosition.x-oldPosition.x),y:0}).x;
                        blockInfo.update(blockID,{
                            length:length
                        });

                        //recompute rightHandle position and body length
                        __globals.utility.element.setTransform_XYonly(rightHandle,width*length-handleWidth/2,0);
                        body.width.baseVal.value = width*length;
                    };
                };

            return block;
        }

    //elements 
        var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});

        //workarea
        var workarea = __globals.utility.experimental.elementMaker('rect','workarea',{width:width,height:height, style:style.backing});
        object.appendChild(workarea);
        workarea.onmousedown = function(event){
            var position = adaptPosition(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
            var block = makeBlock(position.x,position.y)
            object.appendChild(block);
            block.children.rightHandle.onmousedown(event);
        };

        //division lines
            //vertical
            for(var a = 0; a < yCount; a++){
                var tempStyle = a%yEmphasisCount == 0 ? style.emphasisDivision : style.division;
                object.appendChild(__globals.utility.experimental.elementMaker('line','divisionline_vertical',{
                    x1:0,x2:width,
                    y1:a*(height/yCount),y2:a*(height/yCount), 
                    style:tempStyle,
                }));
            }
            //horizontal
            for(var a = 0; a < xCount; a++){
                var tempStyle = a%xEmphasisCount == 0 ? style.emphasisDivision : style.division;
                object.appendChild(__globals.utility.experimental.elementMaker('line','divisionline_horizontal',{
                    x1:a*(width/xCount), x2:a*(width/xCount),
                    y1:0, y2:height,
                    style:tempStyle}
                ));
            }

    return object;
};