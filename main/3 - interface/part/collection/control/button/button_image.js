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
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('basic','group',name+'subGroup',{});
        //backing
            var backing = interfacePart.builder('basic','image','backing',{width:width, height:height, url:backingURL__off});
            subject.append(backing);
        //cover
            subject.cover = interfacePart.builder('basic','rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
            subject.append(subject.cover);

    //generic button part
        var object = interfacePart.builder(
            'control', 'button_', name, {
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
                backing.imageURL(backingURL__off);
                return;
            }

            if(!hoverable && state.hovering ){ state.hovering = false; }
            if(!selectable && state.selected ){ state.selected = false; }

            var newImageURL = [
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
            ][ state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1 ]

            if( newImageURL != undefined ){backing.imageURL(newImageURL);}
        };
        object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });

    return object;
};