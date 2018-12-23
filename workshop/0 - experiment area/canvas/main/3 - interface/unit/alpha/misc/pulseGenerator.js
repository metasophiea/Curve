this.pulseGenerator = function(x,y,debug=false){
    var maxTempo = 240;

    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        text:{fill:'rgba(0,0,0,1)', size:4, font:'Courier New'},

        dial:{
            handle: 'rgba(220,220,220,1)',
            slot: 'rgba(50,50,50,1)',
            needle: 'rgba(250,150,150,1)',
        }
    };
    var design = {
        name: 'pulseGenerator',
        collection: 'alpha',
        x: x, y: y,
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
                receive:function(){ object.elements.button_rect.sync.press();},
            }},

            {type:'polygon', name:'backing', data:{ points:[ {x:0,y:10},{x:10,y:0}, {x:100,y:0},{x:115,y:10}, {x:115,y:30},{x:100,y:40}, {x:10,y:40},{x:0,y:30} ], style:style.background }},

            {type:'button_rect', name:'syncButton', data:{
                x:102.5, y: 11.25, width:10, height: 17.5,
                selectable:false, 
                style:{ 
                    background__up__fill:'rgba(175,175,175,1)', 
                    background__hover__fill:'rgba(220,220,220,1)', 
                    background__hover_press__fill:'rgba(150,150,150,1)'
                }, 
                onpress:function(){updateTempo(tempo)},
            }},
            {type:'dial_continuous',name:'tempo',data:{
                x:20, y:20, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
            }},
            {type:'readout_sixteenSegmentDisplay_static',name:'readout',data:{ x:35, y:10, width:65, height:20, count:6 }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.pulseGenerator,design);

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
                    workspace.library.misc.padString(newTempo,3,' ')+'bpm'
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

this.pulseGenerator.metadata = {
    name:'Pulse Generator',
    helpURL:'https://metasophiea.com/curve/help/objectects/alpha/pulseGenerator/'
};