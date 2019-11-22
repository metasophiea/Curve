this.characterString = function(_id,_name){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'characterString'; 
            this.getType = function(){return type;}
            const id = _id; 
            this.getId = function(){return id;}
            const vectorLibrary = elementLibrary.character.vectorLibrary;
            const defaultFontName = 'defaultThin';
            const group = element.create_skipDatabase('group','characterString_group');

        //simple attributes
            this.name = _name;
            this.parent = undefined;
            this.dotFrame = false; group.dotFrame = this.dotFrame;
            this.extremities = group.extremities;
            let ignored = false;
            this.ignored = function(a){
                if(a==undefined){return ignored;}     
                ignored = a;
                dev.log.elementLibrary(type,self.getAddress(),'.ignored('+a+')'); //#development
                group.ignored(a);
            };
            let colour = {r:1,g:0,b:0,a:1};
            this.colour = function(a){
                if(a==undefined){return colour;}     
                colour = a;
                dev.log.elementLibrary(type,self.getAddress(),'.colour('+JSON.stringify(a)+')'); //#development
                recolourCharacters();
            };

        //addressing
            this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };
        
        //attributes pertinent to extremity calculation
            let x = 0;
            let y = 0;
            let angle = 0;
            let anchor = {x:0,y:0};
            let width = 10;
            let height = 10;
            let scale = 1;
            let font = defaultFontName;
            let string = ''; 
            let spacing = 0.5; 
            let interCharacterSpacing = 0;
            let printingMode = {
                widthCalculation:'absolute', //filling / absolute
                horizontal:'left', //left / middle / right
                vertical:'bottom', //top  / middle / bottom
            };
            let static = false;
            this.x = function(a){ 
                if(a==undefined){return scale;} 
                dev.log.elementLibrary(type,self.getAddress(),'.x('+a+')'); //#development
                x = a;
                group.x(a);
            };
            this.y = function(a){ 
                if(a==undefined){return scale;} 
                y = a;
                dev.log.elementLibrary(type,self.getAddress(),'.y('+a+')'); //#development
                group.y(a);
            };
            this.angle = function(a){ 
                if(a==undefined){return angle;} 
                angle = a;
                dev.log.elementLibrary(type,self.getAddress(),'.angle('+a+')'); //#development
                group.angle(a);
            };
            this.anchor = function(a){ 
                if(a==undefined){return anchor;} 
                anchor = a;
                dev.log.elementLibrary(type,self.getAddress(),'.anchor('+a+')'); //#development
                group.anchor(a);
            };
            this.width = function(a){
                if(a==undefined){return width;}  
                width = a;  
                dev.log.elementLibrary(type,self.getAddress(),'.width('+a+')'); //#development
                generateStringCharacters(); 
            };
            this.height = function(a){
                if(a==undefined){return height;} 
                height = a; 
                dev.log.elementLibrary(type,self.getAddress(),'.height('+a+')'); //#development
                generateStringCharacters(); 
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary(type,self.getAddress(),'.scale('+a+')'); //#development
                group.scale(a);
            };
            this.font = function(newFont){
                if(newFont==undefined){return font;}
                dev.log.elementLibrary(type,self.getAddress(),'.font('+newFont+')'); //#development

                if( elementLibrary.character.isApprovedFont(newFont) ){
                    if( !elementLibrary.character.fontLoadAttempted(newFont) ){ elementLibrary.character.loadFont(newFont); }
                    if( !elementLibrary.character.isFontLoaded(newFont) ){ setTimeout(function(){ self.font(newFont); },100,newFont); }
                    dev.log.elementLibrary(type,self.getAddress(),'.font() -> isLoaded:'+elementLibrary.character.isFontLoaded(newFont)); //#development

                    font = !elementLibrary.character.isFontLoaded(newFont) ? defaultFontName : newFont;
                }else{
                    report.warning('elementLibrary.character : error : unknown font:',newFont);
                    font = defaultFontName;
                }

                generateStringCharacters(); 
            };
            this.string = function(a){ 
                if(a==undefined){return string;} 
                string = a;
                dev.log.elementLibrary(type,self.getAddress(),'.string('+a+')'); //#development
                generateStringCharacters(); 
            };
            this.spacing = function(a){ 
                if(a==undefined){return spacing;} 
                spacing = a;
                dev.log.elementLibrary(type,self.getAddress(),'.spacing('+a+')'); //#development
                generateStringCharacters(); 
            };
            this.character = function(a){
                if(a==undefined){return character;} 
                dev.log.elementLibrary(type,self.getAddress(),'.character('+a+')'); //#development
                character = a; 
                producePoints();
            };
            this.interCharacterSpacing = function(a){
                if(a==undefined){return interCharacterSpacing;}
                interCharacterSpacing = a;
                dev.log.elementLibrary(type,self.getAddress(),'.interCharacterSpacing('+a+')'); //#development
                generateStringCharacters();
            }
            this.printingMode = function(a){
                if(a==undefined){return printingMode;} 
                printingMode = {
                    widthCalculation: a.widthCalculation != undefined || a.widthCalculation != '' ? a.widthCalculation : printingMode.widthCalculation,
                    horizontal: a.horizontal != undefined || a.horizontal != '' ? a.horizontal : printingMode.horizontal,
                    vertical: a.vertical != undefined || a.vertical != '' ? a.vertical : printingMode.vertical,
                };
                dev.log.elementLibrary(type,self.getAddress(),'.printingMode('+JSON.stringify(printingMode)+')'); //#development

                generateStringCharacters();
            };
            this.static = function(a){
                if(a==undefined){return static;}  
                static = a;  
                dev.log.elementLibrary(type,self.getAddress(),'.static('+a+')'); //#development
                group.static(a);
            };

        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return { ignored:ignored, colour:colour, x:x, y:y, radius:radius, detail:detail, scale:scale, static:static }; } 
                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development

                Object.keys(attributes).forEach(key => {
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "'+key+'" to '+JSON.stringify(attributes[key])); //#development
                    try{
                        self[key](attributes[key]);
                    }catch(err){
                        console.warn(type,id,self.getAddress(),'.unifiedAttribute -> unknown attribute "'+key+'" which was being set to "'+JSON.stringify(attributes[key])+'"');
                    }
                });
            };
         
    //string
        var resultingWidth = 0;
        this.resultingWidth = function(){ return resultingWidth; };
        function recolourCharacters(){ group.children().forEach(ele => ele.colour(colour)); }
        function generateStringCharacters(){
            group.clear();
            const tmpString = String(string).split('');
            let characterWidth = width;

            //printingMode
                //widthCalculation
                    if(printingMode.widthCalculation == 'filling'){
                        let internalWidth = 0;
                        tmpString.forEach(a => { internalWidth += vectorLibrary[font][a] ? vectorLibrary[font][a].right : spacing; });
                        characterWidth = characterWidth/internalWidth;
                    }
                //vertical
                    let verticalOffset = 0;
                    let highestPoint = 0;
                    if( printingMode.vertical == 'top'){ 
                        tmpString.forEach(a => {
                            const tmp = vectorLibrary[font][a] ? vectorLibrary[font][a].top : 0;
                            highestPoint = highestPoint > tmp ? tmp : highestPoint;
                        });
                        verticalOffset = height*-highestPoint;
                    }
                    if( printingMode.vertical == 'verymiddle' ){
                        tmpString.forEach(a => {
                            const tmp = vectorLibrary[font][a] ? vectorLibrary[font][a].top : 0;
                            highestPoint = highestPoint > tmp ? tmp : highestPoint;
                        });
                        verticalOffset = -(height/2)*highestPoint;
                    }                 
                    if( printingMode.vertical == 'middle' ){
                        highestPoint = vectorLibrary[font]['o'] ? vectorLibrary[font]['o'].top : 0;
                        verticalOffset = -(height/2)*highestPoint;
                    }                 

            //create character and add it to the group
                let cumulativeWidth = 0;
                for(let a = 0; a < tmpString.length; a++){
                    if(tmpString[a] == ' '){ cumulativeWidth += characterWidth*spacing; continue; }

                    let tmp = element.create_skipDatabase('character',''+a);
                    tmp.unifiedAttribute({
                        character:tmpString[a],
                        font:font,
                        x:cumulativeWidth,
                        y:verticalOffset,
                        width:characterWidth,
                        height:height,
                        colour:colour,
                    });
                    group.append(tmp);

                    cumulativeWidth += (interCharacterSpacing + tmp.right()) * characterWidth;
                }

                resultingWidth = cumulativeWidth;

            //printingMode - horizontal
                if( printingMode.horizontal == 'middle' ){ children.forEach(a => a.x( a.x() - cumulativeWidth/2 ) ); }
                else if( printingMode.horizontal == 'right' ){ children.forEach(a => a.x( a.x() - cumulativeWidth) ); }
        }

    //extremities
        this.getOffset = group.getOffset;
        this.computeExtremities = group.computeExtremities;
        this.updateExtremities = group.updateExtremities;

    //lead render
        this.render = function(context, offset){ group.render(context, offset); };

    //info dump
        this._dump = function(){
            report.info(self.getAddress(),'._dump()');
            report.info(self.getAddress(),'._dump -> id: '+id);
            report.info(self.getAddress(),'._dump -> type: '+type);
            report.info(self.getAddress(),'._dump -> name: '+self.name);
            report.info(self.getAddress(),'._dump -> address: '+self.getAddress());
            report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
            report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
            report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
            report.info(self.getAddress(),'._dump -> ignored: '+ignored);
            report.info(self.getAddress(),'._dump -> colour: '+JSON.stringify(colour));
            report.info(self.getAddress(),'._dump -> x: '+x);
            report.info(self.getAddress(),'._dump -> y: '+y);
            report.info(self.getAddress(),'._dump -> angle: '+angle);
            report.info(self.getAddress(),'._dump -> anchor: '+anchor);
            report.info(self.getAddress(),'._dump -> width: '+width);
            report.info(self.getAddress(),'._dump -> height: '+height);
            report.info(self.getAddress(),'._dump -> scale: '+scale);
            report.info(self.getAddress(),'._dump -> font: '+font);
            report.info(self.getAddress(),'._dump -> string: '+string);
            report.info(self.getAddress(),'._dump -> interCharacterSpacing: '+interCharacterSpacing);
            report.info(self.getAddress(),'._dump -> printingMode: '+JSON.stringify(printingMode));
            report.info(self.getAddress(),'._dump -> string: '+string);
            report.info(self.getAddress(),'._dump -> printingMode: '+JSON.stringify(printingMode));
            report.info(self.getAddress(),'._dump -> static: '+static);
        };

    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.colour = self.colour;
            this.x = self.x;
            this.y = self.y;
            this.angle = self.angle;
            this.anchor = self.anchor;
            this.width = self.width;
            this.height = self.height;
            this.scale = self.scale;
            this.font = self.font;
            this.string = self.string;
            this.interCharacterSpacing = self.interCharacterSpacing;
            this.printingMode = self.printingMode;
            this.static = self.static;
            this.unifiedAttribute = self.unifiedAttribute;
            this.getAddress = self.getAddress;
            this._dump = self._dump;
        };
};