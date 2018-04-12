function makePulseClock(x,y){
    var _mainObject = parts.basic.g('pulseClock', x, y);
        parts.modifier.makeUnselectable(_mainObject);

    var backing = parts.basic.rect(null, 0, 0, 50, 50, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        backing = parts.modifier.onmousedownFunctions(backing, backing.parentElement, arguments.callee);







    var interval = null;
    function startClock(tempo){
        if(interval){
            clearInterval(interval);
        }

        interval = setInterval(function(){
            _mainObject.io.pulseOut.send('pulse');
        },1000*(60/tempo));
    }

    var tempoLimits = {'low':60, 'high':240};
    var tempoReadout = parts.display.label(null, 10, 40, '120', 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;');
        _mainObject.append(tempoReadout);
    var Cdial = parts.control.dial_continuous('Cdial', 2+30/2, 2+30/2, 12);
        _mainObject.append(Cdial);
        Cdial.ondblclick = function(){ this.set(1/3); };
        Cdial.onChange = function(data){
            data = tempoLimits.low + (tempoLimits.high-tempoLimits.low)*data
            tempoReadout.text(data);
            startClock(data);
        };
        Cdial.set(1/3);













    _mainObject.io = {};

    _mainObject.io.pulseOut = parts.dynamic.connectionNode_data('connectionNode_pulseOut',50-20/2,25-20/2,20,20);
        _mainObject.prepend(_mainObject.io.pulseOut);

    _mainObject.movementRedraw = function(){
        _mainObject.io.pulseOut.redraw();
    };
            

    return _mainObject;
}