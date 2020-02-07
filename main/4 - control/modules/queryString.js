let modsBeingLoaded = 0;

this.modParameterKey = 'mod';
this.controlModListPostfix = 'cml';
this.demoParameterKey = 'demo';
this.defaultDemoUrlPrefix =  'localhost:8000/demos/';

this.modsBeingLoaded = function(){return modsBeingLoaded;};
this.modLoader = function(loadingCompleteCallback){
    function loadMod(modURL){
        modsBeingLoaded++;

        _canvas_.library.misc.loadFileFromURL(modURL,function(responseText){
            var modListFileExtension = '.'+_canvas_.control.queryString.controlModListPostfix;
            if( modURL.slice(-modListFileExtension.length) == modListFileExtension ){
                responseText.response.split('\n').forEach(url => loadMod(url));
            }else{
                var newScript = document.createElement('script');
                newScript.innerHTML = responseText.response;
                newScript.id = modURL;
                document.body.append(newScript);
            }
            modsBeingLoaded--;

            if(modsBeingLoaded == 0 && loadingCompleteCallback){loadingCompleteCallback();}
        },undefined,'text');
    }
    
    var tmp = (new URL(window.location.href)).searchParams.get(_canvas_.control.queryString.modParameterKey);
    if(tmp != undefined){ loadMod(tmp); }

    var counter = 1;
    do{
        tmp = (new URL(window.location.href)).searchParams.get(_canvas_.control.queryString.modParameterKey+counter++);
        if(tmp != undefined){ loadMod(tmp); }
    }while(tmp != undefined)
};
this.demoLoader = function(loadingCompleteCallback,beDumbAboutIt=false){
    dev.log.queryString('.demoLoader(',loadingCompleteCallback,beDumbAboutIt); //#development

    function loadDemo(){
        const demoURL = (new URL(window.location.href)).searchParams.get(_canvas_.control.queryString.demoParameterKey);
    
        if(demoURL == undefined){
            return;
        }else if( !isNaN(parseInt(demoURL)) ){
            _canvas_.control.scene.load(_canvas_.control.queryString.defaultDemoUrlPrefix+parseInt(demoURL)+'.crv',loadingCompleteCallback,false);
        }else{ 
            _canvas_.control.scene.load(demoURL,loadingCompleteCallback,false);
        }
    }
    function waiter(){
        if(modsBeingLoaded > 0){ setTimeout(waiter,1000); return; }
        loadDemo();
    }

    beDumbAboutIt ? loadDemo() : waiter();
};