this.path = function(_id,_name){
    dev.log.elementLibrary(' - new path('+_id+')'); //#development

    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'path';};

    const useCache_default = true;
    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        lineColour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        points: [], 
        scale: 1,
        thickness: 0,
        capType: 'none',
        jointDetail: 25,
        jointType: 'sharp',
        sharpLimit: 4,
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
        dev.log.elementLibrary(' - path.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.ignored); } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.colour = function(colour,useCache=useCache_default){
        dev.log.elementLibrary(' - path.colour('+JSON.stringify(colour)+')'); //#development
        if(useCache && colour == undefined){ return resolvedPromise(cashedAttributes.colour); } cashedAttributes.colour = colour;
        return executeMethod('colour',[colour]);
    };
    this.points = function(points,useCache=useCache_default){
        dev.log.elementLibrary(' - path.points('+points+')'); //#development
        if(useCache && points == undefined){ return resolvedPromise(cashedAttributes.points); } cashedAttributes.points = points;
        return executeMethod('points',[points]);
    }; 
    this.pointsAsXYArray = function(pointsXY,useCache=useCache_default){
        dev.log.elementLibrary(' - path.pointsAsXYArray('+pointsXY+')'); //#development
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
        dev.log.elementLibrary(' - path.scale('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.scale); } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.looping = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - path.looping('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.looping); } cashedAttributes.looping = bool;
        return executeMethod('looping',[bool]);
    };
    this.thickness = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - path.thickness('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.thickness); } cashedAttributes.thickness = number;
        return executeMethod('thickness',[number]);
    };
    this.capType = function(type,useCache=useCache_default){
        dev.log.elementLibrary(' - path.capType('+type+')'); //#development
        if(useCache && type == undefined){ return resolvedPromise(cashedAttributes.capType); } cashedAttributes.capType = type;
        return executeMethod('capType',[type]);
    };
    this.jointType = function(type,useCache=useCache_default){
        dev.log.elementLibrary(' - path.jointType('+type+')'); //#development
        if(useCache && type == undefined){ return resolvedPromise(cashedAttributes.jointType); } cashedAttributes.jointType = type;
        return executeMethod('jointType',[type]);
    };
    this.jointDetail = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - path.jointDetail('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.jointDetail); } cashedAttributes.jointDetail = number;
        return executeMethod('jointDetail',[number]);
    };
    this.sharpLimit = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - path.sharpLimit('+number+')'); //#development
        if(useCache && number == undefined){ return resolvedPromise(cashedAttributes.sharpLimit); } cashedAttributes.sharpLimit = number;
        return executeMethod('sharpLimit',[number]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - path.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return resolvedPromise(cashedAttributes.static); } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - path.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return resolvedPromise(cashedAttributes); } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - path.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - path._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};