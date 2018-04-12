this.label = function(
    id='label',
    x, y, text,
    style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;',
    angle=0
){
    //elements 
    var object = parts.basic.g(id, x, y);
    var textElement = parts.basic.text(null, 0, 0, text, angle, style);
        object.appendChild(textElement);


    //methods
    object.text = function(a=null){
        if(a==null){return textElement.innerHTML;}
        textElement.innerHTML = a;
    }

    return object;
};