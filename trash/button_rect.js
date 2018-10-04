this.button_rect = function(
    id='button_rect',
    x, y, width, height, angle=0,
    upStyle = 'fill:rgba(200,200,200,1)',
    hoverStyle = 'fill:rgba(220,220,220,1)',
    downStyle = 'fill:rgba(180,180,180,1)',
    glowStyle = 'fill:rgba(220,200,220,1)',
){

    // elements 
    var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});

    var rect = system.utility.misc.elementMaker('rect',null,{width:width, height:height, angle:angle, style:upStyle});
        object.appendChild(rect);

    //interactivity
    rect.onmouseenter = function(){ system.utility.element.setStyle(this, hoverStyle); };
    rect.onmouseleave = function(){ system.utility.element.setStyle(this, upStyle);    };
    rect.onmousedown =  function(){ system.utility.element.setStyle(this, downStyle);  };
    rect.onmouseup =    function(){ this.onmouseleave();                          };
    rect.glow =         function(){ system.utility.element.setStyle(this, glowStyle) };

    //callbacks
    object.onmouseup =    function(){ /*console.log('mouseup');    */ };
    object.onmousedown =  function(){ /*console.log('mousedown');  */ };
    object.onmouseenter = function(){ /*console.log('mouseenter'); */ };
    object.onmouseleave = function(){ /*console.log('mouseleave'); */ };
    object.onmousemove =  function(){ /*console.log('mousemove');  */ };
    object.onclick =      function(){ /*console.log('click');      */ };
    object.ondblclick =   function(){ /*console.log('doubleclick');*/ };

    //methods
    object.click = function(glow=false){ 
        this.onclick(); this.onmousedown(); 
        if(glow){rect.glow();}
        else{rect.onmousedown();} 
        setTimeout(function(that){rect.onmouseup();that.onmouseup();},250,this);
    };
    object.hover = function(){ this.onmouseenter(); rect.onmouseenter(); };
    object.unhover = function(){this.onmouseleave(); rect.onmouseleave();};

    return object;
};

this.button_rect_2 = function(
    id='button_rect_2',
    x, y, width, height,
    text,
    textVerticalOffset=0.5, textHorizontalOffset=0.05,
    textStyle='fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
    backgroundStyle_off=                     'fill:rgba(200,200,200,1)',
    backgroundStyle_press=                   '', //impossible
    backgroundStyle_select=                  'fill:rgba(200,200,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_select_press=            '', //impossible
    backgroundStyle_glow=                    'fill:rgba(220,220,220,1)',
    backgroundStyle_glow_press=              '', //impossible
    backgroundStyle_glow_select=             'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_glow_select_press=       '', //impossible
    backgroundStyle_hover=                   'fill:rgba(220,220,200,1)',
    backgroundStyle_hover_press=             'fill:rgba(240,240,240,1)',
    backgroundStyle_hover_select=            'fill:rgba(220,220,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_hover_select_press=      'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_hover_glow=              'fill:rgba(240,240,200,1)',
    backgroundStyle_hover_glow_press=        'fill:rgba(250,250,250,1)',
    backgroundStyle_hover_glow_select=       'fill:rgba(240,240,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
    backgroundStyle_hover_glow_select_press= 'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:2;',
){
    //elements
        var object = system.utility.misc.elementMaker('g',id,{x:x,y:y});

        var background = system.utility.misc.elementMaker('rect',null,{width:width, height:height, style:backgroundStyle_off});
        object.appendChild( background );

        var text = system.utility.misc.elementMaker('text',null,{x:width*textHorizontalOffset, y:height*textVerticalOffset, text:text, style:textStyle});
        object.appendChild(text);

    //state
    object.state = {
        hovering:false,
        glowing:false,
        selected:false,
        pressed:false,
    };
    object.activateState = function(){
        if( object.state.pressed && !object.state.hovering ){object.state.pressed = false;}

        var styles = [
            backgroundStyle_off,
            backgroundStyle_press,
            backgroundStyle_select,
            backgroundStyle_select_press,
            backgroundStyle_glow,
            backgroundStyle_glow_press,
            backgroundStyle_glow_select,
            backgroundStyle_glow_select_press,
            backgroundStyle_hover,
            backgroundStyle_hover_press,
            backgroundStyle_hover_select,
            backgroundStyle_hover_select_press,
            backgroundStyle_hover_glow,
            backgroundStyle_hover_glow_press,
            backgroundStyle_hover_glow_select,
            backgroundStyle_hover_glow_select_press,
        ];

        system.utility.element.setStyle(
            background, styles[object.state.hovering*8 + object.state.glowing*4 + object.state.selected*2 + object.state.pressed*1]
        );
    };
    object.activateState();

    //interactivity
        object.onmouseenter = function(){ object.state.hovering = true; object.activateState(); };
        object.onmouseleave = function(){ object.state.hovering = false; object.activateState(); };
        object.onmouseup = function(){ object.state.pressed = false; object.activateState(); };
        object.onmousedown = function(event){ object.state.pressed = true; object.activateState(); if(object.onpress){object.onpress(event);} };
    //controls
        object.glow = function(bool){ if(bool == undefined){return object.state.glowing;} object.state.glowing = bool; object.activateState(); };
        object.select = function(bool){ if(bool == undefined){return object.state.selected;} object.state.selected = bool; object.activateState(); };
    //callbacks
        object.onpress = function(){};

    return object;
};