this.grapher_periodicWave = function(
    id='grapher_periodicWave',
    x, y, width, height,
    graphType='Canvas',
    foregroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    foregroundTextStyle='fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //elements 
    var object = part.builder('g',id,{x:x, y:y});
        object._data = {};
        object._data.wave = {'sin':[],'cos':[]};
        object._data.resolution = 500;

    //main graph
        var grapher = part.builder('grapher'+graphType, 'graph', {
            x:0, y:0, width:width, height:height,
            style:{
                foreground:foregroundStyle, foregroundText:foregroundTextStyle, 
                background:backgroundStyle, backgroundText:backgroundTextStyle, 
                backing:backingStyle
            }
        });
        object.append(grapher);


    //methods
    object.wave = function(a=null,type=null){
        if(a==null){
            while(this._data.wave.sin.length < this._data.wave.cos.length){ this._data.wave.sin.push(0); }
            while(this._data.wave.sin.length > this._data.wave.cos.length){ this._data.wave.cos.push(0); }
            for(var a = 0; a < this._data.wave['sin'].length; a++){
                if( !this._data.wave['sin'][a] ){ this._data.wave['sin'][a] = 0; }
                if( !this._data.wave['cos'][a] ){ this._data.wave['cos'][a] = 0; }
            }
            return this._data.wave;
        }

        if(type==null){
            this._data.wave = a;
        }
        switch(type){
            case 'sin': this._data.wave.sin = a; break;
            case 'cos': this._data.wave.cos = a; break;
            default: break;
        }
    }
    object.waveElement = function(type, mux, a){
        if(a==null){return this._data.wave[type][mux];}
        this._data.wave[type][mux] = a;
    }
    object.resolution = function(a=null){
        if(a==null){return this._data.resolution;}
        this._data.resolution = a;
    }
    object.updateBackground = function(){
        grapher.viewbox( {'l':-1.1,'h':1.1} );
        grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:false});
        grapher.verticalMarkings({points:[0,'1/4','1/2','3/4'],printText:false});
        grapher.drawBackground();
    };
    object.draw = function(){
        var data = [];
        var temp = 0;
        for(var a = 0; a <= this._data.resolution; a++){
            temp = 0;
            for(var b = 0; b < this._data.wave['sin'].length; b++){
                if(!this._data.wave['sin'][b]){this._data.wave['sin'][b]=0;} // cover missing elements
                temp += Math.sin(b*(2*Math.PI*(a/this._data.resolution)))*this._data.wave['sin'][b]; 
            }
            for(var b = 0; b < this._data.wave['cos'].length; b++){
                if(!this._data.wave['cos'][b]){this._data.wave['cos'][b]=0;} // cover missing elements
                temp += Math.cos(b*(2*Math.PI*(a/this._data.resolution)) )*this._data.wave['cos'][b]; 
            }
            data.push(temp);
        }

        grapher.draw( data );
    }
    object.reset = function(){
        this.wave({'sin':[],'cos':[]});
        this.resolution(500);
        this.updateBackground();
        this.draw();
    }


    object.reset();
    return object;
};