this.data_duplicator = function(x,y){
    var style = {
        background:'fill:rgba(200,200,200,1);pointer-events:none;',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
    };
    var design = {
        type:'data_duplicator',
        x:x, y:y,
        base:{
            points:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
            style:'fill:rgba(200,200,200,0);'
        },
        elements:[
            {type:'connectionNode_data', name:'output_1', data:{ x:-10, y:5, width:20, height:20 }},
            {type:'connectionNode_data', name:'output_2', data:{ x:-10, y:30, width:20, height:20 }},
            {type:'connectionNode_data', name:'input', data:{ 
                x:45, y:5, width:20, height:20,
                receive:function(address,data){
                    obj.io.output_1.send(address,data);
                    obj.io.output_2.send(address,data);
                }
            }},

            {type:'path', name:'backing', data:{
                path:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
                style:style.background
            }},

            {type:'path', name:'upperArrow', data:{
                path:[{x:10, y:11}, {x:2.5,y:16},{x:10, y:21}],
                style:style.markings,
            }},
            {type:'path', name:'lowerArrow', data:{
                path:[{x:10, y:36},{x:2.5,y:41}, {x:10, y:46}],
                style:style.markings,
            }},
            {type:'rect', name:'topHorizontal', data:{
                x:5, y:15, width:45, height:2, 
                style:style.markings,
            }},
            {type:'rect', name:'vertical', data:{
                x:27.5, y:15, width:2, height:25.5, 
                style:style.markings,
            }},
            {type:'rect', name:'bottomHorizontal', data:{
                x:5, y:40, width:24.5, height:2, 
                style:style.markings,
            }},
        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.data_duplicator,design);
    
    return obj;

};
//Operation Note:
//  Data signals that are sent into the 'in' port, are duplicated and sent out the two 'out' ports
//  They are not sent out at the same time; signals are produced from the 1st 'out' port first and 
//  then the 2nd port