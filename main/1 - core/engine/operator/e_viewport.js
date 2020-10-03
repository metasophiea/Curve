this.viewport = new function(){
    const mouseData = { 
        stopScrollActive:false,
    };

    //camera position
        this.position = function(x,y){
            ENGINE.viewport__position(x,y);
        };
        this.scale = function(s){
            ENGINE.viewport__scale(s);
        };
        this.angle = function(a){
            ENGINE.viewport__angle(a);
        };
        this.anchor = function(x,y){
            ENGINE.viewport__anchor(x,y);
        };

    //mouse interaction
        this.getElementsUnderPoint = function(x,y){
            return ENGINE.viewport__get_elements_under_point(x,y);
        };
        this.getElementsUnderArea = function(points){
            return ENGINE.viewport__get_elements_under_area(points);
        };
        this.stopMouseScroll = function(bool){
            if(bool == undefined){return mouseData.stopScrollActive;}
            mouseData.stopScrollActive = bool;

            ENGINE.viewport__set_stop_mouse_scroll(bool);

            //just incase; make sure that scrolling is allowed again when 'stopMouseScroll' is turned off
            if(!bool){
                interface.setDocumentAttributes(['body.style.overflow'],['']);
            }
        };

    //misc
        this.refresh = function(){
            ENGINE.viewport__refresh();
        };
        this._dump = function(){
            ENGINE.viewport__dump();
        };
};