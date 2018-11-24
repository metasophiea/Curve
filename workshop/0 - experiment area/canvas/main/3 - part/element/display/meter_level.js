this.meter_level = function(
    name='meter_level',
    x, y, angle=0,
    width=20, height=60,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle='rgb(10,10,10)',
    levelStyles=['rgba(250,250,250,1)','fill:rgb(100,100,100)'],
    markingStyle_fill='rgba(220,220,220,1)',
    markingStyle_font='1pt Courier New',
){

    //elements
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        //level
            var level = canvas.part.builder('level','level',{
                width:width, height:height,
                style:{
                    backing:backingStyle,
                    levels:levelStyles,
                },
            });
            object.append(level);

        //markings
            var marks = canvas.part.builder('group','markings');
                object.append(marks);

            function makeMark(y){
                var markThickness = 0.2;
                var path = [{x:width,y:y-markThickness/2},{x:width-width/4, y:y-markThickness/2},{x:width-width/4, y:y+markThickness/2},{x:width,y:y+markThickness/2}];  
                return canvas.part.builder('polygon', 'mark_'+y, {points:path, style:{fill:markingStyle_fill}});
            }
            function insertText(y,text){
                return canvas.part.builder('text', 'text_'+text, {x:0.5, y:y+0.3, text:text, style:{fill:markingStyle_fill,font:markingStyle_font}});
            }

            for(var a = 0; a < markings.length; a++){
                marks.append( makeMark(height*(1-markings[a])) );
                marks.append( insertText(height*(1-markings[a]),markings[a]) );
            }




    //update intervals
        var framesPerSecond = 15;
        var coolDownSpeed = ( 3/4 )/10;

        var coolDownSub = coolDownSpeed/framesPerSecond;

        var coolDown = 0;
        var mostRecentSetting = 0;
        setInterval(function(){        
            level.layer(mostRecentSetting,0);

            if(coolDown>0){coolDown-=coolDownSub;}
            level.layer(coolDown,1);

            if(mostRecentSetting > coolDown){coolDown = mostRecentSetting;}
        },1000/framesPerSecond);




    //method
        object.set = function(a){
            mostRecentSetting = a;
        };

    return object;
};