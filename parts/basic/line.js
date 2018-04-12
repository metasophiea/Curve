this.line = function(id=null, x1=0, y1=0, x2=10, y2=10, style='stroke:rgb(255,0,0); stroke-width:1'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','line');
    element.id = id;
    element.setAttribute('x1',x1);
    element.setAttribute('y1',y1);
    element.setAttribute('x2',x2);
    element.setAttribute('y2',y2);
    element.setAttribute('style',style);

    return element;
};