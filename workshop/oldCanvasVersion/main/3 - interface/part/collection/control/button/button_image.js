this.button_image = function(
    name='button_image',
    x, y, width=30, height=20, angle=0, interactable=true,
    
    active=true, hoverable=true, selectable=false, pressable=true,

    backingURL__off,
    backingURL__up,
    backingURL__press,
    backingURL__select,
    backingURL__select_press,
    backingURL__glow,
    backingURL__glow_press,
    backingURL__glow_select,
    backingURL__glow_select_press,
    backingURL__hover,
    backingURL__hover_press,
    backingURL__hover_select,
    backingURL__hover_select_press,
    backingURL__hover_glow,
    backingURL__hover_glow_press,
    backingURL__hover_glow_select,
    backingURL__hover_glow_select_press,

    onenter = function(event){},
    onleave = function(event){},
    onpress = function(event){},
    ondblpress = function(event){},
    onrelease = function(event){},
    onselect = function(event){},
    ondeselect = function(event){},
){
    //default to non-image version if image links are missing
        if(
            backingURL__off == undefined ||                backingURL__up == undefined ||                   backingURL__press == undefined || 
            backingURL__select == undefined ||             backingURL__select_press == undefined ||         backingURL__glow == undefined || 
            backingURL__glow_press == undefined ||         backingURL__glow_select == undefined ||          backingURL__glow_select_press == undefined || 
            backingURL__hover == undefined ||              backingURL__hover_press == undefined ||          backingURL__hover_select == undefined ||
            backingURL__hover_select_press == undefined || backingURL__hover_glow == undefined ||           backingURL__hover_glow_press == undefined || 
            backingURL__hover_glow_select == undefined ||  backingURL__hover_glow_select_press == undefined
        ){
            return this.button_rectangle(
                name, x, y, width, height, angle, interactable,
                undefined, undefined, undefined, undefined, undefined,
                active, hoverable, selectable, pressable,
                undefined, undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                undefined, undefined, undefined, undefined, undefined, undefined,
                onenter, onleave, onpress, ondblpress, onrelease, onselect, ondeselect
            );
        }


    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('group',name+'subGroup',{});
        //backing
            var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingURL__off});
            subject.append(backing);
        //cover
            subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
            subject.append(subject.cover);

    //generic button part
        var object = interfacePart.builder(
            'button_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                onenter:onenter,
                onleave:onleave,
                onpress:onpress,
                ondblpress:ondblpress,
                onrelease:onrelease,
                onselect:onselect,
                ondeselect:ondeselect,

                subject:subject,
            }
        );

    //graphical state adjust
        object.activateGraphicalState = function(state){
            if(!active){ 
                backing.style.fill = backing__off__fill;
                backing.style.stroke = backing__off__stroke;
                backing.style.lineWidth = backing__off__lineWidth;
                return;
            }

            if(!hoverable && state.hovering ){ state.hovering = false; }
            if(!selectable && state.selected ){ state.selected = false; }

            backing.url = [
                backingURL__up,                     
                backingURL__press,                  
                backingURL__select,                 
                backingURL__select_press,           
                backingURL__glow,                   
                backingURL__glow_press,             
                backingURL__glow_select,            
                backingURL__glow_select_press,      
                backingURL__hover,                  
                backingURL__hover_press,            
                backingURL__hover_select,           
                backingURL__hover_select_press,     
                backingURL__hover_glow,             
                backingURL__hover_glow_press,       
                backingURL__hover_glow_select,      
                backingURL__hover_glow_select_press,
            ][ state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1 ];
        };
        object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });

    return object;
};