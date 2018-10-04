this.universalreadout = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
    };
    var design = {
        type: 'universalreadout',
        x: x, y: y,
        base: {
            type:'circle',
            x:10, y:10, r:20,
            style:style.background
        },
        elements:[
            {type:'connectionNode_data', name:'in', data:{
                x: 0, y: 0, width: 20, height: 20,
                receive: function(address,data){ print('address: '+address+' data: '+JSON.stringify(data)); }
            }},
        ]
    };

    //main object
        var obj = system.utility.misc.objectBuilder(objects.universalreadout,design);

    //internal functions
        var lines = [];
        var lineElements = [];
        var lineLimit = 10;
        function print(text){
            //add the new text to the list, and if the list becomes too long, remove the oldest item
            lines.unshift(text);
            if( lines.length > lineLimit ){ lines.pop(); }

            //remove all the text elements
            for(var a = 0; a < lineElements.length; a++){ lineElements[a].remove(); }
            lineElements = [];

            //write in the new list
            for(var a = 0; a < lines.length; a++){
                lineElements[a] = system.utility.misc.elementMaker('text','universalreadout_'+a,{ x:40, y:a*5, text:lines[a], style:style.text })
                obj.append( lineElements[a] );
            }
        }

    return obj;
};

this.universalreadout.metadata = {
    name:'Universal Readout',
    helpurl:'https://metasophiea.com/curve/help/objects/universalReadout/'
};