this.Rectangle = new function(){
    this.getWidth = function(id){
        return ENGINE.element__execute_method__Rectangle__get_width(id);
    };
    this.setWidth = function(id, width){
        ENGINE.element__execute_method__Rectangle__set_width(id, width);
    };
    this.getHeight = function(id){
        return ENGINE.element__execute_method__Rectangle__get_height(id);
    };
    this.setHeight = function(id, height){
        ENGINE.element__execute_method__Rectangle__set_height(id, height);
    };
    this.getAnchor = function(id){
        return ENGINE.element__execute_method__Rectangle__get_anchor(id);
    };
    this.setAnchor = function(id, x, y){
        ENGINE.element__execute_method__Rectangle__set_anchor(id, x, y);
    };
    this.getColour = function(id){
        return ENGINE.element__execute_method__Rectangle__get_colour(id);
    };
    this.setColour = function(id, r, g, b, a){
        ENGINE.element__execute_method__Rectangle__set_colour(id, r, g, b, a);
    };

    this.setUnifiedAttribute = function(id, x, y, angle, scale, width, height, anchor_x, anchor_y, colour_r, colour_g, colour_b, colour_a){
        ENGINE.element__execute_method__Rectangle__set_unified_attribute(
            id, 
            x, y,
            angle,
            scale,
            width, height,
            anchor_x, anchor_y,
            colour_r, colour_g, colour_b, colour_a
        );
    };
};