var font;
var path;

function loader(fileData){
    font = library.thirdparty.opentype.parse(fileData);

    console.log('copyright:',font.names.copyright.en);
    console.log('fontFamily:',font.names.fontFamily.en);
    console.log('fontSubfamily:',font.names.fontSubfamily.en);
    console.log('fullName:',font.names.fullName.en);
    console.log('licenseURL:',font.names.licenseURL.en);
    console.log('postScriptName:',font.names.postScriptName.en);
    console.log('uniqueID:',font.names.uniqueID.en);
    console.log('version:',font.names.version.en);
    console.log('');
    console.log('- available glyphs -');
    console.log(Object.keys(font.glyphs.glyphs).map(a => String.fromCharCode(font.glyphs.glyphs[a].unicode)).join(''));
    console.log('');



    console.log('produce SVG path');
    path = font.getPath('ó',0,0,1);
    groupOne.insertAdjacentHTML( 'beforeend', path.toSVG() );

    console.log('print line commands and square pointers to svg');

    path.commands.forEach(function(a){
        console.log(JSON.stringify(a));
        if(a.type != 'Z'){
            groupOne.insertAdjacentHTML( 'beforeend', '<rect style="fill:rgb(255, 0, 0); x:'+a.x+'; y:'+a.y+'; height:0.025; width:0.025;"></rect>' );
        }
    })
}



library.misc.openFile(loader,'readAsArrayBuffer');











// function convertPointsToTriangles(points){
//     return library.thirdparty.earcut( 
//         points.flat().map(a => [a.x,a.y]).flat(),
//         points.map(item => item.length).map((item,index,array) => item+array.slice(0,index).reduce((a,b)=>a+b,0)).slice(0,-1)
//     );
// }
function drawTriangles(triangleArray,x=0,y=0,scale=1){
    for(var a = 0; a < triangleArray.length; a+=6){
        var t = (x+scale*triangleArray[a])+','+(y+scale*triangleArray[a+1])+' '+(x+scale*triangleArray[a+2])+','+(y+scale*triangleArray[a+3])+' '+(x+scale*triangleArray[a+4])+','+(y+scale*triangleArray[a+5]);
        groupOne.insertAdjacentHTML( 'beforeend',  '<polygon points="'+t+'" style="fill:lime;stroke:purple;stroke-width:0.1" />');
    }
}
function printCharacter(character,x=0,y=0,scale=1){
    function convertCharacterToPoints(pathDescriptionArray){
        var output = [];
    
        var currentPoints = [];
        pathDescriptionArray.forEach(function(element){
            switch(element.type){
                case 'M': currentPoints.push( {x:element.x,y:element.y} ); break;
                case 'L': currentPoints.push( {x:element.x,y:element.y} ); break;
    
                case 'H': break;
                case 'V': break;
                case 'C': break;
                case 'S': break;
    
                case 'Q':
                    var requiredDetail = 2;
                    var p = {
                        start:{x:currentPoints[currentPoints.length-1].x, y:currentPoints[currentPoints.length-1].y},
                        control:{x:element.x1,y:element.y1},
                        end:{x:element.x,y:element.y},
                    };
                    
                    for(var a = 1; a <= requiredDetail; a++){
                        var mux = a/requiredDetail;
                        currentPoints.push({
                            x: p.start.x + mux*(2*(p.control.x - p.start.x) + mux*(p.end.x - 2*p.control.x + p.start.x)),
                            y: p.start.y + mux*(2*(p.control.y - p.start.y) + mux*(p.end.y - 2*p.control.y + p.start.y)),
                        });
                    }
                break;
    
                case 'T': break;
                case 'A': break;
    
                case 'Z': case 'z': 
                    output.push(currentPoints);
                    currentPoints = [];
                break;
            }
        });
    
        return output;
    }

    var points = [];

    var firstPosition = {lock:false, x:0,y:0};
    var currentPosition = {x:0,y:0};
    fonts.roboto.black[character].forEach(function(element,index,array){
        switch(element.type){
            case 'M': 
                // console.log('Move to:', {x:element.x,y:element.y});
                points.push( {x:element.x,y:element.y} );
                if(!firstPosition.lock){ firstPosition.x = element.x; firstPosition.y = element.y; }
                currentPosition = {x:element.x,y:element.y}; 
            break;
            case 'L':
                // console.log('Draw line to:', {x:element.x,y:element.y});
                points.push( {x:element.x,y:element.y} );
                if(!firstPosition.lock){ firstPosition.x = element.x; firstPosition.y = element.y; }
                groupOne.insertAdjacentHTML( 'beforeend',  '<line x1="'+(x+scale*currentPosition.x)+'"; y1="'+(y+scale*currentPosition.y)+'"; x2="'+(x+scale*element.x)+'"; y2="'+(y+scale*element.y)+'"; style="stroke:rgb(255,0,0);stroke-width:"'+0.01*scale+' />');
                currentPosition = {x:element.x,y:element.y}; 
            break;

            case 'H': break;
            case 'V': break;
            case 'C': break;
            case 'S': break;

            case 'Q':
                // console.log('Draw quadratic curve to:', {x:element.x,y:element.y});
                if(!firstPosition.lock){ firstPosition.x = element.x; firstPosition.y = element.y; }

                var requiredDetail = 2;
                var p = {
                    start:{x:currentPosition.x, y:currentPosition.y},
                    control:{x:element.x1,y:element.y1},
                    end:{x:element.x,y:element.y},
                };
                
                var startPoint = p.start;
                var endPoint = undefined;
                for(var a = 1; a <= requiredDetail; a++){
                    var mux = a/requiredDetail;
                    endPoint = {
                        x: (1-mux)*(1-mux)*p.start.x + 2*(1-mux)*mux*p.control.x + mux*mux*p.end.x,
                        y: (1-mux)*(1-mux)*p.start.y + 2*(1-mux)*mux*p.control.y + mux*mux*p.end.y,
                    };
                    // console.log('\t',endPoint);
                    points.push( {x:endPoint.x,y:endPoint.y} );
                    groupOne.insertAdjacentHTML( 'beforeend', '<line x1="'+(x+scale*startPoint.x)+'"; y1="'+(y+scale*startPoint.y)+'"; x2="'+(x+scale*endPoint.x)+'"; y2="'+(y+scale*endPoint.y)+'"; style="stroke:rgb(0,0,255);stroke-width:"'+0.01*scale+' />');
                    startPoint = endPoint;
                }

                currentPosition = {x:element.x,y:element.y}; 
            break;

            case 'T': break;
            case 'A': break;

            case 'Z': case 'z': 
                // console.log('Close');
                points.push( 'break' );
                groupOne.insertAdjacentHTML( 'beforeend',  '<line x1="'+(x+scale*currentPosition.x)+'"; y1="'+(y+scale*currentPosition.y)+'"; x2="'+(x+scale*firstPosition.x)+'"; y2="'+(y+scale*firstPosition.y)+'"; style="stroke:rgb(255,0,0);stroke-width:"'+0.01*scale+' />');
                firstPosition.lock = false;
            break;
        }
    });


    points.pop();


    convertCharacterToPoints(fonts.roboto.black[character]);
    convertCharacterToPoints(fonts.roboto.black[character]).forEach(poly => {
        poly.forEach(a => {
            groupOne.insertAdjacentHTML( 'beforeend', '<rect style="fill:rgb(255, 0, 0); x:'+(x+scale*a.x)+'; y:'+(y+scale*a.y)+'; height:'+scale*0.025+'; width:'+scale*0.025+';"></rect>' );
        });
    });
}

function convertCharacterToPoints2(pathDescriptionArray){
    //split up pathDescriptionArray into its individual parts
        var output = { mainShape:[], holes:[], subShapes:[] };
        var paths = [];
        var minmax = {top:Infinity,left:Infinity,bottom:0,right:0};

        var firstPath = true;
        var currentPath = [];
        pathDescriptionArray.forEach(a => {
            if(firstPath){
                if(a.x < minmax.left){minmax.left = a.x;}
                if(a.y < minmax.top){minmax.top = a.y;}
                if(a.x > minmax.right){minmax.right = a.x;}
                if(a.y > minmax.bottom){minmax.bottom = a.y;}
            }

            currentPath.push(a);
            if(a.type == 'Z'){
                paths.push(currentPath);
                currentPath = [];
                firstPath = false;
            }
        });

        //divide up the paths into groups of drawable shapes, and their holes
            output.mainShape = paths[0];
            paths.slice(1).forEach(path => {
                var isHole = true;
                path.forEach(a => {
                    if(a.x < minmax.left || a.y < minmax.top || a.x > minmax.right || a.y > minmax.bottom){isHole = false; return;}
                });
                if(isHole){ output.holes.push(path); }
                else{ output.subShapes.push(path); }
            });

    //actual conversion
        function convertPath(path){
            var output = [];
            var currentPoints = [];
            path.forEach(function(element){
                switch(element.type){
                    case 'M': currentPoints.push( {x:element.x,y:element.y} ); break;
                    case 'L': currentPoints.push( {x:element.x,y:element.y} ); break;
        
                    case 'H': break;
                    case 'V': break;
                    case 'C': break;
                    case 'S': break;
        
                    case 'Q':
                        var requiredDetail = 2;
                        var p = {
                            start:{x:currentPoints[currentPoints.length-1].x, y:currentPoints[currentPoints.length-1].y},
                            control:{x:element.x1,y:element.y1},
                            end:{x:element.x,y:element.y},
                        };
                        
                        for(var a = 1; a <= requiredDetail; a++){
                            var mux = a/requiredDetail;
                            currentPoints.push({
                                x: p.start.x + mux*(2*(p.control.x - p.start.x) + mux*(p.end.x - 2*p.control.x + p.start.x)),
                                y: p.start.y + mux*(2*(p.control.y - p.start.y) + mux*(p.end.y - 2*p.control.y + p.start.y)),
                            });
                        }
                    break;
        
                    case 'T': break;
                    case 'A': break;
        
                    case 'Z': case 'z': 
                        output.push(currentPoints);
                        currentPoints = [];
                    break;
                }
            });

            return output;
        }
        output.mainShape = convertPath(output.mainShape)[0];
        output.holes = output.holes.map(path => convertPath(path)[0]);
        output.subShapes = output.subShapes.map(path => convertPath(path)[0]);
        
    return output;
}
function convertPointsToTriangles2(points){
    var triangles = [];

    //main shape with holes
    var allPoints = points.mainShape.map(a => [a.x,a.y]).flat();
    var holeIndexes = [];

    points.holes.forEach(pathPoints => {
        holeIndexes.push(allPoints.length/2);
        allPoints = allPoints.concat(pathPoints.map(a => [a.x,a.y]).flat());
    });
    triangles = library.thirdparty.earcut(allPoints,holeIndexes);

    //satilite shapes
    points.subShapes.forEach(pathPoints => {
        triangles = triangles.concat( library.thirdparty.earcut(pathPoints.map(a => [a.x,a.y]).flat()) );
    });

    return triangles;
}




var char = 'A'; var p = {x:10,y:80};   drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'B'; var p = {x:80,y:80};   drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'C'; var p = {x:140,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'D'; var p = {x:200,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'E'; var p = {x:260,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'F'; var p = {x:320,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'G'; var p = {x:370,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'H'; var p = {x:430,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'I'; var p = {x:500,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'J'; var p = {x:530,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'K'; var p = {x:580,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'L'; var p = {x:650,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'M'; var p = {x:700,y:80};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);

var char = 'N'; var p = {x:10,y:160};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'O'; var p = {x:80,y:160};  drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'P'; var p = {x:150,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'Q'; var p = {x:210,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'R'; var p = {x:280,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'S'; var p = {x:340,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'T'; var p = {x:400,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'U'; var p = {x:460,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'V'; var p = {x:530,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'W'; var p = {x:600,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'X'; var p = {x:690,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'Y'; var p = {x:760,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);
var char = 'Z'; var p = {x:830,y:160}; drawTriangles(convertPointsToTriangles2(convertCharacterToPoints2(fonts.roboto.black[char])),p.x,p.y,100); printCharacter(char,p.x,p.y,100);

// var char = 'i'; var p = {x:10,y:80}; printCharacter(char,p.x,p.y,100);