__globals.objects.make_pulseClock = function(x,y){
    //set numbers
        var type = 'pulseClock';
        var attributes = {
            tempoLimits: {low:60, high:240},
            interval: null
        };
        var shape = {
            base: [[0,0],[80,0],[80,40],[0,40]],
            connector: { width: 20, height: 20 },
            readout: {x: 45, y: 25}
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
            readout: 'fill:rgba(0,0,0,1); font-size:12px; font-family:Courier New;'
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
        __globals.utility.generateSelectionArea(shape.base, _mainObject);

        //tempo dial
            var x = 0;
            var y = 2;

            _mainObject.append(parts.display.label(null, x+7,    y+34, '60',        style.text));
            _mainObject.append(parts.display.label(null, x+16.5, y+4,  '150',       style.text));
            _mainObject.append(parts.display.label(null, x+30,   y+34, '240',       style.text));
            var dial_tempo = parts.control.dial_continuous(
                'dial_tempo', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_tempo);
            dial_tempo.ondblclick = function(){ this.set(1/3); };
            dial_tempo.onChange = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                tempoReadout.text(data);
            };
            dial_tempo.onRelease = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                tempoReadout.text(data);
                startClock(data);
            };

        //tempo readout
            var tempoReadout = parts.display.label(null, shape.readout.x, shape.readout.y, 'null', style.readout);
                _mainObject.append(tempoReadout);
            var rastorReadout = parts.display.rastorReadout(null, 0, 100, 320, 80, 4);
                _mainObject.append(rastorReadout);
                rastorReadout.test();

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2][1]-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
            _mainObject.prepend(_mainObject.io.out);

    //internal workings
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