this.meter_gauge_image = function(
    name='meter_gauge_image',
    x, y, angle=0,
    width=50, height=30,

    needleAngleBounds=[{start:-Math.PI/6,end:Math.PI/6}],
    backingURL='',
    needleColours=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.65,g:0.65,b:0.65,a:1}],
    frontingURL,
){
    //elements
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //level
            var gauge = interfacePart.builder('display','gauge_image','gauge',{
                width:width, height:height, needleAngleBounds:needleAngleBounds,
                backingURL:backingURL,
                style:{ needles:needleColours },
                frontingURL:frontingURL,
            });
            object.append(gauge);

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
            if(needleColours.length > 1){ mostRecentSetting = a; }
            else{ gauge.needle(a,0); }
        };

    return object;
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