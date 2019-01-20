this.connectionNode = function(
    name='connectionNode2',
    x, y, angle=0, width=20, height=20, type='none', direction='',
    allowConnections=true, allowDisconnections=true,
    dimStyle='rgb(220, 220, 220)',
    glowStyle='rgb(244, 244, 244)',
    cable_dimStyle='rgb(146, 146, 146)',
    cable_glowStyle='rgb(215, 215, 215)',
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    //elements
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
            object._connectionNode = true;
            object._type = type;
            object._direction = direction;
        //node
            var rectangle = interfacePart.builder('rectangle','node',{ width:width, height:height, style:{fill:dimStyle} });
                object.append(rectangle);

    //network functions
        var foreignNode = undefined;

        object.isConnected = function(){ return cable != undefined; };
        object.canDisconnect = function(){ return this.allowDisconnections() && (foreignNode!=undefined && foreignNode.allowDisconnections()); };
        object.allowConnections = function(bool){
            if(bool == undefined){return allowConnections;}
            allowConnections = bool;
        };
        object.allowDisconnections = function(bool){
            if(bool == undefined){return allowDisconnections;}
            allowDisconnections = bool;
        };
        object.connectTo = function(new_foreignNode){
            if( new_foreignNode == undefined){ return; }
            if( new_foreignNode == this ){ return; }
            if( new_foreignNode._type != this._type ){ return; }
            if( (this._direction == '' || new_foreignNode._direction == '') && this._direction != new_foreignNode._direction){ return; }
            if( this._direction != '' && (new_foreignNode._direction == this._direction) ){ return; }
            if( new_foreignNode == foreignNode ){ return; }

            this.disconnect();

            foreignNode = new_foreignNode;
            if(onconnect!=undefined){this.onconnect(true);}
            foreignNode._receiveConnection(this);

            this._addCable(this);
        };
        object._receiveConnection = function(new_foreignNode){
            this.disconnect();
            foreignNode = new_foreignNode;
            if(onconnect!=undefined){this.onconnect(false);}
        };
        object.disconnect = function(){
            if( foreignNode == undefined ){return;}

            this._removeCable();
            if(ondisconnect!=undefined){this.ondisconnect(true);}
            foreignNode._receiveDisconnection();
            foreignNode = null;
        };
        object._receiveDisconnection = function(){
            if(ondisconnect!=undefined){this.ondisconnect(false);}
            foreignNode = null;
        };
        object.getForeignNode = function(){ return foreignNode; };

    //mouse interaction
        rectangle.onmousedown = function(x,y,event){
            workspace.system.mouse.mouseInteractionHandler(
                undefined,
                function(event){
                    var point = workspace.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                    var element = workspace.core.arrangement.getElementUnderPoint(point.x,point.y);
                    if(element == undefined){return;}
                    
                    var node = element.parent;
                    if( node._connectionNode ){
                        if( node.isConnected() && !node.canDisconnect() ){return;}
                        if( object.isConnected() && !object.canDisconnect() ){return;}
                        if( allowConnections && node.allowConnections() ){ object.connectTo(node); }
                    }
                }
            );
        };
        rectangle.ondblclick = function(x,y,event){
            if( !(allowDisconnections && foreignNode.allowDisconnections()) ){return;}
            object.disconnect();
        };

    //cabling
        var cable;

        object._addCable = function(){
            cable = interfacePart.builder('cable','cable-'+this.getAddress(),{ x1:0,y1:0,x2:100,y2:100, style:{dim:cable_dimStyle, glow:cable_glowStyle}});
            foreignNode._receiveCable(cable);
            workspace.system.pane.getMiddlegroundPane(this).append(cable);
            this.draw();
        }
        object._receiveCable = function(new_cable){
            cable = new_cable;
        };
        object._removeCable = function(){
            cable.parent.remove(cable);
            cable = undefined;
            foreignNode._loseCable();
        };
        object._loseCable = function(){
            cable = undefined;
        };
        object.getCablePoint = function(){
            var offset = this.getOffset();
            var point = workspace.library.math.cartesianAngleAdjust(x+width/2,y+height/2,offset.a);
            point.x += offset.x;
            point.y += offset.y;
            return point;
        };
        object.draw = function(){
            if( cable == undefined ){return;}

            var pointA = this.getCablePoint();
            var pointB = foreignNode.getCablePoint();

            cable.draw(pointA.x,pointA.y,pointB.x,pointB.y);
        };

    //graphical
        object.activate = function(){ 
            rectangle.style.fill = glowStyle;
            if(cable!=undefined){ cable.activate(); }
        }
        object.deactivate = function(){ 
            rectangle.style.fill = dimStyle;
            if(cable!=undefined){ cable.deactivate(); }
        }

    //callbacks
        object.onconnect = onconnect;
        object.ondisconnect = ondisconnect;

    return object;
};