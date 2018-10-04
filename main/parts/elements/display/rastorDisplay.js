this.rastorDisplay = function(
    id='rastorDisplay',
    x, y, width, height,
    xCount, yCount, xGappage=1, yGappage=1
){
    //elements
        //main
            var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});

        //backing
        var rect = system.utility.misc.elementMaker('rect',null,{width:width,height:height, style:'fill:rgb(0,0,0)'});
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
                    var rect = system.utility.misc.elementMaker('rect',null,{ x:(x*pixWidth)+xGappage/2, y:(y*pixHeight)+yGappage/2, width:pixWidth-xGappage, height:pixHeight-yGappage, style:'fill:rgb(0,0,0)' });
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
                    system.utility.element.setStyle(pixels[x][y], 'fill:rgb('+255*pixelValues[x][y][0]+','+255*pixelValues[x][y][1]+','+255*pixelValues[x][y][2]+')' );
                }
            }
        }
        
    //methods
        object.get = function(x,y){ return pixelValues[x][y]; };
        object.set = function(x,y,state){ pixelValues[x][y] = state; render() };
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