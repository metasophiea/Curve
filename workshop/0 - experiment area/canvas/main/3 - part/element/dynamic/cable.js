this.cable = function(
    name='path', 
    x1=0, y1=0, x2=0, y2=0,
    dimStyle='rgb(255,0,0)',
    glowStyle='rgb(255,100,100)',
){
    //elements 
        //main
            var object = canvas.part.builder('group',name);
        //cable shape
            var path = canvas.part.builder('path','cable',{
                points:[{x:x1,y:y1},{x:x2,y:y2}],
                style:{
                    stroke:dimStyle,
                    lineWidth:5,
                }
            });
            object.append(path);
    
    //controls
        object.activate = function(){ path.style.stroke = glowStyle; };
        object.deactivate = function(){ path.style.stroke = dimStyle; };
        object.draw = function(new_x1,new_y1,new_x2,new_y2){
            x1 = (new_x1!=undefined ? new_x1 : x1); 
            y1 = (new_y1!=undefined ? new_y1 : y1);
            x2 = (new_x2!=undefined ? new_x2 : x2); 
            y2 = (new_y2!=undefined ? new_y2 : y2);
            path.parameter.points([{x:x1,y:y1},{x:x2,y:y2}]);
        };

    return object;
};