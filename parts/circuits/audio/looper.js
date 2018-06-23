this.looper = function(context){
    //state
        var state = {
            itself:this,
            fileLoaded:false,
            rate:1,
            loop:{active:true, start:0, end:1,timeout:null},
        };

    //flow
        //chain
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

            
    //controls
        this.load = function(type,callback,url=''){
            state.fileLoaded = false;
            __globals.utility.audio.loadAudioFile(
                function(data){
                    state.itself.stop();
                    flow.track = data;
                    state.fileLoaded = true;
                    state.needlePosition = 0.0;
                    callback(data);
                },
            type,url);
        };
        this.start = function(){
            //check if we should play at all (the file must be loaded)
                if(!state.fileLoaded){return;}
            //stop any previous buffers, load buffer, enter settings and start from zero
                if(flow.bufferSource){
                    flow.bufferSource.onended = function(){};
                    flow.bufferSource.stop(0);
                }
                flow.bufferSource = __globals.utility.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter);
                flow.bufferSource.playbackRate.value = state.rate;
                flow.bufferSource.loop = state.loop.active;
                flow.bufferSource.loopStart = state.loop.start*this.duration();
                flow.bufferSource.loopEnd = state.loop.end*this.duration();
                flow.bufferSource.start(0,0);
                flow.bufferSource.onended = function(){flow.bufferSource = null;};
        };
        this.stop = function(){
            if(!state.fileLoaded || !flow.bufferSource){return;}
            flow.bufferSource.stop(0);
            flow.bufferSource = undefined;
        };
        this.rate = function(){
            state.rate = value;
        };

    //info
        this.duration = function(){
            if(!state.fileLoaded){return -1;}
            return flow.track.duration;
        };
        this.title = function(){
            if(!state.fileLoaded){return '';}
            return flow.track.name;
        };
        this.waveformSegment = function(data={start:0,end:1}){
            if(data==undefined){return [];}
            if(!state.fileLoaded){return [];}
            return __globals.utility.audio.waveformSegment(flow.track.buffer,data);
        };
        this.loop = function(bool=false){
            if(data==undefined){return data;}
            state.loop.active = bool;
        };
        this.loopBounds = function(data={start:0,end:1}){
            if(data==undefined){return data;}

            state.loop.start = data.start!=undefined ? data.start : state.loop.start;
            state.loop.end   = data.end!=undefined ? data.end : state.loop.end;
        };
};
