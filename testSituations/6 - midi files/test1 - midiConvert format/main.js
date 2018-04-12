// {{include:../midiparsers/MidiConvert-testMidiData1.js}}
// {{include:../midiparsers/MidiConvert-testMidiData2.js}}
{{include:../midiparsers/MidiConvert-testMidiData3.js}}



console.log(testMidiData);

console.log('');

console.log('Pulses Per Quarter Note', testMidiData.header.PPQ);
console.log('Pulses Per Bar', testMidiData.header.PPQ*4);
console.log('Start Time', testMidiData.startTime);
console.log('Duration', testMidiData.duration);
console.log('BPM', testMidiData.header.bpm);
console.log('timeSignature', testMidiData.header.timeSignature[0]+'/'+testMidiData.header.timeSignature[1]);

console.log('Tracks');
for(var a = 0; a < testMidiData.tracks.length; a++){
    if(testMidiData.tracks[a].length == 0){continue;}
    console.log('\tTrack:', a);
    console.log('\tChannel:', testMidiData.tracks[a].channelNumber);
    console.log('\tName:', testMidiData.tracks[a].name);
    console.log('\tInstrument:', testMidiData.tracks[a].instrumentNumber +' - '+ testMidiData.tracks[a].instrument);
    console.log('\tIs Percussion:', testMidiData.tracks[a].isPercussion);
    console.log('\tstartTime:', testMidiData.tracks[a].startTime);
    console.log('\tduration:', testMidiData.tracks[a].duration);
    console.log('\tnoteCount:', testMidiData.tracks[a].length);

    for(var b = 0; b < testMidiData.tracks[a].notes.length; b++){
        console.log(
            '\t\t', b + ' -',
            'midiNumber:', testMidiData.tracks[a].notes[b].midi,
            'time:', testMidiData.tracks[a].notes[b].time,
            'duration:', testMidiData.tracks[a].notes[b].duration ,
            'velocity:', testMidiData.tracks[a].notes[b].velocity
        );
    }
}

console.log('');

function yankOutTrackNotes(midiData, trackNumber){
    var temp = midiData.tracks[trackNumber].notes;

    for(var a = 0; a < temp.length; a++){
        delete temp[a].name;

        if(temp[a].midi){
            temp[a].number = temp[a].midi;
            delete temp[a].midi;
        }

        if(temp[a].duration){
            var newEndCommand = 
                {
                    'time':temp[a].time+temp[a].duration,
                    'velocity':0,
                    'number':temp[a].number,
                };

            var b = a;
            while( b < temp.length && newEndCommand.time > temp[b].time){ b++; }
            temp.splice(b, 0, newEndCommand);
        }

        delete temp[a].duration;
    }

    return temp;
}

// var track = yankOutTrackNotes(testMidiData,1);
// track.index = 0;
// for(var a = 0; a < track.length; a++){
//     console.log(track[a]);
// }
// console.log('');



// var clock = 0;
// var clockStep_milliseconds = 100;
// var interval = setInterval(function(){
//     if( !track[track.index] ){clearInterval(interval);return;}

//     var temp = track[track.index];
//     while(temp.time < clock){
//         console.log(temp);
//         track.index++;
//         if( !track[track.index] ){clearInterval(interval);return;}
//         temp = track[track.index];
//     }

//     clock += clockStep_milliseconds/1000;
// },clockStep_milliseconds);