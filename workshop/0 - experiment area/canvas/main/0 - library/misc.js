this.blendColours = function(rgba_1,rgba_2,ratio){
    //extract
        function extract(rgba){
            rgba = rgba.split(',');
            rgba[0] = rgba[0].replace('rgba(', '');
            rgba[3] = rgba[3].replace(')', '');
            return rgba.map(function(a){return parseFloat(a);})
        }
        rgba_1 = extract(rgba_1);
        rgba_2 = extract(rgba_2);

    //blend
        var rgba_out = [];
        for(var a = 0; a < rgba_1.length; a++){
            rgba_out[a] = (1-ratio)*rgba_1[a] + ratio*rgba_2[a];
        }

    //pack
        return 'rgba('+rgba_out[0]+','+rgba_out[1]+','+rgba_out[2]+','+rgba_out[3]+')';            
};
this.multiBlendColours = function(rgbaList,ratio){
    //special cases
        if(ratio == 0){return rgbaList[0];}
        if(ratio == 1){return rgbaList[rgbaList.length-1];}
    //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
        var p = ratio*(rgbaList.length-1);
        return workspace.library.misc.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
};
this.padString = function(string,length,padding=' '){
    if(padding.length<1){return string;}
    string = ''+string;

    while(string.length < length){
        string = padding + string;
    }

    return string;
};