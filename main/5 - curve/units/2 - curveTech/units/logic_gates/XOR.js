this.XOR = function(x,y,angle){
    //unitStyle
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'logic_gates/';

            //calculation of measurements
                var div = 10;
                var measurement = {
                    file: { width:100, height:100 },
                    design: { width:1, height:1 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'XOR',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out', data:{ 
                    x:unitStyle.drawingValue.width/2-2.5, y:0, width:2.5, height:5, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_1', data:{ 
                    x:unitStyle.drawingValue.width*(1/4)+2.5, y:unitStyle.drawingValue.height-2.5, width:5, height:5, angle:Math.PI/2+0.1, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_2', data:{ 
                    x:unitStyle.drawingValue.width*(3/4)+2.5, y:unitStyle.drawingValue.height-2.5-0.5, width:5, height:5, angle:Math.PI/2-0.1, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'XOR.png' }
                },
            ]
        });

    //circuitry
        var currentInputValues = [false,false];

    //wiring
        //io
            object.io.signal.in_1.onchange = function(value){
                if(value == currentInputValues[0]){return;}
                currentInputValues[0] = value;
                object.io.signal.out.set(value != object.io.signal.in_2.read());
            };
            object.io.signal.in_2.onchange = function(value){
                if(value == currentInputValues[1]){return;}
                currentInputValues[1] = value;
                object.io.signal.out.set(value != object.io.signal.in_1.read());
            };

    //setup
        object.io.signal.out.set(object.io.signal.in_1.read() != object.io.signal.in_2.read());     

    return object;
};
this.XOR.metadata = {
    name:'XOR',
    category:'logic_gates',
    helpURL:'/help/units/beta/XOR/'
};