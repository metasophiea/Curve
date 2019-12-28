this.recorder = function(context){

    //state
        const state = {
            recordedChunks: [],
            recordingStartTime: -1,
            recordingLength: 0,
        };

    //flow
        //flow chain
            const flow = {
                leftIn:{}, rightIn:{},
                recordingNode:{},
                leftOut:{}, rightOut:{},
            };

        //leftIn
            flow.leftIn.node = context.createAnalyser();
        //rightIn
            flow.rightIn.node = context.createAnalyser();

        //recordingNode
            flow.recordingNode.audioDest = new MediaStreamAudioDestinationNode(context);
            flow.recordingNode.node = new MediaRecorder(flow.recordingNode.audioDest.stream, {mimeType : 'audio/webm'});

            flow.recordingNode.node.onstart = function(){};
            flow.recordingNode.node.ondataavailable = function(e){
                state.recordedChunks.push(e.data);
            };
            flow.recordingNode.node.onpause = function(){};
            flow.recordingNode.node.onresume = function(){};
            flow.recordingNode.node.onerror = function(error){console.log(error);};
            flow.recordingNode.node.onstop = function(){};

            flow.leftIn.node.connect(flow.recordingNode.audioDest);
            flow.rightIn.node.connect(flow.recordingNode.audioDest);

        //leftOut
            flow.leftOut.node = context.createAnalyser();
            flow.leftIn.node.connect(flow.leftOut.node);
        //rightIn
            flow.rightOut.node = context.createAnalyser();
            flow.rightIn.node.connect(flow.rightOut.node);


    //internal functions
        function getRecordingLength(){
            switch(flow.recordingNode.node.state){
                case 'inactive': case 'paused':
                    return state.recordingLength;
                break;
                case 'recording':
                    return context.currentTime - state.recordingStartTime;
                break;
            }            
        }

    //controls
        this.clear =  function(){
            this.stop();
            state.recordedChunks = [];
            state.recordingStartTime = -1;
            state.recordingLength = 0;
        };
        this.start =  function(){
            this.clear();
            flow.recordingNode.node.start();
            state.recordingStartTime = context.currentTime;
        };
        this.pause =  function(){
            if(this.state() == 'inactive'){return;}
            state.recordingLength = getRecordingLength();
            flow.recordingNode.node.pause();
        };
        this.resume = function(){
            flow.recordingNode.node.resume();
            state.recordingStartTime = context.currentTime - state.recordingLength;
        };
        this.stop =   function(){
            if(this.state() == 'inactive'){return;}
            state.recordingLength = getRecordingLength();
            flow.recordingNode.node.stop();
        };
        this.export = function(){
            return new Blob(state.recordedChunks, { type: 'audio/ogg; codecs=opus' });
        };
        this.save = function(filename='output'){
            const a = document.createElement('a');
            a.href = URL.createObjectURL(this.export());
            a.download = filename+'.ogg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        this.state = function(){return flow.recordingNode.node.state;};
        this.recordingTime = function(){
            return getRecordingLength();
        };
        this.getTrack = function(){return this.export(); };

    //io
        this.in_left  =  function(){return flow.leftIn.node;};
        this.in_right =  function(){return flow.rightIn.node;};
        this.out_left  = function(){return flow.leftOut.node;};
        this.out_right = function(){return flow.rightOut.node;};
};
