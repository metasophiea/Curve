//superglobals
    __globals.super = {};

    //detect development mode
    __globals.super.devMode = (new URL(window.location.href)).searchParams.get("dev") != null;

    //detect test mode
    __globals.super.testMode = (new URL(window.location.href)).searchParams.get("test") != null;

    //adjustable keyboard mapping
    __globals.super.keys = {
        alt: 'altKey',
        ctrl: 'ctrlKey',
    };

    if( window.navigator.platform.indexOf('Mac') != -1 ){
        __globals.super.keys.ctrl = 'metaKey';
    }



//stop page unload
//(will only work when page is not in dev mode)
    if( !__globals.super.devMode ){
        window.onbeforeunload = function(){ return "Unsaved work will be lost"; };
    }
