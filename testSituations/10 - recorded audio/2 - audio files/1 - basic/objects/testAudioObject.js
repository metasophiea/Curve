objects.testAudioObject = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
    };
    var design = {
        type: 'testAudioObject',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:50,y:0},{x:50,y:52.5},{x:0,y:52.5}], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'outRight', data: {
                type: 1, x: -10, y: 5, width: 20, height: 20
            }},
            {type:'connectionNode_audio', name:'outLeft', data: {
                type: 1, x: -10, y: 27.5, width: 20, height: 20
            }},

            // {type:'button_rect', name:'panicButton', data: {
            //     x:15, y: 10, width:20, height:20,
            //     style:{
            //         up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
            //         down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
            //     },
            //     onclick: function(){
            //         var i = document.createElement('input');
            //         i.type = 'file'; i.id = '_global_metasophiea.com/code/js/liveEdit/loadsave.js';
            //         i.onchange = function(){
            //             var f = new FileReader();
            //             f.readAsBinaryString(this.files[0]);
            //             f.onload = function(){
            //                 // console.log(f.result);
            //                 __globals.audio.context.decodeAudioData(f.result, function(data){
            //                     obj.__audioFilePlayer._loadBuffer(data,1);
            //                 }, function(e){"Error with decoding audio data" + e.err});
            //             }
            //         };            
            //         document.body.appendChild(i);
            //         i.click();
            //     }
            // }},   


        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testAudioObject,design);

    //circuitry
        obj.__audioFilePlayer = new parts.audio.audioFilePlayer(__globals.audio.context);
        obj.__audioFilePlayer.out_right().connect( design.connectionNode_audio.outRight.in() );
        obj.__audioFilePlayer.out_left().connect( design.connectionNode_audio.outLeft.in() );

    //setup
        setTimeout(function(){obj.__audioFilePlayer.play();},2000);

    return obj;
};