this.launchpad = function(x,y,a){
    var values = {
        xCount:8, yCount:8,
    };
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},

        button: {
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        },
        grid: {
            backing:{r:200/255,g:175/255,b:200/255,a:1},
            check:{r:150/255,g:125/255,b:150/255,a:1},
            backingGlow:{r:225/255,g:175/255,b:225/255,a:1},
            checkGlow:{r:200/255,g:125/255,b:200/255,a:1}
        },
    };
    var design = {
        name: 'launchpad',
        category:'sequencers',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:125,y:0},{x:125,y:50},{x:100,y:60},{x:100,y:100},{x:0,y:100}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:125,y:0},{x:125,y:50},{x:100,y:60},{x:100,y:100},{x:0,y:100}], colour:style.background }},

            //input data
                {type:'connectionNode_data', name:'pulse_input', data:{ x: 125, y: 5, width: 5, height: 10 }},
                {type:'connectionNode_data', name:'nextPage_input', data:{ x: 125, y: 22.5, width: 5, height: 10 }},
                {type:'connectionNode_data', name:'prevPage_input', data:{ x: 125, y: 35, width: 5, height: 10 }},
            //pulse
                {type:'button_rectangle',name:'pulse_button',data:{ x:100, y:5, width:20, height:10, style:style.button }},
            //rastorgrid
                {type:'rectangle', name:'rastorBacking', data:{x:5, y:5, width:90, height:90, colour:style.grid.backing}},
                {type:'rastorgrid',name:'rastorgrid',data:{ x:5, y:5, width:90, height:90, xCount:values.xCount, yCount:values.yCount, style:style.grid }},
            //page select
                {type:'sevenSegmentDisplay',name:'pageNumber',data:{ x:100, y:22.5, width:20, height:22.5}},
                {type:'button_rectangle',name:'nextPage',data:{ x:102.5, y:17.5, width:15, height:5, style:style.button }},
                {type:'button_rectangle',name:'prevPage',data:{ x:102.5, y:45, width:15, height:5, style:style.button }},
        ]
    };
    //dynamic design
        for(var a = 0; a < values.yCount; a++){
            design.elements.push( {type:'connectionNode_data', name:'out_'+a, data:{ x: -5, y: a*12.5 + 2.5, width: 5, height: 7.5 }} );
        }


    //main object
        var object = _canvas_.interface.unit.builder(this.launchpad,design);

    //import/export
        object.exportData = function(){
            return {
                currentPage: object.internalCircuits.page(),
                data: object.internalCircuits.exportPages(),
            };
        };
        object.importData = function(data){
            if(data.data != undefined){ object.internalCircuits.importPages(data.data); }
            if(data.currentPage){ object.internalCircuits.page(data.currentPage); }
        };

    //internal functions
        function lightLine(){
            for(var a = 0; a < values.yCount; a++){
                object.elements.rastorgrid.rastorgrid.light(object.internalCircuits.previousPosition(),a,false);
                object.elements.rastorgrid.rastorgrid.light(object.internalCircuits.position(),a,true);
            }
        }
        function pageChange(data){
            object.elements.sevenSegmentDisplay.pageNumber.enterCharacter(''+data);
            var newPage = object.internalCircuits.exportPage();

            if(newPage == undefined){
                object.elements.rastorgrid.rastorgrid.clear();
            }else{
                object.elements.rastorgrid.rastorgrid.set(newPage);
            }
        }

    //circuitry
        object.internalCircuits = new this.launchpad.sequencer(values.xCount, values.yCount);
        object.internalCircuits.commands = function(data){
            for(var a = 0; a < values.yCount; a++){
                if(data[a]){ object.io.data['out_'+a].send('pulse'); }
            }
        };
        object.internalCircuits.pageChange = pageChange;

    //wiring
        object.elements.connectionNode_data.pulse_input.onreceivedata = function(){object.internalCircuits.inc();lightLine();};
        object.elements.connectionNode_data.nextPage_input.onreceivedata = function(){object.internalCircuits.incPage();};
        object.elements.connectionNode_data.prevPage_input.onreceivedata = function(){object.internalCircuits.decPage();};
        object.elements.button_rectangle.pulse_button.onpress = function(){object.internalCircuits.inc();lightLine();};
        object.elements.rastorgrid.rastorgrid.onchange = function(data){object.internalCircuits.importPage(data);};
        object.elements.button_rectangle.nextPage.onpress = function(){object.internalCircuits.incPage();};
        object.elements.button_rectangle.prevPage.onpress = function(){object.internalCircuits.decPage();};

    //interface
        object.i = {
            importPage:function(data,a){object.internalCircuits.importPage(data,a);},
            exportPage:function(a){return object.internalCircuits.exportPage(a);},
            importPages:function(data){object.internalCircuits.importPages(data);},
            exportPages:function(){return object.internalCircuits.exportPages();},
            setPage:function(a){object.internalCircuits.page(a);}
        };

    //setup 
        lightLine();
        object.elements.sevenSegmentDisplay.pageNumber.enterCharacter('0');

    return object;
};








this.launchpad.metadata = {
    name:'Launchpad',
    category:'sequencer',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/launchpad/'
};








this.launchpad.sequencer = function(xCount,yCount){
    var pages = [];
    var pageCount = 10;
    var currentPage = 0;
    var position = 0;
    var previousPosition = xCount-1;

    //internal functions
        function makePage(xCount,yCount,fill){
            return Array(xCount).fill(Array(yCount).fill(fill));
        }

    //controls
        //getting/setting a square or a column
            this.square = function(x,y,value){
                if(x < 0){x = 0;}else if(x > xCount-1){x = xCount-1;}
                if(y < 0){y = 0;}else if(x > yCount-1){x = yCount-1;}

                if(value == undefined){return pages[currentPage][y][x];}

                pages[currentPage][y][x] = value;
            };
            this.line = function(a,data){
                if(a == undefined){a = position;}

                if(data == undefined){
                    var line = [];
                    for(var a = 0; a < yCount; a++){
                        if( 
                            pages[currentPage] == undefined || 
                            pages[currentPage][a] == undefined || 
                            pages[currentPage][a][position] == undefined
                        ){ line.push(false); }
                        else{ line.push(pages[currentPage][a][position]); }
                    }
                    return line;
                }else{
                    for(var a = 0; a < yCount; a++){
                        pages[currentPage][a][position] = data[a];
                    }
                }
            };

        //getting/setting the playhead position
            this.position = function(a,react=true){
                if(a == undefined){return position;}
                previousPosition = position;

                if(a > xCount-1){a = 0;}
                else if(a < 0){a = xCount-1;}

                position = a;
                if(react){this.commands(this.line());}
            };
            this.previousPosition = function(){return previousPosition;};
            this.inc = function(){ this.position(position+1); };
            this.dec = function(){ this.position(position-1); };

        //getting/setting the page number
            this.page = function(a){
                if(a == undefined){return currentPage;}

                if(a == -1){a = pageCount-1;}
                else if(a < 0){a = 0;}
                else if(a == pageCount){a = 0;}
                else if(a >= pageCount){a = pageCount-1;}
                currentPage = a;
                if(this.pageChange != undefined){this.pageChange(currentPage);}
            };
            this.incPage = function(){ this.page(currentPage+1); };
            this.decPage = function(){ this.page(currentPage-1); };


        //getting/setting the data ina page or all pages
            this.exportPages = function(){
                return JSON.parse(JSON.stringify(pages));
            };
            this.importPages = function(data){
                pages = data;
                this.pageChange(currentPage);
            };
            this.exportPage = function(a){
                if(a == undefined){a = currentPage;}
                if(pages[a] == undefined){ return makePage(xCount,yCount,false); }
                return JSON.parse(JSON.stringify(pages[a]));
            };
            this.importPage = function(data,a){
                if(a == undefined){a = currentPage;}
                pages[a] = data;
                if(this.pageChange != undefined){this.pageChange(currentPage);}
            };
        

    //callbacks
        this.commands = function(){};
        this.pageChange = function(){};
};