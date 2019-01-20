this.glowbox_rect = function(
    name='glowbox_rect',
    x, y, width=30, height=30, angle=0,
    glowStyle = 'rgba(244,234,141,1)',
    dimStyle = 'rgba(80,80,80,1)'
){
    //elements 
        var object = interfacePart.builder('group',name,{x:x, y:y});
        var rect = interfacePart.builder('rectangle','light',{ width:width, height:height, angle:angle, style:{fill:dimStyle} });
            object.append(rect);

    //methods
        object.on = function(){
            rect.style.fill = glowStyle;
        };
        object.off = function(){
            rect.style.fill = dimStyle;
        };

    return object;
};

// this.glowbox_rect_img = function(
//     name='glowbox_rect',
//     x, y, width=30, height=30, angle=0,
//     glowStyle = 'rgba(244,234,141,1)',
//     dimStyle = 'rgba(80,80,80,1)',
//     imageOverlay='images/units/alpha/glowbox_rect_overlay_1.png',
// ){
//     //elements 
//         var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
//         var rect = interfacePart.builder('rectangle','light',{ width:width, height:height, style:{fill:dimStyle} });
//             object.append(rect);
//         var overlay = interfacePart.builder('clippedImage','overlay',{ width:width, height:height, url:imageOverlay, points:[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}] });
//             object.append(overlay);

//     //methods
//         object.on = function(){
//             rect.style.fill = glowStyle;
//         };
//         object.off = function(){
//             rect.style.fill = dimStyle;
//         };

//     return object;
// };