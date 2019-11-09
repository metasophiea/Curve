const createdShapes = [];

function generateShapeId(){
    let id = createdShapes.findIndex(item => item==undefined);
    return id != -1 ? id : createdShapes.length;
}
function getShapeById(id){ return createdShapes[id]; }
function getIdFromShape(shape){ return shape.getId(); }

this.deleteShape = function(shapeId){ createdShapes[shapeId] = undefined; };
this.deleteAllCreatedShapes = function(){ for(let a = 0; a < createdShapes.length; a++){this.deleteShape(a);} };
this.getCreatedShapes = function(){ return createdShapes.map(shape => getIdFromShape(shape)); };
this.createShape = function(type){
    const newShape_id = generateShapeId();
    createdShapes[newShape_id] = new shapeLibrary[type](newShape_id);
    return newShape_id;
};
this.getShapeTypeById = function(id){ return getShapeById(id).getType(); };
this.executeShapeMethod = function(shapeId,methodName,argumentList=[]){ return getShapeById(shapeId)[methodName](...argumentList); };