const snapping = {active:false,x:10,y:10,angle:Math.PI/8};
this.activeSnapping = function(bool,pane=_canvas_.system.pane.mm){
    dev.log.scene('.activeSnapping(',bool,pane); //#development
    
    //control switch
        if(!interactionState.snapping){return snapping.active;}

    if(bool == undefined){return snapping.active;}

    snapping.active = bool;
    this.getAllUnits(pane).forEach(unit => unit.snappingActive(bool));
};

const unitsInteractable = { active:true, store:{} };
this.unitsInteractable = function(bool,pane=_canvas_.system.pane.mm){
    dev.log.scene('.unitsInteractable(',bool,pane); //#development

    if(bool == undefined){return unitsInteractable.active;}

    unitsInteractable.active = bool;

    this.getAllUnits(pane).forEach(unit => {
        if(bool){
            if(unitsInteractable.store[unit.getId()] != undefined){
                unit.interactable( unitsInteractable.store[unit.getId()] );
            }
        }else{
            unitsInteractable.store[unit.getId()] = unit.interactable();
            unit.interactable(bool);
        }
    });
};

const cableDisconnectionConnection = { active:true, store:{} };
this.cableDisconnectionConnection = function(bool,pane=_canvas_.system.pane.mm){
    dev.log.scene('.cableDisconnectionConnection(',bool,pane); //#development

    if(bool == undefined){return cableDisconnectionConnection.active;}

    cableDisconnectionConnection.active = bool;
    
    this.getAllUnits(pane).forEach(unit => {
        if(bool){
            if(cableDisconnectionConnection.store[unit.getId()] != undefined){
                unit.allowIOConnections(unitsInteractable.store[unit.getId()].allowIOConnections);
                unit.allowIODisconnections(unitsInteractable.store[unit.getId()].allowIODisconnections);
            }
        }else{
            cableDisconnectionConnection.store[unit.getId()] = {
                allowIOConnections: unit.allowIOConnections(),
                allowIODisconnections: unit.allowIODisconnections(),
            };
            unit.allowIOConnections(bool);
            unit.allowIODisconnections(bool);
        }
    });
};