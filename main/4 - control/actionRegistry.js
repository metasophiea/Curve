var _devMode = false;
var actionRegistrationActive = true;
var actionRegistry = [];
var actionPointer = -1;

this.actionRegistrationActive = function(a){
    if(a==undefined){return actionRegistrationActive;}
    actionRegistrationActive = a;
};

this.undoFunctionLibrary = {};
this.redoFunctionLibrary = {};

this.printRegistry = function(printToConsole=false){ 
    if(printToConsole){ actionRegistry.forEach((item,index) => console.log(actionPointer==index?'->':'  ',item)); }
    else{ return {
        actionPointer:actionPointer,
        actionRegistry:actionRegistry,
        actionRegistrationActive:actionRegistrationActive
    }; }
};
this.clearRegistry = function(){actionRegistry = [];actionPointer = -1;};
this.registerAction = function(action){
    //only register actions if allowed to do so
        if(!actionRegistrationActive){return;}

    //if an action is being added but the pointer is not at the end of the actionRegistry; delete everything after the pointer
        if(actionPointer != actionRegistry.length-1){
            if(_devMode){console.log('actionPointer is not at the top of the actionRegistry; overwriting');}
            actionRegistry.splice(actionPointer+1);
        }

    //add action and increment pointer
        actionRegistry.push(action);
        actionPointer++;

    //if appropriate, print out the actionRegistry, indicating where the pointer is
        if(_devMode){
            this.printRegistry();
            console.log('');
        } 
};

this.undo = function(){
    //if the 'current action' is a place beyond the list, this means that there's nothing left to undo, so just bail
        if(actionPointer <= -1){return;}

    //gather the action
        var mostRecientAction = actionRegistry[actionPointer];

    //if this action has an entry in the undo function library, decriment the pointer and execute that function
        if(mostRecientAction.functionName in this.undoFunctionLibrary){
            actionPointer--;
            this.undoFunctionLibrary[mostRecientAction.functionName](mostRecientAction);
        }

    //if appropiate, print out the actionRegistry, indicating where the pointer is
        if(_devMode){
            this.printRegistry();
            console.log('');
        } 
};
this.redo = function(){
    //if the 'next action' is a place beyond the list, this means that there's nothing left to redo, so just bail
        if(actionRegistry.length <= actionPointer+1){return;}

    //gather the next action
        var nextAction = actionRegistry[actionPointer+1];

    //if this action has an entry in the redo function library, incriment the pointer and execute that function
        if(nextAction.functionName in this.redoFunctionLibrary){
            actionPointer++;
            this.redoFunctionLibrary[nextAction.functionName](nextAction);
        }

    //if appropiate, print out the actionRegistry, indicating where the pointer is
        if(_devMode){
            this.printRegistry();
            console.log('');
        } 
};
















//control.scene.addUnit
    this.undoFunctionLibrary['control.scene.addUnit'] = function(action){
        actionRegistrationActive = false;
        control.scene.removeUnit( control.scene.getUnitByName(action.name) );
        actionRegistrationActive = true;
    };
    this.redoFunctionLibrary['control.scene.addUnit'] = function(action){
        var args = action.arguments;
        actionRegistrationActive = false;
        control.scene.addUnit(args[0],args[1],args[2],args[3],args[4],action.name,args[6],_canvas_.core.arrangement.getElementByAddress(args[7]));
        actionRegistrationActive = true;
    };

//control.scene.removeUnit
    this.undoFunctionLibrary['control.scene.removeUnit'] = function(action){
        actionRegistrationActive = false;
        action.data.details.name = action.name;
        control.scene.printUnits( [action.data], true, action.pane, false );
        actionRegistrationActive = true;
    };
    this.redoFunctionLibrary['control.scene.removeUnit'] = function(action){
        actionRegistrationActive = false;
        control.scene.removeUnit( control.scene.getUnitByName(action.name) );
        actionRegistrationActive = true;
    };

//control.selection.delete
    this.undoFunctionLibrary['control.selection.delete'] = function(action){
        for(var a = 0; a < action.count; a++){ control.actionRegistry.undo(); }
        actionPointer--;
    };
    this.redoFunctionLibrary['control.selection.delete'] = function(action){
        for(var a = 0; a < action.count; a++){ control.actionRegistry.redo(); }
        actionPointer+=1;
    };

//control.selection.duplicate
    this.undoFunctionLibrary['control.selection.duplicate'] = function(action){
        actionRegistrationActive = false;
        action.producedUnitNames.forEach(name => { control.scene.removeUnit( control.scene.getUnitByName(name) ); });
        actionRegistrationActive = true;
    };
    this.redoFunctionLibrary['control.selection.duplicate'] = function(action){
        _canvas_.control.selection.deselectEverything();

        action.unitsToDuplicate.forEach( name => _canvas_.control.selection.selectUnit(_canvas_.control.scene.getUnitByName(name)) );

        actionRegistrationActive = false;
        control.selection.duplicate();
        control.selection.selectedUnits.forEach((unit,index) => {
            unit.x(action.finalPositions[index].x);
            unit.y(action.finalPositions[index].y);
            unit.angle(action.finalPositions[index].a);
            unit.name = action.producedUnitNames[index];
        });
        actionRegistrationActive = true;
    };