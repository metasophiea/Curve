interfacePart.partLibrary.dynamic.cable = function(name,data){ 
    switch(data.version){
        case 1: default:
            return interfacePart.collection.dynamic.cable(
                name, data.x1, data.y1, data.x2, data.y2,
                data.style.dim, data.style.glow,
            ); 
        case 2:
            return interfacePart.collection.dynamic.cable2(
                name, data.x1, data.y1, data.x2, data.y2, data.a1, data.a2, 
                data.style.dim, data.style.glow,
            ); 
    }
};