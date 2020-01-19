this.interaction = new function(){
    interactionState.development = false;

    interactionState.menubar = true;
    interactionState.snapping = true;
    interactionState.unitAdditionRemoval = true;
    interactionState.unitTransfer = true;
    interactionState.unitCollision = true;
    interactionState.newScene = true;
    interactionState.sceneSave = true;
    interactionState.sceneLoad = true;
    interactionState.unitSelection = true;
    interactionState.unitGrappleRotation = true;
    interactionState.unitGrapplePosition = true;
    interactionState.mouseGroupSelect = true;
    interactionState.mouseGripPanning = true;
    interactionState.mouseWheelZoom = true;
    interactionState.unloadWarning = true;

    Object.keys(interactionState).forEach(key => {
        this[key] = function(bool){
            if(bool==undefined){return interactionState[key];}
            dev.log.interaction('.'+key+'(',bool); //#development
            interactionState[key] = bool;
        };
    });
};

window.onbeforeunload = function(){ 
    if(!interactionState.unloadWarning){ return; }
    return "Unsaved work will be lost";
};