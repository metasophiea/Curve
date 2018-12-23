{{include:mouse.js}}

workspace.control = new function(){
    var control = this;

    this.gui = new function(){};
    this.viewport = new function(){
        this.scale = function(a){ return workspace.core.viewport.scale(a); };
        this.position = function(x,y){ return workspace.core.viewport.position(x,y); };
    };
    this.scene = new function(){
        var pane = workspace.system.pane.mm;

        this.new = function(){};
        this.load = function(){};
        this.save = function(){};
        this.addUnit = function(unitType,x,y){
            //generate new name for unit
                var name = 0;
                for( var a = 0; a < pane.children.length; a++){
                    if( parseInt(pane.children[a].name) == name ){ name++; }
                }

            //produce unit, assign its name and add it to the main pane
                var tmp = workspace.interface.unit.alpha.misc[unitType](x,y);
                tmp.name = ''+name;
                pane.append( tmp );
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
            // workspace.system.pane.mf.append( workspace.interface.part.alpha.builder( 'polygon', 'selectionPolygon', { points:points, style:{ fill:'rgba(255,0,0,0.1)' } } ) );
            var box = workspace.library.math.boundingBoxFromPoints(points);
            return pane.children.filter(function(a){ return workspace.library.math.detectOverlap.boundingBoxes(box, a.space.box) && workspace.library.math.detectOverlap.overlappingPolygons(points, a.space.points); });
        };
    };
    this.selection = new function(){
        var selectedObjects = [];
        var lastSelectedObjects = null;
        var clipboard = [];

        this.selectUnit = function(){};
        this.deselectUnit = function(){};
        this.selectEverything = function(){};
        this.deselectEverything = function(){};

        this.cut = function(){
            this.copy();
            this.delete();
        };
        this.copy = function(){};
        this.paste = function(){};
        this.duplicate = function(){};
        this.delete = function(){};
    };
};