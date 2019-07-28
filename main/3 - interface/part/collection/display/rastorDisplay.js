this.rastorDisplay = function(
    name='rastorDisplay',
    x, y, angle=0, width=60, height=60,
    xCount=8, yCount=8, xGappage=0.1, yGappage=0.1,
    backing={r:0.2,g:0.2,b:0.2,a:1}, defaultPixelValue={r:0,g:0,b:0,a:1},
){
    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //backing
            var rect = interfacePart.builder('basic','rectangle','backing',{ width:width, height:height, colour:backing });
            object.append(rect);
        //pixels
            var pixelGroup = interfacePart.builder('basic','group','pixels');
            object.append(pixelGroup);

            var pixels = [];
            var pixelValues = [];
            var pixWidth = width/xCount;
            var pixHeight = height/yCount;

            for(var x = 0; x < xCount; x++){
                var temp_pixels = [];
                var temp_pixelValues = [];
                for(var y = 0; y < yCount; y++){
                    var rect = interfacePart.builder('basic','rectangle',x+'_'+y,{ 
                        x:(x*pixWidth)+xGappage/2,  y:(y*pixHeight)+yGappage/2, 
                        width:pixWidth-xGappage,    height:pixHeight-yGappage,
                        colour:defaultPixelValue,
                    });
                        
                    temp_pixels.push(rect);
                    temp_pixelValues.push([0,0,0]);
                    pixelGroup.append(rect);
                }
                pixels.push(temp_pixels);
                pixelValues.push(temp_pixelValues);
            }

    //graphical update
        function render(){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    pixels[x][y].colour = {r:pixelValues[x][y][0],g:pixelValues[x][y][1],b:pixelValues[x][y][2],a:1};
                }
            }
        }

    //control
        object.get = function(x,y){ return pixelValues[x][y]; };
        object.set = function(x,y,state){ pixelValues[x][y] = state; render(); };
        object.import = function(data){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,data[x][y]);
                }
            }
            render();
        };
        object.export = function(){ return pixelValues; }
        object.setAll = function(value){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,value);
                }
            }
        }
        object.test = function(){
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