parts.audio.audioFilePlayer = function(
    context,
){
    var values = {
        itself:this,
        currentTrack:0,
        loopActive:false,
        loopBounds:{start:0,end:1},
        startedAt:-1,
        needlePosition:0.0,
        loaded:false,
        playing:false,
    };

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

        function loadBuffer(data){
            flow.bufferSource = context.createBufferSource();
            flow.bufferSource.buffer = data;
            flow.bufferSource.connect(flow.channelSplitter);
            flow.bufferSource.onended = function(a){values.itself.pause();};
        }
        function reset(){
            values.needlePosition = 0;
            values.playing = false;
        }

    //controls
        this.load_url = function(url, callback){
            values.loaded = false;
            var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.onload = function(){
                    values.itself.stop();
                    context.decodeAudioData(this.response, function(data){
                        flow.track = {
                            buffer:data,
                            name:(url.split('/')).pop(),
                            duration:buffer.duration,
                        };
                        values.loaded = true;
                        reset();
                        if(callback){callback({name:url});}
                    }, function(e){console.warn("Error with decoding audio data" + e.err);});
                }
                request.send();
        };
        this.load_file = function(callback){
            values.loaded = false;
            var inputObject = document.createElement('input');
            inputObject.type = 'file';
            inputObject.onchange = function(){
                var file = this.files[0];
                var fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = function(data){
                    values.itself.stop();
                    __globals.audio.context.decodeAudioData(data.target.result, function(buffer){
                        var source = __globals.audio.context.createBufferSource();
                        flow.track = {
                            buffer:buffer,
                            name:file.name,
                            duration:buffer.duration,
                        };
                        values.loaded = true;
                        reset();
                        if(callback){callback(file);}
                    });
                }
                this.parentElement.removeChild(this);
            };
            document.body.appendChild(inputObject);
            inputObject.click();
        };

        this.loopActive = function(bool=false){
            values.loopActive = bool;
            flow.bufferSource.loop = values.loopActive;
        };
        this.loopBounds = function(data={start:0,end:1}){
            if(data==null||data==undefined){return data;}
            if(data.start!=null && data.start!=undefined){values.loopBounds.start=data.start}
            if(data.end!=null && data.end!=undefined){values.loopBounds.end=data.end}
            flow.bufferSource.loopStart = values.loopBounds.start;
            flow.bufferSource.loopEnd = values.loopBounds.end;
        };

        this.play = function(){
            if(values.startedAt!=-1 || !values.loaded){return;}
            loadBuffer(flow.track.buffer);
            flow.bufferSource.start(0,values.needlePosition);

            flow.bufferSource.loop = values.loopActive;
            flow.bufferSource.loopStart = values.loopBounds.start;
            flow.bufferSource.loopEnd = values.loopBounds.end;

            values.startedAt = context.currentTime-values.needlePosition;
            values.playing = true;
        };
        this.pause = function(callback){
            if(values.startedAt==-1){return;}
            flow.bufferSource.stop(0);
            if(callback){flow.bufferSource.onended = function(){callback();};}
            flow.bufferSource = undefined;
            values.needlePosition = context.currentTime-values.startedAt;
            values.startedAt = -1;
            values.playing = false;
        };
        this.stop = function(){
            this.pause();
            values.needlePosition = 0;
        };
        this.jumpTo_time = function(seconds){
            if(values.startedAt==-1){
                values.needlePosition = seconds;
                return;
            }

            var callback = function(){ values.needlePosition = seconds; };
            if(values.playing){
                callback = function(){
                    values.needlePosition = seconds;
                    values.itself.play();
                };
            }

            this.pause(callback);
        };
        this.jumpTo_percentage = function(percent){
            percent = (percent>1 ? 1 : percent);
            percent = (percent<0 ? 0 : percent);
            this.jumpTo_time(this.duration()*percent);
        };

        this.duration = function(){
            if(!values.loaded){return -1;}
            return flow.track.duration;
        };
        this.getCurrentTime = function(){
            if(!values.loaded){return -1;}
            if(values.startedAt == -1){ return values.needlePosition; }
            return context.currentTime-values.startedAt;
        };
        this.title = function(){
            return flow.track.name;
        };
        this.viewWaveformSegment = function(track,start=0,end=1){
            return [0,1,-1,0];
        };
};