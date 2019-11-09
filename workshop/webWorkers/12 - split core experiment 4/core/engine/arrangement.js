const arrangement = new function(){
    //scene
        const scene = shape.createShape_raw('group','root');
        this.new = function(){
            dev.log('arrangement','.new()');
            scene.clear();
        };
        this.getChildren = function(){
            dev.log('arrangement','.getChildren()');
            return scene.children();
        };
        this.getChildByName = function(name){
            dev.log('arrangement','.getChildByName('+name+')');
            return scene.getChildByName(name);
        };
        this.prepend = function(id){
            dev.log('arrangement','.prepend('+id+')');
            scene.prepend(id);
        };
        this.append = function(id){
            dev.log('arrangement','.append('+id+')');
            scene.append(id);
        };
        this.remove = function(id){
            dev.log('arrangement','.remove('+id+')');
            scene.remove(id);
        };
        this.getElementByAddress = function(address){
            dev.log('arrangement','.getElementByAddress('+address+')');

            var route = address.split('/');
            route.shift(); route.shift();
    
            var currentObject = scene;
            route.forEach(function(a){
                currentObject = shape.getShapeById(currentObject.getChildByName(a));
            });
    
            return shape.getIdFromShape(currentObject);
        };
        this.getElementsUnderPoint = function(x,y){
            dev.log('arrangement','.getElementsUnderPoint('+x+','+y+')');
            return scene.getElementsUnderPoint(x,y);
        };
        this.getElementsUnderArea = function(points){
            dev.log('arrangement','.getElementsUnderArea('+points+')');
            return scene.getElementsUnderArea(points);
        };
        this.printTree = function(mode='spaced'){//modes: spaced / tabular / address
            dev.log('arrangement','.printTree('+mode+')');
             
            function recursivePrint(grouping,prefix=''){
                grouping.children.forEach(function(a){
                    if(mode == 'spaced'){
                        console.log(prefix+'- '+a.type +': '+ a.name);
                        if(a.type == 'group'){ recursivePrint(a, prefix+'- ') }
                    }else if(mode == 'tabular'){
                        console.log(prefix+'- \t'+a.type +': '+ a.name);
                        if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                    }else if(mode == 'address'){
                        console.log(prefix+'/'+a.type +':'+ a.name);
                        if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                    }
                });
            }

            recursivePrint(scene.getTree(), '');
        };

    //rendering
        this.getScene = function(){ return scene };
        
    //mapping
        [
            {function:'new', arguments:[]},
            {function:'getChildren',arguments:[]},
            {function:'getChildByName',arguments:['name']},
            {function:'get', arguments:[]},
            {function:'set', arguments:[]},
            {function:'prepend', arguments:['id']},
            {function:'append', arguments:['id']},
            {function:'remove', arguments:['id']},
            {function:'getElementByAddress', arguments:['address']},
            {function:'getElementsUnderPoint', arguments:['x','y']},
            {function:'getElementsUnderArea', arguments:['points']},
            {function:'printTree', arguments:['mode']},
        ].forEach( method => {
            communicationModule.function['arrangement.'+method.function] = new Function( ...(method.arguments.concat('return arrangement.'+method.function+'('+method.arguments.join(',')+');')) );
        });
};