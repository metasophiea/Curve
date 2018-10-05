part.builder = function(type,name,data){
    if(!data){data={};}
    switch(type){
        //basic
            case 'g':      return part.element.basic.g(name, data.x, data.y, data.r, data.style); break;
            case 'line':   return part.element.basic.line(name, data.x1, data.y1, data.x2, data.y2, data.style); break;
            case 'rect':   return part.element.basic.rect(name, data.x, data.y, data.width, data.height, data.angle, data.style); break;
            case 'path':   return part.element.basic.path(name, data.path, data.lineType, data.style); break;
            case 'text':   return part.element.basic.text(name, data.x, data.y, data.text, data.angle, data.style); break;
            case 'circle': return part.element.basic.circle(name, data.x, data.y, data.r, data.angle, data.style); break;
            case 'canvas': return part.element.basic.canvas(name, data.x, data.y, data.width, data.height, data.angle, data.resolution); break;
    }

    if(data.style == undefined){data.style={};}
    switch(type){
        default: console.warn('Unknown element: '+ type); return null; break;

        //display
            case 'label': return part.element.display.label(name, data.x, data.y, data.text, data.style, data.angle); break;
            case 'level': return part.element.display.level(name, data.x, data.y, data.angle, data.width, data.height, data.style.backing, data.style.level); break;
            case 'meter_level': return part.element.display.meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
            case 'audio_meter_level': return part.element.display.audio_meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
            case 'sevenSegmentDisplay': return part.element.display.sevenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dim); break;
            case 'sixteenSegmentDisplay': return part.element.display.sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dim); break;
            case 'readout_sixteenSegmentDisplay': return part.element.display.readout_sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.count, data.angle, data.style.background, data.style.glow, data.style.dime); break;
            case 'rastorDisplay': return part.element.display.rastorDisplay(name, data.x, data.y, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage); break;
            case 'glowbox_rect': return part.element.display.glowbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim); break;
            case 'grapherSVG': return part.element.display.grapherSVG(name, data.x, data.y, data.width, data.height, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
            case 'grapherCanvas': return part.element.display.grapherCanvas(name, data.x, data.y, data.width, data.height, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
            case 'grapher_periodicWave': return part.element.display.grapher_periodicWave(name, data.x, data.y, data.width, data.height, data.graphType, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
            case 'grapher_audioScope': return part.element.display.grapher_audioScope(  name, data.x, data.y, data.width, data.height, data.graphType, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;

        //control
            case 'button_rect': 
                var temp = part.element.control.button_rect(
                    name,
                    data.x, data.y, data.width, data.height, data.angle, 
                    (data.text ? data.text : data.text_centre), data.text_left, data.text_right,
                    data.textVerticalOffset, data.textHorizontalOffset,
                    data.active, data.hoverable, data.selectable, data.pressable,
                    data.style.text, 
                    data.style.off,
                    data.style.up,                data.style.press,
                    data.style.select,            data.style.select_press,
                    data.style.glow,              data.style.glow_press,
                    data.style.glow_select,       data.style.glow_select_press,
                    data.style.hover,             data.style.hover_press,
                    data.style.hover_select,      data.style.hover_select_press,
                    data.style.hover_glow,        data.style.hover_glow_press,
                    data.style.hover_glow_select, data.style.hover_glow_select_press,
                );
                temp.onpress =    data.onpress    ? data.onpress    : temp.onpress;
                temp.onrelease =  data.onrelease  ? data.onrelease  : temp.onrelease;
                temp.ondblpress = data.ondblpress ? data.ondblpress : temp.ondblpress;
                temp.onenter =    data.onenter    ? data.onenter    : temp.onenter;
                temp.onleave =    data.onleave    ? data.onleave    : temp.onleave;
                temp.onselect =   data.onselect   ? data.onselect   : temp.onselect;
                temp.ondeselect = data.ondeselect ? data.ondeselect : temp.ondeselect;
                return temp;
            break;
            case 'checkbox_rect':
                var temp = part.element.control.checkbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow);
                temp.onchange = data.onchange ? data.onchange : temp.onchange;
                return temp;
            break;
            case 'slide':
                var temp = part.element.control.slide(name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.value, data.resetValue, data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle);
                temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                return temp;
            break;
            case 'slidePanel':
                var temp = part.element.control.slidePanel(name, data.x, data.y, data.width, data.height, data.count, data.angle, data.handleHeight, data.value, data.resetValue, data.style.handle, data.style.backing, data.style.slot);
                temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                return temp;
            break;
            case 'rangeslide':
                var temp = part.element.control.rangeslide(name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.spanWidth, data.values, data.resetValues, data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span);
                temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                return temp;
            break;
            case 'dial_continuous': 
                var temp = part.element.control.dial_continuous(
                    name,
                    data.x, data.y, data.r,
                    data.startAngle, data.maxAngle,
                    data.style.handle, data.style.slot, data.style.needle,
                    data.style.handle_glow, data.style.slot_glow, data.style.needle_glow,
                    data.arcDistance, data.style.outerArc, data.style.outerArc_glow,
                );
                temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                return temp;
            break;
            case 'dial_discrete':
                var temp = part.element.control.dial_discrete(
                    name,
                    data.x, data.y, data.r,
                    data.optionCount,
                    data.startAngle, data.maxAngle,
                    data.style.handle, data.style.slot, data.style.needle,
                    data.style.handle_glow, data.style.slot_glow, data.style.needle_glow,
                    data.arcDistance, data.style.outerArc, data.style.outerArc_glow,
                );
                temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                return temp;
            break;
            case 'rastorgrid':
                var temp = part.element.control.rastorgrid(
                    name,
                    data.x, data.y, data.width, data.height,
                    data.xCount, data.yCount,
                    data.style.backing,
                    data.style.check,
                    data.style.backingGlow,
                    data.style.checkGlow
                );
                temp.onchange = data.onchange ? data.onchange  : temp.onchange  ;
                return temp;
            break;
            case 'sequencer':
                var temp = part.element.control.sequencer(
                    name,
                    data.x, data.y, data.width, data.height, data.angle,
                    data.xCount, data.yCount,
                    data.zoomLevel_x, data.zoomLevel_y,
                    data.style.backing,
                    data.style.selectionArea,
                    data.style.block_body, data.style.block_bodyGlow, data.style.block_handle, data.style.block_handleWidth,
                    data.style.horizontalStrip_pattern, data.style.horizontalStrip_glow, data.style.horizontalStrip_styles,
                    data.style.verticalStrip_pattern,   data.style.verticalStrip_glow,   data.style.verticalStrip_styles,
                    data.style.playhead,
                );
                temp.onpan = data.onpan ? data.onpan : temp.onpan;
                temp.onchangeviewarea = data.onchangeviewarea ? data.onchangeviewarea : temp.onchangeviewarea;
                temp.event = data.event ? data.event : temp.event;
                return temp;
            break;
            case 'needleOverlay':
                var temp = part.element.control.needleOverlay(
                    name, data.x, data.y, data.width, data.height, data.angle,
                    data.needleWidth, data.selectNeedle, data.selectionArea,
                    data.needleStyles,
                );
                temp.onchange = data.onchange   ? data.onchange  : temp.onchange;
                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease;
                temp.selectionAreaToggle = data.selectionAreaToggle ? data.selectionAreaToggle : temp.selectionAreaToggle;
                return temp;
            break;
            case 'grapher_waveWorkspace':
                var temp = part.element.control.grapher_waveWorkspace(
                    name, data.x, data.y, data.width, data.height, data.angle, data.graphType, data.selectNeedle, data.selectionArea,
                    data.style.foreground,   data.style.foregroundText,
                    data.style.middleground, data.style.middlegroundText,
                    data.style.background,   data.style.backgroundText,
                );
                temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                temp.selectionAreaToggle = data.selectionAreaToggle ? data.selectionAreaToggle : temp.selectionAreaToggle ;
                return temp;
            break;
            case 'list':
                    var temp = part.element.control.list(
                        name, data.x, data.y, data.width, data.height, data.angle, data.list, 
                        data.selectable, data.multiSelect, data.hoverable, data.pressable, data.active,
                        data.itemHeightMux, data.itemSpacingMux, data.breakHeightMux, data.breakWidthMux, data.spaceHeightMux,
                        data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
                        data.style.listItemText,
                        data.style.backing,
                        data.style.break,
                        data.style.background_off,
                        data.style.background_up,                data.style.background_press,
                        data.style.background_select,            data.style.background_select_press,
                        data.style.background_glow,              data.style.background_glow_press,
                        data.style.background_glow_select,       data.style.background_glow_select_press,
                        data.style.background_hover,             data.style.background_hover_press,
                        data.style.background_hover_select,      data.style.background_hover_select_press,
                        data.style.background_hover_glow,        data.style.background_hover_glow_press,
                        data.style.background_hover_glow_select, data.style.background_hover_glow_select_press,
                    );
                    
                    temp.onenter = data.onenter ? data.onenter : temp.onenter;
                    temp.onleave = data.onleave ? data.onleave : temp.onleave;
                    temp.onpress = data.onpress ? data.onpress : temp.onpress;
                    temp.ondblpress = data.ondblpress ? data.ondblpress : temp.ondblpress;
                    temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease;
                    temp.onselection = data.onselection ? data.onselection : temp.onselection;
                    temp.onpositionchange = data.onpositionchange ? data.onpositionchange : temp.onpositionchange;
                    return temp;
            break;

        //dynamic
            case 'cable': return part.element.dynamic.cable(name, data.x1, data.y1, data.x2, data.y2, data.style.unactive, data.style.active); break;
            case 'connectionNode_audio': 
                if(Object.keys(data.style).length == 0){data.style = undefined;}
                return part.element.dynamic.connectionNode_audio(name, data.type, data.x, data.y, data.width, data.height, data.angle, system.audio.context, data.style);
            break;
            case 'connectionNode_data':
                if(Object.keys(data.style).length == 0){data.style = undefined;}
                var temp = part.element.dynamic.connectionNode_data(name, data.x, data.y, data.width, data.height, data.angle, data.style);
                temp.receive = data.receive ? data.receive : temp.receive;
                temp.give = data.give ? data.give : temp.give;
                return temp;
            break;
    }
}; 