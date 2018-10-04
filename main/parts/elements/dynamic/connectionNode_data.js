this.connectionNode_data = function(
    id='connectionNode_data',
    x, y, width, height, rotation=0,
    style='fill:rgba(220, 244, 255,1)',
    glowStyle='fill:rgba(244, 244, 255, 1)'
){
    //elements
    var object = system.utility.misc.elementMaker('g',id,{x:x, y:y, r:rotation});
        object._type = 'data';
        object._rotation = rotation;
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(84, 146, 247); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(123, 168, 242); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
    var rect = system.utility.misc.elementMaker('rect','tab',{x:0, y:0, width:width, height:height,style:style});
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
        if(object.foreignNode.receive){object.foreignNode.receive(address, data);}

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
    object.activate = function(){ system.utility.element.setStyle(rect, glowStyle); };
    object.disactivate = function(){ system.utility.element.setStyle(rect, style); };


    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if(!system.super.enablCableDisconnectionConnection){return;}

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
        if(!system.super.enablCableDisconnectionConnection){return;}
        
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
        var centre_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var centre_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = system.utility.math.cartesian2polar(centre_local.x,centre_local.y);
            temp.ang += this._rotation;
            centre_local = system.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = system.utility.math.cartesian2polar(centre_foreign.x,centre_foreign.y);
            temp.ang += this.foreignNode._rotation;
            centre_foreign = system.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1.x + centre_local.x,
            t1.y + centre_local.y, 
            t2.x + centre_foreign.x,
            t2.y + centre_foreign.y
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = system.utility.element.getCumulativeTransform(this);
        var t2 = system.utility.element.getCumulativeTransform(this.foreignNode);
        var centre_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var centre_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = system.utility.math.cartesian2polar(centre_local.x,centre_local.y);
            temp.ang += this._rotation;
            centre_local = system.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = system.utility.math.cartesian2polar(centre_foreign.x,centre_foreign.y);
            temp.ang += this.foreignNode._rotation;
            centre_foreign = system.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1.x + centre_local.x,
            t1.y + centre_local.y, 
            t2.x + centre_foreign.x,
            t2.y + centre_foreign.y
        );
    };


    return object;
};