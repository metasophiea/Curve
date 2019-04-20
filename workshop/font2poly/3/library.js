var library = {math:{},misc:{},thirdparty:{}};


library.misc.openFile = function(callback,readAsType='readAsBinaryString'){
    var i = document.createElement('input');
    i.type = 'file';
    i.onchange = function(){
        var f = new FileReader();
        switch(readAsType){
            case 'readAsArrayBuffer':           f.readAsArrayBuffer(this.files[0]);  break;
            case 'readAsBinaryString': default: f.readAsBinaryString(this.files[0]); break;
        }
        f.onloadend = function(){ 
            if(callback){callback(f.result);}
        }
    };
    i.click();
};

library.misc.font = {};
library.misc.font.listAllAvailableGlyphs = function(fontFileData){
    var font = library.thirdparty.opentype.parse(fontFileData);
    return Object.keys(font.glyphs.glyphs).map(a => String.fromCharCode(font.glyphs.glyphs[a].unicode));
};
library.misc.font.getAllAvailableGlyphDrawingPaths = function(fontFileData){
    var font = library.thirdparty.opentype.parse(fontFileData);
    var glyphs = Object.keys(font.glyphs.glyphs).map(a => String.fromCharCode(font.glyphs.glyphs[a].unicode));
    var paths = glyphs.map( a => font.getPath(a,0,0,1) );

    var outputData = {};
    for(var a = 0; a < glyphs.length; a++){
        outputData[glyphs[a]] = paths[a].commands;
    }

    return outputData;
};
library.misc.font.convertPathToPoints = function(path,detail=2){
    var output = [];
    var currentPoints = [];

    path.forEach(function(element){
        switch(element.type){
            case 'M': currentPoints.push( {x:element.x,y:element.y} ); break;
            case 'L': currentPoints.push( {x:element.x,y:element.y} ); break;

            case 'H': break;
            case 'V': break;
            case 'C': break;
            case 'S': break;

            case 'Q':
                var p = {
                    start:{x:currentPoints[currentPoints.length-1].x, y:currentPoints[currentPoints.length-1].y},
                    control:{x:element.x1,y:element.y1},
                    end:{x:element.x,y:element.y},
                };
                
                for(var a = 1; a <= detail; a++){
                    var mux = a/detail;
                    currentPoints.push({
                        x: p.start.x + mux*(2*(p.control.x - p.start.x) + mux*(p.end.x - 2*p.control.x + p.start.x)),
                        y: p.start.y + mux*(2*(p.control.y - p.start.y) + mux*(p.end.y - 2*p.control.y + p.start.y)),
                    });
                }
            break;

            case 'T': break;
            case 'A': break;

            case 'Z': case 'z': 
                output.push(currentPoints);
                currentPoints = [];
            break;
        }
    });

    return output;
};
library.misc.font.getTrianglesFromGlyphPath = function(glyphPath){
    //split up glyphPath into its individual parts
        var points = { mainShape:[], holes:[], subShapes:[] };
        var paths = [];
        var minmax = {top:Infinity,left:Infinity,bottom:0,right:0};

        //split up paths into seperate pathing segments, calculating the boundings of the primary shape
            var firstPath = true;
            var currentPath = [];
            glyphPath.forEach(a => {
                if(firstPath){
                    if(a.x < minmax.left){minmax.left = a.x;}
                    if(a.y < minmax.top){minmax.top = a.y;}
                    if(a.x > minmax.right){minmax.right = a.x;}
                    if(a.y > minmax.bottom){minmax.bottom = a.y;}
                }

                currentPath.push(a);
                if(a.type == 'Z'){
                    paths.push(currentPath);
                    currentPath = [];
                    firstPath = false;
                }
            });

            //sort the paths into groups of drawable shapes, and their holes
                points.mainShape = paths[0];
                paths.slice(1).forEach(path => {
                    var isHole = true;
                    path.forEach(a => {
                        if(a.x < minmax.left || a.y < minmax.top || a.x > minmax.right || a.y > minmax.bottom){isHole = false; return;}
                    });
                    if(isHole){ points.holes.push(path); }
                    else{ points.subShapes.push(path); }
                });

        //actual conversion
            points.mainShape = library.misc.font.convertPathToPoints(points.mainShape)[0];
            points.holes = points.holes.map(path => library.misc.font.convertPathToPoints(path)[0]);
            points.subShapes = points.subShapes.map(path => library.misc.font.convertPathToPoints(path)[0]);

    //produce triangles from points       
        var triangles = [];

        //main shape with holes
            var allPoints = points.mainShape.map(a => [a.x,a.y]).flat();
            var holeIndexes = [];
        
            points.holes.forEach(pathPoints => {
                holeIndexes.push(allPoints.length/2);
                allPoints = allPoints.concat(pathPoints.map(a => [a.x,a.y]).flat());
            });
            triangles = library.thirdparty.earcut(allPoints,holeIndexes);
    
        //satilite shapes
            points.subShapes.forEach(pathPoints => {
                triangles = triangles.concat( library.thirdparty.earcut(pathPoints.map(a => [a.x,a.y]).flat()) );
            });
    
        return triangles;
};