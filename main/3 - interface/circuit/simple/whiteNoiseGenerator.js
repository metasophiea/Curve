this.whiteNoiseGenerator = function(
    context
){
    const audioWorklet = new _canvas_.library.audio.audioWorklet.whiteNoiseGenerator(context);
    this.out = function(){ return audioWorklet; }
};