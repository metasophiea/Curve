this.grapher_audioScope_static = function(
    name='grapher_audioScope_static',
    x, y, width=120, height=60, angle=0,

    foregroundStyle={colour:{r:0,g:1,b:0,a:1}, thickness:0.5},
    foregroundTextStyle={colour:{r:0.39,g:1,b:0.39,a:1}, size:7.5, font:'Helvetica'},

    backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
    backgroundStyle_lineThickness=0.5,
    backgroundTextStyle_fill={r:0,g:0.59,b:0,a:1},
    backgroundTextStyle_size=0.1,
    backgroundTextStyle_font='Helvetica',

    backingStyle={r:0.2,g:0.2,b:0.2,a:1},
){
    //attributes
        var attributes = {
            analyser:{
                analyserNode: _canvas_.library.audio.context.createAnalyser(),
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
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //grapher
            var grapher = interfacePart.builder('display','grapher_static',name,{
                x:0, y:0, width:width, height:height,
                style:{
                    foregrounds:[foregroundStyle], foregroundText:[foregroundTextStyle],
                    background_colour:backgroundStyle_colour, 
                    background_lineThickness:backgroundStyle_lineThickness,
                    backgroundText_fill:backgroundTextStyle_fill, 
                    backgroundText_size:backgroundTextStyle_size,
                    backgroundText_font:backgroundTextStyle_font,
                    backing:backingStyle,
                }
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