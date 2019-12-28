this.character.vectorLibrary = {};
const reducedGlyphSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:;?!/\\()[]{}#-_\'"|><+=&*~%'.split('');
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
    dev.log.elementLibrary.characterFonts('.vectorLibrary - fontFileNames -> name: '+name); //#development
    var libraryEntryName = name.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]; //produce font name from file name
    elementLibrary.character.vectorLibrary[libraryEntryName] = {};
    elementLibrary.character.vectorLibrary[libraryEntryName].fileName = name;
    elementLibrary.character.vectorLibrary[libraryEntryName].loadAttempted = false;
    elementLibrary.character.vectorLibrary[libraryEntryName].isLoaded = false;
});




elementLibrary.character.getLoadableFonts = function(){ 
    dev.log.elementLibrary.characterFonts('.getLoadableFonts()'); //#development
    var defaultFontNames = ['defaultThick','defaultThin'];
    var loadableFontNames = fontFileNames.map(a => a.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]);
    return defaultFontNames.concat(loadableFontNames);
};
elementLibrary.character.getLoadedFonts = function(){
    dev.log.elementLibrary.characterFonts('.getLoadedFonts()'); //#development
    var defaultFontNames = ['defaultThick','defaultThin'];
    var loadedFontNames = fontFileNames.map(a => a.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]).filter(name => elementLibrary.character.vectorLibrary[name].isLoaded);
    return defaultFontNames.concat(loadedFontNames);
};

elementLibrary.character.isApprovedFont = function(fontName){
    dev.log.elementLibrary.characterFonts('.isApprovedFont(',fontName); //#development
    return elementLibrary.character.vectorLibrary[fontName] != undefined;
};
elementLibrary.character.isFontLoaded = function(fontName){ 
    dev.log.elementLibrary.characterFonts('.isFontLoaded(',fontName); //#development
    if(elementLibrary.character.vectorLibrary[fontName] == undefined){ report.warning('elementLibrary.character.isFontLoaded : error : unknown font name:',fontName); return false;}
    return elementLibrary.character.vectorLibrary[fontName].isLoaded;
}
elementLibrary.character.fontLoadAttempted = function(fontName){ 
    dev.log.elementLibrary.characterFonts('.fontLoadAttempted(',fontName); //#development
    if(elementLibrary.character.vectorLibrary[fontName] == undefined){ report.warning('elementLibrary.character.fontLoadAttempted : error : unknown font name:',fontName); return false;}
    return elementLibrary.character.vectorLibrary[fontName].loadAttempted;
}
elementLibrary.character.loadFont = function(fontName){
    dev.log.elementLibrary.characterFonts('.loadFont(',fontName); //#development
    if(elementLibrary.character.vectorLibrary[fontName] == undefined){ report.warning('elementLibrary.character.loadFont : error : unknown font name:',fontName); return false;}
    var filename = elementLibrary.character.vectorLibrary[fontName].fileName;

    //make sure font file is on the approved list
        if( !fontFileNames.includes(filename) && !systemFonts.includes(fontName) ){
            report.warning('elementLibrary.character.loadFont error: attempting to load unapproved font:',fontName); 
            return;
        }

    //if font is already loaded, bail
        if( elementLibrary.character.vectorLibrary[fontName].isLoaded ){return;}

    //set up library entry
        elementLibrary.character.vectorLibrary[fontName].loadAttempted = true;
        elementLibrary.character.vectorLibrary[fontName].isLoaded = false;
        elementLibrary.character.vectorLibrary[fontName]['default'] = {vector:[0,0, 1,0, 0,-1, 1,0, 0,-1, 1,-1]};

    //code to be run when data has loaded
        function func(fontData){
            var vectors = library.font.extractGlyphs(fontData,reducedGlyphSet);
            Object.keys(vectors).forEach(glyphName => elementLibrary.character.vectorLibrary[fontName][glyphName] = vectors[glyphName] );
            elementLibrary.character.vectorLibrary[fontName].isLoaded = true;
            dev.log.elementLibrary.characterFonts('.loadFont -> loaded font:',filename,'(now named "'+fontName+'")'); //#development
        }

    //load file
        dev.log.elementLibrary.characterFonts('.loadFont -> attempting: '+ name,fontFilesLocation+filename); //#development
        library.misc.loadFileFromURL(fontFilesLocation+filename, func, 'arraybuffer');
};

{{include:defaultThick.js}}
{{include:defaultThin.js}} 