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

        loop:{active:false, start:0, end:1},
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
        function updateNeedle(){
            state.needlePosition = state.itself.currentTime();
            state.lastSightingTimeOfTheNeedlePosition = context.currentTime;
        }

    //controls
        this.load = function(type,callback){
            loadFile(type,function(data){
                callback(data);
                // updateNeedle();
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
            //log the starting time and the play state
                state.lastSightingTimeOfTheNeedlePosition = context.currentTime;
                state.playing = true;
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
            flow.bufferSource.loop = bool;
        };
        this.loopBounds = function(data={start:0,end:1}){
            if(data==undefined){return data;}

            state.loop.start = data.start!=undefined ? data.start : state.loop.start;
            state.loop.end   = data.end!=undefined ?   data.end :   state.loop.end;

            flow.bufferSource.loopStart = state.loop.start;
            flow.bufferSource.loopEnd = state.loop.end;
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