this.image = function(id=null, url, x=0, y=0, width=0, height=0, angle=0){
    var element = document.createElementNS('http://www.w3.org/2000/svg','image');
        element.id = id;
        element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad)';
        element.setAttribute('height',height);
        element.setAttribute('width',width);
        element.setAttribute('href',url);

    return element;
};
 