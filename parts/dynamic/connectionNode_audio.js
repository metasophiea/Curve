this.connectionNode_audio = function(
    id='connectionNode_audio', type=0, //input = 0, output = 1
    x, y, width, height, audioContext,
    style='fill:rgba(255, 220, 220,1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._type = 'audio';
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(242, 119, 84); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(242, 161, 138); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
        object._audioNode = audioContext.createAnalyser();
        object._portType = type; if(type!=0&&type!=1){type=0;}
    var rect = parts.basic.rect('tab', 0, 0, width, height, 0, style);
        object.appendChild(rect);


    //network functions
    object.onConnect = function(){};
    object.onDisconnect = function(){};


    //internal connections
    object.out = function(){return this._audioNode;};
    object.in = function(){return this._audioNode;};

    
    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if( !foreignObject._type ){return;}
        else if( foreignObject._type != this._type ){ /*console.log('error: selected destination is not the same type as this node');*/ return; }
        else if( foreignObject._portType == this._portType ){ /*console.log('error: cannot connect', (this._portType==0?'input':'output'), 'node to', (foreignObject._portType==0?'input':'output'), 'node');*/ return; }
        else if( foreignObject == this ){ /*console.log('error: cannot connect node to itself');*/ return; }
        else if( foreignObject == this.foreignNode ){ /*console.log('error: attempting to make existing connection');*/ return; }

        this.disconnect();

        this.foreignNode = foreignObject;
        if(this._portType == 1){ this._audioNode.connect(this.foreignNode._audioNode); }
        this.foreignNode._receiveConnection(this);
        this._add_cable();

        this.onConnect();
    };
    object._receiveConnection = function(foreignObject){
        this.disconnect();

        this.foreignNode = foreignObject;
        if(this._portType == 1){ this._audioNode.connect(this.foreignNode._audioNode); }

        this.onConnect();
    };
    object.disconnect = function(){
        if( !this.foreignNode ){return;}

        this._remove_cable();
        this.foreignNode._receiveDisconnection();
        if(this._portType == 1){ this._audioNode.disconnect(this.foreignNode._audioNode); }
        this.foreignNode = null;

        this.onDisconnect();
    };
    object._receiveDisconnection = function(){
        if(this._portType == 1){ this._audioNode.disconnect(this.foreignNode._audioNode); }
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

        this._cable.draw( 
            t1[0] + this._boundary.width/2, 
            t1[1] + this._boundary.height/2, 
            t2[0] + this.foreignNode._boundary.width/2, 
            t2[1] + this.foreignNode._boundary.height/2
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.getCumulativeTransform(this);
        var t2 = __globals.utility.getCumulativeTransform(this.foreignNode);

        this._cable.redraw( 
            t1[0] + this._boundary.width/2, 
            t1[1] + this._boundary.height/2, 
            t2[0] + this.foreignNode._boundary.width/2, 
            t2[1] + this.foreignNode._boundary.height/2
        );
    };


    return object;
};