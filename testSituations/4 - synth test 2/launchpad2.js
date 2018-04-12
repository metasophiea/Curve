function makeLaunchpad2(x,y){
    var _mainObject = parts.basic.g('launchpad', x, y);
        parts.modifier.makeUnselectable(_mainObject);

    var backing = parts.basic.rect(null, 0, 0, 100, 100, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        backing = parts.modifier.onmousedownFunctions(backing, backing.parentElement, arguments.callee);

    var width = 8; var height = 8;
    var rastorgrid = parts.control.rastorgrid('rastorgrid', 10, 10, 80, 80, width, height, 'fill:rgba(200,175,200,1)', 'fill:rgba(150,125,150,1)', 'fill:rgba(225,175,225,1)', 'fill:rgba(200,125,200,1)');
        _mainObject.append(rastorgrid);



    var availableNotes = ['5C', '4B', '4A', '4G', '4F', '4E', '4D', '4C'];
    var stage = width-1; 
    function progress(){
        for(var a = 0; a < height; a++){
            rastorgrid.light(stage,a,false);
            if( rastorgrid.box(stage,a).get() ){ _mainObject.io.out.send('midiNote',{'number':__globals.audio.names_midinumbers[availableNotes[a]], 'velocity':0}); }
        }

        stage++;if(stage>=width){stage=0;}

        for(var a = 0; a < height; a++){
            rastorgrid.light(stage,a,true);
            if( rastorgrid.box(stage,a).get() ){ _mainObject.io.out.send('midiNote',{'number':__globals.audio.names_midinumbers[availableNotes[a]], 'velocity':1}); }
        }
    }



    _mainObject.io = {};

    _mainObject.io.out = parts.dynamic.connectionNode_data('connectionNode_midiNoteData',50-30/2,100-30/2,30,30);
        _mainObject.prepend(_mainObject.io.out);
    _mainObject.io.pulseIn = parts.dynamic.connectionNode_data('connectionNode_pulseIn',50-20/2,-20/2,20,20);
        _mainObject.prepend(_mainObject.io.pulseIn);
        _mainObject.io.pulseIn.receive = function(address,data){if(address!='pulse'){return;} progress(); };

    _mainObject.movementRedraw = function(){
        _mainObject.io.out.redraw();
        _mainObject.io.pulseIn.redraw();
    };
        

    return _mainObject;
}