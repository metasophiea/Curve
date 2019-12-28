{{include:layers.js}}
_canvas_.library = new function(){
    {{include:library.js}}
};
_canvas_.layers.registerLayerLoaded('library',_canvas_.library);