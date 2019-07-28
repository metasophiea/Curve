this.readout_sixteenSegmentDisplay = function(
    name='readout_sixteenSegmentDisplay',
    x, y, width=100, height=30, count=5, angle=0,
    backgroundStyle={r:0,g:0,b:0,a:1},
    glowStyle={r:0.78,g:0.78,b:0.78,a:1},
    dimStyle={r:0.1,g:0.1,b:0.1,a:1},
){
    //values
        var text = '';
        var displayInterval = null;
        var displayIntervalTime = 150;

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});

        //display units
            var units = [];
            for(var a = 0; a < count; a++){
                var temp = interfacePart.builder('display','sixteenSegmentDisplay', ''+a, {
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

interfacePart.partLibrary.display.readout_sixteenSegmentDisplay = function(name,data){ 
    return interfacePart.collection.display.readout_sixteenSegmentDisplay(
        name, data.x, data.y, data.width, data.height, data.count, data.angle, 
        data.style.background, data.style.glow, data.style.dim,
    ); 
};