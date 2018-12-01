this.grapher_periodicWave = function(
    name='grapher_periodicWave',
    x, y, width=120, height=60, angle=0,

    foregroundStyle={stroke:'rgba(0,255,0,1)', lineWidth:0.5, lineJoin:'round'},
    foregroundTextStyle={fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},

    backgroundStyle_stroke='rgba(0,100,0,1)',
    backgroundStyle_lineWidth=0.25,
    backgroundTextStyle_fill='rgba(0,150,0,1)',
    backgroundTextStyle_size=0.1,
    backgroundTextStyle_font='Helvetica',

    backingStyle='rgba(50,50,50,1)',
){
    var wave = {'sin':[],'cos':[]};
    var resolution = 100;

    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        //grapher
            var grapher = canvas.part.builder('grapher',name,{
                x:0, y:0, width:width, height:height,
                foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                backgroundStyle_stroke:backgroundStyle_stroke, 
                backgroundStyle_lineWidth:backgroundStyle_lineWidth,
                backgroundTextStyle_fill:backgroundTextStyle_fill, 
                backgroundTextStyle_size:backgroundTextStyle_size,
                backgroundTextStyle_font:backgroundTextStyle_font,
                backingStyle:backingStyle,
            });
            object.append(grapher);

    //controls
        object.wave = function(a=null,type=null){
            if(a==null){
                while(wave.sin.length < wave.cos.length){ wave.sin.push(0); }
                while(wave.sin.length > wave.cos.length){ wave.cos.push(0); }
                for(var a = 0; a < wave['sin'].length; a++){
                    if( !wave['sin'][a] ){ wave['sin'][a] = 0; }
                    if( !wave['cos'][a] ){ wave['cos'][a] = 0; }
                }
                return wave;
            }

            if(type==null){
                wave = a;
            }
            switch(type){
                case 'sin': wave.sin = a; break;
                case 'cos': wave.cos = a; break;
                default: break;
            }
        };
        object.waveElement = function(type, mux, a){
            if(a==null){return wave[type][mux];}
            wave[type][mux] = a;
        };
        object.resolution = function(a=null){
            if(a==null){return resolution;}
            resolution = a;
        };
        object.updateBackground = function(){
            grapher.viewbox( {bottom:-1.1,top:1.1, left:0} );
            grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:true});
            grapher.verticalMarkings({points:[0,1/4,1/2,3/4],printText:true});
            grapher.drawBackground();
        };
        object.draw = function(){
            var data = [];
            var temp = 0;
            for(var a = 0; a <= resolution; a++){
                temp = 0;
                for(var b = 0; b < wave['sin'].length; b++){
                    if(!wave['sin'][b]){wave['sin'][b]=0;} // cover missing elements
                    temp += Math.sin(b*(2*Math.PI*(a/resolution)))*wave['sin'][b]; 
                }
                for(var b = 0; b < wave['cos'].length; b++){
                    if(!wave['cos'][b]){wave['cos'][b]=0;} // cover missing elements
                    temp += Math.cos(b*(2*Math.PI*(a/resolution)) )*wave['cos'][b]; 
                }
                data.push(temp);
            }
    
            grapher.draw( data );
        };
        object.reset = function(){
            this.wave({'sin':[],'cos':[]});
            this.resolution(100);
            this.updateBackground();
        };
        
    return object;
};