//superglobals
    system.super = {};

    //detect development mode
    system.super.devMode = (new URL(window.location.href)).searchParams.get("dev") != null;

    //detect test mode
    system.super.testMode = (new URL(window.location.href)).searchParams.get("test") != null;

    //enable/disable mouse wheel zoom
        system.super.mouseWheelZoomEnabled = true;
    //enable/disable mouse grip panning
        system.super.mouseGripPanningEnabled = true;
    //enable/disable scene read-only mode
        system.super.readOnlyMode = false;
    //enable/disable scene load and save
        system.super.enableSaveload = true;

    //adjustable keyboard mapping
    system.super.keys = {
        alt: 'altKey',
        ctrl: 'ctrlKey',
    };

    if( window.navigator.platform.indexOf('Mac') != -1 ){
        system.super.keys.ctrl = 'metaKey';
    }

    //help folder location
    system.super.helpFolderLocation = 'https://metasophiea.com/curve/help/';

    //enter demo mode
    system.super.demoMode = function(a){
        system.super.mouseWheelZoomEnabled = !a;
        system.super.mouseGripPanningEnabled = !a;
        system.super.readOnlyMode = a;
        system.super.enableSaveload = !a;
    };

//stop page unload
//(will only work when page is not in dev mode)
    if( !system.super.devMode ){
        window.onbeforeunload = function(){ return "Unsaved work will be lost"; };
    }
