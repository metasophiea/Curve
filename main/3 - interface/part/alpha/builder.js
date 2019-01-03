this.builder = function(type,name,data){
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    switch(type){
        default: console.warn('Unknown element: '+ type); return null;  
        //basic
            case 'group': return this.basic.group(
                name, data.x, data.y, data.angle, data.ignored,
            );
            case 'rectangle': return this.basic.rectangle(
                name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin,
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'image': return this.basic.image(
                name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url
            );
            case 'canvas': return this.basic.canvas(
                name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.resolution
            );
            case 'polygon': return this.basic.polygon(
                name, data.points, data.ignored,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'text': return this.basic.text(
                name, data.x, data.y, data.text, data.angle, data.anchor, data.size, data.ignored,
                data.style.font, data.style.textAlign, data.style.textBaseline,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'circle': return this.basic.circle(
                name, data.x, data.y, data.r, data.ignored,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'path': return this.basic.path(
                name, data.points, data.ignored,
                data.style.stroke, data.style.lineWidth, data.style.lineCap, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
    
        //display
            case 'glowbox_rect': return this.display.glowbox_rect(
                name, data.x, data.y, data.width, data.height, data.angle, 
                data.style.glow, data.style.dim
            );
            case 'sevenSegmentDisplay': return this.display.sevenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'sevenSegmentDisplay_static': return this.display.sevenSegmentDisplay_static(
                name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'sixteenSegmentDisplay': return this.display.sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height,  data.angle,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'sixteenSegmentDisplay_static': return this.display.sixteenSegmentDisplay_static(
                name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'readout_sixteenSegmentDisplay': return this.display.readout_sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, data.count, data.angle, 
                data.style.background, data.style.glow, data.style.dim,
            );
            case 'readout_sixteenSegmentDisplay_static': return this.display.readout_sixteenSegmentDisplay_static(
                name, data.x, data.y, data.width, data.height, data.count, data.angle, data.resolution,
                data.style.background, data.style.glow, data.style.dim,
            );
            case 'level': return this.display.level(
                name, data.x, data.y, data.angle, data.width, data.height, 
                data.style.backing, data.style.levels
            );
            case 'meter_level': return this.display.meter_level(
                name, data.x, data.y, data.angle, data.width, data.height, data.markings,
                data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
            );
            case 'audio_meter_level': return this.display.audio_meter_level(
                name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
                data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
            );
            case 'rastorDisplay': return this.display.rastorDisplay(
                name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
            );
            case 'grapher': return this.display.grapher(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_static': return this.display.grapher_static(
                name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_periodicWave': return this.display.grapher_periodicWave(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_periodicWave_static': return this.display.grapher_periodicWave_static(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_audioScope': return this.display.grapher_audioScope(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_audioScope_static': return this.display.grapher_audioScope_static(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );

        //control
            case 'slide': return this.control.slide(
                name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.value, data.resetValue, 
                data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                data.onchange, data.onrelease
            );
            case 'slidePanel': return this.control.slidePanel(
                name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.count, data.value, data.resetValue, 
                data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                data.onchange, data.onrelease
            );
            case 'rangeslide': return this.control.rangeslide(
                name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
                data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
                data.onchange, data.onrelease
            );
            case 'dial_continuous': return this.control.dial_continuous(
                    name,
                    data.x, data.y, data.r, data.angle,
                    data.value, data.resetValue,
                    data.startAngle, data.maxAngle,
                    data.style.handle, data.style.slot, data.style.needle,
                    data.onchange, data.onrelease
            );
            case 'dial_discrete': return this.control.dial_discrete(
                    name,
                    data.x, data.y, data.r, data.angle,
                    data.value, data.resetValue, data.optionCount,
                    data.startAngle, data.maxAngle,
                    data.style.handle, data.style.slot, data.style.needle,
                    data.onchange, data.onrelease
            );
            case 'button_rect': return this.control.button_rect(
                    name, data.x, data.y, data.width, data.height, data.angle,
                    data.text_centre, data.text_left, data.text_right,
                    data.textVerticalOffsetMux, data.textHorizontalOffsetMux,
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
            case 'list': return this.control.list(
                name, data.x, data.y, data.width, data.height, data.angle, data.list,
                data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
                data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,

                data.itemHeightMux, data.itemWidthMux, data.itemSpacingMux, 
                data.breakHeightMux, data.breakWidthMux, 
                data.spacingHeightMux,

                data.style.backing, data.style.break,
                data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,
                data.style.item__off__fill,                     data.style.item__off__stroke,                     data.style.item__off__strokeWidth,
                data.style.item__up__fill,                      data.style.item__up__stroke,                      data.style.item__up__strokeWidth,
                data.style.item__press__fill,                   data.style.item__press__stroke,                   data.style.item__press__strokeWidth,
                data.style.item__select__fill,                  data.style.item__select__stroke,                  data.style.item__select__strokeWidth,
                data.style.item__select_press__fill,            data.style.item__select_press__stroke,            data.style.item__select_press__strokeWidth,
                data.style.item__glow__fill,                    data.style.item__glow__stroke,                    data.style.item__glow__strokeWidth,
                data.style.item__glow_press__fill,              data.style.item__glow_press__stroke,              data.style.item__glow_press__strokeWidth,
                data.style.item__glow_select__fill,             data.style.item__glow_select__stroke,             data.style.item__glow_select__strokeWidth,
                data.style.item__glow_select_press__fill,       data.style.item__glow_select_press__stroke,       data.style.item__glow_select_press__strokeWidth,
                data.style.item__hover__fill,                   data.style.item__hover__stroke,                   data.style.item__hover__strokeWidth,
                data.style.item__hover_press__fill,             data.style.item__hover_press__stroke,             data.style.item__hover_press__strokeWidth,
                data.style.item__hover_select__fill,            data.style.item__hover_select__stroke,            data.style.item__hover_select__strokeWidth,
                data.style.item__hover_select_press__fill,      data.style.item__hover_select_press__stroke,      data.style.item__hover_select_press__strokeWidth,
                data.style.item__hover_glow__fill,              data.style.item__hover_glow__stroke,              data.style.item__hover_glow__strokeWidth,
                data.style.item__hover_glow_press__fill,        data.style.item__hover_glow_press__stroke,        data.style.item__hover_glow_press__strokeWidth,
                data.style.item__hover_glow_select__fill,       data.style.item__hover_glow_select__stroke,       data.style.item__hover_glow_select__strokeWidth,
                data.style.item__hover_glow_select_press__fill, data.style.item__hover_glow_select_press__stroke, data.style.item__hover_glow_select_press__strokeWidth,
            
                data.onenter, data.onleave, data.onpress, data.ondblpress, data.onrelease, data.onselection, data.onpositionchange,
            );
            case 'checkbox_rect': return this.control.checkbox_rect(
                name, data.x, data.y, data.width, data.height, data.angle, 
                data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
                data.onchange, 
            );
            case 'rastorgrid': return this.control.rastorgrid(
                name, data.x, data.y, data.width, data.height, data.angle, data.xCount, data.yCount,
                data.style.backing, data.style.check, data.style.backingGlow, data.style.checkGlow,
                data.onchange
            );
            case 'needleOverlay': return this.control.needleOverlay(
                name, data.x, data.y, data.width, data.height, data.angle, 
                data.needleWidth, data.selectNeedle, data.selectionArea, data.style.needles,
                data.onchange, data.onrelease, data.selectionAreaToggle,
            );
            case 'grapher_waveWorkspace': return this.control.grapher_waveWorkspace(
                name, data.x, data.y, data.width, data.height, data.angle, data.selectNeedle, data.selectionArea,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_font,
                data.style.backing,
                data.onchange, data.onrelease, data.selectionAreaToggle
            );
            case 'sequencer': return this.control.sequencer(
                name, data.x, data.y, data.width, data.height, data.angle,                
                data.xCount, data.yCount, data.zoomLevel_x, data.zoomLevel_y,
                data.backingStyle, data.selectionAreaStyle,
                data.blockStyle_body, data.blockStyle_bodyGlow, data.blockStyle_handle, data.blockStyle_handleWidth,
                data.horizontalStripStyle_pattern, data.horizontalStripStyle_glow, data.horizontalStripStyle_styles,
                data.verticalStripStyle_pattern,   data.verticalStripStyle_glow,   data.verticalStripStyle_styles,
                data.playheadStyle,
                data.onpan, data.onchangeviewarea, data.event,
            );

        //dynamic
            case 'cable': return this.dynamic.cable(
                name, data.x1, data.y1, data.x2, data.y2,
                data.style.dim, data.style.glow,
            );
            case 'connectionNode': return this.dynamic.connectionNode(
                name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction,
                data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                data.onconnect, data.ondisconnect,
            );
            case 'connectionNode_signal': return this.dynamic.connectionNode_signal(
                name, data.x, data.y, data.angle, data.width, data.height,
                data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                data.onchange, data.onconnect, data.ondisconnect,
            );
            case 'connectionNode_voltage': return this.dynamic.connectionNode_voltage(
                name, data.x, data.y, data.angle, data.width, data.height,
                data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                data.onchange, data.onconnect, data.ondisconnect,
            );
            case 'connectionNode_data': return this.dynamic.connectionNode_data(
                name, data.x, data.y, data.angle, data.width, data.height,
                data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
            );
            case 'connectionNode_audio': return this.dynamic.connectionNode_audio(
                name, data.x, data.y, data.angle, data.width, data.height, data.isAudioOutput, workspace.library.audio.context,
                data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                data.onconnect, data.ondisconnect,
            );
    }
}