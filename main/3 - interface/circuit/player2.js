this.player2 = function(context){
    //state
        var self = this;
        var debugMode = false;
        var state = {
            fileLoaded:false,
            playhead:[], //{ position:n, lastSightingTime:n, playing,bool },
            loop:{ active:false, timeout:[] },
            rate:1,
            concurrentPlayCountLimit:1, //'-1' is infinite
            area:{ percentage_start:0, percentage_end:1, actual_start:0, actual_end:1 },
        };

        //flow
            //flow chain
            var flow = {
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
        function unloadRaw(){ return flow.track; };
        function loadRaw(data,callback){
            if(Object.keys(data).length === 0){return;}
            self.stop();
            flow.track = data;
            state.fileLoaded = true;
            state.playhead = [];
            self.area(state.area.percentage_start,state.area.percentage_end);
            callback(data);
        }
        function load(type,callback,url=''){
            state.fileLoaded = false;
            _canvas_.library.audio.loadAudioFile( function(data){ loadRaw(data,callback) }, type, url);
        }
        function generatePlayheadNumber(){
            var num = 0;
            while( Object.keys(state.playhead).includes(String(num)) && state.playhead[num] != undefined ){num++;}
            return num;
        }
        function playheadCompute(playhead){
            if(debugMode){console.log('playheadCompute::playhead:',playhead);}
            if(playhead == undefined){
                Object.keys(state.playhead).map(key => playheadCompute(parseInt(key)));
                return;
            }

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
                var currentTime = self.currentTime(playhead);
                state.playhead[playhead].position = currentTime;
                state.playhead[playhead].lastSightingTime = context.currentTime;

            //obviously, if the loop isn't active or the file isn't playing, don't do any of the work
                if(!state.loop.active || !state.playhead[playhead].playing){return;}

            //calculate time until the timeout should be called
                var timeUntil = state.area.actual_end - currentTime;
                if(timeUntil < 0){timeUntil = 0;}
                if(debugMode){
                    console.log('playheadCompute::timeUntil:',timeUntil);
                    console.log('\t\t(state.area.actual_end',state.area.actual_end,'currentTime',currentTime,')');
                }

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
            if(debugMode){console.log('jumpToTime::playhead:',playhead,'value:',value);}
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

            jumpToTime(playhead,state.playhead[playhead].position);
        }

    //controls
        this.concurrentPlayCountLimit = function(value){
            if(value == undefined){return state.concurrentPlayCountLimit;}

            state.concurrentPlayCountLimit = value;
            for(var a = value; a < state.playhead.length; a++){ this.stop(a); }
        };
    
        this.unloadRaw = function(){ return unloadRaw(); };
        this.loadRaw = function(data,callback){ loadRaw(data,callback); };
        this.load = function(type,callback,url=''){ load(type,callback,url); };

        this.generatePlayheadNumber = function(){ return generatePlayheadNumber(); };

        this.start = function(playhead){
            if(debugMode){
                console.log('start::playhead:',playhead);
                if(playhead != undefined){ console.log('\t\tstate.playhead[playhead]:',state.playhead[playhead]); }
                console.log('\t\tstate.loop.active:',state.loop.active);
                console.log('\t\tplay area');
                console.log('\t\t\tstaring from:',state.area.actual_start,'('+(state.area.percentage_start*100)+'%)');
                console.log('\t\t\tplaying until:',state.area.actual_end,'('+(state.area.percentage_end*100)+'%)');
                console.log('\t\tstate.rate:',state.rate);
                console.log('\t\tstate.concurrentPlayCountLimit:',state.concurrentPlayCountLimit);
                console.log('\t\tstate.playhead:',state.playhead);
                console.log('\t\t----');
            }

            //check if we should play at all (file must be loaded)
                if(!state.fileLoaded){return;}
            //if no particular playhead is selected, generate a new one
            //(unless we've already reached the concurrentPlayCountLimit)
                if(playhead == undefined){
                    if(state.concurrentPlayCountLimit != -1 && state.playhead.filter(() => true).length >= state.concurrentPlayCountLimit){ return -1; }

                    playhead = this.generatePlayheadNumber();
                    state.playhead[playhead] = { position:0, lastSightingTime:0 };
                    if(debugMode){ console.log('\t\tplayhead:',playhead); }
                }
            //ensure that the playhead is after the start of the area
                if(state.playhead[playhead].position < state.area.actual_start){ state.playhead[playhead].position = state.area.actual_start; }
                if(state.playhead[playhead].position > state.area.actual_end){ state.playhead[playhead].position = state.area.actual_start; }
                if(debugMode){ console.log('\t\tstate.playhead[playhead].position:',state.playhead[playhead].position); }
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

            this.start(playhead);
        };
        this.stop = function(playhead,callback){
            if(playhead == undefined){
                Object.keys(state.playhead).map(key => self.stop(parseInt(key)));
                return;
            }

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
            this.stop(playhead);
            this.start(playhead);
        };

        this.jumpTo = function(playhead=0,value=0,percentage=true){
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

            state.loop.active = active;

            playheadCompute();
            rejigger();
        };
        this.rate = function(value){
            if(value == undefined){return state.rate;}

            playheadCompute();
            state.rate = value;
            flow.bufferSource.forEach(item => item.playbackRate.value = value);
            playheadCompute();
        };

        this.createPlayhead = function(position){
            if(state.concurrentPlayCountLimit != -1 && state.playhead.filter(() => true).length >= state.concurrentPlayCountLimit){ return -1; }

            playhead = this.generatePlayheadNumber();
            state.playhead[playhead] = { position:this.duration()*position, lastSightingTime:0 };
            if(debugMode){ console.log('\t\tplayhead:',playhead); }
        };

    //info
        this._printState = function(){console.log(state);};
        this.isLoaded = function(){return state.fileLoaded;};
        this.duration = function(){return !state.fileLoaded ? -1 : flow.track.duration;};
        this.title = function(){return !state.fileLoaded ? '' : flow.track.name;};
        this.currentTime = function(playhead){
            if(debugMode){
                console.log('\ncurrentTime::playhead:',playhead);
            }
            //check if file is loaded
                if(!state.fileLoaded){return -1;}
            //if no playhead is selected, do all of them
                if(playhead == undefined){ return Object.keys(state.playhead).map(key => self.currentTime(key)); }
            //if playback is stopped, return the playhead position, 
                if(debugMode){console.log('currentTime::state.playhead[playhead]:',state.playhead[playhead]);}
                if( state.playhead[playhead] == undefined){return -1;}
                if(!state.playhead[playhead].playing){return state.playhead[playhead].position;}
            //otherwise, calculate the current position
                if(debugMode){console.log('\t\t(',
                    'state.playhead[playhead].position:',state.playhead[playhead].position,
                    'state.rate:',state.rate,
                    'context.currentTime:',context.currentTime,
                    'state.playhead[playhead].lastSightingTime:',state.playhead[playhead].lastSightingTime,
                    ')');
                    console.log( 
                        'time passed:',(context.currentTime - state.playhead[playhead].lastSightingTime),
                        'file time passed:',state.rate*(context.currentTime - state.playhead[playhead].lastSightingTime),
                    );
                    console.log('playhead "'+playhead+'" position:',state.playhead[playhead].position + state.rate*(context.currentTime - state.playhead[playhead].lastSightingTime));
                }
                return state.playhead[playhead].position + state.rate*(context.currentTime - state.playhead[playhead].lastSightingTime);
        };
        this.progress = function(playhead){
            //if no playhead is selected, do all of them
                if(playhead == undefined){ return Object.keys(state.playhead).map(key => self.progress(key)); }

            var time = this.currentTime(playhead);
            if(time == -1){return -1;}
            return time/this.duration();
        };
        this.waveformSegment = function(data={start:0,end:1},resolution){
            if(data==undefined || !state.fileLoaded){return [];}
            return _canvas_.library.audio.waveformSegment(flow.track.buffer, data, resolution);
        };
};