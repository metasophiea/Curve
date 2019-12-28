this.menubar = function(x,y){
    const self = this;
    const vars = {
        width: _canvas_.control.viewport.width(),
        height: 20,
        selected: undefined,
        activedropdown: undefined,
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
    };
    let style = {
        backgroundColour:{r:240/255,g:240/255,b:240/255,a:1},
        
        text__font:'Helvetica',
        text__fontSize:14,
        text__spacing:0.3,
        text__interCharacterSpacing:0.04,

        text_colour__off:                                  {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__up:                                   {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__press:                                {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__select:                               {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__select_press:                         {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__glow:                                 {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__glow_press:                           {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__glow_select:                          {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__glow_select_press:                    {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover:                                {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover_press:                          {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover_select:                         {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover_select_press:                   {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover_glow:                           {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover_glow_press:                     {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover_glow_select:                    {r:0.2,g:0.2,b:0.2,a:1},
        text_colour__hover_glow_select_press:              {r:0.2,g:0.2,b:0.2,a:1},
            
        item_backing__off__colour:                              {r:180/255,g:180/255,b:180/255,a:1},
        item_backing__off__lineColour:                          {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__off__lineThickness:                       0,
        item_backing__up__colour:                               {r:240/255,g:240/255,b:240/255,a:1},
        item_backing__up__lineColour:                           {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__up__lineThickness:                        0,
        item_backing__press__colour:                            {r:240/255,g:240/255,b:240/255,a:1},
        item_backing__press__lineColour:                        {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__press__lineThickness:                     0,
        item_backing__select__colour:                           {r:220/255,g:220/255,b:220/255,a:1},
        item_backing__select__lineColour:                       {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__select__lineThickness:                    0,
        item_backing__select_press__colour:                     {r:229/255,g:167/255,b:255/255,a:1},
        item_backing__select_press__lineColour:                 {r:0,g:0,b:0,a:0},
        item_backing__select_press__lineThickness:              0,
        item_backing__glow__colour:                             {r:220/255,g:220/255,b:220/255,a:1},
        item_backing__glow__lineColour:                         {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__glow__lineThickness:                      0,
        item_backing__glow_press__colour:                       {r:250/255,g:250/255,b:250/255,a:1},
        item_backing__glow_press__lineColour:                   {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__glow_press__lineThickness:                0,
        item_backing__glow_select__colour:                      {r:220/255,g:220/255,b:220/255,a:1},
        item_backing__glow_select__lineColour:                  {r:120/255,g:120/255,b:120/255,a:1},
        item_backing__glow_select__lineThickness:               0,
        item_backing__glow_select_press__colour:                {r:250/255,g:250/255,b:250/255,a:1},
        item_backing__glow_select_press__lineColour:            {r:120/255,g:120/255,b:120/255,a:1},
        item_backing__glow_select_press__lineThickness:         0,
        item_backing__hover__colour:                            {r:229/255,g:167/255,b:255/255,a:1},
        item_backing__hover__lineColour:                        {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__hover__lineThickness:                     0,
        item_backing__hover_press__colour:                      {r:240/255,g:240/255,b:240/255,a:1},
        item_backing__hover_press__lineColour:                  {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__hover_press__lineThickness:               0,
        item_backing__hover_select__colour:                     {r:239/255,g:209/255,b:255/255,a:1},
        item_backing__hover_select__lineColour:                 {r:120/255,g:120/255,b:120/255,a:1},
        item_backing__hover_select__lineThickness:              0,
        item_backing__hover_select_press__colour:               {r:240/255,g:240/255,b:240/255,a:1},
        item_backing__hover_select_press__lineColour:           {r:120/255,g:120/255,b:120/255,a:1},
        item_backing__hover_select_press__lineThickness:        0,
        item_backing__hover_glow__colour:                       {r:239/255,g:209/255,b:255/255,a:1},
        item_backing__hover_glow__lineColour:                   {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__hover_glow__lineThickness:                0,
        item_backing__hover_glow_press__colour:                 {r:250/255,g:250/255,b:250/255,a:1},
        item_backing__hover_glow_press__lineColour:             {r:0/255,g:0/255,b:0/255,a:0},
        item_backing__hover_glow_press__lineThickness:          0,
        item_backing__hover_glow_select__colour:                {r:240/255,g:240/255,b:240/255,a:1},
        item_backing__hover_glow_select__lineColour:            {r:120/255,g:120/255,b:120/255,a:1},
        item_backing__hover_glow_select__lineThickness:         0,
        item_backing__hover_glow_select_press__colour:          {r:250/255,g:250/255,b:250/255,a:1},
        item_backing__hover_glow_select_press__lineColour:      {r:120/255,g:120/255,b:120/255,a:1},
        item_backing__hover_glow_select_press__lineThickness:   0,
    
        checkbox_checkColour:{r:0.7,g:0.7,b:0.7,a:1}, 
    };

    //elements
        //main
            const object = _canvas_.interface.part.builder( 'basic', 'group', 'menubar', {});
            let bar;

        //items
            function createDropdown(a,x){
                let dropdown = undefined;

                //produce dropdown
                    dropdown = _canvas_.interface.part.builder( 'control', 'list', 'dropdown', {
                        x:x, y:vars.height,

                        list:self.menubar.dropdowns[a].itemList,
    
                        backgroundColour:style.backgroundColour,
                        backgroundMarkingColour:undefined,
                    
                        default_item_height:self.menubar.dropdowns[a].listItemHeight,
                        default_item_width:self.menubar.dropdowns[a].listWidth,
                        default_item_spacingHeight:0,
                        default_item_horizontalPadding:vars.item_horizontalPadding,
                    
                        default_text__text:undefined,
                        default_text__font:style.text__font,
                        default_text__fontSize:style.text__fontSize,
                        default_text__printingMode:undefined,
                        default_text__spacing:style.text__spacing,
                        default_text__interCharacterSpacing:style.text__interCharacterSpacing,

                        default_text_colour__off:style.text_colour__off,
                        default_text_colour__up:style.text_colour__up,
                        default_text_colour__press:style.text_colour__press,
                        default_text_colour__select:style.text_colour__select,
                        default_text_colour__select_press:style.text_colour__select_press,
                        default_text_colour__glow:style.text_colour__glow,
                        default_text_colour__glow_press:style.text_colour__glow_press,
                        default_text_colour__glow_select:style.text_colour__glow_select,
                        default_text_colour__glow_select_press:style.text_colour__glow_select_press,
                        default_text_colour__hover:style.text_colour__hover,
                        default_text_colour__hover_press:style.text_colour__hover_press,
                        default_text_colour__hover_select:style.text_colour__hover_select,
                        default_text_colour__hover_select_press:style.text_colour__hover_select_press,
                        default_text_colour__hover_glow:style.text_colour__hover_glow,
                        default_text_colour__hover_glow_press:style.text_colour__hover_glow_press,
                        default_text_colour__hover_glow_select:style.text_colour__hover_glow_select,
                        default_text_colour__hover_glow_select_press:style.text_colour__hover_glow_select_press,
                    
                        default_item__off__colour:style.item_backing__off__colour,
                        default_item__off__lineColour:style.item_backing__off__lineColour,
                        default_item__off__lineThickness:style.item_backing__off__lineThickness,
                        default_item__up__colour:style.item_backing__up__colour,
                        default_item__up__lineColour:style.item_backing__up__lineColour,
                        default_item__up__lineThickness:style.item_backing__up__lineThickness,
                        default_item__press__colour:style.item_backing__press__colour,
                        default_item__press__lineColour:style.item_backing__press__lineColour,
                        default_item__press__lineThickness:style.item_backing__press__lineThickness,
                        default_item__select__colour:style.item_backing__select__colour,
                        default_item__select__lineColour:style.item_backing__select__lineColour,
                        default_item__select__lineThickness:style.item_backing__select__lineThickness,
                        default_item__select_press__colour:style.item_backing__select_press__colour,
                        default_item__select_press__lineColour:style.item_backing__select_press__lineColour,
                        default_item__select_press__lineThickness:style.item_backing__select_press__lineThickness,
                        default_item__glow__colour:style.item_backing__glow__colour,
                        default_item__glow__lineColour:style.item_backing__glow__lineColour,
                        default_item__glow__lineThickness:style.item_backing__glow__lineThickness,
                        default_item__glow_press__colour:style.item_backing__glow_press__colour,
                        default_item__glow_press__lineColour:style.item_backing__glow_press__lineColour,
                        default_item__glow_press__lineThickness:style.item_backing__glow_press__lineThickness,
                        default_item__glow_select__colour:style.item_backing__glow_select__colour,
                        default_item__glow_select__lineColour:style.item_backing__glow_select__lineColour,
                        default_item__glow_select__lineThickness:style.item_backing__glow_select__lineThickness,
                        default_item__glow_select_press__colour:style.item_backing__glow_select_press__colour,
                        default_item__glow_select_press__lineColour:style.item_backing__glow_select_press__lineColour,
                        default_item__glow_select_press__lineThickness:style.item_backing__glow_select_press__lineThickness,
                        default_item__hover__colour:style.item_backing__hover__colour,
                        default_item__hover__lineColour:style.item_backing__hover__lineColour,
                        default_item__hover__lineThickness:style.item_backing__hover__lineThickness,
                        default_item__hover_press__colour:style.item_backing__hover_press__colour,
                        default_item__hover_press__lineColour:style.item_backing__hover_press__lineColour,
                        default_item__hover_press__lineThickness:style.item_backing__hover_press__lineThickness,
                        default_item__hover_select__colour:style.item_backing__hover_select__colour,
                        default_item__hover_select__lineColour:style.item_backing__hover_select__lineColour,
                        default_item__hover_select__lineThickness:style.item_backing__hover_select__lineThickness,
                        default_item__hover_select_press__colour:style.item_backing__hover_select_press__colour,
                        default_item__hover_select_press__lineColour:style.item_backing__hover_select_press__lineColour,
                        default_item__hover_select_press__lineThickness:style.item_backing__hover_select_press__lineThickness,
                        default_item__hover_glow__colour:style.item_backing__hover_glow__colour,
                        default_item__hover_glow__lineColour:style.item_backing__hover_glow__lineColour,
                        default_item__hover_glow__lineThickness:style.item_backing__hover_glow__lineThickness,
                        default_item__hover_glow_press__colour:style.item_backing__hover_glow_press__colour,
                        default_item__hover_glow_press__lineColour:style.item_backing__hover_glow_press__lineColour,
                        default_item__hover_glow_press__lineThickness:style.item_backing__hover_glow_press__lineThickness,
                        default_item__hover_glow_select__colour:style.item_backing__hover_glow_select__colour,
                        default_item__hover_glow_select__lineColour:style.item_backing__hover_glow_select__lineColour,
                        default_item__hover_glow_select__lineThickness:style.item_backing__hover_glow_select__lineThickness,
                        default_item__hover_glow_select_press__colour:style.item_backing__hover_glow_select_press__colour,
                        default_item__hover_glow_select_press__lineColour:style.item_backing__hover_glow_select_press__lineColour,
                        default_item__hover_glow_select_press__lineThickness:style.item_backing__hover_glow_select_press__lineThickness,
                    
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
                object.clear();

                bar = _canvas_.interface.part.builder( 'basic', 'rectangle', 'barBacking', {
                    x:0, y:0, width:_canvas_.control.viewport.width(), height:vars.height, colour:style.backgroundColour
                } );
                object.append(bar);

                let accWidth = 0;
                for(let a = 0; a < self.menubar.dropdowns.length; a++){
                    const item = _canvas_.interface.part.builder( 'control', 'button_rectangle', 'dropdownButton_'+a, {
                        x:accWidth, y:0, 
                        width:self.menubar.dropdowns[a].width,
                        height:vars.height, 
                        hoverable:false, selectable:true,
                        text_centre:self.menubar.dropdowns[a].text,
                        style:{
                            text_font:style.text__font, 
                            text_size:style.text__fontSize, 
                            text_spacing:style.text__spacing, 
                            text_interCharacterSpacing:style.text__interCharacterSpacing,
                        
                            text__off__colour:style.text_colour__off,
                            text__up__colour:style.text_colour__up,
                            text__press__colour:style.text_colour__press,
                            text__select__colour:style.text_colour__select,
                            text__select_press__colour:style.text_colour__select_press,
                            text__glow__colour:style.text_colour__glow,
                            text__glow_press__colour:style.text_colour__glow_press,
                            text__glow_select__colour:style.text_colour__glow_select,
                            text__glow_select_press__colour:style.text_colour__glow_select_press,
                            text__hover__colour:style.text_colour__hover,
                            text__hover_press__colour:style.text_colour__hover_press,
                            text__hover_select__colour:style.text_colour__hover_select,
                            text__hover_select_press__colour:style.text_colour__hover_select_press,
                            text__hover_glow__colour:style.text_colour__hover_glow,
                            text__hover_glow_press__colour:style.text_colour__hover_glow_press,
                            text__hover_glow_select__colour:style.text_colour__hover_glow_select,
                            text__hover_glow_select_press__colour:style.text_colour__hover_glow_select_press,
                        
                            background__off__colour:style.item_backing__off__colour,
                            background__off__lineColour:style.item_backing__off__lineColour,
                            background__off__lineThickness:style.item_backing__off__lineThickness,
                            background__up__colour:style.item_backing__up__colour,
                            background__up__lineColour:style.item_backing__up__lineColour,
                            background__up__lineThickness:style.item_backing__up__lineThickness,
                            background__press__colour:style.item_backing__press__colour,
                            background__press__lineColour:style.item_backing__press__lineColour,
                            background__press__lineThickness:style.item_backing__press__lineThickness,
                            background__select__colour:style.item_backing__select__colour,
                            background__select__lineColour:style.item_backing__select__lineColour,
                            background__select__lineThickness:style.item_backing__select__lineThickness,
                            background__select_press__colour:style.item_backing__select_press__colour,
                            background__select_press__lineColour:style.item_backing__select_press__lineColour,
                            background__select_press__lineThickness:style.item_backing__select_press__lineThickness,
                            background__glow__colour:style.item_backing__glow__colour,
                            background__glow__lineColour:style.item_backing__glow__lineColour,
                            background__glow__lineThickness:style.item_backing__glow__lineThickness,
                            background__glow_press__colour:style.item_backing__glow_press__colour,
                            background__glow_press__lineColour:style.item_backing__glow_press__lineColour,
                            background__glow_press__lineThickness:style.item_backing__glow_press__lineThickness,
                            background__glow_select__colour:style.item_backing__glow_select__colour,
                            background__glow_select__lineColour:style.item_backing__glow_select__lineColour,
                            background__glow_select__lineThickness:style.item_backing__glow_select__lineThickness,
                            background__glow_select_press__colour:style.item_backing__glow_select_press__colour,
                            background__glow_select_press__lineColour:style.item_backing__glow_select_press__lineColour,
                            background__glow_select_press__lineThickness:style.item_backing__glow_select_press__lineThickness,
                            background__hover__colour:style.item_backing__hover__colour,
                            background__hover__lineColour:style.item_backing__hover__lineColour,
                            background__hover__lineThickness:style.item_backing__hover__lineThickness,
                            background__hover_press__colour:style.item_backing__hover_press__colour,
                            background__hover_press__lineColour:style.item_backing__hover_press__lineColour,
                            background__hover_press__lineThickness:style.item_backing__hover_press__lineThickness,
                            background__hover_select__colour:style.item_backing__hover_select__colour,
                            background__hover_select__lineColour:style.item_backing__hover_select__lineColour,
                            background__hover_select__lineThickness:style.item_backing__hover_select__lineThickness,
                            background__hover_select_press__colour:style.item_backing__hover_select_press__colour,
                            background__hover_select_press__lineColour:style.item_backing__hover_select_press__lineColour,
                            background__hover_select_press__lineThickness:style.item_backing__hover_select_press__lineThickness,
                            background__hover_glow__colour:style.item_backing__hover_glow__colour,
                            background__hover_glow__lineColour:style.item_backing__hover_glow__lineColour,
                            background__hover_glow__lineThickness:style.item_backing__hover_glow__lineThickness,
                            background__hover_glow_press__colour:style.item_backing__hover_glow_press__colour,
                            background__hover_glow_press__lineColour:style.item_backing__hover_glow_press__lineColour,
                            background__hover_glow_press__lineThickness:style.item_backing__hover_glow_press__lineThickness,
                            background__hover_glow_select__colour:style.item_backing__hover_glow_select__colour,
                            background__hover_glow_select__lineColour:style.item_backing__hover_glow_select__lineColour,
                            background__hover_glow_select__lineThickness:style.item_backing__hover_glow_select__lineThickness,
                            background__hover_glow_select_press__colour:style.item_backing__hover_glow_select_press__colour,
                            background__hover_glow_select_press__lineColour:style.item_backing__hover_glow_select_press__lineColour,
                            background__hover_glow_select_press__lineThickness:style.item_backing__hover_glow_select_press__lineThickness,
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
                        vars.activedropdown = createDropdown(a,x)
                        object.append(vars.activedropdown);
                    } }(a,accWidth);
                    item.ondeselect = function(){ 
                        object.remove(vars.activedropdown); 
                        vars.activedropdown = undefined;
                    };
    
                    self.menubar.dropdowns[a].x = accWidth;
                    accWidth += self.menubar.dropdowns[a].width;
                }
            }
            produceBar();

    //control
        object.closeAllDropdowns = function(){
            if(vars.activedropdown != undefined){
                vars.activedropdown.onrelease();
            }
        };
        object.style = function(newStyle){
            if(newStyle==undefined){return style;}
            style = newStyle;
            produceBar();
        };

    //refresh
        object.refresh = function(){
            bar.width( _canvas_.control.viewport.width() );
            if(vars.activedropdown != undefined){ object.closeAllDropdowns(); }
        };
        object.refresh();
        object.heavyRefresh = function(){ produceBar(); };

    return object;
};

this.menubar.dropdowns = [];