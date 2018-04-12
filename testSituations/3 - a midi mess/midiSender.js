parts.dynamic.midiSender = function(){
    this.openFile = function(){ __globals.audio.midiLoader.open(loadMidiObject); };
    this.test_1 = function(){
        loadMidiObject(__globals.audio.midiLoader._testData());
        play();
    };
    this.test_2 = function(){
        loadMidiObject(__globals.audio.midiLoader._testData2());
        play();
    };


    var midiObject = {};
    var clock_counter = 0;
    var clock_step = 10;
    var ticksPerMillisecond = 1;
    var rollingInterval = null;
    var thisObject = this;



    function play(){
        stop();
        rollingInterval = setInterval(function(){iteration();clock_counter += clock_step;}, clock_step);
    }
    function stop(){
        if( rollingInterval != null ){
            clearInterval(rollingInterval); 
            rollingInterval = null; 
        }
    }
    function restart(){
        stop();
    
        clock_counter = 0;
        ticksPerMillisecond = 1;

        var keys = Object.keys(midiObject.tracks);
        for(var a = 0; a < keys.length; a++){
            midiObject.tracks[keys[a]].index = 0;
        }
    }



    function loadMidiObject(input_midiObject){
        stop();
        midiObject = input_midiObject;
        restart();
    }



    function iteration(perform=true){
        var keys = Object.keys(midiObject.tracks);
        for(var a = 0; a < Object.keys(midiObject.tracks).length; a++){
            var track = midiObject.tracks[keys[a]];
            while( track[track.index] && track[track.index].totalDelta <= clock_counter*ticksPerMillisecond ){
                processCommand(keys[a], track[track.index++], perform);
            }
        }
    }
    function processCommand(command,data){
        switch(command){
            case 'endOfTrack':       if(thisObject.endOfTrack){thisObject.endOfTrack();} break;
            case 'noteOn':           if(thisObject.noteOn){thisObject.noteOn(data);} break;
            case 'noteOff':          if(thisObject.noteOff){thisObject.noteOff(data);} break;
            case 'setTempo':         if(thisObject.setTempo){thisObject.setTempo(data);} break;
            case 'text':             if(thisObject.text){thisObject.text(data);} break;
            case 'trackName':        if(thisObject.trackName){thisObject.trackName(data);} break;
            case 'timeSignature':    if(thisObject.timeSignature){thisObject.timeSignature(data);} break;
            case 'programChange':    if(thisObject.programChange){thisObject.programChange(data);} break;
            case 'controlChange':    if(thisObject.controlChange){thisObject.controlChange(data);} break;
            default: /* unknown command */ break;
        }
    }



    //Callbacks
    this.noteOn = function(data){};
    this.noteOff = function(data){};
    this.endOfTrack = function(){};
    this.setTempo = function(data){};
    this.text = function(data){};
    this.trackName = function(data){};
    this.timeSignature = function(data){};
    this.programChange = function(data){};
    this.controlChange = function(data){};
};