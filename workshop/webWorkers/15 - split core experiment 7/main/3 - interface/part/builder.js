this.partLibrary = {};
this.builder = function(collection,type,name,data){
    dev.log.part('.builder('+collection+','+type+','+name+','+JSON.stringify(data)+')'); //#development
    if(!data){data={};}
    if(data.style == undefined){data.style={};}

    if(collection in this.partLibrary && type in this.partLibrary[collection]){
        return this.partLibrary[collection][type](name,data);
    }

    console.warn('Interface Part Builder :: Unknown element: '+ collection + '::' + type); return null;
}
const partRegistry = {};