class audio_buffer_type_1 extends AudioWorkletNode{
    static wasm_url = 'wasm/audio_processing/audio_buffer_type_1.production.wasm';
    // static wasm_url = 'wasm/audio_processing/audio_buffer_type_1.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        const nodeConstructorTime = performance.now();

        //populate options
            options.numberOfInputs = 1; //rate
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'audio_buffer_type_1', options);

        //time sync
            this.nodeConstructorTime = nodeConstructorTime;
            this.port.postMessage({command:'log_nodeConstructorTime', value:this.nodeConstructorTime});

        //load wasm processor
            audio.audioWorklet.requestWasm(audio_buffer_type_1, this);

        //instance state
            this._state = {
                audioFileLength: undefined,
                loop: false,
                section: {
                    start: 0,
                    end: 1,
                },
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
            this.play = function(){
                this.port.postMessage({command:'play', value:undefined});
            };
            this.stop = function(){
                this.port.postMessage({command:'stop', value:undefined});
            };

            this.gotoStart = function(){
                this.port.postMessage({command:'go_to_start', value:undefined});
            };
            this.gotoEnd = function(){
                this.port.postMessage({command:'go_to_end', value:undefined});
            };

            this.maximizeSection = function(){
                this._state.section.start = 0
                this._state.section.end = this._state.audioFileLength;
                this.port.postMessage({command:'maximize_section', value:undefined});
            };
            this.invertSection = function(){
                const tmp = this._state.section.start
                this._state.section.start = this._state.section.end;
                this._state.section.end = tmp;
                this.port.postMessage({command:'invert_section', value:undefined});
            };

        //status
            let getPlayheadPosition_promiseResolve;
            this.getPlayheadPosition = function(calculateDelay=false){
                this.port.postMessage({
                    command:'getPlayheadPosition', 
                    value:{
                        calculateDelay: calculateDelay
                    },
                    sendTime:performance.now(),
                });
                return new Promise((resolve, reject) => {
                    getPlayheadPosition_promiseResolve = resolve;
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
                        if(getPlayheadPosition_promiseResolve != undefined){
                            if(event.data.value.sendingDelay == undefined) {
                                getPlayheadPosition_promiseResolve(event.data.value.playheadPosition);
                            } else {
                                const sendingDelay = (event.data.sendTime + nodeConstructorTime) - performance.now();
                                const completeDelay = event.data.value.sendingDelay + sendingDelay;
                                getPlayheadPosition_promiseResolve({playheadPosition:event.data.value, resultDelay:completeDelay});
                            }
                            getPlayheadPosition_promiseResolve = undefined;
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
    set playheadPosition(position){
        this.port.postMessage({command:'set_playhead_position', value:position});
    }

    get loop(){
        return this._state.loop;
    }
    set loop(bool){
        this._state.loop = bool;
        this.port.postMessage({command:'set_loop_active', value:bool});
    }

    get sectionStart(){
        return this._state.section.start;
    }
    set sectionStart(position){
        if(position > this._state.audioFileLength-1){
            console.warn("audio_buffer_type_1 - attempting to select a section start position \""+position+"\" which exceeds the audio data length \""+(this._state.audioFileLength-1)+"\". Position will be corrected");
            position = this._state.audioFileLength-1;
        }
        if(position < 0){
            console.warn("audio_buffer_type_1 - attempting to select a section start position below zero. Position will be corrected");
            position = 0;
        }

        this._state.section.start = position;

        this.port.postMessage({command:'section_start', value:position});
    }
    get sectionEnd(){
        return this._state.section.end;
    }
    set sectionEnd(position){
        if(position > this._state.audioFileLength-1){
            console.warn("audio_buffer_type_1 - attempting to select a section end position \""+position+"\" which exceeds the audio data length \""+(this._state.audioFileLength-1)+"\". Position will be corrected");
            position = this._state.audioFileLength-1;
        }
        if(position < 0){
            console.warn("audio_buffer_type_1 - attempting to select a section end position below zero. Position will be corrected");
            position = 0;
        }

        this._state.section.end = position;

        this.port.postMessage({command:'section_end', value:position});
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