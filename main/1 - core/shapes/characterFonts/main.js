this.character.vectorLibrary = {};
const reducedGlyphSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:;?!/\\()[]{}#-_\'"|><+=&*~%'.split('');
const fontFilesLocation = '/fonts/';
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
library.character.getLoadedFonts = function(){ 
    var defaultFontNames = ['defaultThick','defaultThin'];
    var loadedFontNames = fontFileNames.map(a => a.split('.').slice(0,-1)[0].split('/').slice(1,2)[0]);
    return  defaultFontNames.concat(loadedFontNames);
};

if(core.devMode){ console.log('-- Loading Advanced Fonts --'); }
//load and extract all fonts
    fontFileNames.forEach(name => {
        //remove extension from name
            var vectorLibraryName = name.split('.').slice(0,-1)[0].split('/').slice(1,2)[0];
            library.character.vectorLibrary[vectorLibraryName] = {};
            library.character.vectorLibrary[vectorLibraryName].isLoaded = false;
            //add default glyph
                library.character.vectorLibrary[vectorLibraryName]['default'] = {vector:[0,0, 1,0, 0,-1, 1,0, 0,-1, 1,-1]};

        //code to be run when data has loaded
            function func(fontData){
                library.character.vectorLibrary[vectorLibraryName] = _canvas_.library.font.extractGlyphs(fontData,reducedGlyphSet);
                library.character.vectorLibrary[vectorLibraryName]['default'] = {vector:[0,0, 1,0, 0,-1, 1,0, 0,-1, 1,-1]};
                library.character.vectorLibrary[vectorLibraryName].isLoaded = true;

                if(core.devMode){ console.log('loaded font:',name,'(now named "'+vectorLibraryName+'")'); }
            }

        //load file
            if(core.devMode){ console.log('attempting: '+ name,fontFilesLocation+name); }
            _canvas_.library.misc.loadFileFromURL(fontFilesLocation+name, func, 'arraybuffer');
    });


{{include:defaultThick.js}}
{{include:defaultThin.js}}