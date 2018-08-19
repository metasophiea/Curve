{{include:*}}

var dial_con = __globals.utility.workspace.placeAndReturnObject( parts.elements.control.dial_continuous(undefined,50,50,8) );
var dial_dis = __globals.utility.workspace.placeAndReturnObject( parts.elements.control.dial_discrete(undefined,100,50,8) );

__globals.utility.workspace.gotoPosition(-269.983, -246.402, 10, 0);



var state = true;
setInterval(function(){
    dial_con.glow(state);
    dial_dis.glow(state);
    state = !state;
},1000);