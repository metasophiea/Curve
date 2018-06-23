parts.audio.recorder1 = function(context){

    //state
        var state = {
            recordedChunks: [],
        };

    //flow
        //flow chain
        var flow = {
            leftIn:{}, rightIn:{},
            recordingNode:{},
            leftOut:{}, rightOut:{},
        };

        //leftIn
            flow.leftIn.node = __globals.audio.context.createStereoPanner();
            flow.leftIn.node.pan.setTargetAtTime(1, __globals.audio.context.currentTime, 0);
        //rightIn
            flow.rightIn.node = __globals.audio.context.createStereoPanner();
            flow.rightIn.node.pan.setTargetAtTime(-1, __globals.audio.context.currentTime, 0);

        //recordingNode
            flow.recordingNode.audioDest = new MediaStreamAudioDestinationNode(context);
            flow.recordingNode.node = new MediaRecorder(flow.recordingNode.audioDest.stream);

            flow.recordingNode.node.onstart = function(){
                console.log("recorder started");

            };
            flow.recordingNode.node.ondataavailable = function(e){
                console.log(e);
                state.recordedChunks.push(e.data);
            };
            flow.recordingNode.node.onstop = function(){
                console.log("recorder stopped");
                var blob = new Blob(state.recordedChunks, { 'type' : 'audio/ogg; codecs=opus' });
                var a = document.createElement('a');
                var file = new Blob([data]);
                a.href = URL.createObjectURL(blob);
                a.download = 'output.ogg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

            flow.leftIn.node.connect(flow.recordingNode.audioDest);
            flow.rightIn.node.connect(flow.recordingNode.audioDest);

        //leftOut
            flow.leftOut.gain = 1;
            flow.leftOut.node = context.createGain();
            flow.leftOut.node.gain.setTargetAtTime(flow.leftOut.gain, context.currentTime, 0);
        //rightOut
            flow.rightOut.gain = 1;
            flow.rightOut.node = context.createGain();
            flow.rightOut.node.gain.setTargetAtTime(flow.rightOut.gain, context.currentTime, 0);

            flow.leftIn.node.connect(flow.leftOut.node);
            flow.rightIn.node.connect(flow.rightOut.node);

    //internal functions
    //controls
        this.start = function(){
            flow.recordingNode.node.start();
        };
        this.stop = function(){
            flow.recordingNode.node.stop();
        };
        this.save = function(){

        };
    //info
    //io
        this.in_left  =  function(){return flow.leftIn.node;};
        this.in_right =  function(){return flow.rightIn.node;};
        this.out_left  = function(){return flow.leftOut.node;};
        this.out_right = function(){return flow.rightOut.node;};
};