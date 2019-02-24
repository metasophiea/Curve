this.builder = function(type,name,data){
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    switch(type){
        default: console.warn('Interface Part Builder :: Unknown element: '+ type); return null;  
        //basic
            case 'group': return this.collection.basic.group( name, data.x, data.y, data.angle, data.ignored );
            case 'rectangle': return this.collection.basic.rectangle( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour );
            case 'image': return this.collection.basic.image( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url );
            case 'canvas': return this.collection.basic.canvas( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.resolution );
            case 'polygon': return this.collection.basic.polygon( name, data.points, data.ignored, data.colour, data.pointsAsXYArray );
            case 'circle': return this.collection.basic.circle( name, data.x, data.y, data.radius, data.ignored, data.colour );
            case 'path': return this.collection.basic.path( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray );
    
        //display
            case 'glowbox_rect': return this.collection.display.glowbox_rect( name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim );
            case 'sevenSegmentDisplay': return this.collection.display.sevenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'sevenSegmentDisplay_static': return this.collection.display.sevenSegmentDisplay_static(
                name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'sixteenSegmentDisplay': return this.collection.display.sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height,  data.angle,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'sixteenSegmentDisplay_static': return this.collection.display.sixteenSegmentDisplay_static(
                name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                data.style.background, data.style.glow, data.style.dim
            );
            case 'readout_sixteenSegmentDisplay': return this.collection.display.readout_sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, data.count, data.angle, 
                data.style.background, data.style.glow, data.style.dim,
            );
            case 'readout_sixteenSegmentDisplay_static': return this.collection.display.readout_sixteenSegmentDisplay_static(
                name, data.x, data.y, data.width, data.height, data.count, data.angle, data.resolution,
                data.style.background, data.style.glow, data.style.dim,
            );
            case 'level': return this.collection.display.level(
                name, data.x, data.y, data.angle, data.width, data.height, 
                data.style.backing, data.style.levels
            );
            case 'meter_level': return this.collection.display.meter_level(
                name, data.x, data.y, data.angle, data.width, data.height, data.markings,
                data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
            );
            case 'audio_meter_level': return this.collection.display.audio_meter_level(
                name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
                data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
            );
            case 'rastorDisplay': return this.collection.display.rastorDisplay(
                name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
            );
            case 'grapher': return this.collection.display.grapher(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_static': return this.collection.display.grapher_static(
                name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_periodicWave': return this.collection.display.grapher_periodicWave(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_periodicWave_static': return this.collection.display.grapher_periodicWave_static(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_audioScope': return this.collection.display.grapher_audioScope(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );
            case 'grapher_audioScope_static': return this.collection.display.grapher_audioScope_static(
                name, data.x, data.y, data.width, data.height, data.angle,
                data.style.foregrounds, data.style.foregroundText,
                data.style.background_stroke, data.style.background_lineWidth,
                data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                data.style.backing,
            );

        //control
            //button
        //         case 'button_': return this.collection.control.button_(
        //             name, data.x, data.y, data.angle, data.interactable,
        //             data.active, data.hoverable, data.selectable, data.pressable,

        //             data.onenter,
        //             data.onleave,
        //             data.onpress,
        //             data.ondblpress,
        //             data.onrelease,
        //             data.onselect,
        //             data.ondeselect,
                    
        //             data.subject,
        //         );

        //         case 'button_image': return this.collection.control.button_image(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        //             data.active, data.hoverable, data.selectable, data.pressable,

        //             data.backingURL__off,
        //             data.backingURL__up,
        //             data.backingURL__press,
        //             data.backingURL__select,
        //             data.backingURL__select_press,
        //             data.backingURL__glow,
        //             data.backingURL__glow_press,
        //             data.backingURL__glow_select,
        //             data.backingURL__glow_select_press,
        //             data.backingURL__hover,
        //             data.backingURL__hover_press,
        //             data.backingURL__hover_select,
        //             data.backingURL__hover_select_press,
        //             data.backingURL__hover_glow,
        //             data.backingURL__hover_glow_press,
        //             data.backingURL__hover_glow_select,
        //             data.backingURL__hover_glow_select_press,
                
        //             data.onenter,
        //             data.onleave,
        //             data.onpress,
        //             data.ondblpress,
        //             data.onrelease,
        //             data.onselect,
        //             data.ondeselect,
        //         );
        //         case 'button_circle': return this.collection.control.button_circle(
        //             name, data.x, data.y, data.r, data.angle, data.interactable,
        //             data.text_centre,
        //             data.active, data.hoverable, data.selectable, data.pressable,

        //             data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,

        //             data.style.background__off__fill,                     data.style.background__off__stroke,                     data.style.background__off__strokeWidth,
        //             data.style.background__up__fill,                      data.style.background__up__stroke,                      data.style.background__up__strokeWidth,
        //             data.style.background__press__fill,                   data.style.background__press__stroke,                   data.style.background__press__strokeWidth,
        //             data.style.background__select__fill,                  data.style.background__select__stroke,                  data.style.background__select__strokeWidth,
        //             data.style.background__select_press__fill,            data.style.background__select_press__stroke,            data.style.background__select_press__strokeWidth,
        //             data.style.background__glow__fill,                    data.style.background__glow__stroke,                    data.style.background__glow__strokeWidth,
        //             data.style.background__glow_press__fill,              data.style.background__glow_press__stroke,              data.style.background__glow_press__strokeWidth,
        //             data.style.background__glow_select__fill,             data.style.background__glow_select__stroke,             data.style.background__glow_select__strokeWidth,
        //             data.style.background__glow_select_press__fill,       data.style.background__glow_select_press__stroke,       data.style.background__glow_select_press__strokeWidth,
        //             data.style.background__hover__fill,                   data.style.background__hover__stroke,                   data.style.background__hover__strokeWidth,
        //             data.style.background__hover_press__fill,             data.style.background__hover_press__stroke,             data.style.background__hover_press__strokeWidth,
        //             data.style.background__hover_select__fill,            data.style.background__hover_select__stroke,            data.style.background__hover_select__strokeWidth,
        //             data.style.background__hover_select_press__fill,      data.style.background__hover_select_press__stroke,      data.style.background__hover_select_press__strokeWidth,
        //             data.style.background__hover_glow__fill,              data.style.background__hover_glow__stroke,              data.style.background__hover_glow__strokeWidth,
        //             data.style.background__hover_glow_press__fill,        data.style.background__hover_glow_press__stroke,        data.style.background__hover_glow_press__strokeWidth,
        //             data.style.background__hover_glow_select__fill,       data.style.background__hover_glow_select__stroke,       data.style.background__hover_glow_select__strokeWidth,
        //             data.style.background__hover_glow_select_press__fill, data.style.background__hover_glow_select_press__stroke, data.style.background__hover_glow_select_press__strokeWidth,
                
        //             data.onenter,
        //             data.onleave,
        //             data.onpress,
        //             data.ondblpress,
        //             data.onrelease,
        //             data.onselect,
        //             data.ondeselect,
        //         );
        //         case 'button_polygon': return this.collection.control.button_polygon(
        //             name, data.x, data.y, data.points, data.angle, data.interactable,
        //             data.text_centre,
        //             data.active, data.hoverable, data.selectable, data.pressable,

        //             data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,

        //             data.style.background__off__fill,                     data.style.background__off__stroke,                     data.style.background__off__strokeWidth,
        //             data.style.background__up__fill,                      data.style.background__up__stroke,                      data.style.background__up__strokeWidth,
        //             data.style.background__press__fill,                   data.style.background__press__stroke,                   data.style.background__press__strokeWidth,
        //             data.style.background__select__fill,                  data.style.background__select__stroke,                  data.style.background__select__strokeWidth,
        //             data.style.background__select_press__fill,            data.style.background__select_press__stroke,            data.style.background__select_press__strokeWidth,
        //             data.style.background__glow__fill,                    data.style.background__glow__stroke,                    data.style.background__glow__strokeWidth,
        //             data.style.background__glow_press__fill,              data.style.background__glow_press__stroke,              data.style.background__glow_press__strokeWidth,
        //             data.style.background__glow_select__fill,             data.style.background__glow_select__stroke,             data.style.background__glow_select__strokeWidth,
        //             data.style.background__glow_select_press__fill,       data.style.background__glow_select_press__stroke,       data.style.background__glow_select_press__strokeWidth,
        //             data.style.background__hover__fill,                   data.style.background__hover__stroke,                   data.style.background__hover__strokeWidth,
        //             data.style.background__hover_press__fill,             data.style.background__hover_press__stroke,             data.style.background__hover_press__strokeWidth,
        //             data.style.background__hover_select__fill,            data.style.background__hover_select__stroke,            data.style.background__hover_select__strokeWidth,
        //             data.style.background__hover_select_press__fill,      data.style.background__hover_select_press__stroke,      data.style.background__hover_select_press__strokeWidth,
        //             data.style.background__hover_glow__fill,              data.style.background__hover_glow__stroke,              data.style.background__hover_glow__strokeWidth,
        //             data.style.background__hover_glow_press__fill,        data.style.background__hover_glow_press__stroke,        data.style.background__hover_glow_press__strokeWidth,
        //             data.style.background__hover_glow_select__fill,       data.style.background__hover_glow_select__stroke,       data.style.background__hover_glow_select__strokeWidth,
        //             data.style.background__hover_glow_select_press__fill, data.style.background__hover_glow_select_press__stroke, data.style.background__hover_glow_select_press__strokeWidth,
                
        //             data.onenter,
        //             data.onleave,
        //             data.onpress,
        //             data.ondblpress,
        //             data.onrelease,
        //             data.onselect,
        //             data.ondeselect,
        //         );
        //         case 'button_rectangle': return this.collection.control.button_rectangle(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        //             data.text_centre, data.text_left, data.text_right,
        //             data.textVerticalOffsetMux, data.textHorizontalOffsetMux,
        //             data.active, data.hoverable, data.selectable, data.pressable,

        //             data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,

        //             data.style.background__off__fill,                     data.style.background__off__stroke,                     data.style.background__off__strokeWidth,
        //             data.style.background__up__fill,                      data.style.background__up__stroke,                      data.style.background__up__strokeWidth,
        //             data.style.background__press__fill,                   data.style.background__press__stroke,                   data.style.background__press__strokeWidth,
        //             data.style.background__select__fill,                  data.style.background__select__stroke,                  data.style.background__select__strokeWidth,
        //             data.style.background__select_press__fill,            data.style.background__select_press__stroke,            data.style.background__select_press__strokeWidth,
        //             data.style.background__glow__fill,                    data.style.background__glow__stroke,                    data.style.background__glow__strokeWidth,
        //             data.style.background__glow_press__fill,              data.style.background__glow_press__stroke,              data.style.background__glow_press__strokeWidth,
        //             data.style.background__glow_select__fill,             data.style.background__glow_select__stroke,             data.style.background__glow_select__strokeWidth,
        //             data.style.background__glow_select_press__fill,       data.style.background__glow_select_press__stroke,       data.style.background__glow_select_press__strokeWidth,
        //             data.style.background__hover__fill,                   data.style.background__hover__stroke,                   data.style.background__hover__strokeWidth,
        //             data.style.background__hover_press__fill,             data.style.background__hover_press__stroke,             data.style.background__hover_press__strokeWidth,
        //             data.style.background__hover_select__fill,            data.style.background__hover_select__stroke,            data.style.background__hover_select__strokeWidth,
        //             data.style.background__hover_select_press__fill,      data.style.background__hover_select_press__stroke,      data.style.background__hover_select_press__strokeWidth,
        //             data.style.background__hover_glow__fill,              data.style.background__hover_glow__stroke,              data.style.background__hover_glow__strokeWidth,
        //             data.style.background__hover_glow_press__fill,        data.style.background__hover_glow_press__stroke,        data.style.background__hover_glow_press__strokeWidth,
        //             data.style.background__hover_glow_select__fill,       data.style.background__hover_glow_select__stroke,       data.style.background__hover_glow_select__strokeWidth,
        //             data.style.background__hover_glow_select_press__fill, data.style.background__hover_glow_select_press__stroke, data.style.background__hover_glow_select_press__strokeWidth,
                
        //             data.onenter,
        //             data.onleave,
        //             data.onpress,
        //             data.ondblpress,
        //             data.onrelease,
        //             data.onselect,
        //             data.ondeselect,
        //         );
        //     //dial
        //         case 'dial_continuous': return this.collection.control.dial_continuous(
        //             name,
        //             data.x, data.y, data.r, data.angle, data.interactable,
        //             data.value, data.resetValue,
        //             data.startAngle, data.maxAngle,
        //             data.style.handle, data.style.slot, data.style.needle,
        //             data.onchange, data.onrelease
        //         );
        //         case 'dial_discrete': return this.collection.control.dial_discrete(
        //             name,
        //             data.x, data.y, data.r, data.angle, data.interactable,
        //             data.value, data.resetValue, data.optionCount,
        //             data.startAngle, data.maxAngle,
        //             data.style.handle, data.style.slot, data.style.needle,
        //             data.onchange, data.onrelease
        //         );
        //         case 'dial_continuous_image': return this.collection.control.dial_continuous_image(
        //             name,
        //             data.x, data.y, data.r, data.angle, data.interactable,
        //             data.value, data.resetValue,
        //             data.startAngle, data.maxAngle,
        //             data.handleURL, data.slotURL, data.needleURL,
        //             data.onchange, data.onrelease
        //         );
        //         case 'dial_discrete_image': return this.collection.control.dial_discrete_image(
        //             name,
        //             data.x, data.y, data.r, data.angle, data.interactable,
        //             data.value, data.resetValue, data.optionCount,
        //             data.startAngle, data.maxAngle,
        //             data.handleURL, data.slotURL, data.needleURL,
        //             data.onchange, data.onrelease
        //         );
            //slide
                case 'slide': return this.collection.control.slide(
                    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
                    data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                    data.onchange, data.onrelease
                );
        //         case 'slide_image': return this.collection.control.slide_image(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
        //             data.handleURL, data.backingURL, data.slotURL, data.style.invisibleHandle,
        //             data.onchange, data.onrelease
        //         );
        //         case 'slidePanel': return this.collection.control.slidePanel(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
        //             data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
        //             data.onchange, data.onrelease
        //         );
        //         case 'slidePanel_image': return this.collection.control.slidePanel(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
        //             data.handleURL, data.backingURL, data.slotURL, data.overlayURL, data.style.invisibleHandle,
        //             data.onchange, data.onrelease
        //         );
        //         case 'rangeslide': return this.collection.control.rangeslide(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
        //             data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
        //             data.onchange, data.onrelease
        //         );
        //         case 'rangeslide_image': return this.collection.control.rangeslide_image(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
        //             data.handleURL, data.backingURL, data.slotURL, data.style.invisibleHandle, data.spanURL,
        //             data.onchange, data.onrelease
        //         );
        //     //list
        //         case 'list': return this.collection.control.list(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.list,
        //             data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
        //             data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,

        //             data.itemHeightMux, data.itemWidthMux, data.itemSpacingMux, 
        //             data.breakHeightMux, data.breakWidthMux, 
        //             data.spacingHeightMux,

        //             data.style.backing, data.style.break,
        //             data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,
        //             data.style.item__off__fill,                     data.style.item__off__stroke,                     data.style.item__off__strokeWidth,
        //             data.style.item__up__fill,                      data.style.item__up__stroke,                      data.style.item__up__strokeWidth,
        //             data.style.item__press__fill,                   data.style.item__press__stroke,                   data.style.item__press__strokeWidth,
        //             data.style.item__select__fill,                  data.style.item__select__stroke,                  data.style.item__select__strokeWidth,
        //             data.style.item__select_press__fill,            data.style.item__select_press__stroke,            data.style.item__select_press__strokeWidth,
        //             data.style.item__glow__fill,                    data.style.item__glow__stroke,                    data.style.item__glow__strokeWidth,
        //             data.style.item__glow_press__fill,              data.style.item__glow_press__stroke,              data.style.item__glow_press__strokeWidth,
        //             data.style.item__glow_select__fill,             data.style.item__glow_select__stroke,             data.style.item__glow_select__strokeWidth,
        //             data.style.item__glow_select_press__fill,       data.style.item__glow_select_press__stroke,       data.style.item__glow_select_press__strokeWidth,
        //             data.style.item__hover__fill,                   data.style.item__hover__stroke,                   data.style.item__hover__strokeWidth,
        //             data.style.item__hover_press__fill,             data.style.item__hover_press__stroke,             data.style.item__hover_press__strokeWidth,
        //             data.style.item__hover_select__fill,            data.style.item__hover_select__stroke,            data.style.item__hover_select__strokeWidth,
        //             data.style.item__hover_select_press__fill,      data.style.item__hover_select_press__stroke,      data.style.item__hover_select_press__strokeWidth,
        //             data.style.item__hover_glow__fill,              data.style.item__hover_glow__stroke,              data.style.item__hover_glow__strokeWidth,
        //             data.style.item__hover_glow_press__fill,        data.style.item__hover_glow_press__stroke,        data.style.item__hover_glow_press__strokeWidth,
        //             data.style.item__hover_glow_select__fill,       data.style.item__hover_glow_select__stroke,       data.style.item__hover_glow_select__strokeWidth,
        //             data.style.item__hover_glow_select_press__fill, data.style.item__hover_glow_select_press__stroke, data.style.item__hover_glow_select_press__strokeWidth,
                
        //             data.onenter, data.onleave, data.onpress, data.ondblpress, data.onrelease, data.onselection, data.onpositionchange,
        //         );
        //         case 'list_image': return this.collection.control.list_image(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.list,
        //             data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
        //             data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,

        //             data.itemHeightMux, data.itemWidthMux, data.itemSpacingMux, 
        //             data.breakHeightMux, data.breakWidthMux, 
        //             data.spacingHeightMux,

        //             data.backingURL, data.breakURL,

        //             data.itemURL__off,
        //             data.itemURL__up,
        //             data.itemURL__press,
        //             data.itemURL__select,
        //             data.itemURL__select_press,
        //             data.itemURL__glow,
        //             data.itemURL__glow_press,
        //             data.itemURL__glow_select,
        //             data.itemURL__glow_select_press,
        //             data.itemURL__hover,
        //             data.itemURL__hover_press,
        //             data.itemURL__hover_select,
        //             data.itemURL__hover_select_press,
        //             data.itemURL__hover_glow,
        //             data.itemURL__hover_glow_press,
        //             data.itemURL__hover_glow_select,
        //             data.itemURL__hover_glow_select_press,
                
        //             data.onenter, data.onleave, data.onpress, data.ondblpress, data.onrelease, data.onselection, data.onpositionchange,
        //         );
        //     //checkbox
        //         case 'checkbox_': return this.collection.control.checkbox_(
        //             name, data.x, data.y, data.angle, data.interactable,
        //             data.onchange, data.subject,
        //         );
        //         case 'checkbox_circle': return this.collection.control.checkbox_circle(
        //             name, data.x, data.y, data.r, data.angle, data.interactable,
        //             data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
        //             data.onchange,
        //         );
        //         case 'checkbox_image': return this.collection.control.checkbox_image(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        //             data.uncheckURL, data.checkURL,
        //             data.onchange,
        //         );
        //         case 'checkbox_polygon': return this.collection.control.checkbox_polygon(
        //             name, data.x, data.y, data.outterPoints, data.innerPoints, data.angle, data.interactable,
        //             data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
        //             data.onchange,
        //         );
        //         case 'checkbox_rect': case 'checkbox_rectangle': return this.collection.control.checkbox_rectangle(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        //             data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
        //             data.onchange,
        //         );
        //     //other
        //         case 'rastorgrid': return this.collection.control.rastorgrid(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.xCount, data.yCount,
        //             data.style.backing, data.style.check, data.style.backingGlow, data.style.checkGlow,
        //             data.onchange
        //         );
        //         case 'needleOverlay': return this.collection.control.needleOverlay(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        //             data.needleWidth, data.selectNeedle, data.selectionArea, data.style.needles,
        //             data.onchange, data.onrelease, data.selectionAreaToggle,
        //         );
        //         case 'grapher_waveWorkspace': return this.collection.control.grapher_waveWorkspace(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.selectNeedle, data.selectionArea,
        //             data.style.foregrounds, data.style.foregroundText,
        //             data.style.background_stroke, data.style.background_lineWidth,
        //             data.style.backgroundText_fill, data.style.backgroundText_font,
        //             data.style.backing,
        //             data.onchange, data.onrelease, data.selectionAreaToggle
        //         );
        //         case 'sequencer': return this.collection.control.sequencer(
        //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,             
        //             data.xCount, data.yCount, data.zoomLevel_x, data.zoomLevel_y,
        //             data.backingStyle, data.selectionAreaStyle,
        //             data.blockStyle_body, data.blockStyle_bodyGlow, data.blockStyle_handle, data.blockStyle_handleWidth,
        //             data.horizontalStripStyle_pattern, data.horizontalStripStyle_glow, data.horizontalStripStyle_styles,
        //             data.verticalStripStyle_pattern,   data.verticalStripStyle_glow,   data.verticalStripStyle_styles,
        //             data.playheadStyle,
        //             data.onpan, data.onchangeviewarea, data.event,
        //         );

        // //dynamic
        //     case 'cable': return this.collection.dynamic.cable(
        //         name, data.x1, data.y1, data.x2, data.y2,
        //         data.style.dim, data.style.glow,
        //     );
        //     case 'connectionNode': return this.collection.dynamic.connectionNode(
        //         name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction, data.allowConnections, data.allowDisconnections,
        //         data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        //         data.onconnect, data.ondisconnect,
        //     );
        //     case 'connectionNode_signal': return this.collection.dynamic.connectionNode_signal(
        //         name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        //         data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        //         data.onchange, data.onconnect, data.ondisconnect,
        //     );
        //     case 'connectionNode_voltage': return this.collection.dynamic.connectionNode_voltage(
        //         name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        //         data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        //         data.onchange, data.onconnect, data.ondisconnect,
        //     );
        //     case 'connectionNode_data': return this.collection.dynamic.connectionNode_data(
        //         name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        //         data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        //         data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
        //     );
        //     case 'connectionNode_audio': return this.collection.dynamic.connectionNode_audio(
        //         name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections, data.isAudioOutput, workspace.library.audio.context,
        //         data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        //         data.onconnect, data.ondisconnect,
        //     );
    }
}