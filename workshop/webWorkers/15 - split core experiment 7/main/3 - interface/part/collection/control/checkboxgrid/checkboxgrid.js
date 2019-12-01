this.checkboxgrid = function(
    name='checkboxgrid', 
    x, y, width=80, height=80, angle=0, interactable=true,
    xcount=5, ycount=5, percentageSize=0.9,
    checkStyle={r:0.58,g:0.58,b:0.58,a:1},
    backingStyle={r:0.78,g:0.78,b:0.78,a:1},
    checkGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    backingGlowStyle={r:0.86,g:0.86,b:0.86,a:1},
    onchange = function(){},
){
    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        
        //checkboxes
            for(let y = 0; y < ycount; y++){
                for(let x = 0; x < xcount; x++){
                    const temp = interfacePart.builder('control','checkbox_rectangle',y+'_'+x,{
                        x:x*(width/xcount), y:y*(height/ycount), 
                        width:width/xcount, height:height/ycount, interactable:interactable, percentageSize:percentageSize,
                        style:{ check:checkStyle, backing:backingStyle, checkGlow:checkGlowStyle, backingGlow:backingGlowStyle },
                        onchange:function(){ if(object.onchange){object.onchange(object.get());} },
                    });
                    object.append(temp);
                }
            }

    //methods
        object.box = function(x,y){ return object.getChildByName(y+'_'+x); };
        object.get = function(){
            const outputArray = [];
    
            for(let y = 0; y < ycount; y++){
                const temp = [];
                for(let x = 0; x < xcount; x++){
                    temp.push(this.box(x,y).get());
                }
                outputArray.push(temp);
            }
    
            return outputArray;
        };
        object.set = function(value, update=true){
            for(let y = 0; y < ycount; y++){
                for(let x = 0; x < xcount; x++){
                    object.box(x,y).set(value[y][x],false);
                }
            }
        };
        object.clear = function(){
            for(let y = 0; y < ycount; y++){
                for(let x = 0; x < xcount; x++){
                    object.box(x,y).set(false,false);
                }
            }
        };
        object.light = function(x,y,state){
            object.box(x,y).light(state);
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
            for(let y = 0; y < ycount; y++){
                for(let x = 0; x < xcount; x++){
                    object.getChildByName(y+'_'+x).interactable(bool);
                }
            }
        };

    //callback
        object.onchange = onchange;

    return object;
};

interfacePart.partLibrary.control.checkboxgrid = function(name,data){ return interfacePart.collection.control.checkboxgrid(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.xCount, data.yCount, data.percentageSize,
    data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
    data.onchange
); };