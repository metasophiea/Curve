this.testObject = function(x,y,a){
    var design = {
        name: 'testObject',
        category:'misc',
        collection: 'alpha',
        x:x, y:y, a:a,
        space: [
            {x:-5,y:-5}, 
            {x:65,y:-5}, 
            {x:65,y:5}, 
            {x:290,y:5}, 
            {x:290,y:40}, 
            {x:615,y:40}, 
            {x:615,y:130}, 
            {x:715,y:130}, 
            {x:715,y:220}, 
            {x:255,y:220}, 
            {x:255,y:335}, 
            {x:440,y:335}, 
            {x:440,y:445}, 
            {x:-5,y:455}
        ],
        // spaceOutline: true,
        elements:[
            //basic
                {type:'rectangle', name:'testRectangle', data:{ x:5, y:5, width:30, height:30, style:{fill:'rgba(255,0,0,1)'} }},
                {type:'circle', name:'testCircle', data:{ x:20, y:55, r:15 }},
                {type:'image', name:'testImage', data:{ x:40, y:40, width:30, height:30, url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg' } }, 
                {type:'polygon', name:'testPolygon', data:{ points:[{x:55,y:5}, {x:70,y:35}, {x:40,y:35}], style:{ fill:'rgba(0,255,0,1)' } } }, 
                {type:'text', name:'testText', data:{ x:7.5, y:95, text:'Hello', style:{font:'20pt Arial', fill:'rgba(150,150,255,1)' } } }, 
                {type:'path', name:'testPath', data:{ points:[{x:0,y:0},{x:0,y:90},{x:2.5,y:90},{x:2.5,y:72.5},{x:75,y:72.5}] }}, 
            //display
                {type:'glowbox_rect', name:'test_glowbox_rect', data:{x:90,y:0}},
                {type:'sevenSegmentDisplay', name:'test_sevenSegmentDisplay', data:{x:125,y:0}},
                {type:'sixteenSegmentDisplay', name:'test_sixteenSegmentDisplay', data:{x:150,y:0}},
                {type:'readout_sixteenSegmentDisplay', name:'test_readout_sixteenSegmentDisplay', data:{x:175,y:0}},
                {type:'level', name:'test_level1', data:{x:90, y:35}},
                {type:'meter_level', name:'test_meterLevel1', data:{x:115, y:35}},
                {type:'audio_meter_level', name:'test_audioMeterLevel1', data:{x:140, y:35}},
                {type:'rastorDisplay', name:'test_rastorDisplay1', data:{x:165, y:35}},
                {type:'grapher', name:'test_grapher1', data:{x:230, y:35}},
                {type:'grapher_periodicWave', name:'test_grapher_periodicWave1', data:{x:355, y:35}},
                {type:'grapher_audioScope', name:'test_grapher_audioScope1', data:{x:480, y:35}},
            //control
                {type:'slide', name:'test_slide1', data:{x:0,y:110}},
                {type:'slidePanel', name:'test_slidePanel1', data:{x:15,y:110}},
                {type:'slide', name:'test_slide2', data:{x:0,y:220,angle:-Math.PI/2}},
                {type:'slidePanel', name:'test_slidePanel2', data:{x:0,y:305,angle:-Math.PI/2}},
                {type:'rangeslide', name:'test_rangeslide1', data:{x:100,y:110}},
                {type:'rangeslide', name:'test_rangeslide2', data:{x:100,y:220,angle:-Math.PI/2}},
                {type:'dial_continuous', name:'test_dial_continuous1', data:{x:130,y:125}},
                {type:'dial_discrete', name:'test_dial_discrete1', data:{x:170,y:125}},
                {type:'button_rect', name:'test_button_rect1', data:{x:115,y:145}},
                {type:'list', name:'test_list1', data:{x:185,y:225,list:[
                    'space',
                    { text_left:'item1',  text_centre:'', text_right:'', function:function(){console.log('item1 function');} },
                    { text_left:'item2',  text_centre:'', text_right:'', function:function(){console.log('item2 function');} },
                    { text_left:'item3',  text_centre:'', text_right:'', function:function(){console.log('item3 function');} },
                    { text_left:'item4',  text_centre:'', text_right:'', function:function(){console.log('item4 function');} },
                    { text_left:'item5',  text_centre:'', text_right:'', function:function(){console.log('item5 function');} },
                    'break',
                    { text_left:'item6',  text_centre:'', text_right:'', function:function(){console.log('item6 function');} },
                    { text_left:'item7',  text_centre:'', text_right:'', function:function(){console.log('item7 function');} },
                    { text_left:'item8',  text_centre:'', text_right:'', function:function(){console.log('item8 function');} },
                    { text_left:'item9',  text_centre:'', text_right:'', function:function(){console.log('item9 function');} },
                    { text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
                    'break',
                    { text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
                    { text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
                    { text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
                    { text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
                    { text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },
                    'space',
                ]}},
                {type:'checkbox_rect', name:'test_checkbox_rect1', data:{x:150,y:145}},
                {type:'rastorgrid', name:'test_rastorgrid1', data:{x:100,y:225}},
                {type:'needleOverlay', name:'test_needleOverlay1', data:{x:0,y:310}},
                {type:'grapher_waveWorkspace', name:'test_grapher_waveWorkspace1', data:{x:0,y:375}},
                {type:'sequencer', name:'test_sequencer1', data:{x:125,y:330}},
            //dynamic nodes
                {type:'connectionNode', name:'test_connectionNode1', data:{ x:255, y:135 }},
                {type:'connectionNode', name:'test_connectionNode2', data:{ x:230, y:185 }},
                {type:'connectionNode', name:'test_connectionNode3', data:{ x:280, y:185 }},
                {type:'connectionNode_signal', name:'test_connectionNode_signal1', data:{ x:355, y:135 }},
                {type:'connectionNode_signal', name:'test_connectionNode_signal2', data:{ x:330, y:185 }},
                {type:'connectionNode_signal', name:'test_connectionNode_signal3', data:{ x:380, y:185 }},
                {type:'connectionNode_voltage', name:'test_connectionNode_voltage1', data:{ x:455, y:135 }},
                {type:'connectionNode_voltage', name:'test_connectionNode_voltage2', data:{ x:430, y:185 }},
                {type:'connectionNode_voltage', name:'test_connectionNode_voltage3', data:{ x:480, y:185 }},
                {type:'connectionNode_data', name:'test_connectionNode_data1', data:{ x:555, y:135 }},
                {type:'connectionNode_data', name:'test_connectionNode_data2', data:{ x:530, y:185 }},
                {type:'connectionNode_data', name:'test_connectionNode_data3', data:{ x:580, y:185 }},
                {type:'connectionNode_audio', name:'test_connectionNode_audio1', data:{ x:655, y:135, isAudioOutput:true}},
                {type:'connectionNode_audio', name:'test_connectionNode_audio2', data:{ x:630, y:185 }},
                {type:'connectionNode_audio', name:'test_connectionNode_audio3', data:{ x:680, y:185 }},
        ],
    };

    //main object
        var object = alphaUnit.builder(this.testObject,design);

    //playing with the parts
        object.elements.readout_sixteenSegmentDisplay.test_readout_sixteenSegmentDisplay.text('hello');
        object.elements.readout_sixteenSegmentDisplay.test_readout_sixteenSegmentDisplay.print();

        object.elements.grapher.test_grapher1.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        object.elements.grapher.test_grapher1.draw([0,0.25,1],undefined,1);
        
        object.elements.grapher_periodicWave.test_grapher_periodicWave1.updateBackground();
        object.elements.grapher_periodicWave.test_grapher_periodicWave1.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
        object.elements.grapher_periodicWave.test_grapher_periodicWave1.draw();

        object.elements.needleOverlay.test_needleOverlay1.select(0.25);
        object.elements.needleOverlay.test_needleOverlay1.area(0.5,0.75);

        object.elements.grapher_waveWorkspace.test_grapher_waveWorkspace1.select(0.25);
        object.elements.grapher_waveWorkspace.test_grapher_waveWorkspace1.area(0.5,0.75);
        
        object.elements.sequencer.test_sequencer1.addSignal( 0,0,  10,0.0 );
        object.elements.sequencer.test_sequencer1.addSignal( 1,1,  10,0.1 );
        object.elements.sequencer.test_sequencer1.addSignal( 2,2,  10,0.2 );
        object.elements.sequencer.test_sequencer1.addSignal( 3,3,  10,0.3 );
        object.elements.sequencer.test_sequencer1.addSignal( 4,4,  10,0.4 );
        object.elements.sequencer.test_sequencer1.addSignal( 5,5,  10,0.5 );
        object.elements.sequencer.test_sequencer1.addSignal( 6,6,  10,0.6 );
        object.elements.sequencer.test_sequencer1.addSignal( 7,7,  10,0.7 );
        object.elements.sequencer.test_sequencer1.addSignal( 8,8,  10,0.8 );
        object.elements.sequencer.test_sequencer1.addSignal( 9,9,  10,0.9 );
        object.elements.sequencer.test_sequencer1.addSignal( 10,10,10,1.0 );
    
    return object;
};








this.testObject.devUnit = true;
this.testObject.metadata = {
    name:'Test Object',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/testObject/'
};