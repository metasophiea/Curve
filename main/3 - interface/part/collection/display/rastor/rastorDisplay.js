this.rastorDisplay = function(
    name='rastorDisplay',
    x, y, angle=0, width=60, height=60,
    xCount=8, yCount=8, xGappage=0.1, yGappage=0.1,
    backingColour={r:0.2,g:0.2,b:0.2,a:1}, defaultPixelValue={r:0,g:0,b:0,a:1},
){
    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //backing
            const backing = interfacePart.builder('basic','rectangle','backing',{ width:width, height:height, colour:backingColour });
            object.append(backing);
        //pixels
            const pixelGroup = interfacePart.builder('basic','group','pixels');
            object.append(pixelGroup);

            const pixels = [];
            const pixelValues = [];
            const pixWidth = width/xCount;
            const pixHeight = height/yCount;

            for(let x = 0; x < xCount; x++){
                const temp_pixels = [];
                const temp_pixelValues = [];
                for(let y = 0; y < yCount; y++){
                    let rectangle = interfacePart.builder('basic','rectangle',x+'_'+y,{ 
                        x:(x*pixWidth)+xGappage/2,  y:(y*pixHeight)+yGappage/2, 
                        width:pixWidth-xGappage,    height:pixHeight-yGappage,
                        colour:defaultPixelValue,
                    });
                        
                    temp_pixels.push(rectangle);
                    temp_pixelValues.push([0,0,0]);
                    pixelGroup.append(rectangle);
                }
                pixels.push(temp_pixels);
                pixelValues.push(temp_pixelValues);
            }

    //graphical update
        function render(){
            for(let x = 0; x < xCount; x++){
                for(let y = 0; y < yCount; y++){
                    pixels[x][y].colour({r:pixelValues[x][y][0],g:pixelValues[x][y][1],b:pixelValues[x][y][2],a:1});
                }
            }
        }

    //control
        object.get = function(x,y){ return pixelValues[x][y]; };
        object.set = function(x,y,state){ 
            dev.log.partDisplay('.rastorDisplay.set('+x+','+y+','+state+')');  //#development
            pixelValues[x][y] = state; render();
        };
        object.import = function(data){
            dev.log.partDisplay('.rastorDisplay.import('+JSON.stringify(data)+')');  //#development
            for(let x = 0; x < xCount; x++){
                for(let y = 0; y < yCount; y++){
                    this.set(x,y,data[x][y]);
                }
            }
            render();
        };
        object.export = function(){ return pixelValues; }
        object.setAll = function(value){
            dev.log.partDisplay('.rastorDisplay.setAll()');  //#development
            for(let x = 0; x < xCount; x++){
                for(let y = 0; y < yCount; y++){
                    this.set(x,y,value);
                }
            }
        }
        object.test = function(){
            dev.log.partDisplay('.rastorDisplay.test()');  //#development
            this.setAll([1,1,1]);
            this.set(1,1,[1,0.5,0.5]);
            this.set(2,2,[0.5,1,0.5]);
            this.set(3,3,[0.5,0.5,1]);
            this.set(4,4,[1,0.5,1]);
            render();
        };

    return object;
};

interfacePart.partLibrary.display.rastorDisplay = function(name,data){ 
    return interfacePart.collection.display.rastorDisplay(
        name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
    ); 
};