_canvas_.layers = new function(){
    const layerRegistry = [];

    function getLayerIndexByName(layerName){
        for(let a = 0; a < layerRegistry.length; a++){
            if(layerRegistry[a].name == layerName){
                return a;
            }
        }
        return -1;
    }

    this.getVersionInformation = function(){
        return Object.keys(layerRegistry).map(key => { return {name:layerRegistry[key].name, data:layerRegistry[key].versionInformation} });
    };

    this.registerLayer = function(layerName, layer){
        if( getLayerIndexByName(layerName) != -1){
            console.error('_canvas_.layers.registerLayer('+layerName+','+layer+') : duplicate layer name detected ');
            return;
        }

        layerRegistry.push({
            name: layerName,
            isLoaded: false,
            versionInformation: layer.versionInformation,
            functionList:[],
        });

        if(this.onLayerRegistered){this.onLayerRegistered(layerName,layerRegistry);}
    };
    this.onLayerRegistered = function(layerName,layerRegistry){};

    this.declareLayerAsLoaded = function(layerName){
        let index = getLayerIndexByName(layerName);
        if( index == -1){
            console.error('_canvas_.layers.declareLayerAsLoaded('+layerName+') : unknown layer name ');
            return;
        }

        layerRegistry[index].isLoaded = true;
        if(this.onLayerLoad){this.onLayerLoad(layerName,layerRegistry);}
        layerRegistry[index].functionList.forEach(func => { func(); });
    };
    this.onLayerLoad = function(layerName,layerRegistry){};

    this.registerFunctionForLayer = function(layerName, func){
        let index = getLayerIndexByName(layerName);
        if( index == -1){
            console.error('_canvas_.layers.registerFunctionForLayer('+layerName+') : unknown layer name ');
            return;
        }
        layerRegistry[index].functionList.push(func);
    };
};