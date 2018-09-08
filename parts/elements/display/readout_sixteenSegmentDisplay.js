this.readout_sixteenSegmentDisplay = function(
    id='readout_sixteenSegmentDisplay',
    x, y, width, height, count, angle=0,
    backgroundStyle='fill:rgb(0,0,0)',
    glowStyle='fill:rgb(200,200,200)',
    dimStyle='fill:rgb(20,20,20)'
){
    //values
        var text = '';
        var displayInterval = null;

    //elements
        //main
            var object = __globals.utility.misc.elementMaker('g',id,{x:x, y:y, r:angle});

        //display units
            var units = [];
            for(var a = 0; a < count; a++){
                var temp = __globals.utility.misc.elementMaker('sixteenSegmentDisplay', a, {
                    x:(width/count)*a, width:width/count, height:height, 
                    style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                });
                object.append( temp );
                units.push(temp);
            }

    //methods
        object.test = function(){
            this.text('Look at all the text I\'ve got here! 1234567890 \\/<>()[]{}*!?"#_,.');
            this.print('r2lSweep');
        };

        object.text = function(a){
            if(a==null){return text;}
            text = a;
        };

        object.print = function(style){
            clearInterval(displayInterval);
            switch(style){
                case 'smart':
                    if(text.length > units.length){this.print('r2lSweep');}
                    else{this.print('regular')}
                break;
                case 'r2lSweep':
                    var displayIntervalTime = 100;
                    var displayStage = 0;

                    displayInterval = setInterval(function(){
                        for(var a = units.length-1; a >= 0; a--){
                            units[a].enterCharacter(text[displayStage-((units.length-1)-a)]);
                        }

                        displayStage++;if(displayStage > units.length+text.length-1){displayStage=0;}
                    },displayIntervalTime);
                break;
                case 'regular': default:
                    for(var a = 0; a < units.length; a++){
                        units[a].enterCharacter(text[a]);
                    }
                break;
            }
        };

    return object;
};