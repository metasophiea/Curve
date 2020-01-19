const audio = this;

//master context
    this.context = new (window.AudioContext || window.webkitAudioContext)();


    

//destination
    this.destination = this.context.createGain();
    this.destination.connect(this.context.destination);
    this.destination._gain = 1;
    this.destination.masterGain = function(value){
        dev.log.audio('.masterGain(',value); //#development
        dev.count('.audio.masterGain'); //#development

        if(value == undefined){return this.destination._gain;}
        this._gain = value;
        library.audio.changeAudioParam(library.audio.context, this.gain, this._gain, 0.01, 'instant', true);
    };

{{include:conversion.js}}
{{include:utility.js}}
{{include:audioWorklet/main.js}}