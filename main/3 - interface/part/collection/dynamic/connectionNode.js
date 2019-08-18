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
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
            object._connectionNode = true;
            object._type = type;
            object._direction = direction;
        //node
            var rectangle = interfacePart.builder('basic','rectangle','node',{ width:width, height:height, colour:dimStyle });
                object.append(rectangle);

    //network functions
        var foreignNode = undefined;

        object._onconnect = function(instigator){};
        object._ondisconnect = function(instigator){};

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
            this._onconnect(true);
            if(object.onconnect!=undefined){object.onconnect(true);}
            foreignNode._receiveConnection(this);

            this._addCable(this);
        };
        object._receiveConnection = function(new_foreignNode){
            this.disconnect();
            foreignNode = new_foreignNode;
            this._onconnect(false);
            if(object.onconnect!=undefined){object.onconnect(false);}
        };
        object.disconnect = function(){
            if( foreignNode == undefined ){return;}

            this._removeCable();
            this._ondisconnect(true);
            if(object.ondisconnect!=undefined){object.ondisconnect(true);}
            foreignNode._receiveDisconnection();
            foreignNode = null;
        };
        object._receiveDisconnection = function(){
            this._ondisconnect(false);
            if(object.ondisconnect!=undefined){object.ondisconnect(false);}
            foreignNode = null;
        };
        object.getForeignNode = function(){ return foreignNode; };

    //mouse interaction
        rectangle.onmousedown = function(x,y,event){
            var tempCableType = cableVersion == 2 ? 'cable2' : 'cable';
            var pointA = object.getCablePoint();
            var tmpCable = interfacePart.builder(
                'dynamic',tempCableType,'tmpCable-'+object.getAddress().replace(/\//g, '_'),
                { x1:pointA.x,y1:pointA.y,x2:x,y2:y, angle:angle, style:{dim:cable_dimStyle, glow:cable_glowStyle}}
            );

            _canvas_.system.pane.getMiddlegroundPane(object).append(tmpCable);

            _canvas_.system.mouse.mouseInteractionHandler(
                function(event){
                    var pointA = object.getCablePoint();
                    var pointB = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                    pointB.angle = _canvas_.library.math.getAngleOfTwoPoints(pointB,pointA)

                    tmpCable.draw( pointA.x,pointA.y, pointB.x,pointB.y, pointA.angle,pointB.angle );
                },
                function(event){
                    tmpCable.parent.remove(tmpCable);
                    tmpCable = undefined;

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
            var tempCableType = cableVersion == 2 ? 'cable2' : 'cable';
            cable = interfacePart.builder('dynamic',tempCableType, tempCableType+'-'+object.getAddress().replace(/\//g, '_'),{ x1:0,y1:0,x2:100,y2:100, angle:angle, style:{dim:cable_dimStyle, glow:cable_glowStyle}});
            
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

interfacePart.partLibrary.dynamic.connectionNode = function(name,data){ 
    return interfacePart.collection.dynamic.connectionNode(
        name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableVersion,
        data.onconnect, data.ondisconnect,
    ); 
};