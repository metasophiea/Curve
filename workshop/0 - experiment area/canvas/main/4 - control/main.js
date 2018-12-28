{{include:mouse.js}}

workspace.control = new function(){
    var control = this;

    this.gui = new function(){
        var pane = workspace.system.pane.f;
        var menubar = undefined;

        this.refresh = function(){
            if(menubar != undefined){menubar.refresh();}
        };

        this.showMenubar = function(){
            if(menubar != undefined){return;}
            menubar = control.gui.elements.menubar(0,0);
            pane.append( menubar );
        };
        this.hideMenubar = function(){
            if(menubar == undefined){return;}
            pane.remove( menubar );
            menubar = undefined;
        };

        this.elements = new function(){
            {{include:gui/menubar.js}}
        };
    };
    this.viewport = new function(){
        this.width = function(){ return workspace.width; };
        this.height = function(){ return workspace.height; };

        this.scale = function(a){ return workspace.core.viewport.scale(a); };
        this.position = function(x,y){ return workspace.core.viewport.position(x,y); };
        this.refresh = function(){ 
            workspace.core.viewport.refresh();
            control.gui.refresh();
        };
    };
    this.scene = new function(){
        var pane = workspace.system.pane.mm;
        var IDcounter = 0;

        this.new = function(){console.log('new scene!');};
        this.load = function(){console.log('load scene!');};
        this.save = function(filename){console.log('save scene!',filename);};
        this.generateUnitName = function(){ return IDcounter++; };
        this.addUnit = function(x,y,model,category,collection='alpha'){
            //generate new name for unit
                var name = this.generateUnitName();

            //produce unit, assign its name and add grapple code
                var tmp = category == undefined ? workspace.interface.unit[collection][model](x,y) : workspace.interface.unit[collection][category][model](x,y);
                tmp.name = ''+name;
                tmp = workspace.control.grapple.declare(tmp);

            //check if this new position is possible, and if not find the closest one that is and adjust the unit's position accordingly
                this.rectifyUnitPosition(tmp);

            //add it to the main pane
                pane.append( tmp );

            return tmp;
        };
        this.removeUnit = function(unit){ pane.remove(unit); };

        this.getUnitByName = function(name){ return pane.getChildByName(name); };
        this.getUnitsByType = function(type){ return pane.children.filter( a => a.unitType == type ); };
        this.getUnitUnderPoint = function(x,y){
            for( var a = 0; a < pane.children.length; a++){
                if( workspace.library.math.detectOverlap.boundingBoxes({bottomRight:{x:x,y:y},topLeft:{x:x,y:y}}, pane.children[a].space.box) ){
                    if( workspace.library.math.detectOverlap.pointWithinPoly({x:x,y:y}, pane.children[a].space.points) ){
                        return pane.children[a];
                    }
                }
            }
        };
        this.getUnitsWithinPoly = function(points){
            var box = workspace.library.math.boundingBoxFromPoints(points);
            return pane.children.filter(function(a){ return !a._isCable && workspace.library.math.detectOverlap.boundingBoxes(box, a.space.box) && workspace.library.math.detectOverlap.overlappingPolygons(points, a.space.points); });
        };

        this.rectifyUnitPosition = function(unit){
            return false;
        };
    };
    this.selection = new function(){
        {{include:selection.js}}
    };
};

{{include:grapple.js}}

window.onresize = workspace.control.viewport.refresh;