function importMidi(binaryString, fileName='undefined.mid'){
    var temp = MidiFile(binaryString);
    var outputObj = {};

    function internalizeTrack(track){
        var output = [];
        var time = 0;
        for(var a = 0; a < track.length; a++){
            //create entry with deltaTime and command type
                time += track[a].deltaTime;
                var entry = {
                    deltaTime: track[a].deltaTime,
                    type:      track[a].subtype,
                    time:      time,
                };

            //remove saved data from the original command 
                delete track[a].deltaTime;
                delete track[a].type;
                delete track[a].subtype;

            //modify data or filter out uneeded data
                if(entry.type == 'noteOff'){ entry.type = 'note'; }
                else if(entry.type == 'noteOn'){ entry.type = 'note'; }
                else if(entry.type == 'controller'){ entry.type = 'control'; entry.controller = track[a].controllerType; delete track[a].controllerType; }
                delete track[a].channel;

            //copy all remainging data over to the new command
                entry = {...entry, ...track[a]};

            //filter out unwanted commands
                if(entry.type == 'endOfTrack'){continue;}
            
            //push command to list
                output.push(entry);
        }
        return output;
    }

    //meta data
        outputObj.ticksPerBeat = temp.header.ticksPerBeat
        outputObj.title = fileName;
        // outputObj.ticksPerSecond = 100; //outputObj.ticksPerBeat * (1/(tempo.microsecondsPerBeat/1000000))
        outputObj.tracks = [];

    //tracks
        for(var a = 0; a < temp.tracks.length; a++){
            outputObj.tracks.push(internalizeTrack(temp.tracks[a]));
        }

    //additional functions
        outputObj.collectByTrack = function(type){
            var results = [];
            for(var a = 0; a < outputObj.tracks.length; a++){
                for(var b = 0; b < outputObj.tracks[a].length; b++){
                    if(type == undefined || outputObj.tracks[a][b].type == type){
                        if(results[a] == undefined){results[a] = [];}
                        results[a].push(outputObj.tracks[a][b]);
                    }
                }
            }

            return results;
        };
        outputObj.collectByTime = function(type){
            var results = [];
            for(var a = 0; a < outputObj.tracks.length; a++){
                for(var b = 0; b < outputObj.tracks[a].length; b++){
                    if(type == undefined || outputObj.tracks[a][b].type == type){
                        results.push({ ...outputObj.tracks[a][b], track:a });
                        temp = outputObj.tracks[a][b].time;
                    }
                }
            }

            results.sort( (a,b) => Math.sign(a.time - b.time) );

            var temp = 0;
            for(var a = 0; a < results.length; a++){
                results[a].deltaTime = results[a].time - temp;
                temp = results[a].time;
            }

            return results;
        };
        outputObj.trackHeadCommands = function(a=0){
            var results = [];
            for(var b = 0; b < outputObj.tracks[a].length; b++){
                if( outputObj.tracks[a][b].deltaTime == 0 ){
                    if( outputObj.tracks[a][b].type != 'note' ){
                        results.push(outputObj.tracks[a][b]);
                    }
                }else{break;}
            }
            return results;
        };

    return outputObj;
}