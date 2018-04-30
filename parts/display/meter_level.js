this.meter_level = function(
    id='meter_level',
    x, y, angle,
    width, height,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle='fill:rgb(10,10,10)',
    levelStyles=['fill:rgba(250,250,250,1);','fill:rgb(100,100,100);'],
    markingStyle='fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
){
    //values
        var coolDown = 0;
        var mostRecentSetting = 0;

    //elements
        var object = parts.basic.g(id, x, y);

    //level
        levelStyles[0] += 'transition: height 0s;';
        levelStyles[1] += 'transition: height 0.01s;';
        var level = parts.display.level('mainlevel',0,0,angle,width,height,2,backingStyle,levelStyles);
        object.append(level);

    //markings
        function makeMark(y){
            var markThickness = 0.2;
            var path = [{x:width,y:y-markThickness/2},{x:width-width/4, y:y-markThickness/2},{x:width-width/4, y:y+markThickness/2},{x:width,y:y+markThickness/2}];  
            return parts.basic.path(null, path, 'L', markingStyle);
        }
        function insertText(y,text){
            return parts.display.label(null, 0, y+0.3, text, markingStyle);
        }

        for(var a = 0; a < markings.length; a++){
            object.append(makeMark(height*(1-markings[a])));
            object.append(insertText(height*(1-markings[a]),markings[a]));
        }

    //update intervals
        setInterval(function(){        
            level.set(mostRecentSetting,0);

            if(coolDown>0){coolDown-=0.0025;}
            level.set(coolDown,1);

            if(mostRecentSetting > coolDown){coolDown = mostRecentSetting;}
        },1000/30);

    //methods
        object.set = function(a){
            mostRecentSetting = a;
            mostRecentSetting_slow = a;
        };

    return object;
};