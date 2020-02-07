const arrangement = new function(){
    let design = element.create('group','root');

    this.new = function(){ 
        dev.log.arrangement('.new()'); //#development
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
        dev.log.arrangement('.get()'); //#development
        return design; 
    };
    this.set = function(arrangement){ 
        dev.log.arrangement('.set(',arrangement); //#development
        design = arrangement;
    };
    this.prepend = function(element){
        dev.log.arrangement('.prepend(',element); //#development
        design.prepend(element);
    };
    this.append = function(element){
        dev.log.arrangement('.append(',element); //#development
        design.append(element);
    };
    this.remove = function(element){ 
        dev.log.arrangement('.remove(',element); //#development
        design.remove(element); 
    };
    this.clear = function(){ 
        dev.log.arrangement('.clear()'); //#development
        design.clear(); 
    };

    this.getElementByAddress = function(address){
        dev.log.arrangement('.getElementByAddress(',address); //#development

        const route = address.split('/'); 
        route.shift();

        let currentObject = design;
        route.forEach(function(a){
            currentObject = currentObject.getChildByName(a);
        });

        return currentObject;
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.arrangement('.getElementsUnderPoint(',x,y); //#development
        return design.getElementsUnderPoint(x,y);
    };
    this.getElementsUnderArea = function(points){ 
        dev.log.arrangement('.getElementByAddress(',points); //#development
        return design.getElementsUnderArea(points); 
    };
        
    this.printTree = function(mode='spaced'){ //modes: spaced / tabular / address 
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

        if(design.children().length == 0){console.log('-empty-');}
        console.log(design.name+' ('+design.getId()+')');
        recursivePrint(design.getTree(), '');
    };
    this.areParents = function(elementId,potentialParents=[]){
        dev.log.arrangement('.areParents(',elementId,potentialParents); //#development

        let count = 0;
        let workingElement = element.getElementFromId(elementId);
        potentialParents = potentialParents.map(id => element.getElementFromId(id));

        do{
            let index = potentialParents.indexOf(workingElement);
            if(index != -1){
                potentialParents[index] = count++;
            }
        }while((workingElement=workingElement.parent) != undefined);

        return potentialParents.map(item => typeof item == 'number' ? item : null);
    };

    this._dump = function(){ design._dump(); };
};