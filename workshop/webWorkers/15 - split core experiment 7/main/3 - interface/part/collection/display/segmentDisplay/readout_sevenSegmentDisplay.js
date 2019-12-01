this.readout_sevenSegmentDisplay = function(
    name='readout_sevenSegmentDisplay', static=false, resolution=2, 
    x=0, y=0, width=100, height=30, count=5, angle=0, decimalPlaces=false,
    backgroundStyle={r:0,g:0,b:0,a:1},
    glowStyle={r:0.78,g:0.78,b:0.78,a:1},
    dimStyle={r:0.1,g:0.1,b:0.1,a:1},
){
    dev.log.partDisplay('.readout_sevenSegmentDisplay('+name+','+static+','+resolution+','+x+','+y+','+width+','+height+','+angle+','+decimalPlaces+','+JSON.stringify(backgroundStyle)+','+JSON.stringify(glowStyle)+','+JSON.stringify(dimStyle)+')'); //#development
    
    //values
        let text = '';
        let displayInterval = null;
        const displayIntervalTime = 150;

    //elements 
        //main
            const object = interfacePart.builder('basic', 'group', name, {x:x, y:y, angle:angle});
        //display units
            const units = (new Array(count)).fill().map((a,index) => {
                return interfacePart.builder('display', 'sevenSegmentDisplay', ''+index, {
                    x:(width/count)*index, width:width/count, height:height, 
                    static:static, resolution:resolution,
                    style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                });
            });
            units.forEach(element => object.append(element));
        //decimal point
            let decimalPoints = [];
            if(decimalPlaces){
                decimalPoints = (new Array(count)).fill().map((a,index) => {
                    return interfacePart.builder('display', 'glowbox_circle', 'decimalPoint_'+index, {
                        x:(width/count)*index, y:height*0.9, radius:((width/count)/8)/2,
                        style:{glow:glowStyle, dim:dimStyle},
                    });
                });
                decimalPoints.forEach(element => object.append(element));
            }

    //methods
        function print(style,offset=0,dontClear=false){
            dev.log.partDisplay('.readout_sevenSegmentDisplay::print('+style+','+offset+','+dontClear+')'); //#development
            
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

        object.text = function(a){
            if(a==null){return text;}
            dev.log.partDisplay('.readout_sevenSegmentDisplay.text('+a+')'); //#development
            text = a;
        };
        object.print = function(style){
            dev.log.partDisplay('.readout_sevenSegmentDisplay::print('+style+')'); //#development
            print(style);
        };  

    return(object);
};

interfacePart.partLibrary.display.readout_sevenSegmentDisplay = function(name,data){ 
    return interfacePart.collection.display.readout_sevenSegmentDisplay(
        name, data.static, data.resolution, data.x, data.y, data.width, data.height, data.count, data.angle, data.decimalPlaces,
        data.style.background, data.style.glow, data.style.dim,
    ); 
};