this.universalreadout = function(x,y,a){
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        text:{fill:'rgba(0,0,0,1)', size:0.75, font:'Courier New'},
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
                x:10, y:10, r:20, style:style.background,
            }},
            {type:'connectionNode_data', name:'in', data:{
                x: 0, y: 0, width: 20, height: 20,
                onreceive: function(address,data){ print('address: '+address+' data: '+JSON.stringify(data)); }
            }},
        ]
    };

    //main object
        var object = alphaUnit.builder(this.universalreadout,design);

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
                lineElements[a] = workspace.interface.part.alpha.builder('text','universalreadout_'+a,{ x:40, y:a*5, size:style.text.size, text:lines[a], style:style.text })
                object.append( lineElements[a] );
            }
        }

    return object;
};

this.universalreadout.metadata = {
    name:'Universal Readout',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/universalReadout/'
};