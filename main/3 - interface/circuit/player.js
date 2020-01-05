this.player = function(context){
    dev.log.circuit('.player(-context-)'); //#development

    //state
        const self = this;
        const state = {
            fileLoaded:false,
            playhead:[], //{ position:n, lastSightingTime:n, playing,bool },
            loop:{ active:false, timeout:[] },
            rate:1,
            concurrentPlayCountLimit:1, //'-1' is infinite
            area:{ percentage_start:0, percentage_end:1, actual_start:0, actual_end:1 },
        };

        //flow
            //flow chain
            const flow = {
                track:{},
                bufferSource:[],
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
        function unloadRaw(){
            dev.log.circuit('.player::unloadRaw()'); //#development
            return flow.track;
        };
        function loadRaw(data,callback){
            dev.log.circuit('.player::loadRaw('+JSON.stringify(data)+','+callback+')'); //#development
            if(Object.keys(data).length === 0){return;}
            self.stop();
            flow.track = data;
            state.fileLoaded = true;
            state.playhead = [];
            self.area(state.area.percentage_start,state.area.percentage_end);
            callback(data);
        }
        function load(type,callback,url='',errorCallback){
            dev.log.circuit('.player::load('+type+','+callback+','+url+')'); //#development
            _canvas_.library.audio.loadAudioFile( function(data){ 
                state.fileLoaded = false;
                loadRaw(data,callback)
            }, type, url, errorCallback);
        }
        function generatePlayheadNumber(){
            dev.log.circuit('.player::unlogeneratePlayheadNumberadRaw()'); //#development
            let num = 0;
            while( Object.keys(state.playhead).includes(String(num)) && state.playhead[num] != undefined ){num++;}
            return num;
        }
        function playheadCompute(playhead){
            if(playhead == undefined){
                Object.keys(state.playhead).map(key => playheadCompute(parseInt(key)));
                return;
            }
            dev.log.circuit('.player::playheadCompute('+playhead+')'); //#development

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

            clearInterval(state.loop.timeout[playhead]);

            //update playhead position data
                const currentTime = self.currentTime(playhead);
                //(playhead must exist)
                    if(state.playhead[playhead] == undefined){return;}
                    state.playhead[playhead].position = currentTime;
                    state.playhead[playhead].lastSightingTime = context.currentTime;

            //obviously, if the loop isn't active or the file isn't playing, don't do any of the work
                if(!state.loop.active || !state.playhead[playhead].playing){return;}

            //calculate time until the timeout should be called
                let timeUntil = state.area.actual_end - currentTime;
                if(timeUntil < 0){timeUntil = 0;}
                dev.log.circuit('.player::playheadCompute -> timeUntil:'+timeUntil); //#development
                dev.log.circuit('.player::playheadCompute -> state.area.actual_end:'+state.area.actual_end+' currentTime:'+currentTime); //#development

            //the callback (which performs the jump to the start of the loop, and recomputes)
                state.loop.timeout[playhead] = setTimeout(
                    (function(playhead){
                        return function(){
                            jumpToTime(playhead,state.area.actual_start,true);
                            playheadCompute(playhead);
                        }
                    })(playhead),
                    (timeUntil*1000)/state.rate
                );
        }
        function jumpToTime(playhead=0,value,doNotActuallyAffectTheAudioBuffer=false){
            dev.log.circuit('.player::jumpToTime('+playhead+','+value+','+doNotActuallyAffectTheAudioBuffer+')'); //#development
            //check if we should jump at all
            //(file must be loaded and playhead must exist)
                if(!state.fileLoaded || state.playhead[playhead] == undefined){return;}

            //if playback is stopped; only adjust the playhead position
                if( !state.playhead[playhead].playing ){
                    state.playhead[playhead].position = value;
                    state.playhead[playhead].lastSightingTime = context.currentTime;
                    return;
                }

            //if loop is enabled, and the desired value is beyond the loop's end boundary,
            //set the value to the start value
                if(state.loop.active && value > state.loop.actual_end){value = state.loop.actual_start;}

            //stop playback, with a callback that will change the playhead position
            //and then restart playback
                if(doNotActuallyAffectTheAudioBuffer){
                    state.playhead[playhead].position = value;
                    state.playhead[playhead].lastSightingTime = context.currentTime;
                    return;
                }
                self.pause(playhead,
                    (function(playhead){
                        return function(){
                            state.playhead[playhead].position = value;
                            state.playhead[playhead].lastSightingTime = context.currentTime;
                            self.resume(playhead);
                        }
                    })(playhead)
                );
        }
        function rejigger(playhead){
            if(playhead == undefined){
                Object.keys(state.playhead).map(key => rejigger(parseInt(key)));
                return;
            }
            dev.log.circuit('.player::rejigger('+playhead+')'); //#development

            jumpToTime(playhead,state.playhead[playhead].position);
        }

    //controls
        this.concurrentPlayCountLimit = function(value){
            if(value == undefined){return state.concurrentPlayCountLimit;}
            dev.log.circuit('.player.concurrentPlayCountLimit('+value+')'); //#development

            state.concurrentPlayCountLimit = value;
            for(let a = value; a < state.playhead.length; a++){ this.stop(a); }
        };
    
        this.unloadRaw = function(){ 
            dev.log.circuit('.player.unloadRaw()'); //#development
            return unloadRaw(); 
        };
        this.loadRaw = function(data,callback){ 
            dev.log.circuit('.player.loadRaw('+data+','+callback+')'); //#development
            loadRaw(data,callback); 
        };
        this.load = function(type,callback,url='',errorCallback){ 
            dev.log.circuit('.player.load('+type+','+callback+','+url+')'); //#development
            load(type,callback,url,errorCallback); 
        };

        // this.generatePlayheadNumber = function(){ 
        //     dev.log.circuit('.player.generatePlayheadNumber()'); //#development
        //     return generatePlayheadNumber();
        // };

        this.start = function(playhead){
            dev.log.circuit('.player.start('+playhead+')'); //#development
            dev.log.circuit('.player.start -> state.playhead[playhead]: '+JSON.stringify(state.playhead[playhead])); //#development
            dev.log.circuit('.player.start -> state.loop.active: '+state.loop.active); //#development
            dev.log.circuit('.player.start -> play area'); //#development
            dev.log.circuit('.player.start -> - starting from: '+state.area.actual_start+' ('+(state.area.percentage_start*100)+'%)'); //#development
            dev.log.circuit('.player.start -> - playing until: '+state.area.actual_end+' ('+(state.area.percentage_end*100)+'%)'); //#development
            dev.log.circuit('.player.start -> state.rate: '+state.rate); //#development
            dev.log.circuit('.player.start -> state.concurrentPlayCountLimit: '+state.concurrentPlayCountLimit); //#development
            dev.log.circuit('.player.start -> state.playhead: '+JSON.stringify(state.playhead)); //#development

            //check if we should play at all (file must be loaded)
                if(!state.fileLoaded){return;}
            //if no particular playhead is selected, generate a new one
            //(unless we've already reached the concurrentPlayCountLimit)
                if(playhead == undefined){
                    if(state.concurrentPlayCountLimit != -1 && state.playhead.filter(() => true).length >= state.concurrentPlayCountLimit){ return -1; }

                    playhead = generatePlayheadNumber();
                    state.playhead[playhead] = { position:0, lastSightingTime:0 };
                    dev.log.circuit('.player.start -> playhead: '+playhead); //#development
                }
            //ensure that the playhead is after the start of the area
                if(state.playhead[playhead].position < state.area.actual_start){ state.playhead[playhead].position = state.area.actual_start; }
                if(state.playhead[playhead].position > state.area.actual_end){ state.playhead[playhead].position = state.area.actual_start; }
                dev.log.circuit('.player.start -> state.playhead[playhead].position: '+state.playhead[playhead].position); //#development
            //load buffer, enter settings and start from playhead position
                flow.bufferSource[playhead] = _canvas_.library.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter, (function(playhead){ return function(){self.stop(playhead);};})(playhead));
                flow.bufferSource[playhead].loop = state.loop.active;
                flow.bufferSource[playhead].loopStart = state.area.actual_start;
                flow.bufferSource[playhead].loopEnd = state.area.actual_end;
                flow.bufferSource[playhead].playbackRate.value = state.rate;
                flow.bufferSource[playhead].start( 
                    0, 
                    state.playhead[playhead].position, 
                    state.loop.active ? undefined : state.area.actual_end-state.playhead[playhead].position
                );
            //log the starting time, play state
                state.playhead[playhead].lastSightingTime = context.currentTime;
                state.playhead[playhead].playing = true;
                playheadCompute(playhead);
            //return the playhead number
                return playhead;
        };
        this.pause = function(playhead,callback){
            if(playhead == undefined){
                Object.keys(state.playhead).map(key => self.pause(parseInt(key)));
                return;
            }
            dev.log.circuit('.player.pause('+playhead+','+callback+')'); //#development

            //check if we should stop at all (player must be playing)
                if( state.playhead[playhead] == undefined || !state.playhead[playhead].playing ){return;}
            //log play state and run playheadCompute
                playheadCompute(playhead);
                state.playhead[playhead].playing = false;
            //actually stop the buffer and destroy it
                flow.bufferSource[playhead].onended = callback;
                flow.bufferSource[playhead].stop(0);
                delete flow.bufferSource[playhead];
        };
        this.resume = function(playhead){
            if(playhead == undefined){
                Object.keys(state.playhead).map(key => self.resume(parseInt(key)));
                return;
            }
            dev.log.circuit('.player.resume('+playhead+')'); //#development

            this.start(playhead);
        };
        this.stop = function(playhead,callback){
            if(playhead == undefined){
                Object.keys(state.playhead).map(key => self.stop(parseInt(key)));
                return;
            }
            dev.log.circuit('.player.stop('+playhead+','+callback+')'); //#development

            //check if we should stop at all (player must be playing)
                if( state.playhead[playhead] == undefined || !state.playhead[playhead].playing ){return;}
            //actually stop the buffer and destroy it
                flow.bufferSource[playhead].onended = callback;
                flow.bufferSource[playhead].stop(0);
                delete flow.bufferSource[playhead];
            //playheadCompute and delete playhead
                state.playhead[playhead].playing = false;
                playheadCompute(playhead);
                delete state.playhead[playhead];
        };
        this.restart = function(playhead){
            dev.log.circuit('.player.restart('+playhead+')'); //#development
            this.stop(playhead);
            this.start(playhead);
        };

        this.jumpTo = function(playhead=0,value=0,percentage=true){
            dev.log.circuit('.player.jumpTo('+playhead+','+value+','+percentage+')'); //#development
            if(percentage){
                value = (value>1 ? 1 : value);
                value = (value<0 ? 0 : value);
                jumpToTime(playhead,this.duration()*value);
            }else{
                jumpToTime(playhead,value);
            }
            playheadCompute(playhead);
        };
        this.area = function(start,end,percentage=true){
            if(start == undefined && end == undefined){ return state.area; }
            dev.log.circuit('.player.jumpTo('+start+','+end+','+percentage+')'); //#development
            if(start == undefined){ start = percentage ? state.area.percentage_start : state.area.actual_start; }
            if(end == undefined){ end = percentage ? state.area.percentage_end : state.area.actual_end; }

            if(percentage){
                state.area.percentage_start = start;
                state.area.percentage_end = end;
                state.area.actual_start = start*this.duration();
                state.area.actual_end = end*this.duration();
            }else{
                state.area.percentage_start = start/this.duration();
                state.area.percentage_end = end/this.duration();
                state.area.actual_start = start;
                state.area.actual_end = end;
            }

            playheadCompute();
            rejigger();

            return state.area;
        };
        this.loop = function(active){
            if(active == undefined){return state.loop.active;}
            dev.log.circuit('.player.loop('+active+')'); //#development

            state.loop.active = active;

            playheadCompute();
            rejigger();
        };
        this.rate = function(value){
            if(value == undefined){return state.rate;}
            dev.log.circuit('.player.rate('+value+')'); //#development

            playheadCompute();
            state.rate = value;
            flow.bufferSource.forEach(item => item.playbackRate.value = value);
            playheadCompute();
        };

        this.createPlayhead = function(position){
            dev.log.circuit('.player.createPlayhead('+position+')'); //#development
            if(state.concurrentPlayCountLimit != -1 && state.playhead.filter(() => true).length >= state.concurrentPlayCountLimit){ return -1; }

            playhead = generatePlayheadNumber();
            state.playhead[playhead] = { position:this.duration()*position, lastSightingTime:0 };
            dev.log.circuit('.player.createPlayhead -> playhead: '+playhead); //#development
        };

    //info
        this._printState = function(){console.log(state);};
        this.isLoaded = function(){return state.fileLoaded;};
        this.duration = function(){return !state.fileLoaded ? -1 : flow.track.duration;};
        this.title = function(){return !state.fileLoaded ? '' : flow.track.name;};
        this.currentTime = function(playhead){
            dev.log.circuit('.player.currentTime('+playhead+')'); //#development
            //check if file is loaded
                if(!state.fileLoaded){return -1;}
            //if no playhead is selected, do all of them
                if(playhead == undefined){ return Object.keys(state.playhead).map(key => self.currentTime(key)); }
            //if playback is stopped, return the playhead position, 
                dev.log.circuit('.player.currentTime -> state.playhead[playhead]: '+JSON.stringify(state.playhead[playhead])); //#development
                if(state.playhead[playhead] == undefined){return -1;}
                if(!state.playhead[playhead].playing){return state.playhead[playhead].position;}
            //otherwise, calculate the current position
                dev.log.circuit('.player.currentTime -> '+'state.playhead[playhead].position: '+state.playhead[playhead].position+' state.rate: '+state.rate+' context.currentTime: '+context.currentTime+' state.playhead[playhead].lastSightingTime: '+state.playhead[playhead].lastSightingTime); //#development
                dev.log.circuit('.player.currentTime -> time passed: '+(context.currentTime - state.playhead[playhead].lastSightingTime)); //#development
                dev.log.circuit('.player.currentTime -> file time passed: '+state.rate*(context.currentTime - state.playhead[playhead].lastSightingTime)); //#development
                dev.log.circuit('.player.currentTime -> playhead "'+playhead+'" position: '+(state.playhead[playhead].position + state.rate*(context.currentTime - state.playhead[playhead].lastSightingTime))); //#development
                return state.playhead[playhead].position + state.rate*(context.currentTime - state.playhead[playhead].lastSightingTime);
        };
        this.progress = function(playhead){
            dev.log.circuit('.player.progress('+playhead+')'); //#development
            //if no playhead is selected, do all of them
                if(playhead == undefined){ return Object.keys(state.playhead).map(key => self.progress(key)); }

            const time = this.currentTime(playhead);
            if(time == -1){return -1;}
            return time/this.duration();
        };
        this.waveformSegment = function(data={start:0,end:1},resolution){
            dev.log.circuit('.player.waveformSegment('+JSON.stringify(data)+','+resolution+')'); //#development
            if(data==undefined || !state.fileLoaded){return [];}
            return _canvas_.library.audio.waveformSegment(flow.track.buffer, data, resolution);
        };
};