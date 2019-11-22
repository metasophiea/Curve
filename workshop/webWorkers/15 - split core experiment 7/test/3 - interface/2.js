_canvas_.interface.go = function(){
    _canvas_.core.render.active(true);

    //basic
        _canvas_.interface.part.builder( 'basic', 'group', 'basicGroup_1', { x:10, y:10 } ).then(basicGroup => {
            _canvas_.system.pane.mm.append(basicGroup);

            _canvas_.interface.part.builder('basic', 'rectangle', 'testRectangle', { 
                x:5, y:5, width:30, height:30, colour:{r:1,g:0,b:0,a:1}
            }).then(rectangle => { basicGroup.append(rectangle); });
            _canvas_.interface.part.builder('basic', 'circle', 'testCircle', { 
                x:20, y:55, radius:15
            }).then(circle => { basicGroup.append(circle); });
            _canvas_.interface.part.builder('basic', 'image', 'testImage', { 
                x:40, y:40, width:30, height:30, url:'/images/testImages/Dore-munchausen-illustration.jpg'
            }).then(image => { basicGroup.append(image); });

            _canvas_.interface.part.builder( 'basic', 'group', 'clippingGroup', { x:75, y:5 } ).then(clippingGroup => {
                basicGroup.append(clippingGroup);
                clippingGroup.clipActive(true);

                _canvas_.interface.part.builder('basic', 'polygon', 'testPolygon', { 
                    points:[0,0, 50,0, 50,50], 
                }).then(polygon => { clippingGroup.stencil(polygon); });
                _canvas_.interface.part.builder('basic', 'image', 'clippedImage', { 
                    width:50, height:50, url:'/images/testImages/mikeandbrian.jpg'
                }).then(image => { clippingGroup.append(image); });
            });

            _canvas_.interface.part.builder('basic', 'polygon', 'testPolygon', { 
                points:[55,5, 70,35, 40,35], colour:{r:0,g:1,b:0,a:1},
            }).then(polygon => { basicGroup.append(polygon); });
            _canvas_.interface.part.builder('basic', 'polygonWithOutline', 'testPolygonWithOutline', { 
                points:[75,15, 75,55, 115,55], thickness:1, colour:{r:1,g:0,b:0.5,a:1}, lineColour:{r:0,g:0,b:0,a:1},
            }).then(polygonWithOutline => { basicGroup.append(polygonWithOutline); });
            _canvas_.interface.part.builder('basic', 'text', 'testText', { 
                x:5, y:75, text:'Hello', height:15, width:70, colour:{r:150/255,g:150/255,b:1,a:1},
            }).then(text => { basicGroup.append(text); });
            _canvas_.interface.part.builder('basic', 'path', 'testPath', { 
                points:[0,0, 0,90, 2.5,90, 2.5,72.5, 75,72.5], thickness:1.25, jointType:'round', capType:'round',
            }).then(path => { basicGroup.append(path); });
            _canvas_.interface.part.builder('basic', 'circleWithOutline', 'testCircleWithOutline', { 
                x:90, y:70, radius:10,
            }).then(circleWithOutline => { basicGroup.append(circleWithOutline); });
            _canvas_.interface.part.builder('basic', 'rectangleWithOutline', 'testRectangleWithOutline', { 
                x:105, y:60, width:30, height:30,
            }).then(rectangleWithOutline => { basicGroup.append(rectangleWithOutline); });
        });



};