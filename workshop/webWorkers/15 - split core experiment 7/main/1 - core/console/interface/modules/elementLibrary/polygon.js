this.polygon = function(_id,_name){
    dev.log.elementLibrary(' - new polygon('+_id+')'); //#development

    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'polygon';};

    const useCache_default = true;
    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        points: [], 
        scale: 1,
        static: false,
    };
    function resolvedPromise(data){
        return new Promise((resolve,reject) => {resolve(data)});
    }
    function executeMethod(method,argumentList,postProcessing){
        return new Promise((resolve, reject) => { 
            communicationModule.run('element.executeMethod',[id,method,argumentList],result => {
                if(postProcessing){resolve(postProcessing(result));}else{resolve(result);}
            });
        });
    }

    this.ignored = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - polygon.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.ignored); } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.colour = function(colour,useCache=useCache_default){
        dev.log.elementLibrary(' - polygon.colour('+JSON.stringify(colour)+')'); //#development
        if(useCache && colour == undefined){ return resolvedPromise(cashedAttributes.colour); } cashedAttributes.colour = colour;
        return executeMethod('colour',[colour]);
    };
    this.points = function(points,useCache=useCache_default){
        dev.log.elementLibrary(' - polygon.points('+JSON.stringify(points)+')'); //#development
        if(useCache && points == undefined){ return resolvedPromise(cashedAttributes.points); } cashedAttributes.points = points;
        return executeMethod('points',[points]);
    }; 
    this.pointsAsXYArray = function(pointsXY,useCache=useCache_default){
        dev.log.elementLibrary(' - polygon.pointsAsXYArray('+JSON.stringify(pointsXY)+')'); //#development
        function pointsToXYArray(points){ 
            const output = [];
            for(let a = 0; a < points.length; a+=2){ output.push({x:points[a], y:points[a+1]}); }
            return output;
        }
        
        if(useCache && pointsXY == undefined){ return resolvedPromise(pointsToXYArray(cashedAttributes.points)); } 
        cashedAttributes.points = pointsXY.map((point) => [point.x,point.y]).flat();
        return executeMethod('pointsAsXYArray',[pointsXY])
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - polygon.scale('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.scale); } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - polygon.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.static); } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - polygon.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return resolvedPromise(cashedAttributes); } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - polygon.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - polygon._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};