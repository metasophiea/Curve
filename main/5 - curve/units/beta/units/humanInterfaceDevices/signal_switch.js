this.signal_switch = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'signal_switch/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:149, height:260 },
        design:{ width:2.125, height:4 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    
    var design = {
        name:'signal_switch',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                     },
            { x:measurements.drawing.width -offset, y:0                                     },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset   },
            { x:0,                                  y:measurements.drawing.height -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_signal', name:'out', data:{ 
                x:measurements.drawing.width/2.3 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png' }
            },
            {collection:'control', type:'slide_discrete_image',name:'theSwitch',data:{
                x:5.25, y:5.25, width:9.5, height:29.5, handleHeight:1/2, resetValue:0, optionCount:2, value:1,
                handleURL:imageStoreURL_localPrefix+'handle.png',
            }},
        ]
    };
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //circuitry
        object.elements.slide_discrete_image.theSwitch.onchange = function(value){
            object.elements.connectionNode_signal.out.set( 1-value == 0 ? false : true );
        };

    //import/export
        object.exportData = function(){
            return {
                state:object.elements.slide_discrete_image.theSwitch.get()
            };
        };
        object.importData = function(data){
            object.elements.slide_discrete_image.theSwitch.set(data.state);
        };
        
    return object;
};



this.signal_switch.metadata = {
    name:'Signal Switch',
    category:'humanInterfaceDevices',
    helpURL:'/help/units/beta/signal_switch/'
};