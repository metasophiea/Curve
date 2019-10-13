this.button_polygon = function(
    name='button_polygon',
    x, y, points=[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}], angle=0, interactable=true,
    text_centre='',
    
    active=true, hoverable=true, selectable=false, pressable=true,

    text_font = 'Arial',
    text_size=2.5,
    text_spacing=0.1,
    text_interCharacterSpacing=0,

    text__off__colour={r:0,g:0,b:0,a:1},
    text__up__colour={r:0,g:0,b:0,a:1},
    text__press__colour={r:0,g:0,b:0,a:1},
    text__select__colour={r:0,g:0,b:0,a:1},
    text__select_press__colour={r:0,g:0,b:0,a:1},
    text__glow__colour={r:0,g:0,b:0,a:1},
    text__glow_press__colour={r:0,g:0,b:0,a:1},
    text__glow_select__colour={r:0,g:0,b:0,a:1},
    text__glow_select_press__colour={r:0,g:0,b:0,a:1},
    text__hover__colour={r:0,g:0,b:0,a:1},
    text__hover_press__colour={r:0,g:0,b:0,a:1},
    text__hover_select__colour={r:0,g:0,b:0,a:1},
    text__hover_select_press__colour={r:0,g:0,b:0,a:1},
    text__hover_glow__colour={r:0,g:0,b:0,a:1},
    text__hover_glow_press__colour={r:0,g:0,b:0,a:1},
    text__hover_glow_select__colour={r:0,g:0,b:0,a:1},
    text__hover_glow_select_press__colour={r:0,g:0,b:0,a:1},

    backing__off__colour=                            {r:180/255,g:180/255,b:180/255,a:1},
    backing__off__lineColour=                        {r:0/255,g:0/255,b:0/255,a:0},
    backing__off__lineThickness=                     0,
    backing__up__colour=                             {r:200/255,g:200/255,b:200/255,a:1},
    backing__up__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
    backing__up__lineThickness=                      0,
    backing__press__colour=                          {r:230/255,g:230/255,b:230/255,a:1},
    backing__press__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
    backing__press__lineThickness=                   0,
    backing__select__colour=                         {r:200/255,g:200/255,b:200/255,a:1},
    backing__select__lineColour=                     {r:120/255,g:120/255,b:120/255,a:1},
    backing__select__lineThickness=                  0.75,
    backing__select_press__colour=                   {r:230/255,g:230/255,b:230/255,a:1},
    backing__select_press__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
    backing__select_press__lineThickness=            0.75,
    backing__glow__colour=                           {r:220/255,g:220/255,b:220/255,a:1},
    backing__glow__lineColour=                       {r:0/255,g:0/255,b:0/255,a:0},
    backing__glow__lineThickness=                    0,
    backing__glow_press__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
    backing__glow_press__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
    backing__glow_press__lineThickness=              0,
    backing__glow_select__colour=                    {r:220/255,g:220/255,b:220/255,a:1},
    backing__glow_select__lineColour=                {r:120/255,g:120/255,b:120/255,a:1},
    backing__glow_select__lineThickness=             0.75,
    backing__glow_select_press__colour=              {r:250/255,g:250/255,b:250/255,a:1},
    backing__glow_select_press__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
    backing__glow_select_press__lineThickness=       0.75,
    backing__hover__colour=                          {r:220/255,g:220/255,b:220/255,a:1},
    backing__hover__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover__lineThickness=                   0,
    backing__hover_press__colour=                    {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_press__lineColour=                {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover_press__lineThickness=             0,
    backing__hover_select__colour=                   {r:220/255,g:220/255,b:220/255,a:1},
    backing__hover_select__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_select__lineThickness=            0.75,
    backing__hover_select_press__colour=             {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_select_press__lineColour=         {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_select_press__lineThickness=      0.75,
    backing__hover_glow__colour=                     {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_glow__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover_glow__lineThickness=              0,
    backing__hover_glow_press__colour=               {r:250/255,g:250/255,b:250/255,a:1},
    backing__hover_glow_press__lineColour=           {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover_glow_press__lineThickness=        0,
    backing__hover_glow_select__colour=              {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_glow_select__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_glow_select__lineThickness=       0.75,
    backing__hover_glow_select_press__colour=        {r:250/255,g:250/255,b:250/255,a:1},
    backing__hover_glow_select_press__lineColour=    {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_glow_select_press__lineThickness= 0.75,

    onenter = function(event){},
    onleave = function(event){},
    onpress = function(event){},
    onpressrelease = function(event){},
    ondblpress = function(event){},
    onrelease = function(event){},
    onselect = function(event){},
    ondeselect = function(event){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('basic','group',name+'subGroup');
        //backing
            var backing = interfacePart.builder('basic','polygonWithOutline','backing',{pointsAsXYArray:points, colour:backing__off__colour, thickness:5 });
            subject.append(backing);
        // //outline
        //     var outline = interfacePart.builder('path','outline',{ pointsAsXYArray:points.concat([points[0],points[1]]), thickness:backing__off__lineThickness, colour:backing__off__lineColour, });
        //     subject.append(outline);
        //text
             var avgPoint = _canvas_.library.math.averagePoint(points);
             var text_centre = interfacePart.builder('basic','text','centre', {
                x:avgPoint.x, y:avgPoint.y,
                text:text_centre, 
                width:text_size,
                height:text_size,
                colour:text__up__colour,
                font:text_font,
                printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'},
                spacing:text_spacing,
                interCharacterSpacing:text_interCharacterSpacing,
            });
            subject.append(text_centre);
        //cover
            subject.cover = interfacePart.builder('basic','polygon','cover',{pointsAsXYArray:points, colour:{r:0,g:0,b:0,a:0}});
            subject.append(subject.cover);

    //generic button part
        var object = interfacePart.builder(
            'control', 'button_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                onenter:onenter,
                onleave:onleave,
                onpress:onpress,
                onpressrelease:onpressrelease,
                ondblpress:ondblpress,
                onrelease:onrelease,
                onselect:onselect,
                ondeselect:ondeselect,

                subject:subject,
            }
        );

    //graphical state adjust
        object.activateGraphicalState = function(state){
            if(!active){ 
                text_centre.colour(text__off__colour);
                text_left.colour(text__off__colour);
                text_right.colour(text__off__colour);
                backing.colour = backing__off__colour;
                backing.lineColour = backing__off__lineColour;
                backing.thickness( backing__off__lineThickness );
                return;
            }

            var styles = [
                { text_colour:text__up__colour,                      colour:backing__up__colour,                      lineColour:backing__up__lineColour,                      lineThickness:backing__up__lineThickness                      },
                { text_colour:text__press__colour,                   colour:backing__press__colour,                   lineColour:backing__press__lineColour,                   lineThickness:backing__press__lineThickness                   },
                { text_colour:text__select__colour,                  colour:backing__select__colour,                  lineColour:backing__select__lineColour,                  lineThickness:backing__select__lineThickness                  },
                { text_colour:text__select_press__colour,            colour:backing__select_press__colour,            lineColour:backing__select_press__lineColour,            lineThickness:backing__select_press__lineThickness            },
                { text_colour:text__glow__colour,                    colour:backing__glow__colour,                    lineColour:backing__glow__lineColour,                    lineThickness:backing__glow__lineThickness                    },
                { text_colour:text__glow_press__colour,              colour:backing__glow_press__colour,              lineColour:backing__glow_press__lineColour,              lineThickness:backing__glow_press__lineThickness              },
                { text_colour:text__glow_select__colour,             colour:backing__glow_select__colour,             lineColour:backing__glow_select__lineColour,             lineThickness:backing__glow_select__lineThickness             },
                { text_colour:text__glow_select_press__colour,       colour:backing__glow_select_press__colour,       lineColour:backing__glow_select_press__lineColour,       lineThickness:backing__glow_select_press__lineThickness       },
                { text_colour:text__hover__colour,                   colour:backing__hover__colour,                   lineColour:backing__hover__lineColour,                   lineThickness:backing__hover__lineThickness                   },
                { text_colour:text__hover_press__colour,             colour:backing__hover_press__colour,             lineColour:backing__hover_press__lineColour,             lineThickness:backing__hover_press__lineThickness             },
                { text_colour:text__hover_select__colour,            colour:backing__hover_select__colour,            lineColour:backing__hover_select__lineColour,            lineThickness:backing__hover_select__lineThickness            },
                { text_colour:text__hover_select_press__colour,      colour:backing__hover_select_press__colour,      lineColour:backing__hover_select_press__lineColour,      lineThickness:backing__hover_select_press__lineThickness      },
                { text_colour:text__hover_glow__colour,              colour:backing__hover_glow__colour,              lineColour:backing__hover_glow__lineColour,              lineThickness:backing__hover_glow__lineThickness              },
                { text_colour:text__hover_glow_press__colour,        colour:backing__hover_glow_press__colour,        lineColour:backing__hover_glow_press__lineColour,        lineThickness:backing__hover_glow_press__lineThickness        },
                { text_colour:text__hover_glow_select__colour,       colour:backing__hover_glow_select__colour,       lineColour:backing__hover_glow_select__lineColour,       lineThickness:backing__hover_glow_select__lineThickness       },
                { text_colour:text__hover_glow_select_press__colour, colour:backing__hover_glow_select_press__colour, lineColour:backing__hover_glow_select_press__lineColour, lineThickness:backing__hover_glow_select_press__lineThickness },
            ];

            if(!hoverable && state.hovering ){ state.hovering = false; }
            if(!selectable && state.selected ){ state.selected = false; }

            var i = state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1;
            text_centre.colour(styles[i].text_colour);
            backing.colour = styles[i].colour;
            backing.lineColour = styles[i].lineColour;
            backing.thickness( styles[i].lineThickness );
        };
        object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });

    return object;
};

interfacePart.partLibrary.control.button_polygon = function(name,data){ return interfacePart.collection.control.button_polygon(
    name, data.x, data.y, data.points, data.angle, data.interactable,
    data.text_centre,
    data.active, data.hoverable, data.selectable, data.pressable,

    data.style.text_font, 
    data.style.text_size, 
    data.style.text_spacing, 
    data.style.text_interCharacterSpacing,

    data.style.text__off__colour == undefined ? data.style.text_colour : data.style.text__off__colour,
    data.style.text__up__colour == undefined ? data.style.text_colour : data.style.text__up__colour,
    data.style.text__press__colour == undefined ? data.style.text_colour : data.style.text__press__colour,
    data.style.text__select__colour == undefined ? data.style.text_colour : data.style.text__select__colour,
    data.style.text__select_press__colour == undefined ? data.style.text_colour : data.style.text__select_press__colour,
    data.style.text__glow__colour == undefined ? data.style.text_colour : data.style.text__glow__colour,
    data.style.text__glow_press__colour == undefined ? data.style.text_colour : data.style.text__glow_press__colour,
    data.style.text__glow_select__colour == undefined ? data.style.text_colour : data.style.text__glow_select__colour,
    data.style.text__glow_select_press__colour == undefined ? data.style.text_colour : data.style.text__glow_select_press__colour,
    data.style.text__hover__colour == undefined ? data.style.text_colour : data.style.text__hover__colour,
    data.style.text__hover_press__colour == undefined ? data.style.text_colour : data.style.text__hover_press__colour,
    data.style.text__hover_select__colour == undefined ? data.style.text_colour : data.style.text__hover_select__colour,
    data.style.text__hover_select_press__colour == undefined ? data.style.text_colour : data.style.text__hover_select_press__colour,
    data.style.text__hover_glow__colour == undefined ? data.style.text_colour : data.style.text__hover_glow__colour,
    data.style.text__hover_glow_press__colour == undefined ? data.style.text_colour : data.style.text__hover_glow_press__colour,
    data.style.text__hover_glow_select__colour == undefined ? data.style.text_colour : data.style.text__hover_glow_select__colour,
    data.style.text__hover_glow_select_press__colour == undefined ? data.style.text_colour : data.style.text__hover_glow_select_press__colour,

    data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
    data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
    data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
    data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
    data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
    data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
    data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
    data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
    data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
    data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
    data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
    data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
    data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
    data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
    data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
    data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
    data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,

    data.onenter,
    data.onleave,
    data.onpress,
    data.onpressrelease,
    data.ondblpress,
    data.onrelease,
    data.onselect,
    data.ondeselect,
); };