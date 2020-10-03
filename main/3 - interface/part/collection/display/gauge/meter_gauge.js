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
    dev.log.partDisplay('.meter_gauge('  //#development
        +name+','+x+','+y+','+angle+','+width+','+height+','  //#development
        +JSON.stringify(needleAngleBounds)+JSON.stringify(backingStyle)+','+JSON.stringify(needleColours)  //#development
        +JSON.stringify(markings)+','+JSON.stringify(markingStyle_fill)+','+JSON.stringify(markingStyle_font)  //#development
        +JSON.stringify(markingStyle_printingMode)+','+JSON.stringify(markingStyle_size)  //#development
    +')'); //#development

    const defaultBoundingAngles = {
        start:-Math.PI/6,
        end:Math.PI/6,
    };

    //elements
        const object = interfacePart.builder('display', 'gauge', name, {
            x:x, y:y, angle:angle,
            width:width, height:height, needleAngleBounds:needleAngleBounds,
            style:{ backing:backingStyle, needles:needleColours },
        });

        function generateMark(angle,distance,text,name=''){
            dev.log.partDisplay('.meter_gauge::generateMark('+angle+','+distance+','+text+','+name+')');  //#development
            const boundingAngles = needleAngleBounds[0] == undefined ? defaultBoundingAngles : needleAngleBounds[0];

            const group = interfacePart.builder('basic', 'group', name, {
                x:width/2, y:height - height/10 + height/2.5, 
                angle:boundingAngles.start + (boundingAngles.end-boundingAngles.start)*angle
            });
            group.append(interfacePart.builder('basic','text', 'text_'+name+'_'+text, {
                x:0, y:-distance, 
                height:markingStyle_size, 
                width:markingStyle_size, 
                text:String(text), 
                colour:markingStyle_fill, 
                font:markingStyle_font,
                printingMode:markingStyle_printingMode,
            }));

            return group;
        }
        Object.keys(markings).map(key => {
            markings[key].map((marking,index) => {
                const pos = index/(markings[key].length-1);
                let heightMux = 1.2;
                switch(key){
                    case 'upper': heightMux = 1.2; break;
                    case 'middle': heightMux = 1.0; break;
                    case 'lower': heightMux = 0.8; break;
                }
                object.append( generateMark(pos, height*heightMux, marking, key+'_'+index) );
            });
        });

    //update intervals
        let mostRecentSetting = 0;
        let interval;
        if(needleColours.length > 1){
            const framesPerSecond = 25;
            const coolDownSpeed = ( 3/4 )/10;
            const coolDownSub = coolDownSpeed/framesPerSecond;

            let coolDown = 0;
            interval = setInterval(function(){
                object.needle(mostRecentSetting,0);

                if(coolDown>0){coolDown-=coolDownSub;}
                object.needle(coolDown,1);

                if(mostRecentSetting > coolDown){coolDown = mostRecentSetting;}
            },1000/framesPerSecond);
        }

    //method
        object.set = function(a){
            dev.log.partDisplay('.meter_gauge.set('+a+')'); //#development
            if(a > 1){a = 1;}else if(a < 0){a = 0;}
            if(needleColours.length > 1){ mostRecentSetting = a; }
            else{ object.needle(a,0); }
        };

    //setup/tear down
        object.ondelete = function(){
            clearInterval(interval);
        };

    return(object);
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