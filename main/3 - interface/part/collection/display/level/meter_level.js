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
    dev.log.partDisplay('.meter_level('  //#development
        +name+','+x+','+y+','+angle+','+width+','+height+','  //#development
        +JSON.stringify(markings)+','+JSON.stringify(backingStyle)+','+JSON.stringify(levelStyles)  //#development
        +JSON.stringify(markingStyle_fill)+','+JSON.stringify(markingStyle_font)+','+JSON.stringify(markingStyle_printingMode)+','+JSON.stringify(markingStyle_size)  //#development
    +')'); //#development

    levelStyles = levelStyles.reverse();
    
    //elements
        const object = _canvas_.interface.part.builder('display', 'level', name, {x:x, y:y, angle:angle, width:width, height:height, style:{ backing:backingStyle, levels:levelStyles },});

        const markThickness = 0.2;
        function makeMark(y){
            const path = [ {x:width, y:y-markThickness/2}, {x:width-width/4, y:y-markThickness/2}, {x:width-width/4, y:y+markThickness/2}, {x:width, y:y+markThickness/2} ];
            return interfacePart.builder('basic','polygon', 'mark_'+y, {
                pointsAsXYArray:path,
                colour:markingStyle_fill,
            });
        }
        function insertText(y,text){
            return interfacePart.builder('basic','text', 'text_'+text, {x:0.5, y:y-0.5, height:markingStyle_size, width:markingStyle_size, text:text, colour:markingStyle_fill, font:markingStyle_font, printingMode:markingStyle_printingMode });
        }
        const markAndText = markings.map(marking => makeMark(height*(1-marking))).concat( markings.map(marking => insertText(height*(1-marking),marking)) );
        markAndText.forEach(element => object.append(element));

    //update intervals
        const framesPerSecond = 15;
        const coolDownSpeed = ( 3/4 )/10;
        const coolDownSub = coolDownSpeed/framesPerSecond;

        let coolDown = 0;
        let mostRecentSetting = 0;
        const interval = setInterval(function(){        
            object.layer(mostRecentSetting,1);

            if(coolDown>0){coolDown-=coolDownSub;}
            object.layer(coolDown,0);

            if(mostRecentSetting > coolDown){coolDown = mostRecentSetting;}
        },1000/framesPerSecond);
        
    //method
        object.set = function(a){
            dev.log.partDisplay('.meter_level.set('+a+')'); //#development
            if(a > 1){a = 1;}else if(a < 0){a = 0;}
            mostRecentSetting = a;
        };

    //setup/tear down
        object.ondelete = function(){
            clearInterval(interval);
        };

    return(object);
};

interfacePart.partLibrary.display.meter_level = function(name,data){ 
    return interfacePart.collection.display.meter_level(
        name, data.x, data.y, data.angle, data.width, data.height, data.markings,
        data.style.backing, data.style.levels, data.style.markingStyle_colour, data.style.markingStyle_font, data.style.markingStyle_printingMode, data.style.markingStyle_size
    ); 
};