function makeKeyboard(x,y){
    var baseWidth = 150;
    var baseHeight = 62.5;
    var connectorWidth = 30;
    var connectorHeight = 30;
    var keySize = 12.5;


    //elements
        //main
            var _mainObject = parts.basic.g('keyboard', x, y);

            var backing = parts.basic.rect(null, 0, 0, baseWidth, baseHeight, 0, 'fill:rgba(200,200,200,1)');
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeKeyboard);

            var desiredKeys = {};
                desiredKeys.none = ['1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
            var keyboardObj = __globals.keyboardInteraction.declareKeycaptureObject(_mainObject,desiredKeys);
                keyboardObj.keyPress = function(key){
                    if(keys[key]){ keys[key].press(); }
                };
                keyboardObj.keyRelease = function(key){
                    if(keys[key]){ keys[key].release(); }
                };

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
            keys.style = {};
                keys.style.text = 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New; pointer-events: none;';
                keys.style.style_off = 'fill:rgba(175,175,175,1)';
                keys.style.style_press = 'fill:rgba(150,150,150,1)';
                keys.style.style_glow = 'fill:rgba(220,200,220,1)';
                keys.style.style_pressAndGlow = 'fill:rgba(200,150,200,1)';

            var x = 5;
            var y = 5;
            var glyphs = [
                {'offset':0, 'chars':['1','2','3','4','5','6','7','8','9','0']},
                {'offset':keySize/2, 'chars':['q','w','e','r','t','y','u','i','o','p']},
                {'offset':keySize/2 + keySize/3, 'chars':['a','s','d','f','g','h','j','k','l']},
                {'offset':keySize + keySize/3, 'chars':['z','x','c','v','b','n','m']}
            ];
            
            for(var a = 0; a < glyphs.length; a++){
                var sub_x = x + glyphs[a].offset;
                var sub_y = y + (keySize + 1)*a;

                glyphs[a].chars.forEach(function(letter){
                    keys[letter] = parts.control.key_rect(letter, sub_x, sub_y, keySize, keySize, 0, keys.style.style_off, keys.style.style_press, keys.style.style_glow, keys.style.style_pressAndGlow);
                    keys[letter].onkeydown = function(){ _mainObject.io.out.send('key',{'key': letter, 'velocity': true}); }
                    keys[letter].onkeyup = function(){ _mainObject.io.out.send('key',{'key': letter, 'velocity': false}); }
                    _mainObject.append(keys[letter]);
                    _mainObject.append(parts.display.label(null, sub_x+keySize/4, sub_y+keySize/2, letter, keys.style.text));
                    sub_x += keySize + 1;
                });

            }



            
        _mainObject.onSelect = function(){
            console.log('I\'ve been selected!');
            __globals.utility.setStyle(backing, 'fill:rgba(220,220,220,1)');
        };
        _mainObject.onDeselect = function(){
            console.log('I\'ve been deselected!');
            __globals.utility.setStyle(backing, 'fill:rgba(200,200,200,1)');
        };
        _mainObject.onDelete = function(){
            console.log('I\'ve been deleted!');
        };
        _mainObject.onCopy = function(original=false){
            console.log('I\'ve been copied!', original?'- original object ':'- new object');
        };
    
        _mainObject.importData = function(data){
            console.log('importing data', data);
        };
        _mainObject.exportData = function(){
            console.log('exporting data');
            return {'like settings and stuff':'settin\'s' };
        };




        _mainObject.io = {};
        _mainObject.io.out = parts.dynamic.connectionNode_data('io.out',baseWidth-connectorWidth/2,baseHeight/2-connectorHeight/2,connectorWidth,connectorHeight);
            _mainObject.prepend(_mainObject.io.out);
        _mainObject.io.in = parts.dynamic.connectionNode_data('io.in',-connectorWidth/2,baseHeight/2-connectorHeight/2,connectorWidth,connectorHeight);
            _mainObject.prepend(_mainObject.io.in);
            _mainObject.io.in.receive = function(address, data){ if(data){ keys[address].glow(); }else{ keys[address].dim(); } };


    return _mainObject;
}