var menu = new function(){
    this.objects = new function(){
        {{include:objects/*}}/**/
    };
    this.control = {
        loadsave:{
            load:function(){__globals.utility.workspace.saveload.load();},
            save:function(){__globals.utility.workspace.saveload.save();},
        },
        menubar:{
            obj:undefined,
            report:function(text){ menu.control.menubar.obj.i.report(text); },
        },
        objectPane:{
            obj:undefined,
            open:function(){
                if( menu.control.objectPane.obj == undefined ){
                    menu.control.objectPane.obj = __globals.utility.workspace.placeAndReturnObject( menu.objects.objectPane(10, 30), 'menu' );
                }
            },
            close:function(){
                if( menu.control.objectPane.obj != undefined ){
                    __globals.utility.object.deleteObject(menu.control.objectPane.obj);
                    menu.control.objectPane.obj = undefined;
                }
            },
        },
    };
};


setTimeout(function(){
    menu.control.menubar.obj = __globals.utility.workspace.placeAndReturnObject( menu.objects.menuBar(), 'menu' );
},1);