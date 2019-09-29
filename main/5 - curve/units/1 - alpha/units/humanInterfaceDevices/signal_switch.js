this.signal_switch = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'signal_switch/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:149, height:260 },
                    design: { width:2.125, height:4 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'signal_switch',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out', data:{ 
                    x:unitStyle.drawingValue.width/2.3 - 10/2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
                {collection:'control', type:'slide_discrete_image',name:'theSwitch',data:{
                    x:5.25, y:5.25, width:9.5, height:29.5, handleHeight:1/2, resetValue:0, optionCount:2, value:1,
                    handleURL:unitStyle.imageStoreURL_localPrefix+'handle.png',
                }},
            ]
        });
    
    //wiring
        //hid
            object.elements.slide_discrete_image.theSwitch.onchange = function(value){ object.elements.connectionNode_signal.out.set( 1-value == 0 ? false : true ); };

    //import/export
        object.exportData = function(){
            return { state: object.elements.slide_discrete_image.theSwitch.get() };
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