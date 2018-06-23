this.canvas = function(id=null, x=0, y=0, width=0, height=0, angle=0, res=1){
    var canvas = document.createElement('canvas');
        canvas.setAttribute('height',res*height);
        canvas.setAttribute('width',res*width);
    
    var image = document.createElementNS('http://www.w3.org/2000/svg','image');
        image.id = id;
        image.style = 'transform: translate('+x+'px,'+y+'px) scale('+1/res+') rotate('+angle+'rad)';
        image.setAttribute('height',height*res);
        image.setAttribute('width',width*res);

    return {
        element:image,
        canvas:canvas,
        context:canvas.getContext("2d"),
        c:function(a){return a*res;},
        print:function(){
            this.element.setAttribute('href',this.canvas.toDataURL("image/png"));
        }
    };
};