this.meter_level = function(
    name='meter_level',
    x, y, angle=0,
    width=20, height=60,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle={r:0.04,g:0.04,b:0.04,a:1},
    levelStyles=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.3,g:0.3,b:0.3,a:1}],
    markingStyle_fill={r:0.86,g:0.86,b:0.86,a:1},
    markingStyle_font='Roboto-Regular',
    markingStyle_printingMode={widthCalculation:'absolute', horizontal:'left', vertical:'top'},
    markingStyle_size=2,
){

    //elements
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //level
            var level = interfacePart.builder('level','level',{
                width:width, height:height,
                style:{
                    backing:backingStyle,
                    levels:levelStyles,
                },
            });
            object.append(level);

        //markings
            var marks = interfacePart.builder('group','markings');
                object.append(marks);

            function makeMark(y){
                var markThickness = 0.2;
                var path = [{x:width,y:y-markThickness/2},{x:width-width/4, y:y-markThickness/2},{x:width-width/4, y:y+markThickness/2},{x:width,y:y+markThickness/2}];  
                return interfacePart.builder('polygon', 'mark_'+y, {pointsAsXYArray:path, colour:markingStyle_fill});
            }
            function insertText(y,text){
                return interfacePart.builder('text', 'text_'+text, {x:0.5, y:y-0.5, height:markingStyle_size, width:markingStyle_size, text:text, colour:markingStyle_fill, font:markingStyle_font, printingMode:markingStyle_printingMode });
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