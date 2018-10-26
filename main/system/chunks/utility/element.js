this.element = new function(){
    this.getTransform = function(element){
        // //pure js
        //     var end_1 = element.style.transform.indexOf('px');
        //     var end_2 = element.style.transform.indexOf('px) scale(');
        //     var end_3 = element.style.transform.indexOf(') rotate(');
        //     var end_4 = element.style.transform.indexOf('rad)');

        //     return {
        //         x: Number( element.style.transform.substring(10,end_1)),
        //         y: Number( element.style.transform.substring(end_1+4,end_2)),
        //         s: Number( element.style.transform.substring(end_2+10,end_3)),
        //         r: Number( element.style.transform.substring(end_3+9,end_4))
        //     };

        //pure js 2 
            var text = element.style.transform;
            text = text.slice(10).split('px, ',2);
            var num1 = Number(text[0]);
            text = text[1].split('px) scale(',2);
            var num2 = Number(text[0]);
            text = text[1].split(') rotate(',2);
            var num3 = Number(text[0]);
            var num4 = Number(text[1].slice(0,-4));

            return { x: num1, y: num2, s: num3, r: num4 };

        // //regex
        //     var pattern = /translate\((.*)px,| (.*)px|\) scale\((.*)\) |rotate\((.*)rad\)/g;

        //     var result = [];
        //     for(var a = 0; a < 4; a++){
        //         result.push(Number(pattern.exec(element.style.transform)[a+1]));
        //     }
            
        //     return {x:result[0],y:result[1],s:result[2],r:result[3]};
    };
    this.getCumulativeTransform = function(element){
        data = this.getTransform(element);
        while( !element.parentElement.getAttribute('pane') ){
            element = element.parentElement;
            var newData = this.getTransform(element);
            data.x += newData.x;
            data.y += newData.y;
            data.s *= newData.s;
            data.r += newData.r;
        }
        return data;
    };
    this.getTruePoint = function(element){
        data = this.getTransform(element);
        while( !element.parentElement.getAttribute('pane') ){
            element = element.parentElement;
            var newData = this.getTransform(element);
            var temp = system.utility.math.cartesian2polar(data.x,data.y);
            temp.ang += newData.r;
            temp = system.utility.math.polar2cartesian(temp.ang,temp.dis);
            data.x = temp.x + newData.x;
            data.y = temp.y + newData.y;
            data.s *= newData.s;
            data.r += newData.r;
        }
        return data;
    };
    this.setTransform = function(element, transform){
        //(code removed for speed, but I remember it was solving some formatting problem somewhere)
        // element.style.transform = 'translate('+transform.x.toFixed(16)+'px, '+(transform.y.toFixed(16))+'px) scale('+transform.s.toFixed(16)+') rotate(' +transform.r.toFixed(16)+ 'rad)';
        element.style.transform = 'translate('+transform.x+'px, '+transform.y+'px) scale('+transform.s+') rotate(' +transform.r+ 'rad)';
    };
    this.setTransform_XYonly = function(element, x, y){
        if(x == null && y == null){return;}

        var transformData = this.getTransform(element);
        if(x!=null){transformData.x = x;}
        if(y!=null){transformData.y = y;}
        this.setTransform( element, transformData );
    };
    this.setStyle = function(element, style){
        var transform = this.getTransform(element); 
        element.style = style;
        this.setTransform(element, transform);
    };
    this.setRotation = function(element, rotation){
        var pattern = /rotate\(([-+]?[0-9]*\.?[0-9]+)/;
        element.style.transform = element.style.transform.replace( pattern, 'rotate('+rotation );
    };
    this.getBoundingBox = function(element){
        var tempG = document.createElementNS('http://www.w3.org/2000/svg','g');
        system.pane.workspace.append(tempG);

        element = element.cloneNode(true);
        tempG.append(element);
        var temp = element.getBBox();
        tempG.remove();
        
        return temp;
    };
    this.makeUnselectable = function(element){
        element.style['-webkit-user-select'] = 'none';
        element.style['-moz-user-select'] = 'none';
        element.style['-ms-user-select'] = 'none';
        element.style['user-select'] = 'none';
    };
    this.getPositionWithinFromMouse = function(event, element, elementWidth, elementHeight){
        var elementOrigin = system.utility.element.getTruePoint(element);
        var mouseClick = system.utility.workspace.pointConverter.browser2workspace(event.offsetX,event.offsetY);

        var temp = system.utility.math.cartesian2polar(
            mouseClick.x-elementOrigin.x,
            mouseClick.y-elementOrigin.y
        );
        temp.ang -= elementOrigin.r;
        temp = system.utility.math.polar2cartesian(temp.ang,temp.dis);

        var ans = { x:temp.x/elementWidth, y:temp.y/elementHeight };
        if(ans.x < 0){ans.x = 0;}else if(ans.x > 1){ans.x = 1;}
        if(ans.y < 0){ans.y = 0;}else if(ans.y > 1){ans.y = 1;}
        return ans;
    };
    this.styleExtractor = function(string){
        var outputObject= {};

        //split style string into individual settings (and filter out any empty strings)
            var array = string.split(';').filter(function(n){ return n.length != 0 });

        //create the object
        try{
            for(var a = 0; a < array.length; a++){
                //split on colon
                    var temp = array[a].split(':');
                //strip whitespace
                    temp[0] = temp[0].replace(/^\s+|\s+$/g, '');
                    temp[1] = temp[1].replace(/^\s+|\s+$/g, '');
                //push into object
                    outputObject[temp[0]] = temp[1];
            }
        }catch(e){console.error('styleExtractor was unable to parse the string "'+string+'"');return {};}
        
        return outputObject;
    };
    this.stylePacker = function(object){
        var styleString = '';
        var keys = Object.keys(object);
        for(var a = 0; a < keys.length; a++){
            styleString += keys[a] +':'+ object[keys[a]] +';';
        }
        return styleString;
    };
};