this.checkbox_rect = function(
    name='checkbox_rect',
    x, y, width=20, height=20, angle=0,
    checkStyle = 'rgba(150,150,150,1)',
    backingStyle = 'rgba(200,200,200,1)',
    checkGlowStyle = 'rgba(220,220,220,1)',
    backingGlowStyle = 'rgba(220,220,220,1)',
    onchange = function(){},
){
    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        
        //backing
            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
            object.append(backing);
        //check
            var checkrect = canvas.part.builder('rectangle','checkrect',{x:width*0.1,y:height*0.1,width:width*0.8,height:height*0.8, style:{fill:'rgba(0,0,0,0)'}});
            object.append(checkrect);
        //cover
            var cover = canvas.part.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
            object.append(cover);





    //state
        var state = {
            checked:false,
            glowing:false,
        }

        function updateGraphics(){
            if(state.glowing){
                backing.style.fill = backingGlowStyle;
                checkrect.style.fill = state.checked ? checkGlowStyle : 'rgba(0,0,0,0)';
            }else{
                backing.style.fill = backingStyle;
                checkrect.style.fill = state.checked ? checkStyle : 'rgba(0,0,0,0)';
            }
        }




    //methods
        object.get = function(){ return state.checked; };
        object.set = function(value, update=true){
            state.checked = value;
            
            updateGraphics();
    
            if(update&&this.onchange){ this.onchange(value); }
        };
        object.light = function(state){
            if(state == undefined){ return state.glowing; }

            state.glowing = state;

            updateGraphics();
        };




    //interactivity
        cover.onclick = function(event){
            object.set(!object.get());
        };
        cover.onmousedown = function(){};




    //callbacks
        object.onchange = onchange;

    return object;
};