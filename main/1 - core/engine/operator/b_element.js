this.element = new function(){
    this.getAvailableElements = function(){
        return WASM.Engine.element__get_available_elements();
    };
    //basic management
        this.create = function(type,name){
            return ENGINE.element__create(type,name);
        };
        this.delete = function(element_id){
            ENGINE.element__delete(element_id);
        };
        this.deleteAllCreated = function(){
            ENGINE.element__delete_all();
        };
    //get element
        this.getTypeById = function(element_id){
            return ENGINE.element__get_type_by_id(element_id);
        };
    //execute method
        this.executeMethod = new function(){
            {{include:b_element_executeMethod/main.js}}
        };
    //misc
        this.createSetAppend = function(type, name, data, group_id){
            return ENGINE.element__create_set_append(type, name, data, group_id);
        };
        this._dump = function(){
            ENGINE.element__dump();
        };
};