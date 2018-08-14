{{include:../midiparsers/MidiConvert.js}}

function internalizeMidi_v1_MidiConvert(filedata){
    function calculateTicksPerSecond(ticksPerMeasure, beatsPerSecond, timeSignature){
        return (ticksPerMeasure*beatsPerSecond)/timeSignature[0];
    }

    function sortedInsert(array,key,item){
        //figure out which half of the array it's going to be in
        if( array[Math.round(array.length/2)][key] > item[key] ){
            //check/insert from front
            var a = 0;
            while( array[a][key] <= item[key] ){ a++; }
            array.splice(a, 0, item);
        }else{
            //check/insert from back
            var a = array.length-1;
            while( array[a][key] > item[key] ){ a--; }
            array.splice(a+1, 0, item);
        }
    }

    function makeCommand(tick,commandName,data){
        return {'tick':tick, 'commandName':commandName, 'data':data};
    }

    function internalizeMidiTrack_v1_MidiConvert(track,ticksPerSecond){
        var output = [];
        
            output.push( makeCommand(0,'trackName',track.name==undefined?'':track.name) );
            output.push( makeCommand(0,'channel',track.channelNumber) );
            output.push( makeCommand(0,'instrumentNumber',track.instrumentNumber) );
            output.push( makeCommand(0,'instrumentName',track.instrument==undefined?'':track.instrument) );
            output.push( makeCommand(0,'instrumentFamily',track.instrumentFamily==undefined?'':track.instrumentFamily) );
            output.push( makeCommand(0,'isPercussion',track.isPercussion) );

            for(var a = 0; a < track.notes.length; a++){
                sortedInsert( output, 'tick', 
                    makeCommand(
                        ticksPerSecond*track.notes[a].time,
                        'note',
                        {'noteNumber':track.notes[a].midi,'velocity':track.notes[a].velocity}
                    )
                );
                sortedInsert( output, 'tick', 
                    makeCommand(
                        ticksPerSecond*track.notes[a].time+ticksPerSecond*track.notes[a].duration,
                        'note',
                        {'noteNumber':track.notes[a].midi,'velocity':0}
                    )
                );
            }

        return output;
    }

    function internalizeMidiArrangement_v1_MidiConvert(MidiConvert_arrangement){
        var output = {};
        output.arrangementName = '';
        output.control = [];
            output.control.push(makeCommand(0,'ticksPerMeasure',MidiConvert_arrangement.header.PPQ*4));
            output.control.push(makeCommand(0,'timeSignature',MidiConvert_arrangement.header.timeSignature));
            output.control.push(makeCommand(0,'beatsPerSecond',MidiConvert_arrangement.header.bpm/60));      
            output.control.push(makeCommand(0,'ticksPerSecond',calculateTicksPerSecond(MidiConvert_arrangement.header.PPQ*4, MidiConvert_arrangement.header.bpm/60, MidiConvert_arrangement.header.timeSignature)));
        output.tracks = [];
            for(var a = 0; a < MidiConvert_arrangement.tracks.length; a++){
                output.tracks.push(internalizeMidiTrack_v1_MidiConvert(
                    MidiConvert_arrangement.tracks[a],
                    (MidiConvert_arrangement.header.PPQ*MidiConvert_arrangement.header.bpm)/(15*MidiConvert_arrangement.header.timeSignature[0])
                ));
            }

        return output;
    }

    return internalizeMidiArrangement_v1_MidiConvert(MidiConvert.parse(filedata));
}