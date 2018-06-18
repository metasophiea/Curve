parts.audio.audioDisk1 = function(){
    var blob = null;

    this.load = function(data){blob = data;};
    this.read = function(){return blob;};
    this.erase = function(){blobl = null;};
};