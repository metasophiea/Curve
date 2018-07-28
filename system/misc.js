//superglobals
    __globals.super = {};

    //detect development mode
    __globals.super.devMode = (new URL(window.location.href)).searchParams.get("dev") != null;

    //detect test mode
    __globals.super.testMode = (new URL(window.location.href)).searchParams.get("test") != null;

    //enable/disable mouse wheel zoom
        __globals.super.mouseWheelZoomEnabled = true;
    //enable/disable mouse grip panning
        __globals.super.mouseGripPanningEnabled = true;
    //enable/disable scene read-only mode
        __globals.super.readOnlyMode = false;
    //enable/disable scene load and save
        __globals.super.enableSaveload = true;

    //adjustable keyboard mapping
    __globals.super.keys = {
        alt: 'altKey',
        ctrl: 'ctrlKey',
    };

    if( window.navigator.platform.indexOf('Mac') != -1 ){
        __globals.super.keys.ctrl = 'metaKey';
    }

    //help folder location
    __globals.super.helpFolderLocation = 'https://metasophiea.com/curve/help/';

    //enter demo mode
    __globals.super.demoMode = function(a){
        __globals.super.mouseWheelZoomEnabled = !a;
        __globals.super.mouseGripPanningEnabled = !a;
        __globals.super.readOnlyMode = a;
        __globals.super.enableSaveload = !a;
    };

//stop page unload
//(will only work when page is not in dev mode)
    if( !__globals.super.devMode ){
        window.onbeforeunload = function(){ return "Unsaved work will be lost"; };
    }
