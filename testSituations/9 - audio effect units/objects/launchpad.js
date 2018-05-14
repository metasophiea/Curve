__globals.objects.make_launchpad = function(x,y){
    //set numbers
        var type = 'launchpad';
        var variables = {
            pageCount: 10,
            currentPage: 0,
            pages: [],
        };
        var attributes = {
            notes: ['5C', '4B', '4A', '4G', '4F', '4E', '4D', '4C'],
            stage: 0,
            prevStage: 0
        };
        var shape = {
            base: [{x:0,y:0},{x:150,y:0},{x:150,y:120},{x:0,y:120}],
            connector: { width: 30, height: 30 },
            littleConnector: { width: 20, height: 20 },
            grid: {x: 10, y: 10, width: 100, height: 100, xCount: 8, yCount: 8},
            manualPulse: {x: 115, y: 10, width: 30, height: 20},
            nextPage: {x: 115, y: 35, width: 15, height: 10},
            prevPage: {x: 115, y: 45, width: 15, height: 10},
            dial: {x: 110, y: 70},
            pageNumberReadout: {x: 131, y: 35, width: 14, height: 20}
        };
        var style = {        
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            grid: {
                backingStyle: 'fill:rgba(200,175,200,1)',
                checkStyle: 'fill:rgba(150,125,150,1)',
                backingGlowStyle: 'fill:rgba(225,175,225,1)',
                checkGlowStyle:'fill:rgba(200,125,200,1)'
            },
            button: {
                up: 'fill:rgba(175,175,175,1)',
                hover: 'fill:rgba(220,220,220,1)',
                down: 'fill:rgba(150,150,150,1)'
            },
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(250,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            }
        };
    
    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    var desiredKeys = {};
        desiredKeys.none = [' '];
    var keycaptureObj = __globals.keyboardInteraction.declareKeycaptureObject(_mainObject,desiredKeys);
        keycaptureObj.keyPress = function(key){
            switch(key){
                case ' ': manualPulse.onclick(); break;
                case 'ArrowUp': nextPage.onclick(); break;
                case 'ArrowDown': prevPage.onclick(); break;
            }
        };

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //grid
        var rastorgrid = parts.control.rastorgrid('rastorgrid', shape.grid.x, shape.grid.y, shape.grid.width, shape.grid.height, shape.grid.xCount, shape.grid.yCount, style.grid.backingStyle, style.grid.checkStyle, style.grid.backingGlowStyle, style.grid.checkGlowStyle);
            _mainObject.append(rastorgrid);

        //velocity dial
            _mainObject.append(parts.display.label(null, shape.dial.x+10,   shape.dial.y+40, 'velocity',  style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+7,    shape.dial.y+34, '0',         style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '1/2',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '1',         style.text));
            var dial_velocity = parts.control.dial_continuous(
                'dial_velocity', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_velocity);

        //manual pulse
            var manualPulse = parts.control.button_rect('manualPulse', shape.manualPulse.x, shape.manualPulse.y, shape.manualPulse.width, shape.manualPulse.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(manualPulse);
            manualPulse.onclick = function(){ progress(); }

        //page turners
            var nextPage = parts.control.button_rect('nextPage', shape.nextPage.x, shape.nextPage.y, shape.nextPage.width, shape.nextPage.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(nextPage);
                nextPage.onclick = function(){ setPage(variables.currentPage+1); }
            var prevPage = parts.control.button_rect('prevPage', shape.prevPage.x, shape.prevPage.y, shape.prevPage.width, shape.prevPage.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(prevPage);
                prevPage.onclick = function(){ setPage(variables.currentPage-1); }
            var pageNumberReadout = parts.display.sevenSegmentDisplay(null, shape.pageNumberReadout.x, shape.pageNumberReadout.y, shape.pageNumberReadout.width, shape.pageNumberReadout.height);
                _mainObject.append(pageNumberReadout);

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2].y-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
            _mainObject.prepend(_mainObject.io.out);
        _mainObject.io.pulseIn = parts.dynamic.connectionNode_data('_mainObject.io.pulseIn', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*0.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.pulseIn);
            _mainObject.io.pulseIn.receive = function(address,data){if(address!='pulse'){return;} progress(); };
        _mainObject.io.pageSelect = parts.dynamic.connectionNode_data('_mainObject.io.pageSelect', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*1.75, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.pageSelect);
            _mainObject.io.pageSelect.receive = function(address,data){if(address!='discrete'){return;}setPage(data);};
    
    //internal workings
        function setPage(pageNumber){
            pageNumber = pageNumber<0 ? variables.pageCount-1 : pageNumber;
            pageNumber = pageNumber>variables.pageCount-1 ? 0 : pageNumber;

            //save the current page to memory only if we're not switching to the same page
            if(pageNumber != variables.currentPage){ variables.pages[variables.currentPage] = rastorgrid.get(); }

            if( variables.pages[pageNumber] ){ rastorgrid.set(variables.pages[pageNumber]); }
            else{ rastorgrid.clear();  }

            pageNumberReadout.enterCharacter(''+pageNumber);

            variables.currentPage = pageNumber;
        }
        function progress(){
            for(var a = 0; a < shape.grid.yCount; a++){
                rastorgrid.light(attributes.prevStage,a,false);
                _mainObject.io.out.send('midiNumber',{'num':__globals.audio.names_midinumbers[attributes.notes[a]], 'velocity':0});
            }

            for(var a = 0; a < shape.grid.yCount; a++){
                rastorgrid.light(attributes.stage,a,true);
                if( rastorgrid.box(attributes.stage,a).get() ){ _mainObject.io.out.send('midiNumber',{'num':__globals.audio.names_midinumbers[attributes.notes[a]], 'velocity':dial_velocity.get()}); }
            }

            attributes.prevStage = attributes.stage; 
            attributes.stage++;
            if(attributes.stage>=attributes.notes.length){attributes.stage=0;}
        }

    //import/export
        _mainObject.importData = function(data){
            variables.pages = data.pages;
            variables.currentPage = data.currentPage;
            dial_velocity.set(data.velocityDial);
            setPage(variables.currentPage);
        };
        _mainObject.exportData = function(){
            //push current page
            variables.pages[variables.currentPage] = rastorgrid.get();

            return {
                pages: variables.pages,
                currentPage: variables.currentPage,
                velocityDial: dial_velocity.get()
            };
        };

    //setup
        dial_velocity.set(0.5)
        setPage(0);

    return _mainObject;
};