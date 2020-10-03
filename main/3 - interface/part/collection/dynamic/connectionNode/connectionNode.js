this.connectionNode = function(
    name='connectionNode',
    x, y, angle=0, width=20, height=20, type='none', direction='',
    allowConnections=true, allowDisconnections=true,
    dimStyle={r:0.86,g:0.86,b:0.86,a:1},
    glowStyle={r:0.95,g:0.95,b:0.95,a:1},
    cable_dimStyle={r:0.57,g:0.57,b:0.57,a:1},
    cable_glowStyle={r:0.84,g:0.84,b:0.84,a:1},
    cableConnectionPosition={x:1/2,y:1/2},
    cableVersion=1, proximityThreshold={distance:15, hysteresisDistance:1},
    onconnect=function(instigator){},
    ondisconnect=function(instigator){},
){
    dev.log.partDynamic('.connectionNode(...)'); //#development

    //elements
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
            object._connectionNode = true;
            object._type = type;
            object._direction = direction;
        //node
            const rectangle = interfacePart.builder('basic','rectangle','node',{ width:width, height:height, colour:dimStyle });
                object.append(rectangle);

    //network functions
        let foreignNode = undefined;

        object._onconnect = function(instigator){};
        object._ondisconnect = function(instigator){};

        object.isConnected = function(){ return cable != undefined; };
        object.canDisconnect = function(){ return this.allowDisconnections() && (foreignNode!=undefined && foreignNode.allowDisconnections()); };
        object.isAppropiateConnectionNode = function(potentialConnectionNode){
            if( object._type != potentialConnectionNode._type ){ return false; }
            if( (object._direction == '' || potentialConnectionNode._direction == '') && object._direction != potentialConnectionNode._direction ){ return false; }
            if( object._direction != '' && (potentialConnectionNode._direction == object._direction) ){ return false; }
            return true;
        };
        object.allowConnections = function(bool){
            if(bool == undefined){return allowConnections;}
            allowConnections = bool;
        };
        object.allowDisconnections = function(bool){
            if(bool == undefined){return allowDisconnections;}
            allowDisconnections = bool;
        };
        object.connectTo = function(new_foreignNode){
            dev.log.partDynamic('.connectionNode.connectTo('+(new_foreignNode!=undefined?JSON.stringify(new_foreignNode.getAddress()):'-undefined-')+')'); //#development

            if( new_foreignNode == undefined){ return; }
            if( new_foreignNode == this ){ return; }
            if( new_foreignNode._type != this._type ){ return; }
            if( !this.isAppropiateConnectionNode(new_foreignNode) ){ return; }

            if( new_foreignNode == foreignNode ){ return; }
            if( new_foreignNode.isConnected() && !new_foreignNode.canDisconnect() ){ return; }

            this.disconnect();

            foreignNode = new_foreignNode;
            this._onconnect(true);
            if(object.onconnect!=undefined){ try{object.onconnect(true);}catch(error){console.log('connectionNode::'+name+'::onconnect error',error);} }
            foreignNode._receiveConnection(this);

            this._addCable(this);
        };
        object._receiveConnection = function(new_foreignNode){
            this.disconnect();
            foreignNode = new_foreignNode;
            this._onconnect(false);
            if(object.onconnect!=undefined){ try{object.onconnect(false);}catch(error){console.log('connectionNode::'+name+'::onconnect error:',error);} }
        };
        object.disconnect = function(){
            if( foreignNode == undefined ){return;}

            this._removeCable();
            this._ondisconnect(true);
            if(object.ondisconnect!=undefined){try{object.ondisconnect(true);}catch(error){console.log('connectionNode::'+name+'::ondisconnect error:',error);}}
            foreignNode._receiveDisconnection();
            foreignNode = null;
        };
        object._receiveDisconnection = function(){
            this._ondisconnect(false);
            if(object.ondisconnect!=undefined){try{object.ondisconnect(false);}catch(error){console.log('connectionNode::'+name+'::ondisconnect error:',error);}}
            foreignNode = null;
        };
        object.getForeignNode = function(){ return foreignNode; };

    //cabling
        let cable;

        object._addCable = function(){
            cable = interfacePart.builder('dynamic', 'cable', 'cable-'+object.getAddress().replace(/\//g, '_'),{ 
                x1:0,y1:0,x2:100,y2:100, angle:angle, version:cableVersion, 
                style:{dim:cable_dimStyle, glow:cable_glowStyle}
            });
            
            foreignNode._receiveCable(cable);
            const pane = _canvas_.system.pane.getMiddlegroundPane(this);
            pane.append(cable);
            object.draw();
            if(isActive){ cable.activate(); }
        }
        object._receiveCable = function(new_cable){
            cable = new_cable;
        };
        object._removeCable = function(){
            dev.log.partDynamic('.connectionNode._removeCable()'); //#development
            cable.parent.remove(cable);
            cable = undefined;
            foreignNode._loseCable();
        };
        object._loseCable = function(){
            cable = undefined;
        };
        object.getAttachmentPoint = function(){
            dev.log.partDynamic('.connectionNode.getAttachmentPoint()'); //#development
            const offset = object.getOffset();
            const diagonalLength = Math.sqrt( Math.pow((rectangle.height()),2)/4 + Math.pow((rectangle.width()),2)/4 ) * offset.scale;
            const collectedAngle = offset.angle + Math.atan( rectangle.height()/rectangle.width() );
            dev.log.partDynamic('.connectionNode.getAttachmentPoint -> offset:'+JSON.stringify(offset)+' diagonalLength:'+diagonalLength+' collectedAngle:'+collectedAngle); //#development

            return {
                x: offset.x + (diagonalLength*Math.cos(collectedAngle))*cableConnectionPosition.x*2, 
                y: offset.y + (diagonalLength*Math.sin(collectedAngle))*cableConnectionPosition.y*2,
                angle: offset.angle
            };
        };
        object.draw = function(){
            if( cable == undefined ){return;}

            const pointA = this.getAttachmentPoint();
            const pointB = foreignNode.getAttachmentPoint();

            cable.draw(pointA.x,pointA.y,pointB.x,pointB.y,pointA.angle,pointB.angle);
        };

    //mouse interaction
        rectangle.attachCallback('onmousedown', function(x,y,event){
            dev.log.partDynamic('.connectionNode-onmousedown(...)'); //#development
            let displacedNode = undefined;

            let liveCable;
            function createLiveCable(){
                const pointA = object.getAttachmentPoint();
                const liveCable = interfacePart.builder(
                    'dynamic', 'cable','liveCable-'+object.getAddress().replace(/\//g, '_'),
                    { x1:pointA.x,y1:pointA.y,x2:x,y2:y, version:cableVersion, angle:angle, style:{dim:cable_dimStyle, glow:cable_glowStyle}}
                );
                _canvas_.system.pane.getMiddlegroundPane(object).append(liveCable);
                return liveCable;
            }

            _canvas_.system.mouse.mouseInteractionHandler(
                function(x,y,event){
                    if( !object.allowConnections() ){return;}
                    if( object.isConnected() && !object.canDisconnect() ){return;}
                    if( object.getForeignNode() != undefined && object.getForeignNode().isConnected() && !object.getForeignNode().canDisconnect() ){return;}

                    const mousePoint = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);
                    dev.log.partDynamic('.connectionNode-onmousedown -> mousePoint:'+JSON.stringify(mousePoint)); //#development

                    //gather connection nodes within proximity
                        const nodesWithinProximity = interfacePart.collection.dynamic.connectionNode.registry.map(node => {
                            if(node === object){return;}
                            const point = node.getAttachmentPoint();
                            const distance = Math.pow((Math.pow((point.x-mousePoint.x),2) + Math.pow((point.y-mousePoint.y),2)),1/2);
                            if(distance < proximityThreshold.distance){ return {node:node,distance:distance}; }
                        }).filter(item => item!=undefined).sort((a, b) => {return a.distance-b.distance});
                        dev.log.partDynamic('.connectionNode-onmousedown -> nodesWithinProximity:'+JSON.stringify(nodesWithinProximity.map(i => ({distance:i.distance, node:i.node.getAddress()}) ))); //#development

                    //select node to snap to
                        let snapToNode = undefined;
                        if(nodesWithinProximity.length == 0){
                            if( object.isConnected() ){
                                const point = object.getForeignNode().getAttachmentPoint();
                                const distance = Math.pow((Math.pow((point.x-mousePoint.x),2) + Math.pow((point.y-mousePoint.y),2)),1/2);
                                snapToNode = distance > proximityThreshold.distance + proximityThreshold.hysteresisDistance ? undefined : object.getForeignNode();
                            }
                        }else if( nodesWithinProximity.length == 1 ){
                            if( object.isConnected() ){
                                const point = object.getForeignNode().getAttachmentPoint();
                                const distance = Math.pow((Math.pow((point.x-mousePoint.x),2) + Math.pow((point.y-mousePoint.y),2)),1/2);
                                snapToNode = distance > proximityThreshold.distance + proximityThreshold.hysteresisDistance ? nodesWithinProximity[0].node : object.getForeignNode();
                            }else{
                                snapToNode = nodesWithinProximity[0].node;
                            }
                        }else{
                            if(!object.isConnected()){
                                snapToNode = nodesWithinProximity[0].node;
                            }else{
                                const point = object.getForeignNode().getAttachmentPoint();
                                const currentlyConnectedNode = { node:object.getForeignNode(), distance:Math.pow((Math.pow((point.x-mousePoint.x),2) + Math.pow((point.y-mousePoint.y),2)),1/2) };
                                const relevantNodes = nodesWithinProximity.filter(node => node.node != object.getForeignNode() );

                                snapToNode = currentlyConnectedNode.distance > relevantNodes[0].distance + proximityThreshold.hysteresisDistance ? relevantNodes[0].node : currentlyConnectedNode.node;
                            }
                        }
                        dev.log.partDynamic('.connectionNode-onmousedown -> snapToNode:'+(snapToNode!=undefined?JSON.stringify(snapToNode.getAddress()):'-none-')); //#development
                    
                    //if no node is to be snapped to; use the liveCable, otherwise remove the live cable and attempt a connection
                        if( snapToNode == undefined || !snapToNode.allowConnections() || !object.isAppropiateConnectionNode(snapToNode) ){
                            dev.log.partDynamic('.connectionNode-onmousedown -> no node found'); //#development
                            if( liveCable == undefined ){
                                if( object.isConnected() && displacedNode!=undefined ){
                                    object.getForeignNode().connectTo(displacedNode);
                                    displacedNode = undefined;
                                }else{
                                    object.disconnect();
                                }
                                liveCable = createLiveCable();
                            }

                            const thisNode_point = object.getAttachmentPoint();
                            mousePoint.angle = _canvas_.library.math.getAngleOfTwoPoints(mousePoint,thisNode_point);
                            liveCable.draw( thisNode_point.x,thisNode_point.y, mousePoint.x,mousePoint.y, thisNode_point.angle,mousePoint.angle, false );
                        }else{
                            dev.log.partDynamic('.connectionNode-onmousedown -> node found'); //#development
                            if(liveCable != undefined){
                                liveCable.parent.remove(liveCable);
                                liveCable = undefined;
                            }

                            if( object.getForeignNode() != snapToNode ){
                                if( object.isConnected() && displacedNode != undefined ){
                                    object.getForeignNode().connectTo(displacedNode);
                                    displacedNode = undefined;
                                }
                                if( snapToNode.isConnected() ){
                                    displacedNode = snapToNode.getForeignNode();
                                }
                                
                                object.connectTo(snapToNode);
                            }
                        }
                },
                function(x,y,event){
                    if(liveCable != undefined){ liveCable.parent.remove(liveCable); liveCable = undefined; }
                }
            );
        } );
        rectangle.attachCallback('ondblclick', function(x,y,event){
            if(foreignNode == undefined || !(allowDisconnections && foreignNode.allowDisconnections()) ){return;}
            object.disconnect();
        } );

    //graphical
        let isActive = false;
        object.activate = function(){ 
            rectangle.colour(glowStyle);
            if(cable!=undefined){ cable.activate(); }
            isActive = true;
        }
        object.deactivate = function(){ 
            rectangle.colour(dimStyle);
            if(cable!=undefined){ cable.deactivate(); }
            isActive = false;
        }

    //callbacks
        object.onconnect = onconnect;
        object.ondisconnect = ondisconnect;

    //register self
        object.attachCallback('onadd', function(){
            interfacePart.collection.dynamic.connectionNode.registry.push(object);
        });
        object.attachCallback('onremove', function(){
            interfacePart.collection.dynamic.connectionNode.registry.splice(
                interfacePart.collection.dynamic.connectionNode.registry.indexOf(object), 
                1
            );
        });

    return object;
};
this.connectionNode.registry = [];
interfacePart.partLibrary.dynamic.connectionNode = function(name,data){ 
    return interfacePart.collection.dynamic.connectionNode(
        name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableConnectionPosition, data.cableVersion, data.proximityThreshold,
        data.onconnect, data.ondisconnect,
    ); 
};