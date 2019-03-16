this.library = new function(){
    const library = this;
    {{include:shapes/*}} */
};

this.checkShape = function(name,shape){
    var tmp = new shape();

    if(name == undefined || shape == undefined){ return 'shape or name missing'; }
    if(tmp.getType() != name){ return 'internal type ('+tmp.getType()+') does not match key ('+name+')';  }

    return '';
};
this.checkShapes = function(list){
    for(item in list){
        var response = this.checkShape(item, list[item]);
        if(response.length != 0){ console.error('core.shapes error:', item, '::', response); }
    }
};

this.create = function(type){ 
    try{ return new this.library[type](); }
    catch(e){
        console.warn('the shape type: "'+type+'" could not be found');
        console.error(e);
    }
};