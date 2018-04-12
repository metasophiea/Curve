function makeTestObject(x,y){
    var _mainObject = parts.basic.g('testObject', x, y);
        // parts.modifier.makeUnselectable(_mainObject);

    var backing = parts.basic.rect(null, 0, 0, 335, 285, 0, 'fill:rgba(255,100,255,0.75)');
        _mainObject.append(backing);
        backing = parts.modifier.bestowMovement(backing, backing.parentElement);

    var crazySquare = parts.basic.rect('crazySquare', 5, 5, 30, 30, 0, 'fill:rgba(0,0,0,0.75)');
        _mainObject.append(crazySquare);
        crazySquare.change = function(){ this.style.fill = 'rgb('+Math.round(Math.random()*256)+','+Math.round(Math.random()*256)+','+Math.round(Math.random()*256)+')'; };
        crazySquare.onclick = function(){this.change();};
        crazySquare.onwheel = function(event){ this.setAttribute('y',parseFloat(this.getAttribute('y')) - ( event.deltaY < 0 ? 1 : -1)); };

    var moveableRect = parts.basic.rect('moveableRect', 40, 5, 10, 30, 0, 'fill:rgba(200,200,200,1);');
        _mainObject.append(moveableRect);
        parts.modifier.bestowMovement(moveableRect);



    var connectionNode_data_main = parts.dynamic.connectionNode_data('connectionNode_data_main',230,100,30,30);
        _mainObject.append(connectionNode_data_main);



    var Vslide = parts.control.slide_vertical('Vslide', 5, 40, 10, 120);
        console.log( 'single vertical slide', Vslide, Object.keys(Vslide));
        _mainObject.append(Vslide);
        Vslide.onChange = function(data){ connectionNode_data_main.send('Vslide',data); };
    var VslidePanel = parts.control.slidePanel_vertical('Vslidz', 20, 40, 100, 120, 10);
        console.log( 'vertical slide panel', VslidePanel, Object.keys(VslidePanel));
        _mainObject.append(VslidePanel);
        for(var a = 0; a < 10; a++){ VslidePanel.slide(a).set( 1-1/(a+1)  ); }
        VslidePanel.onChange = function(data){connectionNode_data_main.send('VslidePanel',data);};

    var Hslide = parts.control.slide_horizontal('Hslide', 5, 165, 115, 10);
        console.log( 'single horizontal slide', Hslide, Object.keys(Hslide));
        _mainObject.append(Hslide);
        Hslide.onChange = function(data){ connectionNode_data_main.send('Hslide',data); };
    var HslidePanel = parts.control.slidePanel_horizontal('Hslidz', 5, 180, 115, 100, 10);
        console.log( 'horizontal slide panel', HslidePanel, Object.keys(HslidePanel));
        _mainObject.append(HslidePanel);
        for(var a = 0; a < 10; a++){ HslidePanel.slide(a).set( 1-1/(a+1)  ); }   
        HslidePanel.onChange = function(data){connectionNode_data_main.send('HslidePanel',data);};


    var Cdial = parts.control.dial_continuous('Cdial', 70, 22.5, 12);
        console.log( 'continuous dial', Cdial, Object.keys(Cdial));
        _mainObject.append(Cdial);
        Cdial.onChange = function(data){connectionNode_data_main.send('Cdial',data);};

    var Ddial = parts.control.dial_discrete('Ddial', 105, 22.5, 12);
        console.log( 'discrete dial', Ddial, Object.keys(Ddial));
        _mainObject.append(Ddial);
        Ddial.onChange = function(data){connectionNode_data_main.send('Ddial',data);};


    var label = parts.display.label('mainlabel', 125, 20, 'Hello', 'fill:rgba(0,0,0,1); font-size:14px; font-family:Courier New;');
        console.log( 'Label', label, Object.keys(label));
        _mainObject.append(label);
        label.text('_mainObject');


    var graph = parts.display.grapher('maingraph', 125, 30, 100, 100);
        console.log( 'Grapher', graph, Object.keys(graph));
        _mainObject.append(graph);
        graph._test();


    var grapher_periodicWave = parts.display.grapher_periodicWave('scope', 125, 135, 100, 100);
        console.log( 'Grapher - Periodic Wave', grapher_periodicWave, Object.keys(grapher_periodicWave));
        _mainObject.append(grapher_periodicWave);
        grapher_periodicWave.waveElement('sin',1,1);
        grapher_periodicWave.draw();


    var button_rect = parts.control.button_rect('button_rect', 220, 5, 20, 20);
        console.log( 'Rectangular Button', button_rect, Object.keys(button_rect));
        _mainObject.append(button_rect);
        button_rect.onclick = function(){connectionNode_data_main.send('button_rect');};
    var checkbox_rect = parts.control.checkbox_rect('checkbox_rect', 245, 5, 20, 20);
        console.log( 'Rectangular Checkbox', checkbox_rect, Object.keys(checkbox_rect));
        _mainObject.append(checkbox_rect);
        checkbox_rect.onChange = function(){connectionNode_data_main.send('checkbox_rect', checkbox_rect.get());};
    var key_rect = parts.control.key_rect('key_rect', 270, 5, 20, 20);
        console.log( 'Rectangular Key', key_rect, Object.keys(key_rect));
        _mainObject.append(key_rect);
        key_rect.onmousedown = function(){connectionNode_data_main.send('key_rect',true);};
        key_rect.onmouseup = function(){connectionNode_data_main.send('key_rect',false);};

    var rastorgrid = parts.control.rastorgrid('rastorgrid', 230, 135, 100, 100, 4, 4);
        console.log( 'Rastorgrid', rastorgrid, Object.keys(rastorgrid));
        _mainObject.append(rastorgrid);
        rastorgrid.onChange = function(){connectionNode_data_main.send('rastorgrid', rastorgrid.get());};






    var connectionNode_data_a = parts.dynamic.connectionNode_data('connectionNode_data_a',230,30,30,30);
        console.log( 'ConnectionNode - Data', connectionNode_data_a, Object.keys(connectionNode_data_a));
        _mainObject.append(connectionNode_data_a);
    var connectionNode_data_b = parts.dynamic.connectionNode_data('connectionNode_data_b',300,30,30,30);
        _mainObject.append(connectionNode_data_b);
        
    var connectionNode_audio_a = parts.dynamic.connectionNode_audio('connectionNode_audio_a',1,230,65,30,30,__globals.audio.context);
        console.log( 'ConnectionNode - Audio', connectionNode_audio_a, Object.keys(connectionNode_audio_a));
        _mainObject.append(connectionNode_audio_a);
    var connectionNode_audio_b = parts.dynamic.connectionNode_audio('connectionNode_audio_b',0,300,65,30,30,__globals.audio.context);
        _mainObject.append(connectionNode_audio_b);

    _mainObject.movementRedraw = function(){
        connectionNode_data_a.redraw();
        connectionNode_audio_a.redraw();
        connectionNode_data_main.redraw();
    };

    connectionNode_data_main.receive = function(address, data){
        switch(address){
            case 'Vslide': Vslide.set(data,false); break;
            case 'Hslide': Hslide.set(data,false); break;
            case 'VslidePanel': VslidePanel.set(data,false); break;
            case 'HslidePanel': HslidePanel.set(data,false); break;
            case 'Cdial': Cdial.set(data,false); break;
            case 'Ddial': Ddial.select(data,false); break;
            case 'button_rect': grapher_periodicWave.reset(); break;
            case 'checkbox_rect': checkbox_rect.set(data,false); break;
            case 'key_rect': if(data){key_rect.glow();} else{key_rect.dim();} break;
            case 'rastorgrid': rastorgrid.set(data,false); break;
        }
    };

    return _mainObject;
}