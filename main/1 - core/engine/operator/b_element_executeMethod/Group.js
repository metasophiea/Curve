this.Group = new function(){
    this.setUnifiedAttribute = function(id, x, y, angle, scale, heed_camera, clipping_active){
        ENGINE.element__execute_method__Group__set_unified_attribute(
            id, 
            x, y,
            angle,
            scale,
            heed_camera,
            clipping_active,
        );
    };

    this.children = function(id){
        return ENGINE.element__execute_method__Group__children(id);
    };
    this.getChildByName = function(id, name){
        return ENGINE.element__execute_method__Group__get_child_by_name(id, name);
    };

    this.append = function(parent_id, child_id){
        ENGINE.element__execute_method__Group__append(parent_id, child_id);
    };
    this.prepend = function(parent_id, child_id){
        ENGINE.element__execute_method__Group__prepend(parent_id, child_id);
    };
    this.remove = function(parent_id, child_id){
        ENGINE.element__execute_method__Group__remove(parent_id, child_id);
    };
    this.clear = function(parent_id){
        dev.log.element('.clear(', parent_id); //#development
        ENGINE.element__execute_method__Group__clear(parent_id);
    };
    this.shift = function(parent_id, child_id, new_position){
        dev.log.element('.shift(', parent_id, child_id, new_position); //#development
        ENGINE.element__execute_method__Group__shift(parent_id, child_id, new_position);
    };
    this.replace_with_these_children = function(id, new_elements){
        dev.log.element('.replace_with_these_children(', id, new_elements); //#development
        ENGINE.element__execute_method__Group__replace_with_these_children(id, new_elements);
    };

    this.getElementsUnderPoint = function(id, x, y){
        return ENGINE.element__execute_method__Group__get_elements_under_point(id, x, y);
    };
    this.getElementsUnderArea = function(id, points){
        return ENGINE.element__execute_method__Group__get_elements_under_area(id, points);
    };

    this.stencil = function(id, stencil_id){
        ENGINE.element__execute_method__Group__stencil(id, stencil_id);
    };
    this.getClipActive = function(id){
        return ENGINE.element__execute_method__Group__get_clip_active(id);
    };
    this.setClipActive = function(id, bool){
        ENGINE.element__execute_method__Group__set_clip_active(id, bool);
    };
};