var makeMidiPlayer = function(ticksPerBeat){
    return new function(ticksPerBeat){
        var midiData = [];
        var midiCommands = [];
        var tempo = 120;
        var instrumentNumber = 0;
        var ticksPerBeat = ticksPerBeat;
        var timeSignature = {numerator:4, denominator:4, metronome:0, thirtyseconds:0};
        var keySignature = {key:0, scale:0};

        var ticksPerSecond = ticksPerBeat/(60/tempo);

        var time = 0;
        var currentDelta = 0;
        var commandIndex = 0;

        var intervalTime = 1000;

        this.printState = function(){
            console.log('- Current State -');
            console.log('\ttempo:',tempo);
            console.log('\tinstrumentNumber:',instrumentNumber);
            console.log('\tticksPerBeat:',ticksPerBeat);
            console.log('\tticksPerSecond:',ticksPerSecond);
            console.log('\ttimeSignature:',timeSignature);
            console.log('\tkeySignature:',keySignature);
            console.log('\ttime:',time);
        };
        this.performCommand = function(midiCommand){
            switch(midiCommand .type){
                case 'timeSignature':
                    console.log('timeSignature:'+midiCommand .numerator+'/'+midiCommand .denominator, 'metronome:'+midiCommand .metronome, 'thirtyseconds:'+midiCommand .thirtyseconds);
                    timeSignature = {
                        numerator: midiCommand .numerator, 
                        denominator: midiCommand .denominator, 
                        metronome: midiCommand .metronome, 
                        thirtyseconds: midiCommand .thirtyseconds,
                    };
                break;
                case 'trackName':
                    console.log('trackName: ' + midiCommand .text);
                break;
                case 'text':
                    console.log('text: ' + midiCommand .text);
                break;
                case 'keySignature':
                    console.log('key:'+midiCommand .key, 'scale:'+midiCommand .scale);
                    keySignature = {key:midiCommand .key, scale:midiCommand .scale};
                break;
                case 'programChange':
                    console.log('programChange:', midiCommand .programNumber);
                    instrumentNumber = midiCommand .programNumber;
                break;
                case 'control':
                    console.log('control midiCommand : ' + midiCommand .controller +'/'+ midiCommand .value);
                break;
                case 'setTempo':
                    tempo = 60 / (1/(midiCommand.microsecondsPerBeat/1000000));
                    intervalTime = tempo/1000;
                    console.log('new tempo:', tempo+'bpm');
                break;
                case 'note':
                    console.log('perform note:', midiCommand .noteNumber, midiCommand .velocity);
                break;
                default: console.log(midiCommand ); break;
            }
            return midiCommand .deltaTime;
        };
        this.loadMidi = function(midi){
            midiData = midi;
            var commands = midiData.trackHeadCommands(0);
            for(var a = 0; a < commands.length; a++){
                this.performCommand(commands[a]);
            }
            midiCommands = midiData.collectByTime();
        };
        this.step = function(){
            while(midiCommands[commandIndex] != undefined && midiCommands[commandIndex].time < (currentDelta+ticksPerSecond)){
                this.performCommand(midiCommands[commandIndex]);
                commandIndex++;
            }

            currentDelta+=ticksPerSecond;
        };
        this.play = function(){
            setInterval(function(that){that.step();}, intervalTime, this);
        };
    }(ticksPerBeat);
};








var temp = importMidi(testMidi_2_binaryString);
var player = makeMidiPlayer(960);
player.loadMidi(temp);
player.printState();
player.play();