__globals.objects.make_accumulator = function(x,y){
    //set numbers
    var type = 'accumulator';
    var attributes = {
        levels: 8,
        currentLevel: 0
    };
    var shape = {
        base: [{x:0,y:0},{x:40,y:0},{x:65,y:25},{x:65,y:55},{x:0,y:55}],
        littleConnector: { width: 20, height: 20 },
        glowboxArea: {x:5, y:2.5, width:30, height:50, gappage:1},
        resetButton: {x: 45, y: 10, width: 20, height: 10},
        markings:{
            rect:[
                {x:(65*0.575), y:(20*1.5  + 20/2)-1, width:22.5, height:2, angle:0}
            ],
            path:[[{x:(65-10),y:(20*1.25 + 20/2)},{x:(65-2.5),y:(20*1.5 + 20/2)},{x:(65-10),y:(20*1.75 + 20/2)}]
            ]
        }
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        markings: 'fill:rgba(150,150,150,1)',
        button: {
            up: 'fill:rgba(175,175,175,1)',
            hover: 'fill:rgba(220,220,220,1)',
            down: 'fill:rgba(150,150,150,1)'
        },
    };


    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //markings
            for(var a = 0; a < shape.markings.rect.length; a++){
                _mainObject.append(parts.basic.rect(null, shape.markings.rect[a].x,shape.markings.rect[a].y,shape.markings.rect[a].width,shape.markings.rect[a].height,shape.markings.rect[a].angle, style.markings));
            }
            for(var a = 0; a < shape.markings.path.length; a++){
                _mainObject.append(parts.basic.path(null, shape.markings.path[a], 'L', style.markings));
            }

        //glowboxes
        var glowboxeBacking = parts.basic.rect(null, shape.glowboxArea.x, shape.glowboxArea.y, shape.glowboxArea.width, shape.glowboxArea.height, 0, 'fill:rgb(20,20,20)');
            _mainObject.append(glowboxeBacking);

        var glowboxes = [];
        var height = (2*shape.glowboxArea.height - 1)/(2*attributes.levels);
        for(var a = 0; a < attributes.levels; a++){
            var temp = parts.display.glowbox_rect(
                null, 
                shape.glowboxArea.x+shape.glowboxArea.gappage/2,
                shape.glowboxArea.y+a*height+(shape.glowboxArea.gappage/2),
                shape.glowboxArea.width-shape.glowboxArea.gappage,
                height-(shape.glowboxArea.gappage/2),
                0
            );
                _mainObject.append(temp);
                glowboxes.push(temp);
        }

        //reset
            var resetButton = parts.control.button_rect('resetButton', shape.resetButton.x, shape.resetButton.y, shape.resetButton.width, shape.resetButton.height, Math.PI/4, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(resetButton);
                resetButton.onclick = function(){ reset(); }


    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in = parts.dynamic.connectionNode_data('_mainObject.io.in', shape.littleConnector.width*0.5, -shape.littleConnector.height*0.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.in);
            _mainObject.io.in.receive = function(address,data){if(address!='pulse'){return;}accumulate();};
        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', shape.base[3].x-shape.littleConnector.width*0.5, shape.base[3].y-shape.littleConnector.height*1.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out);


    //internal workings
        function accumulate(){
            attributes.currentLevel++;
            if(attributes.currentLevel == attributes.levels){ reset(); }
            else{ glowboxes[attributes.levels-attributes.currentLevel-1].on(); }
        }
        function reset(){ 
            attributes.currentLevel = 0;
            _mainObject.io.out.send('pulse');
            for(var a = 0; a < attributes.levels; a++){
                glowboxes[a].off();
            }
            glowboxes[attributes.levels-1].on();
        }

    //setup
        reset();

    return _mainObject;
};