this.rastorgrid = function(
    name='rastorgrid', 
    x, y, width=80, height=80, angle=0, interactable=true,
    xcount=5, ycount=5,
    backingStyle = 'rgba(200,200,200,1)',
    checkStyle = 'rgba(150,150,150,1)',
    backingGlowStyle = 'rgba(220,220,220,1)',
    checkGlowStyle = 'rgba(220,220,220,1)',
    onchange = function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        
        //checkboxes
            for(var y = 0; y < ycount; y++){
                for(var x = 0; x < xcount; x++){
                    var temp = interfacePart.builder('checkbox_rect',y+'_'+x,{
                        x:x*(width/xcount),  y:y*(height/ycount), 
                        width:width/xcount,  height:height/ycount, interactable:interactable,
                        style:{ check:checkStyle, backing:backingStyle, checkGlow:checkGlowStyle, backingGlow:backingGlowStyle },
                        onchange:function(){ if(object.onchange){object.onchange(object.get());} },
                    });
                    object.append(temp);
                }
            }




    //methods
        object.box = function(x,y){ return object.getChildByName(y+'_'+x); };
        object.get = function(){
            var outputArray = [];
    
            for(var y = 0; y < ycount; y++){
                var temp = [];
                for(var x = 0; x < xcount; x++){
                    temp.push(this.box(x,y).get());
                }
                outputArray.push(temp);
            }
    
            return outputArray;
        };
        object.set = function(value, update=true){
            for(var y = 0; y < ycount; y++){
                for(var x = 0; x < xcount; x++){
                    object.box(x,y).set(value[y][x],false);
                }
            }
        };
        object.clear = function(){
            for(var y = 0; y < ycount; y++){
                for(var x = 0; x < xcount; x++){
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
            for(var y = 0; y < ycount; y++){
                for(var x = 0; x < xcount; x++){
                    object.getChildByName(y+'_'+x).interactable(bool);
                }
            }
        };




    //callback
        object.onchange = onchange;

    return object;
};