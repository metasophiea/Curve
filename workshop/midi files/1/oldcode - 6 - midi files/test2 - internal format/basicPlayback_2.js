//internal format v1 playing procedure
    //collect and apply all control commands that have a tick of zero
    var machineSettings = {
        'arrangementName':'',
        'ticksPerMeasure':128,
        'timeSignature'  :[4,4],
        'beatsPerSecond' :2,
        'ticksPerSecond' :64 
    };

    for(var a = 0; a < internalizedMidi.control.length; a++){
        if( internalizedMidi.control[a].tick == 0 ){
            machineSettings[internalizedMidi.control[a].commandName] = internalizedMidi.control[a].data;
        }
    }

    //compute additional playback settings
        machineSettings.secondsPerTick = 1/machineSettings.ticksPerSecond;
        machineSettings.tick = 0;
        machineSettings.trackIndex = [0];
            for(var a = 0; a < internalizedMidi.tracks.length; a++){
                machineSettings.trackIndex.push(0);
            }

    //performance
        function perform(list,command){
            function calculateTicksPerSecond(ticksPerMeasure, beatsPerSecond, timeSignature){
                return (ticksPerMeasure*beatsPerSecond)/timeSignature[0];
            }

            if(list == 0){ //control list
                switch(command.commandName){
                    case 'arrangementName': 
                        machineSettings.arrangementName = command.data;
                    break;
                    case 'ticksPerMeasure': 
                        machineSettings.ticksPerMeasure = command.data;
                        machineSettings.ticksPerSecond = calculateTicksPerSecond(machineSettings.ticksPerMeasure,machineSettings.beatsPerSecond,machineSettings.timeSignature);
                    break;
                    case 'timeSignature': 
                        machineSettings.timeSignature = command.data;
                        machineSettings.ticksPerSecond = calculateTicksPerSecond(machineSettings.ticksPerMeasure,machineSettings.beatsPerSecond,machineSettings.timeSignature);
                    break;
                    case 'beatsPerSecond': 
                        machineSettings.beatsPerSecond = command.data;
                        machineSettings.ticksPerSecond = calculateTicksPerSecond(machineSettings.ticksPerMeasure,machineSettings.beatsPerSecond,machineSettings.timeSignature);
                    break;
                }
            }
            else{ //other lists
                switch(command.commandName){
                    case 'trackName':           console.log(list, 'trackName',command.data); break;
                    case 'channel':             console.log(list, 'channel',command.data); break;
                    case 'instrumentNumber':    console.log(list, 'instrumentNumber',command.data); break;
                    case 'instrumentName':      console.log(list, 'instrumentName',command.data); break;
                    case 'instrumentFamily':    console.log(list, 'instrumentFamily',command.data); break;
                    case 'isPercussion':        console.log(list, 'isPercussion',command.data); break;
                    case 'note':                console.log(list, 'note',command.data); break;
                    case 'text':                console.log(list, 'text',command.data); break;
                }
            }
        }

        function iterator(){
            var commandLists = [];
                commandLists = commandLists.concat( [internalizedMidi.control] );
                commandLists = commandLists.concat( internalizedMidi.tracks );

            for(var a = 0; a < commandLists.length; a++){
                while(commandLists[a].length > machineSettings.trackIndex[a] && commandLists[a][machineSettings.trackIndex[a]].tick <= machineSettings.tick){
                    perform(a,commandLists[a][machineSettings.trackIndex[a]++]);
                }
            }
            machineSettings.tick++;
        }

        // var interval = setInterval(iterator, 1000*machineSettings.secondsPerTick);
        setTimeout(iterator,0*1000*machineSettings.secondsPerTick);