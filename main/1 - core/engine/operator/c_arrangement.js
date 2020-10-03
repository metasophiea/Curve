this.arrangement = new function(){
    //root
        this.prepend = function(element_id){
            ENGINE.arrangement__prepend(element_id);
        };
        this.append = function(element_id){
            ENGINE.arrangement__append(element_id);
        };
        this.remove = function(element_id){
            ENGINE.arrangement__remove(element_id);
        };
        this.clear = function(){
            ENGINE.arrangement__clear();
        };

    //discovery
        this.getElementByAddress = function(address){
            return ENGINE.arrangement__get_element_by_address(address);
        };
        this.getElementsUnderPoint = function(x,y){
            return ENGINE.arrangement__get_elements_under_point(x,y);
        };
        this.getElementsUnderArea = function(points){
            return ENGINE.arrangement__get_elements_under_area(points);
        };
        
    //misc
        this.printTree = function(mode='spaced'){
            ENGINE.arrangement__print_tree(
                ['spaced', 'tabular', 'address'].indexOf(mode)
            );
        };
        this.printSurvey = function(){
            ENGINE.arrangement__print_survey();
        };
        this._dump = function(){
            ENGINE.arrangement__dump();
        };
};