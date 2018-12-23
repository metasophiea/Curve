this.audioIn = function(
    context, setupConnect=true
){
    //flow chain
        var flow = {
            audioDevice: null,
            outAggregator: {}
        };

    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();
        workspace.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain);


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
                    workspace.library.audio.context.createMediaStreamSource(source).connect(flow.outAggregator.node);                    
                },
                function(error){
                    console.warn('could not find audio input device: "' + deviceId + '"');
                    console.warn('\terror:',error);
                }
            );
        };
        this.gain = function(a){
            if(a==null){return flow.outAggregator.gain;}
            flow.outAggregator.gain = a;
            workspace.library.audio.changeAudioParam(context,flow.outAggregator.node.gain,a);
        };

    //setup
        if(setupConnect){this.selectDevice('default');}
};