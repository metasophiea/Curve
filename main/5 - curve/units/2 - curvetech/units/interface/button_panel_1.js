this.button_panel_1 = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'button_panel/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:200, height:300 },
                    design: { width:2, height:3 },
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
            model:'button_panel_1',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out', data:{ 
                    x:unitStyle.drawingValue.width/2-5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'1_backing.png' }
                },
                {collection:'control', type:'button_image', name:'button', data:{
                    x:5, y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'key_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'key_down.png',
                }},
            ]
        });

    //wiring
        //hid
            object.elements.button_image.button.onpress = function(){ object.io.signal.out.set(true); };
            object.elements.button_image.button.onrelease = function(){ object.io.signal.out.set(false); };
        //keycapture
            const keyCodes = [ 49 ];
            object.elements.image.backing.attachCallback('onkeydown', function(x,y,event){
                if( keyCodes.includes(event.keyCode) ){
                    object.elements.button_image.button.press();
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                if( keyCodes.includes(event.keyCode) ){
                    object.elements.button_image.button.release();
                }
            });

    //interface
        object.i = {
            press:function(){ object.elements.button_image.button.press(); },
            release:function(){ object.elements.button_image.button.release(); },
        };

    return object;
};
this.button_panel_1.metadata = {
    name:'Button Panel - Type A',
    category:'interface',
    helpURL:'/help/units/curvetech/button_panel_1/'
};