this.list = function(
    name='list', 
    x, y, angle=0, interactable=true,
    list=[],

    active=true, multiSelect=false, hoverable=true, selectable=false, pressable=true,

    heightLimit=-1, widthLimit=-1,
    backgroundColour={r:230/255,g:230/255,b:230/255,a:1},
    backgroundMarkingColour={r:0.7,g:0.7,b:0.7,a:1},

    default_item_height=10, default_item_width=47.5,
    default_item_spacingHeight=3/4,
    default_item_horizontalPadding=2,

    default_text__text='Hello',
    default_text__font='defaultThin',
    default_text__fontSize=10/4,
    default_text__printingMode={widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
    default_text__spacing=1/10,
    default_text__interCharacterSpacing=0,

    default_text_colour__off=                                   {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__up=                                    {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__press=                                 {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__select=                                {r:1.0,g:0.2,b:0.2,a:1},
    default_text_colour__select_press=                          {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__glow=                                  {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__glow_press=                            {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__glow_select=                           {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__glow_select_press=                     {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__hover=                                 {r:1.0,g:0.2,b:1.0,a:1},
    default_text_colour__hover_press=                           {r:0.2,g:1.0,b:1.0,a:1},
    default_text_colour__hover_select=                          {r:0.2,g:1.0,b:0.2,a:1},
    default_text_colour__hover_select_press=                    {r:0.2,g:0.2,b:1.0,a:1},
    default_text_colour__hover_glow=                            {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__hover_glow_press=                      {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__hover_glow_select=                     {r:0.2,g:0.2,b:0.2,a:1},
    default_text_colour__hover_glow_select_press=               {r:0.2,g:0.2,b:0.2,a:1},

    default_item__off__colour=                               {r:180/255,g:180/255,b:180/255,a:1},
    default_item__off__lineColour=                           {r:0/255,g:0/255,b:0/255,a:0},
    default_item__off__lineThickness=                        0,
    default_item__up__colour=                                {r:200/255,g:200/255,b:200/255,a:1},
    default_item__up__lineColour=                            {r:0/255,g:0/255,b:0/255,a:0},
    default_item__up__lineThickness=                         0,
    default_item__press__colour=                             {r:230/255,g:230/255,b:230/255,a:1},
    default_item__press__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
    default_item__press__lineThickness=                      0,
    default_item__select__colour=                            {r:220/255,g:220/255,b:220/255,a:1},
    default_item__select__lineColour=                        {r:120/255,g:120/255,b:120/255,a:1},
    default_item__select__lineThickness=                     0,
    default_item__select_press__colour=                      {r:230/255,g:230/255,b:230/255,a:1},
    default_item__select_press__lineColour=                  {r:120/255,g:120/255,b:120/255,a:1},
    default_item__select_press__lineThickness=               0,
    default_item__glow__colour=                              {r:220/255,g:220/255,b:220/255,a:1},
    default_item__glow__lineColour=                          {r:0/255,g:0/255,b:0/255,a:0},
    default_item__glow__lineThickness=                       0,
    default_item__glow_press__colour=                        {r:250/255,g:250/255,b:250/255,a:1},
    default_item__glow_press__lineColour=                    {r:0/255,g:0/255,b:0/255,a:0},
    default_item__glow_press__lineThickness=                 0,
    default_item__glow_select__colour=                       {r:220/255,g:220/255,b:220/255,a:1},
    default_item__glow_select__lineColour=                   {r:120/255,g:120/255,b:120/255,a:1},
    default_item__glow_select__lineThickness=                0,
    default_item__glow_select_press__colour=                 {r:250/255,g:250/255,b:250/255,a:1},
    default_item__glow_select_press__lineColour=             {r:120/255,g:120/255,b:120/255,a:1},
    default_item__glow_select_press__lineThickness=          0,
    default_item__hover__colour=                             {r:220/255,g:220/255,b:220/255,a:1},
    default_item__hover__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
    default_item__hover__lineThickness=                      0,
    default_item__hover_press__colour=                       {r:240/255,g:240/255,b:240/255,a:1},
    default_item__hover_press__lineColour=                   {r:0/255,g:0/255,b:0/255,a:0},
    default_item__hover_press__lineThickness=                0,
    default_item__hover_select__colour=                      {r:220/255,g:220/255,b:220/255,a:1},
    default_item__hover_select__lineColour=                  {r:120/255,g:120/255,b:120/255,a:1},
    default_item__hover_select__lineThickness=               0,
    default_item__hover_select_press__colour=                {r:240/255,g:240/255,b:240/255,a:1},
    default_item__hover_select_press__lineColour=            {r:120/255,g:120/255,b:120/255,a:1},
    default_item__hover_select_press__lineThickness=         0,
    default_item__hover_glow__colour=                        {r:250/255,g:250/255,b:250/255,a:1},
    default_item__hover_glow__lineColour=                    {r:0/255,g:0/255,b:0/255,a:0},
    default_item__hover_glow__lineThickness=                 0,
    default_item__hover_glow_press__colour=                  {r:250/255,g:250/255,b:250/255,a:1},
    default_item__hover_glow_press__lineColour=              {r:0/255,g:0/255,b:0/255,a:0},
    default_item__hover_glow_press__lineThickness=           0,
    default_item__hover_glow_select__colour=                 {r:240/255,g:240/255,b:240/255,a:1},
    default_item__hover_glow_select__lineColour=             {r:120/255,g:120/255,b:120/255,a:1},
    default_item__hover_glow_select__lineThickness=          0,
    default_item__hover_glow_select_press__colour=           {r:250/255,g:250/255,b:250/255,a:1},
    default_item__hover_glow_select_press__lineColour=       {r:120/255,g:120/255,b:120/255,a:1},
    default_item__hover_glow_select_press__lineThickness=    0,

    subList_arrowMux=1,
    space_height=10/16,
    break_height=10/8,
    break_lineMux=1/5,
    textBreak_height=10/8,
    textBreak_textToLineSpacing=1,
    textBreak_textHeightMux=1.1,
    textBreak_lineMux=1/5,

    onenter=function(a){/*console.log('onenter >',a);*/},
    onleave=function(a){/*console.log('onleave >',a);*/},
    onpress=function(a){/*console.log('onpress >',a);*/},
    ondblpress=function(a){/*console.log('ondblpress >',a);*/},
    onrelease=function(a){/*console.log('onrelease >',a);*/},
    onselection=function(a){/*console.log('onselection >',a);*/},
    onpositionchange=function(a){/*console.log('onpositionchange >',a);*/},
){
    dev.log.partControl('.list(...)'); //#development

    //state
        let self = this;
        let itemArray = [];
        let calculatedListHeight = 0;
        const state = {
            position:0,
            lastNonShiftClicked:0,
            selectedItems:[],
        };

    //default style
        const style = {
            default:{
                heightLimit:heightLimit, widthLimit:widthLimit,
                backgroundColour:backgroundColour,
                backgroundMarkingColour:backgroundMarkingColour,

                height:default_item_height, width:default_item_width,

                itemSpacingHeight:default_item_spacingHeight,
                itemHorizontalPadding:default_item_horizontalPadding,

                text:default_text__text,
                font:default_text__font,
                fontSize:default_text__fontSize,
                printingMode:default_text__printingMode,
                spacing:default_text__spacing,
                interCharacterSpacing:default_text__interCharacterSpacing,

                text_colour__off:default_text_colour__off,
                text_colour__up:default_text_colour__up,
                text_colour__press:default_text_colour__press,
                text_colour__select:default_text_colour__select,
                text_colour__select_press:default_text_colour__select_press,
                text_colour__glow:default_text_colour__glow,
                text_colour__glow_press:default_text_colour__glow_press,
                text_colour__glow_select:default_text_colour__glow_select,
                text_colour__glow_select_press:default_text_colour__glow_select_press,
                text_colour__hover:default_text_colour__hover,
                text_colour__hover_press:default_text_colour__hover_press,
                text_colour__hover_select:default_text_colour__hover_select,
                text_colour__hover_select_press:default_text_colour__hover_select_press,
                text_colour__hover_glow:default_text_colour__hover_glow,
                text_colour__hover_glow_press:default_text_colour__hover_glow_press,
                text_colour__hover_glow_select:default_text_colour__hover_glow_select,
                text_colour__hover_glow_select_press:default_text_colour__hover_glow_select_press,

                item__off__colour:                            default_item__off__colour,
                item__off__lineColour:                        default_item__off__lineColour,
                item__off__lineThickness:                     default_item__off__lineThickness,
                item__up__colour:                             default_item__up__colour,
                item__up__lineColour:                         default_item__up__lineColour,
                item__up__lineThickness:                      default_item__up__lineThickness,
                item__press__colour:                          default_item__press__colour,
                item__press__lineColour:                      default_item__press__lineColour,
                item__press__lineThickness:                   default_item__press__lineThickness,
                item__select__colour:                         default_item__select__colour,
                item__select__lineColour:                     default_item__select__lineColour,
                item__select__lineThickness:                  default_item__select__lineThickness,
                item__select_press__colour:                   default_item__select_press__colour,
                item__select_press__lineColour:               default_item__select_press__lineColour,
                item__select_press__lineThickness:            default_item__select_press__lineThickness,
                item__glow__colour:                           default_item__glow__colour,
                item__glow__lineColour:                       default_item__glow__lineColour,
                item__glow__lineThickness:                    default_item__glow__lineThickness,
                item__glow_press__colour:                     default_item__glow_press__colour,
                item__glow_press__lineColour:                 default_item__glow_press__lineColour,
                item__glow_press__lineThickness:              default_item__glow_press__lineThickness,
                item__glow_select__colour:                    default_item__glow_select__colour,
                item__glow_select__lineColour:                default_item__glow_select__lineColour,
                item__glow_select__lineThickness:             default_item__glow_select__lineThickness,
                item__glow_select_press__colour:              default_item__glow_select_press__colour,
                item__glow_select_press__lineColour:          default_item__glow_select_press__lineColour,
                item__glow_select_press__lineThickness:       default_item__glow_select_press__lineThickness,
                item__hover__colour:                          default_item__hover__colour,
                item__hover__lineColour:                      default_item__hover__lineColour,
                item__hover__lineThickness:                   default_item__hover__lineThickness,
                item__hover_press__colour:                    default_item__hover_press__colour,
                item__hover_press__lineColour:                default_item__hover_press__lineColour,
                item__hover_press__lineThickness:             default_item__hover_press__lineThickness,
                item__hover_select__colour:                   default_item__hover_select__colour,
                item__hover_select__lineColour:               default_item__hover_select__lineColour,
                item__hover_select__lineThickness:            default_item__hover_select__lineThickness,
                item__hover_select_press__colour:             default_item__hover_select_press__colour,
                item__hover_select_press__lineColour:         default_item__hover_select_press__lineColour,
                item__hover_select_press__lineThickness:      default_item__hover_select_press__lineThickness,
                item__hover_glow__colour:                     default_item__hover_glow__colour,
                item__hover_glow__lineColour:                 default_item__hover_glow__lineColour,
                item__hover_glow__lineThickness:              default_item__hover_glow__lineThickness,
                item__hover_glow_press__colour:               default_item__hover_glow_press__colour,
                item__hover_glow_press__lineColour:           default_item__hover_glow_press__lineColour,
                item__hover_glow_press__lineThickness:        default_item__hover_glow_press__lineThickness,
                item__hover_glow_select__colour:              default_item__hover_glow_select__colour,
                item__hover_glow_select__lineColour:          default_item__hover_glow_select__lineColour,
                item__hover_glow_select__lineThickness:       default_item__hover_glow_select__lineThickness,
                item__hover_glow_select_press__colour:        default_item__hover_glow_select_press__colour,
                item__hover_glow_select_press__lineColour:    default_item__hover_glow_select_press__lineColour,
                item__hover_glow_select_press__lineThickness: default_item__hover_glow_select_press__lineThickness,
            },
            space:{
                height:space_height,
            },
            text:{},
            break:{
                height:break_height,
                lineMux:break_lineMux,
            },
            textbreak:{
                height:textBreak_height,
                textToLineSpacing:textBreak_textToLineSpacing,
                textHeightMux:textBreak_textHeightMux,
                lineMux:textBreak_lineMux,
            },
            checkbox:{},
            button:{},
            radio:{
                arrowMux:subList_arrowMux,
            },
            list:{
                heightLimit:-1,
                arrowMux:subList_arrowMux,
                space_height:space_height,
                break_height:break_height,
                break_lineMux:break_lineMux,
                textBreak_height:textBreak_height,
                textBreak_textToLineSpacing:textBreak_textToLineSpacing,
                textBreak_textHeightMux:textBreak_textHeightMux,
                textBreak_lineMux:textBreak_lineMux,
            },
        };
        
    //generate list content
        function generateListContent(listItems=[]){
            function def(i,t){ return i[t]==undefined ? (style[i.type][t]==undefined ? style.default[t] : style[i.type][t]) : i[t]; }

            const output = {elements:[], calculatedListHeight:0};
            const xOffset = style.default.widthLimit < 0 ? 0 : (style.default.widthLimit-style.default.width)/2;

            listItems.forEach((item,index) => {
                if(index != 0){output.calculatedListHeight += style.default.itemSpacingHeight;}

                if(item.type == 'item'){
                    console.warn('"item" item isn\'t an item type you can use for an item. Switching to "button" which is probably what you were looking for');
                    item.type = 'button';
                }

                let newItem;
                if(item.type == 'text'){
                    newItem = self.list.itemTypes.text(
                        index, xOffset, output.calculatedListHeight, def(item,'width'), def(item,'height'), def(item,'itemHorizontalPadding'),
                        (item.text?item.text:item.text_left), item.text_centre, item.text_right,
                        def(item,'fontSize'), def(item,'font'), def(item,'text_colour__up'), def(item,'spacing'),
                        def(item,'interCharacterSpacing'), def(item,'item__up__colour'),
                    );
                }else if(item.type == 'space'){
                    newItem = self.list.itemTypes.space(index, xOffset, output.calculatedListHeight, def(item,'height') );
                }else if(item.type == 'break'){
                    newItem = self.list.itemTypes.break(
                        index, xOffset, output.calculatedListHeight, def(item,'width'), 
                        def(item,'height'), def(item,'backgroundMarkingColour'), def(item,'lineMux')
                    );
                }else if(item.type == 'textbreak'){
                    newItem = self.list.itemTypes.textbreak(
                        index, xOffset, output.calculatedListHeight, def(item,'width'), def(item,'height'), item.text,
                        def(item,'backgroundMarkingColour'), def(item,'printingMode'), def(item,'font'), def(item,'spacing'),
                        def(item,'interCharacterSpacing'), def(item,'textToLineSpacing'), def(item,'textHeightMux'), def(item,'lineMux')
                    );
                }else if(item.type == 'checkbox'){
                    newItem = self.list.itemTypes.checkbox(
                        index, xOffset, output.calculatedListHeight, def(item,'width'), def(item,'height'), def(item,'itemHorizontalPadding'),
                        (item.text?item.text:item.text_left), item.text_centre, item.text_right,
                        def(item,'fontSize'), def(item,'font'), def(item,'spacing'), def(item,'interCharacterSpacing'),
                        item.active != undefined ? item.active : active, 
                        item.hoverable != undefined ? item.hoverable : hoverable, 
                        item.selectable != undefined ? item.selectable : selectable, 
                        item.pressable != undefined ? item.pressable : pressable, 

                        def(item,'text_colour__off'),
                        def(item,'text_colour__up'),
                        def(item,'text_colour__press'),
                        def(item,'text_colour__select'),
                        def(item,'text_colour__select_press'),
                        def(item,'text_colour__glow'),
                        def(item,'text_colour__glow_press'),
                        def(item,'text_colour__glow_select'),
                        def(item,'text_colour__glow_select_press'),
                        def(item,'text_colour__hover'),
                        def(item,'text_colour__hover_press'),
                        def(item,'text_colour__hover_select'),
                        def(item,'text_colour__hover_select_press'),
                        def(item,'text_colour__hover_glow'),
                        def(item,'text_colour__hover_glow_press'),
                        def(item,'text_colour__hover_glow_select'),
                        def(item,'text_colour__hover_glow_select_press'),

                        def(item,'item__off__colour'),
                        def(item,'item__off__lineColour'),
                        def(item,'item__off__lineThickness'),
                        def(item,'item__up__colour'),
                        def(item,'item__up__lineColour'),
                        def(item,'item__up__lineThickness'),
                        def(item,'item__press__colour'),
                        def(item,'item__press__lineColour'),
                        def(item,'item__press__lineThickness'),
                        def(item,'item__select__colour'),
                        def(item,'item__select__lineColour'),
                        def(item,'item__select__lineThickness'),
                        def(item,'item__select_press__colour'),
                        def(item,'item__select_press__lineColour'),
                        def(item,'item__select_press__lineThickness'),
                        def(item,'item__glow__colour'),
                        def(item,'item__glow__lineColour'),
                        def(item,'item__glow__lineThickness'),
                        def(item,'item__glow_press__colour'),
                        def(item,'item__glow_press__lineColour'),
                        def(item,'item__glow_press__lineThickness'),
                        def(item,'item__glow_select__colour'),
                        def(item,'item__glow_select__lineColour'),
                        def(item,'item__glow_select__lineThickness'),
                        def(item,'item__glow_select_press__colour'),
                        def(item,'item__glow_select_press__lineColour'),
                        def(item,'item__glow_select_press__lineThickness'),
                        def(item,'item__hover__colour'),
                        def(item,'item__hover__lineColour'),
                        def(item,'item__hover__lineThickness'),
                        def(item,'item__hover_press__colour'),
                        def(item,'item__hover_press__lineColour'),
                        def(item,'item__hover_press__lineThickness'),
                        def(item,'item__hover_select__colour'),
                        def(item,'item__hover_select__lineColour'),
                        def(item,'item__hover_select__lineThickness'),
                        def(item,'item__hover_select_press__colour'),
                        def(item,'item__hover_select_press__lineColour'),
                        def(item,'item__hover_select_press__lineThickness'),
                        def(item,'item__hover_glow__colour'),
                        def(item,'item__hover_glow__lineColour'),
                        def(item,'item__hover_glow__lineThickness'),
                        def(item,'item__hover_glow_press__colour'),
                        def(item,'item__hover_glow_press__lineColour'),
                        def(item,'item__hover_glow_press__lineThickness'),
                        def(item,'item__hover_glow_select__colour'),
                        def(item,'item__hover_glow_select__lineColour'),
                        def(item,'item__hover_glow_select__lineThickness'),
                        def(item,'item__hover_glow_select_press__colour'),
                        def(item,'item__hover_glow_select_press__lineColour'),
                        def(item,'item__hover_glow_select_press__lineThickness'),

                        item.updateFunction, item.onclickFunction,
                    );
                }else if(item.type == 'button'){
                    newItem = self.list.itemTypes.button(
                        index, xOffset, output.calculatedListHeight, def(item,'width'), def(item,'height'), def(item,'itemHorizontalPadding'),
                        (item.text?item.text:item.text_left), item.text_centre, item.text_right,
                        def(item,'fontSize'), def(item,'font'), def(item,'spacing'), def(item,'interCharacterSpacing'),
                        item.active != undefined ? item.active : active, 
                        item.hoverable != undefined ? item.hoverable : hoverable, 
                        item.selectable != undefined ? item.selectable : selectable, 
                        item.pressable != undefined ? item.pressable : pressable, 

                        def(item,'text_colour__off'),
                        def(item,'text_colour__up'),
                        def(item,'text_colour__press'),
                        def(item,'text_colour__select'),
                        def(item,'text_colour__select_press'),
                        def(item,'text_colour__glow'),
                        def(item,'text_colour__glow_press'),
                        def(item,'text_colour__glow_select'),
                        def(item,'text_colour__glow_select_press'),
                        def(item,'text_colour__hover'),
                        def(item,'text_colour__hover_press'),
                        def(item,'text_colour__hover_select'),
                        def(item,'text_colour__hover_select_press'),
                        def(item,'text_colour__hover_glow'),
                        def(item,'text_colour__hover_glow_press'),
                        def(item,'text_colour__hover_glow_select'),
                        def(item,'text_colour__hover_glow_select_press'),

                        def(item,'item__off__colour'),
                        def(item,'item__off__lineColour'),
                        def(item,'item__off__lineThickness'),
                        def(item,'item__up__colour'),
                        def(item,'item__up__lineColour'),
                        def(item,'item__up__lineThickness'),
                        def(item,'item__press__colour'),
                        def(item,'item__press__lineColour'),
                        def(item,'item__press__lineThickness'),
                        def(item,'item__select__colour'),
                        def(item,'item__select__lineColour'),
                        def(item,'item__select__lineThickness'),
                        def(item,'item__select_press__colour'),
                        def(item,'item__select_press__lineColour'),
                        def(item,'item__select_press__lineThickness'),
                        def(item,'item__glow__colour'),
                        def(item,'item__glow__lineColour'),
                        def(item,'item__glow__lineThickness'),
                        def(item,'item__glow_press__colour'),
                        def(item,'item__glow_press__lineColour'),
                        def(item,'item__glow_press__lineThickness'),
                        def(item,'item__glow_select__colour'),
                        def(item,'item__glow_select__lineColour'),
                        def(item,'item__glow_select__lineThickness'),
                        def(item,'item__glow_select_press__colour'),
                        def(item,'item__glow_select_press__lineColour'),
                        def(item,'item__glow_select_press__lineThickness'),
                        def(item,'item__hover__colour'),
                        def(item,'item__hover__lineColour'),
                        def(item,'item__hover__lineThickness'),
                        def(item,'item__hover_press__colour'),
                        def(item,'item__hover_press__lineColour'),
                        def(item,'item__hover_press__lineThickness'),
                        def(item,'item__hover_select__colour'),
                        def(item,'item__hover_select__lineColour'),
                        def(item,'item__hover_select__lineThickness'),
                        def(item,'item__hover_select_press__colour'),
                        def(item,'item__hover_select_press__lineColour'),
                        def(item,'item__hover_select_press__lineThickness'),
                        def(item,'item__hover_glow__colour'),
                        def(item,'item__hover_glow__lineColour'),
                        def(item,'item__hover_glow__lineThickness'),
                        def(item,'item__hover_glow_press__colour'),
                        def(item,'item__hover_glow_press__lineColour'),
                        def(item,'item__hover_glow_press__lineThickness'),
                        def(item,'item__hover_glow_select__colour'),
                        def(item,'item__hover_glow_select__lineColour'),
                        def(item,'item__hover_glow_select__lineThickness'),
                        def(item,'item__hover_glow_select_press__colour'),
                        def(item,'item__hover_glow_select_press__lineColour'),
                        def(item,'item__hover_glow_select_press__lineThickness'),

                        function(){ object.onenter([index]); },
                        function(){ object.onleave([index]); },
                        function(){ object.onpress([index]); },
                        function(){ object.ondblpress([index]); },
                        function(){ if(item.function){item.function();} object.onrelease([index]); },
                        function(obj,event){ object.select(index,true,event,false);} ,
                        function(obj,event){ object.select(index,false,event,false); },
                    );
                }else if(item.type == 'radio'){
                    newItem = self.list.itemTypes.radio(
                        subListGroup,
                        index, xOffset, output.calculatedListHeight,
                                            
                        //internal callbacks
                            function(isOpen){
                                if(!isOpen){return;}
                                itemArray.forEach((item,a) => { if(list[a].type == 'list' && a != index && item.isOpen){ item.close(); } });
                                return -state.position * (style.default.heightLimit > 0 && style.default.heightLimit < calculatedListHeight ? (calculatedListHeight-style.default.heightLimit) : calculatedListHeight);
                            },

                        //button
                            def(item,'width'), def(item,'height'), 
                    
                            def(item,'itemHorizontalPadding'),
                            (item.text?item.text:item.text_left), item.text_centre, item.text_right,
                            def(item,'fontSize'), def(item,'font'), def(item,'spacing'), def(item,'interCharacterSpacing'), def(item,'arrowMux'),
                            item.active != undefined ? item.active : active, 
                            item.hoverable != undefined ? item.hoverable : hoverable, 
                            item.pressable != undefined ? item.pressable : pressable, 

                            def(item,'text_colour__off'),
                            def(item,'text_colour__up'),
                            def(item,'text_colour__press'),
                            def(item,'text_colour__select'),
                            def(item,'text_colour__select_press'),
                            def(item,'text_colour__glow'),
                            def(item,'text_colour__glow_press'),
                            def(item,'text_colour__glow_select'),
                            def(item,'text_colour__glow_select_press'),
                            def(item,'text_colour__hover'),
                            def(item,'text_colour__hover_press'),
                            def(item,'text_colour__hover_select'),
                            def(item,'text_colour__hover_select_press'),
                            def(item,'text_colour__hover_glow'),
                            def(item,'text_colour__hover_glow_press'),
                            def(item,'text_colour__hover_glow_select'),
                            def(item,'text_colour__hover_glow_select_press'),
                    
                            def(item,'item__off__colour'),
                            def(item,'item__off__lineColour'),
                            def(item,'item__off__lineThickness'),
                            def(item,'item__up__colour'),
                            def(item,'item__up__lineColour'),
                            def(item,'item__up__lineThickness'),
                            def(item,'item__press__colour'),
                            def(item,'item__press__lineColour'),
                            def(item,'item__press__lineThickness'),
                            def(item,'item__select__colour'),
                            def(item,'item__select__lineColour'),
                            def(item,'item__select__lineThickness'),
                            def(item,'item__select_press__colour'),
                            def(item,'item__select_press__lineColour'),
                            def(item,'item__select_press__lineThickness'),
                            def(item,'item__glow__colour'),
                            def(item,'item__glow__lineColour'),
                            def(item,'item__glow__lineThickness'),
                            def(item,'item__glow_press__colour'),
                            def(item,'item__glow_press__lineColour'),
                            def(item,'item__glow_press__lineThickness'),
                            def(item,'item__glow_select__colour'),
                            def(item,'item__glow_select__lineColour'),
                            def(item,'item__glow_select__lineThickness'),
                            def(item,'item__glow_select_press__colour'),
                            def(item,'item__glow_select_press__lineColour'),
                            def(item,'item__glow_select_press__lineThickness'),
                            def(item,'item__hover__colour'),
                            def(item,'item__hover__lineColour'),
                            def(item,'item__hover__lineThickness'),
                            def(item,'item__hover_press__colour'),
                            def(item,'item__hover_press__lineColour'),
                            def(item,'item__hover_press__lineThickness'),
                            def(item,'item__hover_select__colour'),
                            def(item,'item__hover_select__lineColour'),
                            def(item,'item__hover_select__lineThickness'),
                            def(item,'item__hover_select_press__colour'),
                            def(item,'item__hover_select_press__lineColour'),
                            def(item,'item__hover_select_press__lineThickness'),
                            def(item,'item__hover_glow__colour'),
                            def(item,'item__hover_glow__lineColour'),
                            def(item,'item__hover_glow__lineThickness'),
                            def(item,'item__hover_glow_press__colour'),
                            def(item,'item__hover_glow_press__lineColour'),
                            def(item,'item__hover_glow_press__lineThickness'),
                            def(item,'item__hover_glow_select__colour'),
                            def(item,'item__hover_glow_select__lineColour'),
                            def(item,'item__hover_glow_select__lineThickness'),
                            def(item,'item__hover_glow_select_press__colour'),
                            def(item,'item__hover_glow_select_press__lineColour'),
                            def(item,'item__hover_glow_select_press__lineThickness'),
                    
                        //sub list
                            item.options,
                    
                            item.itemWidth,
                            def(item,'heightLimit'),
                            def(item,'widthLimit'),
                            def(item,'backgroundColour'),
                            def(item,'backgroundMarkingColour'),
                    
                            def(item,'default_item_spacingHeight'),

                            item.updateFunction, item.onclickFunction,
                    );
                }else if(item.type == 'list'){
                    newItem = self.list.itemTypes.list(
                        subListGroup,
                        index, xOffset, output.calculatedListHeight,
                    
                        //internal callbacks
                            function(isOpen){
                                if(!isOpen){return;}
                                itemArray.forEach((item,a) => { if(list[a].type == 'list' && a != index && item.isOpen){ item.close(); } });
                                return -state.position * (style.default.heightLimit > 0 && style.default.heightLimit < calculatedListHeight ? (calculatedListHeight-style.default.heightLimit) : calculatedListHeight);
                            },
                        
                        //button
                            def(item,'width'), def(item,'height'), 
                    
                            def(item,'itemHorizontalPadding'),
                            (item.text?item.text:item.text_left), item.text_centre, item.text_right,
                            def(item,'fontSize'), def(item,'font'), def(item,'spacing'), def(item,'interCharacterSpacing'), def(item,'arrowMux'),
                            item.active != undefined ? item.active : active, 
                            item.hoverable != undefined ? item.hoverable : hoverable, 
                            item.pressable != undefined ? item.pressable : pressable, 

                            def(item,'text_colour__off'),
                            def(item,'text_colour__up'),
                            def(item,'text_colour__press'),
                            def(item,'text_colour__select'),
                            def(item,'text_colour__select_press'),
                            def(item,'text_colour__glow'),
                            def(item,'text_colour__glow_press'),
                            def(item,'text_colour__glow_select'),
                            def(item,'text_colour__glow_select_press'),
                            def(item,'text_colour__hover'),
                            def(item,'text_colour__hover_press'),
                            def(item,'text_colour__hover_select'),
                            def(item,'text_colour__hover_select_press'),
                            def(item,'text_colour__hover_glow'),
                            def(item,'text_colour__hover_glow_press'),
                            def(item,'text_colour__hover_glow_select'),
                            def(item,'text_colour__hover_glow_select_press'),
                    
                            def(item,'item__off__colour'),
                            def(item,'item__off__lineColour'),
                            def(item,'item__off__lineThickness'),
                            def(item,'item__up__colour'),
                            def(item,'item__up__lineColour'),
                            def(item,'item__up__lineThickness'),
                            def(item,'item__press__colour'),
                            def(item,'item__press__lineColour'),
                            def(item,'item__press__lineThickness'),
                            def(item,'item__select__colour'),
                            def(item,'item__select__lineColour'),
                            def(item,'item__select__lineThickness'),
                            def(item,'item__select_press__colour'),
                            def(item,'item__select_press__lineColour'),
                            def(item,'item__select_press__lineThickness'),
                            def(item,'item__glow__colour'),
                            def(item,'item__glow__lineColour'),
                            def(item,'item__glow__lineThickness'),
                            def(item,'item__glow_press__colour'),
                            def(item,'item__glow_press__lineColour'),
                            def(item,'item__glow_press__lineThickness'),
                            def(item,'item__glow_select__colour'),
                            def(item,'item__glow_select__lineColour'),
                            def(item,'item__glow_select__lineThickness'),
                            def(item,'item__glow_select_press__colour'),
                            def(item,'item__glow_select_press__lineColour'),
                            def(item,'item__glow_select_press__lineThickness'),
                            def(item,'item__hover__colour'),
                            def(item,'item__hover__lineColour'),
                            def(item,'item__hover__lineThickness'),
                            def(item,'item__hover_press__colour'),
                            def(item,'item__hover_press__lineColour'),
                            def(item,'item__hover_press__lineThickness'),
                            def(item,'item__hover_select__colour'),
                            def(item,'item__hover_select__lineColour'),
                            def(item,'item__hover_select__lineThickness'),
                            def(item,'item__hover_select_press__colour'),
                            def(item,'item__hover_select_press__lineColour'),
                            def(item,'item__hover_select_press__lineThickness'),
                            def(item,'item__hover_glow__colour'),
                            def(item,'item__hover_glow__lineColour'),
                            def(item,'item__hover_glow__lineThickness'),
                            def(item,'item__hover_glow_press__colour'),
                            def(item,'item__hover_glow_press__lineColour'),
                            def(item,'item__hover_glow_press__lineThickness'),
                            def(item,'item__hover_glow_select__colour'),
                            def(item,'item__hover_glow_select__lineColour'),
                            def(item,'item__hover_glow_select__lineThickness'),
                            def(item,'item__hover_glow_select_press__colour'),
                            def(item,'item__hover_glow_select_press__lineColour'),
                            def(item,'item__hover_glow_select_press__lineThickness'),
                    
                        //sub list
                            item.list,
                            item.interactable,
                    
                            item.itemWidth,
                            def(item,'heightLimit'),
                            def(item,'widthLimit'),
                            def(item,'backgroundColour'),
                            def(item,'backgroundMarkingColour'),
                    
                            def(item,'default_item_spacingHeight'),
                    
                            def(item,'space_height'),
                            def(item,'break_height'),
                            def(item,'break_lineMux'),
                            def(item,'textBreak_height'),
                            def(item,'textBreak_textToLineSpacing'),
                            def(item,'textBreak_textHeightMux'),
                            def(item,'textBreak_lineMux'),
                    
                            item.onenter,
                            item.onleave,
                            item.onpress,
                            item.ondblpress,
                            item.onrelease,
                            item.onselection,
                            item.onpositionchange,
                    );
                }else{ //unknown item
                    output.calculatedListHeight -= style.default.itemSpacingHeight;
                    console.warn('interface part "list" :: error : unknown list item type:',item);
                    return;
                }

                output.elements.push(newItem.item);
                output.calculatedListHeight += newItem.height;
            });

            return output;
        }

    //refreshing function
        function refresh(){
            itemArray = [];
            calculatedListHeight = 0;
            state.selectedItems = [];
            state.lastNonShiftClicked = 0;
            state.position = 0;
            
            results = generateListContent(list);
            calculatedListHeight = results.calculatedListHeight;
            itemArray = results.elements;

            const widthToUse = style.default.widthLimit < 0 ? style.default.width : style.default.widthLimit;
            backing.width(widthToUse);
            cover.width(widthToUse);
            stencil.width(widthToUse);

            const heightToUse = style.default.heightLimit < 0 || style.default.heightLimit > calculatedListHeight ? calculatedListHeight : style.default.heightLimit;
            backing.height(heightToUse);
            cover.height(heightToUse);
            stencil.height(heightToUse);

            itemCollection.clear();
            results.elements.forEach(element => itemCollection.append(element));
        }

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
            //backing
                const backing = interfacePart.builder('basic','rectangle','backing',{colour:style.default.backgroundColour});
                object.append(backing);
            //stenciled group
                const stenciledGroup = interfacePart.builder('basic','group','stenciledGroup');
                object.append(stenciledGroup);
            //sub list group
                const subListGroup = interfacePart.builder('basic','group','subListGroup');
                object.append(subListGroup);
            //item collection
                const itemCollection = interfacePart.builder('basic','group','itemCollection');
                stenciledGroup.append(itemCollection);
            //cover
                const cover = interfacePart.builder('basic','rectangle','cover',{colour:{r:0,g:0,b:0,a:0}});
                stenciledGroup.append(cover);
            //stencil
                const stencil = interfacePart.builder('basic','rectangle','stencil');
                stenciledGroup.stencil(stencil);
                stenciledGroup.clipActive(true);

    //interaction
        cover.attachCallback('onwheel', function(x,y,event){
            if(!interactable || !active){return;}
            const move = -event.wheelDelta/100;
            object.position( object.position() + move/10 );
            itemArray.forEach(item => {
                if(item.forceMouseLeave != undefined){
                    item.forceMouseLeave();
                }
            });
        } );

    //controls
        object.position = function(a,update=true){
            if(a == undefined){return state.position;}
            a = a < 0 ? 0 : a;
            a = a > 1 ? 1 : a;
            state.position = a;

            if(style.default.heightLimit < 0){return;}
            const movementSpace = calculatedListHeight - style.default.heightLimit;
            itemCollection.y( -a*movementSpace );
            
            if(update&&this.onpositionchange){this.onpositionchange(a);}
        };
        object.select = function(a,value,event,update=true){
            if(!selectable){return;}

                if(!multiSelect){
                //where multi selection is not allowed
                    //where we want to select an item, which is not already selected
                        if(value && !state.selectedItems.includes(a) ){
                            //deselect all other items
                                while( state.selectedItems.length > 0 ){
                                    itemCollection.getChildren()[state.selectedItems[0]].select(false,undefined,undefined);
                                    state.selectedItems.shift();
                                }

                            //select current item
                                state.selectedItems.push(a);

                    //where we want to deselect an item that is selected
                        }else if(!value && state.selectedItems.includes(a)){
                            state.selectedItems = [];
                        }

                //do not update the item itself, in the case that it was the item that sent this command
                //(which would cause a little loop)
                    if(update){ itemCollection.getChildByName(a).select(true,undefined,false); }
                }else{
                //where multi selection is allowed
                    //where range-selection is to be done
                        if( event != undefined && event.shiftKey ){
                            //gather top and bottom item
                            //(first gather the range positions overall, then compute those positions to indexes on the itemArray)
                                a = itemCollection.getChildIndexByName(a);

                                let min = Math.min(state.lastNonShiftClicked, a);
                                let max = Math.max(state.lastNonShiftClicked, a);
                                for(let b = 0; b < itemArray.length; b++){
                                    if( itemArray[b].name == ''+min ){min = b;}
                                    if( itemArray[b].name == ''+max ){max = b;}
                                }

                            //deselect all outside the range
                                state.selectedItems = [];
                                for(let b = 0; b < itemArray.length; b++){
                                    if( b > max || b < min ){
                                        if( itemArray[b].select != undefined && itemArray[b].select() ){
                                            itemArray[b].select(false,undefined,false);
                                        }
                                    }
                                }

                            //select those within the range (that aren't already selected)
                                for(let b = min; b <= max; b++){
                                    if( itemArray[b].select != undefined && !itemArray[b].select() ){
                                        itemArray[b].select(true,undefined,false);
                                        state.selectedItems.push(b);
                                    }
                                }
                    //where range-selection is not to be done
                        }else{
                            if(update){ itemArray[a].select(value); }
                            if(value && !state.selectedItems.includes(a) ){ state.selectedItems.push(a); }
                            else if(!value && state.selectedItems.includes(a)){ state.selectedItems.splice( state.selectedItems.indexOf(a), 1 ); }
                            state.lastNonShiftClicked = itemCollection.getChildIndexByName(a);
                        }
                }

            object.onselection(state.selectedItems);
        };
        object.add = function(item){
            list.push(item);
            refresh();
        };
        object.getList = function(){
            return itemArray;
        };
        object.remove = function(a){
            list.splice(a,1);
            refresh();
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
            refresh();
        };
        object.heightLimit = function(value){
            if(value==undefined){return style.default.heightLimit;}
            style.default.heightLimit = value;
            refresh();
        };
        object.closeAllLists = function(){
            list.forEach((item,index) => {
                if(item.type != 'list'){return;}
                itemArray[index].close();
            });
        };

    //info
        object.getCalculatedListHeight = function(){return calculatedListHeight;};

    //callbacks
        object.onenter = onenter;
        object.onleave = onleave;
        object.onpress = onpress;
        object.ondblpress = ondblpress;
        object.onrelease = onrelease;
        object.onselection = onselection;
        object.onpositionchange = onpositionchange;

    refresh();

    return object;
};
this.list.itemTypes = {};
this.list.itemTypes.space = function( index, x, y, height ){
    dev.log.partControl('.list.itemTypes.space(...)'); //#development

    const newItem = interfacePart.builder('basic','group',index+'_space',{x:x,y:y});
    return {item:newItem,height:height};
};
this.list.itemTypes.break = function( index, x, y, width, height, colour, lineMux){
    dev.log.partControl('.list.itemTypes.break(...)'); //#development

    const newItem = interfacePart.builder('basic','group',index+'_break',{x:x,y:y});
    const rectangle = interfacePart.builder('basic', 'rectangle', 'rectangle', { y:(height-height*lineMux)/2, width:width, height:height*lineMux, colour:colour });
    newItem.append(rectangle);

    return {item:newItem,height:height};
};
this.list.itemTypes.textbreak = function( index, x, y, width, height, text, fontColour, printingMode, font, spacing, interCharacterSpacing, textToLineSpacing, textHeightMux, lineMux ){
    dev.log.partControl('.list.itemTypes.textbreak(...)'); //#development

    const newItem = interfacePart.builder('basic','group',index+'_textbreak',{x:x,y:y});
    const rectangle = interfacePart.builder('basic', 'rectangle', 'rectangle', { y:(height-height*lineMux)/2, width:width, height:height*lineMux, colour:fontColour });
    newItem.append(rectangle);
    const textElement = interfacePart.builder('basic','text', 'text', {
        y:height/2, width:height*textHeightMux, height:height*textHeightMux, 
        printingMode:printingMode,
        text:text, font:font, colour:fontColour, spacing:spacing, 
        interCharacterSpacing:interCharacterSpacing
    });
    textElement.attachCallback('onFontUpdateCallback', function(){
        rectangle.x( textElement.resultingWidth() + textToLineSpacing );
        rectangle.width( width - textElement.resultingWidth() - textToLineSpacing );
    } );
    newItem.append(textElement);

    return {item:newItem,height:height};
}
this.list.itemTypes.text = function( 
    index, x, y, width, height, itemHorizontalPadding,
    text_left, text_centre, text_right,
    size, font, fontColour, spacing, interCharacterSpacing, itemColour
){
    dev.log.partControl('.list.itemTypes.text(...)'); //#development

    const newItem = interfacePart.builder('basic','group',index+'_text',{x:x,y:y});
    const backing = interfacePart.builder('basic','rectangle','backing',{ width:width, height:height, colour:itemColour });
    newItem.append(backing);

    if(text_left != undefined){
        const text = interfacePart.builder('basic','text', 'text_left', {
            x:itemHorizontalPadding, y:height/2, width:size, height:size, 
            printingMode:{widthCalculation:'absolute', horizontal:'left', vertical:'middle'},
            text:text_left, font:font, colour:fontColour, spacing:spacing, 
            interCharacterSpacing:interCharacterSpacing
        });
        newItem.append(text);
    }
    if(text_centre != undefined){
        const text = interfacePart.builder('basic','text', 'text_centre', {
            x:width/2, y:height/2, width:size, height:size, 
            printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
            text:text_centre, font:font, colour:fontColour, spacing:spacing, 
            interCharacterSpacing:interCharacterSpacing
        });
        newItem.append(text);
    }
    if(text_right != undefined){
        const text = interfacePart.builder('basic','text', 'text_right', {
            x:width-itemHorizontalPadding, y:height/2, width:size, height:size, 
            printingMode:{widthCalculation:'absolute', horizontal:'right', vertical:'middle'},
            text:text_right, font:font, colour:fontColour, spacing:spacing, 
            interCharacterSpacing:interCharacterSpacing
        });
        newItem.append(text);
    }

    return {item:newItem,height:height};
};
this.list.itemTypes.checkbox = function( 
    index, x, y, width, height, itemHorizontalPadding,
    text_left, text_centre, text_right,
    fontSize, font, spacing, interCharacterSpacing,
    active, hoverable, selectable, pressable, 

    text_colour__off,
    text_colour__up,
    text_colour__press,
    text_colour__select,
    text_colour__select_press,
    text_colour__glow,
    text_colour__glow_press,
    text_colour__glow_select,
    text_colour__glow_select_press,
    text_colour__hover,
    text_colour__hover_press,
    text_colour__hover_select,
    text_colour__hover_select_press,
    text_colour__hover_glow,
    text_colour__hover_glow_press,
    text_colour__hover_glow_select,
    text_colour__hover_glow_select_press,

    item__off__colour,
    item__off__lineColour,
    item__off__lineThickness,
    item__up__colour,
    item__up__lineColour,
    item__up__lineThickness,
    item__press__colour,
    item__press__lineColour,
    item__press__lineThickness,
    item__select__colour,
    item__select__lineColour,
    item__select__lineThickness,
    item__select_press__colour,
    item__select_press__lineColour,
    item__select_press__lineThickness,
    item__glow__colour,
    item__glow__lineColour,
    item__glow__lineThickness,
    item__glow_press__colour,
    item__glow_press__lineColour,
    item__glow_press__lineThickness,
    item__glow_select__colour,
    item__glow_select__lineColour,
    item__glow_select__lineThickness,
    item__glow_select_press__colour,
    item__glow_select_press__lineColour,
    item__glow_select_press__lineThickness,
    item__hover__colour,
    item__hover__lineColour,
    item__hover__lineThickness,
    item__hover_press__colour,
    item__hover_press__lineColour,
    item__hover_press__lineThickness,
    item__hover_select__colour,
    item__hover_select__lineColour,
    item__hover_select__lineThickness,
    item__hover_select_press__colour,
    item__hover_select_press__lineColour,
    item__hover_select_press__lineThickness,
    item__hover_glow__colour,
    item__hover_glow__lineColour,
    item__hover_glow__lineThickness,
    item__hover_glow_press__colour,
    item__hover_glow_press__lineColour,
    item__hover_glow_press__lineThickness,
    item__hover_glow_select__colour,
    item__hover_glow_select__lineColour,
    item__hover_glow_select__lineThickness,
    item__hover_glow_select_press__colour,
    item__hover_glow_select_press__lineColour,
    item__hover_glow_select_press__lineThickness,

    updateFunction, onclickFunction,
){
    dev.log.partControl('.list.itemTypes.checkbox(...)'); //#development

    const newItem = interfacePart.builder('basic','group',index+'_checkbox',{x:x,y:y});
        newItem.state = false;
    const button = interfacePart.builder('control', 'button_rectangle', 'button', {
        width:width, height:height,
        text_left:text_left,
        text_centre:text_centre,
        text_right:text_right,

        textVerticalOffsetMux:0.5, textHorizontalOffsetMux:itemHorizontalPadding/width,
        active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

        style:{
            text_font:font,
            text_size:fontSize,
            text_spacing:spacing,
            text_interCharacterSpacing:interCharacterSpacing,

            text__off__colour:                                  text_colour__off,
            text__up__colour:                                   text_colour__up,
            text__press__colour:                                text_colour__press,
            text__select__colour:                               text_colour__select,
            text__select_press__colour:                         text_colour__select_press,
            text__glow__colour:                                 text_colour__glow,
            text__glow_press__colour:                           text_colour__glow_press,
            text__glow_select__colour:                          text_colour__glow_select,
            text__glow_select_press__colour:                    text_colour__glow_select_press,
            text__hover__colour:                                text_colour__hover,
            text__hover_press__colour:                          text_colour__hover_press,
            text__hover_select__colour:                         text_colour__hover_select,
            text__hover_select_press__colour:                   text_colour__hover_select_press,
            text__hover_glow__colour:                           text_colour__hover_glow,
            text__hover_glow_press__colour:                     text_colour__hover_glow_press,
            text__hover_glow_select__colour:                    text_colour__hover_glow_select,
            text__hover_glow_select_press__colour:              text_colour__hover_glow_select_press,

            background__off__colour:                            item__off__colour,
            background__off__lineColour:                        item__off__lineColour,
            background__off__lineThickness:                     item__off__lineThickness,
            background__up__colour:                             item__up__colour,
            background__up__lineColour:                         item__up__lineColour,
            background__up__lineThickness:                      item__up__lineThickness,
            background__press__colour:                          item__press__colour,
            background__press__lineColour:                      item__press__lineColour,
            background__press__lineThickness:                   item__press__lineThickness,
            background__select__colour:                         item__select__colour,
            background__select__lineColour:                     item__select__lineColour,
            background__select__lineThickness:                  item__select__lineThickness,
            background__select_press__colour:                   item__select_press__colour,
            background__select_press__lineColour:               item__select_press__lineColour,
            background__select_press__lineThickness:            item__select_press__lineThickness,
            background__glow__colour:                           item__glow__colour,
            background__glow__lineColour:                       item__glow__lineColour,
            background__glow__lineThickness:                    item__glow__lineThickness,
            background__glow_press__colour:                     item__glow_press__colour,
            background__glow_press__lineColour:                 item__glow_press__lineColour,
            background__glow_press__lineThickness:              item__glow_press__lineThickness,
            background__glow_select__colour:                    item__glow_select__colour,
            background__glow_select__lineColour:                item__glow_select__lineColour,
            background__glow_select__lineThickness:             item__glow_select__lineThickness,
            background__glow_select_press__colour:              item__glow_select_press__colour,
            background__glow_select_press__lineColour:          item__glow_select_press__lineColour,
            background__glow_select_press__lineThickness:       item__glow_select_press__lineThickness,
            background__hover__colour:                          item__hover__colour,
            background__hover__lineColour:                      item__hover__lineColour,
            background__hover__lineThickness:                   item__hover__lineThickness,
            background__hover_press__colour:                    item__hover_press__colour,
            background__hover_press__lineColour:                item__hover_press__lineColour,
            background__hover_press__lineThickness:             item__hover_press__lineThickness,
            background__hover_select__colour:                   item__hover_select__colour,
            background__hover_select__lineColour:               item__hover_select__lineColour,
            background__hover_select__lineThickness:            item__hover_select__lineThickness,
            background__hover_select_press__colour:             item__hover_select_press__colour,
            background__hover_select_press__lineColour:         item__hover_select_press__lineColour,
            background__hover_select_press__lineThickness:      item__hover_select_press__lineThickness,
            background__hover_glow__colour:                     item__hover_glow__colour,
            background__hover_glow__lineColour:                 item__hover_glow__lineColour,
            background__hover_glow__lineThickness:              item__hover_glow__lineThickness,
            background__hover_glow_press__colour:               item__hover_glow_press__colour,
            background__hover_glow_press__lineColour:           item__hover_glow_press__lineColour,
            background__hover_glow_press__lineThickness:        item__hover_glow_press__lineThickness,
            background__hover_glow_select__colour:              item__hover_glow_select__colour,
            background__hover_glow_select__lineColour:          item__hover_glow_select__lineColour,
            background__hover_glow_select__lineThickness:       item__hover_glow_select__lineThickness,
            background__hover_glow_select_press__colour:        item__hover_glow_select_press__colour,
            background__hover_glow_select_press__lineColour:    item__hover_glow_select_press__lineColour,
            background__hover_glow_select_press__lineThickness: item__hover_glow_select_press__lineThickness,
        },
    });
    newItem.append(button);
    const tick = interfacePart.builder('basic', 'circle', 'tick', {
        x:width-height/2, y:height/2, radius:height/4, colour:{r:0,g:0,b:0,a:0},
    });
    newItem.append(tick);
        const tickState = { hovering:false, glowing:false, selected:false, pressed:false };
        function updateTickColour(){
            if(!newItem.state){ tick.colour({r:0,g:0,b:0,a:0}); return; }
            if(!active){ tick.colour(text_colour__off); return; }

            const styles = [
                text_colour__up,
                text_colour__press,
                text_colour__select,
                text_colour__select_press,
                text_colour__glow,
                text_colour__glow_press,
                text_colour__glow_select,
                text_colour__glow_select_press,
                text_colour__hover,
                text_colour__hover_press,
                text_colour__hover_select,
                text_colour__hover_select_press,
                text_colour__hover_glow,
                text_colour__hover_glow_press,
                text_colour__hover_glow_select,
                text_colour__hover_glow_select_press,
            ];

            if(!hoverable && tickState.hovering ){ tickState.hovering = false; }
            if(!selectable && tickState.selected ){ tickState.selected = false; }

            const i = tickState.hovering*8 + tickState.glowing*4 + tickState.selected*2 + (pressable && tickState.pressed)*1;
            tick.colour(styles[i]);
        } updateTickColour();
        button.onenter = function(){tickState.hovering = true; updateTickColour();};
        button.onleave = function(){tickState.hovering = false; updateTickColour();};
        button.onpress = function(){tickState.pressed = true; updateTickColour();};
        button.onrelease = function(){tickState.pressed = false; updateTickColour();};
        button.onselect = function(){tickState.selected = true; updateTickColour();};
        button.ondeselect = function(){tickState.selected = false; updateTickColour();};

    newItem.set = function(state){
        newItem.state = state;
        updateTickColour();
        // tick.colour = newItem.state ? text_colour__hover : {r:0,g:0,b:0,a:0};
    };

    button.onpressrelease = function(){
        newItem.set(!newItem.state);
        if(onclickFunction){onclickFunction(newItem.state);}
    };

    if(updateFunction != undefined){
        try{ newItem.set(updateFunction()); }catch(error){ console.warn('control::list:"'+name+'":error : "updateFunction" returns error for '+index+'_checkbox'); console.warn(error); }
    }

    return {item:newItem,height:height};
};
this.list.itemTypes.button = function(
    index, x, y, width, height, itemHorizontalPadding, 
    text_left, text_centre, text_right,
    fontSize, font, spacing, interCharacterSpacing,
    active, hoverable, selectable, pressable,

    text__off__colour,
    text__up__colour,
    text__press__colour,
    text__select__colour,
    text__select_press__colour,
    text__glow__colour,
    text__glow_press__colour,
    text__glow_select__colour,
    text__glow_select_press__colour,
    text__hover__colour,
    text__hover_press__colour,
    text__hover_select__colour,
    text__hover_select_press__colour,
    text__hover_glow__colour,
    text__hover_glow_press__colour,
    text__hover_glow_select__colour,
    text__hover_glow_select_press__colour,

    item__off__colour,
    item__off__lineColour,
    item__off__lineThickness,
    item__up__colour,
    item__up__lineColour,
    item__up__lineThickness,
    item__press__colour,
    item__press__lineColour,
    item__press__lineThickness,
    item__select__colour,
    item__select__lineColour,
    item__select__lineThickness,
    item__select_press__colour,
    item__select_press__lineColour,
    item__select_press__lineThickness,
    item__glow__colour,
    item__glow__lineColour,
    item__glow__lineThickness,
    item__glow_press__colour,
    item__glow_press__lineColour,
    item__glow_press__lineThickness,
    item__glow_select__colour,
    item__glow_select__lineColour,
    item__glow_select__lineThickness,
    item__glow_select_press__colour,
    item__glow_select_press__lineColour,
    item__glow_select_press__lineThickness,
    item__hover__colour,
    item__hover__lineColour,
    item__hover__lineThickness,
    item__hover_press__colour,
    item__hover_press__lineColour,
    item__hover_press__lineThickness,
    item__hover_select__colour,
    item__hover_select__lineColour,
    item__hover_select__lineThickness,
    item__hover_select_press__colour,
    item__hover_select_press__lineColour,
    item__hover_select_press__lineThickness,
    item__hover_glow__colour,
    item__hover_glow__lineColour,
    item__hover_glow__lineThickness,
    item__hover_glow_press__colour,
    item__hover_glow_press__lineColour,
    item__hover_glow_press__lineThickness,
    item__hover_glow_select__colour,
    item__hover_glow_select__lineColour,
    item__hover_glow_select__lineThickness,
    item__hover_glow_select_press__colour,
    item__hover_glow_select_press__lineColour,
    item__hover_glow_select_press__lineThickness,

    onenter,
    onleave,
    onpress,
    ondblpress,
    onrelease,
    onselect,
    ondeselect,
){
    dev.log.partControl('.list.itemTypes.button(...)'); //#development

    const button_rectangle = interfacePart.builder('control', 'button_rectangle', index+'_button', {
        x:x,y:y,
        width:width, height:height,
        text_left:text_left,
        text_centre:text_centre,
        text_right:text_right,

        textVerticalOffsetMux:0.5, textHorizontalOffsetMux:itemHorizontalPadding/width,
        active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

        style:{
            text_font:font,
            text_size:fontSize,
            text_spacing:spacing,
            text_interCharacterSpacing:interCharacterSpacing,

            text__off__colour:                                  text__off__colour,
            text__up__colour:                                   text__up__colour,
            text__press__colour:                                text__press__colour,
            text__select__colour:                               text__select__colour,
            text__select_press__colour:                         text__select_press__colour,
            text__glow__colour:                                 text__glow__colour,
            text__glow_press__colour:                           text__glow_press__colour,
            text__glow_select__colour:                          text__glow_select__colour,
            text__glow_select_press__colour:                    text__glow_select_press__colour,
            text__hover__colour:                                text__hover__colour,
            text__hover_press__colour:                          text__hover_press__colour,
            text__hover_select__colour:                         text__hover_select__colour,
            text__hover_select_press__colour:                   text__hover_select_press__colour,
            text__hover_glow__colour:                           text__hover_glow__colour,
            text__hover_glow_press__colour:                     text__hover_glow_press__colour,
            text__hover_glow_select__colour:                    text__hover_glow_select__colour,
            text__hover_glow_select_press__colour:              text__hover_glow_select_press__colour,

            background__off__colour:                            item__off__colour,
            background__off__lineColour:                        item__off__lineColour,
            background__off__lineThickness:                     item__off__lineThickness,
            background__up__colour:                             item__up__colour,
            background__up__lineColour:                         item__up__lineColour,
            background__up__lineThickness:                      item__up__lineThickness,
            background__press__colour:                          item__press__colour,
            background__press__lineColour:                      item__press__lineColour,
            background__press__lineThickness:                   item__press__lineThickness,
            background__select__colour:                         item__select__colour,
            background__select__lineColour:                     item__select__lineColour,
            background__select__lineThickness:                  item__select__lineThickness,
            background__select_press__colour:                   item__select_press__colour,
            background__select_press__lineColour:               item__select_press__lineColour,
            background__select_press__lineThickness:            item__select_press__lineThickness,
            background__glow__colour:                           item__glow__colour,
            background__glow__lineColour:                       item__glow__lineColour,
            background__glow__lineThickness:                    item__glow__lineThickness,
            background__glow_press__colour:                     item__glow_press__colour,
            background__glow_press__lineColour:                 item__glow_press__lineColour,
            background__glow_press__lineThickness:              item__glow_press__lineThickness,
            background__glow_select__colour:                    item__glow_select__colour,
            background__glow_select__lineColour:                item__glow_select__lineColour,
            background__glow_select__lineThickness:             item__glow_select__lineThickness,
            background__glow_select_press__colour:              item__glow_select_press__colour,
            background__glow_select_press__lineColour:          item__glow_select_press__lineColour,
            background__glow_select_press__lineThickness:       item__glow_select_press__lineThickness,
            background__hover__colour:                          item__hover__colour,
            background__hover__lineColour:                      item__hover__lineColour,
            background__hover__lineThickness:                   item__hover__lineThickness,
            background__hover_press__colour:                    item__hover_press__colour,
            background__hover_press__lineColour:                item__hover_press__lineColour,
            background__hover_press__lineThickness:             item__hover_press__lineThickness,
            background__hover_select__colour:                   item__hover_select__colour,
            background__hover_select__lineColour:               item__hover_select__lineColour,
            background__hover_select__lineThickness:            item__hover_select__lineThickness,
            background__hover_select_press__colour:             item__hover_select_press__colour,
            background__hover_select_press__lineColour:         item__hover_select_press__lineColour,
            background__hover_select_press__lineThickness:      item__hover_select_press__lineThickness,
            background__hover_glow__colour:                     item__hover_glow__colour,
            background__hover_glow__lineColour:                 item__hover_glow__lineColour,
            background__hover_glow__lineThickness:              item__hover_glow__lineThickness,
            background__hover_glow_press__colour:               item__hover_glow_press__colour,
            background__hover_glow_press__lineColour:           item__hover_glow_press__lineColour,
            background__hover_glow_press__lineThickness:        item__hover_glow_press__lineThickness,
            background__hover_glow_select__colour:              item__hover_glow_select__colour,
            background__hover_glow_select__lineColour:          item__hover_glow_select__lineColour,
            background__hover_glow_select__lineThickness:       item__hover_glow_select__lineThickness,
            background__hover_glow_select_press__colour:        item__hover_glow_select_press__colour,
            background__hover_glow_select_press__lineColour:    item__hover_glow_select_press__lineColour,
            background__hover_glow_select_press__lineThickness: item__hover_glow_select_press__lineThickness,
        },

        onenter:onenter,
        onleave:onleave,
        onpress:onpress,
        ondblpress:ondblpress,
        onrelease:onrelease,
        onselect:onselect,
        ondeselect:ondeselect,
    });

    return {item:button_rectangle,height:height};
};
this.list.itemTypes.radio = function(
    subListGroup,
    index, x, y, 

    //interal callbacks
        buttonClick,
    
    //button
        width, height,

        itemHorizontalPadding, 
        text_left, text_centre, text_right,
        fontSize, font, spacing, interCharacterSpacing, arrowMux,
        active, hoverable, pressable,

        text_colour__off,
        text_colour__up,
        text_colour__press,
        text_colour__select,
        text_colour__select_press,
        text_colour__glow,
        text_colour__glow_press,
        text_colour__glow_select,
        text_colour__glow_select_press,
        text_colour__hover,
        text_colour__hover_press,
        text_colour__hover_select,
        text_colour__hover_select_press,
        text_colour__hover_glow,
        text_colour__hover_glow_press,
        text_colour__hover_glow_select,
        text_colour__hover_glow_select_press,

        item__off__colour,
        item__off__lineColour,
        item__off__lineThickness,
        item__up__colour,
        item__up__lineColour,
        item__up__lineThickness,
        item__press__colour,
        item__press__lineColour,
        item__press__lineThickness,
        item__select__colour,
        item__select__lineColour,
        item__select__lineThickness,
        item__select_press__colour,
        item__select_press__lineColour,
        item__select_press__lineThickness,
        item__glow__colour,
        item__glow__lineColour,
        item__glow__lineThickness,
        item__glow_press__colour,
        item__glow_press__lineColour,
        item__glow_press__lineThickness,
        item__glow_select__colour,
        item__glow_select__lineColour,
        item__glow_select__lineThickness,
        item__glow_select_press__colour,
        item__glow_select_press__lineColour,
        item__glow_select_press__lineThickness,
        item__hover__colour,
        item__hover__lineColour,
        item__hover__lineThickness,
        item__hover_press__colour,
        item__hover_press__lineColour,
        item__hover_press__lineThickness,
        item__hover_select__colour,
        item__hover_select__lineColour,
        item__hover_select__lineThickness,
        item__hover_select_press__colour,
        item__hover_select_press__lineColour,
        item__hover_select_press__lineThickness,
        item__hover_glow__colour,
        item__hover_glow__lineColour,
        item__hover_glow__lineThickness,
        item__hover_glow_press__colour,
        item__hover_glow_press__lineColour,
        item__hover_glow_press__lineThickness,
        item__hover_glow_select__colour,
        item__hover_glow_select__lineColour,
        item__hover_glow_select__lineThickness,
        item__hover_glow_select_press__colour,
        item__hover_glow_select_press__lineColour,
        item__hover_glow_select_press__lineThickness,

    //sub list
        options, 

        itemWidth,
        heightLimit,
        widthLimit,
        backgroundColour,
        backgroundMarkingColour,

        default_item_spacingHeight,

        updateFunction, onclickFunction,
){
    dev.log.partControl('.list.itemTypes.radio(...)'); //#development

    const newItem = interfacePart.builder('basic','group',index+'_list',{x:x,y:y});
    const button = interfacePart.builder('control', 'button_rectangle', 'button', {
        width:width, height:height,
        text_left:text_left,
        text_centre:text_centre,
        text_right:text_right,

        textVerticalOffsetMux:0.5, textHorizontalOffsetMux:itemHorizontalPadding/width,
        active:active, hoverable:hoverable, selectable:true, pressable:pressable,

        style:{
            text_font:font,
            text_size:fontSize,
            text_spacing:spacing,
            text_interCharacterSpacing:interCharacterSpacing,

            text__off__colour:                                  text_colour__off,
            text__up__colour:                                   text_colour__up,
            text__press__colour:                                text_colour__press,
            text__select__colour:                               text_colour__select,
            text__select_press__colour:                         text_colour__select_press,
            text__glow__colour:                                 text_colour__glow,
            text__glow_press__colour:                           text_colour__glow_press,
            text__glow_select__colour:                          text_colour__glow_select,
            text__glow_select_press__colour:                    text_colour__glow_select_press,
            text__hover__colour:                                text_colour__hover,
            text__hover_press__colour:                          text_colour__hover_press,
            text__hover_select__colour:                         text_colour__hover_select,
            text__hover_select_press__colour:                   text_colour__hover_select_press,
            text__hover_glow__colour:                           text_colour__hover_glow,
            text__hover_glow_press__colour:                     text_colour__hover_glow_press,
            text__hover_glow_select__colour:                    text_colour__hover_glow_select,
            text__hover_glow_select_press__colour:              text_colour__hover_glow_select_press,

            background__off__colour:                            item__off__colour,
            background__off__lineColour:                        item__off__lineColour,
            background__off__lineThickness:                     item__off__lineThickness,
            background__up__colour:                             item__up__colour,
            background__up__lineColour:                         item__up__lineColour,
            background__up__lineThickness:                      item__up__lineThickness,
            background__press__colour:                          item__press__colour,
            background__press__lineColour:                      item__press__lineColour,
            background__press__lineThickness:                   item__press__lineThickness,
            background__select__colour:                         item__select__colour,
            background__select__lineColour:                     item__select__lineColour,
            background__select__lineThickness:                  item__select__lineThickness,
            background__select_press__colour:                   item__select_press__colour,
            background__select_press__lineColour:               item__select_press__lineColour,
            background__select_press__lineThickness:            item__select_press__lineThickness,
            background__glow__colour:                           item__glow__colour,
            background__glow__lineColour:                       item__glow__lineColour,
            background__glow__lineThickness:                    item__glow__lineThickness,
            background__glow_press__colour:                     item__glow_press__colour,
            background__glow_press__lineColour:                 item__glow_press__lineColour,
            background__glow_press__lineThickness:              item__glow_press__lineThickness,
            background__glow_select__colour:                    item__glow_select__colour,
            background__glow_select__lineColour:                item__glow_select__lineColour,
            background__glow_select__lineThickness:             item__glow_select__lineThickness,
            background__glow_select_press__colour:              item__glow_select_press__colour,
            background__glow_select_press__lineColour:          item__glow_select_press__lineColour,
            background__glow_select_press__lineThickness:       item__glow_select_press__lineThickness,
            background__hover__colour:                          item__hover__colour,
            background__hover__lineColour:                      item__hover__lineColour,
            background__hover__lineThickness:                   item__hover__lineThickness,
            background__hover_press__colour:                    item__hover_press__colour,
            background__hover_press__lineColour:                item__hover_press__lineColour,
            background__hover_press__lineThickness:             item__hover_press__lineThickness,
            background__hover_select__colour:                   item__hover_select__colour,
            background__hover_select__lineColour:               item__hover_select__lineColour,
            background__hover_select__lineThickness:            item__hover_select__lineThickness,
            background__hover_select_press__colour:             item__hover_select_press__colour,
            background__hover_select_press__lineColour:         item__hover_select_press__lineColour,
            background__hover_select_press__lineThickness:      item__hover_select_press__lineThickness,
            background__hover_glow__colour:                     item__hover_glow__colour,
            background__hover_glow__lineColour:                 item__hover_glow__lineColour,
            background__hover_glow__lineThickness:              item__hover_glow__lineThickness,
            background__hover_glow_press__colour:               item__hover_glow_press__colour,
            background__hover_glow_press__lineColour:           item__hover_glow_press__lineColour,
            background__hover_glow_press__lineThickness:        item__hover_glow_press__lineThickness,
            background__hover_glow_select__colour:              item__hover_glow_select__colour,
            background__hover_glow_select__lineColour:          item__hover_glow_select__lineColour,
            background__hover_glow_select__lineThickness:       item__hover_glow_select__lineThickness,
            background__hover_glow_select_press__colour:        item__hover_glow_select_press__colour,
            background__hover_glow_select_press__lineColour:    item__hover_glow_select_press__lineColour,
            background__hover_glow_select_press__lineThickness: item__hover_glow_select_press__lineThickness,
        },
    });
    newItem.append(button);
    const arrow = interfacePart.builder('basic', 'polygon', 'arrow', {
        pointsAsXYArray:[
            {x:width-fontSize*arrowMux-itemHorizontalPadding,y:(height-fontSize*arrowMux)/2}, 
            {x:width-fontSize*arrowMux-itemHorizontalPadding,y:(height+fontSize*arrowMux)/2}, 
            {x:width-itemHorizontalPadding,y:height/2}
        ],
        colour:text_colour__up,
    });
    newItem.append(arrow);
        const arrowState = { hovering:false, glowing:false, selected:false, pressed:false };
        function updateArrowColour(){
            if(!active){ arrow.colour(text_colour__off); return; }

            const styles = [
                text_colour__up,
                text_colour__press,
                text_colour__select,
                text_colour__select_press,
                text_colour__glow,
                text_colour__glow_press,
                text_colour__glow_select,
                text_colour__glow_select_press,
                text_colour__hover,
                text_colour__hover_press,
                text_colour__hover_select,
                text_colour__hover_select_press,
                text_colour__hover_glow,
                text_colour__hover_glow_press,
                text_colour__hover_glow_select,
                text_colour__hover_glow_select_press,
            ];

            if(!hoverable && arrowState.hovering ){ arrowState.hovering = false; }

            const i = arrowState.hovering*8 + arrowState.glowing*4 + arrowState.selected*2 + (pressable && arrowState.pressed)*1;
            arrow.colour(styles[i]);
        } updateArrowColour();
        button.onenter = function(){arrowState.hovering = true; updateArrowColour();};
        button.onleave = function(){arrowState.hovering = false; updateArrowColour();};
        button.onpress = function(){arrowState.pressed = true; updateArrowColour();};
        button.onrelease = function(){arrowState.pressed = false; updateArrowColour();};

    let sublist;

    function selectOption(number){
        sublist.getChildByName('stenciledGroup').getChildByName('itemCollection').getChildren().forEach((checkbox,index) => {
            if(number == index){return;}
            checkbox.set(false);
        });
        if(onclickFunction){onclickFunction(number);}
    }

    newItem.open = function(yOffset){
        if(this.isOpen){return;}
        this.isOpen = true;
        button.select(true);

        const list = options.map((option,index) => {
            return {
                type:'checkbox',
                text:option,
                onclickFunction:function(val){
                    if(!val){
                        sublist.getChildByName('stenciledGroup').getChildByName('itemCollection').getChildren()[index].set(true);
                    }
                    selectOption(index);
                },
            };
        });

        sublist = interfacePart.builder('control', 'list', 'list', {
            x:x+width, y:y+yOffset, list:list,

            heightLimit:heightLimit,
            widthLimit:widthLimit,
            backgroundColour:backgroundColour,
            backgroundMarkingColour:backgroundMarkingColour,
        
            default_item_height:height,
            default_item_width:itemWidth!=undefined?itemWidth:width,
            default_item_spacingHeight:default_item_spacingHeight,
            default_item_horizontalPadding:itemHorizontalPadding,
        
            default_text__text:text_left,
            default_text__font:font,
            default_text__fontSize:fontSize,
            default_text__printingMode:undefined,
            default_text__spacing:spacing,
            default_text__interCharacterSpacing:interCharacterSpacing,

            default_text_colour__off:text_colour__off,
            default_text_colour__up:text_colour__up,
            default_text_colour__press:text_colour__press,
            default_text_colour__select:text_colour__select,
            default_text_colour__select_press:text_colour__select_press,
            default_text_colour__glow:text_colour__glow,
            default_text_colour__glow_press:text_colour__glow_press,
            default_text_colour__glow_select:text_colour__glow_select,
            default_text_colour__glow_select_press:text_colour__glow_select_press,
            default_text_colour__hover:text_colour__hover,
            default_text_colour__hover_press:text_colour__hover_press,
            default_text_colour__hover_select:text_colour__hover_select,
            default_text_colour__hover_select_press:text_colour__hover_select_press,
            default_text_colour__hover_glow:text_colour__hover_glow,
            default_text_colour__hover_glow_press:text_colour__hover_glow_press,
            default_text_colour__hover_glow_select:text_colour__hover_glow_select,
            default_text_colour__hover_glow_select_press:text_colour__hover_glow_select_press,
      
            default_item__off__colour:item__off__colour,
            default_item__off__lineColour:item__off__lineColour,
            default_item__off__lineThickness:item__off__lineThickness,
            default_item__up__colour:item__up__colour,
            default_item__up__lineColour:item__up__lineColour,
            default_item__up__lineThickness:item__up__lineThickness,
            default_item__press__colour:item__press__colour,
            default_item__press__lineColour:item__press__lineColour,
            default_item__press__lineThickness:item__press__lineThickness,
            default_item__select__colour:item__select__colour,
            default_item__select__lineColour:item__select__lineColour,
            default_item__select__lineThickness:item__select__lineThickness,
            default_item__select_press__colour:item__select_press__colour,
            default_item__select_press__lineColour:item__select_press__lineColour,
            default_item__select_press__lineThickness:item__select_press__lineThickness,
            default_item__glow__colour:item__glow__colour,
            default_item__glow__lineColour:item__glow__lineColour,
            default_item__glow__lineThickness:item__glow__lineThickness,
            default_item__glow_press__colour:item__glow_press__colour,
            default_item__glow_press__lineColour:item__glow_press__lineColour,
            default_item__glow_press__lineThickness:item__glow_press__lineThickness,
            default_item__glow_select__colour:item__glow_select__colour,
            default_item__glow_select__lineColour:item__glow_select__lineColour,
            default_item__glow_select__lineThickness:item__glow_select__lineThickness,
            default_item__glow_select_press__colour:item__glow_select_press__colour,
            default_item__glow_select_press__lineColour:item__glow_select_press__lineColour,
            default_item__glow_select_press__lineThickness:item__glow_select_press__lineThickness,
            default_item__hover__colour:item__hover__colour,
            default_item__hover__lineColour:item__hover__lineColour,
            default_item__hover__lineThickness:item__hover__lineThickness,
            default_item__hover_press__colour:item__hover_press__colour,
            default_item__hover_press__lineColour:item__hover_press__lineColour,
            default_item__hover_press__lineThickness:item__hover_press__lineThickness,
            default_item__hover_select__colour:item__hover_select__colour,
            default_item__hover_select__lineColour:item__hover_select__lineColour,
            default_item__hover_select__lineThickness:item__hover_select__lineThickness,
            default_item__hover_select_press__colour:item__hover_select_press__colour,
            default_item__hover_select_press__lineColour:item__hover_select_press__lineColour,
            default_item__hover_select_press__lineThickness:item__hover_select_press__lineThickness,
            default_item__hover_glow__colour:item__hover_glow__colour,
            default_item__hover_glow__lineColour:item__hover_glow__lineColour,
            default_item__hover_glow__lineThickness:item__hover_glow__lineThickness,
            default_item__hover_glow_press__colour:item__hover_glow_press__colour,
            default_item__hover_glow_press__lineColour:item__hover_glow_press__lineColour,
            default_item__hover_glow_press__lineThickness:item__hover_glow_press__lineThickness,
            default_item__hover_glow_select__colour:item__hover_glow_select__colour,
            default_item__hover_glow_select__lineColour:item__hover_glow_select__lineColour,
            default_item__hover_glow_select__lineThickness:item__hover_glow_select__lineThickness,
            default_item__hover_glow_select_press__colour:item__hover_glow_select_press__colour,
            default_item__hover_glow_select_press__lineColour:item__hover_glow_select_press__lineColour,
            default_item__hover_glow_select_press__lineThickness:item__hover_glow_select_press__lineThickness,
        });
        subListGroup.append(sublist);

        if( updateFunction ){
            sublist.getChildByName('stenciledGroup').getChildByName('itemCollection').getChildren()[updateFunction()].set(true);
        }else{
            sublist.getChildByName('stenciledGroup').getChildByName('itemCollection').getChildren()[0].set(true);
        }
    };
    newItem.close = function(){
        if(!this.isOpen){return;}
        this.isOpen = false;
        button.select(false);

        subListGroup.remove(sublist);
    };

    button.onselect = function(){
        const yOffset = buttonClick(true);
        newItem.open(yOffset);
        arrowState.selected = true; 
        updateArrowColour();
    };
    button.ondeselect = function(){
        buttonClick(false);
        newItem.close();
        arrowState.selected = false; 
        updateArrowColour();
    };

    return {item:newItem,height:height};
};
this.list.itemTypes.list = function(
    subListGroup,
    index, x, y, 

    //interal callbacks
        buttonClick,
    
    //button
        width, height,

        itemHorizontalPadding, 
        text_left, text_centre, text_right,
        fontSize, font, spacing, interCharacterSpacing, arrowMux,
        active, hoverable, pressable,

        text_colour__off,
        text_colour__up,
        text_colour__press,
        text_colour__select,
        text_colour__select_press,
        text_colour__glow,
        text_colour__glow_press,
        text_colour__glow_select,
        text_colour__glow_select_press,
        text_colour__hover,
        text_colour__hover_press,
        text_colour__hover_select,
        text_colour__hover_select_press,
        text_colour__hover_glow,
        text_colour__hover_glow_press,
        text_colour__hover_glow_select,
        text_colour__hover_glow_select_press,

        item__off__colour,
        item__off__lineColour,
        item__off__lineThickness,
        item__up__colour,
        item__up__lineColour,
        item__up__lineThickness,
        item__press__colour,
        item__press__lineColour,
        item__press__lineThickness,
        item__select__colour,
        item__select__lineColour,
        item__select__lineThickness,
        item__select_press__colour,
        item__select_press__lineColour,
        item__select_press__lineThickness,
        item__glow__colour,
        item__glow__lineColour,
        item__glow__lineThickness,
        item__glow_press__colour,
        item__glow_press__lineColour,
        item__glow_press__lineThickness,
        item__glow_select__colour,
        item__glow_select__lineColour,
        item__glow_select__lineThickness,
        item__glow_select_press__colour,
        item__glow_select_press__lineColour,
        item__glow_select_press__lineThickness,
        item__hover__colour,
        item__hover__lineColour,
        item__hover__lineThickness,
        item__hover_press__colour,
        item__hover_press__lineColour,
        item__hover_press__lineThickness,
        item__hover_select__colour,
        item__hover_select__lineColour,
        item__hover_select__lineThickness,
        item__hover_select_press__colour,
        item__hover_select_press__lineColour,
        item__hover_select_press__lineThickness,
        item__hover_glow__colour,
        item__hover_glow__lineColour,
        item__hover_glow__lineThickness,
        item__hover_glow_press__colour,
        item__hover_glow_press__lineColour,
        item__hover_glow_press__lineThickness,
        item__hover_glow_select__colour,
        item__hover_glow_select__lineColour,
        item__hover_glow_select__lineThickness,
        item__hover_glow_select_press__colour,
        item__hover_glow_select_press__lineColour,
        item__hover_glow_select_press__lineThickness,

    //sub list
        list, 
        interactable,

        itemWidth,
        heightLimit,
        widthLimit,
        backgroundColour,
        backgroundMarkingColour,

        default_item_spacingHeight,

        space_height,
        break_height,
        break_lineMux,
        textBreak_height,
        textBreak_textToLineSpacing,
        textBreak_textHeightMux,
        textBreak_lineMux,

        onenter,
        onleave,
        onpress,
        ondblpress,
        onrelease,
        onselection,
        onpositionchange,
){
    dev.log.partControl('.list.itemTypes.list(...)'); //#development

    const newItem = interfacePart.builder('basic','group',index+'_list',{x:x,y:y});
    const button = interfacePart.builder('control', 'button_rectangle', 'button', {
        width:width, height:height,
        text_left:text_left,
        text_centre:text_centre,
        text_right:text_right,

        textVerticalOffsetMux:0.5, textHorizontalOffsetMux:itemHorizontalPadding/width,
        active:active, hoverable:hoverable, selectable:true, pressable:pressable,

        style:{
            text_font:font,
            text_size:fontSize,
            text_spacing:spacing,
            text_interCharacterSpacing:interCharacterSpacing,

            text__off__colour:                                  text_colour__off,
            text__up__colour:                                   text_colour__up,
            text__press__colour:                                text_colour__press,
            text__select__colour:                               text_colour__select,
            text__select_press__colour:                         text_colour__select_press,
            text__glow__colour:                                 text_colour__glow,
            text__glow_press__colour:                           text_colour__glow_press,
            text__glow_select__colour:                          text_colour__glow_select,
            text__glow_select_press__colour:                    text_colour__glow_select_press,
            text__hover__colour:                                text_colour__hover,
            text__hover_press__colour:                          text_colour__hover_press,
            text__hover_select__colour:                         text_colour__hover_select,
            text__hover_select_press__colour:                   text_colour__hover_select_press,
            text__hover_glow__colour:                           text_colour__hover_glow,
            text__hover_glow_press__colour:                     text_colour__hover_glow_press,
            text__hover_glow_select__colour:                    text_colour__hover_glow_select,
            text__hover_glow_select_press__colour:              text_colour__hover_glow_select_press,

            background__off__colour:                            item__off__colour,
            background__off__lineColour:                        item__off__lineColour,
            background__off__lineThickness:                     item__off__lineThickness,
            background__up__colour:                             item__up__colour,
            background__up__lineColour:                         item__up__lineColour,
            background__up__lineThickness:                      item__up__lineThickness,
            background__press__colour:                          item__press__colour,
            background__press__lineColour:                      item__press__lineColour,
            background__press__lineThickness:                   item__press__lineThickness,
            background__select__colour:                         item__select__colour,
            background__select__lineColour:                     item__select__lineColour,
            background__select__lineThickness:                  item__select__lineThickness,
            background__select_press__colour:                   item__select_press__colour,
            background__select_press__lineColour:               item__select_press__lineColour,
            background__select_press__lineThickness:            item__select_press__lineThickness,
            background__glow__colour:                           item__glow__colour,
            background__glow__lineColour:                       item__glow__lineColour,
            background__glow__lineThickness:                    item__glow__lineThickness,
            background__glow_press__colour:                     item__glow_press__colour,
            background__glow_press__lineColour:                 item__glow_press__lineColour,
            background__glow_press__lineThickness:              item__glow_press__lineThickness,
            background__glow_select__colour:                    item__glow_select__colour,
            background__glow_select__lineColour:                item__glow_select__lineColour,
            background__glow_select__lineThickness:             item__glow_select__lineThickness,
            background__glow_select_press__colour:              item__glow_select_press__colour,
            background__glow_select_press__lineColour:          item__glow_select_press__lineColour,
            background__glow_select_press__lineThickness:       item__glow_select_press__lineThickness,
            background__hover__colour:                          item__hover__colour,
            background__hover__lineColour:                      item__hover__lineColour,
            background__hover__lineThickness:                   item__hover__lineThickness,
            background__hover_press__colour:                    item__hover_press__colour,
            background__hover_press__lineColour:                item__hover_press__lineColour,
            background__hover_press__lineThickness:             item__hover_press__lineThickness,
            background__hover_select__colour:                   item__hover_select__colour,
            background__hover_select__lineColour:               item__hover_select__lineColour,
            background__hover_select__lineThickness:            item__hover_select__lineThickness,
            background__hover_select_press__colour:             item__hover_select_press__colour,
            background__hover_select_press__lineColour:         item__hover_select_press__lineColour,
            background__hover_select_press__lineThickness:      item__hover_select_press__lineThickness,
            background__hover_glow__colour:                     item__hover_glow__colour,
            background__hover_glow__lineColour:                 item__hover_glow__lineColour,
            background__hover_glow__lineThickness:              item__hover_glow__lineThickness,
            background__hover_glow_press__colour:               item__hover_glow_press__colour,
            background__hover_glow_press__lineColour:           item__hover_glow_press__lineColour,
            background__hover_glow_press__lineThickness:        item__hover_glow_press__lineThickness,
            background__hover_glow_select__colour:              item__hover_glow_select__colour,
            background__hover_glow_select__lineColour:          item__hover_glow_select__lineColour,
            background__hover_glow_select__lineThickness:       item__hover_glow_select__lineThickness,
            background__hover_glow_select_press__colour:        item__hover_glow_select_press__colour,
            background__hover_glow_select_press__lineColour:    item__hover_glow_select_press__lineColour,
            background__hover_glow_select_press__lineThickness: item__hover_glow_select_press__lineThickness,
        },
    });
    newItem.append(button);
    const arrow = interfacePart.builder('basic', 'polygon', 'arrow', {
        pointsAsXYArray:[ 
            {x:width-fontSize*arrowMux-itemHorizontalPadding,y:(height-fontSize*arrowMux)/2}, 
            {x:width-fontSize*arrowMux-itemHorizontalPadding,y:(height+fontSize*arrowMux)/2}, 
            {x:width-itemHorizontalPadding,y:height/2}
        ],
        colour:text_colour__up,
    });
    newItem.append(arrow);
        const arrowState = { hovering:false, glowing:false, selected:false, pressed:false };
        function updateArrowColour(){
            if(!active){ arrow.colour(text_colour__off); return; }

            const styles = [
                text_colour__up,
                text_colour__press,
                text_colour__select,
                text_colour__select_press,
                text_colour__glow,
                text_colour__glow_press,
                text_colour__glow_select,
                text_colour__glow_select_press,
                text_colour__hover,
                text_colour__hover_press,
                text_colour__hover_select,
                text_colour__hover_select_press,
                text_colour__hover_glow,
                text_colour__hover_glow_press,
                text_colour__hover_glow_select,
                text_colour__hover_glow_select_press,
            ];

            if(!hoverable && arrowState.hovering ){ arrowState.hovering = false; }

            const i = arrowState.hovering*8 + arrowState.glowing*4 + arrowState.selected*2 + (pressable && arrowState.pressed)*1;
            arrow.colour(styles[i]);
        } updateArrowColour();
        button.onenter = function(){arrowState.hovering = true; updateArrowColour();};
        button.onleave = function(){arrowState.hovering = false; updateArrowColour();};
        button.onpress = function(){arrowState.pressed = true; updateArrowColour();};
        button.onrelease = function(){arrowState.pressed = false; updateArrowColour();};

    let sublist;

    newItem.open = function(yOffset){
        if(this.isOpen){return;}
        this.isOpen = true;
        button.select(true);

        sublist = interfacePart.builder('control', 'list', 'list', {
            x:x+width, y:y+yOffset, interactable:interactable, list:list,

            heightLimit:heightLimit,
            widthLimit:widthLimit,
            backgroundColour:backgroundColour,
            backgroundMarkingColour:backgroundMarkingColour,
        
            default_item_height:height,
            default_item_width:itemWidth!=undefined?itemWidth:width,
            default_item_spacingHeight:default_item_spacingHeight,
            default_item_horizontalPadding:itemHorizontalPadding,
        
            default_text__text:text_left,
            default_text__font:font,
            default_text__fontSize:fontSize,
            default_text__printingMode:undefined,
            default_text__spacing:spacing,
            default_text__interCharacterSpacing:interCharacterSpacing,

            default_text_colour__off:text_colour__off,
            default_text_colour__up:text_colour__up,
            default_text_colour__press:text_colour__press,
            default_text_colour__select:text_colour__select,
            default_text_colour__select_press:text_colour__select_press,
            default_text_colour__glow:text_colour__glow,
            default_text_colour__glow_press:text_colour__glow_press,
            default_text_colour__glow_select:text_colour__glow_select,
            default_text_colour__glow_select_press:text_colour__glow_select_press,
            default_text_colour__hover:text_colour__hover,
            default_text_colour__hover_press:text_colour__hover_press,
            default_text_colour__hover_select:text_colour__hover_select,
            default_text_colour__hover_select_press:text_colour__hover_select_press,
            default_text_colour__hover_glow:text_colour__hover_glow,
            default_text_colour__hover_glow_press:text_colour__hover_glow_press,
            default_text_colour__hover_glow_select:text_colour__hover_glow_select,
            default_text_colour__hover_glow_select_press:text_colour__hover_glow_select_press,
      
            default_item__off__colour:item__off__colour,
            default_item__off__lineColour:item__off__lineColour,
            default_item__off__lineThickness:item__off__lineThickness,
            default_item__up__colour:item__up__colour,
            default_item__up__lineColour:item__up__lineColour,
            default_item__up__lineThickness:item__up__lineThickness,
            default_item__press__colour:item__press__colour,
            default_item__press__lineColour:item__press__lineColour,
            default_item__press__lineThickness:item__press__lineThickness,
            default_item__select__colour:item__select__colour,
            default_item__select__lineColour:item__select__lineColour,
            default_item__select__lineThickness:item__select__lineThickness,
            default_item__select_press__colour:item__select_press__colour,
            default_item__select_press__lineColour:item__select_press__lineColour,
            default_item__select_press__lineThickness:item__select_press__lineThickness,
            default_item__glow__colour:item__glow__colour,
            default_item__glow__lineColour:item__glow__lineColour,
            default_item__glow__lineThickness:item__glow__lineThickness,
            default_item__glow_press__colour:item__glow_press__colour,
            default_item__glow_press__lineColour:item__glow_press__lineColour,
            default_item__glow_press__lineThickness:item__glow_press__lineThickness,
            default_item__glow_select__colour:item__glow_select__colour,
            default_item__glow_select__lineColour:item__glow_select__lineColour,
            default_item__glow_select__lineThickness:item__glow_select__lineThickness,
            default_item__glow_select_press__colour:item__glow_select_press__colour,
            default_item__glow_select_press__lineColour:item__glow_select_press__lineColour,
            default_item__glow_select_press__lineThickness:item__glow_select_press__lineThickness,
            default_item__hover__colour:item__hover__colour,
            default_item__hover__lineColour:item__hover__lineColour,
            default_item__hover__lineThickness:item__hover__lineThickness,
            default_item__hover_press__colour:item__hover_press__colour,
            default_item__hover_press__lineColour:item__hover_press__lineColour,
            default_item__hover_press__lineThickness:item__hover_press__lineThickness,
            default_item__hover_select__colour:item__hover_select__colour,
            default_item__hover_select__lineColour:item__hover_select__lineColour,
            default_item__hover_select__lineThickness:item__hover_select__lineThickness,
            default_item__hover_select_press__colour:item__hover_select_press__colour,
            default_item__hover_select_press__lineColour:item__hover_select_press__lineColour,
            default_item__hover_select_press__lineThickness:item__hover_select_press__lineThickness,
            default_item__hover_glow__colour:item__hover_glow__colour,
            default_item__hover_glow__lineColour:item__hover_glow__lineColour,
            default_item__hover_glow__lineThickness:item__hover_glow__lineThickness,
            default_item__hover_glow_press__colour:item__hover_glow_press__colour,
            default_item__hover_glow_press__lineColour:item__hover_glow_press__lineColour,
            default_item__hover_glow_press__lineThickness:item__hover_glow_press__lineThickness,
            default_item__hover_glow_select__colour:item__hover_glow_select__colour,
            default_item__hover_glow_select__lineColour:item__hover_glow_select__lineColour,
            default_item__hover_glow_select__lineThickness:item__hover_glow_select__lineThickness,
            default_item__hover_glow_select_press__colour:item__hover_glow_select_press__colour,
            default_item__hover_glow_select_press__lineColour:item__hover_glow_select_press__lineColour,
            default_item__hover_glow_select_press__lineThickness:item__hover_glow_select_press__lineThickness,
        
            subList_arrowMux:arrowMux,
            space_height:space_height,
            break_height:break_height,
            break_lineMux:break_lineMux,
            textBreak_height:textBreak_height,
            textBreak_textToLineSpacing:textBreak_textToLineSpacing,
            textBreak_textHeightMux:textBreak_textHeightMux,
            textBreak_lineMux:textBreak_lineMux,

            onenter:onenter,
            onleave:onleave,
            onpress:onpress,
            ondblpress:ondblpress,
            onrelease:onrelease,
            onselection:onselection,
            onpositionchange:onpositionchange,
        });
        subListGroup.append(sublist);
    };
    newItem.close = function(){
        if(!this.isOpen){return;}
        this.isOpen = false;
        button.select(false);

        subListGroup.remove(sublist);
    };

    button.onselect = function(){
        const yOffset = buttonClick(true);
        newItem.open(yOffset);
        arrowState.selected = true; 
        updateArrowColour();
    };
    button.ondeselect = function(){
        buttonClick(false);
        newItem.close();
        arrowState.selected = false; 
        updateArrowColour();
    };

    return {item:newItem,height:height};
};

interfacePart.partLibrary.control.list = function(name,data){ 
    return interfacePart.collection.control.list(
        name, data.x, data.y, data.angle, data.interactable, data.list,

        data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,
    
        data.heightLimit,
        data.widthLimit,
        data.backgroundColour,
        data.backgroundMarkingColour,
    
        data.default_item_height,
        data.default_item_width,
        data.default_item_spacingHeight,
        data.default_item_horizontalPadding,
    
        data.default_text__text,
        data.default_text__font,
        data.default_text__fontSize,
        data.default_text__printingMode,
        data.default_text__spacing,
        data.default_text__interCharacterSpacing,

        data.default_text_colour__off,
        data.default_text_colour__up,
        data.default_text_colour__press,
        data.default_text_colour__select,
        data.default_text_colour__select_press,
        data.default_text_colour__glow,
        data.default_text_colour__glow_press,
        data.default_text_colour__glow_select,
        data.default_text_colour__glow_select_press,
        data.default_text_colour__hover,
        data.default_text_colour__hover_press,
        data.default_text_colour__hover_select,
        data.default_text_colour__hover_select_press,
        data.default_text_colour__hover_glow,
        data.default_text_colour__hover_glow_press,
        data.default_text_colour__hover_glow_select,
        data.default_text_colour__hover_glow_select_press,
    
        data.default_item__off__colour,
        data.default_item__off__lineColour,
        data.default_item__off__lineThickness,
        data.default_item__up__colour,
        data.default_item__up__lineColour,
        data.default_item__up__lineThickness,
        data.default_item__press__colour,
        data.default_item__press__lineColour,
        data.default_item__press__lineThickness,
        data.default_item__select__colour,
        data.default_item__select__lineColour,
        data.default_item__select__lineThickness,
        data.default_item__select_press__colour,
        data.default_item__select_press__lineColour,
        data.default_item__select_press__lineThickness,
        data.default_item__glow__colour,
        data.default_item__glow__lineColour,
        data.default_item__glow__lineThickness,
        data.default_item__glow_press__colour,
        data.default_item__glow_press__lineColour,
        data.default_item__glow_press__lineThickness,
        data.default_item__glow_select__colour,
        data.default_item__glow_select__lineColour,
        data.default_item__glow_select__lineThickness,
        data.default_item__glow_select_press__colour,
        data.default_item__glow_select_press__lineColour,
        data.default_item__glow_select_press__lineThickness,
        data.default_item__hover__colour,
        data.default_item__hover__lineColour,
        data.default_item__hover__lineThickness,
        data.default_item__hover_press__colour,
        data.default_item__hover_press__lineColour,
        data.default_item__hover_press__lineThickness,
        data.default_item__hover_select__colour,
        data.default_item__hover_select__lineColour,
        data.default_item__hover_select__lineThickness,
        data.default_item__hover_select_press__colour,
        data.default_item__hover_select_press__lineColour,
        data.default_item__hover_select_press__lineThickness,
        data.default_item__hover_glow__colour,
        data.default_item__hover_glow__lineColour,
        data.default_item__hover_glow__lineThickness,
        data.default_item__hover_glow_press__colour,
        data.default_item__hover_glow_press__lineColour,
        data.default_item__hover_glow_press__lineThickness,
        data.default_item__hover_glow_select__colour,
        data.default_item__hover_glow_select__lineColour,
        data.default_item__hover_glow_select__lineThickness,
        data.default_item__hover_glow_select_press__colour,
        data.default_item__hover_glow_select_press__lineColour,
        data.default_item__hover_glow_select_press__lineThickness,
    
        data.subList_arrowMux,
        data.space_height,
        data.break_height,
        data.break_lineMux,
        data.textBreak_height,
        data.textBreak_textToLineSpacing,
        data.textBreak_textHeightMux,
        data.textBreak_lineMux,
    
        data.onenter,
        data.onleave,
        data.onpress,
        data.ondblpress,
        data.onrelease,
        data.onselection,
        data.onpositionchange,
    );
};