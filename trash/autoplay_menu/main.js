system.audio.context.resume().then(function(){
    system.pane.control.innerHTML = '';
    clearTimeout(timeout);
},function(){
    console.warn('I\'m not sure what to do now..I guess we just sit here in silence');
});


var timeout = setTimeout(function(){
    var viewportDimensions = system.utility.workspace.getViewportDimensions();

    //blocking screen
        system.pane.control.append(part.basic.rect(null, 0, 0, viewportDimensions.width, viewportDimensions.height, 0, 'fill:rgba(255,255,255,0.9)'));
    //explanation text
        var text = part.builder('text','explanation',{
            x:10, y:30, 
            text:'because of the \'no autoplay\' feature in browsers; this site needs you to allow it to produce sound',
            style:'fill:rgba(0,0,0,1); font-size:15px; font-family:Courier New; pointer-events:none;'
        });
        system.pane.control.append(text);
        var textDimensions = text.getBBox();
        system.utility.element.setTransform(text, {
            x:(viewportDimensions.width-textDimensions.width)/2,
            y:((viewportDimensions.height-textDimensions.height)/2)-30,
            s:1, r:0
        });
    //activation button
        system.pane.control.append(part.builder('button_rect','audioOn',{
            x:(viewportDimensions.width-100)/2, y:(viewportDimensions.height-50)/2,
            width:100, height:50,
            onclick:function(){
                system.audio.context.resume();
                system.pane.control.innerHTML = '';
            }
        }));
    //button text
        system.pane.control.append(part.builder('text','explanation',{
            x:(viewportDimensions.width/2)-22.5, y:(viewportDimensions.height/2)+5, 
            text:'allow',
            style:'fill:rgba(0,0,0,1); font-size:15px; font-family:Courier New; pointer-events:none;'
        }));
},1);