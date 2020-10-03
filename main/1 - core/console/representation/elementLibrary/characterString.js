this.CharacterString = function(_name){
    genericElement.call(this,'CharacterString',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        angle: 0,
        width: 10,
        height: 10,
        font: 'defaultThin',
        string: '',
        spacing: 0.5,
        interCharacterSpacing: 0,
        printingMode: { widthCalculation:'absolute', horizontal:'left', vertical:'bottom' },
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );

    const cashedAttributes_presentationOnly = {
        resultingWidth: 0, 
    };
    const cashedCallbacks_elementSpecific = {
        onFontUpdateCallback:function(){},
    };
    this.__updateValues = function(data){
        Object.keys(data).forEach(key => { cashedAttributes_presentationOnly[key] = data[key]; });
    };
    this.__runCallback = function(data){
        Object.entries(data).forEach(([name,values]) => {
            if(name in cashedCallbacks_elementSpecific){ cashedCallbacks_elementSpecific[name](values); }
        });
    };
    this.resultingWidth = function(){
        return cashedAttributes_presentationOnly.resultingWidth;
    };

    const __getCallback = this.getCallback;
    this.getCallback = function(callbackType){
        if(callbackType in cashedCallbacks_elementSpecific){
            return cashedCallbacks_elementSpecific[callbackType];
        }
        __getCallback(callbackType);
    };
    const __attachCallback = this.attachCallback;
    this.attachCallback = function(callbackType, callback){
        if(callbackType in cashedCallbacks_elementSpecific){
            cashedCallbacks_elementSpecific[callbackType] = callback;
            return;
        }
        __attachCallback(callbackType);
    }
    const __removeCallback = this.removeCallback;
    this.removeCallback = function(callbackType){
        if(callbackType in cashedCallbacks_elementSpecific){
            delete cashedCallbacks_elementSpecific[callbackType];
            return;
        }
        __removeCallback(callbackType);
    }
};