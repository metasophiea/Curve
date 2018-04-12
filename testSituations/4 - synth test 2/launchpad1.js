function makeLaunchpad1(x,y){
    var _mainObject = parts.basic.g('launchpad1', x, y);
        parts.modifier.makeUnselectable(_mainObject);

    var connectionNode_data = parts.dynamic.connectionNode_data('connectionNode_data',50-30/2,100-30/2,30,30);
        _mainObject.append(connectionNode_data);

    var backing = parts.basic.rect(null, 0, 0, 100, 100, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        backing = parts.modifier.onmousedownFunctions(backing, backing.parentElement, arguments.callee);

    var rastorgrid = parts.control.rastorgrid('rastorgrid', 10, 10, 80, 80, 8, 8, 'fill:rgba(200,175,200,1)', 'fill:rgba(150,125,150,1)', 'fill:rgba(225,175,225,1)', 'fill:rgba(200,125,200,1)');
        _mainObject.append(rastorgrid);

    _mainObject.movementRedraw = function(){
        connectionNode_data.redraw();
    };
        


    var availableNotes = ['5C', '4B', '4A', '4G', '4F', '4E', '4D', '4C'];
    var stage = 7; var limit = 8; var height = 8;
    var tempo = 120;
    setInterval(function(){
        for(var a = 0; a < height; a++){ 
            rastorgrid.light(stage,a,false);
            if( rastorgrid.box(stage,a).get() ){ connectionNode_data.send('midiNote',{'number':__globals.audio.names_midinumbers[availableNotes[a]], 'velocity':0}); }
        }

        stage++;if(stage>=limit){stage=0;}

        for(var a = 0; a < height; a++){ 
            rastorgrid.light(stage,a,true);
            if( rastorgrid.box(stage,a).get() ){ connectionNode_data.send('midiNote',{'number':__globals.audio.names_midinumbers[availableNotes[a]], 'velocity':1}); }
        }
    },1000*(60/tempo));





    _mainObject.io = {};
    _mainObject.io.out = connectionNode_data;

    return _mainObject;
}