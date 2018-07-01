this.launchpad = function(xCount,yCount){
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