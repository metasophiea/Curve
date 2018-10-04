this.label = function(
    id='label',
    x, y, text,
    style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;',
    angle=0
){
    //elements 
    var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});

    var textElement = system.utility.misc.elementMaker('text',id,{text:text, angle:angle, style:style});
        object.appendChild(textElement);


    //methods
    object.text = function(a=null){
        if(a==null){return textElement.innerHTML;}
        textElement.innerHTML = a;
    }

    return object;
};