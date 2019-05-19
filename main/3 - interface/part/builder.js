this.partLibrary = {};
this.builder = function(type,name,data){
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    if(type in this.partLibrary){ return this.partLibrary[type](name,data); }

    console.warn('Interface Part Builder :: Unknown element: '+ type); return null;
}








//basic
    this.partLibrary.group = function(name,data){ return interfacePart.collection.basic.group( name, data.x, data.y, data.angle, data.ignored ); }
    this.partLibrary.rectangle = function(name,data){ return interfacePart.collection.basic.rectangle( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour ); }
    this.partLibrary.rectangleWithOutline = function(name,data){ return interfacePart.collection.basic.rectangleWithOutline( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour, data.thickness, data.lineColour ); }
    this.partLibrary.image = function(name,data){ return interfacePart.collection.basic.image( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url ); }
    this.partLibrary.canvas = function(name,data){ return interfacePart.collection.basic.canvas( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.resolution ); }
    this.partLibrary.polygon = function(name,data){ return interfacePart.collection.basic.polygon( name, data.points, data.pointsAsXYArray, data.ignored, data.colour ); }
    this.partLibrary.polygonWithOutline = function(name,data){ return interfacePart.collection.basic.polygonWithOutline( name, data.points, data.pointsAsXYArray, data.ignored, data.colour, data.thickness, data.lineColour ); }
    this.partLibrary.circle = function(name,data){ return interfacePart.collection.basic.circle( name, data.x, data.y, data.angle, data.radius, data.detail, data.ignored, data.colour ); }
    this.partLibrary.circleWithOutline = function(name,data){ return interfacePart.collection.basic.circleWithOutline( name, data.x, data.y, data.angle, data.radius, data.detail, data.ignored, data.colour, data.thickness, data.lineColour ); }
    this.partLibrary.path = function(name,data){ return interfacePart.collection.basic.path( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray ); }
    this.partLibrary.pathWithRoundJointsAndEnds = function(name,data){ return interfacePart.collection.basic.pathWithRoundJointsAndEnds( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray ); }
    this.partLibrary.loopedPath = function(name,data){ return interfacePart.collection.basic.loopedPath( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray ); }
    this.partLibrary.text = function(name,data){ return interfacePart.collection.basic.text( name, data.text, data.x, data.y, data.width, data.height, data.angle, data.ignored, data.colour, data.font, data.printingMode, data.spacing, data.interCharacterSpacing ); }

//display
    this.partLibrary.glowbox_rect = function(name,data){ return interfacePart.collection.display.glowbox_rect( name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim ); }
    this.partLibrary.sevenSegmentDisplay = function(name,data){ return interfacePart.collection.display.sevenSegmentDisplay(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.background, data.style.glow, data.style.dim
    ); }
    this.partLibrary.sevenSegmentDisplay_static = function(name,data){ return interfacePart.collection.display.sevenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
        data.style.background, data.style.glow, data.style.dim
    ); }
    this.partLibrary.sixteenSegmentDisplay = function(name,data){ return interfacePart.collection.display.sixteenSegmentDisplay(
        name, data.x, data.y, data.width, data.height,  data.angle,
        data.style.background, data.style.glow, data.style.dim
    ); }
    this.partLibrary.sixteenSegmentDisplay_static = function(name,data){ return interfacePart.collection.display.sixteenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
        data.style.background, data.style.glow, data.style.dim
    ); }
    this.partLibrary.readout_sixteenSegmentDisplay = function(name,data){ return interfacePart.collection.display.readout_sixteenSegmentDisplay(
        name, data.x, data.y, data.width, data.height, data.count, data.angle, 
        data.style.background, data.style.glow, data.style.dim,
    ); }
    this.partLibrary.readout_sixteenSegmentDisplay_static = function(name,data){ return interfacePart.collection.display.readout_sixteenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.count, data.angle, data.resolution,
        data.style.background, data.style.glow, data.style.dim,
    ); }
    this.partLibrary.level = function(name,data){ return interfacePart.collection.display.level(
        name, data.x, data.y, data.angle, data.width, data.height, 
        data.style.backing, data.style.levels
    ); }
    this.partLibrary.meter_level = function(name,data){ return interfacePart.collection.display.meter_level(
        name, data.x, data.y, data.angle, data.width, data.height, data.markings,
        data.style.backing, data.style.levels, data.style.markingStyle_colour, data.style.markingStyle_font, data.style.markingStyle_printingMode, data.style.markingStyle_size
    ); }
    this.partLibrary.audio_meter_level = function(name,data){ return interfacePart.collection.display.audio_meter_level(
        name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
        data.style.backing, data.style.levels, data.style.markingStyle_colour, data.style.markingStyle_font, data.style.markingStyle_printingMode, data.style.markingStyle_size
    ); }
    this.partLibrary.rastorDisplay = function(name,data){ return interfacePart.collection.display.rastorDisplay(
        name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
    ); }
    this.partLibrary.grapher = function(name,data){ return interfacePart.collection.display.grapher(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); }
    this.partLibrary.grapher_static = function(name,data){ return interfacePart.collection.display.grapher_static(
        name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); }
    this.partLibrary.grapher_periodicWave = function(name,data){ return interfacePart.collection.display.grapher_periodicWave(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); }
    this.partLibrary.grapher_periodicWave_static = function(name,data){ return interfacePart.collection.display.grapher_periodicWave_static(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); }
    this.partLibrary.grapher_audioScope = function(name,data){ return interfacePart.collection.display.grapher_audioScope(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); }
    this.partLibrary.grapher_audioScope_static = function(name,data){ return interfacePart.collection.display.grapher_audioScope_static(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); }

//control
    //button
        this.partLibrary.button_ = function(name,data){ return interfacePart.collection.control.button_(
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
        ); }
        this.partLibrary.button_image = function(name,data){ return interfacePart.collection.control.button_image(
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
        ); }
        this.partLibrary.button_circle = function(name,data){ return interfacePart.collection.control.button_circle(
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
        ); }
        this.partLibrary.button_polygon = function(name,data){ return interfacePart.collection.control.button_polygon(
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
        ); }
        this.partLibrary.button_rectangle = function(name,data){ return interfacePart.collection.control.button_rectangle(
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
        ); }
    //dial
        this.partLibrary.dial_1_continuous = function(name,data){ return interfacePart.collection.control.dial_1_continuous(
            name,
            data.x, data.y, data.radius, data.angle, data.interactable,
            data.value, data.resetValue,
            data.startAngle, data.maxAngle,
            data.style.handle, data.style.slot, data.style.needle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.dial_continuous = this.partLibrary.dial_1_continuous;
        this.partLibrary.dial_2_continuous = function(name,data){ return interfacePart.collection.control.dial_2_continuous(
            name,
            data.x, data.y, data.radius, data.angle, data.interactable,
            data.value, data.resetValue,
            data.startAngle, data.maxAngle,
            data.style.handle, data.style.slot, data.style.needle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.dial_1_discrete = function(name,data){ return interfacePart.collection.control.dial_1_discrete(
            name,
            data.x, data.y, data.radius, data.angle, data.interactable,
            data.value, data.resetValue, data.optionCount,
            data.startAngle, data.maxAngle,
            data.style.handle, data.style.slot, data.style.needle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.dial_discrete = this.partLibrary.dial_1_discrete;
        this.partLibrary.dial_2_discrete = function(name,data){ return interfacePart.collection.control.dial_2_discrete(
            name,
            data.x, data.y, data.radius, data.angle, data.interactable,
            data.value, data.resetValue, data.optionCount,
            data.startAngle, data.maxAngle,
            data.style.handle, data.style.slot, data.style.needle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.dial_continuous_image = function(name,data){ return interfacePart.collection.control.dial_continuous_image(
            name,
            data.x, data.y, data.radius, data.angle, data.interactable,
            data.value, data.resetValue,
            data.startAngle, data.maxAngle,
            data.handleURL, data.slotURL, data.needleURL,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.dial_discrete_image = function(name,data){ return interfacePart.collection.control.dial_discrete_image(
            name,
            data.x, data.y, data.radius, data.angle, data.interactable,
            data.value, data.resetValue, data.optionCount,
            data.startAngle, data.maxAngle,
            data.handleURL, data.slotURL, data.needleURL,
            data.onchange, data.onrelease
        ); }
    //slide
        this.partLibrary.slide = function(name,data){ return interfacePart.collection.control.slide(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
            data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.slide_image = function(name,data){ return interfacePart.collection.control.slide_image(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
            data.handleURL, data.backingURL, data.slotURL, data.style.invisibleHandle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.slidePanel = function(name,data){ return interfacePart.collection.control.slidePanel(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
            data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.slidePanel_image = function(name,data){ return interfacePart.collection.control.slidePanel_image(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
            data.handleURL, data.backingURL, data.slotURL, data.overlayURL, data.style.invisibleHandle,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.rangeslide = function(name,data){ return interfacePart.collection.control.rangeslide(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
            data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
            data.onchange, data.onrelease
        ); }
        this.partLibrary.rangeslide_image = function(name,data){ return interfacePart.collection.control.rangeslide_image(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
            data.handleURL, data.backingURL, data.slotURL, data.style.invisibleHandle, data.spanURL,
            data.onchange, data.onrelease
        ); }
    //list
        this.partLibrary.list = function(name,data){ return interfacePart.collection.control.list(
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
        ); }
        this.partLibrary.list_image = function(name,data){ return interfacePart.collection.control.list_image(
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
        ); }
    //checkbox
        this.partLibrary.checkbox_ = function(name,data){ return interfacePart.collection.control.checkbox_(
            name, data.x, data.y, data.angle, data.interactable,
            data.onchange, data.subject,
        ); }
        this.partLibrary.checkbox_circle = function(name,data){ return interfacePart.collection.control.checkbox_circle(
            name, data.x, data.y, data.radius, data.angle, data.interactable,
            data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
            data.onchange,
        ); }
        this.partLibrary.checkbox_image = function(name,data){ return interfacePart.collection.control.checkbox_image(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
            data.uncheckURL, data.checkURL, data.uncheckGlowURL, data.checkGlowURL,
            data.onchange,
        ); }
        this.partLibrary.checkbox_polygon = function(name,data){ return interfacePart.collection.control.checkbox_polygon(
            name, data.x, data.y, data.outterPoints, data.innerPoints, data.angle, data.interactable,
            data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
            data.onchange,
        ); }
        this.partLibrary.checkbox_rectangle = function(name,data){ return interfacePart.collection.control.checkbox_rectangle(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
            data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
            data.onchange,
        ); }
        this.partLibrary.rastorgrid = function(name,data){ return interfacePart.collection.control.rastorgrid(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.xCount, data.yCount,
            data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
            data.onchange
        ); }
        this.partLibrary.needleOverlay = function(name,data){ return interfacePart.collection.control.needleOverlay(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
            data.needleWidth, data.selectNeedle, data.selectionArea, data.style.needles,
            data.onchange, data.onrelease, data.selectionAreaToggle,
        ); }
        this.partLibrary.grapher_waveWorkspace = function(name,data){ return interfacePart.collection.control.grapher_waveWorkspace(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.selectNeedle, data.selectionArea,
            data.style.foregrounds, data.style.foregroundText,
            data.style.background_colour, data.style.background_lineThickness,
            data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
            data.style.backing,
            data.onchange, data.onrelease, data.selectionAreaToggle
        ); }
        this.partLibrary.sequencer = function(name,data){ return interfacePart.collection.control.sequencer(
            name, data.x, data.y, data.width, data.height, data.angle, data.interactable,             
            data.xCount, data.yCount, data.zoomLevel_x, data.zoomLevel_y,
            data.backingStyle, data.selectionAreaStyle,
            data.blockStyle_body, data.blockStyle_bodyGlow, data.blockStyle_handle, data.blockStyle_handleWidth,
            data.horizontalStripStyle_pattern, data.horizontalStripStyle_glow, data.horizontalStripStyle_styles,
            data.verticalStripStyle_pattern,   data.verticalStripStyle_glow,   data.verticalStripStyle_styles,
            data.playheadStyle,
            data.onpan, data.onchangeviewarea, data.event,
        ); }

//dynamic
    this.partLibrary.cable = function(name,data){ return interfacePart.collection.dynamic.cable(
        name, data.x1, data.y1, data.x2, data.y2,
        data.style.dim, data.style.glow,
    ); }
    this.partLibrary.cable2 = function(name,data){ return interfacePart.collection.dynamic.cable2(
        name, data.x1, data.y1, data.x2, data.y2,
        data.style.dim, data.style.glow,
    ); }
    this.partLibrary.connectionNode = function(name,data){ return interfacePart.collection.dynamic.connectionNode(
        name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onconnect, data.ondisconnect,
    ); }
    this.partLibrary.connectionNode2 = function(name,data){ return interfacePart.collection.dynamic.connectionNode2(
        name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onconnect, data.ondisconnect,
    ); }
    this.partLibrary.connectionNode_signal = function(name,data){ return interfacePart.collection.dynamic.connectionNode_signal(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onchange, data.onconnect, data.ondisconnect,
    ); }
    this.partLibrary.connectionNode_voltage = function(name,data){ return interfacePart.collection.dynamic.connectionNode_voltage(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onchange, data.onconnect, data.ondisconnect,
    ); }
    this.partLibrary.connectionNode_data = function(name,data){ return interfacePart.collection.dynamic.connectionNode_data(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
    ); }
    this.partLibrary.connectionNode_audio = function(name,data){ return interfacePart.collection.dynamic.connectionNode_audio(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections, data.isAudioOutput, _canvas_.library.audio.context,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onconnect, data.ondisconnect,
    ); }