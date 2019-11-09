this.group = function(_id){
    const type = 'group';
    this.getType = function(){return type};
    const id = _id;
    this.getId = function(){return id};

    const children = [];
    this.getChildren = function(){
        return children.map((child) => {
            if(child.getType() == 'group'){ return child.getChildren(); }
            return getIdFromShape(child);
        });
    };
    this.getChildCount = function(){ return children.length; };
    this.addChild = function(shapeId){ children.push(getShapeById(shapeId)); };
    this.removeChild = function(shapeId){ children.splice(children.indexOf(getShapeById(shapeId)),1); };
};
this.group.proxyableMethods = [
    {function:'getChildren',arguments:[]},
    {function:'getChildCount',arguments:[]},
    {function:'addChild',arguments:['child']},
    {function:'removeChild',arguments:['child']}
];