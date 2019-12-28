_canvas_.layers = new function(){
    const layerRegistry = {};

    this.registerLayerLoaded = function(layerName, layer){
        if(layerRegistry[layerName] == undefined){ layerRegistry[layerName] = {}; }
        layerRegistry[layerName].isLoaded = true;
        layerRegistry[layerName].versionInformation = layer.versionInformation;
        if(this.onLayerLoad){this.onLayerLoad(layerName,layerRegistry);}
    };
    this.onLayerLoad = function(layerName,layerRegistry){};

    this.getVersionInformation = function(){
        return Object.keys(layerRegistry).map(key => { return {name:key, data:layerRegistry[key].versionInformation} });
    };
};