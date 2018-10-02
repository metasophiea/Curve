var control = new function(){
    this.objects = new function(){
        {{include:objects/menubar/bar.js}}
    };
    this.mousedown = function(event){
        if( __globals.utility.workspace.objectUnderPoint(event.x, event.y) == null ){
            control.i.menubar.closeEverything();
        }
    };
    this.i = {
        scene:{
            new:function(){ __globals.utility.workspace.clear(); },
            load:function(){__globals.utility.workspace.saveload.load();},
            save:function(){__globals.utility.workspace.saveload.save();},
        },
        menubar:{
            obj:undefined,
            report:function(text){},
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
};


setTimeout(function(){
    control.i.menubar.place();
},1);