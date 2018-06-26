objects.launchpad = function(x,y,debug=false){
    var values = {
        xCount:8, yCount:8,
    };
    var style = {
        background:'fill:rgba(200,200,200,1)',
        text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
        button: {
            up: 'fill:rgba(175,175,175,1)',
            hover: 'fill:rgba(220,220,220,1)',
            down: 'fill:rgba(150,150,150,1)'
        },
        grid: {
            backing: 'fill:rgba(200,175,200,1)',
            check: 'fill:rgba(150,125,150,1)',
            backingGlow: 'fill:rgba(225,175,225,1)',
            checkGlow:'fill:rgba(200,125,200,1)'
        },
        sevenSegmentDisplay:{
            background:'fill:rgba(200,175,200,1)',
            glow:'fill:rgba(225,225,225,1)',
            dim:'fill:rgba(150,125,150,1',
        }
    };
    var design = {
        type: 'launchpad',
        x: x, y: y,
        base: {
            type:'path',
            points:[{x:0,y:0},{x:125,y:0},{x:125,y:50},{x:100,y:60},{x:100,y:100},{x:0,y:100}], 
            style:style.background
        },
        elements:[
            //input data
                {type:'connectionNode_data', name:'pulse', data:{ 
                    x: 125, y: 5, width: 5, height: 10,
                    receive:function(){obj.internalCircuits.inc();lightLine();}
                }},
                {type:'connectionNode_data', name:'nextPage', data:{ 
                    x: 125, y: 22.5, width: 5, height: 10,
                    receive:function(){obj.internalCircuits.incPage();}
                }},
                {type:'connectionNode_data', name:'prevPage', data:{ 
                    x: 125, y: 35, width: 5, height: 10,
                    receive:function(){obj.internalCircuits.decPage();}
                }},
            //pulse
                {type:'button_rect',name:'pulse',data:{
                    x:100, y:5, width:20, height:10,
                    style:{
                        up:style.button.up,
                        hover:style.button.hover,
                        down:style.button.down,
                    },
                    onmousedown:function(){obj.internalCircuits.inc();lightLine();},
                }},
            //rastorgrid
                {type:'rastorgrid',name:'rastorgrid',data:{
                    x:5, y:5, width:90, height:90,
                    xCount:values.xCount, yCount:values.yCount,
                    style:{
                        backing: style.grid.backing, 
                        check:style.grid.check, 
                        backingGlow:style.grid.backingGlow, 
                        checkGlow:style.grid.checkGlow
                    },
                    onchange:function(data){obj.internalCircuits.importPage(data);},
                }},
            //page select
                {type:'sevenSegmentDisplay',name:'pageNumber',data:{
                    x:100, y:22.5, width:20, height:22.5,
                    style:{
                        background:style.sevenSegmentDisplay.background,
                        glow:style.sevenSegmentDisplay.glow,
                        dim:style.sevenSegmentDisplay.dim,
                    }
                }},
                {type:'button_rect',name:'nextPage',data:{
                    x:102.5, y:17.5, width:15, height:5,
                    style:{
                        up:style.button.up,
                        hover:style.button.hover,
                        down:style.button.down,
                    },
                    onmousedown:function(){obj.internalCircuits.incPage();},
                }},
                {type:'button_rect',name:'prevPage',data:{
                    x:102.5, y:45, width:15, height:5,
                    style:{
                        up:style.button.up,
                        hover:style.button.hover,
                        down:style.button.down,
                    },
                    onmousedown:function(){obj.internalCircuits.decPage();},
                }},
        ]
    };
    //dynamic design
        for(var a = 0; a < values.yCount; a++){
            //data-out ports
            design.elements.push(
                {type:'connectionNode_data', name:'out_'+a, data:{
                    x: -5, y: a*12.5 + 2.5, width: 5, height: 7.5,
                }},
            );
        }


    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.universalreadout,design);

    //internal functions
        function lightLine(){
            for(var a = 0; a < values.yCount; a++){
                design.rastorgrid.rastorgrid.light(obj.internalCircuits.previousPosition(),a,false);
                design.rastorgrid.rastorgrid.light(obj.internalCircuits.position(),a,true);
            }
        }
        function pageChange(data){
            design.sevenSegmentDisplay.pageNumber.enterCharacter(''+data);
            var newPage = obj.internalCircuits.exportPage();

            if(newPage == undefined){
                design.rastorgrid.rastorgrid.clear();
            }else{
                design.rastorgrid.rastorgrid.set(newPage);
            }
        }

    //circuitry
        obj.internalCircuits = new parts.circuits.sequencing.launchpad(values.xCount, values.yCount);
        obj.internalCircuits.commands = function(data){
            for(var a = 0; a < values.yCount; a++){
                obj.io['out_'+a].send('pulse',data[a]);
            }
        };
        obj.internalCircuits.pageChange = pageChange;

    //setup 
        lightLine();
        design.sevenSegmentDisplay.pageNumber.enterCharacter('0');

    return obj;
};