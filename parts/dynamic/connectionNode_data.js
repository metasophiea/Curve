this.connectionNode_data = function(
    id='connectionNode_data',
    x, y, width, height, rotation=0,
    style='fill:rgba(220, 244, 255,1)',
    glowStyle='fill:rgba(244, 244, 255, 1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._type = 'data';
        object._rotation = rotation;
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(84, 146, 247); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(123, 168, 242); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
    var rect = parts.basic.rect('tab', 0, 0, width, height, rotation, style);
        object.appendChild(rect);


    //network functions
    object.send = function(address, data=null){
        object.activate();
        setTimeout(function(){
            if(!object){return;} 
            object.disactivate();
            if(object._cable){
                object._cable.disactivate();
                object.foreignNode.disactivate();
            }
        },100);

        if(!object.foreignNode){ /*console.log('send::error: node unconnected');*/ return; }
        object.foreignNode.receive(address, data);

        object._cable.activate();
        object.foreignNode.activate();
    };
    object.receive = function(address, data=null){};
    object.request = function(address){
        if(!this.foreignNode){ /*console.log('request::error: node unconnected');*/ return; }
        return this.foreignNode.give(address);
    };
    object.give = function(address){};
    object.onConnect = function(){};
    object.onDisconnect = function(){};


    //graphical
    object.activate = function(){ __globals.utility.setStyle(rect, glowStyle); };
    object.disactivate = function(){ __globals.utility.setStyle(rect, style); };


    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if( !foreignObject._type ){return;}
        else if( foreignObject._type != this._type ){ /*console.log('error: selected destination is not the same type as this node');*/ return; }
        else if( foreignObject == this ){ /*console.log('error: cannot connect node to itself');*/ return; }
        else if( foreignObject == this.foreignNode ){ /*console.log('error: attempting to make existing connection');*/ return; }

        this.disconnect();

        this.foreignNode = foreignObject;
        this.foreignNode._receiveConnection(this);
        this._add_cable();

        this.onConnect();
        this.foreignNode.onConnect();
    };
    object._receiveConnection = function(foreignObject){
        this.disconnect();

        this.foreignNode = foreignObject;
    };
    object.disconnect = function(){
        if( !this.foreignNode ){return;}

        this._remove_cable();
        this.foreignNode._receiveDisconnection();
        this.foreignNode = null;

        this.onDisconnect();
    };
    object._receiveDisconnection = function(){
        this.foreignNode = null;
        this.onDisconnect();
    };


    //mouse interface
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.onmouseup = function(event){
            var destination = document.elementFromPoint(event.x, event.y).parentElement;
            __globals.svgElement.tempRef.connectTo(destination);
            __globals.svgElement.tempRef = null;
            this.onmouseup = null;
        };
    };
    object.ondblclick = function(){
        this.disconnect();
    };


    //cabling
    object._add_cable = function(){
        this._cable = parts.dynamic.cable(null, 0, 0, 0, 0, this._cableStyle, this._cableActiveStyle);
        this.foreignNode._receive_cable(this._cable);
        __globals.utility.getPane(this).appendChild(this._cable); // <-- should probably make prepend
        this.draw();
    };
    object._receive_cable = function(_cable){
        this._cable = _cable;
    };
    object._remove_cable = function(){
        __globals.utility.getPane(this).removeChild(this._cable);
        this.foreignNode._lose_cable();
        this._cable = null;
    };
    object._lose_cable = function(){
        this._cable = null;
    };
    object.draw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.getCumulativeTransform(this);
        var t2 = __globals.utility.getCumulativeTransform(this.foreignNode);
        var center_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var center_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = __globals.utility.getPolar(center_local.x,center_local.y);
            temp.ang += this._rotation;
            center_local = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = __globals.utility.getPolar(center_foreign.x,center_foreign.y);
            temp.ang += this.foreignNode._rotation;
            center_foreign = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1[0] + center_local.x,
            t1[1] + center_local.y, 
            t2[0] + center_foreign.x,
            t2[1] + center_foreign.y
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.getCumulativeTransform(this);
        var t2 = __globals.utility.getCumulativeTransform(this.foreignNode);
        var center_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var center_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = __globals.utility.getPolar(center_local.x,center_local.y);
            temp.ang += this._rotation;
            center_local = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = __globals.utility.getPolar(center_foreign.x,center_foreign.y);
            temp.ang += this.foreignNode._rotation;
            center_foreign = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1[0] + center_local.x,
            t1[1] + center_local.y, 
            t2[0] + center_foreign.x,
            t2[1] + center_foreign.y
        );
    };


    return object;
};