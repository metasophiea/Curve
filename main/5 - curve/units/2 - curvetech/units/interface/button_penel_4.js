this.button_panel_4 = function(x,y,angle){
    //unitStyle
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'button_panel/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:330, height:180 },
                    design: { width:5.5, height:3 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'button_panel_4',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out_1', data:{ 
                    x:5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_2', data:{ 
                    x:5+(10+5/3), y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_3', data:{ 
                    x:5+(10+5/3)*2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_4', data:{ 
                    x:5+(10+5/3)*3, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'4_guide.png' }
                },
                {collection:'control', type:'button_image', name:'button_1', data:{
                    x:5, y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'key_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'key_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_2', data:{
                    x:5+(10+5/3), y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'key_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'key_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_3', data:{
                    x:5+(10+5/3)*2, y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'key_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'key_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_4', data:{
                    x:5+(10+5/3)*3, y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'key_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'key_down.png',
                }},
            ]
        });

    //wiring
        //hid
            object.elements.button_image.button_1.onpress = function(){   object.io.signal.out_1.set(true);  };
            object.elements.button_image.button_1.onrelease = function(){ object.io.signal.out_1.set(false); };
            object.elements.button_image.button_2.onpress = function(){   object.io.signal.out_2.set(true);  };
            object.elements.button_image.button_2.onrelease = function(){ object.io.signal.out_2.set(false); };
            object.elements.button_image.button_3.onpress = function(){   object.io.signal.out_3.set(true);  };
            object.elements.button_image.button_3.onrelease = function(){ object.io.signal.out_3.set(false); };
            object.elements.button_image.button_4.onpress = function(){   object.io.signal.out_4.set(true);  };
            object.elements.button_image.button_4.onrelease = function(){ object.io.signal.out_4.set(false); };
        //keycapture
            object.elements.image.backing.glyphs = [ '1', '2', '3', '4' ]; 
            object.elements.image.backing.onkeydown = function(x,y,event){
                if( this.glyphs.includes(event.key) ){
                    object.elements.button_image['button_'+event.key].press();
                }
            };
            object.elements.image.backing.onkeyup = function(x,y,event){
                if( this.glyphs.includes(event.key) ){
                    object.elements.button_image['button_'+event.key].release();
                }
            };

    //interface
        object.i = {
            press:function(button){ object.elements.button_image['button_'+button].press(); },
            release:function(button){ object.elements.button_image['button_'+button].release(); },
        };

    return object;
};
this.button_panel_4.metadata = {
    name:'Button Panel - Type C',
    category:'interface',
    helpURL:'/help/units/beta/button_panel_4/'
};