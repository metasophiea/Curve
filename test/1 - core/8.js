var fontName = new URL(window.location.href).searchParams.get("fontName");
if(fontName == undefined){fontName = 'Roboto-Regular';}
var customText = new URL(window.location.href).searchParams.get("text");
if(customText == undefined){customText = 'How are you today?';}







var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(10);
    tmp.y(125);
    tmp.width(100);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('character');
    tmp.name = 'character_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(10);
    tmp.y(125);
    tmp.width(300);
    tmp.height(300);
    tmp.printingMode({horizontal:'left',vertical:'top'});
    tmp.font(fontName);
    tmp.character('A');
    tmp.anchor({x:0,y:0});
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_2';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(200);
    tmp.y(125);
    tmp.width(100);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('character');
    tmp.name = 'character_2';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(200);
    tmp.y(125);
    tmp.width(300);
    tmp.height(300);
    tmp.printingMode({horizontal:'middle',vertical:'middle'});
    tmp.font(fontName);
    tmp.character('A');
    tmp.anchor({x:0,y:0});
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);



var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_3';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(350);
    tmp.y(320);
    tmp.width(200);
    tmp.height(200);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('character');
    tmp.name = 'character_3';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(350);
    tmp.y(320);
    tmp.width(200);
    tmp.height(200);
    tmp.printingMode({horizontal:'left',vertical:'top'});
    tmp.font(fontName);
    tmp.character('o');
    tmp.anchor({x:0,y:0});
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_4';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(600);
    tmp.y(370);
    tmp.width(300);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('hcave');
    tmp.x(600);
    tmp.y(370);
    tmp.width(200)
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'filling', horizontal:'left', vertical:'middle' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_2';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('cave');
    tmp.x(800);
    tmp.y(370);
    tmp.width(200)
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'filling', horizontal:'left', vertical:'middle' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);














var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_5';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(10); 
    tmp.y(400);
    tmp.width(300);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_3';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    tmp.x(10);
    tmp.y(500);
    tmp.width(300);
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'filling', horizontal:'left', vertical:'bottom' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_4';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('abcdefghijklmnopqrstuvwxyz');
    tmp.x(10);
    tmp.y(600);
    tmp.width(100);
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'bottom' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_5';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('0123456789');
    tmp.x(10);
    tmp.y(700);
    tmp.width(100);
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'bottom' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_6';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('.,:;?!/\\()[]{}#-_\'"|><+=&*~%');
    tmp.x(10);
    tmp.y(800);
    tmp.width(100);
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'bottom' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_7';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('Look');
    tmp.x(10);
    tmp.y(900);
    tmp.width(100);
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'bottom' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);














    
var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_6';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(350);
    tmp.y(100);
    tmp.width(100);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_8';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string(customText);
    tmp.x(350);
    tmp.y(100);
    tmp.width(100);
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'bottom' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);

var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_7';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(350);
    tmp.y(200);
    tmp.width(200);
    tmp.height(100);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_9';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('How are you today?');
    tmp.x(350);
    tmp.y(200);
    tmp.width(100);
    tmp.height(100);
    tmp.font(fontName);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'middle' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);





_canvas_.core.render.frame();
setTimeout(function(){ _canvas_.core.render.frame(); },1500);
