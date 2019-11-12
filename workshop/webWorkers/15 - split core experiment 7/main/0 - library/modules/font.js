this.listAllAvailableGlyphs = function(fontFileData){
    library._control.logflow.log('font.listAllAvailableGlyphs'); //#development
    var font = this.decodeFont(fontFileData);
    return Object.keys(font.glyphs.glyphs).map(a => String.fromCharCode(font.glyphs.glyphs[a].unicode));
};
this.decodeFont = function(fontFileData){
    library._control.logflow.log('font.decodeFont'); //#development
    return _thirdparty.opentype.parse(fontFileData);
};
this.getAllAvailableGlyphDrawingPaths = function(font,reducedGlyphSet){
    library._control.logflow.log('font.getAllAvailableGlyphDrawingPaths'); //#development
    var glyphs = reducedGlyphSet != undefined ? reducedGlyphSet : Object.keys(font.glyphs.glyphs).map(a => String.fromCharCode(font.glyphs.glyphs[a].unicode));
    var paths = glyphs.map( a => font.getPath(a,0,0,1) );

    var outputData = {};
    for(var a = 0; a < glyphs.length; a++){
        outputData[glyphs[a]] = paths[a].commands;
    }

    return outputData;
};
this.convertPathToPoints = function(path,detail=2){
    library._control.logflow.log('font.convertPathToPoints'); //#development
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
                output = output.concat(currentPoints);
                currentPoints = [];
            break;
        }
    });

    return output;
};
this.getTrianglesFromGlyphPath = function(glyphPath,detail=2){
    library._control.logflow.log('font.getTrianglesFromGlyphPath'); //#development
    //input checking
        if(glyphPath.length == 0){return [];}

    //convert glyphPath into segments with holes
        var minmax = {top:Infinity,left:Infinity,bottom:0,right:0};

        //gather minmax
            glyphPath.forEach(a => {
                if(a.x < minmax.left){minmax.left = a.x;}
                if(a.y < minmax.top){minmax.top = a.y;}
                if(a.x > minmax.right){minmax.right = a.x;}
                if(a.y > minmax.bottom){minmax.bottom = a.y;}
            });
        //split glyph paths up
            var paths = [];
            var tmpPath = [];
            glyphPath.forEach(pathSegment => {
                tmpPath.push(pathSegment);
                if(pathSegment.type == 'Z'){ paths.push(tmpPath); tmpPath = []; }
            });
        //convert paths to points
            paths = paths.map(a => library.font.convertPathToPoints(a,detail) );

        //reorder paths in order of size
            paths = paths.map(a => {
                var tmp = _canvas_.library.math.boundingBoxFromPoints(a); 
                return {vector:a, size:(tmp.bottomRight.x-tmp.topLeft.x) * (tmp.bottomRight.y-tmp.topLeft.y)};
            }).sort(function(a,b){ return a.size <= b.size ? 1 : -1; 
            }).map(a => a.vector);

        //sort point collections into segments with paths and holes
            var segments = [];
            paths.forEach(path => {
                var isHole = false;
                for(var a = 0; a < segments.length; a++){
                    if( library.math.detectOverlap.overlappingPolygons(path,segments[a].path) ){
                        segments[a].path = segments[a].path.concat(path);
                        segments[a].regions.unshift(path);
                        isHole = true;
                        break;
                    }
                }
                if(!isHole){ segments.push({ path:path, regions:[path] }); }
            });

    //produce triangles from points
        var triangles = [];
        segments.forEach(segment => { triangles = triangles.concat( library.math.polygonToSubTriangles(segment.regions) ); });

        return triangles;
};
this.extractGlyphs = function(fontFileData,reducedGlyphSet){
    library._control.logflow.log('font.extractGlyphs'); //#development
    //decode font data
        var font = library.font.decodeFont(fontFileData);
    //collect all glyph paths
        var tmp = library.font.getAllAvailableGlyphDrawingPaths(font,reducedGlyphSet);
    //convert all glyph paths to triangles
        var outputObject = {};
        Object.keys(tmp).forEach(glyph => { 
            var extraData = font.glyphs.glyphs[glyph.charCodeAt(0)];

            outputObject[glyph] = {
                vector:library.font.getTrianglesFromGlyphPath(tmp[glyph]),
                ascender:font.ascender,
                descender:font.descender,
                leftSideBearing: extraData.leftSideBearing,
                advanceWidth: extraData.advanceWidth,
                xMax: extraData.xMax,
                yMax: extraData.yMax,
                xMin: extraData.xMin,
                yMin: extraData.yMin,
                top:Infinity,
                left:Infinity,
                bottom:0,
                right:0,
            };
            
            //determine extremities for this glyph
                for(var a = 0; a < outputObject[glyph].vector.length; a+=2){
                    if( outputObject[glyph].vector[a] < outputObject[glyph].left ){
                        outputObject[glyph].left = outputObject[glyph].vector[a];
                    }else if( outputObject[glyph].vector[a] > outputObject[glyph].right ){
                        outputObject[glyph].right = outputObject[glyph].vector[a];
                    }

                    if( outputObject[glyph].vector[a+1] < outputObject[glyph].top ){
                        outputObject[glyph].top = outputObject[glyph].vector[a+1];
                    }else if( outputObject[glyph].vector[a+1] > outputObject[glyph].bottom ){
                        outputObject[glyph].bottom = outputObject[glyph].vector[a+1];
                    }
                }
        });

    //normalize all glyph vectors for this font
        //establish ratio
            var ratio = {height:0,width:0,master:0};
            Object.keys(outputObject).forEach(glyph => {
                var height = outputObject[glyph].bottom - outputObject[glyph].top;
                if(height > ratio.height){ratio.height = height;}
                var width = outputObject[glyph].right - outputObject[glyph].left;
                if(width > ratio.width){ratio.width = width;}
            });
            ratio.master = ratio.height < ratio.width ? ratio.height : ratio.width;
        //adjust vectors and extremity values with ratios
            Object.keys(outputObject).forEach(glyph => {
                for(var a = 0; a < outputObject[glyph].vector.length; a+=2){
                    outputObject[glyph].vector[a] /= ratio.master;
                    outputObject[glyph].vector[a+1] /= ratio.master;
                }
                outputObject[glyph].top /= ratio.master;
                outputObject[glyph].bottom /= ratio.master;
                outputObject[glyph].left /= ratio.master;
                outputObject[glyph].right  /= ratio.master;
            });

    return outputObject;
};