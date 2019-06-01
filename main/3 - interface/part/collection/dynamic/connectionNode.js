this.connectionNode = function(
    name='connectionNode',
    x, y, angle=0, width=20, height=20, type='none', direction='',
    allowConnections=true, allowDisconnections=true,
    dimStyle={r:0.86,g:0.86,b:0.86,a:1},
    glowStyle={r:0.95,g:0.95,b:0.95,a:1},
    cable_dimStyle={r:0.57,g:0.57,b:0.57,a:1},
    cable_glowStyle={r:0.84,g:0.84,b:0.84,a:1},
    cableVersion=0,
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
            var rectangle = interfacePart.builder('rectangle','node',{ width:width, height:height, colour:dimStyle });
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
            _canvas_.system.mouse.mouseInteractionHandler(
                undefined,
                function(event){
                    var element = _canvas_.core.arrangement.getElementsUnderPoint(event.X,event.Y)[0]; 
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
            if(foreignNode == undefined || !(allowDisconnections && foreignNode.allowDisconnections()) ){return;}
            object.disconnect();
        };

    //cabling
        var cable;

        object._addCable = function(){
            console.log(cableVersion);
            if(cableVersion == 2){
                cable = interfacePart.builder('cable2','cable2-'+object.getAddress().replace(/\//g, '_'),{ x1:0,y1:0,x2:100,y2:100, angle:angle, style:{dim:cable_dimStyle, glow:cable_glowStyle}});
            }else{
                cable = interfacePart.builder('cable','cable-'+object.getAddress().replace(/\//g, '_'),{ x1:0,y1:0,x2:100,y2:100, angle:angle, style:{dim:cable_dimStyle, glow:cable_glowStyle}});
            }
            
            foreignNode._receiveCable(cable);
            _canvas_.system.pane.getMiddlegroundPane(this).append(cable);
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
            var offset = object.getOffset(); 

            var diagonalLength = Math.sqrt( Math.pow((height),2)/4 + Math.pow((width),2)/4 ) * offset.scale;
            var collectedAngle = offset.angle + Math.atan( height/width );

            var tmp = _canvas_.core.viewport.adapter.windowPoint2workspacePoint( offset.x+(diagonalLength*Math.cos(collectedAngle)), offset.y+(diagonalLength*Math.sin(collectedAngle)) );
            tmp.angle = offset.angle;
            return tmp;
        };
        object.draw = function(){
            if( cable == undefined ){return;}

            var pointA = this.getCablePoint();
            var pointB = foreignNode.getCablePoint();

            cable.draw(pointA.x,pointA.y,pointB.x,pointB.y,pointA.angle,pointB.angle);
        };

    //graphical
        object.activate = function(){ 
            rectangle.colour = glowStyle;
            if(cable!=undefined){ cable.activate(); }
        }
        object.deactivate = function(){ 
            rectangle.colour = dimStyle;
            if(cable!=undefined){ cable.deactivate(); }
        }

    //callbacks
        object.onconnect = onconnect;
        object.ondisconnect = ondisconnect;

    return object;
};