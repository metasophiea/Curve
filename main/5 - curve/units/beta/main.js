{{include:*}}

this._categoryData = {
    tools:{ printingName:'Tools' },
    misc:{ printingName:'Miscellaneous' },
};

var style = {
    background:{r:70/255,g:70/255,b:70/255,a:1},
    bumper:{r:0.125,g:0.125,b:0.125,a:1},
    textColour:{r:0.7,g:0.7,b:0.7,a:1},

    marking:{
        default:{r:235/255,g:98/255,b:61/255,a:1},
        signal:{r:235/255,g:98/255,b:61/255,a:1},
        voltage:{r:170/255,g:251/255,b:89/255,a:1},
        data:{r:114/255,g:176/255,b:248/255,a:1},
        audio:{r:243/255,g:173/255,b:61/255,a:1},
    },
    connectionNode:{
        signal:{
            dim:{r:235/255,g:98/255,b:61/255,a:1},
            glow:{r:237/255,g:154/255,b:132/255,a:1},
        },
        voltage:{
            dim:{r:170/255,g:251/255,b:89/255,a:1},
            glow:{r:210/255,g:255/255,b:165/255,a:1},
        },
        data:{
            dim:{r:114/255,g:176/255,b:248/255,a:1},
            glow:{r:168/255,g:208/255,b:255/255,a:1},
        },
        audio:{
            dim:{r:243/255,g:173/255,b:61/255,a:1},
            glow:{r:247/255,g:203/255,b:133/255,a:1},
        },
    },
    connectionCable:{
        signal:{
            dim:{r:235/255,g:98/255,b:61/255,a:1},
            glow:{r:237/255,g:154/255,b:132/255,a:1},
        },
        voltage:{
            dim:{r:170/255,g:251/255,b:89/255,a:1},
            glow:{r:210/255,g:255/255,b:165/255,a:1},
        },
        data:{
            dim:{r:114/255,g:176/255,b:248/255,a:1},
            glow:{r:168/255,g:208/255,b:255/255,a:1},
        },
        audio:{
            dim:{r:243/255,g:173/255,b:61/255,a:1},
            glow:{r:247/255,g:203/255,b:133/255,a:1},
        },
    },
};
var bumperCoverage = 5;