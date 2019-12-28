this.checkbox_ = function(
    name='checkbox_',
    x, y, angle=0, interactable=true,

    onchange = function(){},

    subject
){
    dev.log.partControl('.checkbox_(...)'); //#development

    if(subject == undefined){console.warn('checkbox_ : No subject provided');}

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //subject
            object.append(subject);

    //state
        const state = {
            checked:false,
            glowing:false,
        };

    //methods
        object.get = function(){ return state.checked; };
        object.set = function(value, update=true){
            state.checked = value;
            
            object.updateGraphics(state);
    
            if(update && this.onchange){ this.onchange(value); }
        };
        object.light = function(a){
            if(a == undefined){ return state.glowing; }

            state.glowing = a;

            object.updateGraphics(state);
        };
        object.interactable = function(bool){
            if(bool == undefined){return interactable;}
            interactable = bool;
        };

    //interactivity
        subject.cover.attachCallback('onclick', (x,y,event) => { 
            if(!interactable){return;}
            object.set(!object.get());
        });
        subject.cover.attachCallback('onmousedown', () => {});
        subject.cover.attachCallback('onmouseup', () => {});

    //callbacks
        object.onchange = onchange;

    return object;
};

interfacePart.partLibrary.control.checkbox_ = function(name,data){ return interfacePart.collection.control.checkbox_(
    name, data.x, data.y, data.angle, data.interactable,
    data.onchange, data.subject,
); };