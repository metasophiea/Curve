_canvas_.layers.registerFunctionForLayer("interface", function(){
    let player_1 = new _canvas_.interface.circuit.player(_canvas_.library.audio.context);
    player_1.load('url',function(){},'https://metasophiea.com/apps/partyCalculator/tracks/1-bassSynth_08.wav');
    player_1.out_left().connect(_canvas_.library.audio.destination);
    player_1.out_right().connect(_canvas_.library.audio.destination);

    let player_2 = new _canvas_.interface.circuit.player(_canvas_.library.audio.context);
    player_2.load('url',function(){},'https://metasophiea.com/apps/partyCalculator/tracks/0-drums_05.wav');
    player_2.out_left().connect(_canvas_.library.audio.destination);
    player_2.out_right().connect(_canvas_.library.audio.destination);
    
    console.log('');


    setTimeout(function(){
        console.log('-> start player_1');
        player_1.start();
    },1000);
    setTimeout(function(){
        console.log('-> stop player_1');
        player_1.stop();
    },2000);
    setTimeout(function(){
        console.log('-> player_1 info');
        console.log( 'title:',player_1.title() );
        console.log( 'duration:',player_1.duration() );
        console.log( 'isLoaded:',player_1.isLoaded() );
        console.log('-> player_2 info');
        console.log( 'title:',player_2.title() );
        console.log( 'duration:',player_2.duration() );
        console.log( 'isLoaded:',player_2.isLoaded() );
    },2500);
    setTimeout(function(){
        console.log('-> start player_1 and player_2');
        player_1.start();
        player_2.start();
    },3000);
    setTimeout(function(){
        console.log('-> get current time and progress of player_1 and player_2');
        console.log( 'current time: '+player_1.currentTime() );
        console.log( 'progress: '+player_1.progress() );
        console.log( 'current time: '+player_2.currentTime() );
        console.log( 'progress: '+player_2.progress() );
    },3500);
    setTimeout(function(){
        console.log('-> adjust rate of player_1 and player_2 to 125%');
        player_1.rate(1.25);
        player_2.rate(1.25);
    },4000);
    setTimeout(function(){
        console.log('-> jump back to start of player_1 and player_2');
        player_1.jumpTo(0);
        player_2.jumpTo(0);
    },4500);
    setTimeout(function(){
        console.log('-> set area of player_1 and player_2 to last half');
        player_1.area(0.5,1);
        player_2.area(0.5,1);
    },5000);
    setTimeout(function(){
        console.log('-> pause player_1 and player_2');
        player_1.pause();
        player_2.pause();
    },5500);
    setTimeout(function(){
        console.log('-> resume player_1 and player_2');
        player_1.resume();
        player_2.resume();
    },6000);
    setTimeout(function(){
        console.log('-> stop player_1 and player_2');
        player_1.stop();
        player_2.stop();
    },8000);
    setTimeout(function(){
        console.log('-> get waveform segment from player_1');
        console.log( player_1.waveformSegment({start:0,end:0.1}) );
    },8500);
    setTimeout(function(){
        console.log('-> start player_1');
        player_1.start();
    },9000);
    setTimeout(function(){
        console.log('-> start player_1 again');
        player_1.start();
    },9500);
});