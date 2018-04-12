parts.dynamic.datatype_musicalNote = function(
    tone, duration=1, force=1
){
    var frequency = typeof tone == 'number' ? tone : __globals.audio.getFreq(tone);
    var name = typeof tone == 'string' ? tone : __globals.audio.getName(tone);

    this.frequency = function(a){
        if(!a){return frequency;}
        frequency=a;
        name=__globals.audio.getName(a);};
    this.name = function(a){
        if(!a){return name;}
        name=a;
        frequency=__globals.audio.getFreq(a);
    };
    this.force = function(a){if(!a){return force;}force=a;};
    this.duration = function(a){if(!a){return duration;}duration=a;};
};