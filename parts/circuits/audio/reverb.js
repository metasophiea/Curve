this.reverbUnit = function(
    context,
){
    //flow chain
        var flow = {
            inAggregator: {},
            reverbGain: {}, bypassGain: {},
            reverbNode: {},
            outAggregator: {},
        };

    //inAggregator
        flow.inAggregator.gain = 1;
        flow.inAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //reverbGain / bypassGain
        flow.reverbGain.gain = 0.5;
        flow.bypassGain.gain = 0.5;
        flow.reverbGain.node = context.createGain();
        flow.bypassGain.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
        __globals.utility.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);

    //reverbNode
        flow.reverbNode.impulseResponseRepoURL = 'https://metasophiea.com/lib/audio/impulseResponse/';
        flow.reverbNode.selectedReverbType = 'Musikvereinsaal.wav';
        flow.reverbNode.node = context.createConvolver();

        function setReverbType(repoURL,type,callback){
            var ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open('GET', repoURL+type, true);
            ajaxRequest.responseType = 'arraybuffer';
            ajaxRequest.onload = function(){
                context.decodeAudioData(ajaxRequest.response, function(buffer) {flow.reverbNode.node.buffer = buffer;}, function(e){"Error with decoding audio data" + e.err});
                if(callback){callback();}  
            };
            ajaxRequest.send();
        }
        function getReverbTypeList(repoURL,callback=null){
            var ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open('GET', repoURL+'available2.list', true);
            ajaxRequest.onload = function() {
                var list = ajaxRequest.response.split('\n'); var temp = '';
                
                list[list.length-1] = list[list.length-1].split(''); 
                list[list.length-1].pop();
                list[list.length-1] = list[list.length-1].join('');		

                list.splice(-1,1);
                
                if(callback == null){console.log(list);}
                else{callback(list);}
            }
            ajaxRequest.send();
        }	

    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();    
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);

    //do connections
        flow.inAggregator.node.connect(flow.reverbGain.node);
        flow.inAggregator.node.connect(flow.bypassGain.node);
        flow.reverbGain.node.connect(flow.reverbNode.node);
        flow.bypassGain.node.connect(flow.outAggregator.node);
        flow.reverbNode.node.connect(flow.outAggregator.node);

    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}
    
    //controls
        this.getTypes = function(callback){ getReverbTypeList(flow.reverbNode.impulseResponseRepoURL, callback); };
        this.type = function(name,callback){
            if(name==null){return flow.reverbNode.selectedReverbType;}
            flow.reverbNode.selectedReverbType = name;
            setReverbType(flow.reverbNode.impulseResponseRepoURL, flow.reverbNode.selectedReverbType, callback);
        };
        this.outGain = function(a){
            if(a==null){return flow.outAggregator.gain;}
            flow.outAggregator.gain=a;
            __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
        };
        this.wetdry = function(a){
            if(a==null){return flow.reverbGain.gain;}
            flow.reverbGain.gain=a;
            flow.bypassGain.gain=1-a;
            __globals.utility.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
            __globals.utility.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);
        };

    //setup
        setReverbType(flow.reverbNode.impulseResponseRepoURL,flow.reverbNode.selectedReverbType);
};
