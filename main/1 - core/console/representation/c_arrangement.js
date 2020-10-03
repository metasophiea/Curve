this.arrangement = new function(){
    const design = core.element.__createLocalWithId('Group','root',0);

    //root
        this.prepend = function(element){
            return design.prepend(element);
        };
        this.append = function(element){
            return design.append(element);
        };
        this.remove = function(element){
            return design.remove(element);
        };
        this.clear = function(){
            return design.clear();
        };
        this.shift = function(element, newPosition){
            return design.shift(element, newPosition);
        };

    //discovery
        this.getElementByAddress = function(address,local=true){
            if(local){
                const route = address.split('/');
                route.shift();
                route.shift();
        
                let currentObject = design;
                route.forEach((a) => {
                    currentObject = currentObject.getChildByName(a);
                });
        
                return currentObject;
            }else{
                return new Promise((resolve, reject) => {
                    interface.operator.arrangement.getElementByAddress(address).then(id => {
                        resolve(core.element.getElementById(id));
                    });
                });
            }

        };
        this.getElementsUnderPoint = function(x,y){
            return new Promise((resolve, reject) => {
                interface.operator.arrangement.getElementsUnderPoint(x,y).then(ids => {
                    const output = [];
                    for(let a = 0; a < ids.length; a++){
                        output.push( core.element.getElementById(ids[a]) );
                    }
                    resolve(output);
                });
            });
        };
        this.getElementsUnderArea = function(points){
            return new Promise((resolve, reject) => {
                interface.operator.arrangement.getElementsUnderArea(points).then(ids => {
                    const output = [];
                    for(let a = 0; a < ids.length; a++){
                        output.push( core.element.getElementById(ids[a]) );
                    }
                    resolve(output);
                });
            });
        };

    //misc
        this.printTree = function(mode='spaced',local=false){
            if(local){               
                function format(element, prefix='', mode='spaced'){
                    const data = '(id:'+element.getId() + ', type:'+element.getType() + ', x:'+element.x()+ ', y:'+element.y()+ ', angle:'+element.angle()+ ', scale:'+element.scale() + ')';
                    if(mode == 'spaced'){
                        return prefix+element.getName()+' '+data;
                    }else if(mode == 'tabular'){
                        return prefix+element.getName()+' '+data;
                    }else if(mode == 'address'){
                        return prefix+'/'+element.getName()+' '+data;
                    }
                }
                function recursivePrint(group, prefix='', mode='spaced'){
                    console.log( format(group, prefix, mode) );

                    let new_prefix = '';
                    if(mode == 'spaced'){
                        new_prefix = prefix+'- ';
                    }else if(mode == 'tabular'){
                        new_prefix = prefix+'-\t';
                    }else if(mode == 'address'){
                        new_prefix = prefix+'/'+group.getName();
                    }

                    group.getChildren().forEach(element => {
                        if(element.getType() == 'Group'){
                            recursivePrint(element, new_prefix, mode)
                        } else {
                            console.log( format(element, new_prefix, mode) );
                        }
                    });
                }
                recursivePrint(design, undefined, mode);
            } else {
                interface.operator.arrangement.printTree(mode);
            }
        };
        this.printSurvey = function(local=false){
            if(local){
                
            } else {
                interface.operator.arrangement.printSurvey();
            }
        };
        this._dump = function(){
            interface.operator.arrangement._dump();
        };
};