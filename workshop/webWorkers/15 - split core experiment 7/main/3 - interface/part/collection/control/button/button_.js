this.button_ = function(
    name='',
    x, y, angle=0, interactable=true,
    active=true, hoverable=true, selectable=false, pressable=true,

    onenter = function(event){},
    onleave = function(event){},
    onpress = function(event){},
    onpressrelease = function(event){},
    ondblpress = function(event){},
    onrelease = function(event){},
    onselect = function(event){},
    ondeselect = function(event){},

    subject
){
    if(subject == undefined){console.warn('button_ : No subject provided');}

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //subject
            object.append(subject);

    //state
        object.state = {
            hovering:false,
            glowing:false,
            selected:false,
            pressed:false,
        };

    //control
        object.press = function(event){
            if(!active){return;}

            if( pressable ){
                if(this.state.pressed){return;}
                this.state.pressed = true;
                if(this.onpress){this.onpress(this, event);}
            }
            
            this.select( !this.state.selected, event );

            object.activateGraphicalState(object.state);
        };
        object.release = function(event){
            if(!active || !pressable){return;}

            if(!this.state.pressed){return;}
            this.state.pressed = false;
            object.activateGraphicalState(object.state);
            if(this.onrelease){this.onrelease(this, event);}
        };
        object.active = function(bool){ if(bool == undefined){return active;} active = bool; object.activateGraphicalState(object.state); };
        object.glow = function(bool){   if(bool == undefined){return this.state.glowing;}  this.state.glowing = bool;  object.activateGraphicalState(object.state); };
        object.select = function(bool,event,callback=true){
            if(!active){return;}

            if(bool == undefined){return this.state.selected;}
            if(!selectable){return;}
            if(this.state.selected == bool){return;}
            this.state.selected = bool; object.activateGraphicalState(object.state);
            if(callback){ if( this.state.selected ){ this.onselect(this,event); }else{ this.ondeselect(this,event); } }
        };
        object.hoverable = function(bool){
            if(bool==undefined){return hoverable;}
            hoverable = bool;
            if(!hoverable){
                object.state.hovering = false;
                object.activateGraphicalState(object.state); 
            }
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };
        object.forceMouseLeave = function(){
            object.state.hovering = false; 
            object.release('forced'); 
            object.activateGraphicalState(object.state); 
            if(object.onleave){object.onleave('forced');}
        };

    //interactivity
        subject.cover.attachCallback('onmouseenterelement',(x,y,event) => {
            if(hoverable){ object.state.hovering = true; }
            object.activateGraphicalState(object.state);
            if(object.onenter){object.onenter(event);}
            if(event.buttons == 1){subject.cover.onmousedown(x,y,event);} 
        });
        subject.cover.attachCallback('onmouseleaveelement',(x,y,event) => {
            if(hoverable){ object.state.hovering = false; }
            object.release(event); 
            object.activateGraphicalState(object.state); 
            if(object.onleave){object.onleave(event);}
        });

        subject.cover.attachCallback('onmouseup', (x,y,event) => {   if(!interactable){return;} object.release(event); });
        subject.cover.attachCallback('onmousedown', (x,y,event) => { if(!interactable){return;} object.press(event); });
        subject.cover.attachCallback('onclick', (x,y,event) => { if(!interactable){return;} object.onpressrelease(event); });
        subject.cover.attachCallback('ondblclick', (x,y,event) => { if(!active){return;} if(!interactable){return;} if(object.ondblpress){object.ondblpress(event);} });
        
    //callbacks
        object.onenter = onenter;
        object.onleave = onleave;
        object.onpress = onpress;
        object.onpressrelease = onpressrelease;
        object.ondblpress = ondblpress;
        object.onrelease = onrelease;
        object.onselect = onselect;
        object.ondeselect = ondeselect;

    return object;
};

interfacePart.partLibrary.control.button_ = function(name,data){ return interfacePart.collection.control.button_(
    name, data.x, data.y, data.angle, data.interactable,
    data.active, data.hoverable, data.selectable, data.pressable,

    data.onenter,
    data.onleave,
    data.onpress,
    data.onpressrelease,
    data.ondblpress,
    data.onrelease,
    data.onselect,
    data.ondeselect,
    
    data.subject,
); };