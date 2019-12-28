this.documentUnits = function(units,selfContained=false){
    dev.log.scene('.documentUnits(',units); //#development

    // position             -   the X, Y and angle of the original object
    // details              -   data on the unit's type
    //      collection
    //      model
    // data                 -   the exported data from the original object
    // connections          -   an array of where to connect what
    //      typeAndNameOfSourcePort
    //      indexOfDestinationUnit
    //      typeAndNameOfDestinationPort

    const outputData = [];

    //cycle through this array, and create the scene data
        for(let a = 0; a < units.length; a++){
            const unit = units[a];
            const entry = {};

            //get the units position
                entry.position = { x:unit.x(), y:unit.y(), angle:unit.angle() };

            //unitDetails
                entry.details = { collection:unit.collection, model:unit.model };

            //export the unit's state
                entry.data = unit.exportData ? unit.exportData() : {};

            //log all connections
                entry.connections = [];
                    for(let connectionType in unit.io){
                        for(let connection in unit.io[connectionType]){
                            const foreignNode = unit.io[connectionType][connection].getForeignNode();
                            if(foreignNode == undefined){continue;} //this node isn't connected to anything, so just bail
                    
                            const newConnectionEntry = {};

                            //typeAndNameOfSourcePort
                                newConnectionEntry.typeAndNameOfSourcePort = { type:connectionType, name:connection };

                            //nameOfDestinationUnit
                                    newConnectionEntry.nameOfDestinationUnit = selfContained ? undefined : foreignNode.parent.getName();
                            //indexOfDestinationUnit
                                newConnectionEntry.indexOfDestinationUnit = units.indexOf(foreignNode.parent);

                            //typeAndNameOfDestinationPort
                                newConnectionEntry.typeAndNameOfDestinationPort = { type:connectionType, name:foreignNode.getName() };

                            entry.connections.push(newConnectionEntry);
                        }
                    }

            //add this entry to the save data list
                outputData.push(entry);
        }

    return outputData;  
};
this.printUnits = function(units, rectify=true, pane=_canvas_.system.pane.mm, autoselect=true){
    dev.log.scene('.documentUnits(',units, rectify, pane, autoselect); //#development

    const printedUnits = [];

    for(let a = 0; a < units.length; a++){
        const item = units[a];

        //create the object with its new position adding it to the pane
            const unit = control.scene.addUnit(
                item.position.x, item.position.y, item.position.angle,
                item.details.model, item.details.collection, 
                item.details.name, 
                rectify, pane
            );
            printedUnits.push(unit);

        //import data and select unit
            if(unit.importData){ try{ unit.importData(item.data); }catch(error){console.warn('control.scene.printUnits:: unable to import data into unit correctly'); console.warn(error);} }
            if(autoselect){control.selection.selectUnit(unit);}

        //go through its connections, and attempt to connect them to everything they should be connected to
        // (don't worry if a object isn't available yet, just skip that one. Things will work out in the end)
            for(let b = 0; b < item.connections.length; b++){
                const connection = item.connections[b];

                const destinationUnit = connection.indexOfDestinationUnit != -1 ? control.selection.selectedUnits[connection.indexOfDestinationUnit] : control.scene.getUnitByName(connection.nameOfDestinationUnit);
                if(destinationUnit == undefined){continue;}

                const sourceNode = unit.io[connection.typeAndNameOfSourcePort.type][connection.typeAndNameOfSourcePort.name];
                const destinationNode = destinationUnit.io[connection.typeAndNameOfDestinationPort.type][connection.typeAndNameOfDestinationPort.name];
                
                sourceNode.connectTo(destinationNode);
            }
    }

    return printedUnits;
};