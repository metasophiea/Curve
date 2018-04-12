function makeMusicalKeyboard(x,y){
    var baseWidth = 295;
    var baseHeight = 62.5;
    var connectorWidth = 30;
    var connectorHeight = 30;

    var whiteKeyWidth = 12.5;
    var whiteKeyHeight = 50;
    var blackKeyWidth = 5;
    var blackKeyHeight = 30;


    //elements
        //main
            var _mainObject = parts.basic.g('musicalKeyboard', x, y);

            var backing = parts.basic.rect(null, 0, 0, baseWidth, baseHeight, 0, 'fill:rgba(200,200,200,1)');
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeMusicalKeyboard);

            var keycaptureObj = __globals.keyboardInteraction.declareKeycaptureObject(_mainObject);
                keycaptureObj.keyPress = function(key){ if(keys[key]){ keys[key].press(); } };
                keycaptureObj.keyRelease = function(key){ if(keys[key]){ keys[key].release(); } };

            _mainObject.append(parts.display.label(null, 292.5, 40, 'noteName','fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',-Math.PI/2));
            

            // connection ports
                _mainObject.io = {};
                _mainObject.io.out = parts.dynamic.connectionNode_data('io.out',baseWidth-connectorWidth/2,baseHeight/2-connectorHeight/2,connectorWidth,connectorHeight);
                    _mainObject.prepend(_mainObject.io.out);

            //generate selection area        
                _mainObject.selectionArea = {};
                _mainObject.selectionArea.box = [];
                _mainObject.selectionArea.points = [];
                _mainObject.updateSelectionArea = function(){
                    //the main shape we want to use
                    var temp = __globals.utility.getBoundingBox(backing);
                    _mainObject.selectionArea.points = [
                        [temp.x,temp.y],
                        [temp.x+temp.width,temp.y],
                        [temp.x+temp.width,temp.y+temp.height],
                        [temp.x,temp.y+temp.height]
                    ];
                    _mainObject.selectionArea.box = __globals.utility.getBoundingBoxFromPoints(_mainObject.selectionArea.points);
        
                    //adjusting it for the object's position in space
                    temp = __globals.utility.getTransform(_mainObject);
                    _mainObject.selectionArea.box.forEach(function(element) {
                        element[0] += temp[0];
                        element[1] += temp[1];
                    });
                    _mainObject.selectionArea.points.forEach(function(element) {
                        element[0] += temp[0];
                        element[1] += temp[1];
                    });
                };
                _mainObject.updateSelectionArea();

            
            //keys
                var keys = {};
                keys.white = {};
                keys.white.style = {};
                    keys.white.style.off = 'fill:rgba(250,250,250,1)';
                    keys.white.style.press = 'fill:rgba(230,230,230,1)';
                    keys.white.style.glow = 'fill:rgba(220,200,220,1)';
                    keys.white.style.pressAndGlow = 'fill:rgba(200,150,200,1)';
                keys.black = {};
                keys.black.style = {};
                    keys.black.style.off = 'fill:rgba(50,50,50,1)';
                    keys.black.style.press = 'fill:rgba(100,100,100,1)';
                    keys.black.style.glow = 'fill:rgba(220,200,220,1)';
                    keys.black.style.pressAndGlow = 'fill:rgba(200,150,200,1)';

                var glyphs = [
                    '\\','a','z','s','x','c','f','v','g','b','h','n','m','k',',','l','.','/',
                    '1','q','2','w','3','e','r','5','t','6','y','u','8','i','9','o','0','p','[' 
                ];
                var noteNames = [
                    '4C', '4C#', '4D', '4D#', '4E', '4F', '4F#', '4G', '4G#', '4A', '4A#', '4B', '5C', '5C#', '5D', '5D#', '5E', '5F',
                    '5F#', '5G', '5G#', '5A', '5A#', '5B', '6C', '6C#', '6D', '6D#', '6E', '6F', '6F#', '6G', '6G#', '6A', '6A#', '6B', '7C'
                ];
                
                var whiteX = 10;
                var blackX = 20;
                for(var a = 0; a < glyphs.length; a++){
                    if( noteNames[a].slice(-1) != '#' ){
                        keys[glyphs[a]] = parts.control.key_rect(noteNames[a], whiteX, baseHeight-whiteKeyHeight, whiteKeyWidth, whiteKeyHeight, 0, keys.white.style.off, keys.white.style.press, keys.white.style.glow, keys.white.style.pressAndGlow);
                        keys[glyphs[a]].noteName = noteNames[a];
                        keys[glyphs[a]].onkeydown = function(){ _mainObject.io.out.send('noteName', {'name':this.noteName,'velocity':1} ); }
                        keys[glyphs[a]].onkeyup   = function(){ _mainObject.io.out.send('noteName', {'name':this.noteName,'velocity':0} ); }
                        _mainObject.append(keys[glyphs[a]]);
                        whiteX += whiteKeyWidth;
                    }
                }

                var count = 0;
                for(var a = 0; a < glyphs.length; a++){
                    if( noteNames[a].slice(-1) == '#' ){
                        keys[glyphs[a]] = parts.control.key_rect(noteNames[a], blackX, baseHeight-whiteKeyHeight, blackKeyWidth, blackKeyHeight, 0, keys.black.style.off, keys.black.style.press, keys.black.style.glow, keys.black.style.pressAndGlow);
                        keys[glyphs[a]].noteName = noteNames[a];
                        keys[glyphs[a]].onkeydown = function(){ _mainObject.io.out.send('noteName', {'name':this.noteName,'velocity':1} ); }
                        keys[glyphs[a]].onkeyup   = function(){ _mainObject.io.out.send('noteName', {'name':this.noteName,'velocity':0} ); }
                        _mainObject.append(keys[glyphs[a]]);
                        blackX += whiteKeyWidth;
                        count = 0;
                    }else{ count++; }
                    
                    if(count > 1){ blackX += whiteKeyWidth; }
                }

    return _mainObject;
}