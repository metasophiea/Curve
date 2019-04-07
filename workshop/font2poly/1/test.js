var font;
var path;

library.misc.openFile(function(fileData){
    font = library.thirdparty.opentype.parse(fileData);
    path = font.getPath('Q',0,0,1);

    groupOne.insertAdjacentHTML( 'beforeend', path.toSVG() );

    path.commands.forEach(function(a){
        if(a.type != 'Z'){
            groupOne.insertAdjacentHTML( 'beforeend', '<rect style="fill:rgb(255, 0, 0); x:'+a.x+'; y:'+a.y+'; height:0.025; width:0.025;"></rect>' );
        }
    })
},'readAsArrayBuffer');