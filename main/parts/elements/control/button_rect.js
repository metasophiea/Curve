this.button_rect = function(
    id='button_rect',
    x, y, width, height, angle=0,
    text_centre, text_left, text_right,
    textVerticalOffsetMux=0.5, textHorizontalOffsetMux=0.05,
    active=true, hoverable=true, selectable=false, pressable=true,
    textStyle='fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
    backgroundStyle_off=                     'fill:rgba(180,180,180,1)',
    backgroundStyle_up=                      'fill:rgba(200,200,200,1)',
    backgroundStyle_press=                   'fill:rgba(230,230,230,1)',
    backgroundStyle_select=                  'fill:rgba(200,200,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_select_press=            'fill:rgba(230,230,230,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_glow=                    'fill:rgba(220,220,220,1)',
    backgroundStyle_glow_press=              'fill:rgba(250,250,250,1)',
    backgroundStyle_glow_select=             'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_glow_select_press=       'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_hover=                   'fill:rgba(220,220,220,1)',
    backgroundStyle_hover_press=             'fill:rgba(240,240,240,1)',
    backgroundStyle_hover_select=            'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_hover_select_press=      'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_hover_glow=              'fill:rgba(240,240,240,1)',
    backgroundStyle_hover_glow_press=        'fill:rgba(250,250,250,1)',
    backgroundStyle_hover_glow_select=       'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_hover_glow_select_press= 'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:2;',
){
    //elements
        var object = system.utility.misc.elementMaker('g',id,{x:x,y:y,r:angle});

        var background = system.utility.misc.elementMaker('rect',null,{width:width, height:height, style:backgroundStyle_off});
        object.appendChild( background );

        var text_centre = system.utility.misc.elementMaker('text',null,{x:width/2, y:height*textVerticalOffsetMux, text:text_centre, style:textStyle+'text-anchor:middle;'});
        object.appendChild(text_centre);
        var text_left = system.utility.misc.elementMaker('text',null,{x:width*textHorizontalOffsetMux, y:height*textVerticalOffsetMux, text:text_left, style:textStyle});
        object.appendChild(text_left);
        var text_right = system.utility.misc.elementMaker('text',null,{x:width-(width*textHorizontalOffsetMux), y:height*textVerticalOffsetMux, text:text_right, style:textStyle+'text-anchor:end;'});
        object.appendChild(text_right);

    //state
        object.state = {
            hovering:false,
            glowing:false,
            selected:false,
            pressed:false,
        };

        object.activateGraphicalState = function(){
            if(!active){ system.utility.element.setStyle( background, backgroundStyle_off); return; }

            var styles = [
                backgroundStyle_up,                backgroundStyle_press,
                backgroundStyle_select,            backgroundStyle_select_press,
                backgroundStyle_glow,              backgroundStyle_glow_press,
                backgroundStyle_glow_select,       backgroundStyle_glow_select_press,
                backgroundStyle_hover,             backgroundStyle_hover_press,
                backgroundStyle_hover_select,      backgroundStyle_hover_select_press,
                backgroundStyle_hover_glow,        backgroundStyle_hover_glow_press,
                backgroundStyle_hover_glow_select, backgroundStyle_hover_glow_select_press,
            ];

            if(!hoverable && object.state.hovering ){ object.state.hovering = false; }
            if(!selectable && object.state.selected ){ object.state.selected = false; }

            system.utility.element.setStyle( 
                background, 
                styles[ object.state.hovering*8 + object.state.glowing*4 + object.state.selected*2 + (pressable && object.state.pressed)*1 ]
            );
        };
        object.activateGraphicalState();

        //interactivity
            object.onmouseenter = function(event){ 
                this.state.hovering = true;  
                this.activateGraphicalState();
                if(this.onenter){this.onenter(this, event);}
                if(event.buttons == 1){object.onmousedown(event);} 
            };
            object.onmouseleave = function(event){ 
                this.state.hovering = false; 
                this.release(event); 
                this.activateGraphicalState(); 
                if(this.onleave){this.onleave(this, event);}
            };
            object.onmouseup = function(event){   this.release(event); };
            object.onmousedown = function(event){ this.press(event);   };
            object.ondblclick = function(event){ if(this.ondblpress){this.ondblpress(this, event);} };
        //controls
            object.press = function(event){
                if(this.state.pressed){return;}
                this.state.pressed = true;
                this.activateGraphicalState();
                if(this.onpress){this.onpress(this, event);}
                this.select( !this.select(), event );
            };
            object.release = function(event){
                if(!this.state.pressed){return;}
                this.state.pressed = false;
                this.activateGraphicalState();
                if(this.onrelease){this.onrelease(this, event);}
            };
            object.active = function(bool){ if(bool == undefined){return active;} active = bool; this.activateGraphicalState(); };
            object.glow = function(bool){   if(bool == undefined){return this.state.glowing;}  this.state.glowing = bool;  this.activateGraphicalState(); };
            object.select = function(bool,event,callback=true){ 
                if(bool == undefined){return this.state.selected;} 
                if(!selectable){return;}
                if(this.state.selected == bool){return;}
                this.state.selected = bool; this.activateGraphicalState();
                if(callback){ if( this.state.selected ){ this.onselect(this,event); }else{ this.ondeselect(this,event); } }
            };
        //callbacks
            object.onenter = function(object, event){};
            object.onleave = function(object, event){};
            object.onpress = function(object, event){};
            object.ondblpress = function(object, event){};
            object.onrelease = function(object, event){};
            object.onselect = function(object, event){};
            object.ondeselect = function(object, event){};

    return object;
};