var elements = {};

_canvas_.layers.registerFunctionForLayer("core", function(){

    elements.image_1 = _canvas_.core.element.create('Image','test_image_1');
    elements.image_1.unifiedAttribute({ 
        x:10, y:10, width:60, height:60, url:'/images/testImages/Dore-munchausen-illustration.jpg',
    });
    _canvas_.core.arrangement.append(elements.image_1);

    elements.image_2 = _canvas_.core.element.create('Image','test_image_2');
    elements.image_2.unifiedAttribute({ 
        x:70, y:10, width:60, height:60, url:'/images/testImages/Dore-munchausen-illustration.jpg',
    });
    _canvas_.core.arrangement.append(elements.image_2);

    elements.image_3 = _canvas_.core.element.create('Image','test_image_3');
    elements.image_3.unifiedAttribute({ 
        x:130, y:10, width:60, height:60, url:'/images/testImages/Dore-munchausen-illustration.jpg',
    });
    _canvas_.core.arrangement.append(elements.image_3);

    elements.image_4 = _canvas_.core.element.create('Image','test_image_4');
    elements.image_4.unifiedAttribute({ 
        x:190, y:10, width:60, height:60, url:'/images/testImages/Dore-munchausen-illustration.jpg',
    });
    _canvas_.core.arrangement.append(elements.image_4);

    const imageURLs = [
        '/images/testImages/Dore-munchausen-illustration.jpg',
        '/images/testImages/mikeandbrian.jpg'
    ];
    let index = 0;
    setInterval(() => {
        console.log( imageURLs[index] );
        elements.image_1.url(imageURLs[index]);
        elements.image_2.url(imageURLs[index]);
        elements.image_3.url(imageURLs[index]);
        elements.image_4.url(imageURLs[index]);
        index++;
        if(index >= imageURLs.length){index = 0;}
        _canvas_.core.render.frame();
        // setTimeout(_canvas_.core.render.frame,100);
    }, 1000);

    setTimeout(_canvas_.core.render.frame,500);
});