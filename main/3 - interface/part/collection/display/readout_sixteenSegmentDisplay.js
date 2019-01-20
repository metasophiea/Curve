this.readout_sixteenSegmentDisplay = function(
    name='readout_sixteenSegmentDisplay',
    x, y, width=100, height=30, count=5, angle=0,
    backgroundStyle='rgb(0,0,0)',
    glowStyle='rgb(200,200,200)',
    dimStyle='rgb(20,20,20)'
){
    //values
        var text = '';
        var displayInterval = null;
        var displayIntervalTime = 150;

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});

        //display units
            var units = [];
            for(var a = 0; a < count; a++){
                var temp = interfacePart.builder('sixteenSegmentDisplay', ''+a, {
                    x:(width/count)*a, width:width/count, height:height, 
                    style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                });
                object.append( temp );
                units.push(temp);
            }

    //methods
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