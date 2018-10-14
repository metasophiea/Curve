//detect development mode
    this.devMode = (new URL(window.location.href)).searchParams.get("dev") != null;

    //stop page unload
    //(will only work when page is not in dev mode)
        if( !this.devMode ){
            window.onbeforeunload = function(){ return "Unsaved work will be lost"; };
        }

//detect test mode
    this.testMode = (new URL(window.location.href)).searchParams.get("test") != null;


//enable object clipping
    this.enableObjectClipping = false;

    
//enable/disable mouse wheel zoom
    this.mouseWheelZoomEnabled = true;
//enable/disable mouse grip panning
    this.mouseGripPanningEnabled = true;
//enable/disable scene read-only mode
    this.readOnlyMode = false;
//enable/disable scene load and save
    this.enableSaveload = true;
//enable/disable menubar
    this.enableMenubar = true;
//enable/disable window scrollbar automatic removal
    this.enableWindowScrollbarAutomaticRemoval = true;
//enable/disable cable disconnection/connection
    this.enablCableDisconnectionConnection = true;



//adjustable keyboard mapping
    this.keys = {
        alt: 'altKey',
        ctrl: 'ctrlKey',
    };

    if( window.navigator.platform.indexOf('Mac') != -1 ){
        this.keys.ctrl = 'metaKey';
    }

//help folder location
    // this.helpFolderLocation = 'https://metasophiea.com/curve/help/';
    this.helpFolderLocation = 'help/index.html';
    this.helpFolderLocation = 'help/';

//enter demo mode
    this.demoMode = function(a){
        this.mouseWheelZoomEnabled = !a;
        this.mouseGripPanningEnabled = !a;
        this.readOnlyMode = a;
        this.enableSaveload = !a;
        this.enableMenubar = !a;
        this.enableWindowScrollbarAutomaticRemoval = !a;
        this.enablCableDisconnectionConnection = !a;
        window.onbeforeunload = undefined;
    };

