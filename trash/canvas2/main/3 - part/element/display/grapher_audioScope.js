this.grapher_audioScope = function(
    name='grapher_audioScope',
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
    //attributes
        var attributes = {
            analyser:{
                analyserNode: canvas.library.audio.context.createAnalyser(),
                timeDomainDataArray: null,
                frequencyData: null,
                refreshRate: 10,
                scopeRefreshInterval: null,
                returnedValueLimits: {min:0, max: 256, halfdiff:128},
            },
            graph:{
                resolution: 256
            }
        };
        attributes.analyser.analyserNode.fftSize = attributes.graph.resolution;
        attributes.analyser.timeDomainDataArray = new Uint8Array(attributes.analyser.analyserNode.fftSize);
        attributes.analyser.frequencyData = new Uint8Array(attributes.analyser.analyserNode.fftSize);

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

    //utility functions
        function render(){
            var numbers = [];
            attributes.analyser.analyserNode.getByteTimeDomainData(attributes.analyser.timeDomainDataArray);
            for(var a = 0; a < attributes.analyser.timeDomainDataArray.length; a++){
                numbers.push(
                    attributes.analyser.timeDomainDataArray[a]/attributes.analyser.returnedValueLimits.halfdiff - 1
                );
            }
            grapher.draw(numbers);
        }
        function setBackground(){
            grapher.viewbox( {'l':-1.1,'h':1.1} );
            grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:false});
            grapher.verticalMarkings({points:[-0.25,-0.5,-0.75,0,0.25,0.5,0.75],printText:false});
            grapher.drawBackground();
        };

    //controls
        object.start = function(){
            if(attributes.analyser.scopeRefreshInterval == null){
                attributes.analyser.scopeRefreshInterval = setInterval(function(){render();},1000/attributes.analyser.refreshRate);
            }
        };
        object.stop = function(){
            clearInterval(attributes.analyser.scopeRefreshInterval);
            attributes.analyser.scopeRefreshInterval = null;
        };
        object.getNode = function(){return attributes.analyser.analyserNode;};
        object.resolution = function(res=null){
            if(res==null){return attributes.graph.resolution;}
            attributes.graph.resolution = res;
            this.stop();
            this.start();
        };
        object.refreshRate = function(a){
            if(a==null){return attributes.analyser.refreshRate;}
            attributes.analyser.refreshRate = a;
            this.stop();
            this.start();
        };

    //setup
        setBackground();

    return object;
};