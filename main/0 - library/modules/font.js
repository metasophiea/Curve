this.listAllAvailableGlyphs = function(fontFileData){
    dev.log.font('.listAllAvailableGlyphs(',fontFileData); //#development
    dev.count('.font.listAllAvailableGlyphs'); //#development

    const font = this.decodeFont(fontFileData);
    return Object.keys(font.glyphs.glyphs).map(a => String.fromCharCode(font.glyphs.glyphs[a].unicode));
};
this.decodeFont = function(fontFileData){
    dev.log.font('.decodeFont(',fontFileData); //#development
    dev.count('.font.decodeFont'); //#development

    return _thirdparty.opentype2.parse(fontFileData);
};
this.getAllAvailableGlyphDrawingPaths = function(font,reducedGlyphSet){
    dev.log.font('.getAllAvailableGlyphDrawingPaths(',font,reducedGlyphSet); //#development
    dev.count('.font.getAllAvailableGlyphDrawingPaths'); //#development

    const glyphs = reducedGlyphSet != undefined ? reducedGlyphSet : Object.keys(font.glyphs.glyphs).map(a => String.fromCharCode(font.glyphs.glyphs[a].unicode));
    const paths = glyphs.map( a => font.getPath(a,0,0,1) );

    let outputData = {};
    for(let a = 0; a < glyphs.length; a++){
        outputData[glyphs[a]] = paths[a].commands;
    }

    return outputData;
};
this.convertPathToPoints = function(path,detail=2){
    dev.log.font('.convertPathToPoints(',path,detail); //#development
    dev.count('.font.convertPathToPoints'); //#development

    let output = [];
    let currentPoints = [];

    path.forEach(function(element){
        switch(element.type){
            case 'M': currentPoints.push( {x:element.x,y:element.y} ); break;
            case 'L': currentPoints.push( {x:element.x,y:element.y} ); break;

            case 'H': break;
            case 'V': break;
            case 'C': break;
            case 'S': break;

            case 'Q':
                const p = {
                    start:{x:currentPoints[currentPoints.length-1].x, y:currentPoints[currentPoints.length-1].y},
                    control:{x:element.x1,y:element.y1},
                    end:{x:element.x,y:element.y},
                };
                
                for(let a = 1; a <= detail; a++){
                    let mux = a/detail;
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
    dev.log.font('.getTrianglesFromGlyphPath(',glyphPath,detail); //#development
    dev.count('.font.getTrianglesFromGlyphPath'); //#development

    //input checking
        if(glyphPath.length == 0){return [];}

    //convert glyphPath into segments with holes
        const minmax = {top:Infinity,left:Infinity,bottom:0,right:0};

        //gather minmax
            glyphPath.forEach(a => {
                if(a.x < minmax.left){minmax.left = a.x;}
                if(a.y < minmax.top){minmax.top = a.y;}
                if(a.x > minmax.right){minmax.right = a.x;}
                if(a.y > minmax.bottom){minmax.bottom = a.y;}
            });
        //split glyph paths up
            let paths = [];
            let tmpPath = [];
            glyphPath.forEach(pathSegment => {
                tmpPath.push(pathSegment);
                if(pathSegment.type == 'Z'){ paths.push(tmpPath); tmpPath = []; }
            });
        //convert paths to points
            paths = paths.map(a => library.font.convertPathToPoints(a,detail) );

        //reorder paths in order of size
            paths = paths.map(a => {
                const tmp = library.math.boundingBoxFromPoints(a); 
                return {vector:a, size:(tmp.bottomRight.x-tmp.topLeft.x) * (tmp.bottomRight.y-tmp.topLeft.y)};
            }).sort(function(a,b){ return a.size <= b.size ? 1 : -1; 
            }).map(a => a.vector);

        //sort point collections into segments with paths and holes
            let segments = [];
            paths.forEach(path => {
                let isHole = false;
                for(let a = 0; a < segments.length; a++){
                    if( library.math.detectIntersect.polyOnPoly({points:path},{points:segments[a].path}).intersect ){
                        segments[a].path = segments[a].path.concat(path);
                        segments[a].regions.unshift(path);
                        isHole = true;
                        break;
                    }
                }
                if(!isHole){ segments.push({ path:path, regions:[path] }); }
            });

    //produce triangles from points
        return segments.flatMap(segment => library.math.polygonToSubTriangles(segment.regions) );
};
this.extractGlyphs = function(fontFileData,reducedGlyphSet){
    dev.log.font('.extractGlyphs(',fontFileData,reducedGlyphSet); //#development
    dev.count('.font.extractGlyphs'); //#development

    //decode font data
        const font = library.font.decodeFont(fontFileData);
    //collect all glyph paths
        const tmp = library.font.getAllAvailableGlyphDrawingPaths(font,reducedGlyphSet);
    //convert all glyph paths to triangles
        const outputObject = {};
        Object.keys(tmp).forEach(glyph => { 
            const extraData = font.glyphs.glyphs[glyph.charCodeAt(0)];

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
                for(let a = 0; a < outputObject[glyph].vector.length; a+=2){
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
            const ratio = {height:0,width:0,master:0};
            Object.keys(outputObject).forEach(glyph => {
                const height = outputObject[glyph].bottom - outputObject[glyph].top;
                if(height > ratio.height){ratio.height = height;}
                const width = outputObject[glyph].right - outputObject[glyph].left;
                if(width > ratio.width){ratio.width = width;}
            });
            ratio.master = ratio.height < ratio.width ? ratio.height : ratio.width;
        //adjust vectors and extremity values with ratios
            Object.keys(outputObject).forEach(glyph => {
                for(let a = 0; a < outputObject[glyph].vector.length; a+=2){
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




const vectorLibrary = {};
const reducedGlyphSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:;?!/\\()[]{}#-_\'"|><+=&*~%^'.split('');
const fontFilesLocation = '/fonts/';
const systemFonts = [
    'defaultThick',
    'defaultThin',
];
const fontFileNames = [
    'Roboto/Roboto-Regular.ttf',
    'Roboto/Roboto-Italic.ttf',
    'Roboto/Roboto-Black.ttf',
    'Roboto/Roboto-BlackItalic.ttf',
    'Roboto/Roboto-Bold.ttf',
    'Roboto/Roboto-BoldItalic.ttf',
    'Roboto/Roboto-Light.ttf',
    'Roboto/Roboto-LightItalic.ttf',
    'Roboto/Roboto-Medium.ttf',
    'Roboto/Roboto-MediumItalic.ttf',
    'Roboto/Roboto-Thin.ttf',
    'Roboto/Roboto-ThinItalic.ttf',

    'Helvetica/Helvetica-Bold.ttf',
    'Helvetica/Helvetica-BoldItalic.ttf',
    'Helvetica/Helvetica-Italic.ttf',
    'Helvetica/Helvetica-Light.ttf',
    'Helvetica/Helvetica.ttf',
    
    'Arial/Arial.ttf',

    'Cute_Font/CuteFont-Regular.ttf',

    'Lobster/Lobster-Regular.ttf',

    'AppleGaramond/AppleGaramond.ttf',
];
//create locations in the vector library for these fonts
fontFileNames.forEach(name => {
    const fontName = name.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]; //produce font name from file name
    vectorLibrary[fontName] = { fileName:name, loadAttempted:false, loadComplete:false, loadWasSuccess:undefined };
});
{{include:defaultFonts/defaultThick.js}}
{{include:defaultFonts/defaultThin.js}} 




this.getLoadableFonts = function(){ 
    dev.log.font('.getLoadableFonts()'); //#development
    dev.count('.font.getLoadableFonts'); //#development

    const defaultFontNames = ['defaultThick','defaultThin'];
    const loadableFontNames = fontFileNames.map(a => a.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]);
    return defaultFontNames.concat(loadableFontNames);
};
this.getLoadedFonts = function(){
    dev.log.font('.getLoadedFonts()'); //#development
    dev.count('.font.getLoadedFonts'); //#development

    const defaultFontNames = ['defaultThick','defaultThin'];
    const loadedFontNames = fontFileNames.map(a => a.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]).filter(name => vectorLibrary[name].loadWasSuccess);
    return defaultFontNames.concat(loadedFontNames);
};




this.isApprovedFont = function(fontName){
    dev.log.font('.isApprovedFont(',fontName); //#development
    dev.count('.font.isApprovedFont'); //#development

    return vectorLibrary[fontName] != undefined;
};
this.loadFont = function(fontName,force,onLoaded=()=>{}){
    dev.log.font('.loadFont(',fontName,onLoaded); //#development
    dev.count('.font.loadFont'); //#development

    if(vectorLibrary[fontName] == undefined){ console.warn('elementLibrary.character.loadFont : error : unknown font name:',fontName); return false;}

    //make sure font file is on the approved list
        if( !this.isApprovedFont(fontName) ){
            console.warn('library.font.loadFont error: attempting to load unapproved font:',fontName); 
            return;
        }

    //if font is already loaded, bail
        if( !force && vectorLibrary[fontName].loadComplete ){return;}

    //set up library entry
        vectorLibrary[fontName].loadAttempted = true;
        vectorLibrary[fontName].loadComplete = false;
        vectorLibrary[fontName].loadWasSuccess = undefined;
        vectorLibrary[fontName]['default'] = {vector:[0,0, 1,0, 0,-1, 1,0, 0,-1, 1,-1]};

    //load file
        const filename = vectorLibrary[fontName].fileName;
        library.misc.loadFileFromURL(
            fontFilesLocation+filename,
            fontData => {
                const vectors = library.font.extractGlyphs(fontData.response,reducedGlyphSet);
                Object.keys(vectors).forEach(glyphName => vectorLibrary[fontName][glyphName] = vectors[glyphName] );
                vectorLibrary[fontName].loadComplete = true;
                vectorLibrary[fontName].loadWasSuccess = true;
                onLoaded({fontName:fontName, loadWasSuccess:true});
            },
            () => {
                vectorLibrary[fontName].loadComplete = true;
                vectorLibrary[fontName].loadWasSuccess = false;
                onLoaded({fontName:fontName, loadWasSuccess:false});
            },
            'arraybuffer',
        );
};


this.isValidCharacter = function(fontName, character){
    return vectorLibrary[fontName][character] != undefined;
};

this.getDefaultVector = function(fontName){
    return vectorLibrary[fontName].default.vector;
};
this.getVector = function(fontName, character){
    return vectorLibrary[fontName][character].vector;
};
this.getRatio = function(fontName, character){
    return vectorLibrary[fontName][character].ratio;
}
this.getOffset = function(fontName, character){
    return vectorLibrary[fontName][character].offset;
}
this.getEncroach = function(fontName, character, otherCharacter){
    return vectorLibrary[fontName][character].encroach[otherCharacter];
}
this.getMiscDefaultData = function(fontName){
    return {
        ascender: vectorLibrary[fontName].default.ascender,
        descender: vectorLibrary[fontName].default.descender,
        leftSideBearing: vectorLibrary[fontName].default.leftSideBearing,
        advanceWidth: vectorLibrary[fontName].default.advanceWidth,
        xMax: vectorLibrary[fontName].default.xMax,
        yMax: vectorLibrary[fontName].default.yMax,
        xMin: vectorLibrary[fontName].default.xMin,
        yMin: vectorLibrary[fontName].default.yMin,
        top: vectorLibrary[fontName].default.top,
        left: vectorLibrary[fontName].default.left,
        bottom: vectorLibrary[fontName].default.bottom,
        right: vectorLibrary[fontName].default.right,
    };
};
this.getMiscData = function(fontName, character){
    return {
        ascender: vectorLibrary[fontName][character].ascender,
        descender: vectorLibrary[fontName][character].descender,
        leftSideBearing: vectorLibrary[fontName][character].leftSideBearing,
        advanceWidth: vectorLibrary[fontName][character].advanceWidth,
        xMax: vectorLibrary[fontName][character].xMax,
        yMax: vectorLibrary[fontName][character].yMax,
        xMin: vectorLibrary[fontName][character].xMin,
        yMin: vectorLibrary[fontName][character].yMin,
        top: vectorLibrary[fontName][character].top,
        left: vectorLibrary[fontName][character].left,
        bottom: vectorLibrary[fontName][character].bottom,
        right: vectorLibrary[fontName][character].right,
    };
};