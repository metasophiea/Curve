this.text = function(id=null, x=0, y=0, text='', angle=0, style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;', scale=1){
    var element = document.createElementNS('http://www.w3.org/2000/svg','text');
        element.id = id;
        element.style = 'transform: translate('+x+'px,'+y+'px) scale('+scale+') rotate('+angle+'rad);' + style;
        element.innerHTML = text;

    return element;
};