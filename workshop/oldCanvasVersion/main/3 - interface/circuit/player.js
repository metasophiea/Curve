this.player = function(context){
    //state
        var state = {
            itself:this,
            fileLoaded:false,
            playing:false,
            playhead:{ position:0, lastSightingTime:0 },
            loop:{ active:false, start:0, end:1, timeout:null},
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
        function playheadCompute(){
            //this code is used to update the playhead position as well as to calculate when the loop end will occur, 
            //and thus when the playhead should jump to the start of the loop. The actual looping of the audio is 
            //done by the system, so this process is done solely to update the playhead position data.
            //  Using the playhead's current position and play rate; the length of time before the playhead is 
            //scheduled to reach the end bound of the loop is calculated and given to a timeout. When this timeout 
            //occurs; the playhead will jump to the start bound and the process is run again to calculate the new 
            //length of time before the playhead reaches the end bound.
            //  The playhead cannot move beyond the end bound, thus any negative time calculated will be set to
            //zero, and the playhead will instantly jump back to the start bound (this is to mirror the operation of
            //the underlying audio system)

            clearInterval(state.loop.timeout);
            
            //update playhead position data
            state.playhead.position = state.itself.currentTime();
            state.playhead.lastSightingTime = context.currentTime;

            //obviously, if the loop isn't active or the file isn't playing, don't do any of the work
            if(!state.loop.active || !state.playing){return;}

            //calculate time until the timeout should be called
            var timeUntil = state.loop.end - state.itself.currentTime();
            if(timeUntil < 0){timeUntil = 0;}

            //the callback (which performs the jump to the start of the loop, and recomputes)
            state.loop.timeout = setTimeout(function(){
                state.itself.jumpTo(state.loop.start,false);
                playheadCompute();
            }, (timeUntil*1000)/state.rate);
        }
        function jumpToTime(value){
            //check if we should jump at all
            //(file must be loaded)
                if(!state.fileLoaded){return;}
            //if playback is stopped; only adjust the playhead position
                if( !state.playing ){
                    state.playhead.position = value;
                    state.playhead.lastSightingTime = context.currentTime;
                    return;
                }

            //if loop is enabled, and the desired value is beyond the loop's end boundry,
            //set the value to the start value
                if(state.loop.active && value > state.loop.end){value = state.loop.start;}

            //stop playback, with a callback that will change the playhead position
            //and then restart playback
                state.itself.stop(function(){
                    state.playhead.position = value;
                    state.playhead.lastSightingTime = context.currentTime;
                    state.itself.start();
                });
        }
    
    //controls
        this.unloadRaw = function(){
            return flow.track;
        };
        this.loadRaw = function(data,callback){
            if(Object.keys(data).length === 0){return;}
            state.itself.stop();
            flow.track = data;
            state.fileLoaded = true;
            state.playhead.position = 0;
            callback(data);
        };
        this.load = function(type,callback,url=''){
            state.fileLoaded = false;
            workspace.library.audio.loadAudioFile(
                function(data){
                    state.itself.stop();
                    flow.track = data;
                    state.fileLoaded = true;
                    state.playhead.position = 0;
                    callback(data);
                },
            type,url);
        };
        this.start = function(){
            //check if we should play at all
            //(player must be stopped and file must be loaded)
                if(state.playing || !state.fileLoaded){return;}
            //load buffer, enter settings and start from playhead position
                flow.bufferSource = workspace.library.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter, function(a){state.itself.stop();});
                flow.bufferSource.loop = state.loop.active;
                flow.bufferSource.loopStart = state.loop.start;
                flow.bufferSource.loopEnd = state.loop.end;
                flow.bufferSource.playbackRate.value = state.rate;
                flow.bufferSource.start(0,state.playhead.position);
            //log the starting time, play state
                state.playhead.lastSightingTime = context.currentTime;
                state.playing = true;
                playheadCompute();
        };
        this.stop = function(callback){
            //check if we should stop at all (player must be playing)
                if( !state.playing ){return;}
            //replace the onended callback (if we get one)
            //(this callback will be replaced when 'play' is run again)
                if(callback){flow.bufferSource.onended = function(){callback();};}
            //actually stop the buffer and destroy it
                flow.bufferSource.stop(0);
                flow.bufferSource = undefined;
            //log playhead position, play state and run playheadCompute
                playheadCompute();
                state.playing = false;
        };
        this.jumpTo = function(value=0,percent=true){
            if(percent){
                value = (value>1 ? 1 : value);
                value = (value<0 ? 0 : value);
                jumpToTime(this.duration()*value);
            }else{jumpToTime(value);}
            playheadCompute();
        };
        this.loop = function(data={active:false,start:0,end:1},percent=true){
            if(data == undefined){return state.loop;}

            if(data.active != undefined){
                state.loop.active = data.active;
                if(flow.bufferSource){flow.bufferSource.loop = data.active;}
            }

            if( data.start!=undefined || data.end!=undefined){
                var mux = percent ? this.duration() : 1;
                state.loop.start = data.start!=undefined ? data.start*mux : state.loop.start;
                state.loop.end   = data.end!=undefined ?   data.end*mux :   state.loop.end;
                if(flow.bufferSource){
                    flow.bufferSource.loopStart = state.loop.start;
                    flow.bufferSource.loopEnd = state.loop.end;
                }
            }

            playheadCompute();
        };
        this.rate = function(value=1){
            state.rate = value;
            if(flow.bufferSource){flow.bufferSource.playbackRate.value = value;}
            playheadCompute();
        };

    //info
        this.isLoaded = function(){return state.fileLoaded;};
        this.duration = function(){return !state.fileLoaded ? -1 : flow.track.duration;};
        this.title = function(){return !state.fileLoaded ? '' : flow.track.name;};
        this.currentTime = function(){
            //check if file is loaded
                if(!state.fileLoaded){return -1;}
            //if playback is stopped, return the playhead position, 
                if(!state.playing){return state.playhead.position;}
            //otherwise, calculate the current position
                return state.playhead.position + state.rate*(context.currentTime - state.playhead.lastSightingTime);
        };
        this.progress = function(){return this.currentTime()/this.duration()};
        this.waveformSegment = function(data={start:0,end:1},resolution){
            if(data==undefined || !state.fileLoaded){return [];}
            return workspace.library.audio.waveformSegment(flow.track.buffer, data, resolution);
        };
};
