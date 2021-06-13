class audioBuffer_3 extends AudioWorkletNode{
    // static wasm_url = 'wasm/audio_processing/audio_buffer_3.production.wasm';
    static wasm_url = 'wasm/audio_processing/audio_buffer_3.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 1; //rate
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'audioBuffer_3', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(audioBuffer_3, this);

        //instance state
            this._state = {
                loop: false,
                section: {
                    start: 0,
                    end: 1,
                },
            };

        //performance control
            this.play = function(){
                this.port.postMessage({command:'play', value:undefined});
            };
            this.pause = function(){
                this.port.postMessage({command:'pause', value:undefined});
            };
            this.return = function(){
                this.port.postMessage({command:'return', value:undefined});
            };

        //status
            this.getPosition = function(){
                console.log('node time:',  performance.now());
                this.port.postMessage({command:'getPosition', value:undefined});
            };

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    get loop(){
        return this._state.loop;
    }
    set loop(bool){
        this._state.loop = bool;
        this.port.postMessage({command:'loop', value:bool});
    }

    get section_start(){
        return this._state.section.start;
    }
    set section_start(position){
        this._state.section.start = position;
        this.port.postMessage({command:'section_start', value:position});
    }
    get section_end(){
        return this._state.section.end;
    }
    set section_end(position){
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