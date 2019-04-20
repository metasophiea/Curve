var library = {misc:{},thirdparty:{}};


library.misc.openFile = function(callback,readAsType='readAsBinaryString'){
    var i = document.createElement('input');
    i.type = 'file';
    i.onchange = function(){
        var f = new FileReader();
        switch(readAsType){
            case 'readAsArrayBuffer':           f.readAsArrayBuffer(this.files[0]);  break;
            case 'readAsBinaryString': default: f.readAsBinaryString(this.files[0]); break;
        }
        f.onloadend = function(){ 
            if(callback){callback(f.result);}
        }
    };
    i.click();
};