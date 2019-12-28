this.getAllUnits = function(pane=_canvas_.system.pane.mm){
    dev.log.scene('.getAllUnits(',pane); //#development
    return pane.getChildren().filter( a => !a._isCable );
};
this.getUnitByName = function(name,pane=_canvas_.system.pane.mm){
    dev.log.scene('.getUnitByName(',name,pane); //#development
    return pane.getChildByName(name);
};
this.getUnitsByModel = function(model){
    dev.log.scene('.getUnitsByModel(',model); //#development
    return this.getAllUnits().filter( a => a.model == model );
};
this.getUnitUnderPoint = function(x,y,pane=_canvas_.system.pane.mm){
    dev.log.scene('.getUnitUnderPoint(',x,y,pane); //#development
    for(let a = 0; a < pane.getChildren().length; a++){
        if( _canvas_.library.math.detectIntersect.pointWithinPoly({x:x,y:y}, pane.getChildren()[a].space) != 'outside' ){
            return pane.getChildren()[a];
        }
    }
};
this.getUnitsWithinPoly = function(points,pane=_canvas_.system.pane.mm){
    dev.log.scene('.getUnitsWithinPoly(',points,pane); //#development
    return pane.getChildren().filter(function(a){ 
        return !a._isCable && _canvas_.library.math.detectIntersect.polyOnPoly(
            {points:points,boundingBox:_canvas_.library.math.boundingBoxFromPoints(points)}, 
            a.space
        ).intersect;
    });
};