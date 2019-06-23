{{include:*}} /**/

interfacePart.partLibrary.dynamic = {
    cable: function(name,data){ return interfacePart.collection.dynamic.cable(
        name, data.x1, data.y1, data.x2, data.y2,
        data.style.dim, data.style.glow,
    ); },
    cable2: function(name,data){ return interfacePart.collection.dynamic.cable2(
        name, data.x1, data.y1, data.x2, data.y2,
        data.style.dim, data.style.glow,
    ); },
    connectionNode: function(name,data){ return interfacePart.collection.dynamic.connectionNode(
        name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableVersion,
        data.onconnect, data.ondisconnect,
    ); },
    connectionNode_signal: function(name,data){ return interfacePart.collection.dynamic.connectionNode_signal(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableVersion,
        data.onchange, data.onconnect, data.ondisconnect,
    ); },
    connectionNode_voltage: function(name,data){ return interfacePart.collection.dynamic.connectionNode_voltage(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableVersion,
        data.onchange, data.onconnect, data.ondisconnect,
    ); },
    connectionNode_data: function(name,data){ return interfacePart.collection.dynamic.connectionNode_data(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, data.cableVersion,
        data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
    ); },
    connectionNode_audio: function(name,data){ return interfacePart.collection.dynamic.connectionNode_audio(
        name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections, data.isAudioOutput, _canvas_.library.audio.context, data.cableVersion,
        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
        data.onconnect, data.ondisconnect,
    ); },
};