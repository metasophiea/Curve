var menu = new function(){
    this.objects = new function(){
        {{include:objects/*}}/**/
    };
};

setTimeout(function(){
    menu.bar = __globals.utility.workspace.placeAndReturnObject( menu.objects.menuBar(), 'menu' );
},1);

menu.control = {
    report:function(text){ menu.bar.i.report(text); },
    loadsave:{
        load:function(){__globals.utility.workspace.saveload.load();},
        save:function(){__globals.utility.workspace.saveload.save();},
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