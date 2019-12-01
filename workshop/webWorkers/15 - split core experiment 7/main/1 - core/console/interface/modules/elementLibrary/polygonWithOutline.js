this.polygonWithOutline = function(_name){
    dev.log.elementLibrary(' - new polygonWithOutline('+_name+')'); //#development

    let id = -1;
    this.getId = function(){return id;};
    this.__idRecieved = function(){};
    this.__id = function(a){
        dev.log.elementLibrary(' - polygonWithOutline.__id('+a+')'); //#development
        id = a;
        repush(this);
        if(this.__idRecieved){this.__idRecieved();}
    };
    let name = _name;
    this.getName = function(){return name;};
    this.setName = function(a){name = a;};
    this.getType = function(){return 'polygonWithOutline';};
    this.parent = undefined;

    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        lineColour: {r:1,g:0,b:0,a:1},
        points: [], 
        scale: 1,
        static: false,
    };
    const cashedCallbacks = {};

    function repush(self){ 
        dev.log.elementLibrary(' - polygonWithOutline::repush()'); //#development
        communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[cashedAttributes]]);
        Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(self,entry[0],entry[1]); });
    }

    this.getAddress = function(){
        return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + name;
    };
    this.getOffset = function(){
        dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset()'); //#development

        let output = {x:0,y:0,scale:1,angle:0};

        if(this.parent){
            dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset() -> parent found'); //#development
            const offset = this.parent.getOffset();
            const point = _canvas_.library.math.cartesianAngleAdjust(cashedAttributes.x,cashedAttributes.y,offset.angle);
            output = { 
                x: point.x*offset.scale + offset.x,
                y: point.y*offset.scale + offset.y,
                scale: offset.scale * cashedAttributes.scale,
                angle: offset.angle + cashedAttributes.angle,
            };
        }else{
            dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset -> no parent found'); //#development
            output = {x:cashedAttributes.x ,y:cashedAttributes.y ,scale:cashedAttributes.scale ,angle:cashedAttributes.angle};
        }

        dev.log.elementLibrary('['+this.getAddress()+'] - '+this.getType()+'.getOffset -> output: '+JSON.stringify(output)); //#development
        return output;
    };

    this.ignored = function(bool){
        if(bool == undefined){ return cashedAttributes.ignored; }
        dev.log.elementLibrary(' - polygonWithOutline.ignored('+bool+')'); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'ignored',[bool]]); }
    };
    this.colour = function(colour){
        if(colour == undefined){ return cashedAttributes.colour; }
        dev.log.elementLibrary(' - polygonWithOutline.colour('+JSON.stringify(colour)+')'); //#development
        cashedAttributes.colour = colour;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'colour',[colour]]); }
    };
    this.lineColour = function(colour){
        if(colour == undefined){ return cashedAttributes.lineColour; }
        dev.log.elementLibrary(' - circleWithOutline.lineColour('+JSON.stringify(colour)+')'); //#development
        cashedAttributes.lineColour = colour;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'lineColour',[colour]]); }
    };
    this.points = function(points){
        if(points == undefined){ return cashedAttributes.points; }
        dev.log.elementLibrary(' - polygonWithOutline.points('+JSON.stringify(points)+')'); //#development
        cashedAttributes.points = points;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'points',[points]]); }
    }; 
    this.pointsAsXYArray = function(pointsXY){
        function pointsToXYArray(points){ 
            const output = [];
            for(let a = 0; a < points.length; a+=2){ output.push({x:points[a], y:points[a+1]}); }
            return output;
        }
        if(pointsXY == undefined){ return pointsToXYArray(cashedAttributes.points); }
        dev.log.elementLibrary(' - polygonWithOutline.pointsAsXYArray('+JSON.stringify(pointsXY)+')'); //#development
        cashedAttributes.points = pointsXY.map((point) => [point.x,point.y]).flat();
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'pointsAsXYArray',[pointsXY]]); }
    };
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; }
        dev.log.elementLibrary(' - polygonWithOutline.scale('+number+')'); //#development
        cashedAttributes.scale = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'scale',[number]]); }
    };

    this.thickness = function(number){
        if(number == undefined){ return cashedAttributes.thickness; }
        dev.log.elementLibrary(' - polygonWithOutline.thickness('+number+')'); //#development
        cashedAttributes.thickness = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'thickness',[number]]); }
    };
    this.jointDetail = function(number){
        if(number == undefined){ return cashedAttributes.jointDetail; }
        dev.log.elementLibrary(' - polygonWithOutline.jointDetail('+number+')'); //#development
        cashedAttributes.jointDetail = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'jointDetail',[number]]); }
    };
    this.jointType = function(type){
        if(type == undefined){ return cashedAttributes.jointType; }
        dev.log.elementLibrary(' - polygonWithOutline.jointType('+type+')'); //#development
        cashedAttributes.jointType = type;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'jointType',[type]]); }
    };
    this.sharpLimit = function(number){
        if(number == undefined){ return cashedAttributes.sharpLimit; }
        dev.log.elementLibrary(' - polygonWithOutline.sharpLimit('+number+')'); //#development
        cashedAttributes.sharpLimit = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'sharpLimit',[number]]); }
    };

    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; }
        dev.log.elementLibrary(' - polygonWithOutline.static('+bool+')'); //#development
        cashedAttributes.static = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'static',[bool]]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; }
        dev.log.elementLibrary(' - polygonWithOutline.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[attributes]]); }
    };

    this.getCallback = function(callbackType){
        return cashedCallbacks[callbackType];
    };
    this.attachCallback = function(callbackType, callback){
        dev.log.elementLibrary(' - polygonWithOutline.attachCallback('+callbackType+','+callback+')'); //#development
        cashedCallbacks[callbackType] = callback;
        if(id != -1){ _canvas_.core.callback.attachCallback(this,callbackType,callback); }
    }
    this.removeCallback = function(callbackType){
        dev.log.elementLibrary(' - polygonWithOutline.removeCallback('+callbackType+')'); //#development
        delete cashedCallbacks[callbackType];
        if(id != -1){ _canvas_.core.callback.removeCallback(this,callbackType); }
    }

    this._dump = function(){
        dev.log.elementLibrary(' - polygonWithOutline._dump()'); //#development
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'_dump',[]]); }
    };
};