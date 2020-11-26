this.menubar = function(x,y){
    const self = this;
    const vars = {
        width: _canvas_.control.viewport.width(),
        height: 20,
        selected: undefined,
        activeDropdown: undefined,
        item_horizontalPadding:10,
        item_spacingHeight:0,

        subList_arrowMux:0.5,
        space_height:10/16,
        break_height:10/8,
        break_lineMux:1/5,
        textBreak_height:10/8,
        textBreak_textToLineSpacing:1,
        textBreak_textHeightMux:1.1,
        textBreak_lineMux:1/5,

        style: 'default',
    };

    //elements
        //main
            const object = _canvas_.interface.part.builder('basic', 'group', 'menubar', {});
            let bar;

        //items
            function createDropdown(a,x){
                let dropdown = undefined;

                //produce dropdown
                    const style = control.gui.elements.menubar.styleLibrary[vars.style];
                    dropdown = _canvas_.interface.part.builder( 'control', 'list', 'dropdown', {
                        x:x, y:vars.height,

                        list:self.menubar.dropdowns[a].itemList,
    
                        backgroundColour:style.normal.backgroundColour,
                        backgroundMarkingColour:undefined,
                    
                        default_item_height:self.menubar.dropdowns[a].listItemHeight,
                        default_item_width:self.menubar.dropdowns[a].listWidth,
                        default_item_spacingHeight:0,
                        default_item_horizontalPadding:vars.item_horizontalPadding,
                    
                        default_text__text:undefined,
                        default_text__font:                                   self.menubar.dropdowns[a].important ? style.important.text__font :                                           style.normal.text__font,
                        default_text__fontSize:                               self.menubar.dropdowns[a].important ? style.important.text__fontSize :                                       style.normal.text__fontSize,
                        default_text__printingMode:undefined,
                        default_text__spacing:                                self.menubar.dropdowns[a].important ? style.important.text__spacing :                                        style.normal.text__spacing,
                        default_text__interCharacterSpacing:                  self.menubar.dropdowns[a].important ? style.important.text__interCharacterSpacing :                          style.normal.text__interCharacterSpacing,

                        default_text_colour__off:                             self.menubar.dropdowns[a].important ? style.important.text_colour__off :                                     style.normal.text_colour__off,         
                        default_text_colour__up:                              self.menubar.dropdowns[a].important ? style.important.text_colour__up :                                      style.normal.text_colour__up,         
                        default_text_colour__press:                           self.menubar.dropdowns[a].important ? style.important.text_colour__press :                                   style.normal.text_colour__press,         
                        default_text_colour__select:                          self.menubar.dropdowns[a].important ? style.important.text_colour__select :                                  style.normal.text_colour__select,           
                        default_text_colour__select_press:                    self.menubar.dropdowns[a].important ? style.important.text_colour__select_press :                            style.normal.text_colour__select_press,               
                        default_text_colour__glow:                            self.menubar.dropdowns[a].important ? style.important.text_colour__glow :                                    style.normal.text_colour__glow,         
                        default_text_colour__glow_press:                      self.menubar.dropdowns[a].important ? style.important.text_colour__glow_press :                              style.normal.text_colour__glow_press,               
                        default_text_colour__glow_select:                     self.menubar.dropdowns[a].important ? style.important.text_colour__glow_select :                             style.normal.text_colour__glow_select,               
                        default_text_colour__glow_select_press:               self.menubar.dropdowns[a].important ? style.important.text_colour__glow_select_press :                       style.normal.text_colour__glow_select_press,                   
                        default_text_colour__hover:                           self.menubar.dropdowns[a].important ? style.important.text_colour__hover :                                   style.normal.text_colour__hover,         
                        default_text_colour__hover_press:                     self.menubar.dropdowns[a].important ? style.important.text_colour__hover_press :                             style.normal.text_colour__hover_press,               
                        default_text_colour__hover_select:                    self.menubar.dropdowns[a].important ? style.important.text_colour__hover_select :                            style.normal.text_colour__hover_select,               
                        default_text_colour__hover_select_press:              self.menubar.dropdowns[a].important ? style.important.text_colour__hover_select_press :                      style.normal.text_colour__hover_select_press,                       
                        default_text_colour__hover_glow:                      self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow :                              style.normal.text_colour__hover_glow,               
                        default_text_colour__hover_glow_press:                self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow_press :                        style.normal.text_colour__hover_glow_press,                   
                        default_text_colour__hover_glow_select:               self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow_select :                       style.normal.text_colour__hover_glow_select,                   
                        default_text_colour__hover_glow_select_press:         self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow_select_press :                 style.normal.text_colour__hover_glow_select_press,                           
                    
                        default_item__off__colour:                            self.menubar.dropdowns[a].important ? style.important.item_backing__off__colour :                            style.normal.item_backing__off__colour,
                        default_item__off__lineColour:                        self.menubar.dropdowns[a].important ? style.important.item_backing__off__lineColour :                        style.normal.item_backing__off__lineColour,
                        default_item__off__lineThickness:                     self.menubar.dropdowns[a].important ? style.important.item_backing__off__lineThickness :                     style.normal.item_backing__off__lineThickness,
                        default_item__up__colour:                             self.menubar.dropdowns[a].important ? style.important.item_backing__up__colour :                             style.normal.item_backing__up__colour,
                        default_item__up__lineColour:                         self.menubar.dropdowns[a].important ? style.important.item_backing__up__lineColour :                         style.normal.item_backing__up__lineColour,
                        default_item__up__lineThickness:                      self.menubar.dropdowns[a].important ? style.important.item_backing__up__lineThickness :                      style.normal.item_backing__up__lineThickness,
                        default_item__press__colour:                          self.menubar.dropdowns[a].important ? style.important.item_backing__press__colour :                          style.normal.item_backing__press__colour,
                        default_item__press__lineColour:                      self.menubar.dropdowns[a].important ? style.important.item_backing__press__lineColour :                      style.normal.item_backing__press__lineColour,
                        default_item__press__lineThickness:                   self.menubar.dropdowns[a].important ? style.important.item_backing__press__lineThickness :                   style.normal.item_backing__press__lineThickness,
                        default_item__select__colour:                         self.menubar.dropdowns[a].important ? style.important.item_backing__select__colour :                         style.normal.item_backing__select__colour,
                        default_item__select__lineColour:                     self.menubar.dropdowns[a].important ? style.important.item_backing__select__lineColour :                     style.normal.item_backing__select__lineColour,
                        default_item__select__lineThickness:                  self.menubar.dropdowns[a].important ? style.important.item_backing__select__lineThickness :                  style.normal.item_backing__select__lineThickness,
                        default_item__select_press__colour:                   self.menubar.dropdowns[a].important ? style.important.item_backing__select_press__colour :                   style.normal.item_backing__select_press__colour,
                        default_item__select_press__lineColour:               self.menubar.dropdowns[a].important ? style.important.item_backing__select_press__lineColour :               style.normal.item_backing__select_press__lineColour,
                        default_item__select_press__lineThickness:            self.menubar.dropdowns[a].important ? style.important.item_backing__select_press__lineThickness :            style.normal.item_backing__select_press__lineThickness,
                        default_item__glow__colour:                           self.menubar.dropdowns[a].important ? style.important.item_backing__glow__colour :                           style.normal.item_backing__glow__colour,
                        default_item__glow__lineColour:                       self.menubar.dropdowns[a].important ? style.important.item_backing__glow__lineColour :                       style.normal.item_backing__glow__lineColour,
                        default_item__glow__lineThickness:                    self.menubar.dropdowns[a].important ? style.important.item_backing__glow__lineThickness :                    style.normal.item_backing__glow__lineThickness,
                        default_item__glow_press__colour:                     self.menubar.dropdowns[a].important ? style.important.item_backing__glow_press__colour :                     style.normal.item_backing__glow_press__colour,
                        default_item__glow_press__lineColour:                 self.menubar.dropdowns[a].important ? style.important.item_backing__glow_press__lineColour :                 style.normal.item_backing__glow_press__lineColour,
                        default_item__glow_press__lineThickness:              self.menubar.dropdowns[a].important ? style.important.item_backing__glow_press__lineThickness :              style.normal.item_backing__glow_press__lineThickness,
                        default_item__glow_select__colour:                    self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select__colour :                    style.normal.item_backing__glow_select__colour,
                        default_item__glow_select__lineColour:                self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select__lineColour :                style.normal.item_backing__glow_select__lineColour,
                        default_item__glow_select__lineThickness:             self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select__lineThickness :             style.normal.item_backing__glow_select__lineThickness,
                        default_item__glow_select_press__colour:              self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select_press__colour :              style.normal.item_backing__glow_select_press__colour,
                        default_item__glow_select_press__lineColour:          self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select_press__lineColour :          style.normal.item_backing__glow_select_press__lineColour,
                        default_item__glow_select_press__lineThickness:       self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select_press__lineThickness :       style.normal.item_backing__glow_select_press__lineThickness,
                        default_item__hover__colour:                          self.menubar.dropdowns[a].important ? style.important.item_backing__hover__colour :                          style.normal.item_backing__hover__colour,
                        default_item__hover__lineColour:                      self.menubar.dropdowns[a].important ? style.important.item_backing__hover__lineColour :                      style.normal.item_backing__hover__lineColour,
                        default_item__hover__lineThickness:                   self.menubar.dropdowns[a].important ? style.important.item_backing__hover__lineThickness :                   style.normal.item_backing__hover__lineThickness,
                        default_item__hover_press__colour:                    self.menubar.dropdowns[a].important ? style.important.item_backing__hover_press__colour :                    style.normal.item_backing__hover_press__colour,
                        default_item__hover_press__lineColour:                self.menubar.dropdowns[a].important ? style.important.item_backing__hover_press__lineColour :                style.normal.item_backing__hover_press__lineColour,
                        default_item__hover_press__lineThickness:             self.menubar.dropdowns[a].important ? style.important.item_backing__hover_press__lineThickness :             style.normal.item_backing__hover_press__lineThickness,
                        default_item__hover_select__colour:                   self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select__colour :                   style.normal.item_backing__hover_select__colour,
                        default_item__hover_select__lineColour:               self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select__lineColour :               style.normal.item_backing__hover_select__lineColour,
                        default_item__hover_select__lineThickness:            self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select__lineThickness :            style.normal.item_backing__hover_select__lineThickness,
                        default_item__hover_select_press__colour:             self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select_press__colour :             style.normal.item_backing__hover_select_press__colour,
                        default_item__hover_select_press__lineColour:         self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select_press__lineColour :         style.normal.item_backing__hover_select_press__lineColour,
                        default_item__hover_select_press__lineThickness:      self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select_press__lineThickness :      style.normal.item_backing__hover_select_press__lineThickness,
                        default_item__hover_glow__colour:                     self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow__colour :                     style.normal.item_backing__hover_glow__colour,
                        default_item__hover_glow__lineColour:                 self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow__lineColour :                 style.normal.item_backing__hover_glow__lineColour,
                        default_item__hover_glow__lineThickness:              self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow__lineThickness :              style.normal.item_backing__hover_glow__lineThickness,
                        default_item__hover_glow_press__colour:               self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_press__colour :               style.normal.item_backing__hover_glow_press__colour,
                        default_item__hover_glow_press__lineColour:           self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_press__lineColour :           style.normal.item_backing__hover_glow_press__lineColour,
                        default_item__hover_glow_press__lineThickness:        self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_press__lineThickness :        style.normal.item_backing__hover_glow_press__lineThickness,
                        default_item__hover_glow_select__colour:              self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select__colour :              style.normal.item_backing__hover_glow_select__colour,
                        default_item__hover_glow_select__lineColour:          self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select__lineColour :          style.normal.item_backing__hover_glow_select__lineColour,
                        default_item__hover_glow_select__lineThickness:       self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select__lineThickness :       style.normal.item_backing__hover_glow_select__lineThickness,
                        default_item__hover_glow_select_press__colour:        self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select_press__colour :        style.normal.item_backing__hover_glow_select_press__colour,
                        default_item__hover_glow_select_press__lineColour:    self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select_press__lineColour :    style.normal.item_backing__hover_glow_select_press__lineColour,
                        default_item__hover_glow_select_press__lineThickness: self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select_press__lineThickness : style.normal.item_backing__hover_glow_select_press__lineThickness,
                    
                        subList_arrowMux:vars.subList_arrowMux,
                        space_height:vars.space_height,
                        break_height:vars.break_height,
                        break_lineMux:vars.break_lineMux,
                        textBreak_height:vars.textBreak_height,
                        textBreak_textToLineSpacing:vars.textBreak_textToLineSpacing,
                        textBreak_textHeightMux:vars.textBreak_textHeightMux,
                        textBreak_lineMux:vars.textBreak_lineMux,
                        checkbox_checkColour:style.checkbox_checkColour,
                    });

                //add height limitation if the dropdown height exceeds the window height
                    if( control.viewport.height() < dropdown.getCalculatedListHeight()){
                        dropdown.heightLimit(control.viewport.height()-vars.height);
                    }

                //upon selection of an item in a dropdown; close the dropdown and have nothing selected
                    dropdown.onrelease = function(){
                        object.getChildByName('dropdownButton_'+a).select(false); 
                        vars.selected = undefined;
                    };

                return dropdown;
            }
            function produceBar(){ 
                //just incase this function has been started by a button on the menubar, make sure to clear out the
                //old "onrelease" functions so we don't end up trying to deselect something that doesn't exist
                    object.getChildren().forEach(child => {
                        if(child.onrelease != undefined){
                            child.onrelease = function(){};
                        }
                    });
                //obviously, also deselect anything
                    vars.selected = undefined;

                object.clear();

                const style = control.gui.elements.menubar.styleLibrary[vars.style];

                bar = _canvas_.interface.part.builder( 'basic', 'rectangle', 'barBacking', {
                    x:0, y:0, width:_canvas_.control.viewport.width(), height:vars.height, colour:style.normal.backgroundColour
                } );
                object.append(bar);

                let accWidth_fromLeft = 0;
                let accWidth_fromRight = 0;
                for(let a = 0; a < self.menubar.dropdowns.length; a++){
                    let button_x = 0;
                    let list_x = 0;

                    if(self.menubar.dropdowns[a].side == 'right'){
                        button_x = bar.width() - (accWidth_fromRight + self.menubar.dropdowns[a].width);
                        list_x = bar.width() - (accWidth_fromRight + self.menubar.dropdowns[a].listWidth);

                        self.menubar.dropdowns[a].x = accWidth_fromRight;
                        accWidth_fromRight += self.menubar.dropdowns[a].width;
                    } else if (self.menubar.dropdowns[a].side == 'left' || self.menubar.dropdowns[a].side == undefined) {
                        button_x = accWidth_fromLeft;
                        list_x = accWidth_fromLeft;

                        self.menubar.dropdowns[a].x = accWidth_fromLeft;
                        accWidth_fromLeft += self.menubar.dropdowns[a].width;
                    }

                    const item = _canvas_.interface.part.builder( 'control', 'button_rectangle', 'dropdownButton_'+a, {
                        x:button_x, y:0, 
                        width:self.menubar.dropdowns[a].width,
                        height:vars.height, 
                        hoverable:false, selectable:true,
                        text_centre:self.menubar.dropdowns[a].text,
                        style:{
                            text_font:                                          self.menubar.dropdowns[a].important ? style.important.text__font :                                           style.normal.text__font,
                            text_size:                                          self.menubar.dropdowns[a].important ? style.important.text__fontSize :                                       style.normal.text__fontSize,
                            text_spacing:                                       self.menubar.dropdowns[a].important ? style.important.text__spacing :                                        style.normal.text__spacing,
                            text_interCharacterSpacing:                         self.menubar.dropdowns[a].important ? style.important.text__interCharacterSpacing :                          style.normal.text__interCharacterSpacing,
                        
                            text__off__colour:                                  self.menubar.dropdowns[a].important ? style.important.text_colour__off :                                     style.normal.text_colour__off,
                            text__up__colour:                                   self.menubar.dropdowns[a].important ? style.important.text_colour__up :                                      style.normal.text_colour__up,
                            text__press__colour:                                self.menubar.dropdowns[a].important ? style.important.text_colour__press :                                   style.normal.text_colour__press,
                            text__select__colour:                               self.menubar.dropdowns[a].important ? style.important.text_colour__select :                                  style.normal.text_colour__select,
                            text__select_press__colour:                         self.menubar.dropdowns[a].important ? style.important.text_colour__select_press :                            style.normal.text_colour__select_press,
                            text__glow__colour:                                 self.menubar.dropdowns[a].important ? style.important.text_colour__glow :                                    style.normal.text_colour__glow,
                            text__glow_press__colour:                           self.menubar.dropdowns[a].important ? style.important.text_colour__glow_press :                              style.normal.text_colour__glow_press,
                            text__glow_select__colour:                          self.menubar.dropdowns[a].important ? style.important.text_colour__glow_select :                             style.normal.text_colour__glow_select,
                            text__glow_select_press__colour:                    self.menubar.dropdowns[a].important ? style.important.text_colour__glow_select_press :                       style.normal.text_colour__glow_select_press,
                            text__hover__colour:                                self.menubar.dropdowns[a].important ? style.important.text_colour__hover :                                   style.normal.text_colour__hover,
                            text__hover_press__colour:                          self.menubar.dropdowns[a].important ? style.important.text_colour__hover_press :                             style.normal.text_colour__hover_press,
                            text__hover_select__colour:                         self.menubar.dropdowns[a].important ? style.important.text_colour__hover_select :                            style.normal.text_colour__hover_select,
                            text__hover_select_press__colour:                   self.menubar.dropdowns[a].important ? style.important.text_colour__hover_select_press :                      style.normal.text_colour__hover_select_press,
                            text__hover_glow__colour:                           self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow :                              style.normal.text_colour__hover_glow,
                            text__hover_glow_press__colour:                     self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow_press :                        style.normal.text_colour__hover_glow_press,
                            text__hover_glow_select__colour:                    self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow_select :                       style.normal.text_colour__hover_glow_select,
                            text__hover_glow_select_press__colour:              self.menubar.dropdowns[a].important ? style.important.text_colour__hover_glow_select_press :                 style.normal.text_colour__hover_glow_select_press,
                        
                            background__off__colour:                            self.menubar.dropdowns[a].important ? style.important.item_backing__off__colour :                            style.normal.item_backing__off__colour,
                            background__off__lineColour:                        self.menubar.dropdowns[a].important ? style.important.item_backing__off__lineColour :                        style.normal.item_backing__off__lineColour,
                            background__off__lineThickness:                     self.menubar.dropdowns[a].important ? style.important.item_backing__off__lineThickness :                     style.normal.item_backing__off__lineThickness,
                            background__up__colour:                             self.menubar.dropdowns[a].important ? style.important.item_backing__up__colour :                             style.normal.item_backing__up__colour,
                            background__up__lineColour:                         self.menubar.dropdowns[a].important ? style.important.item_backing__up__lineColour :                         style.normal.item_backing__up__lineColour,
                            background__up__lineThickness:                      self.menubar.dropdowns[a].important ? style.important.item_backing__up__lineThickness :                      style.normal.item_backing__up__lineThickness,
                            background__press__colour:                          self.menubar.dropdowns[a].important ? style.important.item_backing__press__colour :                          style.normal.item_backing__press__colour,
                            background__press__lineColour:                      self.menubar.dropdowns[a].important ? style.important.item_backing__press__lineColour :                      style.normal.item_backing__press__lineColour,
                            background__press__lineThickness:                   self.menubar.dropdowns[a].important ? style.important.item_backing__press__lineThickness :                   style.normal.item_backing__press__lineThickness,
                            background__select__colour:                         self.menubar.dropdowns[a].important ? style.important.item_backing__select__colour :                         style.normal.item_backing__select__colour,
                            background__select__lineColour:                     self.menubar.dropdowns[a].important ? style.important.item_backing__select__lineColour :                     style.normal.item_backing__select__lineColour,
                            background__select__lineThickness:                  self.menubar.dropdowns[a].important ? style.important.item_backing__select__lineThickness :                  style.normal.item_backing__select__lineThickness,
                            background__select_press__colour:                   self.menubar.dropdowns[a].important ? style.important.item_backing__select_press__colour :                   style.normal.item_backing__select_press__colour,
                            background__select_press__lineColour:               self.menubar.dropdowns[a].important ? style.important.item_backing__select_press__lineColour :               style.normal.item_backing__select_press__lineColour,
                            background__select_press__lineThickness:            self.menubar.dropdowns[a].important ? style.important.item_backing__select_press__lineThickness :            style.normal.item_backing__select_press__lineThickness,
                            background__glow__colour:                           self.menubar.dropdowns[a].important ? style.important.item_backing__glow__colour :                           style.normal.item_backing__glow__colour,
                            background__glow__lineColour:                       self.menubar.dropdowns[a].important ? style.important.item_backing__glow__lineColour :                       style.normal.item_backing__glow__lineColour,
                            background__glow__lineThickness:                    self.menubar.dropdowns[a].important ? style.important.item_backing__glow__lineThickness :                    style.normal.item_backing__glow__lineThickness,
                            background__glow_press__colour:                     self.menubar.dropdowns[a].important ? style.important.item_backing__glow_press__colour :                     style.normal.item_backing__glow_press__colour,
                            background__glow_press__lineColour:                 self.menubar.dropdowns[a].important ? style.important.item_backing__glow_press__lineColour :                 style.normal.item_backing__glow_press__lineColour,
                            background__glow_press__lineThickness:              self.menubar.dropdowns[a].important ? style.important.item_backing__glow_press__lineThickness :              style.normal.item_backing__glow_press__lineThickness,
                            background__glow_select__colour:                    self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select__colour :                    style.normal.item_backing__glow_select__colour,
                            background__glow_select__lineColour:                self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select__lineColour :                style.normal.item_backing__glow_select__lineColour,
                            background__glow_select__lineThickness:             self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select__lineThickness :             style.normal.item_backing__glow_select__lineThickness,
                            background__glow_select_press__colour:              self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select_press__colour :              style.normal.item_backing__glow_select_press__colour,
                            background__glow_select_press__lineColour:          self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select_press__lineColour :          style.normal.item_backing__glow_select_press__lineColour,
                            background__glow_select_press__lineThickness:       self.menubar.dropdowns[a].important ? style.important.item_backing__glow_select_press__lineThickness :       style.normal.item_backing__glow_select_press__lineThickness,
                            background__hover__colour:                          self.menubar.dropdowns[a].important ? style.important.item_backing__hover__colour :                          style.normal.item_backing__hover__colour,
                            background__hover__lineColour:                      self.menubar.dropdowns[a].important ? style.important.item_backing__hover__lineColour :                      style.normal.item_backing__hover__lineColour,
                            background__hover__lineThickness:                   self.menubar.dropdowns[a].important ? style.important.item_backing__hover__lineThickness :                   style.normal.item_backing__hover__lineThickness,
                            background__hover_press__colour:                    self.menubar.dropdowns[a].important ? style.important.item_backing__hover_press__colour :                    style.normal.item_backing__hover_press__colour,
                            background__hover_press__lineColour:                self.menubar.dropdowns[a].important ? style.important.item_backing__hover_press__lineColour :                style.normal.item_backing__hover_press__lineColour,
                            background__hover_press__lineThickness:             self.menubar.dropdowns[a].important ? style.important.item_backing__hover_press__lineThickness :             style.normal.item_backing__hover_press__lineThickness,
                            background__hover_select__colour:                   self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select__colour :                   style.normal.item_backing__hover_select__colour,
                            background__hover_select__lineColour:               self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select__lineColour :               style.normal.item_backing__hover_select__lineColour,
                            background__hover_select__lineThickness:            self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select__lineThickness :            style.normal.item_backing__hover_select__lineThickness,
                            background__hover_select_press__colour:             self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select_press__colour :             style.normal.item_backing__hover_select_press__colour,
                            background__hover_select_press__lineColour:         self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select_press__lineColour :         style.normal.item_backing__hover_select_press__lineColour,
                            background__hover_select_press__lineThickness:      self.menubar.dropdowns[a].important ? style.important.item_backing__hover_select_press__lineThickness :      style.normal.item_backing__hover_select_press__lineThickness,
                            background__hover_glow__colour:                     self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow__colour :                     style.normal.item_backing__hover_glow__colour,
                            background__hover_glow__lineColour:                 self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow__lineColour :                 style.normal.item_backing__hover_glow__lineColour,
                            background__hover_glow__lineThickness:              self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow__lineThickness :              style.normal.item_backing__hover_glow__lineThickness,
                            background__hover_glow_press__colour:               self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_press__colour :               style.normal.item_backing__hover_glow_press__colour,
                            background__hover_glow_press__lineColour:           self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_press__lineColour :           style.normal.item_backing__hover_glow_press__lineColour,
                            background__hover_glow_press__lineThickness:        self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_press__lineThickness :        style.normal.item_backing__hover_glow_press__lineThickness,
                            background__hover_glow_select__colour:              self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select__colour :              style.normal.item_backing__hover_glow_select__colour,
                            background__hover_glow_select__lineColour:          self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select__lineColour :          style.normal.item_backing__hover_glow_select__lineColour,
                            background__hover_glow_select__lineThickness:       self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select__lineThickness :       style.normal.item_backing__hover_glow_select__lineThickness,
                            background__hover_glow_select_press__colour:        self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select_press__colour :        style.normal.item_backing__hover_glow_select_press__colour,
                            background__hover_glow_select_press__lineColour:    self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select_press__lineColour :    style.normal.item_backing__hover_glow_select_press__lineColour,
                            background__hover_glow_select_press__lineThickness: self.menubar.dropdowns[a].important ? style.important.item_backing__hover_glow_select_press__lineThickness : style.normal.item_backing__hover_glow_select_press__lineThickness,
                        },
                    } );
                    object.append(item);

                    item.onpress = function(a){ return function(){
                        // if this item has already been selected (and will be deselected after this callback)
                        // sent the menubar's 'vars.selected' value to undefined. Otherwise, set it to
                        // this item's number
    
                        vars.selected = object.getChildByName('dropdownButton_'+a).select() ? undefined : a;
                    }; }(a);
                    item.onenter = function(a){ return function(event){
                        //assuming an item has been selected, and it isn't the item that's currently being 
                        //entered; deselect that one and tell the menubar that this item is selected now.
                        //if no mouse button is pressed (no button rolling is happening) select it manually
                        if( vars.selected != undefined && vars.selected != a){
                            object.getChildByName('dropdownButton_'+vars.selected).select(false);
                            vars.selected = a;
                            object.getChildByName('dropdownButton_'+vars.selected).select(true);
                        }
                    }; }(a);
                    item.onselect = function(a,x){ return function(){
                        vars.activeDropdown = createDropdown(a,x)
                        object.append(vars.activeDropdown);
                    } }(a,list_x);
                    item.ondeselect = function(){ 
                        object.remove(vars.activeDropdown); 
                        vars.activeDropdown = undefined;
                    };
                }
            }
            produceBar();

    //control
        object.closeAllDropdowns = function(){
            if(vars.activeDropdown != undefined){
                vars.activeDropdown.onrelease();
            }
        };
        object.style = function(newStyle){
            if(newStyle==undefined){return style;}
            vars.style = newStyle;
            // style = control.gui.elements.menubar.styleLibrary[vars.style];
            produceBar();
        };

    //refresh
        object.refresh = function(){
            bar.width( _canvas_.control.viewport.width() );
            if(vars.activeDropdown != undefined){ object.closeAllDropdowns(); }
        };
        object.refresh();
        object.heavyRefresh = function(){
            produceBar();
        };
        object.checkboxRefresh = function(){
            console.log(object.getTree());
        };

    return object;
};

this.menubar.dropdowns = [];
this.menubar.styleLibrary = {};
{{include:styleLibrary/*}}