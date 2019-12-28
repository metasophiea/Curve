console.log('%c- detectIntersect', 'font-weight: bold;');
    //pointWithinBoundingBox
        console.log('%c-- pointWithinBoundingBox', 'font-weight: bold;');
        {
            const testingPairs = [
                {point:{x:5,y:5},                  box:{topLeft:{x:0,y:0},bottomRight:{x:10,y:10}}, result:true},
                {point:{x:50,y:5},                 box:{topLeft:{x:0,y:0},bottomRight:{x:10,y:10}}, result:false},
                {point:{x:0,y:0},                  box:{topLeft:{x:0,y:0},bottomRight:{x:10,y:10}}, result:true},
                {point:{x:10,y:0},                 box:{topLeft:{x:0,y:0},bottomRight:{x:10,y:10}}, result:true},
                {point:{x:10,y:10},                box:{topLeft:{x:0,y:0},bottomRight:{x:10,y:10}}, result:true},
                {point:{x:0,y:10},                 box:{topLeft:{x:0,y:0},bottomRight:{x:10,y:10}}, result:true},
                {point:{x:-0.000000000000001,y:0}, box:{topLeft:{x:0,y:0},bottomRight:{x:10,y:10}}, result:false},
            ];
            testingPairs.forEach(pair => {
                tester( _canvas_.library.math.detectIntersect.pointWithinBoundingBox( pair.point, pair.box ), pair.result );
            });
        }

    //boundingBoxes
        console.log('%c-- boundingBoxes', 'font-weight: bold;');
        {
            const testingPairs = [
                    {box_a:{ topLeft:{x:0,y:0}, bottomRight:{x:10,y:10} }, box_b:{ topLeft:{x:5,y:5}, bottomRight:{x:15,y:15} },   result:true},
                    {box_a:{ topLeft:{x:0,y:0}, bottomRight:{x:10,y:10} }, box_b:{ topLeft:{x:15,y:15}, bottomRight:{x:25,y:25} }, result:false},
                    {box_a:{ topLeft:{x:0,y:0}, bottomRight:{x:10,y:10} }, box_b:{ topLeft:{x:0,y:0}, bottomRight:{x:10,y:10} },   result:true},
                    {box_a:{ topLeft:{x:0,y:0}, bottomRight:{x:10,y:10} }, box_b:{ topLeft:{x:10,y:0}, bottomRight:{x:20,y:10} },  result:true},
                    {box_a:{ topLeft:{x:0,y:0}, bottomRight:{x:10,y:10} }, box_b:{ topLeft:{x:11,y:0}, bottomRight:{x:20,y:10} },  result:false},
            ];
            testingPairs.forEach(pair => {
                tester( _canvas_.library.math.detectIntersect.boundingBoxes( pair.box_a, pair.box_b ), pair.result );
            });
        }
    //pointOnLine
        console.log('%c-- pointOnLine', 'font-weight: bold;');
        {
            const testingPairs = [
                {point: {x:10,y:10}, line:[{x:100,y:100},{x:100,y:100}], result:false},
                {point: {x:100,y:100}, line:[{x:100,y:100},{x:100,y:100}], result:true},
                {point: {x:10,y:10}, line:[{x:0,y:0},{x:100,y:100}], result:true},
                {point: {x:0,y:0}, line:[{x:0,y:0},{x:100,y:100}], result:true},
                {point: {x:100,y:100}, line:[{x:0,y:0},{x:100,y:100}], result:true},
                {point: {x:50,y:50}, line:[{x:0,y:0},{x:100,y:100}], result:true},
                {point: {x:50,y:51}, line:[{x:0,y:0},{x:100,y:100}], result:false},
                {point: {x:50,y:50}, line:[{x:0,y:50},{x:100,y:50}], result:true},
                {point: {x:50,y:49}, line:[{x:0,y:50},{x:100,y:50}], result:false},
                {point: {x:20,y:49}, line:[{x:20,y:10},{x:20,y:50}], result:true},
                {point: {x:21,y:49}, line:[{x:20,y:10},{x:20,y:50}], result:false},
                {point: {x:0,y:0}, line:[{x:1,y:1},{x:9,y:9}], result:false},
            ];
            testingPairs.forEach(pair => {
                tester( _canvas_.library.math.detectIntersect.pointOnLine( pair.point, pair.line ), pair.result );
            });
        }
    //pointWithinPoly
        console.log('%c-- pointWithinPoly', 'font-weight: bold;');
        {
            const testingPairs = [
                {point:{x:0,y:0},                  poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'onPoint'},
                {point:{x:-0.001,y:0},             poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'outside'},
                {point:{x:-0.000000000000001,y:0}, poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'outside'},
                {point:{x:1,y:1},                  poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'inside'},
                {point:{x:2.5,y:0},                poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'onEdge'},
                {point:{x:4.9999,y:4.9999},        poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'inside'},
                {point:{x:5,y:5},                  poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'onEdge'},
                {point:{x:5.0001,y:5.0001},        poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'outside'},
                {point:{x:5.1,y:5.1},              poly:{points:[{x:0,y:0},{x:10,y:0},{x:0,y:10}]},                         result:'outside'},
                {point:{x:115,y:30},               poly:{points:[{x:0,y:0},{x:400,y:200},{x:400,y:400},{x:0,y:400}]},       result:'outside'},
                {point:{x:200,y:0},                poly:{points:[{x:0,y:0},{x:400,y:200},{x:400,y:400},{x:0,y:400}]},       result:'outside'},
                {point:{x:399,y:0},                poly:{points:[{x:0,y:0},{x:400,y:200},{x:400,y:400},{x:0,y:400}]},       result:'outside'},
                {point:{x:400,y:0},                poly:{points:[{x:0,y:0},{x:400,y:200},{x:400,y:400},{x:0,y:400}]},       result:'outside'},
                {point:{x:400,y:1},                poly:{points:[{x:0,y:0},{x:400,y:200},{x:400,y:400},{x:0,y:400}]},       result:'outside'},
                {point:{x:400,y:-1},               poly:{points:[{x:0,y:0},{x:400,y:200},{x:400,y:400},{x:0,y:400}]},       result:'outside'},
                {point:{x:10,y:20},                poly:{points:[{x:0,y:0},{x:400,y:200},{x:400,y:400},{x:0,y:400}]},       result:'inside'},
                {point:{x:5,y:0},                  poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},             result:'onEdge'},
                {point:{x:5,y:5},                  poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},             result:'inside'},
                {point:{x:420,y:410},              poly:{points:[{x:300,y:360},{x:300,y:410},{x:350,y:410},{x:350,y:360}]}, result:'outside'},
                {point:{x:420,y:190},              poly:{points:[{x:300,y:360},{x:300,y:410},{x:350,y:410},{x:350,y:360}]}, result:'outside'},
            ];
            testingPairs.forEach(pair => {
                tester( _canvas_.library.math.detectIntersect.pointWithinPoly( pair.point, pair.poly ), pair.result );
            });
        }
    //lineOnLine
        console.log('%c-- lineOnLine', 'font-weight: bold;');
        //the function tells where the lines would intersect if they were infinitely long in both directions,
        //'intersect' reveals if this point is within both the segments given
        //'contact' shows if the two segments touch in any way
        //so, a configuration like X will be in contact and intersect, but T will only be in contact
        { 
            const testingPairs = [
                {line_a:[{x:0,y:0},{x:5,y:5}],  line_b:[{x:5,y:0},{x:0,y:5}],     result:{x:2.5, y:2.5, intersect:true, contact:true}               },
                {line_a:[{x:0,y:0},{x:5,y:0}],  line_b:[{x:0,y:2},{x:5,y:2}],     result:{x:undefined, y:undefined, intersect:false, contact:false} },
                {line_a:[{x:0,y:2},{x:5,y:2}],  line_b:[{x:0,y:2},{x:5,y:2}],     result:{x:undefined, y:undefined, intersect:false, contact:true}  },
                {line_a:[{x:0,y:2},{x:3,y:2}],  line_b:[{x:0,y:2},{x:5,y:2}],     result:{x:0, y:2, intersect:false, contact:true}                  },
                {line_a:[{x:0,y:0},{x:5,y:5}],  line_b:[{x:0,y:1},{x:0,y:2}],     result:{x:0, y:0, intersect:false, contact:false}                 },
                {line_a:[{x:0,y:0},{x:5,y:5}],  line_b:[{x:2.5,y:2.5},{x:0,y:5}], result:{x:2.5, y:2.5, intersect:false, contact:true}              },
                {line_a:[{x:0,y:0},{x:5,y:5}],  line_b:[{x:0,y:5},{x:2.5,y:2.5}], result:{x:2.5, y:2.5, intersect:false, contact:true}              },
                {line_a:[{x:0,y:0},{x:0,y:5}],  line_b:[{x:0,y:5},{x:2.5,y:2.5}], result:{x:0, y:5, intersect:false, contact:true}                  },
                {line_a:[{x:1,y:1},{x:9,y:9}],  line_b:[{x:0,y:0},{x:0,y:10}],    result:{x:undefined, y:undefined, intersect:false, contact:false} },
                {line_a:[{x:0,y:0},{x:0,y:10}], line_b:[{x:0,y:0},{x:0,y:10}],    result:{x:undefined, y:undefined, intersect:false, contact:true}  },
            ];
            testingPairs.forEach(pair => {
                tester( _canvas_.library.math.detectIntersect.lineOnLine( pair.line_a, pair.line_b ), pair.result );
            });
        }
    //lineOnPoly
        console.log('%c-- lineOnPoly', 'font-weight: bold;');
        { 
            const testingPairs = [
                {line:[{x:-5,y:5},{x:15,y:5}],       poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:5},{x:10,y:5}],        intersect:true,  contact:true}  },
                {line:[{x:-5,y:5},{x:5,y:5}],        poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:5}],                   intersect:true,  contact:true}  },
                {line:[{x:-5,y:5},{x:15,y:5}],       poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:5},{x:10,y:5}],        intersect:true,  contact:true}  },
                {line:[{x:5,y:5},{x:15,y:5}],        poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:10,y:5}],                  intersect:true,  contact:true}  },
                {line:[{x:-5,y:0},{x:0,y:10}],       poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:10}],                  intersect:false, contact:true}  },
                {line:[{x:-5,y:-5},{x:5,y:5}],       poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:0}],                   intersect:true,  contact:true}  },
                {line:[{x:-5,y:-5},{x:0,y:5}],       poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:5}],                   intersect:false, contact:true}  }, //skirt 
                {line:[{x:0,y:0},{x:10,y:0}],        poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:0},{x:10,y:0}],        intersect:false, contact:true}  }, //skirt 
                {line:[{x:400,y:400},{x:410,y:400}], poly:{points:[{x:400,y:400},{x:410,y:400},{x:420,y:410},{x:430,y:420},{x:430,y:450},{x:400,y:450}]}, result:{points:[{x:400,y:400},{x:410,y:400}], intersect:false, contact:true}  }, //skirt 
                {line:[{x:0,y:0},{x:10,y:10}],       poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:0},{x:10,y:10}],       intersect:true,  contact:true}  }, //perfect traversal
                {line:[{x:1,y:1},{x:9,y:9}],         poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[],                            intersect:true,  contact:false} }, //completely within
                {line:[{x:-10,y:0},{x:10,y:10}],     poly:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},                                         result:{points:[{x:0,y:5},{x:10,y:10}],       intersect:true,  contact:true}  },

            ];
            testingPairs.forEach(pair => {
                tester( _canvas_.library.math.detectIntersect.lineOnPoly( pair.line, pair.poly ), pair.result );
            });
        }
    //polyOnPoly
        console.log('%c-- polyOnPoly', 'font-weight: bold;');
        {
            const testingPairs = [
                //totally separate shapes
                    {   
                        poly_a:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},     
                        poly_b:{points:[{x:15,y:15},{x:25,y:15},{x:25,y:25},{x:15,y:25}]}, 
                        result:{points:[], intersect:false, contact:false}
                    },
                //simple overlap
                    {   
                        poly_a:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},     
                        poly_b:{points:[{x:5,y:5},{x:15,y:5},{x:15,y:15},{x:5,y:15}]}, 
                        result:{points:[{x:10,y:5},{x:5,y:10}], intersect:true, contact:true}
                    },
                //the same shape twice
                    {   
                        poly_a:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},     
                        poly_b:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]}, 
                        result:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}], intersect:true, contact:true}
                    },
                //shape totally inside the other shape
                    {   
                        poly_a:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]},     
                        poly_b:{points:[{x:1,y:1},{x:9,y:1},{x:9,y:9},{x:1,y:9}]}, 
                        result:{points:[], intersect:true, contact:false}
                    },
                //same, but the other way around
                    {   
                        poly_a:{points:[{x:1,y:1},{x:9,y:1},{x:9,y:9},{x:1,y:9}]},         
                        poly_b:{points:[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]}, 
                        result:{points:[], intersect:true, contact:false}
                    },
                //overlapping sides (like a cross shape)
                    {   
                        poly_a:{points:[{x:0,y:0},{x:100,y:0},{x:100,y:10},{x:0,y:10}]},   
                        poly_b:{points:[{x:50,y:-50},{x:60,y:-50},{x:60,y:50},{x:50,y:50}]}, 
                        result:{points:[{x:50,y:0},{x:60,y:0},{x:50,y:10},{x:60,y:10}], intersect:true, contact:true}
                    },
                //live examples (should all be 'true')
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:50,y:50},{x:105,y:50},{x:105,y:105},{x:50,y:105}]},
                        result:{points:[{x:68,y:50},{x:68,y:105}],contact:true,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:875,y:50},{x:930,y:50},{x:930,y:105},{x:875,y:105}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:150,y:50},{x:345,y:50},{x:345,y:160},{x:150,y:160}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:400,y:50},{x:500,y:50},{x:500,y:105},{x:400,y:105}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:550,y:50},{x:790,y:50},{x:790,y:90},{x:740,y:140},{x:550,y:140}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:25,y:130},{x:35,y:120},{x:59.166666666666664,y:120},{x:71.125,y:130},{x:81.375,y:130},{x:93.33333333333333,y:120},{x:117.5,y:120},{x:127.5,y:130},{x:127.5,y:205},{x:117.5,y:215},{x:93.33333333333333,y:215},{x:81.375,y:205},{x:71.125,y:205},{x:59.166666666666664,y:215},{x:35,y:215},{x:25,y:205}]},
                        result:{points:[{x:68,y:127.38675958188156},{x:68,y:207.61324041811847}],contact:true,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:160,y:175},{x:242.5,y:175},{x:252.5,y:245},{x:201.25,y:275},{x:150,y:245}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:280,y:180},{x:331.25,y:170},{x:382.5,y:180},{x:382.5,y:210},{x:331.25,y:220},{x:280,y:210}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:425,y:160},{x:645,y:160},{x:645,y:215},{x:425,y:215}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:425,y:220},{x:645,y:220},{x:645,y:275},{x:425,y:275}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:425,y:280},{x:645,y:280},{x:645,y:335},{x:425,y:335}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:425,y:340},{x:645,y:340},{x:645,y:420},{x:425,y:420}]},
                        result:{points:[{x:425,y:355},{x:645,y:355}],contact:true,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:675,y:160},{x:895,y:160},{x:895,y:545},{x:675,y:545}]},
                        result:{points:[{x:675,y:355},{x:895,y:355}],contact:true,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:355,y:110},{x:530,y:110},{x:530,y:150},{x:355,y:150}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:15,y:285},{x:25,y:285},{x:37.5,y:275},{x:52.5,y:275},{x:65,y:285},{x:260,y:285},{x:260,y:315},{x:65,y:315},{x:52.5,y:325},{x:37.5,y:325},{x:25,y:315},{x:15,y:315}]}, 
                        result:{points:[{x:68,y:285},{x:68,y:315}],contact:true,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:270,y:225},{x:395,y:225},{x:395,y:275},{x:370,y:285},{x:370,y:325},{x:270,y:325}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:830,y:50},{x:820,y:52.67949192431122},{x:812.6794919243113,y:60},{x:810,y:70},{x:812.6794919243113,y:80},{x:820,y:87.32050807568876},{x:830,y:90},{x:840,y:87.32050807568878},{x:847.3205080756887,y:80},{x:850,y:70},{x:847.3205080756887,y:60.000000000000014},{x:840,y:52.679491924311236}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:790,y:120},{x:800,y:110},{x:890,y:110},{x:905,y:120},{x:905,y:140},{x:890,y:150},{x:800,y:150},{x:790,y:140}]},
                        result:{points:[],contact:false,intersect:true}
                    },
                    {
                        poly_a:{points:[{x:1027,y:34},{x:1027,y:355},{x:68,y:355},{x:68,y:34}]}, 
                        poly_b:{points:[{x:80,y:330},{x:400,y:330},{x:400,y:392.5},{x:80,y:392.5}]},
                        result:{points:[{x:80,y:355},{x:400,y:355}],contact:true,intersect:true}
                    },
            ];
            testingPairs.forEach(pair => {
                tester( _canvas_.library.math.detectIntersect.polyOnPoly( pair.poly_a, pair.poly_b ), pair.result ); 
            });
        }