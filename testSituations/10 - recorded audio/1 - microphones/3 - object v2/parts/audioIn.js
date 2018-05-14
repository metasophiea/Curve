parts.audio.audioIn = function(
    context
){
    //flow chain
        var flow = {
            audioDevice: null,
            outAggregator: {}
        };

    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //output node
        this.out = function(){return flow.outAggregator.node;}

    //methods
        this.listDevices = function(callback){
            navigator.mediaDevices.enumerateDevices().then(
                function(devices){
                    callback(devices.filter((d) => d.kind === 'audioinput'));
                }
            );
        };
        this.selectDevice = function(deviceId){
            var promise = navigator.mediaDevices.getUserMedia({audio: { deviceId: deviceId}});
            promise.then(
                function(source){
                    audioDevice = source;
                    __globals.audio.context.createMediaStreamSource(source).connect(flow.outAggregator.node);                    
                },
                function(error){
                    console.warn('could not find audio input device: "' + deviceId + '"');
                    console.warn('\terror:',error);
                }
            );
        };

    //setup
        this.selectDevice('default');
};