__globals.objects.make_audioScope = function(x,y){
    //set numbers
        var type = 'audioScope';
        var attributes = {
            framerateLimits: {min:1, max:30}
        };
        var shape = {
            base: [{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
            connector: { width: 20, height: 20 },
            graph: {x:5, y:5, width:150, height:100},
            holdKey: {x: 160, y: 5, width: 30, height: 20},
            dial: {x: 155, y: 30},
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:5px; font-family:Courier New; pointer-events: none;',
            button: {
                up: 'fill:rgba(175,175,175,1)',
                hover: 'fill:rgba(220,220,220,1)',
                down: 'fill:rgba(150,150,150,1)'
            },
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(250,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            }
        };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);
        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //waveport
        var graph = parts.display.grapher_audioScope(null, shape.graph.x, shape.graph.y, shape.graph.width, shape.graph.height);
            _mainObject.append(graph);
            graph.start();

        //hold key
        var holdKey = parts.control.key_rect(null, shape.holdKey.x, shape.holdKey.y, shape.holdKey.width, shape.holdKey.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(holdKey);
            holdKey.onkeydown = function(){graph.stop();};
            holdKey.onkeyup =   function(){graph.start();};

        //framerate dial
            _mainObject.append(parts.display.label(null, shape.dial.x+6.5,  shape.dial.y+40, 'framerate', style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+6,    shape.dial.y+34, '1',        style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '15',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '30',       style.text));
            var dial_framerate = parts.control.dial_continuous(
                'dial_framerate', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_framerate);
            dial_framerate.onchange = function(a){
                graph.refreshRate(
                    attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a)
                );
            };
            dial_framerate.set(1);

    //connection nodes
        _mainObject.io = {};
        _mainObject.io.audioIn = parts.dynamic.connectionNode_audio('_mainObject.io.audioIn', 0, shape.base[2].x-shape.connector.width*0.5, shape.connector.height*0.5, shape.connector.width, shape.connector.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.audioIn);
            _mainObject.io.audioIn.out().connect(graph.getNode());
            
    return _mainObject;
}