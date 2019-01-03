this.object = new function(){
    this.requestInteraction = function(x,y,type,globalName){
        if(!x || !y){return true;}
        var temp = document.elementFromPoint(x,y);
        if(temp == null){return false;}

        if(temp.hasAttribute('workspace')){return true;}
        while(!temp.hasAttribute('global')){
            if(temp == document.body){ return false; }

            if(temp[type] || temp.hasAttribute(type)){return false;}
            temp = temp.parentElement;
        }
        
        return temp.getAttribute('pane')==globalName;
    };
    this.disconnectEverything = function(object){
        var keys = Object.keys(object.io);
        for( var a = 0; a < keys.length; a++){
            //account for node arrays
            if( Array.isArray(object.io[keys[a]]) ){
                for(var c = 0; c < object.io[keys[a]].length; c++){
                    object.io[keys[a]][c].disconnect();
                }
            }else{
                object.io[keys[a]].disconnect();
            }
        }
    };
    this.generateSelectionArea = function(points, object){
        var debug = false;
        object.selectionArea = {};
        object.selectionArea.box = [];
        object.selectionArea.points = [];
        object.updateSelectionArea = function(){
            //the main shape we want to use
            object.selectionArea.points = [];
            points.forEach(function(item){
                object.selectionArea.points.push( {x:item.x, y:item.y} );
            });
            object.selectionArea.box = system.utility.math.boundingBoxFromPoints(object.selectionArea.points);

            //adjusting it for the object's position in space
            var temp = system.utility.element.getTransform(object);
            object.selectionArea.box.forEach(function(element) {
                element.x += temp.x;
                element.y += temp.y;
            });
            object.selectionArea.points.forEach(function(element) {
                element.x += temp.x;
                element.y += temp.y;
            });
        };

        object.updateSelectionArea();

        if(debug){
            for(var a = 0; a < object.selectionArea.box.length; a++){ system.pane.foreground.append( system.utility.workspace.dotMaker(object.selectionArea.box[a].x, object.selectionArea.box[a].y, a) ); }
            for(var a = 0; a < object.selectionArea.points.length; a++){ system.pane.foreground.append( system.utility.workspace.dotMaker(object.selectionArea.points[a].x, object.selectionArea.points[a].y, a) ); }
        }
    };
    this.deleteObject = function(object){
        //run the object's onDelete method
            if(object.onDelete){object.onDelete();}
        //run disconnect on every connection node of this object
            system.utility.object.disconnectEverything(object);
        //remove the object from the pane it's in
            system.utility.workspace.getPane(object).removeChild(object);
    };
};