function fileData2midifile2internal(fileData){
    //push through the midi file parser
        fileData = MidiFile(fileData);

    //generate note registries 
        output = [];
        for(var a = 0; a < fileData.tracks.length; a++){
            //for every note command in the track, generate an intermidiate node command
            //and place it in the list
            // intermidiate node command = {time: n, note: n, strength: n, duration: n}
                var time = 0;
                var currentList = [];
                for(var b = 0; b < fileData.tracks[a].length; b++){
                    time += fileData.tracks[a][b].deltaTime;

                    if( 'noteNumber' in fileData.tracks[a][b] ){
                        if(fileData.tracks[a][b].subtype == 'noteOff'){
                            for(var c = currentList.length-1; c >= 0; c--){
                                if(fileData.tracks[a][b].noteNumber == currentList[c].note){
                                    currentList[c].duration = time - currentList[c].time;
                                    break;
                                }
                            }
                        }else{                        
                            currentList.push({
                                time: time,
                                note: fileData.tracks[a][b].noteNumber,
                                strength: fileData.tracks[a][b].velocity,
                            });
                        }
                    }
                }

            //create a new note registry 
                var temp = new parts.circuits.sequencing.noteRegistry();
                
            //go through each note on the list, modifying them and adding them to the registry
                for(var b = 0; b < currentList.length; b++){
                    temp.add({
                        line:     currentList[b].note,
                        position: currentList[b].time/fileData.header.ticksPerBeat,
                        length:   currentList[b].duration/fileData.header.ticksPerBeat,
                        strength: currentList[b].strength/127,
                    });
                }

            //if the registry isn't empty; push registry to output array
                if(temp.getAllNotes().length > 0){ output.push(temp); }
        }

    return output;
}





var pulseGenerator_1 = system.utility.workspace.placeAndReturnObject( objects.pulseGenerator_hyper(870, -15) );
var basicSequencer_midiOut_1 = system.utility.workspace.placeAndReturnObject( objects.basicSequencer_midiOut(10, 10) );
var basicSynthesizer_1 = system.utility.workspace.placeAndReturnObject( objects.basicSynthesizer(-250, 40) );
var audio_duplicator_1 = system.utility.workspace.placeAndReturnObject( objects.audio_duplicator(-345, 50) );
var audio_sink_1 = system.utility.workspace.placeAndReturnObject( objects.audio_sink(-490, 50) );
pulseGenerator_1.io.out.connectTo(basicSequencer_midiOut_1.io.progress);
basicSequencer_midiOut_1.io.midiout.connectTo(basicSynthesizer_1.io.midiNote);
basicSynthesizer_1.io.audioOut.connectTo(audio_duplicator_1.io.input);
audio_duplicator_1.io.output_1.connectTo(audio_sink_1.io.right);
audio_duplicator_1.io.output_2.connectTo(audio_sink_1.io.left);
basicSequencer_midiOut_1.i.loopActive(true);
basicSequencer_midiOut_1.i.stepSize(0.25);


var temp = fileData2midifile2internal(testMidi_3_binaryString);
basicSequencer_midiOut_1.i.addNotes(temp[0].getAllNotes());