let selectedDesignShapeId = 0;
this.getArrangement = function(){ return createdShapes[selectedDesignShapeId]; };
this.selectDesign = function(id){ selectedDesignShapeId = id; };