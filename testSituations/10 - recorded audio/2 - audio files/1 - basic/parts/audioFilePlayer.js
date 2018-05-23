parts.audio.audioFilePlayer = function(
    context,
){
    //flow chain
        var flow = {
            audioBuffers:[],
            bufferSource:{},
            channelSplitter:{},
            leftOut:{}, rightOut:{}
        };


    //channelSplitter
        flow.channelSplitter = context.createChannelSplitter(2);

    //leftOut
        flow.leftOut.gain = 1;
        flow.leftOut.node = context.createGain();
        flow.leftOut.node.gain.setTargetAtTime(flow.leftOut.gain, context.currentTime, 0);
        flow.channelSplitter.connect(flow.leftOut.node, 0);
    //rightOut
        flow.rightOut.gain = 1;
        flow.rightOut.node = context.createGain();
        flow.rightOut.node.gain.setTargetAtTime(flow.rightOut.gain, context.currentTime, 0);
        flow.channelSplitter.connect(flow.rightOut.node, 1);


    //output node
        this.out_left  = function(){return flow.leftOut.node;}
        this.out_right = function(){return flow.rightOut.node;}
    
    //controls
        this.play = function(){
            flow.bufferSource = context.createBufferSource();
            flow.bufferSource.buffer = flow.audioBuffers[1];
            flow.bufferSource.connect(flow.channelSplitter);
            flow.bufferSource.start(0);
        }
        this.loadFile = function(URL,slot){
            var request = new XMLHttpRequest();
                request.open('GET', URL, true);
                request.responseType = 'arraybuffer';
                request.onload = function() {
                    context.decodeAudioData(this.response, function(data) {
                        flow.audioBuffers[slot] = data;
                    }, function(e){"Error with decoding audio data" + e.err});
                }
                request.send();
        };
        this._loadBuffer = function(bufferData,slot){
            flow.audioBuffers[slot] = bufferData;
        };

    //setup
        this.loadFile('http://metasophiea.com/apps/partyCalculator/tracks/4-piano_02.wav',0);
        this.loadFile('https://upload.wikimedia.org/wikipedia/commons/d/d7/16_-_Alexandra_02.ogg',1);
        this.loadFile('https://upload.wikimedia.org/wikipedia/en/7/7a/Penny_Lane_%28Beatles_song_-_sample%29.ogg',2);
        this.loadFile('https://upload.wikimedia.org/wikipedia/commons/transcoded/7/70/Exploration_mélodique_sur_les_accords_de_Tenderly_%28Exploration%29-en_wav.wav/Exploration_mélodique_sur_les_accords_de_Tenderly_%28Exploration%29-en_wav.wav.ogg',3);
        // this.loadFile('file:///na-homes/brandon/Downloads/Speaker%20-%20Headphones.mp3',1);
};