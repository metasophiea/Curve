this.path = function(id=null, path=[], lineType='L', style='fill:none; stroke:rgb(255,0,0); stroke-width:1;'){
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
    element.style = style;

    element._installPath = function(path){
        var d = 'M ' + path[0][0] + ' ' + path[0][1] + ' ' + lineType;
        for(var a = 1; a < path.length; a++){
            d += ' ' + path[a][0] + ' ' + path[a][1]
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