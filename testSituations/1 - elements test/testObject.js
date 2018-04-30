function makeTestObject(x,y,debug=false){
    //set numbers
        var type = 'testObject';

    //main
        var _mainObject = parts.basic.g('testObject', x, y);
            _mainObject._type = type;

    //elements
        //backing
            var backing = parts.basic.rect(null, 0, 0, 335, 285, 0, 'fill:rgba(255,100,255,0.75)');
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeTestObject);

        //crazy square
            var crazySquare = parts.basic.rect('crazySquare', 5, 5, 30, 30, 0, 'fill:rgba(0,0,0,0.75)');
                _mainObject.append(crazySquare);
                crazySquare.change = function(){ this.style.fill = 'rgb('+Math.round(Math.random()*256)+','+Math.round(Math.random()*256)+','+Math.round(Math.random()*256)+')'; };
                crazySquare.onclick = function(){this.change();};
                crazySquare.onwheel = function(event){ this.setAttribute('y',parseFloat(this.getAttribute('y')) - ( event.deltaY < 0 ? 1 : -1)); };

        //control
            var Vslide = parts.control.slide_vertical('Vslide', 5, 40, 10, 120);
                if(debug){console.log( 'single vertical slide', Vslide, Object.keys(Vslide));}
                _mainObject.append(Vslide);
                Vslide.onChange = function(data){ _mainObject.io.data_main.send('Vslide',data); };
            var VslidePanel = parts.control.slidePanel_vertical('Vslidz', 20, 40, 100, 120, 10);
                if(debug){console.log( 'vertical slide panel', VslidePanel, Object.keys(VslidePanel));}
                _mainObject.append(VslidePanel);
                for(var a = 0; a < 10; a++){ VslidePanel.slide(a).set( 1-1/(a+1)  ); }
                VslidePanel.onChange = function(data){_mainObject.io.data_main.send('VslidePanel',data);};

            var Hslide = parts.control.slide_horizontal('Hslide', 5, 165, 115, 10);
                if(debug){console.log( 'single horizontal slide', Hslide, Object.keys(Hslide));}
                _mainObject.append(Hslide);
                Hslide.onChange = function(data){ _mainObject.io.data_main.send('Hslide',data); };
            var HslidePanel = parts.control.slidePanel_horizontal('Hslidz', 5, 180, 115, 100, 10);
                if(debug){console.log( 'horizontal slide panel', HslidePanel, Object.keys(HslidePanel));}
                _mainObject.append(HslidePanel);
                for(var a = 0; a < 10; a++){ HslidePanel.slide(a).set( 1-1/(a+1)  ); }   
                HslidePanel.onChange = function(data){_mainObject.io.data_main.send('HslidePanel',data);};


            var Cdial = parts.control.dial_continuous('Cdial', 70, 22.5, 12);
            if(debug){console.log( 'continuous dial', Cdial, Object.keys(Cdial));}
                _mainObject.append(Cdial);
                Cdial.onChange = function(data){_mainObject.io.data_main.send('Cdial',data);};

            var Ddial = parts.control.dial_discrete('Ddial', 105, 22.5, 12);
            if(debug){console.log( 'discrete dial', Ddial, Object.keys(Ddial));}
                _mainObject.append(Ddial);
                Ddial.onChange = function(data){_mainObject.io.data_main.send('Ddial',data);};

        //display
            var glowbox = parts.display.glowbox_rect(null, 120, 5, 10, 10, 0 );
                if(debug){console.log( 'Rectangular Glowbox8350/smsuts', glowbox, Object.keys(glowbox));}
                _mainObject.append(glowbox);

            var label = parts.display.label('mainlabel', 125, 20, 'Hello', 'fill:rgba(0,0,0,1); font-size:14px; font-family:Courier New;');
                if(debug){console.log( 'Label', label, Object.keys(label));}
                _mainObject.append(label);
                label.text('_mainObject');

            var graph = parts.display.grapher('maingraph', 125, 30, 100, 100);
            if(debug){console.log( 'Grapher', graph, Object.keys(graph));}
                _mainObject.append(graph);
                graph._test();

            var grapher_periodicWave = parts.display.grapher_periodicWave('scope', 125, 135, 100, 100);
                if(debug){console.log( 'Grapher - Periodic Wave', grapher_periodicWave, Object.keys(grapher_periodicWave));}
                _mainObject.append(grapher_periodicWave);
                grapher_periodicWave.waveElement('sin',1,1);
                grapher_periodicWave.draw();

            var button_rect = parts.control.button_rect('button_rect', 220, 5, 20, 20);
                if(debug){console.log( 'Rectangular Button', button_rect, Object.keys(button_rect));}
                _mainObject.append(button_rect);
                button_rect.onclick = function(){_mainObject.io.data_main.send('button_rect');};
            var checkbox_rect = parts.control.checkbox_rect('checkbox_rect', 245, 5, 20, 20);
                if(debug){console.log( 'Rectangular Checkbox', checkbox_rect, Object.keys(checkbox_rect));}
                _mainObject.append(checkbox_rect);
                checkbox_rect.onChange = function(){_mainObject.io.data_main.send('checkbox_rect', checkbox_rect.get());};
            var key_rect = parts.control.key_rect('key_rect', 270, 5, 20, 20);
                if(debug){console.log( 'Rectangular Key', key_rect, Object.keys(key_rect));}
                _mainObject.append(key_rect);
                key_rect.onkeydown = function(){_mainObject.io.data_main.send('key_rect',true);};
                key_rect.onkeyup = function(){_mainObject.io.data_main.send('key_rect',false);};

            var rastorgrid = parts.control.rastorgrid('rastorgrid', 230, 135, 100, 100, 4, 4);
                if(debug){console.log( 'Rastorgrid', rastorgrid, Object.keys(rastorgrid));}
                _mainObject.append(rastorgrid);
                rastorgrid.onChange = function(){_mainObject.io.data_main.send('rastorgrid', rastorgrid.get());};

    //dynamic
        //connection nodes
            _mainObject.io = {};
            _mainObject.io.data_a = parts.dynamic.connectionNode_data('_mainObject.io.data_a',230,30,30,30);
            _mainObject.io.data_b = parts.dynamic.connectionNode_data('_mainObject.io.data_b',300,30,30,30);
                if(debug){console.log( 'ConnectionNode - Data', _mainObject.io.data_a, Object.keys(_mainObject.io.data_a));}
                _mainObject.append(_mainObject.io.data_a);
                _mainObject.append(_mainObject.io.data_b);
                
            _mainObject.io.audio_a = parts.dynamic.connectionNode_audio('_mainObject.io.audio_a',1,230,65,30,30,__globals.audio.context);
            _mainObject.io.audio_b = parts.dynamic.connectionNode_audio('_mainObject.io.audio_b',0,300,65,30,30,__globals.audio.context);
                if(debug){console.log( 'ConnectionNode - Audio', _mainObject.io.audio_a, Object.keys(_mainObject.io.audio_a));}
                _mainObject.append(_mainObject.io.audio_a);
                _mainObject.append(_mainObject.io.audio_b);

            _mainObject.io.data_main = parts.dynamic.connectionNode_data('_mainObject.io.data_main',230,100,30,30);
                _mainObject.append(_mainObject.io.data_main);
            _mainObject.io.data_main.receive = function(address, data){
                switch(address){
                    case 'Vslide': Vslide.set(data,true,false); break;
                    case 'Hslide': Hslide.set(data,false); break;
                    case 'VslidePanel': VslidePanel.set(data,false,false); break;
                    case 'HslidePanel': HslidePanel.set(data,false); break;
                    case 'Cdial': Cdial.set(data,false,false); break;
                    case 'Ddial': Ddial.select(data,false,false); break;
                    case 'button_rect': grapher_periodicWave.reset(); Cdial.smoothSet(1,1,'s',false); Vslide.smoothSet(1,1,'linear',false); Hslide.smoothSet(1,1,'sin',false); VslidePanel.smoothSetAll(1,1,'cos',false); HslidePanel.smoothSetAll(1,1,'exponential',false); break;
                    case 'checkbox_rect': checkbox_rect.set(data,false); break;
                    case 'key_rect': if(data){key_rect.glow();glowbox.on();} else{key_rect.dim();glowbox.off();} break;
                    case 'rastorgrid': rastorgrid.set(data,false); break;
                }
            };

    return _mainObject;
}