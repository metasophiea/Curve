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
];
//create locations in the vector library for these fonts
fontFileNames.forEach(name => {
    var libraryEntryName = name.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]; //produce font name from file name
    library.character.vectorLibrary[libraryEntryName] = {};
    library.character.vectorLibrary[libraryEntryName].fileName = name;
    library.character.vectorLibrary[libraryEntryName].loadAttempted = false;
    library.character.vectorLibrary[libraryEntryName].isLoaded = false;
});




library.character.getLoadableFonts = function(){ 
    var defaultFontNames = ['defaultThick','defaultThin'];
    var loadableFontNames = fontFileNames.map(a => a.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]);
    return defaultFontNames.concat(loadableFontNames);
};
library.character.getLoadedFonts = function(){
    var defaultFontNames = ['defaultThick','defaultThin'];
    var loadedFontNames = fontFileNames.map(a => a.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]).filter(name => library.character.vectorLibrary[name].isLoaded);
    return defaultFontNames.concat(loadedFontNames);
};

library.character.isApprovedFont = function(fontName){ return library.character.vectorLibrary[fontName] != undefined; };
library.character.isFontLoaded = function(fontName){ 
    if(library.character.vectorLibrary[fontName] == undefined){ console.warn('library.character.isFontLoaded : error : unknown font name:',fontName); return false;}
    return library.character.vectorLibrary[fontName].isLoaded;
}
library.character.fontLoadAttempted = function(fontName){ 
    if(library.character.vectorLibrary[fontName] == undefined){ console.warn('library.character.fontLoadAttempted : error : unknown font name:',fontName); return false;}
    return library.character.vectorLibrary[fontName].loadAttempted;
}
library.character.loadFont = function(fontName){
    if(library.character.vectorLibrary[fontName] == undefined){ console.warn('library.character.loadFont : error : unknown font name:',fontName); return false;}
    var filename = library.character.vectorLibrary[fontName].fileName;

    //make sure font file is on the approved list
        if( !fontFileNames.includes(filename) && !systemFonts.includes(fontName) ){
            console.warn('library.character.loadFont error: attempting to load unapproved font:',fontName); 
            return;
        }

    //if font is already loaded, bail
        if( library.character.vectorLibrary[fontName].isLoaded ){return;}

    //set up library entry
        library.character.vectorLibrary[fontName].loadAttempted = true;
        library.character.vectorLibrary[fontName].isLoaded = false;
        library.character.vectorLibrary[fontName]['default'] = {vector:[0,0, 1,0, 0,-1, 1,0, 0,-1, 1,-1]};

    //code to be run when data has loaded
        function func(fontData){
            var vectors = _canvas_.library.font.extractGlyphs(fontData,reducedGlyphSet);
            Object.keys(vectors).forEach(glyphName => library.character.vectorLibrary[fontName][glyphName] = vectors[glyphName] );
            library.character.vectorLibrary[fontName].isLoaded = true;
            if(core.devMode){ console.log('loaded font:',filename,'(now named "'+fontName+'")'); }
        }

    //load file
        if(core.devMode){ console.log('library.character.loadFont : attempting: '+ name,fontFilesLocation+filename); }
        _canvas_.library.misc.loadFileFromURL(fontFilesLocation+filename, func, 'arraybuffer');
};

{{include:defaultThick.js}}
{{include:defaultThin.js}}