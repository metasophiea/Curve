this.pulseGenerator_hyper = function(x,y,a){
    var maxTempo = 999;

    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        text:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:4, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},

        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        }
    };
    var design = {
        name: 'pulseGenerator_hyper',
        category:'misc',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[
            {x:0,y:10},{x:10,y:0},
            {x:100,y:0},{x:115,y:10},
            {x:115,y:30},{x:100,y:40},
            {x:10,y:40},{x:0,y:30}
        ], 
        // spaceOutline: true,
        elements:[
            {type:'connectionNode_data', name:'out', data:{
                x: -5, y: 11.25, width: 5, height: 17.5,
            }},
            {type:'connectionNode_data', name:'sync', data:{
                x: 115, y: 11.25, width: 5, height: 17.5,
                receive:function(){ object.elements.button_rectangle.sync.press();},
            }},

            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[ {x:0,y:10},{x:10,y:0}, {x:100,y:0},{x:115,y:10}, {x:115,y:30},{x:100,y:40}, {x:10,y:40},{x:0,y:30} ], colour:style.background }},

            {type:'button_rectangle', name:'syncButton', data:{
                x:102.5, y: 11.25, width:10, height: 17.5,
                selectable:false, 
                style:{ 
                    background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
                    background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
                    background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1}
                }, 
                onpress:function(){updateTempo(tempo)},
            }},
            {type:'dial_continuous',name:'tempo',data:{
                x:20, y:20, radius: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
            }},
            {type:'readout_sixteenSegmentDisplay_static',name:'readout',data:{ x:35, y:10, width:65, height:20, count:6 }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.pulseGenerator_hyper,design);

    //internal circuitry
        object.elements.dial_continuous.tempo.onchange = function(value){updateTempo(Math.round(value*maxTempo));};

    //import/export
        object.exportData = function(){
            return object.elements.dial_continuous.tempo.get();
        };
        object.importData = function(data){
            object.elements.dial_continuous.tempo.set(data);
        };

    //internal functions
        var interval = null;
        var tempo = 120;
        function updateTempo(newTempo){
            //update readout
                object.elements.readout_sixteenSegmentDisplay_static.readout.text(
                    _canvas_.library.misc.padString(newTempo,3,' ')+'bpm'
                );
                object.elements.readout_sixteenSegmentDisplay_static.readout.print();

            //update interval
                if(interval){ clearInterval(interval); }
                if(newTempo > 0){
                    interval = setInterval(function(){
                        object.io.data.out.send('pulse');
                    },1000*(60/newTempo));
                }

            object.io.data.out.send('pulse');
            tempo = newTempo;
        }

    //interface
        object.i = {
            setTempo:function(value){
                object.elements.dial_continuous.tempo.set(value);
            },
        };

    //setup
        object.elements.dial_continuous.tempo.set(0.5);

    return object;
};

this.pulseGenerator_hyper.metadata = {
    name:'Pulse Generator (Hyper)',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/objectects/alpha/pulseGenerator_hyper/'
};