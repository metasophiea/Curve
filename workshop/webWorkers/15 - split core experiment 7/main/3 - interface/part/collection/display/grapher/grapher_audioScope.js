this.grapher_audioScope = function(
    name='grapher_audioScope',
    x, y, width=120, height=60, angle=0, static=false, resolution=5, 

    foregroundStyle={colour:{r:0,g:1,b:0,a:1}, thickness:0.5},
    foregroundTextStyle={colour:{r:0.39,g:1,b:0.39,a:1}, size:7.5, font:'Helvetica'},

    backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
    backgroundStyle_lineThickness=0.25,
    backgroundTextStyle_fill={r:0,g:0.59,b:0,a:1},
    backgroundTextStyle_size=0.1,
    backgroundTextStyle_font='Helvetica',

    backingStyle={r:0.2,g:0.2,b:0.2,a:1},
){
    //attributes
        const attributes = {
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
            var grapher = interfacePart.builder('display','grapher',name,{
                x:0, y:0, width:width, height:height, static:static, resolution:resolution,
                foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                backgroundStyle_colour:backgroundStyle_colour, 
                backgroundStyle_lineThickness:backgroundStyle_lineThickness,
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
            grapher.drawForeground(numbers);
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

    return(object);
};

interfacePart.partLibrary.display.grapher_audioScope = function(name,data){ 
    return interfacePart.collection.display.grapher_audioScope(
        name, data.x, data.y, data.width, data.height, data.angle, data.static, data.resolution,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); 
};