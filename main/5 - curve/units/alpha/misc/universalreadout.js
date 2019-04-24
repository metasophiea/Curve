this.universalreadout = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        text:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:4, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'left',vertical:'top'}},
    };
    var design = {
        name: 'universalreadout',
        category:'misc',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[
            {x:-5,y:-5}, 
            {x:10,y:-10}, 

            {x:25,y:-5}, 
            {x:30,y:10}, 

            {x:25,y:25}, 
            {x:10,y:30}, 

            {x:-5,y:25}, 
            {x:-10,y:10}, 
        ],
        // spaceOutline: true,
        elements:[
            {type:'circle', name:'base', data:{
                x:10, y:10, radius:20, colour:style.background,
            }},
            {type:'connectionNode_data', name:'in', data:{
                x: 0, y: 0, width: 20, height: 20,
                onreceive: function(address,data){ print('address: '+address+' data: '+JSON.stringify(data)); }
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.universalreadout,design);

    //internal functions
        var lines = [];
        var lineElements = [];
        var lineLimit = 10;
        var tickerCount = 0;
        function print(text){
            //add ticker to text
            text = (tickerCount++)+'> '+text;

            //add the new text to the list, and if the list becomes too long, remove the oldest item
            lines.unshift(text);
            if( lines.length > lineLimit ){ lines.pop(); }

            //remove all the text elements
            for(var a = 0; a < lineElements.length; a++){ lineElements[a].parent.remove(lineElements[a]); }
            lineElements = [];

            //write in the new list
            for(var a = 0; a < lines.length; a++){
                lineElements[a] = _canvas_.interface.part.builder('text','universalreadout_'+a,{ x:40, y:a*5, width:style.text.size, height:style.text.size, text:lines[a], colour:style.text.colour, font:style.text.font, printingMode:style.text.printingMode })
                object.append( lineElements[a] );
            }
        }

    return object;
};

this.universalreadout.metadata = {
    name:'Universal Readout',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/universalReadout/'
};








this.universalreadout2 = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        text:{colour:{r:0,g:0,b:0,a:1}, size:4, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'left',vertical:'top'}},
    };

    var design = {
        name: 'universalreadout2',
        category:'misc',
        collection: 'alpha',
        x:x, y:y, a:a,
        space: [{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
        // spaceOutline: true,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}], colour:style.background} },
        
            {type:'connectionNode_data', name:'dataIn', data:{ x:5, y:5, width:20, height:20,
                onreceive:function(address,data){ print('data :: address: '+address+' data: '+JSON.stringify(data)); }
            }},
            {type:'connectionNode_signal', name:'signalIn', data:{ x:30, y:5, width:20, height:20,
                onchange:function(value){print('signal :: '+value); },
            }},
            {type:'connectionNode_voltage', name:'voltageIn', data:{ x:5, y:30, width:20, height:20,
                onchange:function(value){print('voltage :: '+value); },
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.universalreadout,design);

    //internal functions
        var lines = [];
        var lineElements = [];
        var lineLimit = 10;
        var tickerCount = 0;
        function print(text){
            //add ticker to text
            text = (tickerCount++)+'> '+text;

            //add the new text to the list, and if the list becomes too long, remove the oldest item
            lines.unshift(text);
            if( lines.length > lineLimit ){ lines.pop(); }

            //remove all the text elements
            for(var a = 0; a < lineElements.length; a++){ lineElements[a].parent.remove(lineElements[a]); }
            lineElements = [];

            //write in the new list
            for(var a = 0; a < lines.length; a++){
                lineElements[a] = _canvas_.interface.part.builder('text','universalreadout_'+a,{ x:60, y:2.5+a*5, width:style.text.size, height:style.text.size, text:lines[a], colour:style.text.colour, font:style.text.font, printingMode:style.text.printingMode })
                object.append( lineElements[a] );
            }
        }

    return object;
};

this.universalreadout2.metadata = {
    name:'Universal Readout V2',
    dev:true,
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/universalReadout2/'
};
