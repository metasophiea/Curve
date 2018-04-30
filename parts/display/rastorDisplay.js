this.rastorDisplay = function(
    id='rastorDisplay',
    x, y, width, height,
    xCount, yCount, xGappage=1, yGappage=1
){
    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //backing
        var rect = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgb(0,0,0)');
            object.appendChild(rect);

        //pixels
            var pixels = [];
            var pixelValues = [];
            var pixWidth = width/xCount;
            var pixHeight = height/yCount;

            for(var x = 0; x < xCount; x++){
                var temp_pixels = [];
                var temp_pixelValues = [];
                for(var y = 0; y < yCount; y++){
                    var rect = parts.basic.rect(null, (x*pixWidth)+xGappage/2, (y*pixHeight)+yGappage/2, pixWidth-xGappage, pixHeight-yGappage, 0, 'fill:rgb(0,0,0)');
                        temp_pixels.push(rect);
                        temp_pixelValues.push([0,0,0]);
                        object.appendChild(rect);
                }
                pixels.push(temp_pixels);
                pixelValues.push(temp_pixelValues);
            }

    //inner workings
        function render(){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    __globals.utility.element.setStyle(pixels[x][y], 'fill:rgb('+255*pixelValues[x][y][0]+','+255*pixelValues[x][y][1]+','+255*pixelValues[x][y][2]+')' );
                }
            }
        }
        
    //methods
        object.get = function(x,y){ return pixelValues[x][y]; };
        object.set = function(x,y,state){ pixelValues[x][y] = state; render() };
        object.reverseLoad = function(data){
        for(var y = 0; y < yCount; y++){
            for(var x = 0; x < xCount; x++){
                    this.set(x,y,data[y][x]);
                }
            }
            render();
        };
        object.load = function(data){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,data[x][y]);
                }
            }
            render();
        };
        object.unload = function(){ return pixelValues; }
        object.setAll = function(value){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,value);
                }
            }
        }

        object.test = function(){
            this.setAll([1,1,1]);
            render();
        };

    return object;
};