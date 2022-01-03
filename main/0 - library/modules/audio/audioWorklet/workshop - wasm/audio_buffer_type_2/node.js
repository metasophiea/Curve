class audio_buffer_type_2 extends AudioWorkletNode{
    // static wasm_url = 'wasm/audio_processing/audio_buffer_type_2.production.wasm';
    static wasm_url = 'wasm/audio_processing/audio_buffer_type_2.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        const nodeConstructorTime = performance.now();

        //populate options
            options.numberOfInputs = 1; //rate
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'audio_buffer_type_2', options);

        //time sync
            this.nodeConstructorTime = nodeConstructorTime;
            this.port.postMessage({command:'log_nodeConstructorTime', value:this.nodeConstructorTime});

        //load wasm processor
            audio.audioWorklet.requestWasm(audio_buffer_type_2, this);

        //instance state
            this._state = {
                audioFileLength: undefined,
                loop: [],
                section: [],
            };
        
        //load data
            let loadAudioData_promiseResolve;
            this.loadAudioData = function(audioData){
                let maximize = this._state.section.start == 0 && this._state.section.end == this._state.audioFileLength;
                this._state.audioFileLength = audioData.length;
                if(maximize || this._state.audioFileLength < this._state.section.start && this._state.audioFileLength < this._state.section.end){
                    this._state.section.start = 0;
                    this._state.section.end = this._state.audioFileLength;
                }
                if(this._state.audioFileLength < this._state.section.start){ this._state.section.start = this._state.audioFileLength; }
                if(this._state.audioFileLength < this._state.section.end){ this._state.section.end = this._state.audioFileLength; }
    
                this.port.postMessage({command:'loadAudioData', value:audioData});

                return new Promise((resolve, reject) => {
                    loadAudioData_promiseResolve = resolve;
                });
            };

        //performance control
            this.play = function(playheadId){
                this.port.postMessage({command:'play', value:{playhead_id:playheadId}});
            };
            this.stop = function(playheadId){
                this.port.postMessage({command:'stop', value:{playhead_id:playheadId}});
            };

            this.loop = function(playheadId, active){
                if(playheadId == undefined && active == undefined){
                    return this._state.loop;
                }else if(active == undefined){
                    return this._state.loop[playheadId];
                }

                if(playheadId == undefined){
                    this._state.loop = this._state.loop.map(() => active);
                } else {
                    this._state.loop[playheadId] = active;
                }

                this.port.postMessage({command:'set_loop_active', value:{playhead_id:playheadId, loop_active:active}});
            };
            this.setPlayheadPosition = function(playheadId, position){
                if(position == undefined){
                    console.error('audio_buffer_type_2.set_playhead_position - position undefined');
                    return;
                }

                this.port.postMessage({command:'set_playhead_position', value:{playhead_id:playheadId, position:position}});
            };

            this.gotoStart = function(playheadId){
                this.port.postMessage({command:'go_to_start', value:{playhead_id:playheadId}});
            };
            this.gotoEnd = function(playheadId){
                this.port.postMessage({command:'go_to_end', value:{playhead_id:playheadId}});
            };

            this.sectionStart = function(playheadId, position){
                if(position > this._state.audioFileLength-1){
                    console.warn("audio_buffer_type_2.section_start - attempting to select a section start position \""+position+"\" which exceeds the audio data length \""+(this._state.audioFileLength-1)+"\". Position will be corrected");
                    position = this._state.audioFileLength-1;
                }
                if(position < 0){
                    console.warn("audio_buffer_type_2.section_start - attempting to select a section start position below zero. Position will be corrected");
                    position = 0;
                }

                if(playheadId == undefined){
                    for(let a = 0; a < this._state.section.length; a++){
                        this._state.section[a].start = position;
                    }
                } else {
                    if(this._state.section[playheadId] == undefined) {
                        this._state.section[playheadId] = {
                            start: position,
                            end: this._state.audioFileLength-1
                        };
                    }
                    this._state.section[playheadId].start = position;
                }

                this.port.postMessage({command:'section_start', value:{playhead_id:playheadId, position:position}});
            };
            this.sectionEnd = function(playheadId, position){
                if(position > this._state.audioFileLength-1){
                    console.warn("audio_buffer_type_2.section_end - attempting to select a section end position \""+position+"\" which exceeds the audio data length \""+(this._state.audioFileLength-1)+"\". Position will be corrected");
                    position = this._state.audioFileLength-1;
                }
                if(position < 0){
                    console.warn("audio_buffer_type_2.section_end - attempting to select a section end position below zero. Position will be corrected");
                    position = 0;
                }

                if(playheadId == undefined){
                    for(let a = 0; a < this._state.section.length; a++){
                        this._state.section[a].end = position;
                    }
                } else {
                    if(this._state.section[playheadId] == undefined) {
                        this._state.section[playheadId] = {
                            start: 0,
                            end: position
                        };
                    }
                    this._state.section[playheadId].end = position;
                }

                this.port.postMessage({command:'section_end', value:{playhead_id:playheadId, position:position}});
            };

            this.maximizeSection = function(playheadId){
                if(playheadId == undefined){
                    for(let a = 0; a < this._state.section.length; a++){
                        this._state.section[a].start = 0;
                        this._state.section[a].end = this._state.audioFileLength;
                    }
                } else {
                    this._state.section[playheadId].start = 0;
                    this._state.section[playheadId].end = this._state.audioFileLength;
                }

                this.port.postMessage({command:'maximize_section', value:{playhead_id:playheadId}});
            };
            this.invertSection = function(playheadId){
                if(playheadId == undefined){
                    for(let a = 0; a < this._state.section.length; a++){
                        const tmp = this._state.section[a].start
                        this._state.section[a].start = this._state.section[a].end;
                        this._state.section[a].end = tmp;
                    }
                } else {
                    const tmp = this._state.section[playheadId].start
                    this._state.section[playheadId].start = this._state.section[playheadId].end;
                    this._state.section[playheadId].end = tmp;
                }

                this.port.postMessage({command:'invert_section', value:{playhead_id:playheadId}});
            };

        //status
            let getPlayheadPosition_promiseResolve = [];
            this.getPlayheadPosition = function(playheadId, calculateDelay=false){
                if(typeof playheadId != "number"){
                    console.error('audio_buffer_type_2.getPlayheadPosition - playheadId not a number');
                    return;
                }

                this.port.postMessage({
                    command:'getPlayheadPosition', 
                    value:{
                        playhead_id: playheadId,
                        calculateDelay: calculateDelay
                    },
                    sendTime:performance.now(),
                });
                return new Promise((resolve, reject) => {
                    getPlayheadPosition_promiseResolve[playheadId] = resolve;
                });
            };

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };

        //callbacks
            this.onEnd = function(){ /*console.log('onEnd!');*/ };
            this.onLoop = function(){ /*console.log('onLoop!');*/ };

        //setup message receiver
            const self = this;
            this.port.onmessage = function(event){
                switch(event.data.command){
                    case 'onEnd': self.onEnd(event.data.value); break;
                    case 'onLoop': self.onLoop(event.data.value); break;
                    case 'getPlayheadPosition_return':
                        if(getPlayheadPosition_promiseResolve[event.data.value.playhead_id] != undefined){
                            if(event.data.value.sendingDelay == undefined) {
                                getPlayheadPosition_promiseResolve[event.data.value.playhead_id](event.data.value.playheadPosition);
                            } else {
                                const sendingDelay = (event.data.sendTime + nodeConstructorTime) - performance.now();
                                const completeDelay = event.data.value.sendingDelay + sendingDelay;
                                getPlayheadPosition_promiseResolve[event.data.value.playhead_id]({playheadPosition:event.data.value, resultDelay:completeDelay});
                            }
                            getPlayheadPosition_promiseResolve[event.data.value.playhead_id] = undefined;
                        }
                    break;
                    case 'loadAudioData_loadComplete':
                        loadAudioData_promiseResolve();
                        loadAudioData_promiseResolve = undefined;
                    break;
                }
            };
    }

    get length(){
        return this._state.audioFileLength;
    }

    get rate(){
        return this.parameters.get('rate');
    }
    get rate_useControl(){
        return this._state.rate_useControl;
    }
    set rate_useControl(bool){
        this._state.rate_useControl = bool;
        this.port.postMessage({command:'rate_useControl', value:bool});
    }
}