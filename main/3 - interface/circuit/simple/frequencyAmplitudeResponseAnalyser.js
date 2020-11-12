this.frequencyAmplitudeResponseAnalyser = function(
    context
){
    const self = this;
    const frequencyAmplitudeResponseAnalyser = new _canvas_.library.audio.audioWorklet.production.only_js.frequencyAmplitudeResponseAnalyser(context);

    //input/output node
        this.producer = function(){ return frequencyAmplitudeResponseAnalyser; }
        this.consumer = function(){ return frequencyAmplitudeResponseAnalyser; }

    //controls
        this.start = function(){ frequencyAmplitudeResponseAnalyser.start(); };
        this.stop = function(){ frequencyAmplitudeResponseAnalyser.stop(); };
        this.clear = function(){ frequencyAmplitudeResponseAnalyser.clear(); };

        this.waveform = function(value){
            if(value == undefined){ return frequencyAmplitudeResponseAnalyser.waveform; }
            frequencyAmplitudeResponseAnalyser.waveform = value;
        };
        this.signalGeneratorGain = function(value){
            if(value == undefined){ return frequencyAmplitudeResponseAnalyser.signalGeneratorGain; }
            frequencyAmplitudeResponseAnalyser.signalGeneratorGain = value;
        };
        this.dutyCycle = function(value){
            if(value == undefined){ return frequencyAmplitudeResponseAnalyser.dutyCycle; }
            frequencyAmplitudeResponseAnalyser.dutyCycle = value;
        };
        this.range = function(start,end){
            if( start == undefined && end == undefined ){
                return frequencyAmplitudeResponseAnalyser.range;
            }
            frequencyAmplitudeResponseAnalyser.range = {
                start: start == undefined ? frequencyAmplitudeResponseAnalyser.range.start : start,
                end: end == undefined ? frequencyAmplitudeResponseAnalyser.range.end : end,
            };
        };
        this.stepSize = function(value){
            if(value == undefined){ return frequencyAmplitudeResponseAnalyser.stepSize; }
            frequencyAmplitudeResponseAnalyser.stepSize = value;
        };
        this.timePerStep = function(value){
            if(value == undefined){ return frequencyAmplitudeResponseAnalyser.timePerStep; }
            frequencyAmplitudeResponseAnalyser.timePerStep = value;
        };
        
    //callback
        frequencyAmplitudeResponseAnalyser.onValue = function(data){
            if(self.onValue != undefined){ self.onValue(data); }
        }
        frequencyAmplitudeResponseAnalyser.onCompletion = function(data){
            if(self.onCompletion != undefined){ self.onCompletion(data); }
        }
        this.onValue = function(){};
        this.onCompletion = function(){};
};