var control = new function(){
    this.objects = new function(){
        {{include:objects/menubar/bar.js}}
    };
    this.windowresize = function(){
        control.i.menubar.resize();
    };
    this.mousemove = function(event){};
    this.mousedown = function(event){
        if( system.utility.workspace.objectUnderPoint(event.x, event.y) == null ){
            control.i.menubar.closeEverything();
        }
    };
    this.mousewheel = function(event){};
    this.keydown = function(event){ /*console.log('control::keydown:',event);*/

        switch(event.key.toLowerCase()){
            case 'backspace': case 'delete':
                system.selection.delete();
            break;
            case 'x': 
                if(!event[system.super.keys.ctrl]){return;}
                system.selection.cut();
            break;
            case 'c': 
                if(!event[system.super.keys.ctrl]){return;}
                system.selection.copy();
            break;
            case 'v': 
                if(!event[system.super.keys.ctrl]){return;}
                system.selection.paste();
                system.keyboard.releaseKey('KeyV');
            break;
            case 'b': 
                if(!event[system.super.keys.ctrl]){return;}
                system.selection.duplicate();
            break;
            case 'f1': 
                var temp = system.utility.workspace.objectUnderPoint(system.mouse.currentPosition[0], system.mouse.currentPosition[1]);
                if(temp){
                    if( object[temp.id].metadata ){
                        system.utility.misc.openURL(object[temp.id].metadata.helpurl);
                    }else{
                        console.warn('bad help url, please add metadata to your object file ->',temp.id);
                    }
                    system.keyboard.releaseAll();
                }
            break;
            case 'f2': 
                if(!event[system.super.keys.ctrl]){return;}
                this.i.scene.load();
            break;
            case 'f3': 
                if(!event[system.super.keys.ctrl]){return;}
                this.i.scene.save(this.project.name);
            break;
        }

    };
    this.keyup = function(event){ /*console.log('control::keyup:',event);*/ };
    this.i = {
        scene:{
            new:function(){ system.utility.workspace.clear(); },
            load:function(){
                system.utility.workspace.saveload.load(function(data){
                    if(data == null){
                        control.i.menubar.report('invalid file','error');
                        return;
                    }

                    control.project.name = data.sceneName;
                });
            },
            save:function(projectName){system.utility.workspace.saveload.save(projectName);},
        },
        menubar:{
            obj:undefined,
            report:function(text,type='default'){console.log(type+' - '+text);},
            place:function(){
                if(this.obj != undefined){return;}
                this.obj = system.utility.workspace.placeAndReturnObject( control.objects.menubar(), 'control' );
            },
            remove:function(){ 
                if(this.obj == undefined){return;} 
                system.pane.control.removeChild(this.obj); 
                this.obj = undefined;
            },
            resize:function(){ this.remove(); this.place(); },
            closeEverything:function(){ this.obj.i.closeEverything(); },
        },
        objectPane:{
            obj:undefined,
            open:function(){
                if( this.obj == undefined ){
                    this.obj = system.utility.workspace.placeAndReturnObject( control.objects.objectPane(10, 30), 'menu' );
                }
            },
            close:function(){
                if( this.objectPane.obj != undefined ){
                    system.utility.object.deleteObject(this.obj);
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
    if(system.super.enableMenubar){ control.i.menubar.place(); }
},1);