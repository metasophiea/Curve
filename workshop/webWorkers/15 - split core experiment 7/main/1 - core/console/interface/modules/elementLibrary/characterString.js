this.characterString = function(_name){
    dev.log.elementLibrary(' - new characterString('+_name+')'); //#development

    let id = -1;
    this.getId = function(){return id;};
    this.__idRecieved = function(){};
    this.__id = function(a){
        dev.log.elementLibrary(' - characterString.__id('+a+')'); //#development
        id = a;
        repush(this);
        if(this.__idRecieved){this.__idRecieved();}
    };
    let name = _name;
    this.getName = function(){return name;};
    this.setName = function(a){name = a;};
    this.getType = function(){return 'characterString';};
    this.parent = undefined;

    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        angle: 0,
        width: 10,
        height: 10,
        font: 'defaultThin',
        string: '',
        spacing: 0.5,
        interCharacterSpacing: 0,
        printingMode: { widthCalculation:'absolute', horizontal:'left', vertical:'bottom' },
        scale: 1,
        static: false,
    };
    const cashedAttributes_presentationOnly = {
        resultingWidth: 0, 
    };
    const cashedCallbacks = {};
    const cashedCallbacks_elementSpecific = {
        onFontUpdateCallback:function(){},
    };

    function repush(self){ 
        dev.log.elementLibrary(' - characterString::repush()'); //#development
        _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[cashedAttributes]);
        Object.entries(cashedCallbacks).forEach(entry => { _canvas_.core.callback.attachCallback(self,entry[0],entry[1]); });
    }

    this.__updateValues = function(data){
        dev.log.elementLibrary(' - characterString.__updateValues('+JSON.stringify(data)+')'); //#development
        Object.keys(data).forEach(key => { cashedAttributes_presentationOnly[key] = data[key]; });
    };
    this.__runCallback = function(data){
        Object.entries(data).forEach(entry => {
            if(entry[0] in cashedCallbacks_elementSpecific){ cashedCallbacks_elementSpecific[entry[0]](entry[1]); }
        });
    };

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
        dev.log.elementLibrary(' - characterString.ignored('+bool+')'); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){
            _canvas_.core.element.__executeMethod(id,'ignored',[bool]);
        }
    };
    this.colour = function(colour){
        if(colour == undefined){ return cashedAttributes.colour; }
        dev.log.elementLibrary(' - characterString.colour('+JSON.stringify(colour)+')'); //#development
        cashedAttributes.colour = colour;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'colour',[colour]); }
    };
    this.x = function(number){
        if(number == undefined){ return cashedAttributes.x; }
        dev.log.elementLibrary(' - characterString.x('+number+')'); //#development
        cashedAttributes.x = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'x',[number]); }
    };
    this.y = function(number){
        if(number == undefined){ return cashedAttributes.y; }
        dev.log.elementLibrary(' - characterString.y('+number+')'); //#development
        cashedAttributes.y = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'y',[number]); }
    };
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; }
        dev.log.elementLibrary(' - characterString.scale('+number+')'); //#development
        cashedAttributes.scale = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'scale',[number]); }
    };
    this.angle = function(number){
        if(number == undefined){ return cashedAttributes.angle; }
        dev.log.elementLibrary(' - characterString.angle('+number+')'); //#development
        cashedAttributes.angle = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'angle',[number]); }
    };
    this.width = function(number){
        if(number == undefined){ return cashedAttributes.width; }
        dev.log.elementLibrary(' - characterString.width('+number+')'); //#development
        cashedAttributes.width = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'width',[number]); }
    };
    this.height = function(number){
        if(number == undefined){ return cashedAttributes.height; }
        dev.log.elementLibrary(' - characterString.height('+number+')'); //#development
        cashedAttributes.height = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'height',[number]); }
    };
    this.font = function(font){
        if(font == undefined){ return cashedAttributes.font; }
        dev.log.elementLibrary(' - characterString.font('+font+')'); //#development
        cashedAttributes.font = font;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'font',[font]); }
    };
    this.string = function(string){
        if(string == undefined){ return cashedAttributes.string; }
        dev.log.elementLibrary(' - characterString.string('+string+')'); //#development
        cashedAttributes.string = string;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'string',[string]); }
    };
    this.interCharacterSpacing = function(number){
        if(number == undefined){ return cashedAttributes.interCharacterSpacing; }
        dev.log.elementLibrary(' - characterString.interCharacterSpacing('+number+')'); //#development
        cashedAttributes.interCharacterSpacing = number;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'interCharacterSpacing',[number]); }
    };
    this.printingMode = function(printingMode){
        if(printingMode == undefined){ return cashedAttributes.printingMode; }
        dev.log.elementLibrary(' - characterString.printingMode('+printingMode+')'); //#development
        cashedAttributes.printingMode = printingMode;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'printingMode',[printingMode]); }
    };
    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; }
        dev.log.elementLibrary(' - characterString.static('+bool+')'); //#development
        cashedAttributes.static = bool;
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'static',[bool]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; }
        dev.log.elementLibrary(' - characterString.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'unifiedAttribute',[cashedAttributes]); }
    };

    this.getCallback = function(callbackType){
        if(callbackType in cashedCallbacks_elementSpecific){
            return cashedCallbacks_elementSpecific[callbackType];
        }

        return cashedCallbacks[callbackType];
    };
    this.attachCallback = function(callbackType, callback){
        dev.log.elementLibrary('['+this.getAddress()+'] - characterString.attachCallback('+callbackType+','+callback+')'); //#development
        if(callbackType in cashedCallbacks_elementSpecific){
            cashedCallbacks_elementSpecific[callbackType] = callback;
            return;
        }
        cashedCallbacks[callbackType] = callback;
        if(id != -1){ _canvas_.core.callback.attachCallback(this,callbackType,callback); }
    }
    this.removeCallback = function(callbackType){
        dev.log.elementLibrary('['+this.getAddress()+'] - characterString.removeCallback('+callbackType+')'); //#development
        if(callbackType in cashedCallbacks_elementSpecific){
            delete cashedCallbacks_elementSpecific[callbackType];
            return;
        }
        delete cashedCallbacks[callbackType];
        if(id != -1){ _canvas_.core.callback.removeCallback(this,callbackType); }
    }

    this.resultingWidth = function(){
        dev.log.elementLibrary(' - characterString.resultingWidth()'); //#development
        return cashedAttributes_presentationOnly.resultingWidth;
    };

    this._dump = function(){
        dev.log.elementLibrary(' - characterString._dump()'); //#development
        if(id != -1){ _canvas_.core.element.__executeMethod(id,'_dump',[]); }
    };
};