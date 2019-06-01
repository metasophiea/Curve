this.checkbox_ = function(
    name='checkbox_',
    x, y, angle=0, interactable=true,

    onchange = function(){},

    subject
){
    if(subject == undefined){console.warn('checkbox_ : No subject provided');}

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //subject
            object.append(subject);

    //state
        var state = {
            checked:false,
            glowing:false,
        };

    //methods
        object.get = function(){ return state.checked; };
        object.set = function(value, update=true){
            state.checked = value;
            
            object.updateGraphics(state);
    
            if(update&&this.onchange){ this.onchange(value); }
        };
        object.light = function(a){
            if(a == undefined){ return state.glowing; }

            state.glowing = a;

            object.updateGraphics(state);
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };

    //interactivity
        subject.cover.onclick = function(){
            if(!interactable){return;}
            object.set(!object.get());
        };
        subject.cover.onmousedown = function(){};

    //callbacks
        object.onchange = onchange;

    return object;
};