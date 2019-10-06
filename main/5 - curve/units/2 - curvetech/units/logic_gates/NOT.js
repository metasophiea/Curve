this.NOT = function(x,y,angle){
    //unitStyle
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'logic_gates/';

            //calculation of measurements
                var div = 6;
                var measurement = {
                    file: { width:60, height:60 },
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
            name:'NOT',
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
                {collection:'dynamic', type:'connectionNode_signal', name:'in', data:{ 
                    x:unitStyle.drawingValue.width/2+2.5, y:unitStyle.drawingValue.height, width:2.5, height:5, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'NOT.png' }
                },
            ]
        });
    
    //circuitry
        var loopProtection = {
            maxChangesPerSecond:100,
            changeCount:0,
            interval:setInterval(function(){ 
                loopProtection.changeCount = 0;
                object.io.signal.out.set(!object.io.signal.in.read());
            },1000),
        };

    //wiring
        //io
            object.io.signal.in.onchange = function(value){
                if(loopProtection.changeCount > loopProtection.maxChangesPerSecond ){return;}
                loopProtection.changeCount++;
                object.io.signal.out.set(!value);
            };

    //setup
        object.io.signal.out.set(!object.io.signal.in.read());   

    return object;
};
this.NOT.metadata = {
    name:'NOT',
    category:'logic_gates',
    helpURL:'/help/units/beta/NOT/'
};