this.g = function(id=null, x=0, y=0, r=0){
    var element = document.createElementNS('http://www.w3.org/2000/svg','g');
        element.id = id;
        element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+r+'rad)';

    return element;
};