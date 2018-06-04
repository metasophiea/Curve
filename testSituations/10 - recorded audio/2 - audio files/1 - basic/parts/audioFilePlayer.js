parts.audio.audioFilePlayer = function(
    context
){
    //state
    var state = {
        itself:this,
        fileLoaded:false,
        playing:false,
        needlePosition:0.0,
        lastSightingTimeOfTheNeedlePosition:0.0,
        detune:0,

        loop:{active:false, start:0, end:1,timeout:null},
        rate:1,
    };

    //flow
        //flow chain
            var flow = {
                track:{},
                bufferSource:null,
                channelSplitter:{},
                leftOut:{}, rightOut:{}
            };

        //channelSplitter
            flow.channelSplitter = context.createChannelSplitter(2);

        //leftOut
            flow.leftOut.gain = 1;
            flow.leftOut.node = context.createGain();
            flow.leftOut.node.gain.setTargetAtTime(flow.leftOut.gain, context.currentTime, 0);
            flow.channelSplitter.connect(flow.leftOut.node, 0);
        //rightOut
            flow.rightOut.gain = 1;
            flow.rightOut.node = context.createGain();
            flow.rightOut.node.gain.setTargetAtTime(flow.rightOut.gain, context.currentTime, 0);
            flow.channelSplitter.connect(flow.rightOut.node, 1);

        //output node
            this.out_left  = function(){return flow.leftOut.node;}
            this.out_right = function(){return flow.rightOut.node;}

    //internal functions
        function loadFile(type,callback){
            state.fileLoaded = false;

            switch(type){
                case 'url': 
                    var request = new XMLHttpRequest();
                    request.open('GET', url, true);
                    request.responseType = 'arraybuffer';
                    request.onload = function(){
                        state.itself.stop();
                        context.decodeAudioData(this.response, function(data){
                            flow.track = {
                                buffer:data,
                                name:(url.split('/')).pop(),
                                duration:buffer.duration,
                            };
                            state.fileLoaded = true;
                            if(callback){callback({name:url.split('/').pop(),duration:buffer.duration});}
                        }, function(e){console.warn("Error with decoding audio data" + e.err);});
                    }
                    request.send();
                break;
                case 'file': default:
                    var inputObject = document.createElement('input');
                    inputObject.type = 'file';
                    inputObject.onchange = function(){
                        var file = this.files[0];
                        var fileReader = new FileReader();
                        fileReader.readAsArrayBuffer(file);
                        fileReader.onload = function(data){
                            state.itself.stop();
                            __globals.audio.context.decodeAudioData(data.target.result, function(buffer){
                                flow.track = {
                                    buffer:buffer,
                                    name:file.name,
                                    duration:buffer.duration,
                                };
                                state.fileLoaded = true;
                                if(callback){callback(file);}
                            });
                        }
                    };
                    document.body.appendChild(inputObject);
                    inputObject.click();
                break;
            }
        }
        function loadBuffer(data){
            flow.bufferSource = context.createBufferSource();
            flow.bufferSource.buffer = data;
            flow.bufferSource.connect(flow.channelSplitter);
            flow.bufferSource.onended = function(a){state.itself.stop();};
        }
        function updateNeedle(specificTime){
            state.needlePosition = specificTime == undefined ? state.itself.currentTime() : specificTime;
            state.lastSightingTimeOfTheNeedlePosition = context.currentTime;
        }
        function loopCompute(){
            //this code is used to calculate when the loop end will occur, and thus when the needle should jump
            //to the start of the loop. The actual looping of the audio is done by the system, so this process
            //is done solely to update the needle position.
            //  Using the needle's current postiion and paly rate; the length of time before the needle is scheduled
            //to reach the end bound of the loop is calculated and given to a timeout. When this timeout occurs; 
            //the needle will jump to the start bound and the process is run again to calculate the new length of
            //time before the needle reaches the end bound.
            //  The playhead cannot move beyond the end bound, thus any negative time calculated will be set to
            //zero, and the playhead will instantly jump back to the start bound (this is a limitation of the
            //underlying audio system)

            clearInterval(state.loop.timeout);

            //obviously, if the loop isn't active or the file isn't playing, don't do any of the work
            if(!state.loop.active || !state.playing){return;}

            updateNeedle();
            var timeUntil = state.loop.end - state.itself.currentTime();
            if(timeUntil < 0){timeUntil = 0;}

            state.loop.timeout = setTimeout(function(){
                state.itself.jumpTo_seconds(state.loop.start);
                loopCompute();
            }, (timeUntil*1000)/state.rate);
        }

    //controls
        this.load = function(type,callback){
            loadFile(type,function(data){
                callback(data);
                state.needlePosition = 0.0;
            });
        };
        this.play = function(){
            //check if we should play at all
            //(player must be stopped and file must be loaded)
                if(state.playing || !state.fileLoaded){return;}
            //load buffer, enter settings and start from needle position
                loadBuffer(flow.track.buffer);
                flow.bufferSource.loop = state.loop.active;
                flow.bufferSource.loopStart = state.loop.start;
                flow.bufferSource.loopEnd = state.loop.end;
                flow.bufferSource.detune.value = state.detune;
                flow.bufferSource.playbackRate.value = state.rate;
                flow.bufferSource.start(0,state.needlePosition);
            //log the starting time, play state and run loopCompute
                state.lastSightingTimeOfTheNeedlePosition = context.currentTime;
                state.playing = true;
                loopCompute();
        };
        this.stop = function(callback){
            //check if we should stop at all
            //(player must be playing)
                if( !state.playing ){return;}
            //(if we get one) replace the onended callback
            //(this callback will be replaced when 'play' is run again)
                if(callback){flow.bufferSource.onended = function(){callback();};}
            //actually stop the buffer and destroy it
                flow.bufferSource.stop(0);
                flow.bufferSource = undefined;
            //log needle position and play state
                updateNeedle();
                state.playing = false;
        };
        this.jumpTo_percent = function(value=0){
            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);
            this.jumpTo_seconds(this.duration()*value);
        };
        this.jumpTo_seconds = function(value=0){
            //check if we should jump at all
            //(file must be loaded)
                if(!state.fileLoaded){return;}
            //if playback is stopped; only adjust the needle position
                if( !state.playing ){
                    state.needlePosition = value;
                    state.lastSightingTimeOfTheNeedlePosition = context.currentTime;
                    return;
                }

            //if loop is enabled, and the desired value is beyond the loop's end boundry,
            //set the value to the start value
            if(state.loop.active && value > state.loop.end){value = state.loop.start;}

            //stop playback, with a callback that will change the needle position
            //and then restart playback
                this.stop(function(){
                    state.needlePosition = value;
                    state.lastSightingTimeOfTheNeedlePosition = context.currentTime;
                    state.itself.play();
                });
        };
        this.loop = function(bool=false){
            state.loop.active = bool;
            if(flow.bufferSource){
                flow.bufferSource.loop = state.loop.active;
            }

            loopCompute();
        };
        this.loopBounds = function(data={start:0,end:1}){
            if(data==undefined){return data;}

            state.loop.start = data.start!=undefined ? data.start*this.duration() : state.loop.start;
            state.loop.end   = data.end!=undefined ?   data.end*this.duration() :   state.loop.end;

            if(flow.bufferSource){
                flow.bufferSource.loopStart = state.loop.start;
                flow.bufferSource.loopEnd = state.loop.end;
            }

            loopCompute();
        };
        this.detune = function(value=0){
            //detune is trash right now. All it is, is a different way to adjust rate,
            //using 'cents' instead of factors. When there's a proper detune which
            //preserves time, this functionality will be revisited
            
            // state.detune = value;
            // if(flow.bufferSource){flow.bufferSource.detune.value = value;}
            // updateNeedle();
        };
        this.rate = function(value=1){
            state.rate = value;
            if(flow.bufferSource){flow.bufferSource.playbackRate.value = value;}
            updateNeedle();
            loopCompute();
        };

    //info
        this.duration = function(){
            if(!state.fileLoaded){return -1;}
            return flow.track.duration;
        };
        this.currentTime = function(){
            //check if file is loaded
                if(!state.fileLoaded){return -1;}
            //if playback is stopped, return the needle position, 
                if(!state.playing){return state.needlePosition;}
            //otherwise, calculate the current position
                return state.needlePosition + state.rate*(context.currentTime - state.lastSightingTimeOfTheNeedlePosition);
        };
        this.title = function(){
            if(!state.fileLoaded){return '';}
            return flow.track.name;};
        this.waveformSegment = function(data={start:0,end:1}){
            if(data==undefined){return [];}
            if(!state.fileLoaded){return [];}
            data.start = data.start ? data.start : 0;
            data.end = data.end ? data.end : 1;
            data.resolution = 10000;

            var waveform = flow.track.buffer.getChannelData(0);
            var channelCount = flow.track.buffer.numberOfChannels;

            data.start = flow.track.buffer.length*data.start;
            data.end = flow.track.buffer.length*data.end;
            data.step = (data.end - data.start)/data.resolution;

            var outputArray = [];
            for(var a = data.start; a < data.end; a+=Math.round(data.step)){
                outputArray.push( 
                    __globals.utility.math.largestValueFound(
                        waveform.slice(a, a+Math.round(data.step))
                    )
                );
            }

            return outputArray;
        };
};