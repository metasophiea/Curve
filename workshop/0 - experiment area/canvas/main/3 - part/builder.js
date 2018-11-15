canvas.part.builder = function(type,name,data){
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    switch(type){
        case 'group': return this.element.basic.group(name, data.x, data.y, data.angle);
        case 'rectangle': return this.element.basic.rectangle(name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset);
        case 'image': return this.element.basic.image(name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.url);
        case 'polygon': return this.element.basic.polygon(name, data.points, data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset);

        // case 'advancedPolygon': return this.element.basic.advancedPolygon(name, data.points, data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset);
        case 'text':   return this.element.basic.text(name, data.x, data.y, data.text, data.angle, data.anchor, data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset); break;
        case 'circle': return this.element.basic.circle(name, data.x, data.y, data.r, data.angle, data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset); break;
        // case 'path':   return part.element.basic.path(name, data.points, data.style.stroke, data.style.lineWidth, data.style.lineCap,  data.style.lineJoin, data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset); break;
    }
    
}