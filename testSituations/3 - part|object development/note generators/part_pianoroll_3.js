parts.elements.control.pianoroll_3 = function(
    id='pianoroll_3',
    x, y, width, height, angle=0,
    xCount=80, yCount=10, xEmphasisCount=4, yEmphasisCount=12,
){
    var state = {
        snapping:!true,
        noteRegistry: new parts.elements.control.pianoroll_3.noteRegistry(),
    };
    var style = {
        backing:'fill:rgba(50,50,50,1);',
        division:'stroke:rgba(120,120,120,1);stroke-width:0.5;pointer-events:none;',
        emphasisDivision:'stroke:rgba(220,220,220,1);stroke-width:0.5;pointer-events:none;',
        block:{
            body:'fill:rgba(150,100,100,0.75);stroke:rgba(200,100,100,1);stroke-width:0.5;',
            bodyGlow:'fill:rgba(150,100,100,0.9);stroke:rgba(200,100,100,1);stroke-width:0.5;',
            handle:'fill:rgba(255,0,0,0.75);cursor:col-resize;',
            handleWidth:2,
        },
    };

    //internal functions
        function getCoordinates(position){
            position.y = Math.floor(position.y*yCount);
            if(position.y >= yCount){position.y = yCount-1;}

            position.x = state.snapping ? Math.round(position.x*xCount) : position.x*xCount;
            if(position.x < 0){position.x =0;}

            return {line:position.y, position:position.x};
        }


    //elements 
        var object = __globals.utility.experimental.elementMaker('g',id,{x:x, y:y});

        //backing
        var backing = __globals.utility.experimental.elementMaker('rect','backing',{width:width,height:height, style:style.backing});
        object.appendChild(backing);
        backing.onmousedown = function(event){
            var positionData = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
            positionData.length = 0;

            var newBlock = parts.elements.control.pianoroll_3.noteBlock(
                {x:width/xCount,y:height/yCount},
                state.noteRegistry.add(positionData.line, positionData.position, positionData.length),
                positionData.line, positionData.position, positionData.length, style.block
            );
            newBlock.ondblclick = function(){
                state.noteRegistry.remove(parseInt(this.id));
                this.remove();
            };
            newBlock.callback.body = function(event){
                var initialPosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                var startingPosition = state.noteRegistry.info(parseInt(newBlock.id));
                object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                object.onmouseleave = object.onmouseup;
                object.onmousemove = function(event){
                    var livePosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
                    var newLocation = {
                        line: startingPosition.line + (livePosition.line-initialPosition.line),
                        position: startingPosition.position + (livePosition.position-initialPosition.position),
                    };
                    newBlock.location(newLocation.line, newLocation.position);
                    state.noteRegistry.update(parseInt(newBlock.id),{ line:newLocation.line, position:newLocation.position });
                };
            };
            newBlock.callback.rightHandle = function(event){
                var initialPosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                var startingPosition = state.noteRegistry.info(parseInt(newBlock.id));
                object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                object.onmouseleave = object.onmouseup;
                object.onmousemove = function(event){
                    var livePosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
                    var length = startingPosition.length + (livePosition.position-initialPosition.position);
                    if(length < 0){length = 0;}
                    newBlock.length(length);
                    state.noteRegistry.update(parseInt(newBlock.id),{ length:length });
                };
            };
            newBlock.callback.leftHandle = function(event){
                var initialPosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,object,width,height));
                var startingPosition = state.noteRegistry.info(parseInt(newBlock.id));
                object.onmouseup = function(){this.onmousemove = null; this.onmouseleave = null; this.onmouseup = null;};
                object.onmouseleave = object.onmouseup;
                object.onmousemove = function(event){
                    var livePosition = getCoordinates(__globals.utility.element.getPositionWithinFromMouse(event,this,width,height));
                    var length = startingPosition.length - (livePosition.position-initialPosition.position);
                    var newPosition = startingPosition.position + (livePosition.position-initialPosition.position);
                    if(length < 0){ newPosition += length; length = 0; }
                    newBlock.length(length);
                    newBlock.location(startingPosition.line, newPosition);
                    state.noteRegistry.update(parseInt(newBlock.id),{ position:newPosition, length:length });
                };
            };

            object.appendChild(newBlock);

            newBlock.callback.rightHandle(event);
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







parts.elements.control.pianoroll_3.noteRegistry = function(){
    var registry = [];
    this.info = function(id){
        return { line:registry[id].line, position:registry[id].position, length:registry[id].length };
    };
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








parts.elements.control.pianoroll_3.noteBlock = function(basicUnit,id,line,position,length=0,style){
    var obj = __globals.utility.experimental.elementMaker('g',id,{y:line*basicUnit.y, x:position*basicUnit.x});


    var body = __globals.utility.experimental.elementMaker('rect','body',{
        width:length*basicUnit.x, height:1*basicUnit.y,
        style:style.body
    });
    obj.append(body);

    var leftHandle = __globals.utility.experimental.elementMaker('rect','leftHandle',{
        x:-style.handleWidth/2,
        width:style.handleWidth, height:1*basicUnit.y,
        style:style.handle
    });
    obj.append(leftHandle);

    var rightHandle = __globals.utility.experimental.elementMaker('rect','rightHandle',{
        x:length*basicUnit.x-style.handleWidth/2,
        width:style.handleWidth, height:1*basicUnit.y,
        style:style.handle
    });
    obj.append(rightHandle);

    obj.location = function(line,position){
        __globals.utility.element.setTransform_XYonly(obj, position*basicUnit.x, line*basicUnit.y);
    };
    obj.length = function(length){
        if(length == undefined){return body.width.baseVal.value/basicUnit.x;}
        body.width.baseVal.value = length*basicUnit.x;
        __globals.utility.element.setTransform_XYonly(rightHandle, length*basicUnit.x-style.handleWidth/2, 0);
    };
    obj.callback = {
        body:function(){},
        leftHandle:function(){},
        rightHandle:function(){},
    };
    body.onmousedown = function(event){ if(obj.callback.body != undefined){ obj.callback.body(event); } };
    leftHandle.onmousedown = function(event){ if(obj.callback.leftHandle != undefined){ obj.callback.leftHandle(event); } };
    rightHandle.onmousedown = function(event){ if(obj.callback.rightHandle != undefined){ obj.callback.rightHandle(event); } };

    return obj;
};