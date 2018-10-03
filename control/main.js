var control = new function(){
    this.objects = new function(){
        {{include:objects/menubar/bar.js}}
    };
    this.mousedown = function(event){
        if( __globals.utility.workspace.objectUnderPoint(event.x, event.y) == null ){
            control.i.menubar.closeEverything();
        }
    };
    this.keydown = function(event){ /*console.log('control::keydown:',event);*/

        switch(event.key.toLowerCase()){
            case 'backspace': case 'delete':
                __globals.selection.delete();
            break;
            case 'x': 
                if(!event[__globals.super.keys.ctrl]){return;}
                __globals.selection.cut();
            break;
            case 'c': 
                if(!event[__globals.super.keys.ctrl]){return;}
                __globals.selection.copy();
            break;
            case 'v': 
                if(!event[__globals.super.keys.ctrl]){return;}
                __globals.selection.paste();
            break;
            case 'b': 
                if(!event[__globals.super.keys.ctrl]){return;}
                __globals.selection.duplicate();
            break;
            case 'f1': 
                var temp = __globals.utility.workspace.objectUnderPoint(__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]);
                if(temp){
                    if( objects[temp.id].metadata ){
                        __globals.utility.misc.openURL(objects[temp.id].metadata.helpurl);
                    }else{
                        console.warn('bad help url, please add metadata to your object file ->',temp.id);
                    }
                    __globals.keyboardInteraction.releaseAll();
                }
            break;
            case 'f2': 
                if(!event[__globals.super.keys.ctrl]){return;}
                this.i.scene.load();
            break;
            case 'f3': 
                if(!event[__globals.super.keys.ctrl]){return;}
                this.i.scene.save(this.project.name);
            break;
        }

    };
    this.keyup = function(event){ /*console.log('control::keyup:',event);*/ };
    this.i = {
        scene:{
            new:function(){ __globals.utility.workspace.clear(); },
            load:function(){
                __globals.utility.workspace.saveload.load(function(data){
                    if(data == null){
                        control.i.menubar.report('invalid file','error');
                        return;
                    }

                    control.project.name = data.sceneName;
                });
            },
            save:function(projectName){__globals.utility.workspace.saveload.save(projectName);},
        },
        menubar:{
            obj:undefined,
            report:function(text,type='default'){console.log(type+' - '+text);},
            place:function(){
                if(this.obj != undefined){ __globals.panes.control.remove(this.obj); }
                this.obj = __globals.utility.workspace.placeAndReturnObject( control.objects.menubar(), 'control' );
            },
            closeEverything:function(){ this.obj.i.closeEverything(); },
        },
        objectPane:{
            obj:undefined,
            open:function(){
                if( this.obj == undefined ){
                    this.obj = __globals.utility.workspace.placeAndReturnObject( control.objects.objectPane(10, 30), 'menu' );
                }
            },
            close:function(){
                if( this.objectPane.obj != undefined ){
                    __globals.utility.object.deleteObject(this.obj);
                    this.obj = undefined;
                }
            },
        },
    };
    this.project = {
        name:'myProject'
    };
};


setTimeout(function(){
    control.i.menubar.place();
},1);