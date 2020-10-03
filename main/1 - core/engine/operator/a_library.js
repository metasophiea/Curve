this.library = new function(){
    this.imageRequester = new function(){
        const defaultImageUrl = '/images/noimageimage.png';
        const database = {};

        this.isImageLoaded = function(url){
            if( ! (url in database) ) {
                return false;
            }

            return database[url].isLoaded;
        };
        this.loadImage = function(url, forceReload=false){
            database[url] = {
                isLoaded: false,
                imageData: undefined,
            };

            library.misc.loadImageFromURL(
                url, 
                data => {
                    database[url].isLoaded = true;
                    database[url].imageData = data;
                },
                data => {
                    console.warn("operator.library.imageRequester : could not find image at url \""+url+"\"");
                    console.warn("operator.library.imageRequester : error type:", data);
                    library.misc.loadImageFromURL(
                        defaultImageUrl,
                        data => {
                            database[url].isLoaded = true;
                            database[url].imageData = data;
                        },
                    );
                }
            );
        };
        this.getImageData = function(url){
            if( ! (url in database) ) {
                return;
            }

            return database[url].imageData;
        };
    };
    this.font = new function(){
        this.loadFont = function(font_name, force){
            library.font.loadFont(font_name, force, data => {
                ENGINE.element__alert_font_loaded(data.fontName, data.loadWasSuccess);
            });
        };
    };
};