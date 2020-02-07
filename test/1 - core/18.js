_canvas_.core.go.add( function(){

    const group = _canvas_.core.element.create('group','group');
    group.unifiedAttribute({ heedCamera:true });
    _canvas_.core.arrangement.append(group);

    const size = 25;
    const yCount = 20;
    const xCount = 20;
    const images = [
        '/images/testImages/Dore-munchausen-illustration.jpg',
        '/images/testImages/expanded-metal-1.jpg',
        '/images/testImages/mikeandbrian_10px.png',
        '/images/testImages/mikeandbrian_25%.jpg',
        '/images/testImages/mikeandbrian_25px.png',
        '/images/testImages/mikeandbrian_50%.jpg',
        '/images/testImages/mikeandbrian_6.25%.jpg',
        '/images/testImages/mikeandbrian_6.25%.png',
        '/images/testImages/mikeandbrian.jpg',
        '/images/testImages/mikeandbrian.png',
        '/images/testImages/opacityTestImage.png',
    ];

    // for(let y = 0; y < yCount; y++){
    //     for(let x = 0; x < xCount; x++){
    //         const tmp = _canvas_.core.element.create('image','test_image_'+y+'_'+x);
    //         tmp.unifiedAttribute({ 
    //             x:10 + (size+1)*x, y:10 + (size+1)*y, width:size, height:size, url:images[(y*x)%images.length],
    //         });
    //         group.append(tmp);
    //     }
    // }

    let y = 0;
    let x = 0;
    const intervaelID = setInterval(() => {
        const tmp = _canvas_.core.element.create('image','test_image_'+y+'_'+x);
        tmp.unifiedAttribute({ 
            x:10 + (size+1)*x, y:10 + (size+1)*y, width:size, height:size, url:images[(y*x)%images.length],
        });
        group.append(tmp);

        x++;
        if(x >= xCount){
            x = 0;
            y++;
        }
        if(y >= yCount){
            clearInterval(intervaelID)
        }
    },1);



    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(20);
    _canvas_.core.render.active(true);
    // _canvas_.core.stats.active(true);
    // _canvas_.core.stats.autoPrint(true)
});