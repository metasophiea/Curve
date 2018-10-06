//setup selected objects spaces and functionality
this.selectedObjects = [];
this.lastselectedObjects = null;
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
    //check if obbject is already selected
        if( system.selection.selectedObjects.indexOf(object) != -1 ){return;}

    //shift object to front of view, (within it's particular pane)
        var pane = system.utility.workspace.getPane(object);
        pane.removeChild(object);
        pane.append(object);

    //perform selection
        if(object.onSelect){object.onSelect();}
        system.selection.selectedObjects.push(object);
        system.selection.lastselectedObjects = object;
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
    this.clipboard = [];

    for( var a = 0; a < this.selectedObjects.length; a++){
        var newEntry = [];   

        //pane
            newEntry.push( system.utility.workspace.getPane(this.selectedObjects[a]) );

        //objectConstructor
            //if the object doesn't have a constructor, don't bother with any of this
            // in-fact; deselect it altogether and move on to the next object
            if( !this.selectedObjects[a].creatorMethod ){
                system.selection.deselectObject(this.selectedObjects[a]);
                a--; continue;
            }
            newEntry.push( this.selectedObjects[a].creatorMethod );

        //originalsPosition
            newEntry.push( system.utility.element.getTransform(this.selectedObjects[a]) );

        //data
            if( this.selectedObjects[a].exportData ){
                newEntry.push( this.selectedObjects[a].exportData() );
            }else{ newEntry.push( null ); }

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
                newEntry.push(connections);
            }

        this.clipboard.push(newEntry);
    }
};
this.paste = function(position=null){
    //if clipboard is empty, don't bother
        if(this.clipboard.length == 0){return;}

    //deselect everything
        this.deselectEverything();

    //position manipulation
    // if position is not set to 'duplicate', calculate new positions for the objects
        if(position != 'duplicate'){
            // collect all positions
                var points = [];
                this.clipboard.forEach( element => points.push(element[2]) );
            //get the bounding box of this selection, and then the top left point of that
                var topLeft = system.utility.math.boundingBoxFromPoints(points)[0];
            //subtract this point from each position
            // then add on the mouses's position, or the provided position
                if(!position){
                    // //use viewport for position (functional, but unused)
                    //     var position = system.utility.element.getTransform(system.pane.workspace);
                    //     position = {x:-position.x/position.s, y:-position.y/position.s};

                    //use mouse position
                        var position = system.utility.workspace.pointConverter.browser2workspace(system.mouse.currentPosition[0], system.mouse.currentPosition[1]);
                }
                this.clipboard.forEach( function(element){
                    element[2].x += position.x - topLeft.x;
                    element[2].y += position.y - topLeft.y;
                } );
        }

    //object printing
    this.clipboard.forEach(function(item){
        // pane              = item[0]
        // objectConstructor = item[1]
        // originalsPosition = item[2]
        // data              = item[3]
        // connections       = item[4]

        //create the object with its new position
            var obj = item[1](item[2].x,item[2].y);
            if(obj.importData){obj.importData(item[3]);}

        //add the object to the pane and select it
            item[0].appendChild(obj);
            system.selection.selectObject(obj);

        //go through its connections, and attempt to connect them to everything they should be connected to
        // (don't worry if a object isn't avalable yet, just skip that one. Things will work out in the end)
            if(item[4]){
                item[4].forEach(function(conn){
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
    this.lastselectedObjects = null;
};