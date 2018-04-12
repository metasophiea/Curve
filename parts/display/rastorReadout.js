this.rastorReadout = function(
    id='rastorReadout',
    x, y, width, height,
    characterCount,
    xGappage=1, yGappage=1
){
    //values
        var values = {
            width: 5, height: 5,
            chars: {
                a: {
                    size:{x:5,y:5},
                    stamp:[
                        [0,0,0,0,0],
                        [0,1,1,0,0],
                        [1,0,0,1,0],
                        [1,0,0,1,0],
                        [0,1,1,0,1]
                    ]
                },
                s:{
                    size:{x:3,y:4},
                    stamp:[
                        [0,1,1],
                        [1,1,0],					 
                        [0,0,1],					 
                        [1,1,0]
                    ]
                }
            }
        };

    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //displays
        var displays = [];
        var widthPerDisplay = width/characterCount;
        for(var a = 0; a < characterCount; a++){
            var temp = {};
            temp.display = parts.display.rastorDisplay(null, a*widthPerDisplay, y, widthPerDisplay, height, values.width, values.height);
                object.appendChild(temp.display);
            temp.char = '';
            displays.push(temp);
        }

    
    //methods
        object.set = function(display,char){
            displays[display].char = char;

            var temp = values.chars[char].stamp;
            for(var y = 0; y < temp.length; y++){
                for(var x = 0; x < temp[y].length; x++){
                    temp[y][x] =  temp[y][x] == 1 ? [1,1,1] : [0,0,0];
                }
            }

            displays[display].display.reverseLoad(temp);
        }
        object.test = function(){
            console.log( displays );
            this.set(0,'a');
        };

    return object;
}