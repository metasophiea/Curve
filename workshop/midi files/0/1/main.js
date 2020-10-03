var temp = importMidi(testMidi_2_binaryString);
console.log(temp);
// console.log(temp.collectByTrack());
// console.log(temp.collectByTime());
console.log(temp.collectByTime('note'));
// console.log(temp.trackHeadCommands(0));



// var fullList = temp.collectByTime();
// var count = 0;
// var tick = 0;
// setInterval(function(){
//     // console.log('tick:'+tick, fullList[count++]);
//     console.log(fullList.shift());
// },50);

// console.log(temp.trackHeadCommands(0));
// var fullList = temp.collectByTime();
// var count = 0;
// var tick = 0;
// setInterval(function(){
//     // console.log('tick:'+tick, fullList[count++]);
//     console.log(fullList.shift());
// },50);

var midiPlayer = new function(){

    var tempo = 120;
    var instrumentNumber = 0;
    var ticksPerBeat = 100;
    var timeSignature = {numerator:4, denominator:4, metronome:0, thirtyseconds:0};
    var keySignature = {key:0, scale:0};

    var interval = null;
    var commandIndex = 0;

    function processCommand(command){
        switch(command.type){
            case 'timeSignature':
                console.log('timeSignature:'+command.numerator+'/'+command.denominator, 'metronome:'+command.metronome, 'thirtyseconds:'+command.thirtyseconds);
                timeSignature = {
                    numerator: command.numerator, 
                    denominator: command.denominator, 
                    metronome: command.metronome, 
                    thirtyseconds: command.thirtyseconds,
                };
            break;
            case 'trackName':
                console.log('trackName: ' + command.text);
            break;
            case 'text':
                console.log('text: ' + command.text);
            break;
            case 'keySignature':
                console.log('key:'+command.key, 'scale:'+command.scale);
                keySignature = {key:command.key, scale:command.scale};
            break;
            case 'programChange':
                console.log('programChange:', command.programNumber);
                instrumentNumber = command.programNumber;
            break;
            case 'control':
                console.log('control command: ' + command.controller +'/'+ command.value);
            break;
            case 'setTempo':
                tempo = ticksPerBeat * (1/(command.microsecondsPerBeat/1000000));
                console.log('new tempo:', tempo+'bpm');
            break;
            case 'note':
                console.log('perform note:', command.noteNumber, command.velocity);
            break;
            default: console.log(command); break;
        }
        return command.deltaTime;
    }

    this.setTicksPerBeat = function(a){ticksPerBeat = a;};
    this.perform = function(commandList){
        interval = setInterval(function(){


            processCommand(commandList[commandIndex]);


            if(commandList.length <= commandIndex+1){clearInterval(interval);}else{commandIndex++;}
        },tempo/1000);
    };
};

midiPlayer.perform(temp.collectByTime());