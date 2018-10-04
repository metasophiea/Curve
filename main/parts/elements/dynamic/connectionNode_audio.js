this.connectionNode_audio = function(
    id='connectionNode_audio', type=0, //input = 0, output = 1
    x, y, width, height, rotation=0, audioContext,
    style='fill:rgba(255, 220, 220,1)'
){
    //elements
    var object = system.utility.misc.elementMaker('g',id,{x:x, y:y, r:rotation});
        object._type = 'audio';
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(242, 119, 84); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(242, 161, 138); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
        object._audioNode = audioContext.createAnalyser();
        object._portType = type; if(type!=0&&type!=1){type=0;}
    var rect = system.utility.misc.elementMaker('rect','tab',{x:0, y:0, width:width, height:height,style:style});
        object.appendChild(rect);


    //network functions
    object.onConnect = function(){};
    object.onDisconnect = function(){};


    //internal connections
    object.out = function(){return this._audioNode;};
    object.in = function(){return this._audioNode;};

    
    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if(!system.super.enablCableDisconnectionConnection){return;}

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
        if(!system.super.enablCableDisconnectionConnection){return;}
        
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
        system.svgElement.tempRef = this;
        system.svgElement.onmouseup = function(event){
            var destination = document.elementFromPoint(event.x, event.y).parentElement;
            system.svgElement.tempRef.connectTo(destination);
            system.svgElement.tempRef = null;
            this.onmouseup = null;
        };
    };
    object.ondblclick = function(){
        this.disconnect();
    };


    //cabling
    object._add_cable = function(){
        this._cable = system.utility.misc.elementMaker('cable',null,{style:{unactive:this._cableStyle, active:this._cableActiveStyle}});
        this.foreignNode._receive_cable(this._cable);
        system.utility.workspace.getPane(this).appendChild(this._cable); // <-- should probably make prepend
        this.draw();
    };
    object._receive_cable = function(_cable){
        this._cable = _cable;
    };
    object._remove_cable = function(){
        system.utility.workspace.getPane(this).removeChild(this._cable);
        this.foreignNode._lose_cable();
        this._cable = null;
    };
    object._lose_cable = function(){
        this._cable = null;
    };
    object.draw = function(){
        if( !object._cable ){return;}
        
        var t1 = system.utility.element.getCumulativeTransform(this);
        var t2 = system.utility.element.getCumulativeTransform(this.foreignNode);

        this._cable.draw( 
            t1.x + this._boundary.width/2, 
            t1.y + this._boundary.height/2, 
            t2.x + this.foreignNode._boundary.width/2, 
            t2.y + this.foreignNode._boundary.height/2
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = system.utility.element.getCumulativeTransform(this);
        var t2 = system.utility.element.getCumulativeTransform(this.foreignNode);

        this._cable.redraw( 
            t1.x + this._boundary.width/2, 
            t1.y + this._boundary.height/2, 
            t2.x + this.foreignNode._boundary.width/2, 
            t2.y + this.foreignNode._boundary.height/2
        );
    };


    return object;
};