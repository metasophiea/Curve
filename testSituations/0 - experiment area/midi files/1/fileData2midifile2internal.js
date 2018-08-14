function internalizeMidi_v1(fileData){
    function makeCommand(tick,commandName,data){ return {'tick':tick, 'commandName':commandName, 'data':data}; }

    function internalizeMidiArrangement_v1_MidiFile(MidiFile_arrangement){
        console.log(MidiFile_arrangement);

        //create new arrangement
            var output = {
                arrangementName:'',
                ticksPerBeat: MidiFile_arrangement.header.ticksPerBeat,
                control:[],
                tracks:[],
            };

        //extract control commands
            for(var a = 0; a < MidiFile_arrangement.tracks.length; a++){
                var totalDelta = 0;
                for(var b = 0; b < MidiFile_arrangement.tracks[a].length; b++){
                    totalDelta += MidiFile_arrangement.tracks[a][b].deltaTime;
                    if(MidiFile_arrangement.tracks[a][b].type == 'meta'){
                        if( MidiFile_arrangement.tracks[a][b].subtype == 'setTempo' ){
                            beatsPerSecond = (1000000/MidiFile_arrangement.tracks[a][b].microsecondsPerBeat);
                            output.control.push(makeCommand(totalDelta, 'beatsPerSecond', beatsPerSecond));
                        }else if( MidiFile_arrangement.tracks[a][b].subtype == 'timeSignature' ){
                            timeSignature = [MidiFile_arrangement.tracks[a][b].numerator,MidiFile_arrangement.tracks[a][b].denominator];
                            output.control.push(makeCommand(totalDelta, 'timeSignature',  timeSignature));
                        }
                    }
                }
            }
        
        //extract note commands
            for(var a = 0; a < MidiFile_arrangement.tracks.length; a++){
                var totalDelta = 0;
                var trackData = [];
                for(var b = 0; b < MidiFile_arrangement.tracks[a].length; b++){
                    totalDelta += MidiFile_arrangement.tracks[a][b].deltaTime;
                    if(MidiFile_arrangement.tracks[a][b].type == 'channel'){
                        if(MidiFile_arrangement.tracks[a][b].subtype == 'noteOn' || MidiFile_arrangement.tracks[a][b].subtype == 'noteOff'){
                            trackData.push(makeCommand(totalDelta,'note',{noteNumber:MidiFile_arrangement.tracks[a][b].noteNumber, velocity:MidiFile_arrangement.tracks[a][b].velocity}));
                        }
                    }else if(MidiFile_arrangement.tracks[a][b].type == 'meta'){
                        if(MidiFile_arrangement.tracks[a][b].subtype == 'trackName'){
                            trackData.push(makeCommand(totalDelta,'trackName',MidiFile_arrangement.tracks[a][b].text));
                        }else if(MidiFile_arrangement.tracks[a][b].subtype == 'text'){
                            trackData.push(makeCommand(totalDelta,'text',MidiFile_arrangement.tracks[a][b].text));
                        }
                    }
                }
                if(trackData.length != 0){ output.tracks.push(trackData); }
            }

        return output;
    }
    return internalizeMidiArrangement_v1_MidiFile(MidiFile(fileData));
}