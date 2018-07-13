__globals.super = {
    keys:{
        alt: 'altKey',
        ctrl: 'ctrlKey',
    }
};

if( window.navigator.platform.indexOf('Mac') != -1 ){
    __globals.super.keys.ctrl = 'metaKey';
}