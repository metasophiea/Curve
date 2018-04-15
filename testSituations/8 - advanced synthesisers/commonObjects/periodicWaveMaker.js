__globals.objects.make_periodicWaveMaker = function(x,y){
    //set numbers
        var type = 'periodicWaveMaker';
        var attributes = {
            factors: 16
        };
        var shape = {
            base: [[0,0],[250,0],[250,110],[0,110]],
            connector: { width: 20, height: 20 },
            graph: {x:5, y:5, width:100, height:100},
            slidePanel_sin: {x:110, y:5, width: 100, height:47.5, count: attributes.factors},
            slidePanel_cos: {x:110, y:57.5, width: 100, height:47.5, count: attributes.factors},
            resetButton: {x: 215, y: 5, width: 30, height: 20},
            randomButton: {x: 215, y: 30, width: 30, height: 20},
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            button: {
                up: 'fill:rgba(175,175,175,1)',
                hover: 'fill:rgba(220,220,220,1)',
                down: 'fill:rgba(150,150,150,1)'
            },
        };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.generateSelectionArea(shape.base, _mainObject);

        //waveport
        var graph = parts.display.grapher_periodicWave(null, shape.graph.x, shape.graph.y, shape.graph.width, shape.graph.height);
            _mainObject.append(graph);

        //sliders
        var slidePanel_sin = parts.control.slidePanel_vertical(null, shape.slidePanel_sin.x, shape.slidePanel_sin.y, shape.slidePanel_sin.width, shape.slidePanel_sin.height, shape.slidePanel_sin.count);
            _mainObject.append(slidePanel_sin);
        var slidePanel_cos = parts.control.slidePanel_vertical(null, shape.slidePanel_cos.x, shape.slidePanel_cos.y, shape.slidePanel_cos.width, shape.slidePanel_cos.height, shape.slidePanel_cos.count);
            _mainObject.append(slidePanel_cos);

        //resetButton
        var resetButton = parts.control.button_rect('resetButton', shape.resetButton.x, shape.resetButton.y, shape.resetButton.width, shape.resetButton.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(resetButton);
            resetButton.onclick = function(){ reset(); sendWave(); }

        //randomButton
        var randomButton = parts.control.button_rect('randomButton', shape.randomButton.x, shape.randomButton.y, shape.randomButton.width, shape.randomButton.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(randomButton);
            randomButton.onclick = function(){ randomSettings(4); }

    //connection nodes
    _mainObject.io = {};

    _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2][1]-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
        _mainObject.prepend(_mainObject.io.out);

    //internal workings
        function sendWave(){
            _mainObject.io.out.send('periodicWave', graph.wave());
        }
        function reset(){
            graph.wave({'sin':[],'cos':[]});
            graph.draw();

            slidePanel_sin.setAll(0.5);
            slidePanel_cos.setAll(0.5);
        }

        slidePanel_sin.onChange = function(wave){
            //adjust values
            var newWave = []
            for(var a = 0; a < wave.length; a++){
                newWave[a] = wave[a]*2 - 1;
            }

            //prepend that pesky leading value
            newWave.unshift(0);

            //push the wave to the graph
            graph.wave(newWave,'sin');
            graph.draw();

            //send the wave data out
            sendWave();
        };

        slidePanel_cos.onChange = function(wave){
            //adjust values
            var newWave = [];
            for(var a = 0; a < wave.length; a++){
                newWave[a] = wave[a]*2 - 1;
            }

            //prepend that pesky leading value
            newWave.unshift(0);

            //push the wave to the graph
            graph.wave(newWave,'cos');
            graph.draw();

            //send the wave data out
            sendWave();
        };

        function normalizeArray(array){
            var biggestIndex = 0;
            for(var a = 1; a < array.length; a++){
                if( Math.abs(array[a]) > Math.abs(array[biggestIndex]) ){
                    biggestIndex = a;
                }
            }

            var mux = Math.abs(1/array[biggestIndex]);

            for(var a = 0; a < array.length; a++){
                array[a] = array[a]*mux;
            } 

            return array;
        }
        function randomSettings(depth){
            //input checking
            depth = depth > attributes.factors? attributes.factors : depth;

            //generate random value arrays
            var sinArray = [];
            var cosArray = [];
            for(var a = 0; a < depth; a++){
                sinArray.push(Math.random()*2-1);
                cosArray.push(Math.random()*2-1);
            }

            //normalize arrays
            sinArray = normalizeArray(sinArray);
            cosArray = normalizeArray(cosArray);

            for(var a = 0; a < depth; a++){ 
                //attempt to keep the waves within the viewport
                sinArray[a] = sinArray[a]/depth;
                cosArray[a] = cosArray[a]/depth;

                //push these setting to the sliders
                sinArray[a] = sinArray[a]/2 + 0.5;
                cosArray[a] = cosArray[a]/2 + 0.5;
            }

            //push to sliders (which will push to the graph)
            slidePanel_sin.set(sinArray);
            slidePanel_cos.set(cosArray);
        }
        _mainObject.random = function(depth){
            randomSettings(depth);
        };
        
    //setup
        reset();
            
    return _mainObject;
};