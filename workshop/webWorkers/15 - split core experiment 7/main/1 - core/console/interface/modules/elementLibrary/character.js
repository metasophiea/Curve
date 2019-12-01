this.character = function(_name){
    dev.log.elementLibrary(' - new character('+_name+')'); //#development

    let id = -1;
    this.getId = function(){return id;};
    this.__idRecieved = function(){};
    this.__id = function(a){
        dev.log.elementLibrary(' - character.__id('+a+')'); //#development
        id = a;
        repush(this);
        if(this.__idRecieved){this.__idRecieved();}
    };
    let name = _name;
    this.getName = function(){return name;};
    this.setName = function(a){name = a;};
    this.getType = function(){return 'character';};
    this.parent = undefined;

    const cashedAttributes = {
        ignored: false,
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
        font: 'defaultThin',
        character: '',
        printingMode: { horizontal:'left', vertical:'bottom' },
        scale: 1,
        static: false,
    };
    const cashedCallbacks = {};

    function repush(self){ 
        dev.log.elementLibrary(' - character::repush()'); //#development
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
        dev.log.elementLibrary(' - character.ignored('+bool+')'); //#development
        cashedAttributes.ignored = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'ignored',[bool]]); }
    };
    this.colour = function(colour){
        if(colour == undefined){ return cashedAttributes.colour; }
        dev.log.elementLibrary(' - character.colour('+JSON.stringify(colour)+')'); //#development
        cashedAttributes.colour = colour;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'colour',[colour]]); }
    };
    this.x = function(number){
        if(number == undefined){ return cashedAttributes.x; }
        dev.log.elementLibrary(' - character.x('+number+')'); //#development
        cashedAttributes.x = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'x',[number]]); }
    };
    this.y = function(number){
        if(number == undefined){ return cashedAttributes.y; }
        dev.log.elementLibrary(' - character.y('+number+')'); //#development
        cashedAttributes.y = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'y',[number]]); }
    };
    this.scale = function(number){
        if(number == undefined){ return cashedAttributes.scale; }
        dev.log.elementLibrary(' - character.scale('+number+')'); //#development
        cashedAttributes.scale = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'scale',[number]]); }
    };
    this.angle = function(number){
        if(number == undefined){ return cashedAttributes.angle; }
        dev.log.elementLibrary(' - character.angle('+number+')'); //#development
        cashedAttributes.angle = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'angle',[number]]); }
    };
    this.anchor = function(anchor){
        if(anchor == undefined){ return cashedAttributes.anchor; }
        dev.log.elementLibrary(' - character.anchor('+anchor+')'); //#development
        cashedAttributes.anchor = anchor;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'anchor',[anchor]]); }
    };
    this.width = function(number){
        if(number == undefined){ return cashedAttributes.width; }
        dev.log.elementLibrary(' - character.width('+number+')'); //#development
        cashedAttributes.width = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'width',[number]]); }
    };
    this.height = function(number){
        if(number == undefined){ return cashedAttributes.height; }
        dev.log.elementLibrary(' - character.height('+number+')'); //#development
        cashedAttributes.height = number;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'height',[number]]); }
    };
    this.font = function(font){
        if(font == undefined){ return cashedAttributes.font; }
        dev.log.elementLibrary(' - character.font('+font+')'); //#development
        cashedAttributes.font = font;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'font',[font]]); }
    };
    this.character = function(character){
        if(character == undefined){ return cashedAttributes.character; }
        dev.log.elementLibrary(' - character.character('+character+')'); //#development
        cashedAttributes.character = character;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'character',[character]]); }
    };
    this.printingMode = function(printingMode){
        if(printingMode == undefined){ return cashedAttributes.printingMode; }
        dev.log.elementLibrary(' - character.printingMode('+printingMode+')'); //#development
        cashedAttributes.printingMode = printingMode;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'printingMode',[printingMode]]); }
    };
    this.static = function(bool){
        if(bool == undefined){ return cashedAttributes.static; }
        dev.log.elementLibrary(' - character.static('+bool+')'); //#development
        cashedAttributes.static = bool;
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'static',[bool]]); }
    };
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return cashedAttributes; }
        dev.log.elementLibrary(' - character.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development
        Object.keys(attributes).forEach(key => { cashedAttributes[key] = attributes[key]; });
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'unifiedAttribute',[attributes]]); }
    };

    this._dump = function(){
        dev.log.elementLibrary(' - character._dump()'); //#development
        if(id != -1){ communicationModule.run('element.executeMethod',[id,'_dump',[]]); }
    };
};