var partsCreated = {};

_canvas_.layers.registerFunctionForLayer("interface", function(){

    _canvas_.core.render.active(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(30);
    _canvas_.core.viewport.stopMouseScroll(true);

    _canvas_.core.viewport.scale(5);
    _canvas_.core.viewport.position(460,0);

    partsCreated.control = {};
    partsCreated.control.controlGroup = _canvas_.interface.part.builder('basic', 'group', 'controlGroup', { x:10, y:10 } );
    _canvas_.system.pane.mm.append(partsCreated.control.controlGroup);

    //button    
        //button_rectangle
            partsCreated.control.button_rectangle = _canvas_.interface.part.builder('control', 'button_rectangle', 'test_button_rectangle', {
                x:0, y:0, text_centre:'rectangle', style:{text__hover__colour:{r:1,g:0,b:0,a:1}}
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.button_rectangle);
        //button_circle
            partsCreated.control.button_circle = _canvas_.interface.part.builder( 'control', 'button_circle', 'test_button_circle', {
                x:15, y:37.5, text_centre:'circle', style:{text__hover__colour:{r:1,g:0,b:0,a:1}}
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.button_circle);
        //button_polygon
            partsCreated.control.button_polygon = _canvas_.interface.part.builder( 'control', 'button_polygon', 'test_button_polygon', {
                x:0,y:55, points:[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}],style:{text__hover__colour:{r:1,g:0,b:0,a:1}},
                text_centre:'polygon'
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.button_polygon);
        //button_image
            partsCreated.control.button_image = _canvas_.interface.part.builder( 'control', 'button_image', 'test_button_image', {
                x:0, y:87.5,
                backingURL__off:'/images/testImages/buttonStates/off.png',
                backingURL__up:'/images/testImages/buttonStates/up.png',
                backingURL__press:'/images/testImages/buttonStates/press.png',
                backingURL__select:'/images/testImages/buttonStates/select.png',
                backingURL__select_press:'/images/testImages/buttonStates/select_press.png',
                backingURL__glow:'/images/testImages/buttonStates/glow.png',
                backingURL__glow_press:'/images/testImages/buttonStates/glow_press.png',
                backingURL__glow_select:'/images/testImages/buttonStates/glow_select.png',
                backingURL__glow_select_press:'/images/testImages/buttonStates/glow_select_press.png',
                backingURL__hover:'/images/testImages/buttonStates/hover.png',
                backingURL__hover_press:'/images/testImages/buttonStates/hover_press.png',
                backingURL__hover_select:'/images/testImages/buttonStates/hover_select.png',
                backingURL__hover_select_press:'/images/testImages/buttonStates/hover_select_press.png',
                backingURL__hover_glow:'/images/testImages/buttonStates/hover_glow.png',
                backingURL__hover_glow_press:'/images/testImages/buttonStates/hover_glow_press.png',
                backingURL__hover_glow_select:'/images/testImages/buttonStates/hover_glow_select.png',
                backingURL__hover_glow_select_press:'/images/testImages/buttonStates/hover_glow_select_press.png',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.button_image);

    //checkbox
        //checkbox_rectangle
            partsCreated.control.checkbox_rectangle = _canvas_.interface.part.builder('control', 'checkbox_rectangle', 'test_checkbox_rectangle', {x:35, y:0} );
            partsCreated.control.controlGroup.append(partsCreated.control.checkbox_rectangle);
        //checkbox_circle
            partsCreated.control.checkbox_circle = _canvas_.interface.part.builder('control', 'checkbox_circle', 'test_checkbox_circle', {x:45, y:37.5} );
            partsCreated.control.controlGroup.append(partsCreated.control.checkbox_circle);
        //checkbox_polygon
            partsCreated.control.checkbox_polygon = _canvas_.interface.part.builder('control', 'checkbox_polygon', 'test_checkbox_polygon', {
                x:35, y:55,
                outterPoints:[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20},{x:4,y:20},{x:0,y:16}],
                innerPoints:[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.checkbox_polygon);
        //checkbox_image
            partsCreated.control.checkbox_image = _canvas_.interface.part.builder('control', 'checkbox_image', 'test_checkbox_image', {
                x:35, y:87.5,
                uncheckURL:'/images/testImages/Dore-munchausen-illustration.jpg',
                checkURL:'/images/testImages/mikeandbrian.jpg',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.checkbox_image);

    //checkboxGrid
        //checkboxGrid
            partsCreated.control.checkboxgrid = _canvas_.interface.part.builder('control', 'checkboxgrid', 'test_checkboxgrid', {x:60, y:0} );
            partsCreated.control.controlGroup.append(partsCreated.control.checkboxgrid);

    //dial
        //dial_continuous
            partsCreated.control.dial_1_continuous = _canvas_.interface.part.builder('control', 'dial_1_continuous', 'test_dial_1_continuous', {x:160, y:10} );
            partsCreated.control.controlGroup.append(partsCreated.control.dial_1_continuous);
            partsCreated.control.dial_2_continuous = _canvas_.interface.part.builder('control', 'dial_2_continuous', 'test_dial_2_continuous', {x:185, y:10} );
            partsCreated.control.controlGroup.append(partsCreated.control.dial_2_continuous);
        //dial_discrete
            partsCreated.control.dial_1_discrete = _canvas_.interface.part.builder('control', 'dial_1_discrete', 'test_dial_1_discrete', {x:160, y:35} );
            partsCreated.control.controlGroup.append(partsCreated.control.dial_1_discrete);
            partsCreated.control.dial_2_discrete = _canvas_.interface.part.builder('control', 'dial_2_discrete', 'test_dial_2_discrete', {x:185, y:35} );
            partsCreated.control.controlGroup.append(partsCreated.control.dial_2_discrete);
        //dial_continuous_image 
            partsCreated.control.dial_continuous_image = _canvas_.interface.part.builder('control', 'dial_continuous_image', 'test_dial_continuous_image', {
                x:210, y:10, 
                handleURL:'/images/testImages/expanded-metal-1.jpg',
                slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
                needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.dial_continuous_image);
        //dial_discrete_image
            partsCreated.control.dial_discrete_image = _canvas_.interface.part.builder('control', 'dial_discrete_image', 'test_dial_discrete_image', {
                x:210, y:35, 
                handleURL:'/images/testImages/expanded-metal-1.jpg',
                slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
                needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.dial_discrete_image);
            
    //slide
        //slide_continuous
            partsCreated.control.slide_continuous = _canvas_.interface.part.builder('control', 'slide_continuous', 'test_slide_continuous', {x:230, y:0} );
            partsCreated.control.controlGroup.append(partsCreated.control.slide_continuous);
        //slide_continuous_image
            partsCreated.control.slide_continuous_image = _canvas_.interface.part.builder('control', 'slide_continuous_image', 'test_slide_continuous_image', {
                x:245, y:0,
                handleURL:'/images/testImages/expanded-metal-1.jpg',
                backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.slide_continuous_image);
        //slide_discrete
            partsCreated.control.slide_discrete = _canvas_.interface.part.builder('control', 'slide_discrete', 'test_slide_discrete', {x:260, y:0} );
            partsCreated.control.controlGroup.append(partsCreated.control.slide_discrete);
        //slide_discrete_image
            partsCreated.control.slide_discrete_image = _canvas_.interface.part.builder('control', 'slide_discrete_image', 'test_slide_discrete_image', {
                x:275, y:0,
                handleURL:'/images/testImages/expanded-metal-1.jpg',
                backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.slide_discrete_image);
        //slidePanel
            partsCreated.control.slidePanel = _canvas_.interface.part.builder('control', 'slidePanel', 'test_slidePanel', {x:290, y:0} );
            partsCreated.control.controlGroup.append(partsCreated.control.slidePanel);
        //slidePanel_image
            partsCreated.control.slidePanel_image = _canvas_.interface.part.builder('control', 'slidePanel_image', 'test_slidePanel_image', {
                x:375, y:0,
                handleURL:'/images/testImages/expanded-metal-1.jpg',
                backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.slidePanel_image);

    //rangeslide
        //rangeslide
            partsCreated.control.rangeslide = _canvas_.interface.part.builder('control', 'rangeslide', 'test_rangeslide', {x:460, y:0} );
            partsCreated.control.controlGroup.append(partsCreated.control.rangeslide);
        //rangeslide_image
            partsCreated.control.rangeslide_image = _canvas_.interface.part.builder('control', 'rangeslide_image', 'test_rangeslide_image', {
                x:475, y:0,
                handleURL:'/images/testImages/expanded-metal-1.jpg',
                backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                spanURL:'/images/testImages/dark-background_1048-3848.jpg',
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.rangeslide_image);
            
    //list
        //list
            partsCreated.control.list = _canvas_.interface.part.builder('control', 'list', 'test_list', {
                x:490, y:0, heightLimit:100, widthLimit:50,
                list:[
                    { type:'space' },

                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },
                    { type:'break' },

                    { type:'space' },

                    { type:'textbreak', text:'break 1'},
                    { type:'textbreak', text:'break 2'},
                    { type:'textbreak', text:'break 3'},
                    { type:'textbreak', text:'break 4'},
                    { type:'textbreak', text:'break 5'},
                    { type:'textbreak', text:'break 6'},
                    { type:'textbreak', text:'break 7'},
                    { type:'textbreak', text:'break 8'},
                    { type:'textbreak', text:'break 9'},
                    { type:'textbreak', text:'break 10'},
                    { type:'textbreak', text:'break 11'},
                    { type:'textbreak', text:'break 12'},
                    { type:'textbreak', text:'break 13'},
                    { type:'textbreak', text:'break 14'},
                    { type:'textbreak', text:'break 15'},

                    { type:'space' },

                    { type:'text', text_left:'left', text_centre:'1',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'2',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'3',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'4',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'5',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'6',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'7',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'8',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'9',  text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'10', text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'11', text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'12', text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'13', text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'14', text_right:'right' },
                    { type:'text', text_left:'left', text_centre:'15', text_right:'right' },

                    { type:'space' },

                    { type:'checkbox', text:'checkable 1',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 2',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 3',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 4',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 5',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 6',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 7',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 8',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 9',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 10', updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 11', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 12', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 13', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 14', updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                    { type:'checkbox', text:'checkable 15', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },

                    { type:'space' },

                    { type:'button', text_left:'item1',  text_centre:'', text_right:'', function:function(){console.log('item1 function');}  },
                    { type:'button', text_left:'item2',  text_centre:'', text_right:'', function:function(){console.log('item2 function');}  },
                    { type:'button', text_left:'item3',  text_centre:'', text_right:'', function:function(){console.log('item3 function');}  },
                    { type:'button', text_left:'item4',  text_centre:'', text_right:'', function:function(){console.log('item4 function');}  },
                    { type:'button', text_left:'item5',  text_centre:'', text_right:'', function:function(){console.log('item5 function');}  },
                    { type:'button', text_left:'item6',  text_centre:'', text_right:'', function:function(){console.log('item6 function');}  },
                    { type:'button', text_left:'item7',  text_centre:'', text_right:'', function:function(){console.log('item7 function');}  },
                    { type:'button', text_left:'item8',  text_centre:'', text_right:'', function:function(){console.log('item8 function');}  },
                    { type:'button', text_left:'item9',  text_centre:'', text_right:'', function:function(){console.log('item9 function');}  },
                    { type:'button', text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
                    { type:'button', text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
                    { type:'button', text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
                    { type:'button', text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
                    { type:'button', text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
                    { type:'button', text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },

                    { type:'space' },

                    { type:'radio', text:'radio_1', heightLimit:-1,
                        options:[ 'option_1', 'option_2', 'option_3', 'option_4', 'option_5' ],
                        updateFunction:function(){return 1;},
                        onclickFunction:function(val){console.log('radio_1:',val);},
                    },

                    { type:'space' },

                    { type:'list', text:'sublist 1', list:[
                        { type:'space' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'break' },
                        { type:'space' },
                    ] },
                    { type:'list', text:'sublist 2', heightLimit:100, list:[
                        { type:'space' },
                        { type:'textbreak', text:'break 1'},
                        { type:'textbreak', text:'break 2'},
                        { type:'textbreak', text:'break 3'},
                        { type:'textbreak', text:'break 4'},
                        { type:'textbreak', text:'break 5'},
                        { type:'textbreak', text:'break 6'},
                        { type:'textbreak', text:'break 7'},
                        { type:'textbreak', text:'break 8'},
                        { type:'textbreak', text:'break 9'},
                        { type:'textbreak', text:'break 10'},
                        { type:'textbreak', text:'break 11'},
                        { type:'textbreak', text:'break 12'},
                        { type:'textbreak', text:'break 13'},
                        { type:'textbreak', text:'break 14'},
                        { type:'textbreak', text:'break 15'},
                        { type:'space' },
                    ] },
                    { type:'list', text:'sublist 3', heightLimit:100, list:[
                        { type:'space' },
                        { type:'text', text_left:'left', text_centre:'1',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'2',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'3',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'4',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'5',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'6',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'7',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'8',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'9',  text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'10', text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'11', text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'12', text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'13', text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'14', text_right:'right' },
                        { type:'text', text_left:'left', text_centre:'15', text_right:'right' },
                        { type:'space' },
                    ] },
                    { type:'list', text:'sublist 4', heightLimit:100, list:[
                        { type:'space' },
                        { type:'checkbox', text:'checkable 1',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 2',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 3',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 4',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 5',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 6',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 7',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 8',  updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 9',  updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 10', updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 11', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 12', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 13', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 14', updateFunction:function(){return true;},  onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'checkbox', text:'checkable 15', updateFunction:function(){return false;}, onclickFunction:function(val){console.log('checkbox:',val);} },
                        { type:'space' },
                    ] },
                    { type:'list', text:'sublist 5', heightLimit:100, list:[
                        { type:'space' },
                        { type:'button', text_left:'item1',  text_centre:'', text_right:'', function:function(){console.log('item1 function');}  },
                        { type:'button', text_left:'item2',  text_centre:'', text_right:'', function:function(){console.log('item2 function');}  },
                        { type:'button', text_left:'item3',  text_centre:'', text_right:'', function:function(){console.log('item3 function');}  },
                        { type:'button', text_left:'item4',  text_centre:'', text_right:'', function:function(){console.log('item4 function');}  },
                        { type:'button', text_left:'item5',  text_centre:'', text_right:'', function:function(){console.log('item5 function');}  },
                        { type:'button', text_left:'item6',  text_centre:'', text_right:'', function:function(){console.log('item6 function');}  },
                        { type:'button', text_left:'item7',  text_centre:'', text_right:'', function:function(){console.log('item7 function');}  },
                        { type:'button', text_left:'item8',  text_centre:'', text_right:'', function:function(){console.log('item8 function');}  },
                        { type:'button', text_left:'item9',  text_centre:'', text_right:'', function:function(){console.log('item9 function');}  },
                        { type:'button', text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
                        { type:'button', text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
                        { type:'button', text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
                        { type:'button', text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
                        { type:'button', text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
                        { type:'button', text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },
                        { type:'button', text_left:'item16', text_centre:'', text_right:'', function:function(){console.log('item16 function');} },
                        { type:'space' },
                    ] },
                    { type:'space' },
                ]
            } );
            partsCreated.control.controlGroup.append(partsCreated.control.list);
        // //list_image
        //     partsCreated.control.list_image = _canvas_.interface.part.builder('control', 'list_image', 'test_list_image', {
        //         x:545, y:0, heightLimit:100, widthLimit:50,
        //         list:[
        //             { type:'space' },

        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },
        //             { type:'break' },

        //             { type:'space' },

        //             { type:'image' },
        //         ]
        //     } );
        //     partsCreated.control.controlGroup.append(partsCreated.control.list_image);

    //needleOverlay
        //needleOverlay
            partsCreated.control.needleOverlay = _canvas_.interface.part.builder('control', 'needleOverlay', 'test_needleOverlay', {x:545, y:0});
            partsCreated.control.controlGroup.append(partsCreated.control.needleOverlay);
            partsCreated.control.needleOverlay.select(0,0.25);
            partsCreated.control.needleOverlay.area(0.5,0.75);
            // partsCreated.control.needleOverlay.onchange = function(needle,value){console.log(needle,value);};
            // partsCreated.control.needleOverlay.onrelease = function(needle,value){console.log(needle,value);};
            // partsCreated.control.needleOverlay.selectionAreaToggle = function(bool){console.log(bool);};

    //grapherWaveWorkspace
        //grapher_waveWorkspace
            partsCreated.control.grapher_waveWorkspace = _canvas_.interface.part.builder('control', 'grapher_waveWorkspace', 'test_grapher_waveWorkspace', {x:670,y:0});
            partsCreated.control.controlGroup.append(partsCreated.control.grapher_waveWorkspace);
            partsCreated.control.grapher_waveWorkspace.select(0,0.2);
            partsCreated.control.grapher_waveWorkspace.area(0.5,0.7);
            
    //sequencer
        //sequencer
            partsCreated.control.sequencer = _canvas_.interface.part.builder( 'control', 'sequencer', 'test_sequencer', {x:795,y:0,zoomLevel_x:1/2} );
            partsCreated.control.controlGroup.append(partsCreated.control.sequencer);
            partsCreated.control.sequencer.addSignal( 0,0,  10,0.0 );
            partsCreated.control.sequencer.addSignal( 1,1,  10,0.1 );
            partsCreated.control.sequencer.addSignal( 2,2,  10,0.2 );
            partsCreated.control.sequencer.addSignal( 3,3,  10,0.3 );
            partsCreated.control.sequencer.addSignal( 4,4,  10,0.4 );
            partsCreated.control.sequencer.addSignal( 5,5,  10,0.5 );
            partsCreated.control.sequencer.addSignal( 6,6,  10,0.6 );
            partsCreated.control.sequencer.addSignal( 7,7,  10,0.7 );
            partsCreated.control.sequencer.addSignal( 8,8,  10,0.8 );
            partsCreated.control.sequencer.addSignal( 9,9,  10,0.9 );
            partsCreated.control.sequencer.addSignal( 10,10,10,1.0 );
            partsCreated.control.sequencer.event = function(data){console.log(data);};
} );