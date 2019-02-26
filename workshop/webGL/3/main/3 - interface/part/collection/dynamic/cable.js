this.cable = function(
    name='path', 
    x1=0, y1=0, x2=0, y2=0,
    dimStyle={r:1,g:0,b:0,a:1},
    glowStyle={r:1,g:0.39,b:0.39,a:1},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name);
        //cable shape
            var path = interfacePart.builder('path','cable',{ points:[x1,y1,x2,y2], colour:dimStyle, thickness:2.5 });
            object.append(path);
    
    //controls
        object.activate = function(){ path.colour = glowStyle; };
        object.deactivate = function(){ path.colour = dimStyle; };
        object.draw = function(new_x1,new_y1,new_x2,new_y2){
            x1 = (new_x1!=undefined ? new_x1 : x1); 
            y1 = (new_y1!=undefined ? new_y1 : y1);
            x2 = (new_x2!=undefined ? new_x2 : x2); 
            y2 = (new_y2!=undefined ? new_y2 : y2);
            path.points([x1,y1,x2,y2]);
        };

    //identifier
        object._isCable = true;

    return object;
};