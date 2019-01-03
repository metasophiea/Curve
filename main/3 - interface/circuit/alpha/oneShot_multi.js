this.oneShot_multi = function(context){
    //state
        var state = {
            itself:this,
            fileLoaded:false,
            rate:1,
        };

    //flow
        //chain
        var flow = {
            track:{},
            bufferSource:null,
            bufferSourceArray:[],
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
            this.audioOut = function(channel){
                switch(channel){
                    case 'r': return flow.rightOut.node; break;
                    case 'l': return flow.leftOut.node; break;
                    default: console.error('"part.circuit.alpha.oneShot_multi.audioOut" unknown channel "'+channel+'"'); break;
                }
            };
            this.out_left  = function(){return this.audioOut('l');}
            this.out_right = function(){return this.audioOut('r');}








    //loading/unloading
        this.loadRaw = function(data){
            if(Object.keys(data).length === 0){return;}
            flow.track = data;
            state.fileLoaded = true;
            state.needlePosition = 0.0;
        };
        this.load = function(type,callback,url){
            state.fileLoaded = false;
            workspace.library.audio.loadAudioFile(
                function(data){
                    state.itself.loadRaw(data);
                    if(callback != undefined){ callback(data); }
                },
            type,url);
        };
        this.unloadRaw = function(){
            return flow.track;
        };

    //control
        //play
            this.fire = function(start=0,duration){
                //check if we should play at all (the file must be loaded)
                    if(!state.fileLoaded){return;}
                //load buffer, add onend code, enter rate setting, start and add to the array
                    var temp = workspace.library.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter, function(){
                        flow.bufferSourceArray.splice(flow.bufferSourceArray.indexOf(this),1);
                    });
                    temp.playbackRate.value = state.rate;
                    temp.start(0,start*state.rate,duration*state.rate);
                    flow.bufferSourceArray.push(temp);
            };
            this.panic = function(){
                while(flow.bufferSourceArray.length > 0){
                    flow.bufferSourceArray.shift().stop(0);
                }
            };
        //options
            this.rate = function(value){ 
                if(value == undefined){return state.rate;}
                if(value == 0){value = 1/1000000;}
                state.rate = value;
            };

    //info
        this.duration = function(){
            if(!state.fileLoaded){return -1;}
            return flow.track.duration / state.rate;
        };
        this.title = function(){
            if(!state.fileLoaded){return '';}
            return flow.track.name;
        };
        this.waveformSegment = function(data={start:0,end:1}){
            if(data==undefined){return [];}
            if(!state.fileLoaded){return [];}
            return workspace.library.audio.waveformSegment(flow.track.buffer,data);
        };
};