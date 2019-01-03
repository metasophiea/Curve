//setup selected objects spaces and functionality
this.selectedObjects = [];
this.lastSelectedObjects = null;
this.clipboard = [];
    // pane                 -   the pane the object came from
    // objectConstructor    -   the creation function of the object
    // originalsPosition    -   the X and Y of the original object
    // data                 -   the exported data from the original object
    // connections          -   an array of where to connect what
    //                              originPort
    //                              destinationPort
    //                              indexOfDestinationObject


this.selectEverything = function(){
    this.deselectEverything();
    for(var a = 0; a < system.pane.middleground.children.length; a++){
        if( system.pane.middleground.children[a].id != 'null' ){
            this.selectedObjects.push(system.pane.middleground.children[a]);
        }
    }
};
this.deselectEverything = function(except=[]){
    var newList = [];

    for(var a = 0; a < system.selection.selectedObjects.length; a++){
        if( except.includes(system.selection.selectedObjects[a]) ){
            newList.push(system.selection.selectedObjects[a]);
        }else{
            if(system.selection.selectedObjects[a].onDeselect){system.selection.selectedObjects[a].onDeselect();}
        }
    }
    system.selection.selectedObjects = newList;
};
this.selectObject = function(object){
    //check if object is already selected
        if( system.selection.selectedObjects.indexOf(object) != -1 ){return;}

    //shift object to front of view, (within it's particular pane)
        var pane = system.utility.workspace.getPane(object);
        pane.removeChild(object);
        pane.append(object);

    //perform selection
        if(object.onSelect){object.onSelect();}
        system.selection.selectedObjects.push(object);
        system.selection.lastSelectedObjects = object;
};
this.deselectObject = function(object){
    system.selection.selectedObjects.splice(system.selection.selectedObjects.indexOf(object),1);
    if(object.onDeselect){object.onDeselect();}
};



this.cut = function(){
    this.copy();
    this.delete();
};
this.copy = function(){
    //firstly, empty the clipboard
        this.clipboard = [];

    //for all selected objects; collect their data and add it to the clipboard
    for( var a = 0; a < this.selectedObjects.length; a++){
        //create entry
            var entry = {};

            //objectConstructor
                //if the object doesn't have a constructor, don't bother with any of this
                //in-fact; deselect it altogether and move on to the next object
                if( !this.selectedObjects[a].creatorMethod ){
                    system.selection.deselectObject(this.selectedObjects[a]);
                    a--; 
                    continue;
                }
                entry.objectConstructor = this.selectedObjects[a].creatorMethod;

            //pane
                entry.pane = system.utility.workspace.getPane(this.selectedObjects[a]);

            //originalPosition
                entry.originalPosition = system.utility.element.getTransform(this.selectedObjects[a]);

            //data
                entry.data = this.selectedObjects[a].exportData ? this.selectedObjects[a].exportData() : null;

            //connections
                if(this.selectedObjects[a].io){
                    var connections = [];
                    var keys = Object.keys(this.selectedObjects[a].io);
                    for(var b = 0; b < keys.length; b++){
                        var conn = [];

                        //originPort
                            conn.push(keys[b]);

                        //destinationPort and indexOfDestinationObject
                            if(!this.selectedObjects[a].io[keys[b]].foreignNode){ continue;}
                            
                            var destinationPorts = Object.keys(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement.io);
                            for(var c = 0; c < destinationPorts.length; c++){
                                if(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement.io[destinationPorts[c]] === this.selectedObjects[a].io[keys[b]].foreignNode){
                                    conn.push(destinationPorts[c]);
                                    conn.push(this.selectedObjects.indexOf(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement));
                                    break;
                                }
                            }

                        if( conn[2] >= 0 ){ connections.push(conn); }
                    }
                    entry.connections = connections;
                }

        //push entry to clipboard
            this.clipboard.push(entry);
    }
};
this.paste = function(position=null){
    //if clipboard is empty, don't bother
        if(this.clipboard.length == 0){return;}

    //deselect everything
        this.deselectEverything();

    //position manipulation
    //if position is not set to 'duplicate'; calculate new positions for the objects
        if(position != 'duplicate'){                
            // collect all positions
                var points = [];
                this.clipboard.forEach( element => points.push(element.originalPosition) );

            //get the bounding box of this selection, and then the top left point of that
                var topLeft = system.utility.math.boundingBoxFromPoints(points)[0];

            //if no position has been provided at all; calculate a new one from the mouse position
                if(position == undefined){
                    position = system.utility.workspace.pointConverter.browser2workspace(system.mouse.currentPosition[0], system.mouse.currentPosition[1]);
                }

            //combine this topLeft point with the provided (or calculated) position, 
            //then add this to the mouses' position
                this.clipboard.forEach( function(element){
                    element.originalPosition.x += position.x - topLeft.x;
                    element.originalPosition.y += position.y - topLeft.y;
                } );
        }

    //object printing
        this.clipboard.forEach(function(item){
            //create the object with its new position
                var obj = item.objectConstructor(item.originalPosition.x,item.originalPosition.y);
                if(obj.importData){obj.importData(item.data);}

            //add the object to the pane and select it
                item.pane.appendChild(obj);
                system.selection.selectObject(obj);

            //go through its connections, and attempt to connect them to everything they should be connected to
            // (don't worry if a object isn't avalable yet, just skip that one. Things will work out in the end)
                if(item.connections){
                    item.connections.forEach(function(conn){
                        // originPort                  = conn[0]
                        // destinationPort             = conn[1]
                        // indexOfDestinationObject    = conn[2]
                        if( conn[2] < system.selection.selectedObjects.length ){
                            obj.io[conn[0]].connectTo( system.selection.selectedObjects[conn[2]].io[conn[1]] );
                        }
                    });
                }
        });
};
this.duplicate = function(){
    this.copy();
    this.paste('duplicate');
    this.clipboard = [];
};
this.delete = function(){
    while(this.selectedObjects.length > 0){
        //delete object
            system.utility.object.deleteObject(this.selectedObjects[0]);
        //remove object from selected array
            this.selectedObjects.shift();
    }
    this.lastSelectedObjects = null;
};