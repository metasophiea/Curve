this.characterString = function(_id,_name){
    const self = this;

    //attributes 
        const innerGroup = element.create_skipDatabase('group','innerGroup');
            innerGroup.parent = this;

        //protected attributes
            const type = 'characterString'; 
            this.getType = function(){return type;}
            const id = _id; 
            this.getId = function(){return id;}
            this.name = _name;

            const defaultFontName = 'defaultThin';

            this.parent = undefined;
            this.dotFrame = false; innerGroup.dotFrame = this.dotFrame;
            this.extremities = innerGroup.extremities;
            this.ignored = innerGroup.ignored;
            this.getAddress = innerGroup.getAddress;
        //simple attributes
            let colour = {r:1,g:0,b:0,a:1};
            let width = 10;
            let height = 10;
            let font = 'defaultThin';
            let string = 'Hello';
            let spacing = 0.5;
            let interCharacterSpacing = 0;
            let printingMode =  {
                widthCalculation:'absolute', //filling / absolute
                horizontal:'left', //left / middle / right
                vertical:'bottom', //top  / middle / bottom
            };

        //advanced use attributes
            let allowGenerateStringCharacters = true;

        //callbacks
            this.onFontUpdateCallback = function(newFont){
                interface.runElementCallback(self, {onFontUpdateCallback:newFont});
            };
        
        //addressing
            this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };
        
        //attributes pertinent to extremity calculation
            this.x = innerGroup.x;
            this.y = innerGroup.y;
            this.angle = innerGroup.angle;
            this.scale = innerGroup.scale;
                this.colour = function(a){
                    if(a==undefined){return colour;}     
                    colour = a;
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].colour(',a); //#development
                    recolourCharacters();
                };
                this.width = function(a){
                    if(a==undefined){return width;}  
                    width = a;  
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].width(',a); //#development
                    if(allowGenerateStringCharacters){generateStringCharacters();} 
                };
                this.height = function(a){
                    if(a==undefined){return height;} 
                    height = a; 
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].height(',a); //#development
                    if(allowGenerateStringCharacters){generateStringCharacters();} 
                };
                this.font = function(newFont){
                    if(newFont==undefined){return font;}
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].font('+newFont+')'); //#development
    
                    if( library.font.isApprovedFont(newFont) ){
                        dev.log.elementLibrary[type]('['+self.getAddress()+'].font() -> fontLoadAttempted: '+library.font.fontLoadAttempted(newFont)); //#development
                        if( !library.font.fontLoadAttempted(newFont) ){ library.font.loadFont(newFont); }
                        dev.log.elementLibrary[type]('['+self.getAddress()+'].font() -> isLoaded: '+library.font.isFontLoaded(newFont)); //#development
                        if( !library.font.isFontLoaded(newFont) ){ 
                            const timeoutId = setTimeout(function(){ 
                                dev.log.elementLibrary[type]('['+self.getAddress()+'].font() -> internal rerun < '+timeoutId); //#development
                                self.font(newFont);
                            }, 100, newFont);
                            dev.log.elementLibrary[type]('['+self.getAddress()+'].font() -> internal rerun > '+timeoutId); //#development
                            return;
                        }
    
                        font = !library.font.isFontLoaded(newFont) ? defaultFontName : newFont;
                    }else{
                        console.warn('library.font : error : unknown font:',newFont);
                        font = defaultFontName;
                    }
    
                    if(allowGenerateStringCharacters){generateStringCharacters();} 
                    self.onFontUpdateCallback();
                };
                this.string = function(a){ 
                    if(a==undefined){return string;} 
                    string = a;
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].string(',a); //#development
                    if(allowGenerateStringCharacters){generateStringCharacters();} 
                };
                this.spacing = function(a){ 
                    if(a==undefined){return spacing;} 
                    spacing = a;
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].spacing(',a); //#development
                    if(allowGenerateStringCharacters){generateStringCharacters();} 
                };
                this.interCharacterSpacing = function(a){
                    if(a==undefined){return interCharacterSpacing;}
                    interCharacterSpacing = a;
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].interCharacterSpacing(',a); //#development
                    if(allowGenerateStringCharacters){generateStringCharacters();}
                };
                this.printingMode = function(a){
                    if(a==undefined){return printingMode;} 
                    printingMode = {
                        widthCalculation: a.widthCalculation != undefined || a.widthCalculation != '' ? a.widthCalculation : printingMode.widthCalculation,
                        horizontal: a.horizontal != undefined || a.horizontal != '' ? a.horizontal : printingMode.horizontal,
                        vertical: a.vertical != undefined || a.vertical != '' ? a.vertical : printingMode.vertical,
                    };
                    dev.log.elementLibrary[type]('['+self.getAddress()+'].printingMode(',printingMode); //#development
    
                    if(allowGenerateStringCharacters){generateStringCharacters();}
                };
            this.static = innerGroup.static;
        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ 
                    return Object.assign(
                        {   
                            colour:colour,
                            width:width,
                            height:height,
                            font:font,
                            string:string,
                            spacing:spacing,
                            interCharacterSpacing:interCharacterSpacing,
                            printingMode:printingMode,
                        },
                        innerGroup.unifiedAttribute()
                    );
                } 
                dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute(',attributes); //#development

                allowGenerateStringCharacters = false;
                ['colour', 'width', 'height', 'font', 'string', 'spacing', 'interCharacterSpacing', 'printingMode' ].forEach(key => {
                    if(key in attributes){
                        dev.log.elementLibrary[type]('['+self.getAddress()+'].unifiedAttribute -> updating "'+key+'" to '+JSON.stringify(attributes[key])); //#development
                        try{
                            self[key](attributes[key]);
                        }catch(err){
                            console.warn(type,id,self.getAddress(),'.unifiedAttribute -> unknown attribute "'+key+'" which was being set to '+JSON.stringify(attributes[key])+'');
                            console.warn(err);
                        }
                    }
                    delete attributes[key];
                });
                innerGroup.unifiedAttribute(attributes);
                allowGenerateStringCharacters = true;

                generateStringCharacters();
                self.onFontUpdateCallback();
            }
    //string
        let resultingWidth = 0;
        function recolourCharacters(){
            innerGroup.children().forEach(ele => ele.colour(colour));
        }
        function generateStringCharacters(){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::generateStringCharacters()'); //#development
            innerGroup.clear();
            const tmpString = String(string).split('');
            let characterWidth = width;

            //printingMode
                //widthCalculation
                    if(printingMode.widthCalculation == 'filling'){
                        let internalWidth = 0;
                        tmpString.forEach(a => { internalWidth += library.font.getVector(font,a) ? library.font.getVector(font,a).right : spacing; });
                        characterWidth = characterWidth/internalWidth;
                    }
                //vertical
                    let verticalOffset = 0;
                    let highestPoint = 0;
                    if( printingMode.vertical == 'top'){ 
                        tmpString.forEach(a => {
                            const tmp = library.font.getVector(font,a) ? library.font.getVector(font,a).top : 0;
                            highestPoint = highestPoint > tmp ? tmp : highestPoint;
                        });
                        verticalOffset = height*-highestPoint;
                    }
                    if( printingMode.vertical == 'verymiddle' ){
                        tmpString.forEach(a => {
                            const tmp = library.font.getVector(font,a) ? library.font.getVector(font,a).top : 0;
                            highestPoint = highestPoint > tmp ? tmp : highestPoint;
                        });
                        verticalOffset = -(height/2)*highestPoint;
                    }                 
                    if( printingMode.vertical == 'middle' ){
                        highestPoint = library.font.getVector(font,'o') ? library.font.getVector(font,'o').top : 0;
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
                    innerGroup.append(tmp);

                    cumulativeWidth += (interCharacterSpacing + tmp.right()) * characterWidth;
                }

                resultingWidth = cumulativeWidth;
                interface.updateElement(self, {resultingWidth:resultingWidth});

            //printingMode - horizontal
                if( printingMode.horizontal == 'middle' ){ innerGroup.children().forEach(a => a.x( a.x() - cumulativeWidth/2 ) ); }
                else if( printingMode.horizontal == 'right' ){ innerGroup.children().forEach(a => a.x( a.x() - cumulativeWidth) ); }
                else{ innerGroup.computeExtremities(); }
        }
        this.resultingWidth = function(){
            return resultingWidth;
        };
    //extremities
        this.getElementsUnderPoint = innerGroup.getElementsUnderPoint;
        this.getElementsUnderArea = innerGroup.getElementsUnderArea;
        this.computeExtremities = function(informParent=true,offset){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::computeExtremities(',informParent,offset); //#development

            //run computeExtremities on inner group, passing the offset values through
                innerGroup.computeExtremities(false,offset);
            //update extremities
                this.updateExtremities(informParent,offset);
        }
        this.updateExtremities = function(informParent=true){
            dev.log.elementLibrary[type]('['+self.getAddress()+']::updateExtremities(',informParent); //#development
           
            //grab extremity points and bounding box from inner group
                self.extremities.points = innerGroup.extremities.points;
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateExtremities -> extremities.points.length:',self.extremities.points.length); //#development
                dev.log.elementLibrary[type]('['+self.getAddress()+']::updateExtremities -> self.extremities.boundingBox:',self.extremities.boundingBox); //#development

            //update parent
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.getOffset = function(){
            dev.log.elementLibrary[type]('['+self.getAddress()+'].getOffset()'); //#development
            return this.parent ? this.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
        };
    //lead render
        this.render = innerGroup.render;
    //info dump
        this.getTree = innerGroup.getTree;
        this._dump = innerGroup._dump;
    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.colour = self.colour;
            this.x = self.x;
            this.y = self.y;
            this.angle = self.angle;
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
            this.resultingWidth = self.resultingWidth;
            this._dump = self._dump;
        };
};