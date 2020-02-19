this.OR = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'logic_gates/';

            //calculation of measurements
                const div = 10;
                const measurement = {
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
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'OR',
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
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'OR.png' }
                },
            ]
        });

    //circuitry
        const currentInputValues = [false,false];
        let delay = 1;
        function updateOutput(A,B){
            if(delay > 0){ 
                setTimeout(function(){
                    object.io.signal.out.set(A || B);
                },delay);
            }else{
                object.io.signal.out.set(A || B);
            }
        }

    //wiring
        //io
            object.io.signal.in_1.onchange = function(value){
                if(value == currentInputValues[0]){return;}
                currentInputValues[0] = value;
                updateOutput(currentInputValues[0],currentInputValues[1]);
            };
            object.io.signal.in_2.onchange = function(value){
                if(value == currentInputValues[1]){return;}
                currentInputValues[1] = value;
                updateOutput(currentInputValues[0],currentInputValues[1]);
            };

    //setup
        updateOutput(currentInputValues[0],currentInputValues[1]);

    return object;
};
this.OR.metadata = {
    name:'OR',
    category:'logic_gates',
    helpURL:'/help/units/curvetech/OR/'
};