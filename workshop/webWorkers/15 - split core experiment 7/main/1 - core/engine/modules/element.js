const element = new function(){
    //element library
        const elementLibrary = new function(){
            const elementLibrary = this;
            {{include:elementLibrary/main.js}}
        };
        this.__ = elementLibrary;
        this.getAvailableElements = function(){ 
            dev.log.element('.getAvailableElements()'); //#development
            return Object.keys(elementLibrary);
        };
        this.installElement = function(elementName, creatorMethod, allowOverwrite=false){
            dev.log.element('.installElement('+elementName+','+(typeof creatorMethod == 'function' ? '-creatorMethod-' : undefined)+','+allowOverwrite+')'); //#development

            if(!allowOverwrite && elementName in elementLibrary){
                dev.log.element('.installElement -> element "'+elementName+'" is already in the elementLibrary'); //#development
                return false
            }
            elementLibrary[elementName] = creatorMethod;
            return true;
        };

    //element control
        //database
            const createdElements = [];
            function generateElementId(){
                let id = createdElements.findIndex(item => item==undefined);
                return id != -1 ? id : createdElements.length;
            }
            function getElementFromId(id){ return createdElements[id]; }
            function getIdFromElement(element){ return element.getId(); }

            this.getElementFromId = getElementFromId;
            this.getIdFromElement = getIdFromElement;
            this.getCreatedElements = function(){ 
                dev.log.element('.getCreatedElements()'); //#development
                return createdElements;
            };

        //creation
            this.create_skipDatabase = function(type,name){
                dev.log.element('.create_skipDatabase('+type+','+name+')'); //#development
                return new elementLibrary[type](name,-1);
            };
            this.create = function(type,name){
                dev.log.element('.create('+type+','+name+')'); //#development

                if(type == undefined){ report.error('elememt.createElement: type argument not provided - element will not be produced'); return; }
                if(name == undefined){ report.error('elememt.createElement: name argument not provided - element will not be produced'); return; }
                if(elementLibrary[type] == undefined){ report.error('elememt.createElement: type "'+type+'" does not exist - element will not be produced'); return; }

                const newElement_id = generateElementId();
                createdElements[newElement_id] = new elementLibrary[type](name,newElement_id);
                return createdElements[newElement_id];
            };

        //deletion
            this.delete = function(element){ 
                dev.log.element('.delete('+element+')'); //#development
                createdElements[getIdFromElement(element)] = undefined;
            };
            this.deleteAllCreated = function(){ 
                dev.log.element('.deleteAllCreated()'); //#development
                for(let a = 0; a < createdElements.length; a++){this.delete(getElementFromId(a));}
            };

        //other
            this.getTypeById = function(element){ 
                dev.log.element('.getTypeById('+element+')'); //#development
                return element.getType();
            };
            this._dump = function(){
                report.info('element._dump()');
                Object.keys(elementLibrary).forEach(key => { report.info('element._dump -> elementLibrary: '+key); })

                if(createdElements.length == 0){ report.info('element._dump -> there are no created elements'); }
                else if(createdElements.length == 1){ report.info('element._dump -> there is 1 created element'); }
                else{ report.info('element._dump -> there are '+createdElements.length+' created elements'); }
                
                createdElements.forEach(item => { report.info('element._dump -> createdElements: '+JSON.stringify(item)); });
            };
};