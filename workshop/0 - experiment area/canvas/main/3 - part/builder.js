canvas.part.builder = function(type,name,data){
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    switch(type){
        default: console.warn('Unknown element: '+ type); return null; break;

        //basic
            case 'group': return this.element.basic.group(
                name, data.x, data.y, data.angle
            );
            case 'rectangle': return this.element.basic.rectangle(
                name, data.x, data.y, data.width, data.height, data.angle, data.anchor, 
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin,
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            );
            case 'image': return this.element.basic.image(
                name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.url
            );
            case 'polygon': return this.element.basic.polygon(
                name, data.points, 
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
                );
            case 'text':   return this.element.basic.text(
                name, data.x, data.y, data.text, data.angle, data.anchor, 
                data.style.font, data.style.textAlign, data.style.textBaseLine,
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
                ); break;
            case 'circle': return this.element.basic.circle(
                name, data.x, data.y, data.r, data.angle, 
                data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
            ); break;
            case 'path':   return this.element.basic.path(
                name, data.points, 
                data.style.stroke, data.style.lineWidth, data.style.lineCap,  data.style.lineJoin, 
                data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
            ); break;
    
        //display
            case 'glowbox_rect': return this.element.display.glowbox_rect(
                name, data.x, data.y, data.width, data.height, data.angle, 
                data.style.glow, data.style.dim
            ); break;
            case 'sevenSegmentDisplay': return this.element.display.sevenSegmentDisplay(
                name, data.x, data.y, data.width, data.height,
                data.style.background, data.style.glow, data.style.dim
            ); break;
            case 'sixteenSegmentDisplay': return this.element.display.sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, 
                data.style.background, data.style.glow, data.style.dim
            ); break;
            case 'readout_sixteenSegmentDisplay': return this.element.display.readout_sixteenSegmentDisplay(
                name, data.x, data.y, data.width, data.height, data.count, data.angle, 
                data.style.background, data.style.glow, data.style.dime
            ); break;
            
            
            
    }
    
}