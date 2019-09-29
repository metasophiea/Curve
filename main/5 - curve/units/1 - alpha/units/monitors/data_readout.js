this.data_readout = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'data_readout/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:1220, height:920 },
                    design: { width:20, height:15 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'data_readout',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                               },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_data', name:'in', data:{ 
                    x:unitStyle.drawingValue.width-3.5, y:unitStyle.drawingValue.height-30, width:5, height:15, angle:0, cableVersion:2, style:style.connectionNode.data,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                },
            ]
        });

    //circuitry
        var lineCount = 0;
        var maxLineCount = 25;
        var lines = [];
        var lineElements = [];
        var textStyle = {
            colour:{r:1,g:1,b:1,a:1}, 
            size:4, 
            font:'defaultThin', 
            printingMode:{widthCalculation:'absolute',horizontal:'left',vertical:'top'}
        };
        var maxPrintingWidth = 175;

        function printLine(line){
            //add the new text to the list, and if the list becomes too long, remove the oldest item
                lines.unshift( { prefix:(lineCount++)+':/> ', line:line } );

            //empty screen of text
                for(var a = 0; a < lineElements.length; a++){ lineElements[a].parent.remove(lineElements[a]); }
                lineElements = [];

            //write all lines to screen
                for(var a = 0; a < lines.length; a++){
                    lineElements[a] = _canvas_.interface.part.builder('basic','text','screenText_'+a,{ 
                        x:12.5, y:12.5 + a*5, 
                        width:textStyle.size,
                        height:textStyle.size, 
                        text:lines[a].prefix + lines[a].line, 
                        colour:textStyle.colour, 
                        font:textStyle.font, 
                        printingMode:textStyle.printingMode
                    });

                    //check the width of the created line, trim characters off until its within the defined width (storing the characters)
                    var leftOvers = '';
                    while( lineElements[a].resultingWidth() > maxPrintingWidth ){
                        leftOvers = lineElements[a].string().substring(lineElements[a].string().length-1) + leftOvers;
                        lineElements[a].string( lineElements[a].string().slice(0,-1) );
                    }

                    //if there are characters that were trimmed, add them in their own line
                    //also correct the original line
                    if(leftOvers.length > 0){
                        lines.splice(a+1,0,{prefix:lines[a].prefix,line:leftOvers});
                        lines[a].line = lineElements[a].string().slice(lines[a].prefix.length);
                    }

                    object.append( lineElements[a] );

                //if there are too many lines, cut off the oldest
                    while(lines.length > maxLineCount){ lines.pop(); }
            }
        }

    //wiring
        //io
            object.io.data.in.onreceive = function(address,data){ printLine( JSON.stringify({address:address, data:data}) ); };

    return object;
};
this.data_readout.metadata = {
    name:'Data Readout',
    category:'monitors',
    helpURL:'/help/units/beta/data_readout/'
};
