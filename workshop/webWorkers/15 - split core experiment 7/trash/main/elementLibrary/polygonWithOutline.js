this.polygonWithOutline = function(_id,_name){
    dev.log.elementLibrary(' - new polygonWithOutline('+_id+')'); //#development
    
    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};
    this.getType = function(){return 'polygonWithOutline';};

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
        jointDetail: 25,
        jointType: 'sharp',
        sharpLimit: 4,
        static: false,
    };
    function executeMethod(method,argumentList,postProcessing){
        return new Promise((resolve, reject) => { 
            communicationModule.run('element.executeMethod',[id,method,argumentList],result => {
                if(postProcessing){resolve(postProcessing(result));}else{resolve(result);}
            });
        });
    }

    this.ignored = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.ignored('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.ignored; } cashedAttributes.ignored = bool;
        return executeMethod('ignored',[bool]);
    };
    this.colour = function(colour,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.colour('+JSON.stringify(colour)+')'); //#development
        if(useCache && colour == undefined){ return cashedAttributes.colour; } cashedAttributes.colour = colour;
        return executeMethod('colour',[colour]);
    };
    this.lineColour = function(colour,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.lineColour('+JSON.stringify(colour)+')'); //#development
        if(useCache && colour == undefined){ return cashedAttributes.lineColour; } cashedAttributes.lineColour = colour;
        return executeMethod('lineColour',[colour]);
    };
    this.points = function(points,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.points('+points+')'); //#development
        if(useCache && points == undefined){ return cashedAttributes.points; } cashedAttributes.points = points;
        return executeMethod('points',[points]);
    }; 
    this.pointsAsXYArray = function(points,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.pointsAsXYArray('+points+')'); //#development
        function pointsToXYArray(points){ 
            const output = [];
            for(let a = 0; a < points.length; a+=2){ output.push({x:points[a], y:points[a+1]}); }
            return output;
        }
        
        if(useCache && pointsXY == undefined){ return pointsToXYArray(cashedAttributes.points); } 
        cashedAttributes.points = pointsXY.map((point) => [point.x,point.y]).flat();
        return executeMethod('pointsAsXYArray',[pointsXY])
    };
    this.scale = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.scale('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.scale; } cashedAttributes.scale = number;
        return executeMethod('scale',[number]);
    };
    this.thickness = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.thickness('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.thickness; } cashedAttributes.thickness = number;
        return executeMethod('thickness',[number]);
    };
    this.jointDetail = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.jointDetail('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.jointDetail; } cashedAttributes.jointDetail = number;
        return executeMethod('jointDetail',[number]);
    };
    this.jointType = function(type,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.jointType('+type+')'); //#development
        if(useCache && type == undefined){ return cashedAttributes.jointType; } cashedAttributes.jointType = type;
        return executeMethod('jointType',[type]);
    };
    this.sharpLimit = function(number,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.sharpLimit('+number+')'); //#development
        if(useCache && number == undefined){ return cashedAttributes.sharpLimit; } cashedAttributes.sharpLimit = number;
        return executeMethod('sharpLimit',[number]);
    };
    this.static = function(bool,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.static('+bool+')'); //#development
        if(useCache && bool == undefined){ return cashedAttributes.static; } cashedAttributes.static = bool;
        return executeMethod('static',[bool]);
    };
    this.unifiedAttribute = function(attributes,useCache=useCache_default){
        dev.log.elementLibrary(' - polygonWithOutline.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        if(useCache && attributes == undefined){ return cashedAttributes; } 
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        return executeMethod('unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){
        dev.log.elementLibrary(' - polygonWithOutline.getAddress()'); //#development
        return executeMethod('getAddress',[]);
    };

    this._dump = function(){
        dev.log.elementLibrary(' - polygonWithOutline._dump()'); //#development
        return executeMethod('_dump',[]);
    };
};