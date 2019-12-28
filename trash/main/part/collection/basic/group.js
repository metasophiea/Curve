const groupObject = function(_id,_name){
    dev.log.part(' - new groupObject('+_id+')'); //#development
    const id = _id;
    this.getId = function(){return id;};
    const name = _name;
    this.getName = function(){return name;};

    this.ignored = function(bool){ 
        dev.log.part(' - groupObject.ignored('+bool+')'); //#development
        return _canvas_.core.element.executeMethod(id,'ignored',[bool]);
    };
    this.x = function(number){ 
        dev.log.part(' - groupObject.x('+number+')'); //#development
        return _canvas_.core.element.executeMethod(id,'x',[number]);
    };
    this.y = function(number){ 
        dev.log.part(' - groupObject.y('+number+')'); //#development
        return _canvas_.core.element.executeMethod(id,'y',[number]);
    };
    this.angle = function(number){ 
        dev.log.part(' - groupObject.angle('+number+')'); //#development
        return _canvas_.core.element.executeMethod(id,'angle',[number]);
    };
    this.scale = function(number){ 
        dev.log.part(' - groupObject.scale('+number+')'); //#development
        return _canvas_.core.element.executeMethod(id,'scale',[number]);
    };
    this.heedCamera = function(bool){ 
        dev.log.part(' - groupObject.heedCamera('+bool+')'); //#development
        return _canvas_.core.element.executeMethod(id,'heedCamera',[bool]);
    };
    this.static = function(bool){ 
        dev.log.part(' - groupObject.static('+bool+')'); //#development
        return _canvas_.core.element.executeMethod(id,'static',[bool]);
    };
    this.unifiedAttribute = function(attributes){ 
        dev.log.part(' - groupObject.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        return _canvas_.core.element.executeMethod(id,'unifiedAttribute',[attributes]);
    };
    this.getAddress = function(){ 
        dev.log.part(' - groupObject.getAddress()'); //#development
        return _canvas_.core.element.executeMethod(id,'getAddress',[]);
    };
    this.children = function(){ 
        dev.log.part(' - groupObject.children()'); //#development
        return new Promise((resolve, reject) => {
            _canvas_.core.element.executeMethod(id,'children',[]).then(childIds => {
                resolve(childIds.map(id => partRegistry[id]));
            });
        });
    };
    this.getChildByName = function(name){
        dev.log.part(' - groupObject.getChildByName()'); //#development
        return new Promise((resolve, reject) => {
            _canvas_.core.element.executeMethod(id,'getChildByName',[name]).then(childId => {
                resolve(partRegistry[childId]);
            });
        });
    };

    // {methodName:'getChildIndexByName',arguments:['name']},
    // {methodName:'contains',arguments:['elementId']},
    // {methodName:'append',arguments:['elementId']},
    // {methodName:'prepend',arguments:['elementId']},
    // {methodName:'remove',arguments:['elementId']},
    // {methodName:'clear',arguments:[]},
    // {methodName:'getElementsUnderPoint',arguments:['x','y']},
    // {methodName:'getElementsUnderArea',arguments:['points']},
    // {methodName:'getTree',arguments:[]},
    // {methodName:'stencil',arguments:['elementId']},
    // {methodName:'clipActive',arguments:['bool']},
    // {methodName:'_dump',arguments:[]},
};


this.group = function(name=null, x=0, y=0, angle=0, ignored=false){
    return new Promise((resolve, reject) => {
        _canvas_.core.element.create('group',name).then(id => {
            _canvas_.core.boatload.element.executeMethod.load({
                id:id, method:'unifiedAttribute',
                argumentList:[{ignored:ignored, x:x, y:y, angle:angle}]
            });
            _canvas_.core.boatload.element.executeMethod.ship();
            resolve( partRegistry[id] = new groupObject(id,name) );
        });
    });
}

interfacePart.partLibrary.basic.group = function(name,data){ 
    return interfacePart.collection.basic.group(name, data.x, data.y, data.angle, data.ignored);
};