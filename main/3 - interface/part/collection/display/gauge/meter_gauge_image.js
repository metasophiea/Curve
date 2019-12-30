this.meter_gauge_image = function(
    name='meter_gauge_image',
    x, y, angle=0,
    width=50, height=30,

    needleAngleBounds=[{start:-Math.PI/6,end:Math.PI/6}],
    backingURL='',
    needleColours=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.65,g:0.65,b:0.65,a:1}],
    frontingURL,
){
    dev.log.partDisplay('.meter_gauge_image('  //#development
        +name+','+x+','+y+','+angle+','+width+','+height+','  //#development
        +JSON.stringify(needleAngleBounds)  //#development
        +JSON.stringify(backingURL)+','+JSON.stringify(needleColours)+','+JSON.stringify(frontingURL)  //#development
    +')'); //#development
    
    //elements
        const object = interfacePart.builder('display', 'gauge_image', name, {
            x:x, y:y, angle:angle,
            width:width, height:height, needleAngleBounds:needleAngleBounds,
            style:{needles:needleColours},
            backingURL:backingURL, frontingURL:frontingURL,
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

interfacePart.partLibrary.display.meter_gauge_image = function(name,data){ 
    return interfacePart.collection.display.meter_gauge_image(
        name, data.x, data.y, data.angle, data.width, data.height,

        data.needleAngleBounds,
        data.backingURL,
        data.style.needleColours,
        data.frontingURL,
    ); 
};