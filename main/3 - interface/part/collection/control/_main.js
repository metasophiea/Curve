{{include:*}} /**/

interfacePart.partLibrary.control = {};
















//button
    interfacePart.partLibrary.control.button_ = function(name,data){ return interfacePart.collection.control.button_(
        name, data.x, data.y, data.angle, data.interactable,
        data.active, data.hoverable, data.selectable, data.pressable,

        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselect,
        data.ondeselect,
        
        data.subject,
    ); };
    interfacePart.partLibrary.control.button_image = function(name,data){ return interfacePart.collection.control.button_image(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        data.active, data.hoverable, data.selectable, data.pressable,

        data.backingURL__off,
        data.backingURL__up,
        data.backingURL__press,
        data.backingURL__select,
        data.backingURL__select_press,
        data.backingURL__glow,
        data.backingURL__glow_press,
        data.backingURL__glow_select,
        data.backingURL__glow_select_press,
        data.backingURL__hover,
        data.backingURL__hover_press,
        data.backingURL__hover_select,
        data.backingURL__hover_select_press,
        data.backingURL__hover_glow,
        data.backingURL__hover_glow_press,
        data.backingURL__hover_glow_select,
        data.backingURL__hover_glow_select_press,
    
        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselect,
        data.ondeselect,
    ); };
    interfacePart.partLibrary.control.button_circle = function(name,data){ return interfacePart.collection.control.button_circle(
        name, data.x, data.y, data.r, data.angle, data.interactable,
        data.text_centre,
        data.active, data.hoverable, data.selectable, data.pressable,

        data.style.text_font, data.style.text_size, data.style.text_colour, data.style.text_spacing, data.style.text_interCharacterSpacing,

        data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
        data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
        data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
        data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
        data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
        data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
        data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
        data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
        data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
        data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
        data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
        data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
        data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
        data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
        data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
        data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
        data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,
    
        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselect,
        data.ondeselect,
    ); };
    interfacePart.partLibrary.control.button_polygon = function(name,data){ return interfacePart.collection.control.button_polygon(
        name, data.x, data.y, data.points, data.angle, data.interactable,
        data.text_centre,
        data.active, data.hoverable, data.selectable, data.pressable,

        data.style.text_font, data.style.text_size, data.style.text_colour, data.style.text_spacing, data.style.text_interCharacterSpacing,

        data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
        data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
        data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
        data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
        data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
        data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
        data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
        data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
        data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
        data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
        data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
        data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
        data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
        data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
        data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
        data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
        data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,
    
        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselect,
        data.ondeselect,
    ); };
    interfacePart.partLibrary.control.button_rectangle = function(name,data){ return interfacePart.collection.control.button_rectangle(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        data.text_centre, data.text_left, data.text_right,
        data.textVerticalOffsetMux, data.textHorizontalOffsetMux,
        data.active, data.hoverable, data.selectable, data.pressable,

        data.style.text_font, data.style.text_size, data.style.text_colour, data.style.text_spacing, data.style.text_interCharacterSpacing,

        data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
        data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
        data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
        data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
        data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
        data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
        data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
        data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
        data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
        data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
        data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
        data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
        data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
        data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
        data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
        data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
        data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,
    
        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselect,
        data.ondeselect,
    ); };
















//dial
    interfacePart.partLibrary.control.dial_1_continuous = function(name,data){ return interfacePart.collection.control.dial_1_continuous(
        name,
        data.x, data.y, data.radius, data.angle, data.interactable,
        data.value, data.resetValue,
        data.startAngle, data.maxAngle,
        data.style.handle, data.style.slot, data.style.needle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.dial_continuous = interfacePart.partLibrary.control.dial_1_continuous;
    interfacePart.partLibrary.control.dial_2_continuous = function(name,data){ return interfacePart.collection.control.dial_2_continuous(
        name,
        data.x, data.y, data.radius, data.angle, data.interactable,
        data.value, data.resetValue,
        data.startAngle, data.maxAngle,
        data.style.handle, data.style.slot, data.style.needle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.dial_1_discrete = function(name,data){ return interfacePart.collection.control.dial_1_discrete(
        name,
        data.x, data.y, data.radius, data.angle, data.interactable,
        data.value, data.resetValue, data.optionCount,
        data.startAngle, data.maxAngle,
        data.style.handle, data.style.slot, data.style.needle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.dial_discrete = interfacePart.partLibrary.control.dial_1_discrete;
    interfacePart.partLibrary.control.dial_2_discrete = function(name,data){ return interfacePart.collection.control.dial_2_discrete(
        name,
        data.x, data.y, data.radius, data.angle, data.interactable,
        data.value, data.resetValue, data.optionCount,
        data.startAngle, data.maxAngle,
        data.style.handle, data.style.slot, data.style.needle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.dial_continuous_image = function(name,data){ return interfacePart.collection.control.dial_continuous_image(
        name,
        data.x, data.y, data.radius, data.angle, data.interactable,
        data.value, data.resetValue,
        data.startAngle, data.maxAngle,
        data.handleURL, data.slotURL, data.needleURL,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.dial_discrete_image = function(name,data){ return interfacePart.collection.control.dial_discrete_image(
        name,
        data.x, data.y, data.radius, data.angle, data.interactable,
        data.value, data.resetValue, data.optionCount,
        data.startAngle, data.maxAngle,
        data.handleURL, data.slotURL, data.needleURL,
        data.onchange, data.onrelease
    ); };
















//slide
    interfacePart.partLibrary.control.slide_continuous = function(name,data){ return interfacePart.collection.control.slide_continuous(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.slide_continuous_image = function(name,data){ return interfacePart.collection.control.slide_continuous_image(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
        data.handleURL, data.backingURL, data.style.invisibleHandle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.slide = function(name,data){ 
        console.warn('depreciated - please use slide_continuous instead');
        return interfacePart.partLibrary.control.slide_continuous(name,data);
    };
    interfacePart.partLibrary.control.slide_image = function(name,data){ 
        console.warn('depreciated - please use slide_continuous_image instead');
        return interfacePart.partLibrary.control.slide_continuous_image(name,data);
    };
    interfacePart.partLibrary.control.slide_discrete = function(name,data){ return interfacePart.collection.control.slide_discrete(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, data.optionCount,
        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.slide_discrete_image = function(name,data){ return interfacePart.collection.control.slide_discrete_image(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, data.optionCount,
        data.handleURL, data.backingURL, data.invisibleHandle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.slidePanel = function(name,data){ return interfacePart.collection.control.slidePanel(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.slidePanel_image = function(name,data){ return interfacePart.collection.control.slidePanel_image(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
        data.handleURL, data.backingURL, data.overlayURL, data.style.invisibleHandle,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.rangeslide = function(name,data){ return interfacePart.collection.control.rangeslide(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
        data.onchange, data.onrelease
    ); };
    interfacePart.partLibrary.control.rangeslide_image = function(name,data){ return interfacePart.collection.control.rangeslide_image(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
        data.handleURL, data.backingURL, data.style.invisibleHandle, data.spanURL,
        data.onchange, data.onrelease
    ); };
















//list
    interfacePart.partLibrary.control.list = function(name,data){ return interfacePart.collection.control.list(
        name, data.x, data.y, data.angle, data.interactable, data.list,
        data.limitHeightTo, data.limitWidthTo,

        data.itemHeight, data.itemWidth, data.itemSpacingHeight, data.spacingHeight, data.breakHeight,
        data.textbreak_fontSize, data.textbreak_colour,
        data.item_textSize, data.item_textColour, data.item_textFont, data.item_textSpacing, data.item_textInterCharacterSpacing,
        data.sublist_arrowSize, data.sublist_arrowColour,
        data.item_textVerticalOffsetMux, data.item_textHorizontalOffsetMux,

        data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,
    
        data.style.backing_style,
        data.style.break_style,
        
        data.style.item__off__colour,                     data.style.item__off__lineColour,                     data.style.item__off__lineThickness,
        data.style.item__up__colour,                      data.style.item__up__lineColour,                      data.style.item__up__lineThickness,
        data.style.item__press__colour,                   data.style.item__press__lineColour,                   data.style.item__press__lineThickness,
        data.style.item__select__colour,                  data.style.item__select__lineColour,                  data.style.item__select__lineThickness,
        data.style.item__select_press__colour,            data.style.item__select_press__lineColour,            data.style.item__select_press__lineThickness,
        data.style.item__glow__colour,                    data.style.item__glow__lineColour,                    data.style.item__glow__lineThickness,
        data.style.item__glow_press__colour,              data.style.item__glow_press__lineColour,              data.style.item__glow_press__lineThickness,
        data.style.item__glow_select__colour,             data.style.item__glow_select__lineColour,             data.style.item__glow_select__lineThickness,
        data.style.item__glow_select_press__colour,       data.style.item__glow_select_press__lineColour,       data.style.item__glow_select_press__lineThickness,
        data.style.item__hover__colour,                   data.style.item__hover__lineColour,                   data.style.item__hover__lineThickness,
        data.style.item__hover_press__colour,             data.style.item__hover_press__lineColour,             data.style.item__hover_press__lineThickness,
        data.style.item__hover_select__colour,            data.style.item__hover_select__lineColour,            data.style.item__hover_select__lineThickness,
        data.style.item__hover_select_press__colour,      data.style.item__hover_select_press__lineColour,      data.style.item__hover_select_press__lineThickness,
        data.style.item__hover_glow__colour,              data.style.item__hover_glow__lineColour,              data.style.item__hover_glow__lineThickness,
        data.style.item__hover_glow_press__colour,        data.style.item__hover_glow_press__lineColour,        data.style.item__hover_glow_press__lineThickness,
        data.style.item__hover_glow_select__colour,       data.style.item__hover_glow_select__lineColour,       data.style.item__hover_glow_select__lineThickness,
        data.style.item__hover_glow_select_press__colour, data.style.item__hover_glow_select_press__lineColour, data.style.item__hover_glow_select_press__lineThickness,
    
        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselection,
        data.onpositionchange,
    ); };
    interfacePart.partLibrary.control.list_image = function(name,data){ return interfacePart.collection.control.list_image(
        name, data.x, data.y, data.angle, data.interactable, data.list,
        data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,
        data.limitHeightTo, data.limitWidthTo,

        data.itemHeight, data.itemWidth, data.itemSpacingHeight, data.spacingHeight, data.breakHeight,
    
        data.backingURL, 
        data.breakURL,
        data.textbreakURL,
        data.sublist__up,
        data.sublist__hover,
        data.sublist__glow,
        data.sublist__hover_glow,
        data.sublist__hover_glow_press,

        data.checkbox_uncheckURL, 
        data.checkbox_checkURL, 
        data.checkbox_uncheckGlowURL, 
        data.checkbox_checkGlowURL,
        
        data.itemURL__off,
        data.itemURL__up,
        data.itemURL__press,
        data.itemURL__select,
        data.itemURL__select_press,
        data.itemURL__glow,
        data.itemURL__glow_press,
        data.itemURL__glow_select,
        data.itemURL__glow_select_press,
        data.itemURL__hover,
        data.itemURL__hover_press,
        data.itemURL__hover_select,
        data.itemURL__hover_select_press,
        data.itemURL__hover_glow,
        data.itemURL__hover_glow_press,
        data.itemURL__hover_glow_select,
        data.itemURL__hover_glow_select_press,
    
        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselection,
        data.onpositionchange,
    ); };
















//checkbox
    interfacePart.partLibrary.control.checkbox_ = function(name,data){ return interfacePart.collection.control.checkbox_(
        name, data.x, data.y, data.angle, data.interactable,
        data.onchange, data.subject,
    ); };
    interfacePart.partLibrary.control.checkbox_circle = function(name,data){ return interfacePart.collection.control.checkbox_circle(
        name, data.x, data.y, data.radius, data.angle, data.interactable,
        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
        data.onchange,
    ); };
    interfacePart.partLibrary.control.checkbox_image = function(name,data){ return interfacePart.collection.control.checkbox_image(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        data.uncheckURL, data.checkURL, data.uncheckGlowURL, data.checkGlowURL,
        data.onchange,
    ); };
    interfacePart.partLibrary.control.checkbox_polygon = function(name,data){ return interfacePart.collection.control.checkbox_polygon(
        name, data.x, data.y, data.outterPoints, data.innerPoints, data.angle, data.interactable,
        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
        data.onchange,
    ); };
    interfacePart.partLibrary.control.checkbox_rectangle = function(name,data){ return interfacePart.collection.control.checkbox_rectangle(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
        data.onchange,
    ); };
    interfacePart.partLibrary.control.rastorgrid = function(name,data){ return interfacePart.collection.control.rastorgrid(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.xCount, data.yCount,
        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
        data.onchange
    ); };
















    interfacePart.partLibrary.control.needleOverlay = function(name,data){ return interfacePart.collection.control.needleOverlay(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
        data.needleWidth, data.selectNeedle, data.selectionArea, data.style.needles,
        data.onchange, data.onrelease, data.selectionAreaToggle,
    ); };




    interfacePart.partLibrary.control.grapher_waveWorkspace = function(name,data){ return interfacePart.collection.control.grapher_waveWorkspace(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.selectNeedle, data.selectionArea,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
        data.onchange, data.onrelease, data.selectionAreaToggle
    ); };


    

    interfacePart.partLibrary.control.sequencer = function(name,data){ return interfacePart.collection.control.sequencer(
        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,             
        data.xCount, data.yCount, data.zoomLevel_x, data.zoomLevel_y,
        data.backingStyle, data.selectionAreaStyle,
        data.blockStyle_body, data.blockStyle_bodyGlow, data.blockStyle_handle, data.blockStyle_handleWidth,
        data.horizontalStripStyle_pattern, data.horizontalStripStyle_glow, data.horizontalStripStyle_styles,
        data.verticalStripStyle_pattern,   data.verticalStripStyle_glow,   data.verticalStripStyle_styles,
        data.playheadStyle,
        data.onpan, data.onchangeviewarea, data.event,
    ); };