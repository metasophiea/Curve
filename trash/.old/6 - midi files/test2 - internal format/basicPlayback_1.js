//internal format v1 basic playback procedure
    //collect and apply all control commands that have a tick of zero
        //arrangementName = ''
        //ticksPerMeasure = 128
        //timeSignature = [4,4]
        //beatsPerSecond = 2
        //ticksPerSecond = 64
    //compute additional playback settings
        //secondsPerTick = 1/ticksPerSecond;
        //tick = 0
        //trackIndex = [0,0,0,0....]
    //start playback
        // a collection of three items:
            // iterator
            //      runs through all the tracks and determines what commands to send 
            //      to the performer, based on the individual track's index and the 
            //      current tick
            // interval
            //      runs the interval function every 1000*secondsPerTick milliseconds
            // command performer
            //      performs commands, which include recalculating secondsPerTick and
            //      subsequently restarting the iterator


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
        machineSettings.trackIndex = [];
            for(var a = 0; a < internalizedMidi.tracks.length; a++){
                machineSettings.trackIndex.push(0);
            }

        console.log(machineSettings);

    //start playback
        function perform(command){
            function restartInterval(){
                clearInterval(interval);
                machineSettings.ticksPerSecond = (machineSettings.ticksPerMeasure*machineSettings.beatsPerSecond)/(machineSettings.timeSignature[0]);
                machineSettings.secondsPerTick = 1/machineSettings.ticksPerSecond;
                var interval = setInterval(iterator, 1000*machineSettings.secondsPerTick);
            }

            console.log('running command:', command, command.data);
            switch(command.commandName){
                case 'ticksPerMeasure': machineSettings.ticksPerMeasure = command.data; restartInterval(); break;
                case 'timeSignature'  : machineSettings.timeSignature =   command.data; restartInterval(); break;
                case 'beatsPerSecond' : machineSettings.beatsPerSecond =  command.data; restartInterval(); break;
            }

        }

        function iterator(){
            for(var a = 0; a < internalizedMidi.tracks.length; a++){

                while( 
                    internalizedMidi.tracks[a][machineSettings.trackIndex[a]] && 
                    internalizedMidi.tracks[a][machineSettings.trackIndex[a]].tick <= machineSettings.tick 
                ){
                    perform(internalizedMidi.tracks[a][machineSettings.trackIndex[a]]);
                    machineSettings.trackIndex[a]++;
                }

            }

            console.log('');
            machineSettings.tick++;
        }

        // var interval = setInterval(iterator, 1000*machineSettings.secondsPerTick);