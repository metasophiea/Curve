this.testUnit_1 = function(name,x,y,angle){
    var design = {
        name: name,
        model: 'testUnit_1',
        collection: 'test',
        x:x, y:y, angle:angle,
        space: [
            {x:-5,y:-5}, 
            {x:280,y:-5}, 
            {x:280,y:30}, 
            {x:605,y:30}, 
            {x:605,y:130}, 
            {x:705,y:130}, 
            {x:705,y:210}, 
            {x:240,y:210}, 
            {x:240,y:325}, 
            {x:430,y:325}, 
            {x:430,y:435}, 
            {x:-5,y:445}
        ],
        // spaceOutline: true,
        elements:[
            //basic
                {collection:'basic', type:'rectangle', name:'testRectangle', data:{ x:5, y:5, width:30, height:30, colour:{r:1,g:0,b:0,a:1} }},
                {collection:'basic', type:'circle', name:'testCircle', data:{ x:20, y:55, radius:15 }},
                {collection:'basic', type:'polygon', name:'testPolygon', data:{ points:[55,5, 70,35, 40,35], colour:{r:0,g:1,b:0,a:1} }},
                {collection:'basic', type:'path', name:'testPath', data:{ points:[0,0, 0,90, 2.5,90, 2.5,72.5, 75,72.5], thickness:1.25, jointType:'round', capType:'round' }},
                {collection:'basic', type:'image', name:'testImage', data:{ x:40, y:40, width:30, height:30, url:'/images/testImages/Dore-munchausen-illustration.jpg' }},
                {collection:'basic', type:'text', name: 'testText', data:{ x:5, y:75, text:'Hello', height:15, width:70, colour:{r:150/255,g:150/255,b:1,a:1} }},
                {collection:'basic', type:'rectangleWithOutline', name:'testRectangleWithOutline', data:{ x:105, y:60, width:30, height:30 }},
                {collection:'basic', type:'circleWithOutline', name:'testCircleWithOutline', data:{ x:90, y:70, radius:10 }},
                {collection:'basic', type:'polygonWithOutline', name:'testPolygonWithOutline', data:{ points:[75,15, 75,55, 115,55], thickness:1, colour:{r:1,g:0,b:0.5,a:1}, lineColour:{r:0,g:0,b:0,a:1} }},
                {collection:'basic', type:'canvas', name:'testCanvas', data:{ x:130, y:5, width:30, height:30 }},
            //display
                {collection:'display', type:'glowbox_rectangle', name:'test_glowbox_rectangle', data:{x:0, y:140}},
                {collection:'display', type:'glowbox_circle', name:'test_glowbox_circle', data:{x:15, y:185}},
                {collection:'display', type:'glowbox_image', name:'test_glowbox_image', data:{x:0, y:200, glowURL:'/images/testImages/Dore-munchausen-illustration.jpg', dimURL:'/images/testImages/mikeandbrian.jpg'}},
                {collection:'display', type:'glowbox_polygon', name:'test_glowbox_polygon', data:{x:0, y:235}},
                {collection:'display', type:'glowbox_path', name:'test_glowbox_path', data:{x:0, y:270}},
                {collection:'display', type:'sevenSegmentDisplay', name:'test_sevenSegmentDisplay', data:{x:35, y:140}},
                {collection:'display', type:'sevenSegmentDisplay', name:'test_sevenSegmentDisplay_static', data:{x:35, y:175, static:true}},
                {collection:'display', type:'sixteenSegmentDisplay', name:'test_sixteenSegmentDisplay', data:{x:60, y:140}},
                {collection:'display', type:'sixteenSegmentDisplay', name:'test_sixteenSegmentDisplay_static', data:{x:60, y:175, static:true}},
                {collection:'display', type:'readout_sevenSegmentDisplay', name:'test_readout_sevenSegmentDisplay', data:{x:85, y:140}},
                {collection:'display', type:'readout_sevenSegmentDisplay', name:'test_readout_sevenSegmentDisplay_static', data:{x:85, y:175, static:true}},
                {collection:'display', type:'readout_sixteenSegmentDisplay', name:'test_readout_sixteenSegmentDisplay', data:{x:190, y:140}},
                {collection:'display', type:'readout_sixteenSegmentDisplay', name:'test_readout_sixteenSegmentDisplay_static', data:{x:190, y:175, static:true}},
                {collection:'display', type:'level', name:'test_level', data:{x:295, y:140}},
                {collection:'display', type:'meter_level', name:'test_meter_level', data:{x:320, y:140}},
                {collection:'display', type:'audio_meter_level', name:'test_audio_meter_level', data:{x:345, y:140}},
                {collection:'display', type:'gauge', name:'test_gauge', data:{x:370, y:140}},
                {collection:'display', type:'gauge_image', name:'test_gauge_image', data:{x:425, y:140, backingURL:'/images/testImages/Dore-munchausen-illustration.jpg'}},
                {collection:'display', type:'meter_gauge', name:'test_meter_gauge', data:{x:370, y:175, markings:{ upper:'...........'.split(''), middle:'.........'.split(''), lower:'.......'.split('') }, style:{markingStyle_font:'defaultThin'}}},
                {collection:'display', type:'meter_gauge_image', name:'test_meter_gauge_image', data:{x:425, y:175, backingURL:'/images/testImages/mikeandbrian.jpg'}},
                {collection:'display', type:'rastorDisplay', name:'test_rastorDisplay', data:{x:480, y:140}},
                {collection:'display', type:'grapher', name:'test_grapher', data:{x:550, y:140}},
                {collection:'display', type:'grapher', name:'test_grapher_static', data:{x:550, y:205, static:true}},
                {collection:'display', type:'grapher_periodicWave', name:'test_grapher_periodicWave', data:{x:675, y:140}},
                {collection:'display', type:'grapher_periodicWave', name:'test_grapher_periodicWave_static', data:{x:675, y:205, static:true}},
                {collection:'display', type:'grapher_audioScope', name:'test_grapher_audioScope', data:{x:800, y:140}},
                {collection:'display', type:'grapher_audioScope', name:'test_grapher_audioScope_static', data:{x:800, y:205, static:true}},
            //control
                {collection:'control', type:'button_rectangle', name:'test_button_rectangle', data:{
                    x:0, y:350, text_centre:'rectangle', style:{text__hover__colour:{r:1,g:0,b:0,a:1}}
                } },
                {collection:'control', type:'button_circle', name:'test_button_circle', data:{
                    x:15, y:387.5, text_centre:'circle', style:{text__hover__colour:{r:1,g:0,b:0,a:1}}
                } },
                {collection:'control', type:'button_polygon', name:'test_button_polygon', data:{
                    x:0,y:405, points:[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}],style:{text__hover__colour:{r:1,g:0,b:0,a:1}},
                    text_centre:'polygon'
                } },
                {collection:'control', type:'button_image', name:'test_button_image', data:{
                    x:0, y:437.5,
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
                } },
                {collection:'control', type:'checkbox_rectangle', name:'test_checkbox_rectangle', data:{x:35, y:350} },
                {collection:'control', type:'checkbox_circle', name:'test_checkbox_circle', data:{x:45, y:387.5} },
                {collection:'control', type:'checkbox_polygon', name:'test_checkbox_polygon', data:{
                    x:35, y:405,
                    outterPoints:[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20},{x:4,y:20},{x:0,y:16}],
                    innerPoints:[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],
                } },
                {collection:'control', type:'checkbox_image', name:'test_checkbox_image', data:{
                    x:35, y:87.355,
                    uncheckURL:'/images/testImages/Dore-munchausen-illustration.jpg',
                    checkURL:'/images/testImages/mikeandbrian.jpg',
                } },
                {collection:'control', type:'checkboxgrid', name:'test_checkboxgrid', data:{x:60, y:350} },
                {collection:'control', type:'dial_1_continuous', name:'test_dial_1_continuous', data:{x:160, y:360} },
                {collection:'control', type:'dial_2_continuous', name:'test_dial_2_continuous', data:{x:185, y:360} },
                {collection:'control', type:'dial_1_discrete', name:'test_dial_1_discrete', data:{x:160, y:385} },
                {collection:'control', type:'dial_2_discrete', name:'test_dial_2_discrete', data:{x:185, y:385} },
                {collection:'control', type:'dial_continuous_image', name:'test_dial_continuous_image', data:{
                    x:210, y:360, 
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
                    needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } },
                {collection:'control', type:'dial_discrete_image', name:'test_dial_discrete_image', data:{
                    x:210, y:385, 
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
                    needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } },
                {collection:'control', type:'slide_continuous', name:'test_slide_continuous', data:{x:230, y:350} },
                {collection:'control', type:'slide_continuous_image', name:'test_slide_continuous_image', data:{
                    x:245, y:350,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } },
                {collection:'control', type:'slide_discrete', name:'test_slide_discrete', data:{x:260, y:350} },
                {collection:'control', type:'slide_discrete_image', name:'test_slide_discrete_image', data:{
                    x:275, y:350,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } },
                {collection:'control', type:'slidePanel', name:'test_slidePanel', data:{x:290, y:350} },
                {collection:'control', type:'slidePanel_image', name:'test_slidePanel_image', data:{
                    x:375, y:350,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } },
                {collection:'control', type:'rangeslide', name:'test_rangeslide', data:{x:460, y:350} },
                {collection:'control', type:'rangeslide_image', name:'test_rangeslide_image', data:{
                    x:475, y:350,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                    spanURL:'/images/testImages/dark-background_1048-3848.jpg',
                } },
                {collection:'control', type:'list', name:'test_list', data:{
                    x:490, y:350, heightLimit:100, widthLimit:50,
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
                } },
                {collection:'control', type:'needleOverlay', name:'test_needleOverlay', data:{x:545, y:350} },
                {collection:'control', type:'grapher_waveWorkspace', name:'test_grapher_waveWorkspace', data:{x:670,y:350} },
                {collection:'control', type:'sequencer', name:'test_sequencer', data:{x:795,y:350,zoomLevel_x:1/2}  },
            //dynamic
                {collection:'dynamic', type:'connectionNode', name:'test_connectionNode1', data:{ x:25, y:535 }},
                {collection:'dynamic', type:'connectionNode', name:'test_connectionNode2', data:{ x:0, y:585 }},
                {collection:'dynamic', type:'connectionNode', name:'test_connectionNode3', data:{ x:50, y:585 }},
                {collection:'dynamic', type:'connectionNode_signal', name:'test_connectionNode_signal1', data:{ x:125, y:535 }},
                {collection:'dynamic', type:'connectionNode_signal', name:'test_connectionNode_signal2', data:{ x:100, y:585 }},
                {collection:'dynamic', type:'connectionNode_signal', name:'test_connectionNode_signal3', data:{ x:150, y:585 }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'test_connectionNode_voltage1', data:{ x:225, y:535 }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'test_connectionNode_voltage2', data:{ x:200, y:585 }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'test_connectionNode_voltage3', data:{ x:250, y:585 }},
                {collection:'dynamic', type:'connectionNode_data', name:'test_connectionNode_data1', data:{ x:325, y:535 }},
                {collection:'dynamic', type:'connectionNode_data', name:'test_connectionNode_data2', data:{ x:300, y:585 }},
                {collection:'dynamic', type:'connectionNode_data', name:'test_connectionNode_data3', data:{ x:350, y:585 }},
                {collection:'dynamic', type:'connectionNode_audio', name:'test_connectionNode_audio1', data:{ x:425, y:535, isAudioOutput:true}},
                {collection:'dynamic', type:'connectionNode_audio', name:'test_connectionNode_audio2', data:{ x:400, y:585 }},
                {collection:'dynamic', type:'connectionNode_audio', name:'test_connectionNode_audio3', data:{ x:450, y:585 }},
        ],
    };

    //main object
        const object = interface.unit.builder(design);

    //playing with the parts
        const $ = object.elements.canvas.testCanvas.$;
        object.elements.canvas.testCanvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.9,g:0.9,b:0.9,a:1});
        object.elements.canvas.testCanvas._.fillRect($(0),$(0),$(30),$(30));
        object.elements.canvas.testCanvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
        object.elements.canvas.testCanvas._.fillRect($(0),$(0),$(10),$(10));
        object.elements.canvas.testCanvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
        object.elements.canvas.testCanvas._.fillRect($(20),$(0),$(10),$(10));
        object.elements.canvas.testCanvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
        object.elements.canvas.testCanvas._.fillRect($(0),$(20),$(10),$(10));
        object.elements.canvas.testCanvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.754,g:0.859,b:0.573,a:1});
        object.elements.canvas.testCanvas._.fillRect($(20),$(20),$(10),$(10));
        object.elements.canvas.testCanvas.requestUpdate();

        object.elements.needleOverlay.test_needleOverlay.select(0,0.25);
        object.elements.needleOverlay.test_needleOverlay.area(0.5,0.75);
        object.elements.grapher_waveWorkspace.test_grapher_waveWorkspace.select(0,0.2);
        object.elements.grapher_waveWorkspace.test_grapher_waveWorkspace.area(0.5,0.7);
        object.elements.sequencer.test_sequencer.addSignal( 0,0,  10,0.0 );
        object.elements.sequencer.test_sequencer.addSignal( 1,1,  10,0.1 );
        object.elements.sequencer.test_sequencer.addSignal( 2,2,  10,0.2 );
        object.elements.sequencer.test_sequencer.addSignal( 3,3,  10,0.3 );
        object.elements.sequencer.test_sequencer.addSignal( 4,4,  10,0.4 );
        object.elements.sequencer.test_sequencer.addSignal( 5,5,  10,0.5 );
        object.elements.sequencer.test_sequencer.addSignal( 6,6,  10,0.6 );
        object.elements.sequencer.test_sequencer.addSignal( 7,7,  10,0.7 );
        object.elements.sequencer.test_sequencer.addSignal( 8,8,  10,0.8 );
        object.elements.sequencer.test_sequencer.addSignal( 9,9,  10,0.9 );
        object.elements.sequencer.test_sequencer.addSignal( 10,10,10,1.0 );





    //     object.elements.readout_sixteenSegmentDisplay.test_readout_sixteenSegmentDisplay.text('hello');
    //     object.elements.readout_sixteenSegmentDisplay.test_readout_sixteenSegmentDisplay.print();

    //     object.elements.grapher.test_grapher1.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
    //     object.elements.grapher.test_grapher1.draw([0,0.25,1],undefined,1);
        
    //     object.elements.grapher_periodicWave.test_grapher_periodicWave1.updateBackground();
    //     object.elements.grapher_periodicWave.test_grapher_periodicWave1.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
    //     object.elements.grapher_periodicWave.test_grapher_periodicWave1.draw();

    //     object.elements.needleOverlay.test_needleOverlay1.select(0.25);
    //     object.elements.needleOverlay.test_needleOverlay1.area(0.5,0.75);

    //     object.elements.grapher_waveWorkspace.test_grapher_waveWorkspace1.select(0.25);
    //     object.elements.grapher_waveWorkspace.test_grapher_waveWorkspace1.area(0.5,0.75);
        
    //     object.elements.sequencer.test_sequencer1.addSignal( 0,0,  10,0.0 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 1,1,  10,0.1 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 2,2,  10,0.2 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 3,3,  10,0.3 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 4,4,  10,0.4 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 5,5,  10,0.5 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 6,6,  10,0.6 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 7,7,  10,0.7 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 8,8,  10,0.8 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 9,9,  10,0.9 );
    //     object.elements.sequencer.test_sequencer1.addSignal( 10,10,10,1.0 );
    
    return object;
};








this.testUnit_1.devUnit = true;
this.testUnit_1.metadata = {
    name:'Test Unit 1',
    helpURL:'https://curve.metasophiea.com/help/units/test/testUnit_1/'
};