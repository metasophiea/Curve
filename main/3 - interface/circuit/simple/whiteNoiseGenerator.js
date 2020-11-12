this.whiteNoiseGenerator = function(
    context
){
    const audioWorklet = new _canvas_.library.audio.audioWorklet.production.only_js.whiteNoiseGenerator(context);
    this.out = function(){ return audioWorklet; }
};