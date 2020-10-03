this.callback = new function(){
    this.listCallbackTypes = function(){
        return ENGINE.callback__list_callback_types();
    };
    this.listActivationModes = function(){
        return ENGINE.callback__list_activation_modes();
    };
    this.attachCallback = function(elementId,callbackType){
        dev.log.callback('.attachCallback(',elementId,callbackType); //#development
        ENGINE.callback__attach_callback(elementId,callbackType);
    };
    this.removeCallback = function(elementId,callbackType){
        dev.log.callback('.removeCallback(',elementId,callbackType); //#development
        ENGINE.callback__remove_callback(elementId,callbackType);
    };
    this.callbackActivationMode = function(mode){
        dev.log.callback('.callbackActivationMode(',mode); //#development
        ENGINE.callback__callback_activation_mode(mode);
    };

    //main callback operation
        this.coupling_in = {};
        this.coupling_out = {};

        //default
        this.listCallbackTypes().map(callback => {
            this.coupling_in[callback] = function(callbackName){
                return function(event){
                    ENGINE['callback__coupling_in__'+callbackName](event);
                }
            }(callback);
        });


    this._dump = function(){
        ENGINE.callback__dump();
    };
};