this.meter_gauge = function(
    name='meter_gauge',
    x, y, angle=0,
    width=50, height=30,

    needleAngleBounds=[{start:-Math.PI/6,end:Math.PI/6}],
    backingStyle={r:0.04,g:0.04,b:0.04,a:1},
    needleColours=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.65,g:0.65,b:0.65,a:1}],

    markings={
        upper:'ABCDEF'.split(''),
        middle:[0,1,2,3,4,5,6,7,8,9,10],
        lower:[0,0.25,0.5,0.75,1],
    },
    markingStyle_fill={r:0.86,g:0.86,b:0.86,a:1},
    markingStyle_font='Roboto-Regular',
    markingStyle_printingMode={widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
    markingStyle_size=2,
){
    var defaultBoundingAngles = {
        start:-Math.PI/6,
        end:Math.PI/6,
    };

    //elements
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //level
            var gauge = interfacePart.builder('display','gauge','gauge',{
                width:width, height:height, needleAngleBounds:needleAngleBounds,
                style:{
                    backing:backingStyle,
                    needles:needleColours,
                },
            });
            object.append(gauge);

        //markings
            var marks = interfacePart.builder('basic','group','markings');
                object.append(marks);

            function insertText(angle,distance,text,name=''){
                var boundingAngles = needleAngleBounds[0] == undefined ? defaultBoundingAngles : needleAngleBounds[0];

                var object = interfacePart.builder('basic','group','markingsGroup_'+name,{
                    x:width/2, y:height - height/10 + height/2.5, 
                    angle:boundingAngles.start + (boundingAngles.end-boundingAngles.start)*angle
                });
                var text = interfacePart.builder('basic','text', 'text_'+name+'_'+text, {
                        x:0, y:-distance, 
                        height:markingStyle_size, 
                        width:markingStyle_size, 
                        text:text, 
                        colour:markingStyle_fill, 
                        font:markingStyle_font,
                        printingMode:markingStyle_printingMode,
                    }
                );

                object.append(text);

                return object;
            }

            Object.keys(markings).forEach(key => {
                for(var a = 0; a < markings[key].length; a++){
                    var pos = a/(markings[key].length-1);
                    var heightMux = 1.2;
                    switch(key){
                        case 'upper': heightMux = 1.2; break;
                        case 'middle': heightMux = 1.0; break;
                        case 'lower': heightMux = 0.8; break;
                    }
                    marks.append( insertText(pos, height*heightMux, markings[key][a], key+'_'+a) );
                }
            });
            
    //update intervals
        if(needleColours.length > 1){
            var framesPerSecond = 25;
            var coolDownSpeed = ( 3/4 )/10;

            var coolDownSub = coolDownSpeed/framesPerSecond;

            var coolDown = 0;
            var mostRecentSetting = 0;
            setInterval(function(){        
                gauge.needle(mostRecentSetting,0);

                if(coolDown>0){coolDown-=coolDownSub;}
                gauge.needle(coolDown,1);

                if(mostRecentSetting > coolDown){coolDown = mostRecentSetting;}
            },1000/framesPerSecond);
        }

    //method
        object.set = function(a){
            if(a > 1){a = 1;}else if(a < 0){a = 0;}
            if(needleColours.length > 1){ mostRecentSetting = a; }
            else{ gauge.needle(a,0); }
        };

    return object;
};

interfacePart.partLibrary.display.meter_gauge = function(name,data){ 
    return interfacePart.collection.display.meter_gauge(
        name, data.x, data.y, data.angle, data.width, data.height,

        data.needleAngleBounds,
        data.style.backing,
        data.style.needleColours,
    
        data.markings,
        data.style.markingStyle_fill,
        data.style.markingStyle_font,
        data.style.markingStyle_printingMode,
        data.style.markingStyle_size,
    ); 
};