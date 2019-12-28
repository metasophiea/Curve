this.arrangement = new function(){
    const design = self.element.create('group','root',0,true)

    this.new = function(){
        dev.log.interface('.arrangement.new()'); //#development
        communicationModule.run('arrangement.new');
        design.clear();
        design.unifiedAttribute({
            x: 0,
            y: 0,
            angle: 0,
            scale: 1,
            heedCamera: false,
            static: false,
        });
    };
    this.get = function(){
        dev.log.interface('.arrangement.get()'); //#development
        return design;
    };
    this.prepend = function(element){
        dev.log.interface('.arrangement.prepend()'); //#development
        return design.prepend(element);
    };
    this.append = function(element){
        dev.log.interface('.arrangement.append()'); //#development
        return design.append(element);
    };
    this.remove = function(element){
        dev.log.interface('.arrangement.remove()'); //#development
        return design.remove(element);
    };
    this.clear = function(){
        dev.log.interface('.arrangement.clear()'); //#development
        return design.clear();
    };
    this.getElementByAddress = function(address){
        dev.log.interface('.arrangement.getElementByAddress(',address); //#development
        
        const route = address.split('/');
        route.shift();

        let currentObject = design;
        route.forEach((a) => {
            currentObject = currentObject.getChildByName(a);
        });

        return currentObject;
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.interface('.arrangement.getElementsUnderPoint(',x,y); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementsUnderPoint',[x,y],results => {
                resolve(results.map(result => elementRegistry[result]));
            });
        });
    };
    this.getElementsUnderArea = function(points){
        dev.log.interface('.arrangement.getElementsUnderArea(',points); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.getElementsUnderArea',[points],results => {
                resolve(results.map(result => elementRegistry[result]));
            });
        });
    };
    this.printTree = function(mode='spaced',local=false){
        dev.log.interface('.arrangement.printTree(',mode,local); //#development

        if(local){
            function recursivePrint(grouping,prefix=''){
                grouping.children.forEach(function(a){
                    if(mode == 'spaced'){
                        console.log(prefix+' -  '+a.name+' ('+a.id+')');
                        if(a.type == 'group'){ recursivePrint(a, prefix+' - ') }
                    }else if(mode == 'tabular'){
                        console.log(prefix+'\t-\t\t'+a.name+' ('+a.id+')');
                        if(a.type == 'group'){ recursivePrint(a, prefix+'\t-\t') }
                    }else if(mode == 'address'){
                        console.log(prefix+'/'+a.name+' ('+a.id+')');
                        if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                    }
                });
            }
    
            if(design.getChildren().length == 0){console.log('-empty-');}
            console.log(design.getName()+' ('+design.getId()+')');
            recursivePrint(design.getTree(), '');
        }else{
            communicationModule.run('arrangement.printTree',[mode]);
        }
    };
    this.areParents = function(element,potentialParents=[]){
        dev.log.interface('.arrangement.areParents(',element,potentialParents); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('arrangement.areParents',[element.getId(),potentialParents.map(parent => parent.getId())],resolve);
        });
    };
    this._dump = function(local=true,engine=true){
        dev.log.interface('.arrangement._dump(',local,engine); //#development

        if(local){
            console.log(design.getAddress(),'._dump()');
            console.log(design.getAddress(),'._dump -> id: '+design.getId());
            console.log(design.getAddress(),'._dump -> type: '+design.getType());
            console.log(design.getAddress(),'._dump -> name: '+design.getName());
            console.log(design.getAddress(),'._dump -> address: '+design.getAddress());
            console.log(design.getAddress(),'._dump -> parent: ',design.parent);
            console.log(design.getAddress(),'._dump -> ignored: '+design.ignored());
            console.log(design.getAddress(),'._dump -> x: '+design.x());
            console.log(design.getAddress(),'._dump -> y: '+design.y());
            console.log(design.getAddress(),'._dump -> angle: '+design.angle());
            console.log(design.getAddress(),'._dump -> scale: '+design.scale());
            console.log(design.getAddress(),'._dump -> heedCamera: '+design.heedCamera());
            console.log(design.getAddress(),'._dump -> static: '+design.static());
            console.log(design.getAddress(),'._dump -> children.length: '+design.getChildren().length);
            console.log(design.getAddress(),'._dump -> children: ',design.getChildren());
            console.log(design.getAddress(),'._dump -> clipActive: '+design.clipActive());
        }
        if(engine){
            _canvas_.core.element.__executeMethod(design.getId(),'_dump',[]);
        }
    };
};