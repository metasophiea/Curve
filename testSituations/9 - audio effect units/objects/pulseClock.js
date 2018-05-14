__globals.objects.make_pulseClock = function(x,y){
    //set numbers
        var type = 'pulseClock';
        var attributes = {
            tempoLimits: {low:60, high:240},
            interval: null
        };
        var shape = {
            base: [{x:0,y:0},{x:90,y:0},{x:90,y:40},{x:0,y:40}],
            connector: { width: 20, height: 20 },
            readoutBacking :{x:45, y: 7.5, width: 12.5*3, height: 25},
            readouts: [
                {x: 45,   y: 7.5, width: 12.5, height: 25},
                {x: 57.5, y: 7.5, width: 12.5, height: 25},
                {x: 70,   y: 7.5, width: 12.5, height: 25},
            ],
            dial: {x: 0, y: 2}
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(150,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            },
            readout: 'fill:rgba(0,0,0,1); font-size:12px; font-family:Courier New;',
            readoutBacking: 'fill:rgba(0,0,0,1);'
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

        //tempo dial
            _mainObject.append(parts.display.label(null, shape.dial.x+7,    shape.dial.y+34, '60',        style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '150',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '240',       style.text));
            var dial_tempo = parts.control.dial_continuous(
                'dial_tempo', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_tempo);
            dial_tempo.ondblclick = function(){ this.set(1/3); };
            dial_tempo.onChange = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                setReadout(data);
            };
            dial_tempo.onRelease = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                setReadout(data);
                startClock(data);
            };

        //tempo readout
            _mainObject.append( parts.basic.rect(null, shape.readoutBacking.x, shape.readoutBacking.y, shape.readoutBacking.width, shape.readoutBacking.height, 0, style.readoutBacking) );

            var sevenSegmentDisplays = [];
            for(var a = 0; a < shape.readouts.length; a++){
                var temp = parts.display.sevenSegmentDisplay(null, shape.readouts[a].x, shape.readouts[a].y, shape.readouts[a].width, shape.readouts[a].height);
                    _mainObject.append(temp);
                    sevenSegmentDisplays.push(temp);
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2].y-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
            _mainObject.prepend(_mainObject.io.out);

    //internal workings
        function setReadout(num){
            num = ''+num;
            while(num.length < 3){ num = '0'+num;}
            for(var a = 0; a < num.length; a++){ sevenSegmentDisplays[a].enterCharacter(num[a]); }
        }
    
        function startClock(tempo){
            if(attributes.interval){
                clearInterval(attributes.interval);
            }

            attributes.interval = setInterval(function(){
                _mainObject.io.out.send('pulse');
            },1000*(60/tempo));
        }

    //setup
        dial_tempo.set(1/3);
            
    return _mainObject;
};