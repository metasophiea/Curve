this.readout_sevenSegmentDisplay_static = function(
    name='readout_sevenSegmentDisplay_static',
    x, y, width=100, height=30, count=5, angle=0, decimalPlaces=false, resolution=5, 
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
                var temp = interfacePart.builder('display','sevenSegmentDisplay_static', ''+a, {
                    x:(width/count)*a, width:width/count, height:height, resolution:resolution,
                    style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                });
                object.append( temp );
                units.push(temp);
            }

        //decimal point
            if(decimalPlaces){
                var decimalPoints = [];
                for(var a = 1; a < count; a++){
                    var temp = interfacePart.builder('display','glowbox_rectangle','decimalPoint_'+a,{ 
                        x:(width/count)*a  - ((width/count)/8)/2, y:height*0.9 - ((width/count)/8)/2, 
                        width:((width/count)/8), height:((width/count)/8),
                        style:{ glow:glowStyle, dim:dimStyle },
                    });
                    object.append(temp);
                    decimalPoints.push(temp);
                }
            }

    //methods
        object.text = function(a){
            if(a==null){return text;}
            text = a;
        };

        function print(style,offset=0,dontClear=false){
            decimalPoints.forEach(point => point.off());
            if(!dontClear){ clearInterval(displayInterval); }

            switch(style){
                case 'smart':
                    if(text.replace('.','').length > units.length){print('r2lSweep');}
                    else{print('regular');}
                break;
                case 'r2lSweep':
                    var displayStage = -units.length;

                    displayInterval = setInterval(function(){
                        print('regular',-displayStage,true);
                        displayStage++;if(displayStage > units.length+text.length-1){displayStage=-units.length;}
                    },displayIntervalTime);
                break;
                case 'regular': default:
                    var textIndex = 0;
                    for(var a = offset; a < units.length; a++){
                        if(units[a] == undefined){ textIndex++; continue; }

                        if(text[textIndex] == '.'){
                            if(decimalPoints[a-1] != undefined){decimalPoints[a-1].on();}
                            a--;
                        }else{ units[a].enterCharacter(text[textIndex]); }
                        textIndex++;
                    }
                break;
            }
        }
        object.print = function(style){ print(style); };

    return object;
};

interfacePart.partLibrary.display.readout_sevenSegmentDisplay_static = function(name,data){ 
    return interfacePart.collection.display.readout_sevenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.count, data.angle, data.decimalPlaces, data.resolution,
        data.style.background, data.style.glow, data.style.dim,
    ); 
};