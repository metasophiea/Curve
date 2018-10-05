this.path = function(id=null, path=[], lineType='L', style='fill:rgba(0,0,0,0);'){
    // uppercase: absolute, lowercase: relative
    // M = moveto
    // L = lineto
    // H = horizontal lineto
    // V = vertical lineto
    // C = curveto
    // S = smooth curveto
    // Q = quadratic Bézier curve
    // T = smooth quadratic Bézier curveto
    // A = elliptical Arc
    // Z = closepath
    var element = document.createElementNS('http://www.w3.org/2000/svg','path');
    element.id = id;
    element.style = 'transform: translate('+0+'px,'+0+'px) scale(1) rotate('+0+'rad);' + style;

    element._installPath = function(path){
        var d = 'M ' + path[0].x + ' ' + path[0].y + ' ' + lineType;
        for(var a = 1; a < path.length; a++){
            d += ' ' + path[a].x + ' ' + path[a].y
        }
        this.setAttribute('d',d);
    };

    element._path = path;
    element._installPath(path);

    element.path = function(a){
        if(a==null){return this._path;}
        this._path = a;
        this._installPath(a);
    };

    return element;
};