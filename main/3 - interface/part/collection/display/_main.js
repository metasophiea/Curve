{{include:*}} /**/

interfacePart.partLibrary.display = {
    glowbox_rect: function(name,data){ return interfacePart.collection.display.glowbox_rect( name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim ); },
    sevenSegmentDisplay: function(name,data){ return interfacePart.collection.display.sevenSegmentDisplay(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.background, data.style.glow, data.style.dim
    ); },
    sevenSegmentDisplay_static: function(name,data){ return interfacePart.collection.display.sevenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
        data.style.background, data.style.glow, data.style.dim
    ); },
    sixteenSegmentDisplay: function(name,data){ return interfacePart.collection.display.sixteenSegmentDisplay(
        name, data.x, data.y, data.width, data.height,  data.angle,
        data.style.background, data.style.glow, data.style.dim
    ); },
    sixteenSegmentDisplay_static: function(name,data){ return interfacePart.collection.display.sixteenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
        data.style.background, data.style.glow, data.style.dim
    ); },
    readout_sixteenSegmentDisplay: function(name,data){ return interfacePart.collection.display.readout_sixteenSegmentDisplay(
        name, data.x, data.y, data.width, data.height, data.count, data.angle, 
        data.style.background, data.style.glow, data.style.dim,
    ); },
    readout_sixteenSegmentDisplay_static: function(name,data){ return interfacePart.collection.display.readout_sixteenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.count, data.angle, data.resolution,
        data.style.background, data.style.glow, data.style.dim,
    ); },
    level: function(name,data){ return interfacePart.collection.display.level(
        name, data.x, data.y, data.angle, data.width, data.height, 
        data.style.backing, data.style.levels
    ); },
    meter_level: function(name,data){ return interfacePart.collection.display.meter_level(
        name, data.x, data.y, data.angle, data.width, data.height, data.markings,
        data.style.backing, data.style.levels, data.style.markingStyle_colour, data.style.markingStyle_font, data.style.markingStyle_printingMode, data.style.markingStyle_size
    ); },
    audio_meter_level: function(name,data){ return interfacePart.collection.display.audio_meter_level(
        name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
        data.style.backing, data.style.levels, data.style.markingStyle_colour, data.style.markingStyle_font, data.style.markingStyle_printingMode, data.style.markingStyle_size
    ); },
    rastorDisplay: function(name,data){ return interfacePart.collection.display.rastorDisplay(
        name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
    ); },
    grapher: function(name,data){ return interfacePart.collection.display.grapher(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); },
    grapher_static: function(name,data){ return interfacePart.collection.display.grapher_static(
        name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); },
    grapher_periodicWave: function(name,data){ return interfacePart.collection.display.grapher_periodicWave(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); },
    grapher_periodicWave_static: function(name,data){ return interfacePart.collection.display.grapher_periodicWave_static(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); },
    grapher_audioScope: function(name,data){ return interfacePart.collection.display.grapher_audioScope(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); },
    grapher_audioScope_static: function(name,data){ return interfacePart.collection.display.grapher_audioScope_static(
        name, data.x, data.y, data.width, data.height, data.angle,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); },
};