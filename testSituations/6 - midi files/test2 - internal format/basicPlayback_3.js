parts.audio.midiPerformer_basic = function(){
    var midiSequence = null;
    var settings = {
        'arrangementName' : '',
        'ticksPerMeasure' : 128,
        'timeSignature'   : [4,4],
        'beatsPerSecond'  : 2,
        'ticksPerSecond'  : 64
    };
    var interval = null;
    var self = this;

    //internal functionality
        function calculateTicksPerSecond(ticksPerMeasure, beatsPerSecond, timeSignature){
            return (ticksPerMeasure*beatsPerSecond)/timeSignature[0];
        }
        function recalculateTiming(){
            settings.ticksPerSecond = calculateTicksPerSecond(settings.ticksPerMeasure,settings.beatsPerSecond,settings.timeSignature);
            settings.secondsPerTick = 1/settings.ticksPerSecond;

            var mux = 1; while(1000*settings.secondsPerTick*mux < 10){ mux++; }

            settings.intervalTime = settings.secondsPerTick*mux;
            settings.tickStep = mux;

            if(interval){startInterval(settings.intervalTime);}
        }

        function iterator(){
            var commandLists = [];
                commandLists = commandLists.concat( [midiSequence.control] );
                commandLists = commandLists.concat( midiSequence.tracks );

            for(var a = 0; a < commandLists.length; a++){
                while(commandLists[a].length > settings.trackIndex[a] && commandLists[a][settings.trackIndex[a]].tick <= settings.tick){
                    perform(a,commandLists[a][settings.trackIndex[a]++]);
                }
            }
            settings.tick+=settings.tickStep;
        }
        function perform(list,command){
            function calculateTicksPerSecond(ticksPerMeasure, beatsPerSecond, timeSignature){
                return (ticksPerMeasure*beatsPerSecond)/timeSignature[0];
            }

            if(list == 0){ //control list
                switch(command.commandName){
                    case 'arrangementName': 
                        settings.arrangementName = command.data;
                    break;
                    case 'ticksPerMeasure': 
                        settings.ticksPerMeasure = command.data;
                        recalculateTiming();
                    break;
                    case 'timeSignature': 
                        settings.timeSignature = command.data;
                        recalculateTiming();
                    break;
                    case 'beatsPerSecond': 
                        settings.beatsPerSecond = command.data;
                        recalculateTiming();
                    break;
                }
            }
            else{ //other lists
                self.command(list-1, command.commandName, command.data);
            }
        }
        function startInterval(intervalTime){
            clearInterval(interval);
            interval = setInterval(iterator, 1000*intervalTime);
        }

    // callbacks
        this.command = function(channel, commandType, commandData){};

    // methods
        this.loadMidi = function(midi){
            midiSequence = midi;

            //load main settings
            for(var a = 0; a < midi.control.length; a++){
                if( midi.control[a].tick == 0 ){
                    settings[midi.control[a].commandName] = midi.control[a].data;
                }
            }

            //compute additional playback settings
            recalculateTiming();
            settings.tick = 0;
            settings.trackIndex = [0];
                for(var a = 0; a < midi.tracks.length; a++){
                    settings.trackIndex.push(0);
                }
        };

        this.play = function(){ startInterval(settings.intervalTime); };
        this.stop = function(){ clearInterval(interval); };
        this.step = function(){ iterator(); };
};






function makeMidiPlayer(x,y){
    var width = 75;
    var height = 370;
    var nodeSize = 20;
    
    var _mainObject = parts.basic.g('midiPlayer', x, y);

    var backing = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeMidiPlayer);

    //generate selection area        
        _mainObject.selectionArea = {};
        _mainObject.selectionArea.box = [];
        _mainObject.selectionArea.points = [];
        _mainObject.updateSelectionArea = function(){
            //the main shape we want to use
            var temp = __globals.utility.element.getBoundingBox(backing);
            _mainObject.selectionArea.points = [
                [temp.x,temp.y],
                [temp.x+temp.width,temp.y],
                [temp.x+temp.width,temp.y+temp.height],
                [temp.x,temp.y+temp.height]
            ];
            _mainObject.selectionArea.box = __globals.utility.math.boundingBoxFromPoints(_mainObject.selectionArea.points);

            //adjusting it for the object's position in space
            temp = __globals.utility.element.getTransform(_mainObject);
            _mainObject.selectionArea.box.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });
            _mainObject.selectionArea.points.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });

        };
        _mainObject.updateSelectionArea();
        


        
    _mainObject.onSelect = function(){
        console.log('I\'ve been selected!');
        __globals.utility.element.setStyle(backing, 'fill:rgba(220,220,220,1)');
    };
    _mainObject.onDeselect = function(){
        console.log('I\'ve been deselected!');
        __globals.utility.element.setStyle(backing, 'fill:rgba(200,200,200,1)');
    };
    _mainObject.onDelete = function(){
        console.log('I\'ve been deleted!');
    };
    _mainObject.onCopy = function(original=false){
        console.log('I\'ve been copied!', original?'- original object ':'- new object');
    };

    _mainObject.importData = function(data){
        console.log('importing data', data);
    };
    _mainObject.exportData = function(){
        console.log('exporting data');
        return {'like settings and stuff':'settin\'s' };
    };



    _mainObject.io = {};
    _mainObject.io.out = [];
    for(var a = 0; a < 16; a++){
        _mainObject.io.out.push( parts.dynamic.connectionNode_data('io.out_'+a,-nodeSize/2,nodeSize*1.1*a + nodeSize/2,nodeSize,nodeSize) );
        _mainObject.append( _mainObject.io.out[a] );
    }

    var perf = new parts.audio.midiPerformer_basic();
    perf.loadMidi(internalizedMidi);
    perf.command = function(channel, commandType, commandData){
        if(commandType == 'note'){
            _mainObject.io.out[channel].send('midiNumber', {'num': commandData.noteNumber, 'velocity': commandData.velocity} );
        }
    };
    perf.play();
    // perf.step();

    _mainObject.play = perf.play;
    _mainObject.step = perf.step;
    _mainObject.stop = perf.stop;

    return _mainObject;
}