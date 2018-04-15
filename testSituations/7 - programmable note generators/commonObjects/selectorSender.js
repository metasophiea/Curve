__globals.objects.make_selectorSender = function(x,y){
    //set numbers
    var type = 'selectorSender';
    var attributes = {
        value: 0,
        valueLimit: 9
    };
    var shape = {
        base: [[10,0],[55,0],[65,32.5],[45,55],[20,55],[0,32.5]],
        littleConnector: { width: 20, height: 20 },
        connectionNodes:{
            inc: {x:38.75, y:41.25, width:20, height:20, angle:-Math.PI/4},
            dec: {x:12.5, y:27.5, width:20, height:20, angle:Math.PI/4},
            send:{x:22.5, y:40, width:20, height:20, angle:0},
            out:{x:22.5, y:-5, width:20, height:20, angle:0}
        },
        readouts: [
            {x: 26.25,   y: 7.5, width: 12.5, height: 25},
        ],
        incButton: {x: 40, y: 10, width: 10, height: 20},
        decButton: {x: 15, y: 10, width: 10, height: 20},
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        readout: 'fill:rgba(0,0,0,1); font-size:12px; font-family:Courier New;',
        readoutBacking: 'fill:rgba(0,0,0,1);',
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


        //buttons
            //inc
            var incButton = parts.control.button_rect('incButton', shape.incButton.x, shape.incButton.y, shape.incButton.width, shape.incButton.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(incButton);
                incButton.onclick = function(){ incValue(); }

            //dec
            var decButton = parts.control.button_rect('resetButton', shape.decButton.x, shape.decButton.y, shape.decButton.width, shape.decButton.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(decButton);
                decButton.onclick = function(){ decValue(); }

        //readout
            var segmentDisplays = [];
            for(var a = 0; a < shape.readouts.length; a++){
                var temp = parts.display.segmentDisplay(null, shape.readouts[a].x, shape.readouts[a].y, shape.readouts[a].width, shape.readouts[a].height);
                    _mainObject.append(temp);
                    segmentDisplays.push(temp);
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in_inc = parts.dynamic.connectionNode_data('_mainObject.io.in_inc', shape.connectionNodes.inc.x, shape.connectionNodes.inc.y, shape.connectionNodes.inc.width, shape.connectionNodes.inc.height, shape.connectionNodes.inc.angle);
            _mainObject.prepend(_mainObject.io.in_inc);
            _mainObject.io.in_inc.receive = function(address,data){if(address!='pulse'){return;}incValue();};
        _mainObject.io.in_dec = parts.dynamic.connectionNode_data('_mainObject.io.in_dec', shape.connectionNodes.dec.x, shape.connectionNodes.dec.y, shape.connectionNodes.dec.width, shape.connectionNodes.dec.height, shape.connectionNodes.dec.angle);
            _mainObject.prepend(_mainObject.io.in_dec);
            _mainObject.io.in_dec.receive = function(address,data){if(address!='pulse'){return;}decValue();};
        _mainObject.io.in_send = parts.dynamic.connectionNode_data('_mainObject.io.in_send', shape.connectionNodes.send.x, shape.connectionNodes.send.y, shape.connectionNodes.send.width, shape.connectionNodes.send.height, shape.connectionNodes.send.angle);
            _mainObject.prepend(_mainObject.io.in_send);    
            _mainObject.io.in_send.receive = function(address,data){if(address!='pulse'){return;}sendValue();};
        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', shape.connectionNodes.out.x, shape.connectionNodes.out.y, shape.connectionNodes.out.width, shape.connectionNodes.out.height, shape.connectionNodes.out.angle);
            _mainObject.prepend(_mainObject.io.out);     
            
    //internal workings
        function render(){
            segmentDisplays[0].enterCharacter(''+attributes.value);
        }
        function incValue(){
            attributes.value = attributes.value >= attributes.valueLimit ? 0 : attributes.value+1;
            render();
        }
        function decValue(){
            attributes.value = attributes.value <= 0 ? attributes.valueLimit : attributes.value-1;
            render();
        }
        function sendValue(){ _mainObject.io.out.send('discrete',attributes.value); }
            
    //setup
        render();

    return _mainObject;
};