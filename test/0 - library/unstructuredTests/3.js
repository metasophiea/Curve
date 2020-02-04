_canvas_.library.go.add( function(){

    _canvas_.library.misc.loadImageFromURL(
        'https://curve.metasophiea.com/images/testImages/mikeandbrian.png',
        bitmap => {
            console.log(bitmap);
        },
        console.log,
        false,
        1
    );

});