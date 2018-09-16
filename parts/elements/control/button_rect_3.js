this.button_rect_3 = function(
    id='button_rect_3',
    x, y, width, height,
    text,
    textVerticalOffset=0.5, textHorizontalOffset=0.05,
    active=true, hoverable=true, selectable=true,
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
        var object = __globals.utility.misc.elementMaker('g',id,{x:x,y:y});

        var background = __globals.utility.misc.elementMaker('rect',null,{width:width, height:height, style:backgroundStyle_off});
        object.appendChild( background );

        var text = __globals.utility.misc.elementMaker('text',null,{x:width*textHorizontalOffset, y:height*textVerticalOffset, text:text, style:textStyle});
        object.appendChild(text);

    //state
        object.state = {
            hovering:false,
            glowing:false,
            selected:false,
            pressed:false,
        };

        object.activateState = function(){
            if(!active){ __globals.utility.element.setStyle( background, backgroundStyle_off); return; }

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
    
            __globals.utility.element.setStyle( background, styles[object.state.hovering*8 + object.state.glowing*4 + object.state.selected*2 + object.state.pressed*1] );
        };
        object.activateState();

        //interactivity
            object.onmouseenter = function(event){ this.state.hovering = true;  this.activateState(); if(this.onenter){this.onenter(event);}      };
            object.onmouseleave = function(event){ this.state.hovering = false; this.release(); this.activateState(); if(this.onleave){this.onleave(event);}      };
            object.onmouseup = function(event){   this.release(event); };
            object.onmousedown = function(event){ this.press(event);   };
            object.ondblclick = function(event){ if(this.ondblpress){this.ondblpress(event);} };
        //controls
            object.press = function(event){
                if(this.state.pressed){return;}
                this.state.pressed = true;
                this.activateState();
                if(this.onpress){this.onpress(event);}
            };
            object.release = function(event){
                if(!this.state.pressed){return;}
                this.state.pressed = false;
                this.activateState();
                if(this.onrelease){this.onrelease(event);}
            };
            object.active = function(bool){ if(bool == undefined){return active;} active = bool; object.activateState(); };
            object.glow = function(bool){   if(bool == undefined){return object.state.glowing;}  object.state.glowing = bool;  object.activateState(); };
            object.select = function(bool){ if(bool == undefined){return object.state.selected;} object.state.selected = bool; object.activateState(); };
        //callbacks
            object.onenter = function(event){};
            object.onleave = function(event){};
            object.onpress = function(event){};
            object.ondblpress = function(event){};
            object.onrelease = function(event){};

    return object;
};