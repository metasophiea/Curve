this.grapher_audioScope = function(
    id='grapher_audioScope',
    x, y, width, height,
    graphType='Canvas',
    foregroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    foregroundTextStyle='fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //attributes
        var attributes = {
            analyser:{
                analyserNode: system.audio.context.createAnalyser(),
                timeDomainDataArray: null,
                frequencyData: null,
                refreshRate: 30,
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

    //internal functions
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

    //setup
        setBackground();

    return object;
};