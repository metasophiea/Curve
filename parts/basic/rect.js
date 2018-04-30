this.rect = function(id=null, x=0, y=0, width=0, height=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','rect');
    element.id = id;
    element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad);' + style;
    element.setAttribute('height',height);
    element.setAttribute('width',width);

    element.rotation = function(a){
        if(a==null){return __globals.utility.element.getTransform(this).r;}
        __globals.utility.element.setRotation(this, a);
    };

    return element;
};