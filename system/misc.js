//stop page unload
    window.onbeforeunload = function() { return "Unsaved work will be lost"; };

//superglobals
    __globals.super = {};

    //adjustable keyboard mapping
    __globals.super.keys = {
        alt: 'altKey',
        ctrl: 'ctrlKey',
    };

    if( window.navigator.platform.indexOf('Mac') != -1 ){
        __globals.super.keys.ctrl = 'metaKey';
    }