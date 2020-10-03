//hierarchy and identity
    this.getElementType = function(id){
        return ENGINE.element__execute_method__get_element_type(id);
    };
    this.getName = function(id){
        return ENGINE.element__execute_method__get_name(id);
    };
    this.setName = function(id, new_name){
        ENGINE.element__execute_method__set_name(id, new_name);
    };
    this.getParentId = function(id){
        return ENGINE.element__execute_method__get_parent_id(id);
    };
//position
    this.setX = function(id, x){
        ENGINE.element__execute_method__set_x(id, x);
    };
    this.setY = function(id, y){
        ENGINE.element__execute_method__set_y(id, y);
    };
    this.setAngle = function(id, angle){
        ENGINE.element__execute_method__set_angle(id, angle);
    };
    this.setScale = function(id, scale){
        ENGINE.element__execute_method__set_scale(id, scale);
    };
//other
    this.getIgnored = function(id){
        return ENGINE.element__execute_method__get_ignored(id);
    };
    this.setIgnored = function(id, bool){
        ENGINE.element__execute_method__set_ignored(id, bool);
    };
//universal attribute
    this.unifiedAttribute = function(id,data){
        if(data == undefined){return;}
        ENGINE.element__execute_method__set_unified_attribute(id, data);
    };
//addressing
    this.getAddress = function(id){
        return ENGINE.element__execute_method__get_address(id);
    };
//extremities
    this.getAllowComputeExtremities = function(id){
        return ENGINE.element__execute_method__get_allow_compute_extremities(id);
    };
    this.setAllowComputeExtremities = function(id, bool){
        ENGINE.element__execute_method__set_allow_compute_extremities(id, bool);
    };
//render
    this.getDotFrame = function(id){
        return ENGINE.element__execute_method__get_dot_frame(id);
    };
    this.setDotFrame = function(id, bool){
        ENGINE.element__execute_method__set_dot_frame(id, bool);
    };
//info/dump
    this.info = function(id){
        return ENGINE.element__execute_method__info(id);
    };
    this.dump = function(id){
        ENGINE.element__execute_method__dump(id);
    };