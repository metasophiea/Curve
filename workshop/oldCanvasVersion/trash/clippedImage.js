this.clippedImage = function(name=null, x=0, y=0, width=10, height=10, angle=0, ignored=false, url='', points=[]){
    if(points == undefined || points.length < 3){ return this.image(name, x, y, width, height, angle, {x:0,y:0}, ignored, url); }

    var clippingGroup = workspace.core.arrangement.createElement('group');
    clippingGroup.name = name;
    clippingGroup.x = x; clippingGroup.y = y;
    clippingGroup.angle = angle;
    clippingGroup.ignored = ignored;

    var stencil = workspace.core.arrangement.createElement('polygon');
    stencil.name = 'clipShape';
    stencil.points = points.map(a => { return {x:a.x*width,y:a.y*height}; });
    clippingGroup.stencil(stencil);
    clippingGroup.clip(true);

    var image = workspace.core.arrangement.createElement('image');
    image.name = 'image';
    image.x = 0; image.y = 0;
    image.width = width; image.height = height;
    image.url = url;
    clippingGroup.append(image);

    return clippingGroup;
};