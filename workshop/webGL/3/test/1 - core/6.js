var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    tmp.x(10);
    tmp.y(10);
    tmp.width(50);
    tmp.height(50);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'top' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_2';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('abcdefghijklmnopqrstuvwxyz');
    tmp.x(10);
    tmp.y(70);
    tmp.width(50);
    tmp.height(50);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'top' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_3';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('0123456789');
    tmp.x(10);
    tmp.y(150);
    tmp.width(50);
    tmp.height(50);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'top' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_4';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('.,:;?!/\\()[]#-_\'"|><+=&*~%{}');
    tmp.x(10);
    tmp.y(220);
    tmp.width(50);
    tmp.height(50);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'top' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_5';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string('How are you today?');
    tmp.x(10);
    tmp.y(290);
    tmp.width(50);
    tmp.height(50);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'top' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
    





_canvas_.core.render.frame();