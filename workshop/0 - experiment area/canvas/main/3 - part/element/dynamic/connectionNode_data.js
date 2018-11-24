this.connectionNode_data = function(
    name='connectionNode_data',
    x, y, angle=0, width=20, height=20,
    dimStyle='rgba(220, 244, 255,1)',
    glowStyle='rgba(244, 244, 255, 1)',
    cable_dimStyle='rgb(84, 146, 247)',
    cable_glowStyle='rgb(123, 168, 242)',
    onreceive=function(address, data){},
    ongive=function(address){},
    onconnect=function(){},
    ondisconnect=function(){},
){
    //elements
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
            object._connectionNode = true;
            object._type = 'data';
        //node
            var rectangle = canvas.part.builder('rectangle','node',{ width:width, height:height, style:{fill:dimStyle} });
                object.append(rectangle);

    //control
        object.send = function(address,data){
            object.activate();
            setTimeout(function(){ if(object==undefined){return;} object.deactivate(); },100);

            if(foreignNode==undefined){return;}
            if(foreignNode.onreceive){foreignNode.onreceive(address, data);}
        };
        object.request = function(address){
            if(foreignNode==undefined){return;}
            if(foreignNode.ongive){foreignNode.ongive(address, data);}
        };

    //network functions
        var foreignNode = undefined;

        object.connectTo = function(new_foreignNode){
            if( new_foreignNode == this ){ return; }
            if( new_foreignNode._type != this._type ){ return; }
            if( new_foreignNode == foreignNode ){ return; }

            this.disconnect();

            foreignNode = new_foreignNode;
            foreignNode._receiveConnection(this);
            this.onconnect();

            this._addCable(this);
        };
        object._receiveConnection = function(new_foreignNode){
            this.disconnect();
            foreignNode = new_foreignNode;
            this.onconnect();
        };
        object.disconnect = function(){
            if( foreignNode == undefined ){return;}

            this._removeCable();
            foreignNode._receiveDisconnection();
            foreignNode = null;

            this.ondisconnect();
        };
        object._receiveDisconnection = function(){
            foreignNode = null;
            this.ondisconnect();
        };

    //mouse interaction
        rectangle.onmousedown = function(x,y,event){
            canvas.system.mouse.mouseInteractionHandler(
                undefined,
                function(event){
                    var point = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                    var element = canvas.core.arrangement.getElementUnderPoint(point.x,point.y);
                    if(element == undefined){return;}
                    
                    var node = element.parent;
                    if( node._connectionNode ){ object.connectTo(node); }
                }
            );
        };
        rectangle.ondblclick = function(x,y,event){
            object.disconnect();
        };

    //cabling
        var cable;

        object._addCable = function(){
            cable = canvas.part.builder('cable','cable-'+this.getAddress(),{ x1:0,y1:0,x2:100,y2:100, style:{dimStyle:cable_dimStyle, glowStyle:cable_glowStyle}});
            foreignNode._receiveCable(cable);
            canvas.system.pane.getMiddlegroundPane(this).append(cable);
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
            var point = canvas.library.math.cartesianAngleAdjust(x,y,offset.a); 
            point.x += offset.x + width/2;
            point.y += offset.y + height/2;
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
        object.onreceive = onreceive;
        object.ongive = ongive;
        object.onconnect = onconnect;
        object.ondisconnect = ondisconnect;

    return object;
};