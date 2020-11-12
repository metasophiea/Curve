this.momentaryAmplitudeMeter = function(
    context
){
    const self = this;

    const momentaryAmplitudeMeter = new _canvas_.library.audio.audioWorklet.production.only_js.momentaryAmplitudeMeter(context);
    
    //io
        this.in = function(){ return momentaryAmplitudeMeter; }

    //methods
        this.fullSample = function(bool){
            if(bool == undefined){ return momentaryAmplitudeMeter.fullSample; }
            momentaryAmplitudeMeter.fullSample = bool;
        };
        this.updateMode = function(bool){
            if(bool == undefined){ return momentaryAmplitudeMeter.updateMode; }
            momentaryAmplitudeMeter.updateMode = bool;
        };
        this.updateDelay = function(value){
            if(value == undefined){ return momentaryAmplitudeMeter.updateDelay; }
            momentaryAmplitudeMeter.updateDelay = value;
        };
        this.calculationMode = function(mode){
            if(mode == undefined){ return momentaryAmplitudeMeter.calculationMode; }
            momentaryAmplitudeMeter.calculationMode = mode;
        };

    //callback
        this.reading = function(){};
        momentaryAmplitudeMeter.reading = function(data){
            if(self.reading != undefined){
                self.reading(data);
            }
        };
};