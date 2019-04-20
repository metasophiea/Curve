var font;
var path;

library.misc.openFile(function(fileData){
    font = library.thirdparty.opentype.parse(fileData);
    path = font.getPath('Q',0,0,1);

    groupOne.insertAdjacentHTML( 'beforeend', path.toSVG() );

    path.commands.forEach(function(a){
        console.log(JSON.stringify(a));
        if(a.type != 'Z'){
            groupOne.insertAdjacentHTML( 'beforeend', '<rect style="fill:rgb(255, 0, 0); x:'+a.x+'; y:'+a.y+'; height:0.025; width:0.025;"></rect>' );
        }
    })
},'readAsArrayBuffer');





var Q_data = [
    {"type":"M","x":0.65673828125,"y":-0.37353515625},
    {"type":"L","x":0.65673828125,"y":-0.3408203125},
    {"type":"Q","x1":0.65673828125,"y1":-0.2421875,"x":0.6240234375,"y":-0.168701171875},
    {"type":"Q","x1":0.59130859375,"y1":-0.09521484375,"x":0.53369140625,"y":-0.05078125},
    {"type":"L","x":0.53369140625,"y":-0.05078125},
    {"type":"L","x":0.6484375,"y":0.0400390625},
    {"type":"L","x":0.54248046875,"y":0.1298828125},
    {"type":"L","x":0.3896484375,"y":0.0068359375},
    {"type":"Q","x1":0.3681640625,"y1":0.009765625,"x":0.3466796875,"y":0.009765625},
    {"type":"L","x":0.3466796875,"y":0.009765625},
    {"type":"Q","x1":0.255859375,"y1":0.009765625,"x":0.185546875,"y":-0.0322265625},
    {"type":"Q","x1":0.115234375,"y1":-0.07421875,"x":0.075927734375,"y":-0.15234375},
    {"type":"Q","x1":0.03662109375,"y1":-0.23046875,"x":0.03515625,"y":-0.33203125},
    {"type":"L","x":0.03515625,"y":-0.33203125},
    {"type":"L","x":0.03515625,"y":-0.36962890625},
    {"type":"Q","x1":0.03515625,"y1":-0.474609375,"x":0.073486328125,"y":-0.55419921875},
    {"type":"Q","x1":0.11181640625,"y1":-0.6337890625,"x":0.182861328125,"y":-0.67724609375},
    {"type":"Q","x1":0.25390625,"y1":-0.720703125,"x":0.345703125,"y":-0.720703125},
    {"type":"L","x":0.345703125,"y":-0.720703125},
    {"type":"Q","x1":0.43603515625,"y1":-0.720703125,"x":0.5068359375,"y":-0.677734375},
    {"type":"Q","x1":0.57763671875,"y1":-0.634765625,"x":0.616943359375,"y":-0.555419921875},
    {"type":"Q","x1":0.65625,"y1":-0.47607421875,"x":0.65673828125,"y":-0.37353515625},
    {"type":"L","x":0.65673828125,"y":-0.37353515625},
    {"type":"Z"},
    {"type":"M","x":0.482421875,"y":-0.337890625},
    {"type":"L","x":0.482421875,"y":-0.37060546875},
    {"type":"Q","x1":0.482421875,"y1":-0.4765625,"x":0.447021484375,"y":-0.531494140625},
    {"type":"Q","x1":0.41162109375,"y1":-0.58642578125,"x":0.345703125,"y":-0.58642578125},
    {"type":"L","x":0.345703125,"y":-0.58642578125},
    {"type":"Q","x1":0.27783203125,"y1":-0.58642578125,"x":0.24365234375,"y":-0.5322265625},
    {"type":"Q","x1":0.20947265625,"y1":-0.47802734375,"x":0.208984375,"y":-0.37353515625},
    {"type":"L","x":0.208984375,"y":-0.37353515625},
    {"type":"L","x":0.208984375,"y":-0.3408203125},
    {"type":"Q","x1":0.208984375,"y1":-0.23583984375,"x":0.24365234375,"y":-0.179931640625},
    {"type":"Q","x1":0.2783203125,"y1":-0.1240234375,"x":0.3466796875,"y":-0.1240234375},
    {"type":"L","x":0.3466796875,"y":-0.1240234375},
    {"type":"Q","x1":0.412109375,"y1":-0.1240234375,"x":0.447021484375,"y":-0.17919921875},
    {"type":"Q","x1":0.48193359375,"y1":-0.234375,"x":0.482421875,"y":-0.337890625},
    {"type":"L","x":0.482421875,"y":-0.337890625},
    {"type":"Z"},
];




// for(var a = 0; a < Q_data.length; a++){
//     switch(Q_data[a].type){
//         case 'M': groupOne.insertAdjacentHTML( 'beforeend', '<rect style="fill:rgb(255, 0, 0); x:'+Q_data[a].x+'; y:'+Q_data[a].y+'; height:0.04; width:0.04;"></rect>' ); break;
//         case 'L': groupOne.insertAdjacentHTML( 'beforeend', '<rect style="fill:rgb(0, 255, 0); x:'+Q_data[a].x+'; y:'+Q_data[a].y+'; height:0.015; width:0.035;"></rect>' ); break;
//         case 'Q': groupOne.insertAdjacentHTML( 'beforeend', '<rect style="fill:rgb(0, 0, 255); x:'+Q_data[a].x+'; y:'+Q_data[a].y+'; height:0.035; width:0.015;"></rect>' ); break;
//     }
// }

// for(var a = 1; a < Q_data.length; a++){
    
//     switch(Q_data[a].type){
//         case 'M': case 'L': case 'Q':
//             var tmp = '<line x1="'+Q_data[a-1].x+'"; y1="'+Q_data[a-1].y+'"; x2="'+Q_data[a].x+'"; y2="'+Q_data[a].y+'"; style="stroke:rgb(255,0,0);stroke-width:0.01" />';
//             console.log(tmp);
//             groupOne.insertAdjacentHTML( 'beforeend', tmp);
//         break;
//     }

// }


var initialPoint = true;
var firstPosition = {lock:false, x:0,y:0};
var currentPosition = {x:0,y:0};
Q_data.forEach(function(element,index,array){
    switch(element.type){
        case 'M': 
            console.log('Move to:', {x:element.x,y:element.y});
            if(!firstPosition.lock && !initialPoint){
                groupOne.insertAdjacentHTML( 'beforeend',  '<line x1="'+currentPosition.x+'"; y1="'+currentPosition.y+'"; x2="'+element.x+'"; y2="'+element.y+'"; style="stroke:rgb(255,0,0);stroke-width:0.01" />');
                firstPosition.x = element.x; firstPosition.y = element.y;
            }
            currentPosition = {x:element.x,y:element.y}; 
            if(initialPoint){ initialPoint = false; }
        break;
        case 'L':
            console.log('Draw line to:', {x:element.x,y:element.y});
            if(!firstPosition.lock){ firstPosition.x = element.x; firstPosition.y = element.y; }
            groupOne.insertAdjacentHTML( 'beforeend',  '<line x1="'+currentPosition.x+'"; y1="'+currentPosition.y+'"; x2="'+element.x+'"; y2="'+element.y+'"; style="stroke:rgb(255,0,0);stroke-width:0.01" />');
            currentPosition = {x:element.x,y:element.y}; 
        break;
        case 'Q':
            console.log('Draw quadratic curve to:', {x:element.x,y:element.y});
            if(!firstPosition.lock){ firstPosition.x = element.x; firstPosition.y = element.y; }
            groupOne.insertAdjacentHTML( 'beforeend',  '<line x1="'+currentPosition.x+'"; y1="'+currentPosition.y+'"; x2="'+element.x+'"; y2="'+element.y+'"; style="stroke:rgb(255,0,0);stroke-width:0.01" />');
            currentPosition = {x:element.x,y:element.y}; 
        break;
        case 'Z': 
            console.log('Close, line from:',{x:currentPosition.x,y:currentPosition.y},'to',{x:firstPosition.x,y:firstPosition.y});
            groupOne.insertAdjacentHTML( 'beforeend',  '<line x1="'+currentPosition.x+'"; y1="'+currentPosition.y+'"; x2="'+firstPosition.x+'"; y2="'+firstPosition.y+'"; style="stroke:rgb(255,0,0);stroke-width:0.01" />');
            firstPosition.lock = false;
        break;
    }
});