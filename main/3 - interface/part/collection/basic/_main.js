{{include:*}} /**/

interfacePart.partLibrary.basic = {
    group: function(name,data){ 
        return interfacePart.collection.basic.group( name, data.x, data.y, data.angle, data.ignored );
    },
    rectangle: function(name,data){ 
        return interfacePart.collection.basic.rectangle( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour );
    },
    rectangleWithOutline: function(name,data){ 
        return interfacePart.collection.basic.rectangleWithOutline( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour, data.thickness, data.lineColour );
    },
    image: function(name,data){ 
        return interfacePart.collection.basic.image( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url );
    },
    canvas: function(name,data){ 
        return interfacePart.collection.basic.canvas( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.resolution );
    },
    polygon: function(name,data){ 
        return interfacePart.collection.basic.polygon( name, data.points, data.pointsAsXYArray, data.ignored, data.colour );
    },
    polygonWithOutline: function(name,data){ 
        return interfacePart.collection.basic.polygonWithOutline( name, data.points, data.pointsAsXYArray, data.ignored, data.colour, data.thickness, data.lineColour );
    },
    circle: function(name,data){ 
        return interfacePart.collection.basic.circle( name, data.x, data.y, data.angle, data.radius, data.detail, data.ignored, data.colour );
    },
    circleWithOutline: function(name,data){ 
        return interfacePart.collection.basic.circleWithOutline( name, data.x, data.y, data.angle, data.radius, data.detail, data.ignored, data.colour, data.thickness, data.lineColour );
    },
    path: function(name,data){ 
        return interfacePart.collection.basic.path( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray, data.jointType, data.capType, data.looping, data.jointDetail, data.sharpLimit );
    },
    text: function(name,data){ 
        return interfacePart.collection.basic.text( name, data.text, data.x, data.y, data.width, data.height, data.angle, data.ignored, data.colour, data.font, data.printingMode, data.spacing, data.interCharacterSpacing );
    },
};