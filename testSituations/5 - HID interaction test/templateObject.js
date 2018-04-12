/*
constructor function name (x, y)

    var main = new interface();

    return main;


parts.basic.g('object', x, y);

var interface = function(){
    this.selectionArea = {}
    this.selectionArea.box = []
    this.selectionArea.points = []
    this.io = {}

    this.onSelect = function(){};
    this.onDeselect = function(){};
    this.onDelete = function(){};
    this.onCopy = function(original=false){};
    this.onMove = function(){};

    this.updateSelectionArea = function(){};
    this.exportData = function(){};
    this.importData = function(data){};
};
*/




/*
function interface(obj){
    obj.selectionArea = {}
    obj.selectionArea.box = []
    obj.selectionArea.points = []
    obj.io = {}

    obj.onSelect = function(){};
    obj.onDeselect = function(){};
    obj.onDelete = function(){};
    obj.onCopy = function(original=false){};
    obj.onMove = function(){};

    obj.updateSelectionArea = function(){};
    obj.exportData = function(){};
    obj.importData = function(data){};
};

constructor function name (x, y)

    var main = parts.basic.g('object', x, y);
    main = applyInterface(main);

    return main
*/



/*
function getBaseElement(id, x, y){
    var obj = parts.basic.g('object', x, y);

    obj.selectionArea = {}
    obj.selectionArea.box = []
    obj.selectionArea.points = []
    obj.io = {}

    obj.onSelect = function(){};
    obj.onDeselect = function(){};
    obj.onDelete = function(){};
    obj.onCopy = function(original=false){};
    obj.onMove = function(){};

    obj.updateSelectionArea = function(){};
    obj.exportData = function(){};
    obj.importData = function(data){};

    return obj;
};

constructor function name (x, y)

    var main = getBaseElement('object', x, y);

    return main
*/