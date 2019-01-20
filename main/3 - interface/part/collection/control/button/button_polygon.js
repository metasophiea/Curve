this.button_polygon = function(
    name='button_polygon',
    x, y, points=[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}], angle=0, interactable=true,
    text_centre='',
    
    active=true, hoverable=true, selectable=false, pressable=true,

    text_font = '5pt Arial',
    text_textBaseline = 'alphabetic',
    text_fill = 'rgba(0,0,0,1)',
    text_stroke = 'rgba(0,0,0,0)',
    text_lineWidth = 1,

    backing__off__fill=                          'rgba(180,180,180,1)',
    backing__off__stroke=                        'rgba(0,0,0,0)',
    backing__off__lineWidth=                     0,
    backing__up__fill=                           'rgba(200,200,200,1)',
    backing__up__stroke=                         'rgba(0,0,0,0)',
    backing__up__lineWidth=                      0,
    backing__press__fill=                        'rgba(230,230,230,1)',
    backing__press__stroke=                      'rgba(0,0,0,0)',
    backing__press__lineWidth=                   0,
    backing__select__fill=                       'rgba(200,200,200,1)',
    backing__select__stroke=                     'rgba(120,120,120,1)',
    backing__select__lineWidth=                  0.75,
    backing__select_press__fill=                 'rgba(230,230,230,1)',
    backing__select_press__stroke=               'rgba(120,120,120,1)',
    backing__select_press__lineWidth=            0.75,
    backing__glow__fill=                         'rgba(220,220,220,1)',
    backing__glow__stroke=                       'rgba(0,0,0,0)',
    backing__glow__lineWidth=                    0,
    backing__glow_press__fill=                   'rgba(250,250,250,1)',
    backing__glow_press__stroke=                 'rgba(0,0,0,0)',
    backing__glow_press__lineWidth=              0,
    backing__glow_select__fill=                  'rgba(220,220,220,1)',
    backing__glow_select__stroke=                'rgba(120,120,120,1)',
    backing__glow_select__lineWidth=             0.75,
    backing__glow_select_press__fill=            'rgba(250,250,250,1)',
    backing__glow_select_press__stroke=          'rgba(120,120,120,1)',
    backing__glow_select_press__lineWidth=       0.75,
    backing__hover__fill=                        'rgba(220,220,220,1)',
    backing__hover__stroke=                      'rgba(0,0,0,0)',
    backing__hover__lineWidth=                   0,
    backing__hover_press__fill=                  'rgba(240,240,240,1)',
    backing__hover_press__stroke=                'rgba(0,0,0,0)',
    backing__hover_press__lineWidth=             0,
    backing__hover_select__fill=                 'rgba(220,220,220,1)',
    backing__hover_select__stroke=               'rgba(120,120,120,1)',
    backing__hover_select__lineWidth=            0.75,
    backing__hover_select_press__fill=           'rgba(240,240,240,1)',
    backing__hover_select_press__stroke=         'rgba(120,120,120,1)',
    backing__hover_select_press__lineWidth=      0.75,
    backing__hover_glow__fill=                   'rgba(240,240,240,1)',
    backing__hover_glow__stroke=                 'rgba(0,0,0,0)',
    backing__hover_glow__lineWidth=              0,
    backing__hover_glow_press__fill=             'rgba(250,250,250,1)',
    backing__hover_glow_press__stroke=           'rgba(0,0,0,0)',
    backing__hover_glow_press__lineWidth=        0,
    backing__hover_glow_select__fill=            'rgba(240,240,240,1)',
    backing__hover_glow_select__stroke=          'rgba(120,120,120,1)',
    backing__hover_glow_select__lineWidth=       0.75,
    backing__hover_glow_select_press__fill=      'rgba(250,250,250,1)',
    backing__hover_glow_select_press__stroke=    'rgba(120,120,120,1)',
    backing__hover_glow_select_press__lineWidth= 0.75,

    onenter = function(event){},
    onleave = function(event){},
    onpress = function(event){},
    ondblpress = function(event){},
    onrelease = function(event){},
    onselect = function(event){},
    ondeselect = function(event){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('group',name+'subGroup',{});
        //backing
            var backing = interfacePart.builder('polygon','backing',{points:points, style:{
                fill:backing__off__fill,
                stroke:backing__off__stroke,
                lineWidth:backing__off__lineWidth,
            }});
            subject.append(backing);
            var avgPoint = workspace.library.math.averagePoint(points);
        //text
            var text_centre = interfacePart.builder('text','centre', {
                x:avgPoint.x, y:avgPoint.y,
                text:text_centre, 
                style:{
                    font:text_font,
                    testBaseline:text_textBaseline,
                    fill:text_fill,
                    stroke:text_stroke,
                    lineWidth:text_lineWidth,
                    textAlign:'center',
                    textBaseline:'middle',
                }
            });
            subject.append(text_centre);
        //cover
            subject.cover = interfacePart.builder('polygon','cover',{points:points, style:{fill:'rgba(0,0,0,0)'}});
            subject.append(subject.cover);

    //generic button part
        var object = interfacePart.builder(
            'button_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                onenter:onenter,
                onleave:onleave,
                onpress:onpress,
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
                backing.style.fill = backing__off__fill;
                backing.style.stroke = backing__off__stroke;
                backing.style.lineWidth = backing__off__lineWidth;
                return;
            }

            var styles = [
                { fill:backing__up__fill,                      stroke:backing__up__stroke,                      lineWidth:backing__up__lineWidth                      },
                { fill:backing__press__fill,                   stroke:backing__press__stroke,                   lineWidth:backing__press__lineWidth                   },
                { fill:backing__select__fill,                  stroke:backing__select__stroke,                  lineWidth:backing__select__lineWidth                  },
                { fill:backing__select_press__fill,            stroke:backing__select_press__stroke,            lineWidth:backing__select_press__lineWidth            },
                { fill:backing__glow__fill,                    stroke:backing__glow__stroke,                    lineWidth:backing__glow__lineWidth                    },
                { fill:backing__glow_press__fill,              stroke:backing__glow_press__stroke,              lineWidth:backing__glow_press__lineWidth              },
                { fill:backing__glow_select__fill,             stroke:backing__glow_select__stroke,             lineWidth:backing__glow_select__lineWidth             },
                { fill:backing__glow_select_press__fill,       stroke:backing__glow_select_press__stroke,       lineWidth:backing__glow_select_press__lineWidth       },
                { fill:backing__hover__fill,                   stroke:backing__hover__stroke,                   lineWidth:backing__hover__lineWidth                   },
                { fill:backing__hover_press__fill,             stroke:backing__hover_press__stroke,             lineWidth:backing__hover_press__lineWidth             },
                { fill:backing__hover_select__fill,            stroke:backing__hover_select__stroke,            lineWidth:backing__hover_select__lineWidth            },
                { fill:backing__hover_select_press__fill,      stroke:backing__hover_select_press__stroke,      lineWidth:backing__hover_select_press__lineWidth      },
                { fill:backing__hover_glow__fill,              stroke:backing__hover_glow__stroke,              lineWidth:backing__hover_glow__lineWidth              },
                { fill:backing__hover_glow_press__fill,        stroke:backing__hover_glow_press__stroke,        lineWidth:backing__hover_glow_press__lineWidth        },
                { fill:backing__hover_glow_select__fill,       stroke:backing__hover_glow_select__stroke,       lineWidth:backing__hover_glow_select__lineWidth       },
                { fill:backing__hover_glow_select_press__fill, stroke:backing__hover_glow_select_press__stroke, lineWidth:backing__hover_glow_select_press__lineWidth },
            ];

            if(!hoverable && state.hovering ){ state.hovering = false; }
            if(!selectable && state.selected ){ state.selected = false; }

            var i = state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1;
            backing.style.fill =       styles[i].fill;
            backing.style.stroke =     styles[i].stroke;
            backing.style.lineWidth =  styles[i].lineWidth;
        };
        object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });

    return object;
};