this.adder = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'adder/';

            //calculation of measurements
                const div = 10;
                const measurement = {
                    file: { width:150, height:200 },
                    design: { width:1.5, height:2 },
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
            model:'adder',
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
                {collection:'dynamic', type:'connectionNode_signal', name:'carry_in', data:{ 
                    x:unitStyle.drawingValue.width, y:5, width:2.5, height:5, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'carry_out', data:{ 
                    x:0, y:10, width:2.5, height:5, angle:-Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_1', data:{ 
                    x:unitStyle.drawingValue.width*(1/4)+2.5, y:unitStyle.drawingValue.height-2.5, width:5, height:5, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in_2', data:{ 
                    x:unitStyle.drawingValue.width*(3/4)+2.5, y:unitStyle.drawingValue.height-2.5, width:5, height:5, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
            ]
        });

    //circuitry
        const currentInputValues = {in_1:false, in_2:false, carry_in:false};
        function update(){
            const v = currentInputValues;
            object.io.signal.out.set( v.in_1 != v.in_2 != v.carry_in );
            object.io.signal.carry_out.set( (v.in_1 && v.in_2) || (v.carry_in && v.in_1) || (v.carry_in && v.in_2) );
        };

    //wiring
        //io
            object.io.signal.in_1.onchange = function(value){
                if(value == currentInputValues.in_1){return;}
                currentInputValues.in_1 = value;
                update();
            };
            object.io.signal.in_2.onchange = function(value){
                if(value == currentInputValues.in_2){return;}
                currentInputValues.in_2 = value;
                update();
            };
            object.io.signal.carry_in.onchange = function(value){
                if(value == currentInputValues.carry_in){return;}
                currentInputValues.carry_in = value;
                update();
            };

    return object;
};
this.adder.metadata = {
    name:'Adder',
    category:'devices',
    helpURL:'/help/units/beta/adder/'
};