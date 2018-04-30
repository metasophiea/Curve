//setup selected objects spaces and functionality
__globals.selection = new function(){
    this.selectedObjects = [];
    this.lastSelectedObject = null;
    this.clipboard = [];
        // pane                 -   the pane the object came from
        // objectConstructor    -   the creation function of the object
        // originalsPosition    -   the X and Y of the original object
        // data                 -   the exported data from the original object
        // connections          -   an array of where to connect what
        //                              originPort
        //                              destinationPort
        //                              indexOfDestinationObject



    this.deselectEverything = function(except=[]){
        var newList = [];

        for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
            if( except.includes(__globals.selection.selectedObjects[a]) ){
                newList.push(__globals.selection.selectedObjects[a]);
            }else{
                if(__globals.selection.selectedObjects[a].onDeselect){__globals.selection.selectedObjects[a].onDeselect();}
            }
        }
        __globals.selection.selectedObjects = newList;
    };
    this.selectObject = function(object){
        if(object.onSelect){object.onSelect();}
        __globals.selection.selectedObjects.push(object);
        __globals.selection.lastSelectedObject = object;
    };
    this.deselectObject = function(object){
        __globals.selection.selectedObjects.splice(__globals.selection.selectedObjects.indexOf(object),1);
        object.onDeselect();
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
                newEntry.push( __globals.utility.workspace.getPane(this.selectedObjects[a]) );

            //objectConstructor
                //if the object doesn't have a constructor, don't bother with any of this
                // in-fact; deselect it altogether and move on to the next object
                if( !this.selectedObjects[a].creatorMethod ){
                    __globals.selection.deselectObject(this.selectedObjects[a]);
                    a--; continue;
                }
                newEntry.push( this.selectedObjects[a].creatorMethod );

            //originalsPosition
                newEntry.push( __globals.utility.element.getTransform(this.selectedObjects[a]) );

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
                    var topLeft = __globals.utility.math.boundingBoxFromPoints(points)[0];
                //subtract this point from each position
                // then add on the mouses's position, or the provided position
                    if(!position){
                        // //use viewport for position (functional, but unused)
                        //     var position = __globals.utility.element.getTransform(__globals.panes.global);
                        //     position = {x:-position.x/position.s, y:-position.y/position.s};

                        //use mouse position
                            var position = __globals.utility.workspace.pointConverter.browser2workspace(__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]);
                    }
                    this.clipboard.forEach( function(element){
                        console.log(element)
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
                __globals.selection.selectObject(obj);

            //go through its connections, and attempt to connect them to everything they should be connected to
            // (don't worry if a object isn't avalable yet, just skip that one. Things will work out in the end)
                if(item[4]){
                    item[4].forEach(function(conn){
                        // originPort                  = conn[0]
                        // destinationPort             = conn[1]
                        // indexOfDestinationObject    = conn[2]
                        if( conn[2] < __globals.selection.selectedObjects.length ){
                            obj.io[conn[0]].connectTo( __globals.selection.selectedObjects[conn[2]].io[conn[1]] );
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
            //run the object's onDelete method
                if(this.selectedObjects[0].onDelete){this.selectedObjects[0].onDelete();}

            //run disconnect on every connection node of this object
                var keys = Object.keys(this.selectedObjects[0].io);
                for( var a = 0; a < keys.length; a++){
                    //account for node arrays
                    if( Array.isArray(this.selectedObjects[0].io[keys[a]]) ){
                        for(var c = 0; c < this.selectedObjects[0].io[keys[a]].length; c++){
                            this.selectedObjects[0].io[keys[a]][c].disconnect();
                        }
                    }else{ this.selectedObjects[0].io[keys[a]].disconnect(); }
                }

            //remove the object from the pane it's in and then from the selected objects list
                __globals.utility.workspace.getPane(this.selectedObjects[0]).removeChild(this.selectedObjects[0]);
                this.selectedObjects.shift();
        }
        this.lastSelectedObject = null;
    };

};