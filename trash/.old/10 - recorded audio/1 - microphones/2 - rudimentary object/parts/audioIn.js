parts.audio.audioIn = function(
    context
){
    //flow chain
        var flow = {
            audioDevice: null,
            outAggregator: {}
        };
    
    //audioDevice
        navigator.mediaDevices.enumerateDevices().then(
            function(source){
                audioDevices_in = source.filter((d) => d.kind === 'audioinput')
                if(audioDevices_in.length == 0){console.log('no audio input devices available!');}
                else{
                    navigator.mediaDevices.getUserMedia({audio: { deviceId: audioDevices_in[0].deviceId}}).then(
                        function(source){
                            audioDevice = source;
                            __globals.audio.context.createMediaStreamSource(source).connect(flow.outAggregator.node);                    
                        }
                    );
                }
            }
        );
    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //output node
        this.out = function(){return flow.outAggregator.node;}
};