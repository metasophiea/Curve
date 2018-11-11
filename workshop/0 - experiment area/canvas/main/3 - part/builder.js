canvas.part.builder = function(type,name,data){
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    switch(type){
        case 'group': return this.element.basic.group(name, data.x, data.y, data.angle);
        case 'rectangle': return this.element.basic.rectangle(name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.style.fill, data.style.stroke, data.style.lineWidth);
        case 'image': return this.element.basic.image(name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.url);
        case 'polygon': return this.element.basic.polygon(name, data.points, data.style.fill, data.style.stroke, data.style.lineWidth);
    }
    
}