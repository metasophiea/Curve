this.voltage_dial = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'voltage_dial/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:275, height:260 },
        design:{ width:4.25, height:4 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    
    var design = {
        name:'voltage_dial',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:0                                     },
            { x:measurements.drawing.width -offset, y:0                                     },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset   },
            { x:0,                                  y:measurements.drawing.height -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_voltage', name:'out', data:{ 
                x:measurements.drawing.width/2.2 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
            }},
            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png' }
            },

            {collection:'control', type:'dial_colourWithIndent_continuous',name:'theDial',data:{
                x:20, y:20, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                style:{ handle:{r:0.75,g:0.75,b:0.75,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
        ]
    };
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //circuitry
        object.elements.dial_colourWithIndent_continuous.theDial.onchange = function(value){
            object.elements.connectionNode_voltage.out.set( value );
        };

    //import/export
        object.exportData = function(){
            return {
                state:object.elements.dial_colourWithIndent_continuous.theDial.get()
            };
        };
        object.importData = function(data){
            object.elements.dial_colourWithIndent_continuous.theDial.set(data.state);
        };
        
    return object;
};



this.voltage_dial.metadata = {
    name:'Voltage Dial',
    category:'humanInterfaceDevices',
    helpURL:'/help/units/beta/voltage_dial/'
};