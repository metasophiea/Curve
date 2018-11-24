canvas.part.builder = function(type,name,data){
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    switch(type){
        default: console.warn('Unknown element: '+ type); return null;  

        //basic
            case 'group': return this.element.basic.group(
                name, data.x, data.y, data.angle, data.ignored,
            );
            case 'rectangle': return this.element.basic.rectangle(
                name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin,
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'image': return this.element.basic.image(
                name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url
            );
            case 'polygon': return this.element.basic.polygon(
                name, data.points, data.ignored,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
            );
            case 'text': return this.element.basic.text(
                name, data.x, data.y, data.text, data.angle, data.anchor, data.ignored,
                data.style.font, data.style.textAlign, data.style.textBaseline,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'circle': return this.element.basic.circle(
                name, data.x, data.y, data.r, data.ignored,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'path': return this.element.basic.path(
                name, data.points, data.ignored,
                data.style.stroke, data.style.lineWidth, data.style.lineCap,  data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
            );
    
        //display
            case 'glowbox_rect': return this.element.display.glowbox_rect(
                name, data.x, data.y, data.width, data.height, data.angle, 
                data.style.glow, data.style.dim
            );
            case 'sevenSegmentDisplay': return this.element.display.sevenSegmentDisplay(
                name, data.x, data.y, data.width, data.height,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'sixteenSegmentDisplay': return this.element.display.sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, 
                data.style.background, data.style.glow, data.style.dim
            );
            case 'readout_sixteenSegmentDisplay': return this.element.display.readout_sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, data.count, data.angle, 
                data.style.background, data.style.glow, data.style.dime
            );
            case 'level': return this.element.display.level(
                name, data.x, data.y, data.angle, data.width, data.height, 
                data.style.backing, data.style.levels
            );
            case 'meter_level': return this.element.display.meter_level(
                name, data.x, data.y, data.angle, data.width, data.height, data.markings,
                data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
            );
            case 'audio_meter_level': return this.element.display.audio_meter_level(
                name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
                data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
            );
            case 'rastorDisplay': return this.element.display.rastorDisplay(
                name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
            );   

        //control
            case 'slide': return this.element.control.slide(
                name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.value, data.resetValue, 
                data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                data.onchange, data.onrelease
            );
            case 'slidePanel': return this.element.control.slidePanel(
                name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.count, data.value, data.resetValue, 
                data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                data.onchange, data.onrelease
            );
            case 'rangeslide': return this.element.control.rangeslide(
                name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
                data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
                data.onchange, data.onrelease
            );
            case 'dial_continuous': return this.element.control.dial_continuous(
                    name,
                    data.x, data.y, data.r, data.angle,
                    data.value, data.resetValue,
                    data.startAngle, data.maxAngle,
                    data.style.handle, data.style.slot, data.style.needle,
                    data.onchange, data.onrelease
            );
            case 'dial_discrete': return this.element.control.dial_discrete(
                    name,
                    data.x, data.y, data.r, data.angle,
                    data.value, data.resetValue, data.optionCount,
                    data.startAngle, data.maxAngle,
                    data.style.handle, data.style.slot, data.style.needle,
                    data.onchange, data.onrelease
            );
            case 'button_rect': return this.element.control.button_rect(
                    name, data.x, data.y, data.width, data.height, data.angle,
                    data.text_centre, data.text_left, data.text_right,
                    data.textVerticalOffsetMux, data.extHorizontalOffsetMux,
                    data.active, data.hoverable, data.selectable, data.pressable,

                    data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,

                    data.style.background__off__fill,                     data.style.background__off__stroke,                     data.style.background__off__strokeWidth,
                    data.style.background__up__fill,                      data.style.background__up__stroke,                      data.style.background__up__strokeWidth,
                    data.style.background__press__fill,                   data.style.background__press__stroke,                   data.style.background__press__strokeWidth,
                    data.style.background__select__fill,                  data.style.background__select__stroke,                  data.style.background__select__strokeWidth,
                    data.style.background__select_press__fill,            data.style.background__select_press__stroke,            data.style.background__select_press__strokeWidth,
                    data.style.background__glow__fill,                    data.style.background__glow__stroke,                    data.style.background__glow__strokeWidth,
                    data.style.background__glow_press__fill,              data.style.background__glow_press__stroke,              data.style.background__glow_press__strokeWidth,
                    data.style.background__glow_select__fill,             data.style.background__glow_select__stroke,             data.style.background__glow_select__strokeWidth,
                    data.style.background__glow_select_press__fill,       data.style.background__glow_select_press__stroke,       data.style.background__glow_select_press__strokeWidth,
                    data.style.background__hover__fill,                   data.style.background__hover__stroke,                   data.style.background__hover__strokeWidth,
                    data.style.background__hover_press__fill,             data.style.background__hover_press__stroke,             data.style.background__hover_press__strokeWidth,
                    data.style.background__hover_select__fill,            data.style.background__hover_select__stroke,            data.style.background__hover_select__strokeWidth,
                    data.style.background__hover_select_press__fill,      data.style.background__hover_select_press__stroke,      data.style.background__hover_select_press__strokeWidth,
                    data.style.background__hover_glow__fill,              data.style.background__hover_glow__stroke,              data.style.background__hover_glow__strokeWidth,
                    data.style.background__hover_glow_press__fill,        data.style.background__hover_glow_press__stroke,        data.style.background__hover_glow_press__strokeWidth,
                    data.style.background__hover_glow_select__fill,       data.style.background__hover_glow_select__stroke,       data.style.background__hover_glow_select__strokeWidth,
                    data.style.background__hover_glow_select_press__fill, data.style.background__hover_glow_select_press__stroke, data.style.background__hover_glow_select_press__strokeWidth,
                
                    data.onenter,
                    data.onleave,
                    data.onpress,
                    data.ondblpress,
                    data.onrelease,
                    data.onselect,
                    data.ondeselect,
            );
            case 'checkbox_rect': return this.element.control.checkbox_rect(
                name, data.x, data.y, data.width, data.height, data.angle, 
                data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
                data.onchange, 
            );
            case 'rastorgrid': return this.element.control.rastorgrid(
                name, data.x, data.y, data.width, data.height, data.xCount, data.yCount,
                data.style.backing, data.style.check, data.style.backingGlow, data.style.checkGlow,
                data.onchange
            );

        //dynamic
            case 'cable': return this.element.dynamic.cable(
                name, data.x1, data.y1, data.x2, data.y2,
                data.style.dimStyle, data.style.glowStyle,
            );
            case 'connectionNode_signal': return this.element.dynamic.connectionNode_signal(
                name, data.x, data.y, data.angle, data.width, data.height,
                data.style.dimStyle, data.style.glowStyle, data.style.cable_dimStyle, data.style.cable_glowStyle, 
                data.onchange, data.onconnect, data.ondisconnect,
            );
            case 'connectionNode_data': return this.element.dynamic.connectionNode_data(
                name, data.x, data.y, data.angle, data.width, data.height,
                data.style.dimStyle, data.style.glowStyle, data.style.cable_dimStyle, data.style.cable_glowStyle, 
                data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
            );
            case 'connectionNode_audio': return this.element.dynamic.connectionNode_audio(
                name, data.x, data.y, data.angle, data.width, data.height, data.isAudioOutput, canvas.library.audio.context,
                data.style.dimStyle, data.style.glowStyle, data.style.cable_dimStyle, data.style.cable_glowStyle, 
                data.onconnect, data.ondisconnect,
            );
    }
    
}