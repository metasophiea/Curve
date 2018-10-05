this.circle = function(id=null, x=0, y=0, r=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','circle');
    element.id = id;
    element.setAttribute('r',r);
    element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad);' + style;

    return element;
};