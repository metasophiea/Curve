// (function(){
    var __svgElements = document.getElementsByTagName('svg');
    for(var __svgElements_count = 0; __svgElements_count < __svgElements.length; __svgElements_count++){
        if( __svgElements[__svgElements_count].hasAttribute('workspace') ){
            var __globals = {};
            __globals.svgElement = __svgElements[__svgElements_count];

__globals.utility = new function(){

    this.getTransform = function(element){
        var pattern = /[-+]?[0-9]*\.?[0-9]+/g;
        var result = element.style.transform.match( pattern ).map(Number);

        if(result.length < 4){ result[3] = 0; }

        return result;
    }
    this.getCumulativeTransform = function(element){
        data = __globals.utility.getTransform(element);
        while( !element.parentElement.getAttribute('pane') ){
            element = element.parentElement;
            var newData = __globals.utility.getTransform(element);
            data[0] += newData[0];
            data[1] += newData[1];
        }
        return data;
    }
    this.setTransform = function(element, transformData){
        element.style.transform = 'translate('+transformData[0]+'px, '+transformData[1]+'px) scale('+transformData[2]+') rotate(' +transformData[3]+ 'rad)';
    }    
    this.updateTransform_XY = function(element, x, y){
        var transformData = __globals.utility.getTransform(element);
        transformData[0] = x;
        transformData[1] = y;
        __globals.utility.setTransform( element, transformData );
    }
    this.setRotation = function(element, rotation){
        var pattern = /rotate\(([-+]?[0-9]*\.?[0-9]+)/;
        element.style.transform = element.style.transform.replace( pattern, 'rotate('+rotation );
    }
    this.setStyle = function(element, style){
        var transform = this.getTransform(element); 
        element.style = style;
        this.setTransform(element, transform);
    }
    this.disconnectEverything = function(object){
        var keys = Object.keys(object.io);
        for(var a = 0; a < keys.length; a++){
            object.io[keys[a]].disconnect();
        }
    };
    this.getPosition = function(){
        return __globals.utility.getTransform(__globals.panes.global);
    };
    this.gotoPosition = function(x, y, z, r=0){
        __globals.utility.setTransform(__globals.panes.global, [x,y,z,r]);
    };

    this.getObjectUnderPoint = function(x,y){
        var temp = document.elementFromPoint(x,y);
        if(temp.hasAttribute('workspace')){return null;}

        while(!temp.parentElement.hasAttribute('pane')){ 
            temp = temp.parentElement;
        }

        return temp;
    };
    this.requestInteraction = function(x,y,type){
        if(!x || !y){return true;}
        var temp = document.elementFromPoint(x,y);

        if(temp.hasAttribute('workspace')){return true;}
        while(!temp.hasAttribute('pane')){ 
            if(temp[type] || temp.hasAttribute(type)){return false;}
            temp = temp.parentElement;
        }
        
        return true;
    };

    this.getPane = function(element){
        while( !element.getAttribute('pane') ){ element = element.parentElement; }
        return element;
    }

    this.getCartesian = function(ang,dis){
        return {'x':(dis*Math.cos(ang)), 'y':(dis*Math.sin(ang))};
    }
    this.getPolar = function(x,y){
		var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;

		if(x === 0 ){
			if(y === 0){ang = 0;}
			else if(y > 0){ang = 0.5*Math.PI;}
			else{ang = 1.5*Math.PI;}
		}
		else if(y === 0 ){
			if(x >= 0){ang = 0;}else{ang = Math.PI;}
		}
		else if(x >= 0){ ang = Math.atan(y/x); }
		else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }

		return {'dis':dis,'ang':ang};
    }

    this.getBoundingBox = function(SVG){
        var tempG = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.global.append(tempG);

        SVG = SVG.cloneNode(true);
        tempG.append(SVG);
        var temp = SVG.getBBox();
        tempG.remove();
        
        return temp;
    }

    this.pointconverter_browserWorkspace = function(x,y){
        var globalTransform = __globals.utility.getTransform(__globals.panes.global);
        return {'x':(x-globalTransform[0])/globalTransform[2], 'y':(y-globalTransform[1])/globalTransform[2]};
    };
    this.pointconverter_workspaceBrowser = function(x,y){
        var globalTransform = __globals.utility.getTransform(__globals.panes.global);
        return {'x':(x*globalTransform[2])+globalTransform[0], 'y':(y*globalTransform[2])+globalTransform[1]};
    };
    this.dotMaker = function(x,y,text,r=2,style='fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;'){
        var dot = parts.basic.circle(null, x, y, r, 0, style);
        var textElement = parts.basic.text(null, x+r, y, text, 0, style);
        __globals.panes.foreground.appendChild(dot);
        __globals.panes.foreground.appendChild(textElement);
    };

    this.getIntersectionOfTwoLineSegments = function(
        segment1_point1_x, segment1_point1_y,
        segment1_point2_x, segment1_point2_y,
        segment2_point1_x, segment2_point1_y,
        segment2_point2_x, segment2_point2_y
    ){
        var denominator = (segment2_point2_y-segment2_point1_y)*(segment1_point2_x-segment1_point1_x) - (segment2_point2_x-segment2_point1_x)*(segment1_point2_y-segment1_point1_y);
        if(denominator == 0){return null;}

        var u1 = ((segment2_point2_x-segment2_point1_x)*(segment1_point1_y-segment2_point1_y) - (segment2_point2_y-segment2_point1_y)*(segment1_point1_x-segment2_point1_x))/denominator;
        var u2 = ((segment1_point2_x-segment1_point1_x)*(segment1_point1_y-segment2_point1_y) - (segment1_point2_y-segment1_point1_y)*(segment1_point1_x-segment2_point1_x))/denominator;;
        return {
            'x':      (segment1_point1_x + u1*(segment1_point2_x-segment1_point1_x)),
            'y':      (segment1_point1_y + u1*(segment1_point2_y-segment1_point1_y)),
            'inSeg1': (u1 >= 0 && u1 <= 1),
            'inSeg2': (u2 >= 0 && u2 <= 1)
        };
    };

    this.getBoundingBoxFromPoints = function(points){
        var left = points[0][0]; var right = points[0][0];
        var top = points[0][1];  var bottom = points[0][1];

        for(var a = 1; a < points.length; a++){
            if( points[a][0] < left ){ left = points[a][0]; }
            else if(points[a][0] > right){ right = points[a][0]; }

            if( points[a][1] < top ){ top = points[a][1]; }
            else if(points[a][1] > bottom){ bottom = points[a][1]; }
        }

        return [[left,top],[right,bottom]];
    };
    
    this.makeUnselectable = function(element){
        element.style['-webkit-user-select'] = 'none';
        element.style['-moz-user-select'] = 'none';
        element.style['-ms-user-select'] = 'none';
        element.style['user-select'] = 'none';
    };














    this.detectOverlap = function(a_poly, b_poly, a_box=null, b_box=null){
        // Quick Judgement with bounding boxes
        // (when bounding boxes are provided)
        if(a_box && b_box){
            // clearly separate shapes
            if(
                ( 
                    (a_box[0][0] < b_box[0][0] && a_box[0][0] < b_box[1][0]) ||
                    (a_box[1][0] > b_box[0][0] && a_box[1][0] > b_box[1][0]) ||
                    (a_box[0][1] < b_box[0][1] && a_box[0][1] < b_box[1][1]) ||
                    (a_box[1][1] > b_box[0][1] && a_box[1][1] > b_box[1][1]) 
                )
            ){/*console.log('clearly separate shapes');*/return false;}
        }

        // Detailed Judgement
            function distToSegmentSquared(p, a, b){
                function distanceBetweenTwoPoints(a, b){ return Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) }

                var lineLength = distanceBetweenTwoPoints(a, b);               //get length of line segment
                if (lineLength == 0){return distanceBetweenTwoPoints(p, a);}   //if line segment length is zero, just return the distance between a line point and the point
                
                var t = ((p.x-a.x) * (b.x-a.x) + (p.y-a.y) * (b.y-a.y)) / lineLength;
                t = Math.max(0, Math.min(1, t));
                return distanceBetweenTwoPoints(p, { 'x': a.x + t*(b.x-a.x), 'y': a.y + t*(b.y-a.y) });
            }
            function sideOfLineSegment(p, a, b){
                //get side that the point is on ('true' is 'inside')
                return ((b.x-a.x)*(p.y-a.y) - (p.x-a.x)*(b.y-a.y))>0;
            }


            //a point from A is in B
            // run through each point of poly 'A' and each side of poly 'B'
            // for each point in A, find the closest side of B and determine what side that point is on
            // if any point of A is inside B, declare an overlap
            var b_poly_clone = Object.assign([], b_poly); //because of referencing 
            b_poly_clone.push(b_poly[0]);
            for(var b = 0; b < a_poly.length; b++){
                var tempSmallestDistance = {'dis':Number.MAX_SAFE_INTEGER,'side':false};
                for(var a = 0; a < b_poly_clone.length-1; a++){
                    var linePoint_1 = {'x':b_poly_clone[a][0],'y':b_poly_clone[a][1]};
                    var linePoint_2 = {'x':b_poly_clone[a+1][0],'y':b_poly_clone[a+1][1]};
                    var point = {'x':a_poly[b][0],'y':a_poly[b][1]};
                        //reformat data into line-segment points and the point of interest

                    var dis = distToSegmentSquared(point,linePoint_1,linePoint_2);
                        if(dis==0){/*console.log('oh hay, collision - AinB');*/return true; }
                        //get distance from point to line segment
                        //if zero, it's a collisiion and we can end early

                    if( tempSmallestDistance.dis > dis ){ 
                        //if this distance is the smallest found in this round, save the distance and side
                        tempSmallestDistance.dis = dis; 
                        tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                    }
                }
                if( tempSmallestDistance.side ){/*console.log('a point from A is in B');*/return true;}
            }
            //a point from B is in A
            // same as above, but the other way around
            var a_poly_clone = Object.assign([], a_poly); //because of referencing 
            a_poly_clone.push(a_poly[0]);
            for(var b = 0; b < b_poly.length; b++){
                var tempSmallestDistance = {'dis':Number.MAX_SAFE_INTEGER,'side':false};
                for(var a = 0; a < a_poly_clone.length-1; a++){
                    var linePoint_1 = {'x':a_poly_clone[a][0],'y':a_poly_clone[a][1]};
                    var linePoint_2 = {'x':a_poly_clone[a+1][0],'y':a_poly_clone[a+1][1]};
                    var point = {'x':b_poly[b][0],'y':b_poly[b][1]};
                        //reformat data into line-segment points and the point of interest

                    var dis = distToSegmentSquared(point,linePoint_1,linePoint_2);
                        if(dis==0){/*console.log('oh hay, collision - BinA');*/return true; }
                        //get distance from point to line segment
                        //if zero, it's a collision and we can end early

                    if( tempSmallestDistance.dis > dis ){ 
                        //if this distance is the smallest found in this round, save the distance and side
                        tempSmallestDistance.dis = dis; 
                        tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                        testTemp = point;
                        testTempA = linePoint_1;
                        testTempB = linePoint_2;
                    }
                }
                if( tempSmallestDistance.side ){/*console.log('a point from B is in A');*/return true;}
            }

            //side intersection
            // compare each side of each poly to every other side, looking for lines that
            // cross each other. If a crossing is found at any point; return true
                for(var a = 0; a < a_poly_clone.length-1; a++){
                    for(var b = 0; b < b_poly_clone.length-1; b++){
                        var data = __globals.utility.getIntersectionOfTwoLineSegments(
                            a_poly_clone[a][0],  a_poly_clone[a][1],
                            a_poly_clone[a+1][0],a_poly_clone[a+1][1],
                            b_poly_clone[b][0],  b_poly_clone[b][1],
                            b_poly_clone[b+1][0],b_poly_clone[b+1][1]
                        );
                        
                        if(!data){continue;}
                        if(data.inSeg1 && data.inSeg2){/*console.log('point intersection at ' + data.x + ' ' + data.y);*/return true;}
                    }
                }

        return false;
    };
















}
__globals.panes = {'global':null, 'background':null, 'middleground':null, 'foreground':null, 'menu':null};

if( __globals.svgElement.children ){
    //go through SVG and see if the 'global', 'background', 'middleground', 'foreground' and 'menu' elements have already been made
    for(var a = 0; a < __globals.svgElement.children.length; a++){
        if( __globals.svgElement.children[a].hasAttribute('pane') ){
            switch(__globals.svgElement.children[a].getAttribute('pane')){
                case 'global': __globals.panes.global = __globals.svgElement.children[a]; break;
                case 'background': __globals.panes.background = __globals.svgElement.children[a]; break;
                case 'middleground': __globals.panes.middleground = __globals.svgElement.children[a]; break;
                case 'foreground': __globals.panes.foreground = __globals.svgElement.children[a]; break;
                case 'menu': __globals.panes.menu = __globals.svgElement.children[a]; break;
            }
        }
    }

    //if the 'background', 'middleground' or 'menu' elements were not made, create them
    if(__globals.panes.global == null){ __globals.panes.global = document.createElementNS('http://www.w3.org/2000/svg','g'); }
    if(__globals.panes.background == null){ 
        __globals.panes.background = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.background.setAttribute('pane','background');
    }
    if(__globals.panes.middleground == null){ 
        __globals.panes.middleground = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.middleground.setAttribute('pane','middleground');
    }
    if(__globals.panes.foreground == null){ 
        __globals.panes.foreground = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.foreground.setAttribute('pane','foreground');
    }
    if(__globals.panes.menu == null){ 
        __globals.panes.menu = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.menu.setAttribute('pane','menu'); 
    }
}

//make panes unselectable
__globals.utility.makeUnselectable(__globals.panes.background );
__globals.utility.makeUnselectable(__globals.panes.middleground );
__globals.utility.makeUnselectable(__globals.panes.foreground );


//setup global
if(!__globals.panes.global.style.transform){ __globals.panes.global.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
__globals.panes.global.setAttribute('global',true);

//clear out svg element
__globals.svgElement.innerHTML = '';

//add __globals.panes to svg element
__globals.svgElement.append(__globals.panes.global);
__globals.panes.global.append(__globals.panes.background);
__globals.panes.global.append(__globals.panes.middleground);
__globals.panes.global.append(__globals.panes.foreground);
__globals.svgElement.append(__globals.panes.menu);
//setup selected objects spaces and functionality
__globals.selection = new function(){
    this.selectedObjects = [];
    this.lastSelectedObject = null;
    this.clipboard = [];
        // pane                 -   the pane the object came from
        // objectConstructor    -   the creation function of the object
        // originalsPosition    -   the X and Y of the original object
        // data                 -   the exported data from the original object
        // connections          -   an array of where to connect what
        //                              originPort
        //                              destinationPort
        //                              indexOfDestinationObject



    this.deselectEverything = function(except=[]){
        var newList = [];

        for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
            if( except.includes(__globals.selection.selectedObjects[a]) ){
                newList.push(__globals.selection.selectedObjects[a]);
            }else{
                if(__globals.selection.selectedObjects[a].onDeselect){__globals.selection.selectedObjects[a].onDeselect();}
            }
        }
        __globals.selection.selectedObjects = newList;
    };
    this.selectObject = function(object){
        if(object.onSelect){object.onSelect();}
        __globals.selection.selectedObjects.push(object);
        __globals.selection.lastSelectedObject = object;
    };
    this.deselectObject = function(object){
        __globals.selection.selectedObjects.splice(__globals.selection.selectedObjects.indexOf(object),1);
        object.onDeselect();
    };



    this.cut = function(){
        this.copy();
        this.delete();
    };
    this.copy = function(){
        this.clipboard = [];

        for( var a = 0; a < this.selectedObjects.length; a++){
            var newEntry = [];   

            //pane
                newEntry.push( __globals.utility.getPane(this.selectedObjects[a]) );

            //objectConstructor
                //if the object doesn't have a constructor, don't bother with any of this
                // in-fact; deselect it altogether and move on to the next object
                if( !this.selectedObjects[a].creatorMethod ){
                    __globals.selection.deselectObject(this.selectedObjects[a]);
                    a--; continue;
                }
                newEntry.push( this.selectedObjects[a].creatorMethod );

            //originalsPosition
                var position = __globals.utility.getTransform(this.selectedObjects[a]);
                newEntry.push( [position[0],position[1]] );

            //data
                if( this.selectedObjects[a].exportData ){
                    newEntry.push( this.selectedObjects[a].exportData() );
                }else{ newEntry.push( null ); }

            //connections
                if(this.selectedObjects[a].io){
                    var connections = [];
                    var keys = Object.keys(this.selectedObjects[a].io);
                    for(var b = 0; b < keys.length; b++){
                        var conn = [];

                        //originPort
                            conn.push(keys[b]);

                        //destinationPort and indexOfDestinationObject
                            if(!this.selectedObjects[a].io[keys[b]].foreignNode){ continue;}
                            
                            var destinationPorts = Object.keys(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement.io);
                            for(var c = 0; c < destinationPorts.length; c++){
                                if(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement.io[destinationPorts[c]] === this.selectedObjects[a].io[keys[b]].foreignNode){
                                    conn.push(destinationPorts[c]);
                                    conn.push(this.selectedObjects.indexOf(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement));
                                    break;
                                }
                            }

                        if( conn[2] >= 0 ){ connections.push(conn); }
                    }
                    newEntry.push(connections);
                }

            this.clipboard.push(newEntry);
        }
    };
    this.paste = function(position=null){
        //if clipboard is empty, don't bother
            if(this.clipboard.length == 0){return;}

        //deselect everything
            this.deselectEverything();

        //position manipulation
        // if position is not set to 'duplicate', calculate new positions for the objects
            if(position != 'duplicate'){
                // colelct all positions
                    var points = [];
                    this.clipboard.forEach( element => points.push(element[2]) );
                //get the bounding box of this selection, and then the top left point of that
                    var topLeft = __globals.utility.getBoundingBoxFromPoints(points)[0];
                //subtract this point from each position
                // then add on the mouses's position, or the provided position
                    if(!position){
                        //use viewport for position
                            // var position = __globals.utility.getTransform(__globals.panes.global);
                            // position = [-position[0]/position[2], -position[1]/position[2]];

                        //use mouse position
                            var temp = __globals.utility.pointconverter_browserWorkspace(__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]);
                            var position = [temp.x, temp.y];
                    }
                    this.clipboard.forEach( function(element){
                        element[2][0] += position[0] - topLeft[0];
                        element[2][1] += position[1] - topLeft[1];
                    } );
            }

        //object printing
        this.clipboard.forEach(function(item){
            // pane              = item[0]
            // objectConstructor = item[1]
            // originalsPosition = item[2]
            // data              = item[3]
            // connections       = item[4]

            //create the object with its new position
                var obj = item[1](item[2][0],item[2][1]);
                if(obj.importData){obj.importData(item[3]);}

            //add the object to the pane and select it
                item[0].appendChild(obj);
                __globals.selection.selectObject(obj);

            //go through its connections, and attempt to connect them to everything they should be connected to
            // (don't worry if a object isn't avalable yet, just skip that one. Things will work out in the end)
                if(item[4]){
                    item[4].forEach(function(conn){
                        // originPort                  = conn[0]
                        // destinationPort             = conn[1]
                        // indexOfDestinationObject    = conn[2]
                        if( conn[2] < __globals.selection.selectedObjects.length ){
                            obj.io[conn[0]].connectTo( __globals.selection.selectedObjects[conn[2]].io[conn[1]] );
                        }
                    });
                }
        });
    };
    this.duplicate = function(){
        this.copy();
        this.paste('duplicate');
        this.clipboard = [];
    };
    this.delete = function(){
        while(this.selectedObjects.length > 0){
            //run the object's onDelete method
                if(this.selectedObjects[0].onDelete){this.selectedObjects[0].onDelete();}

            //run disconnect on every connection node of this object
                var keys = Object.keys(this.selectedObjects[0].io);
                for( var a = 0; a < keys.length; a++){
                    //account for node arrays
                    if( Array.isArray(this.selectedObjects[0].io[keys[a]]) ){
                        for(var c = 0; c < this.selectedObjects[0].io[keys[a]].length; c++){
                            this.selectedObjects[0].io[keys[a]][c].disconnect();
                        }
                    }else{ this.selectedObjects[0].io[keys[a]].disconnect(); }
                }

            //remove the object from the pane it's in and then from the selected objects list
                __globals.utility.getPane(this.selectedObjects[0]).removeChild(this.selectedObjects[0]);
                this.selectedObjects.shift();
        }
        this.lastSelectedObject = null;
    };

};
// utility functions
    __globals.mouseInteraction = {};
    __globals.mouseInteraction.currentPosition = [];
    __globals.mouseInteraction.wheelInterpreter = function(y){
        return y/100;
        // return y > 0 ? 1 : -1;
    };















// grapple functions
    __globals.mouseInteraction.objectGrapple_functionList = {};
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown = [];
    __globals.mouseInteraction.objectGrapple_functionList.onmouseup = [];
    __globals.mouseInteraction.declareObjectGrapple = function(grapple, target, creatorMethod){
        if(!creatorMethod){console.error('"declareObjectGrapple" requires a creatorMethod');return;}

        grapple.target = target ? target : grapple;
        grapple.target.creatorMethod = creatorMethod;
        grapple.target.grapple = grapple;
        grapple.target.style.transform = grapple.target.style.transform ? grapple.target.style.transform : 'translate(0px,0px) scale(1) rotate(0rad)';

        grapple.onmousedown = function(event){
            if(event.button != 0){return;}
            __globals.svgElement.temp_onmousedown_originalObject = this.target;

            for(var a = 0; a < __globals.mouseInteraction.objectGrapple_functionList.onmousedown.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].function(event); break; }
            }
        };
        grapple.onmouseup = function(event){
            __globals.svgElement.temp_onmouseup_originalObject = this.target;

            for(var a = 0; a < __globals.mouseInteraction.objectGrapple_functionList.onmouseup.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].function(event); break; }
            }
        };
    };

    //duplication
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':['altKey'],
            'function':function(event){
                // if mousedown occurs over an object that isn't selected; select it
                if( !__globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmousedown_originalObject) ){
                    __globals.selection.selectObject(__globals.svgElement.temp_onmousedown_originalObject);
                }

                //perform duplication
                __globals.selection.duplicate();

                //start moving the first object in the object list
                // (the movement code will handle moving the rest)
                __globals.selection.selectedObjects[0].grapple.onmousedown(
                    {
                        'x':event.x, 'y':event.y,
                        'button':0
                    }
                );

            }
        }
    );
    //general moving
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':[],
            'function':function(event){
                // if mousedown occurs over an object that isn't selected
                //  and if the shift key is not pressed
                //   deselect everything
                //  now, select the object we're working on is not selected
                if( !__globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmousedown_originalObject) ){
                    if(!event.shiftKey){ __globals.selection.deselectEverything(); }
                    __globals.selection.selectObject(__globals.svgElement.temp_onmousedown_originalObject);
                }

                // collect together information on the click position and the selected object's positions
                __globals.svgElement.temp_oldClickPosition = [event.x,event.y];
                __globals.svgElement.temp_oldObjectPositions = [];
                for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
                    __globals.svgElement.temp_oldObjectPositions.push( __globals.utility.getTransform(__globals.selection.selectedObjects[a]) );
                }

                // perform the move for all selected objects
                __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                __globals.svgElement.onmousemove = function(event){
                    for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
                        var clickPosition = __globals.svgElement.temp_oldClickPosition;
                        var position = __globals.svgElement.temp_oldObjectPositions[a].slice();;
                        var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];

                        position[0] = (position[0]-(clickPosition[0]-event.x)/globalScale);
                        position[1] = (position[1]-(clickPosition[1]-event.y)/globalScale);

                        __globals.utility.setTransform(__globals.selection.selectedObjects[a], position);

                        //perform all redraws and updates for object
                        if( __globals.selection.selectedObjects[a].onMove ){__globals.selection.selectedObjects[a].onMove();}
                        if( __globals.selection.selectedObjects[a].updateSelectionArea ){__globals.selection.selectedObjects[a].updateSelectionArea();}
                        if( __globals.selection.selectedObjects[a].io ){
                            var keys = Object.keys( __globals.selection.selectedObjects[a].io );
                            for(var b = 0; b < keys.length; b++){ 
                                //account for node arrays
                                if( Array.isArray(__globals.selection.selectedObjects[a].io[keys[b]]) ){
                                    for(var c = 0; c < __globals.selection.selectedObjects[a].io[keys[b]].length; c++){
                                        __globals.selection.selectedObjects[a].io[keys[b]][c].redraw();
                                    }
                                }else{ __globals.selection.selectedObjects[a].io[keys[b]].redraw(); }
                            }
                        }
                    }
                };

                // clean-up code
                __globals.svgElement.onmouseup = function(){
                    this.onmousemove = null;
                    delete __globals.svgElement.tempElements;
                    this.onmousemove = __globals.svgElement.onmousemove_old;
                    delete this.temp_onmousedown_originalObject;
                    delete this.temp_oldClickPosition;
                    delete this.temp_oldObjectPositions;
                    delete this.onmouseleave;
                    delete this.onmouseup;
                };
            
                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);
            }
        }
    );
    //selection
    __globals.mouseInteraction.objectGrapple_functionList.onmouseup.push(
        {
            'specialKeys':[],
            'function':function(event){

                //if mouse-up occurs over an object that is selected
                // and if the shift key is pressed
                // and if the object we're working on is not the most recently selected
                //  deselect the object we're working on
                // now set the most recently selected reference to null
                if( __globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmouseup_originalObject) ){
                    if( event.shiftKey && (__globals.selection.lastSelectedObject != __globals.svgElement.temp_onmouseup_originalObject) ){
                        __globals.selection.deselectObject(__globals.svgElement.temp_onmouseup_originalObject);
                    }
                    __globals.selection.lastSelectedObject = null;
                }

            }
        }
    );










// onmousemove functions
    __globals.mouseInteraction.onmousemove_functionList = [];
    __globals.svgElement.onmousemove = function(event){
        if(!__globals.utility.requestInteraction(event.x,event.y,'onmousemove') && event.button == 0){return;}
        for(var a = 0; a < __globals.mouseInteraction.onmousemove_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < __globals.mouseInteraction.onmousemove_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[__globals.mouseInteraction.onmousemove_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ __globals.mouseInteraction.onmousemove_functionList[a].function(event); break; }
        }
    };

    // register position
    __globals.mouseInteraction.onmousemove_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                __globals.mouseInteraction.currentPosition = [event.x, event.y];
            }
        }
    );








// onmousedown functions
    __globals.mouseInteraction.onmousedown_functionList = [];
    __globals.svgElement.onmousedown = function(event){
        if(!__globals.utility.requestInteraction(event.x,event.y,'onmousedown') || event.button != 0){return;}
        for(var a = 0; a < __globals.mouseInteraction.onmousedown_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < __globals.mouseInteraction.onmousedown_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[__globals.mouseInteraction.onmousedown_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ __globals.mouseInteraction.onmousedown_functionList[a].function(event); break; }
        }
    };

    //group selection
    __globals.mouseInteraction.onmousedown_functionList.push(
        {
            'specialKeys':['shiftKey'],
            'function':function(event){
                    //setup
                    __globals.svgElement.tempData = {};
                    __globals.svgElement.tempElements = [];
                    __globals.svgElement.tempData.start = {'x':event.x, 'y':event.y};

                    //create 'selection box' graphic and add it to the menu pane
                    __globals.svgElement.tempElements.push(
                        parts.basic.path(
                            null, 
                            [
                                [__globals.svgElement.tempData.start.x, __globals.svgElement.tempData.start.y],
                                [__globals.svgElement.tempData.start.x, __globals.svgElement.tempData.start.y],
                                [__globals.svgElement.tempData.start.x, __globals.svgElement.tempData.start.y],
                                [__globals.svgElement.tempData.start.x, __globals.svgElement.tempData.start.y]
                            ], 
                            'L', 'fill:rgba(120,120,255,0.25)'
                        )
                    );
                    for(var a = 0; a < __globals.svgElement.tempElements.length; a++){ __globals.panes.menu.append(__globals.svgElement.tempElements[a]); }

                    //adjust selection box when the mouse moves
                    __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                    __globals.svgElement.onmousemove = function(event){
                        __globals.svgElement.tempData.end = {'x':event.x, 'y':event.y};

                        __globals.svgElement.tempElements[0].path(
                            [
                                [__globals.svgElement.tempData.start.x, __globals.svgElement.tempData.start.y],
                                [__globals.svgElement.tempData.end.x,   __globals.svgElement.tempData.start.y],
                                [__globals.svgElement.tempData.end.x,   __globals.svgElement.tempData.end.y],
                                [__globals.svgElement.tempData.start.x, __globals.svgElement.tempData.end.y]
                            ]
                        );
                        
                    };

                    //when the mouse is raised; 
                    //  find the objects that are selected
                    //  tell them they are selected (tell the rest they aren't)
                    //  add the selected to the 'selected objects list'
                    __globals.svgElement.onmouseup = function(){
                        //set up
                            __globals.selection.deselectEverything();
                            var start = __globals.utility.pointconverter_browserWorkspace(__globals.svgElement.tempData.start.x,__globals.svgElement.tempData.start.y);
                            var end = __globals.utility.pointconverter_browserWorkspace(__globals.svgElement.tempData.end.x,__globals.svgElement.tempData.end.y);
                            var selectionArea = {};
                        
                        //create selection box (correcting negative values along the way)
                            selectionArea.box = [[],[]];
                            if(start.x > end.x){ selectionArea.box[0][0] = start.x; selectionArea.box[1][0] = end.x; }
                            else{ selectionArea.box[0][0] = end.x; selectionArea.box[1][0] = start.x; }
                            if(start.y > end.y){ selectionArea.box[0][1] = start.y; selectionArea.box[1][1] = end.y; }
                            else{ selectionArea.box[0][1] = end.y; selectionArea.box[1][1] = start.y; }
                            //create poly of this box with clockwise wind
                            if( Math.sign(start.x-end.x) != Math.sign(start.y-end.y) ){
                                selectionArea.points = [[start.x, start.y], [start.x, end.y], [end.x, end.y], [end.x, start.y]];
                            }else{ 
                                selectionArea.points = [[start.x, start.y], [end.x, start.y], [end.x, end.y], [start.x, end.y]];
                            }
                            
                        //run though all middleground objects to see if they are selected in this box
                        //  tell them they are selected (or not) and add the selected to the selected list
                            var objects = __globals.panes.middleground.children;
                            for(var a = 0; a < objects.length; a++){
                                if(objects[a].selectionArea){
                                    if(__globals.utility.detectOverlap(selectionArea.points, objects[a].selectionArea.points, selectionArea.box, objects[a].selectionArea.box)){
                                        __globals.selection.selectObject(objects[a]);
                                    }
                                }
                            }

                        //delete all temporary elements and attributes
                            delete __globals.svgElement.tempData;
                            for(var a = 0; a < __globals.svgElement.tempElements.length; a++){
                                __globals.panes.menu.removeChild( __globals.svgElement.tempElements[a] ); 
                                __globals.svgElement.tempElements[a] = null;
                            }
                            delete __globals.svgElement.tempElements;
                            this.onmousemove = __globals.svgElement.onmousemove_old;
                            delete __globals.svgElement.onmousemove_old;
                            this.onmouseleave = null;
                            __globals.panes.global.removeAttribute('oldPosition');
                            __globals.panes.global.removeAttribute('clickPosition');
                            this.onmouseleave = null;
                            this.onmouseup = null;
                    };

                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);
            }
        }
    );

    //panning 
    __globals.mouseInteraction.onmousedown_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                __globals.selection.deselectEverything();
                __globals.panes.global.setAttribute('oldPosition','['+__globals.utility.getTransform(__globals.panes.global)+']');
                __globals.panes.global.setAttribute('clickPosition','['+event.x +','+ event.y+']');

                __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                __globals.svgElement.onmousemove = function(event){
                    var position = JSON.parse(__globals.panes.global.getAttribute('oldPosition'));
                    var clickPosition = JSON.parse(__globals.panes.global.getAttribute('clickPosition'));
                    position[0] = position[0]-(clickPosition[0]-event.x);
                    position[1] = position[1]-(clickPosition[1]-event.y);
                    __globals.utility.setTransform(__globals.panes.global, position);
                };

                __globals.svgElement.onmouseup = function(){
                    this.onmousemove = __globals.svgElement.onmousemove_old;
                    delete __globals.svgElement.onmousemove_old;
                    __globals.panes.global.removeAttribute('oldPosition');
                    __globals.panes.global.removeAttribute('clickPosition');
                    this.onmouseleave = null;
                    this.onmouseup = null;
                };

                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);

            }
        }
    );







// onwheel functions
    __globals.svgElement.onwheel_functionList = [];
    __globals.svgElement.onwheel = function(event){
        if(!__globals.utility.requestInteraction(event.x,event.y,'onwheel')){return;}
        for(var a = 0; a < __globals.svgElement.onwheel_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < __globals.svgElement.onwheel_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[__globals.svgElement.onwheel_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ __globals.svgElement.onwheel_functionList[a].function(event); break; }
        }
    };

    __globals.svgElement.onwheel_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                var zoomLimits = {'max':10, 'min':0.1};
                var position = __globals.utility.getTransform(__globals.panes.global);

                var XPosition = (event.x - position[0])/position[2];
                var YPosition = (event.y - position[1])/position[2];
                    var oldPixX = position[2] * ( XPosition + position[0]/position[2]);
                    var oldPixY = position[2] * ( YPosition + position[1]/position[2]);
                        // var mux = 1.25; position[2] = position[2] * ( event.deltaY < 0 ? 1*mux : 1/mux );
                        position[2] -= position[2]*__globals.mouseInteraction.wheelInterpreter(event.deltaY);
                        if( position[2] > zoomLimits.max ){position[2] = zoomLimits.max;}
                        if( position[2] < zoomLimits.min ){position[2] = zoomLimits.min;}
                    var newPixX = position[2] * ( XPosition + position[0]/position[2]);
                    var newPixY = position[2] * ( YPosition + position[1]/position[2]);
                position[0] = position[0] - ( newPixX - oldPixX );
                position[1] = position[1] - ( newPixY - oldPixY );

                __globals.utility.setTransform(__globals.panes.global, position);
            }
        }
    );
__globals.keyboardInteraction = {};
__globals.keyboardInteraction.pressedKeys = {};

// keycapture
__globals.keyboardInteraction.declareKeycaptureObject = function(object){
    var connectionObject = new function(){
        this.keyPress = function(key){};
        this.keyRelease = function(key){};
    };

    object.onkeydown = function(event){
        if(connectionObject.keyPress){connectionObject.keyPress(event.key);}
    };
    object.onkeyup = function(event){
        if(connectionObject.keyPress){connectionObject.keyRelease(event.key);}
    };
    return connectionObject;
};



// onkeydown functions
    __globals.keyboardInteraction.onkeydown_functionList = {};
    document.onkeydown = function(event){
        //if key is already pressed, don't press it again
        if(__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        __globals.keyboardInteraction.pressedKeys[event.code] = true;

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it, otherwise use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.requestInteraction(temp[0],temp[1],'onkeydown')){
            __globals.utility.getObjectUnderPoint(temp[0],temp[1]).onkeydown(event);
            return;
        }
                            
        //global function
        if( __globals.keyboardInteraction.onkeydown_functionList[event.key] ){
            __globals.keyboardInteraction.onkeydown_functionList[event.key](event);
        }
    };

    __globals.keyboardInteraction.onkeydown_functionList.Delete = function(event){
        console.log('delete!');
        __globals.selection.delete();
    };
    __globals.keyboardInteraction.onkeydown_functionList.Backspace = function(event){
        console.log('backspace!');
        __globals.keyboardInteraction.onkeydown_functionList.Delete(event);
    };
    __globals.keyboardInteraction.onkeydown_functionList.x = function(event){
        if(!event.ctrlKey){return;}
        console.log('cut!');
        __globals.selection.cut();
    };
    __globals.keyboardInteraction.onkeydown_functionList.c = function(event){
        if(!event.ctrlKey){return;}
        console.log('copy!');
        __globals.selection.copy();
    };
    __globals.keyboardInteraction.onkeydown_functionList.b = function(event){
        if(!event.ctrlKey){return;}
        console.log('duplicate!');
        __globals.selection.duplicate();
    };
    __globals.keyboardInteraction.onkeydown_functionList.v = function(event){
        if(!event.ctrlKey){return;}
        console.log('paste!');
        __globals.selection.paste();
    };



// onkeyup functions
    __globals.keyboardInteraction.onkeyup_functionList = {};
    document.onkeyup = function(event){
        //if key isn't pressed, don't release it
        if(!__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        delete __globals.keyboardInteraction.pressedKeys[event.code];

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it, otherwise use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.requestInteraction(temp[0],temp[1],'onkeyup')){
            __globals.utility.getObjectUnderPoint(temp[0],temp[1]).onkeyup(event);
            return;
        }
                            
        //global function
        if( __globals.keyboardInteraction.onkeyup_functionList[event.key] ){
            __globals.keyboardInteraction.onkeyup_functionList[event.key](event);
        }
    };
__globals.audio = {};
__globals.audio.context = new (window.AudioContext || window.webkitAudioContext)();

__globals.audio.names_frequencies_split = {
    0:{ 'C':16.35, 'C#':17.32, 'D':18.35, 'D#':19.45, 'E':20.60, 'F':21.83, 'F#':23.12, 'G':24.50, 'G#':25.96, 'A':27.50, 'A#':29.14, 'B':30.87  },
    1:{ 'C':32.70, 'C#':34.65, 'D':36.71, 'D#':38.89, 'E':41.20, 'F':43.65, 'F#':46.25, 'G':49.00, 'G#':51.91, 'A':55.00, 'A#':58.27, 'B':61.74, },    
    2:{ 'C':65.41, 'C#':69.30, 'D':73.42, 'D#':77.78, 'E':82.41, 'F':87.31, 'F#':92.50, 'G':98.00, 'G#':103.8, 'A':110.0, 'A#':116.5, 'B':123.5, },
    3:{ 'C':130.8, 'C#':138.6, 'D':146.8, 'D#':155.6, 'E':164.8, 'F':174.6, 'F#':185.0, 'G':196.0, 'G#':207.7, 'A':220.0, 'A#':233.1, 'B':246.9, },    
    4:{ 'C':261.6, 'C#':277.2, 'D':293.7, 'D#':311.1, 'E':329.6, 'F':349.2, 'F#':370.0, 'G':392.0, 'G#':415.3, 'A':440.0, 'A#':466.2, 'B':493.9, },
    5:{ 'C':523.3, 'C#':554.4, 'D':587.3, 'D#':622.3, 'E':659.3, 'F':698.5, 'F#':740.0, 'G':784.0, 'G#':830.6, 'A':880.0, 'A#':932.3, 'B':987.8, },    
    6:{ 'C':1047,  'C#':1109,  'D':1175,  'D#':1245,  'E':1319,  'F':1397,  'F#':1480,  'G':1568,  'G#':1661,  'A':1760,  'A#':1865,  'B':1976,  },
    7:{ 'C':2093,  'C#':2217,  'D':2349,  'D#':2489,  'E':2637,  'F':2794,  'F#':2960,  'G':3136,  'G#':3322,  'A':3520,  'A#':3729,  'B':3951,  },    
    8:{ 'C':4186,  'C#':4435,  'D':4699,  'D#':4978,  'E':5274,  'F':5588,  'F#':5920,  'G':6272,  'G#':6645,  'A':7040,  'A#':7459,  'B':7902   }, 
};
//generate forward index
// eg. {... '4C':261.6, '4C#':277.2 ...}
__globals.audio.names_frequencies = {};
var octaves = Object.entries(__globals.audio.names_frequencies_split);
for(var a = 0; a < octaves.length; a++){
    var names = Object.entries(__globals.audio.names_frequencies_split[a]);
    for(var b = 0; b < names.length; b++){
        __globals.audio.names_frequencies[ octaves[a][0]+names[b][0] ] = names[b][1];
    }
}
//generate backward index
// eg. {... 261.6:'4C', 277.2:'4C#' ...}
__globals.audio.frequencies_names = {};
var temp = Object.entries(__globals.audio.names_frequencies);
for(var a = 0; a < temp.length; a++){ __globals.audio.frequencies_names[temp[a][1]] = temp[a][0]; }

__globals.audio.getFreq = function(name){ return __globals.audio.names_frequencies[name]; };
__globals.audio.getName = function(freq){ return __globals.audio.frequencies_names[freq]; };


//generate midi notes index
var temp = [
    '0C', '0C#', '0D', '0D#', '0E', '0F', '0F#', '0G', '0G#', '0A', '0A#', '0B',
    '1C', '1C#', '1D', '1D#', '1E', '1F', '1F#', '1G', '1G#', '1A', '1A#', '1B',
    '2C', '2C#', '2D', '2D#', '2E', '2F', '2F#', '2G', '2G#', '2A', '2A#', '2B',
    '3C', '3C#', '3D', '3D#', '3E', '3F', '3F#', '3G', '3G#', '3A', '3A#', '3B',
    '4C', '4C#', '4D', '4D#', '4E', '4F', '4F#', '4G', '4G#', '4A', '4A#', '4B',
    '5C', '5C#', '5D', '5D#', '5E', '5F', '5F#', '5G', '5G#', '5A', '5A#', '5B',
    '6C', '6C#', '6D', '6D#', '6E', '6F', '6F#', '6G', '6G#', '6A', '6A#', '6B',
    '7C', '7C#', '7D', '7D#', '7E', '7F', '7F#', '7G', '7G#', '7A', '7A#', '7B',
    '8C', '8C#', '8D', '8D#', '8E', '8F', '8F#', '8G', '8G#', '8A', '8A#', '8B',
];
//generate forward index
__globals.audio.midinumbers_names = {};
for(var a = 0; a < temp.length; a++){
    __globals.audio.midinumbers_names[a+24] = temp[a];
}
//generate backward index
__globals.audio.names_midinumbers = {};
var temp = Object.entries(__globals.audio.midinumbers_names);
for(var a = 0; a < temp.length; a++){ 
    __globals.audio.names_midinumbers[temp[a][1]] = parseInt(temp[a][0]);
}




__globals.audio.noteName_frequency = function(name, offsetOctave=0){
    return __globals.audio.names_frequencies[(parseInt(name.chatAt(0))+offsetOctave) + name.slice(1)];
};
__globals.audio.midiNumber_frequency = function(number, offsetOctave=0){
    return __globals.audio.names_frequencies[__globals.audio.midinumbers_names[number+offsetOctave*12]];
};


var parts = new function(){
    this.basic = new function(){
this.line = function(id=null, x1=0, y1=0, x2=10, y2=10, style='stroke:rgb(255,0,0); stroke-width:1'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','line');
    element.id = id;
    element.setAttribute('x1',x1);
    element.setAttribute('y1',y1);
    element.setAttribute('x2',x2);
    element.setAttribute('y2',y2);
    element.setAttribute('style',style);

    return element;
};
this.circle = function(id=null, x=0, y=0, r=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','circle');
    element.id = id;
    element.setAttribute('r',r);
    element.style = 'transform: translate('+x+'px,'+y+'px) scale(1); rotate('+angle+'rad);' + style;

    return element;
};
this.rect = function(id=null, x=0, y=0, width=0, height=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','rect');
    element.id = id;
    element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad);' + style;
    element.setAttribute('height',height);
    element.setAttribute('width',width);

    element.rotation = function(a){
        if(a==null){return __globals.utility.getTransform(this)[3];}
        __globals.utility.setRotation(this, a);
    };

    return element;
};
this.path = function(id=null, path=[], lineType='L', style='fill:none; stroke:rgb(255,0,0); stroke-width:1;'){
    // uppercase: absolute, lowercase: relative
    // M = moveto
    // L = lineto
    // H = horizontal lineto
    // V = vertical lineto
    // C = curveto
    // S = smooth curveto
    // Q = quadratic Bézier curve
    // T = smooth quadratic Bézier curveto
    // A = elliptical Arc
    // Z = closepath
    var element = document.createElementNS('http://www.w3.org/2000/svg','path');
    element.id = id;
    element.style = style;

    element._installPath = function(path){
        var d = 'M ' + path[0][0] + ' ' + path[0][1] + ' ' + lineType;
        for(var a = 1; a < path.length; a++){
            d += ' ' + path[a][0] + ' ' + path[a][1]
        }
        this.setAttribute('d',d);
    };

    element._path = path;
    element._installPath(path);

    element.path = function(a){
        if(a==null){return this._path;}
        this._path = a;
        this._installPath(a);
    };

    return element;
};
this.g = function(id=null, x=0, y=0){
    var element = document.createElementNS('http://www.w3.org/2000/svg','g');
        element.id = id;
        element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate(0rad)';

    return element;
};
this.text = function(id=null, x=0, y=0, text='', angle=0, style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;', scale=1){
    var element = document.createElementNS('http://www.w3.org/2000/svg','text');
        element.id = null;
        element.style = 'transform: translate('+x+'px,'+y+'px) scale('+scale+') rotate('+angle+'rad);' + style;
        element.innerHTML = text;

    return element;
};
    }
    this.modifier = new function(){
// this.makeUnselectable = function(element){
//     element.style['-webkit-user-select'] = 'none';
//     element.style['-moz-user-select'] = 'none';
//     element.style['-ms-user-select'] = 'none';
//     element.style['user-select'] = 'none';
// };
    }
    this.display = new function(){
this.rastorDisplay = function(
    id='rastorDisplay',
    x, y, width, height,
    xCount, yCount, xGappage=1, yGappage=1
){
    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //backing
        var rect = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgb(0,0,0)');
            object.appendChild(rect);

        //pixels
            var pixels = [];
            var pixelValues = [];
            var pixWidth = width/xCount;
            var pixHeight = height/yCount;

            for(var x = 0; x < xCount; x++){
                var temp_pixels = [];
                var temp_pixelValues = [];
                for(var y = 0; y < yCount; y++){
                    var rect = parts.basic.rect(null, (x*pixWidth)+xGappage/2, (y*pixHeight)+yGappage/2, pixWidth-xGappage, pixHeight-yGappage, 0, 'fill:rgb(0,0,0)');
                        temp_pixels.push(rect);
                        temp_pixelValues.push([0,0,0]);
                        object.appendChild(rect);
                }
                pixels.push(temp_pixels);
                pixelValues.push(temp_pixelValues);
            }

    //inner workings
        function render(){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    __globals.utility.setStyle(pixels[x][y], 'fill:rgb('+255*pixelValues[x][y][0]+','+255*pixelValues[x][y][1]+','+255*pixelValues[x][y][2]+')' );
                }
            }
        }
        
    //methods
        object.get = function(x,y){ return pixelValues[x][y]; };
        object.set = function(x,y,state){ pixelValues[x][y] = state; render() };
        object.reverseLoad = function(data){
        for(var y = 0; y < yCount; y++){
            for(var x = 0; x < xCount; x++){
                    this.set(x,y,data[y][x]);
                }
            }
            render();
        };
        object.load = function(data){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,data[x][y]);
                }
            }
            render();
        };
        object.unload = function(){ return pixelValues; }
        object.setAll = function(value){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,value);
                }
            }
        }

        object.test = function(){
            this.setAll([1,1,1]);
            render();
        };

    return object;
};
this.grapher = function(
    id='grapher',
    x, y, width, height,
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._data = {};
        object._data.width = width,
        object._data.height = height,
        object._data.viewbox = {'l':-1,'h':1};
        object._data.horizontalMarkings = [0.75,0.5,0.25,0,-0.25,-0.5,-0.75];
        object._data.verticalMarkings = [0.75,0.5,0.25,0,-0.25,-0.5,-0.75];
        object._data.styles = {
            'middleground':middlegroundStyle, 
            'background':backgroundStyle, 
            'backgroundText':backgroundTextStyle,
            'backing':backingStyle
        };

    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var background = parts.basic.g('background', 0, 0);
        object.appendChild(background);
    var middleground = parts.basic.g('middleground', 0, 0);
        object.appendChild(middleground);


    //internal methods
    object._pointConverter = function(realHeight, viewbox, y){
        var viewboxDistance = Math.abs( viewbox.h - viewbox.l );
        var y_graphingDistance = realHeight * (-(viewbox.l + y )/viewboxDistance)
        return y_graphingDistance;
    };
    object._lineCorrecter = function(points, maxheight){
        if( points.y1 < 0 && points.y2 < 0 ){ return; }
        if( points.y1 > maxheight && points.y2 > maxheight ){ return; }

        var slope = (points.y2 - points.y1)/(points.x2 - points.x1);

        if( points.y1 < 0 ){ points.x1 = (0 - points.y1 + slope*points.x1)/slope; points.y1 = 0; }
        else if( points.y2 < 0 ){ points.x2 = (0 - points.y2 + slope*points.x2)/slope; points.y2 = 0; }
        if( points.y1 > maxheight ){ points.x1 = (maxheight - points.y1 + slope*points.x1)/slope; points.y1 = maxheight; }
        else if( points.y2 > maxheight ){ points.x2 = (maxheight - points.y2 + slope*points.x2)/slope; points.y2 = maxheight; }

        return points;
    };
    object._test = function(){
        this.horizontalMarkings([0.75,0.5,0.25,0,-0.25,-0.5,-0.75,1,1.25,1.5,1.75,-1.75]);
        this.verticalMarkings([0,1,2,3,4,5,6,7,8,9,10]);
        this.viewbox({'l':-2,'h':2});
        this.drawBackground();
        this.draw([-2,1,-1,2]);
    };
    

    //methods
    object.viewbox = function(a){
        if(a==null){return object._data.viewbox;}
        object._data.viewbox = a;
    };
    object.horizontalMarkings = function(a){
        if(a==null){return object._data.horizontalMarkings;}
        object._data.horizontalMarkings = a;
    };
    object.verticalMarkings = function(a){
        if(a==null){return object._data.verticalMarkings;}
        object._data.verticalMarkings = a;
    };
    object.drawBackground = function(){
        this.children['background'].innerHTML = '';

        //horizontal lines
        for(var a = 0; a < this._data.horizontalMarkings.length; a++){
            this.children['background'].append(
                parts.basic.line(
                    null,
                    0,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a] ),
                    this._data.width,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a] ),
                    this._data.styles.background
                )
            );
            this.children['background'].append(
                parts.basic.text(
                    null,
                    0.5,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a]-0.075 ),
                    this._data.horizontalMarkings[a],
                    0,
                    this._data.styles.backgroundText,
                    0.1
                )
            );
        }

        //vertical lines
        for(var a = 0; a < this._data.verticalMarkings.length; a++){
            this.children['background'].append(
                parts.basic.line(
                    null,
                    a*(this._data.width/this._data.verticalMarkings.length),
                    0,
                    a*(this._data.width/this._data.verticalMarkings.length),
                    this._data.height,
                    this._data.styles.background
                )
            );
            this.children['background'].append(
                parts.basic.text(
                    null,
                    a*(this._data.width/this._data.verticalMarkings.length) + 0.5,
                    this._pointConverter(this._data.height, this._data.viewbox, -0.075),
                    this._data.verticalMarkings[a],
                    0,
                    this._data.styles.backgroundText,
                    0.1
                )
            );
        }

        //(the vertical line on the right)
        this.children['background'].append( parts.basic.line( null, this._data.width, 0, this._data.width, this._data.height, this._data.styles.background ) );
    };
    object.draw = function(Y, X=null){
        this.children['middleground'].innerHTML = '';

        for(var a = 0; a < Y.length-1; a++){
            var points = this._lineCorrecter({
                'x1': (a+0)*(this._data.width/(Y.length-1)),
                'x2': (a+1)*(this._data.width/(Y.length-1)),
                'y1': this._pointConverter(this._data.height, this._data.viewbox, Y[a+0]),
                'y2': this._pointConverter(this._data.height, this._data.viewbox, Y[a+1])
            }, this._data.height);

            if(points){
                this.children['middleground'].append(
                    parts.basic.line(
                        null,
                        points.x1, points.y1,
                        points.x2, points.y2,
                        this._data.styles.middleground
                    )
                );
            }
        }
    };


    return object;
};
this.grapher_periodicWave = function(
    id='grapher_periodicWave',
    x, y, width, height,
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //elements 
    var object = parts.basic.g(id, x, y);
        object._data = {};
        object._data.wave = {'sin':[],'cos':[]};
        object._data.resolution = 500;

    var grapher = parts.display.grapher(null, 0, 0, width, height, middlegroundStyle, backgroundStyle, backgroundTextStyle, backingStyle);
        object.append(grapher);


    //methods
    object.wave = function(a=null){
        if(a==null){
            while(this._data.wave.sin.length < this._data.wave.cos.length){ this._data.wave.sin.push(0); }
            while(this._data.wave.sin.length > this._data.wave.cos.length){ this._data.wave.cos.push(0); }
            for(var a = 0; a < this._data.wave['sin'].length; a++){
                if( !this._data.wave['sin'][a] ){ this._data.wave['sin'][a] = 0; }
                if( !this._data.wave['cos'][a] ){ this._data.wave['cos'][a] = 0; }
            }
            return this._data.wave;
        }
        this._data.wave = a;
    }
    object.waveElement = function(type, mux, a){
        if(a==null){return this._data.wave[type][mux];}
        this._data.wave[type][mux] = a;
    }
    object.resolution = function(a=null){
        if(a==null){return this._data.resolution;}
        this._data.resolution = a;
    }
    object.updateBackground = function(){
        grapher.viewbox( {'l':-1.1,'h':1.1} );
        grapher.horizontalMarkings([1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1]);
        grapher.verticalMarkings([0,'1/4','1/2','3/4']);
        grapher.drawBackground();
    };
    object.draw = function(){
        var data = [];
        var temp = 0;
        for(var a = 0; a <= this._data.resolution; a++){
            temp = 0;
            for(var b = 0; b < this._data.wave['sin'].length; b++){
                if(!this._data.wave['sin'][b]){this._data.wave['sin'][b]=0;} // cover missing elements
                temp += Math.sin(b*(2*Math.PI*(a/this._data.resolution)))*this._data.wave['sin'][b]; 
            }
            for(var b = 0; b < this._data.wave['cos'].length; b++){
                if(!this._data.wave['cos'][b]){this._data.wave['cos'][b]=0;} // cover missing elements
                temp += Math.cos(b*(2*Math.PI*(a/this._data.resolution)) )*this._data.wave['cos'][b]; 
            }
            data.push(temp);
        }

        grapher.draw( data );
    }
    object.reset = function(){
        this.wave({'sin':[],'cos':[]});
        this.resolution(500);
        this.updateBackground();
        this.draw();
    }


    object.reset();
    return object;
};
this.label = function(
    id='label',
    x, y, text,
    style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;',
    angle=0
){
    //elements 
    var object = parts.basic.g(id, x, y);
    var textElement = parts.basic.text(null, 0, 0, text, angle, style);
        object.appendChild(textElement);


    //methods
    object.text = function(a=null){
        if(a==null){return textElement.innerHTML;}
        textElement.innerHTML = a;
    }

    return object;
};
this.rastorReadout = function(
    id='rastorReadout',
    x, y, width, height,
    characterCount,
    xGappage=1, yGappage=1
){
    //values
        var values = {
            width: 5, height: 5,
            chars: {
                a: {
                    size:{x:5,y:5},
                    stamp:[
                        [0,0,0,0,0],
                        [0,1,1,0,0],
                        [1,0,0,1,0],
                        [1,0,0,1,0],
                        [0,1,1,0,1]
                    ]
                },
                s:{
                    size:{x:3,y:4},
                    stamp:[
                        [0,1,1],
                        [1,1,0],					 
                        [0,0,1],					 
                        [1,1,0]
                    ]
                }
            }
        };

    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //displays
        var displays = [];
        var widthPerDisplay = width/characterCount;
        for(var a = 0; a < characterCount; a++){
            var temp = {};
            temp.display = parts.display.rastorDisplay(null, a*widthPerDisplay, y, widthPerDisplay, height, values.width, values.height);
                object.appendChild(temp.display);
            temp.char = '';
            displays.push(temp);
        }

    
    //methods
        object.set = function(display,char){
            displays[display].char = char;

            var temp = values.chars[char].stamp;
            for(var y = 0; y < temp.length; y++){
                for(var x = 0; x < temp[y].length; x++){
                    temp[y][x] =  temp[y][x] == 1 ? [1,1,1] : [0,0,0];
                }
            }

            displays[display].display.reverseLoad(temp);
        }
        object.test = function(){
            console.log( displays );
            this.set(0,'a');
        };

    return object;
}
    }
    this.control = new function(){
this.rastorgrid = function(
    id='rastorgrid', 
    x, y, width, height,
    xcount, ycount,
    backingStyle = 'fill:rgba(200,200,200,1)',
    checkStyle = 'fill:rgba(150,150,150,1)',
    backingGlowStyle = 'fill:rgba(220,220,220,1)',
    checkGlowStyle = 'fill:rgba(220,220,220,1)',
){
    // elements
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);

    for(var y = 0; y < ycount; y++){
        for(var x = 0; x < xcount; x++){
            var temp = parts.control.checkbox_rect(y+'_'+x, x*(width/xcount), y*(height/ycount), width/xcount, height/ycount, 0, checkStyle, backingStyle, checkGlowStyle, backingGlowStyle);
            object.appendChild(temp);
            temp.onChange = function(){ object.onChange(object.get()); };
        }
    }


    //methods
    object.box = function(x,y){ return object.children[y+'_'+x]; };
    object.get = function(){
        var outputArray = [];

        for(var y = 0; y < ycount; y++){
            var temp = [];
            for(var x = 0; x < xcount; x++){
                temp.push(this.box(x,y).get());
            }
            outputArray.push(temp);
        }

        return outputArray;
    };
    object.set = function(value, update=true){
        for(var y = 0; y < ycount; y++){
            for(var x = 0; x < xcount; x++){
                object.box(x,y).set(value[y][x],false);
            }
        }
    };
    object.light = function(x,y,state){
        object.box(x,y).light(state);
    };


    //callback
    object.onChange = function(){};


    return object;
};
this.button_rect = function(
    id='button_rect',
    x, y, width, height, angle=0,
    upStyle = 'fill:rgba(200,200,200,1)',
    hoverStyle = 'fill:rgba(220,220,220,1)',
    downStyle = 'fill:rgba(180,180,180,1)',
    glowStyle = 'fill:rgba(220,200,220,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, upStyle);
        object.appendChild(rect);

    //interactivity
    rect.onmouseenter = function(){ __globals.utility.setStyle(this, hoverStyle); };
    rect.onmouseleave = function(){ __globals.utility.setStyle(this, upStyle);    };
    rect.onmousedown =  function(){ __globals.utility.setStyle(this, downStyle);  };
    rect.onmouseup =    function(){ this.onmouseleave();                          };
    rect.glow =         function(){ __globals.utility.setStyle(this, glowStyle) };

    //callbacks
    object.onmouseup =    function(){ /*console.log('mouseup');    */ };
    object.onmousedown =  function(){ /*console.log('mousedown');  */ };
    object.onmouseenter = function(){ /*console.log('mouseenter'); */ };
    object.onmouseleave = function(){ /*console.log('mouseleave'); */ };
    object.onmousemove =  function(){ /*console.log('mousemove');  */ };
    object.onclick =      function(){ /*console.log('click');      */ };
    object.ondblclick =   function(){ /*console.log('doubleclick');*/ };

    //methods
    object.click = function(glow=false){ this.onclick(); this.onmousedown(); if(glow){rect.glow();}else{rect.onmousedown();} setTimeout(function(){rect.onmouseup();this.onmouseup();},250); };
    object.hover = function(){ this.onmouseenter(); rect.onmouseenter(); };
    object.unhover = function(){this.onmouseleave(); rect.onmouseleave();};

    return object;
};
this.key_rect = function(
    id='key_rect',
    x, y, width, height, angle=0,
    style_off = 'fill:rgba(200,200,200,1)',
    style_press = 'fill:rgba(180,180,180,1)',
    style_glow = 'fill:rgba(220,200,220,1)',
    style_pressAndGlow = 'fill:rgba(200,190,200,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, style_off);
        object.appendChild(rect);

    //state
    object.state = 0;
    object.activateState = function(state){
        // 0 - off
        // 1 - pressed
        // 2 - glowing
        // 3 - pressed and glowing
        switch(state){
            case 0: __globals.utility.setStyle(rect, style_off); break;
            case 1: __globals.utility.setStyle(rect, style_press); break;
            case 2: __globals.utility.setStyle(rect, style_glow); break;
            case 3: __globals.utility.setStyle(rect, style_pressAndGlow); break;
            default: /*console.error('Unknown state reached:', state);*/ return; break;
        }
        object.state = state;
    };

    //interactivity
    rect.onmousedown =  function(){ object.press();   };
    rect.onmouseup =    function(){ object.release(); };
    rect.onmouseleave = function(){ object.release(); };
    rect.onmouseenter = function(event){ if(event.buttons == 1){object.press();} };

    //callbacks
    object.onkeyup =    function(){ /*console.log('mouseup');    */ };
    object.onkeydown =  function(){ /*console.log('mousedown');  */ };

    //methods;
    object.press =   function(){
        if( this.state%2 != 0 ){return;} //key already pressed 
        this.activateState(this.state+1);
        this.onkeydown();
    };
    object.release = function(){ 
        if( this.state%2 == 0 ){return;} //key not pressed 
        this.activateState(object.state-1); 
        this.onkeyup();
    };
    object.glow = function(){ this.activateState(this.state+2); };
    object.dim  = function(){ this.activateState(this.state-2); };

    return object;
};
this.checkbox_rect = function(
    id='checkbox_rect',
    x, y, width, height, angle=0,
    checkStyle = 'fill:rgba(150,150,150,1)',
    backingStyle = 'fill:rgba(200,200,200,1)',
    checkGlowStyle = 'fill:rgba(220,220,220,1)',
    backingGlowStyle = 'fill:rgba(220,220,220,1)',
){
    // elements 
    var object = parts.basic.g(id, x, y);
        object._checked = false;
        object.styles = {
            'check':checkStyle,
            'uncheck':'fill:rgba(0,0,0,0)',
            'backing':backingStyle
        };

    var rect = parts.basic.rect(null, 0, 0, width, height, angle, backingStyle);
        object.appendChild(rect);
    var checkrect = parts.basic.rect(null, width*0.1, height*0.1, width*0.8, height*0.8, angle, object.styles.uncheck);
        object.appendChild(checkrect);


    function updateGraphics(){
        if(object._checked){ __globals.utility.setStyle(checkrect,object.styles.check); }
        else{ __globals.utility.setStyle(checkrect,object.styles.uncheck); }
        __globals.utility.setStyle(rect,object.styles.backing);
    }

    //methods
    object.get = function(){ return object._checked; };
    object.set = function(value, update=true){
        object._checked = value;
        
        updateGraphics();

        if(update&&this.onChange){ this.onChange(value); }
    };
    object.light = function(state){
        if(state){
            object.styles.check = checkGlowStyle;
            object.styles.backing = backingGlowStyle;
        }else{
            object.styles.check = checkStyle;
            object.styles.backing = backingStyle;
        }
        updateGraphics();
    };


    //callback
    object.onChange = function(){};


    //mouse interaction
    object.onclick = function(event){
        object.set(!object.get());
    };


    return object;
};
this.slide_vertical = function(
    id='slide_vertical', 
    x, y, width, height,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    // elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._data = {
            'h':height,
            'handleSize':0.9
        };
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var slot = parts.basic.rect(null, width*0.45, height*0.05, width*0.1, height*0.9, 0, slotStyle);
        object.appendChild(slot);
    var handle = parts.basic.rect('handle', 0, 0, width, height*0.1, 0, handleStyle);
        object.appendChild(handle);


    //methods
    object.get = function(){ return this._value; };
    object.set = function(value, update=true){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        if(update&&this.onChange){ this.onChange(value); }
        this.children['handle'].y.baseVal.valueInSpecifiedUnits = value*this._data.h*this._data.handleSize;
    };


    //callback
    object.onChange = function(){};
    

    //mouse interaction
    object.ondblclick = function(){ this.set(0.5); };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];

        this.set( this.get() + move/(10*globalScale) );
    }; 
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this.get();
        __globals.svgElement.tempRef._data.initialY = event.y;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.h*__globals.svgElement.tempRef._data.handleSize;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = __globals.svgElement.tempRef._data.initialY-event.y;
            var divider = __globals.utility.getTransform(__globals.panes.global)[2];

            __globals.svgElement.tempRef.set( value - numerator/(divider*mux) );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef = null;
            this.onmousemove = null;
            this.onmouseleave = null;
            this.onmouseup = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };

    return object;
};
this.slide_horizontal = function(
    id='slide_horizontal', 
    x, y, width, height,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._data = {
            'w':width,
            'handleSize':0.9
        };
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var slot = parts.basic.rect(null, width*0.05, height*0.45, width*0.9, height*0.1, 0, slotStyle);
        object.appendChild(slot);
    var handle = parts.basic.rect('handle', 0, 0, width*0.1, height, 0, handleStyle);
        object.appendChild(handle);


    //methods
    object.get = function(){ return this._value; };
    object.set = function(value, update=true){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        if(update&&this.onChange){ this.onChange(value); }
        this.children['handle'].x.baseVal.valueInSpecifiedUnits = value*this._data.w*this._data.handleSize;
    };


    //callback
    object.onChange = function(){};

    
    //mouse interaction
    object.ondblclick = function(){ this.set(0.5); };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];

        this.set( this.get() + move/(10*globalScale) );
    }; 
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this.get();
        __globals.svgElement.tempRef._data.initialX = event.x;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.w*__globals.svgElement.tempRef._data.handleSize;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = __globals.svgElement.tempRef._data.initialX-event.x;
            var divider = __globals.utility.getTransform(__globals.panes.global)[2];

            __globals.svgElement.tempRef.set( value - numerator/(divider*mux) );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef = null;
            this.onmousemove = null;
            this.onmouseleave = null;
            this.onmouseup = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };

    return object;
};
this.dial_continuous = function(
    id='dial_continuous',
    x, y, r,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
    handleStyle = 'fill:rgba(200,200,200,1)',
    slotStyle = 'fill:rgba(50,50,50,1)',
    needleStyle = 'fill:rgba(250,100,100,1)',
    arcDistance=1.35,
    outerArcStyle='fill:none; stroke:none;',
){
    // elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._data = {
            'mux':r*4
        };

        //arc
        var points = 5;
        var pushDistance = 1.11;
        var arcPath = [];
        for(var a = 0; a < points; a++){
            var temp = __globals.utility.getCartesian(startAngle+a*(maxAngle/points),r*arcDistance);
            arcPath.push( [temp.x,temp.y] );
            var temp = __globals.utility.getCartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
            arcPath.push( [temp.x,temp.y] );
        }
        var temp = __globals.utility.getCartesian(startAngle+maxAngle,r*arcDistance);
        arcPath.push( [temp.x,temp.y] );
        var outerArc = parts.basic.path(id=null, path=arcPath, 'Q', outerArcStyle);
        object.appendChild(outerArc);

        //slot
        var slot = parts.basic.circle(null, 0, 0, r*1.1, 0, slotStyle);
            object.appendChild(slot);

        //handle
        var handle = parts.basic.circle(null, 0, 0, r, 0, handleStyle);
            object.appendChild(handle);

        //needle
        var needleWidth = r/5;
        var needleLength = r;
        var needle = parts.basic.rect('needle', 0, 0, needleLength, needleWidth, 0, needleStyle);
            needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
            needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
            object.appendChild(needle);


    // methods
    object.get = function(){ return this._value; };
    object.set = function(value, live=false){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        if(this.onChange){ this.onChange(value); }
        if(!live&&this.onRelease){ this.onRelease(value); }
        this.children['needle'].rotation(startAngle + maxAngle*value);
    };object.set(0);
    

    //callback
    object.onChange = function(){};
    object.onRelease = function(){};


    //mouse interaction
    object.ondblclick = function(){ this.set(0.5); };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];

        this.set( this.get() - move/(10*globalScale) );
    };
    object.onmousedown = function(event){
        __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
        __globals.svgElement.onmouseleave_old = __globals.svgElement.onmouseleave;
        __globals.svgElement.onmouseup_old = __globals.svgElement.onmouseup;

        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this.get();
        __globals.svgElement.tempRef._data.initialY = event.y;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.mux;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = event.y-__globals.svgElement.tempRef._data.initialY;
            var divider = __globals.utility.getTransform(__globals.panes.global)[2];

            __globals.svgElement.tempRef.set( value - numerator/(divider*mux), true );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef.set(this.tempRef.get());
            this.tempRef = null;

            __globals.svgElement.onmousemove = __globals.svgElement.onmousemove_old;
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseleave_old;
            __globals.svgElement.onmouseup = __globals.svgElement.onmouseup_old;

            __globals.svgElement.onmousemove_old = null;
            __globals.svgElement.onmouseleave_old = null;
            __globals.svgElement.onmouseup_old = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };


    return object;
};
this.slidePanel_horizontal = function(
    id='slidePanel_horizontal', 
    x, y, width, height,
    count,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    // elements
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    for(var a = 0; a < count; a++){
        var temp = parts.control.slide_horizontal( id+'_'+a, 0, a*(height/count), width, height/count, handleStyle, backingStyle, slotStyle );
        object.appendChild(temp);
        temp.onChange = function(){ object.onChange(object.get()); };
    }


    //methods
    object.slide = function(index){ return object.children[object.id+'_'+index]; };
    object.get = function(){
        var outputArray = [];
        for(var b = 0; b < count; b++){
            outputArray.push(this.slide(b).get());
        }
        return outputArray;
    };
    object.set = function(a, update=true){
        for(var b = 0; b < count; b++){
            this.slide(b).set(a[b],false);
        }

        if(update&&this.onChange){ this.onChange(a); }
    };
    object.onChange = function(){};

    return object;
};
this.slidePanel_vertical = function(
    id='slidePanel_vertical', 
    x, y, width, height,
    count,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    // elements
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    for(var a = 0; a < count; a++){
        var temp = parts.control.slide_vertical( id+'_'+a, a*(width/count), 0, width/count, height, handleStyle, backingStyle, slotStyle );
        object.appendChild(temp);
        temp.onChange = function(){ object.onChange(object.get()); };
    }


    //methods
    object.slide = function(index){ return object.children[object.id+'_'+index]; };
    object.get = function(){
        var outputArray = [];
        for(var b = 0; b < count; b++){
            outputArray.push(this.slide(b).get());
        }
        return outputArray;
    };
    object.set = function(a, update=true){
        for(var b = 0; b < count; b++){
            this.slide(b).set(a[b],false);
        }

        if(update&&this.onChange){ this.onChange(a); }
    };
    object.onChange = function(){};

    return object;
};
this.dial_discrete = function(
    id='dial_discrete',
    x, y, r,
    optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
    handleStyle = 'fill:rgba(200,200,200,1)',
    slotStyle = 'fill:rgba(50,50,50,1)',
    needleStyle = 'fill:rgba(250,100,100,1)',
    arcDistance=1.35,
    outerArcStyle='fill:none; stroke:none;',
){
    // elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._selection = 0;
        object._data = { 
            'optionCount':optionCount,
            'mux':r*4
        };

        //arc
        var points = 5;
        var pushDistance = 1.11;
        var arcPath = [];
        for(var a = 0; a < points; a++){
            var temp = __globals.utility.getCartesian(startAngle+a*(maxAngle/points),r*arcDistance);
            arcPath.push( [temp.x,temp.y] );
            var temp = __globals.utility.getCartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
            arcPath.push( [temp.x,temp.y] );
        }
        var temp = __globals.utility.getCartesian(startAngle+maxAngle,r*arcDistance);
        arcPath.push( [temp.x,temp.y] );
        var outerArc = parts.basic.path(id=null, path=arcPath, 'Q', outerArcStyle);
        object.appendChild(outerArc);

        //slot
        var slot = parts.basic.circle(null, 0, 0, r*1.1, 0, slotStyle);
            object.appendChild(slot);

        //handle
        var handle = parts.basic.circle(null, 0, 0, r, 0, handleStyle);
            object.appendChild(handle);

        //needle
        var needleWidth = 2.5;
        var needleLength = 12;
        var needle = parts.basic.rect('needle', 0, 0, needleLength, needleWidth, 0, needleStyle);
            needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
            needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
            object.appendChild(needle);


    //methods
    object.select = function(a=null, update=true){
        if(a==null){return this._selection;}

        a = (a>this._data.optionCount-1 ? this._data.optionCount-1 : a);
        a = (a<0 ? 0 : a);

        this._selection = a;
        this._set( a/(this._data.optionCount-1) );
        if(update&&this.onChange){ this.onChange(a); }
    };
    object._get = function(){ return this._value; };
    object._set = function(value){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        this.children['needle'].rotation(startAngle + maxAngle*value);
    };object._set(0);
  

    //callback
    object.onChange = function(){};


    //mouse interaction
    object.ondblclick = function(){ this.select( Math.floor(optionCount/2) ); /*this._set(0.5);*/ };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];

        if(!object.onwheel.acc){object.onwheel.acc=0;}
        object.onwheel.acc += move/globalScale;
        if( Math.abs(object.onwheel.acc) >= 1 ){
            this.select( this.select()-1*Math.sign(object.onwheel.acc) );
            object.onwheel.acc = 0;
        }
    };
    object.onmousedown = function(event){
        __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
        __globals.svgElement.onmouseleave_old = __globals.svgElement.onmouseleave;
        __globals.svgElement.onmouseup_old = __globals.svgElement.onmouseup;

        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this._get();
        __globals.svgElement.tempRef._data.initialY = event.y;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.mux;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = event.y-__globals.svgElement.tempRef._data.initialY;
            var divider = __globals.utility.getTransform(__globals.panes.global)[2];

            __globals.svgElement.tempRef.select(
                Math.round(
                    (__globals.svgElement.tempRef._data.optionCount-1)*(value - numerator/(divider*mux))
                ) 
            );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef = null;
            
            __globals.svgElement.onmousemove = __globals.svgElement.onmousemove_old;
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseleave_old;
            __globals.svgElement.onmouseup = __globals.svgElement.onmouseup_old;

            __globals.svgElement.onmousemove_old = null;
            __globals.svgElement.onmouseleave_old = null;
            __globals.svgElement.onmouseup_old = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };


  return object;
};
    }
    this.audio = new function(){
this.synthesizer = function(
    context,
    type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, attack=0.01, release=0.1, detune=0, octave=0
){
    //components
    var mainOut = context.createGain();
        mainOut.gain.value = gain;

    //live oscillators
    var liveOscillators = {};

    //options
    this.type = function(a){if(a==null){return type;}type=a;};
    this.periodicWave = function(a){if(a==null){return periodicWave;}periodicWave=a;};
    this.gain = function(a){if(a==null){return mainOut.gain.value;}mainOut.gain.value=a;};
    this.attack = function(a){if(a==null){return attack;}attack=a;};
    this.release = function(a){if(a==null){return release;}release=a;};
    this.detune = function(a){if(a==null){return detune;}detune=a;};
    this.octave = function(a){if(a==null){return octave;}octave=a;};

    //output node
    this.out = function(){return mainOut;}

    //oscillator generator
    function makeOSC(
        context, connection, midiNumber,
        type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
        gain=1, attack=0.01, release=0.1, detune=0, octave=0
    ){
        return new function(){
            this.generator = context.createOscillator();
                if(type == 'custom'){ 
                    this.generator.setPeriodicWave( 
                        context.createPeriodicWave(new Float32Array(periodicWave.sin),new Float32Array(periodicWave.cos))
                    ); 
                }else{ this.generator.type = type; }
                this.generator.frequency.value = __globals.audio.midiNumber_frequency(midiNumber,octave);
                this.generator.detune.value = detune;
                this.generator.start(0);

            this.gain = context.createGain();
                this.generator.connect(this.gain);
                this.gain.gain.value = 0;
                this.gain.gain.setTargetAtTime(gain, context.currentTime, attack/10);
                this.gain.connect(connection);

            this.changeVelocity = function(a){
                this.gain.gain.setTargetAtTime(a, context.currentTime, attack/10);
            };
            this.stop = function(){
                this.gain.gain.setTargetAtTime(0, context.currentTime, release/10);
                setTimeout(function(that){
                    that.gain.disconnect(); 
                    that.generator.stop(); 
                    that.generator.disconnect(); 
                    that.gain=null; 
                    that.generator=null; 
                }, release*1000, this);
            };
        };
    }

    //functions
    this.perform = function(note){
        if( !liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
        else if( !liveOscillators[note.num] ){ 
            //create new tone
            liveOscillators[note.num] = makeOSC(context, mainOut, note.num, type, periodicWave, note.velocity, attack, release, detune, octave); 
        }
        else if( note.velocity == 0 ){ 
            //stop and destroy tone
            liveOscillators[note.num].stop();
            delete liveOscillators[note.num];
        }
        else{
            //adjust tone
            liveOscillators[note.num].changeVelocity(note.velocity);
        }
    };
    this.panic = function(){
        var OSCs = Object.keys(liveOscillators);
        for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
    };
};
    }
    this.dynamic = new function(){
this.cable = function(
    id=null, 
    x1=0, y1=0, x2=0, y2=0,
    style='fill:none; stroke:rgb(255,0,0); stroke-width:4;',
    activeStyle='fill:none; stroke:rgb(255,100,100); stroke-width:4;'
){
    //elements
    var object = parts.basic.g(id, x1, y1)
        object.points = [ [x1,y1],[x2,y2] ];
        object.styles = {
            'normal':style,
            'active':activeStyle
        };
    var line = parts.basic.path(null, path=[[x1,y1],[x2,y2]], 'L', style);
        object.appendChild(line);


    //methods
    object.activate = function(){ line.style = this.styles.active; };
    object.disactivate = function(){ line.style = this.styles.normal; };
    object.draw = function(x1, y1, x2, y2){
        this.points = [ [x1,y1],[x2,y2] ];
        line.path(this.points);
    };
    object.redraw = function(x1=null,y1=null,x2=null,y2=null){
        x1 = (x1 ? x1 : this.x1); y1 = (y1 ? y1 : this.y1);
        x2 = (x2 ? x2 : this.x2); y2 = (y2 ? y2 : this.y2);
        this.draw(x1, y1, x2, y2);
    };


    return object;
};
this.connectionNode_audio = function(
    id='connectionNode_audio', type=0, //input = 0, output = 1
    x, y, width, height, audioContext,
    style='fill:rgba(255, 220, 220,1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._type = 'audio';
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(242, 119, 84); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(242, 161, 138); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
        object._audioNode = audioContext.createAnalyser();
        object._portType = type; if(type!=0&&type!=1){type=0;}
    var rect = parts.basic.rect('tab', 0, 0, width, height, 0, style);
        object.appendChild(rect);


    //network functions
    object.onConnect = function(){};
    object.onDisconnect = function(){};


    //internal connections
    object.out = function(){return this._audioNode;};
    object.in = function(){return this._audioNode;};

    
    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if( !foreignObject._type ){return;}
        else if( foreignObject._type != this._type ){ /*console.log('error: selected destination is not the same type as this node');*/ return; }
        else if( foreignObject._portType == this._portType ){ /*console.log('error: cannot connect', (this._portType==0?'input':'output'), 'node to', (foreignObject._portType==0?'input':'output'), 'node');*/ return; }
        else if( foreignObject == this ){ /*console.log('error: cannot connect node to itself');*/ return; }
        else if( foreignObject == this.foreignNode ){ /*console.log('error: attempting to make existing connection');*/ return; }

        this.disconnect();

        this.foreignNode = foreignObject;
        if(this._portType == 1){ this._audioNode.connect(this.foreignNode._audioNode); }
        this.foreignNode._receiveConnection(this);
        this._add_cable();

        this.onConnect();
    };
    object._receiveConnection = function(foreignObject){
        this.disconnect();

        this.foreignNode = foreignObject;
        if(this._portType == 1){ this._audioNode.connect(this.foreignNode._audioNode); }

        this.onConnect();
    };
    object.disconnect = function(){
        if( !this.foreignNode ){return;}

        this._remove_cable();
        this.foreignNode._receiveDisconnection();
        if(this._portType == 1){ this._audioNode.disconnect(this.foreignNode._audioNode); }
        this.foreignNode = null;

        this.onDisconnect();
    };
    object._receiveDisconnection = function(){
        if(this._portType == 1){ this._audioNode.disconnect(this.foreignNode._audioNode); }
        this.foreignNode = null;
        this.onDisconnect();
    };


    //mouse interface
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.onmouseup = function(event){
            var destination = document.elementFromPoint(event.x, event.y).parentElement;
            __globals.svgElement.tempRef.connectTo(destination);
            __globals.svgElement.tempRef = null;
            this.onmouseup = null;
        };
    };
    object.ondblclick = function(){
        this.disconnect();
    };


    //cabling
    object._add_cable = function(){
        this._cable = parts.dynamic.cable(null, 0, 0, 0, 0, this._cableStyle, this._cableActiveStyle);
        this.foreignNode._receive_cable(this._cable);
        __globals.utility.getPane(this).appendChild(this._cable); // <-- should probably make prepend
        this.draw();
    };
    object._receive_cable = function(_cable){
        this._cable = _cable;
    };
    object._remove_cable = function(){
        __globals.utility.getPane(this).removeChild(this._cable);
        this.foreignNode._lose_cable();
        this._cable = null;
    };
    object._lose_cable = function(){
        this._cable = null;
    };
    object.draw = function(){
        if( !object._cable ){return;}
        
        var t1 = __globals.utility.getCumulativeTransform(this);
        var t2 = __globals.utility.getCumulativeTransform(this.foreignNode);

        this._cable.draw( 
            t1[0] + this._boundary.width/2, 
            t1[1] + this._boundary.height/2, 
            t2[0] + this.foreignNode._boundary.width/2, 
            t2[1] + this.foreignNode._boundary.height/2
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.getCumulativeTransform(this);
        var t2 = __globals.utility.getCumulativeTransform(this.foreignNode);

        this._cable.redraw( 
            t1[0] + this._boundary.width/2, 
            t1[1] + this._boundary.height/2, 
            t2[0] + this.foreignNode._boundary.width/2, 
            t2[1] + this.foreignNode._boundary.height/2
        );
    };


    return object;
};
this.connectionNode_data = function(
    id='connectionNode_data',
    x, y, width, height, rotation=0,
    style='fill:rgba(220, 244, 255,1)',
    glowStyle='fill:rgba(244, 244, 255, 1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._type = 'data';
        object._rotation = rotation;
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(84, 146, 247); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(123, 168, 242); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
    var rect = parts.basic.rect('tab', 0, 0, width, height, rotation, style);
        object.appendChild(rect);


    //network functions
    object.send = function(address, data=null){
        object.activate();
        setTimeout(function(){
            if(!object){return;} 
            object.disactivate();
            if(object._cable){
                object._cable.disactivate();
                object.foreignNode.disactivate();
            }
        },100);

        if(!object.foreignNode){ /*console.log('send::error: node unconnected');*/ return; }
        object.foreignNode.receive(address, data);

        object._cable.activate();
        object.foreignNode.activate();
    };
    object.receive = function(address, data=null){};
    object.request = function(address){
        if(!this.foreignNode){ /*console.log('request::error: node unconnected');*/ return; }
        return this.foreignNode.give(address);
    };
    object.give = function(address){};
    object.onConnect = function(){};
    object.onDisconnect = function(){};


    //graphical
    object.activate = function(){ __globals.utility.setStyle(rect, glowStyle); };
    object.disactivate = function(){ __globals.utility.setStyle(rect, style); };


    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if( !foreignObject._type ){return;}
        else if( foreignObject._type != this._type ){ /*console.log('error: selected destination is not the same type as this node');*/ return; }
        else if( foreignObject == this ){ /*console.log('error: cannot connect node to itself');*/ return; }
        else if( foreignObject == this.foreignNode ){ /*console.log('error: attempting to make existing connection');*/ return; }

        this.disconnect();

        this.foreignNode = foreignObject;
        this.foreignNode._receiveConnection(this);
        this._add_cable();

        this.onConnect();
        this.foreignNode.onConnect();
    };
    object._receiveConnection = function(foreignObject){
        this.disconnect();

        this.foreignNode = foreignObject;
    };
    object.disconnect = function(){
        if( !this.foreignNode ){return;}

        this._remove_cable();
        this.foreignNode._receiveDisconnection();
        this.foreignNode = null;

        this.onDisconnect();
    };
    object._receiveDisconnection = function(){
        this.foreignNode = null;
        this.onDisconnect();
    };


    //mouse interface
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.onmouseup = function(event){
            var destination = document.elementFromPoint(event.x, event.y).parentElement;
            __globals.svgElement.tempRef.connectTo(destination);
            __globals.svgElement.tempRef = null;
            this.onmouseup = null;
        };
    };
    object.ondblclick = function(){
        this.disconnect();
    };


    //cabling
    object._add_cable = function(){
        this._cable = parts.dynamic.cable(null, 0, 0, 0, 0, this._cableStyle, this._cableActiveStyle);
        this.foreignNode._receive_cable(this._cable);
        __globals.utility.getPane(this).appendChild(this._cable); // <-- should probably make prepend
        this.draw();
    };
    object._receive_cable = function(_cable){
        this._cable = _cable;
    };
    object._remove_cable = function(){
        __globals.utility.getPane(this).removeChild(this._cable);
        this.foreignNode._lose_cable();
        this._cable = null;
    };
    object._lose_cable = function(){
        this._cable = null;
    };
    object.draw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.getCumulativeTransform(this);
        var t2 = __globals.utility.getCumulativeTransform(this.foreignNode);
        var center_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var center_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = __globals.utility.getPolar(center_local.x,center_local.y);
            temp.ang += this._rotation;
            center_local = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = __globals.utility.getPolar(center_foreign.x,center_foreign.y);
            temp.ang += this.foreignNode._rotation;
            center_foreign = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1[0] + center_local.x,
            t1[1] + center_local.y, 
            t2[0] + center_foreign.x,
            t2[1] + center_foreign.y
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.getCumulativeTransform(this);
        var t2 = __globals.utility.getCumulativeTransform(this.foreignNode);
        var center_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var center_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = __globals.utility.getPolar(center_local.x,center_local.y);
            temp.ang += this._rotation;
            center_local = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = __globals.utility.getPolar(center_foreign.x,center_foreign.y);
            temp.ang += this.foreignNode._rotation;
            center_foreign = __globals.utility.getCartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1[0] + center_local.x,
            t1[1] + center_local.y, 
            t2[0] + center_foreign.x,
            t2[1] + center_foreign.y
        );
    };


    return object;
};
    }
};

            // //printing of all the global functions
            // console.log( 'globals', __globals ); 
            // for(var a = 0; a < Object.keys(__globals).length; a++){
            //     console.log('\t', Object.keys(__globals)[a]);
            //     for(var b = 0; b < Object.keys(__globals[Object.keys(__globals)[a]]).length; b++){
            //         console.log('\t\t', Object.keys(__globals[Object.keys(__globals)[a]])[b] );
            //     }
            // }
            // console.log(' ');     

            // //printing of all the parts
            // console.log( 'parts', parts );            
            // for(var a = 0; a < Object.keys(parts).length; a++){
            //     console.log('\t', Object.keys(parts)[a]);
            //     for(var b = 0; b < Object.keys(parts[Object.keys(parts)[a]]).length; b++){
            //         console.log('\t\t', Object.keys(parts[Object.keys(parts)[a]])[b] );
            //     }
            // }
            // console.log(' ');

function uploadData(callback){
	var i = document.createElement('input');
	i.type = 'file'; i.id = '_global_metasophiea.com/code/js/liveEdit/loadsave.js';
	i.setAttribute('onchange',''+
		'var f = new FileReader();'+
		'f.readAsBinaryString(this.files[0]);'+
		'f.onloadend = function(){'+callback.name+'(f.result); document.body.removeChild(document.getElementById("'+i.id+'"));}'+
	'');

	document.body.appendChild(i);
	i.click();
}

function downloadData(name,type,data){
	if(!name || !type || !data){console.error('cannot save with missing information'); return;}

	var a = document.createElement('a');
	var file = new Blob([data]);
	a.href = URL.createObjectURL(file);
	a.download = name+'.'+type;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

// https://github.com/Tonejs/MidiConvert
// https://tonejs.github.io/MidiConvert/build/MidiConvert.js
//      MidiConvert.parse(t){return(new s.a).decode(t)}
//          MidiConvert.parse(rawFileData)
//      MidiConvert.load(t,e){var n=(new s.a).load(t);return e&&n.then(e),n}
//          MidiConvert.load('path/to/midi.mid',callback)
//      MidiConvert.create(){return new s.a}
//          creates a blank MidiConvert midi data structure which one can populate
//      MidiConvert.fromJSON(t,e){var n=(new s.a).load(t);return e&&n.then(e),n}



!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MidiConvert=e():t.MidiConvert=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=7)}([function(t,e,n){"use strict";n.d(e,"a",function(){return r}),n.d(e,"b",function(){return i}),n.d(e,"c",function(){return a});var r=["acoustic grand piano","bright acoustic piano","electric grand piano","honky-tonk piano","electric piano 1","electric piano 2","harpsichord","clavi","celesta","glockenspiel","music box","vibraphone","marimba","xylophone","tubular bells","dulcimer","drawbar organ","percussive organ","rock organ","church organ","reed organ","accordion","harmonica","tango accordion","acoustic guitar (nylon)","acoustic guitar (steel)","electric guitar (jazz)","electric guitar (clean)","electric guitar (muted)","overdriven guitar","distortion guitar","guitar harmonics","acoustic bass","electric bass (finger)","electric bass (pick)","fretless bass","slap bass 1","slap bass 2","synth bass 1","synth bass 2","violin","viola","cello","contrabass","tremolo strings","pizzicato strings","orchestral harp","timpani","string ensemble 1","string ensemble 2","synthstrings 1","synthstrings 2","choir aahs","voice oohs","synth voice","orchestra hit","trumpet","trombone","tuba","muted trumpet","french horn","brass section","synthbrass 1","synthbrass 2","soprano sax","alto sax","tenor sax","baritone sax","oboe","english horn","bassoon","clarinet","piccolo","flute","recorder","pan flute","blown bottle","shakuhachi","whistle","ocarina","lead 1 (square)","lead 2 (sawtooth)","lead 3 (calliope)","lead 4 (chiff)","lead 5 (charang)","lead 6 (voice)","lead 7 (fifths)","lead 8 (bass + lead)","pad 1 (new age)","pad 2 (warm)","pad 3 (polysynth)","pad 4 (choir)","pad 5 (bowed)","pad 6 (metallic)","pad 7 (halo)","pad 8 (sweep)","fx 1 (rain)","fx 2 (soundtrack)","fx 3 (crystal)","fx 4 (atmosphere)","fx 5 (brightness)","fx 6 (goblins)","fx 7 (echoes)","fx 8 (sci-fi)","sitar","banjo","shamisen","koto","kalimba","bag pipe","fiddle","shanai","tinkle bell","agogo","steel drums","woodblock","taiko drum","melodic tom","synth drum","reverse cymbal","guitar fret noise","breath noise","seashore","bird tweet","telephone ring","helicopter","applause","gunshot"],i=["piano","chromatic percussion","organ","guitar","bass","strings","ensemble","brass","reed","pipe","synth lead","synth pad","synth effects","ethnic","percussive","sound effects"],a={0:"standard kit",8:"room kit",16:"power kit",24:"electronic kit",25:"tr-808 kit",32:"jazz kit",40:"brush kit",48:"orchestra kit",56:"sound fx kit"}},function(t,e,n){"use strict";function r(t){return t.replace(/\u0000/g,"")}function i(t,e){return 60/e.bpm*(t/e.PPQ)}function a(t){return"number"==typeof t}function o(t){return"string"==typeof t}function s(t){return["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][t%12]+(Math.floor(t/12)-1)}e.b=r,e.a=i,e.c=a,n.d(e,"d",function(){return u}),e.e=s,n.d(e,"f",function(){return c});var u=function(){var t=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i;return function(e){return o(e)&&t.test(e)}}(),c=function(){var t=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,e={cbb:-2,cb:-1,c:0,"c#":1,cx:2,dbb:0,db:1,d:2,"d#":3,dx:4,ebb:2,eb:3,e:4,"e#":5,ex:6,fbb:3,fb:4,f:5,"f#":6,fx:7,gbb:5,gb:6,g:7,"g#":8,gx:9,abb:7,ab:8,a:9,"a#":10,ax:11,bbb:9,bb:10,b:11,"b#":12,bx:13};return function(n){var r=t.exec(n),i=r[1],a=r[2];return e[i.toLowerCase()]+12*(parseInt(a)+1)}}()},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return h});var i=n(11),a=(n.n(i),n(10)),o=(n.n(a),n(1)),s=n(9),u=n(5),c=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),h=function(){function t(){r(this,t),this.header={bpm:120,timeSignature:[4,4],PPQ:480},this.tracks=[]}return c(t,null,[{key:"fromJSON",value:function(e){var n=new t;return n.header=e.header,e.tracks.forEach(function(t){var e=s.a.fromJSON(t);n.tracks.push(e)}),n}}]),c(t,[{key:"load",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET";return new Promise(function(i,a){var o=new XMLHttpRequest;o.open(r,t),o.responseType="arraybuffer",o.addEventListener("load",function(){4===o.readyState&&200===o.status?i(e.decode(o.response)):a(o.status)}),o.addEventListener("error",a),o.send(n)}).catch(function(t){console.log(t)})}},{key:"decode",value:function(t){var e=this;if(t instanceof ArrayBuffer){var r=new Uint8Array(t);t=String.fromCharCode.apply(null,r)}var a=i(t);return this.header=n.i(u.a)(a),this.tracks=[],a.tracks.forEach(function(t,n){var r=new s.a;r.id=n,e.tracks.push(r);var i=0;t.forEach(function(t){i+=o.a(t.deltaTime,e.header),"meta"===t.type&&"trackName"===t.subtype?r.name=o.b(t.text):"noteOn"===t.subtype?(r.noteOn(t.noteNumber,i,t.velocity/127),-1===r.channelNumber&&(r.channelNumber=t.channel)):"noteOff"===t.subtype?r.noteOff(t.noteNumber,i):"controller"===t.subtype&&t.controllerType?r.cc(t.controllerType,i,t.value/127):"meta"===t.type&&"instrumentName"===t.subtype?r.instrument=t.text:"channel"===t.type&&"programChange"===t.subtype&&(r.patch(t.programNumber),r.channelNumber=t.channel)}),e.header.name||r.length||!r.name||(e.header.name=r.name)}),this}},{key:"encode",value:function(){var t=this,e=new a.File({ticks:this.header.PPQ}),n=this.tracks.filter(function(t){return!t.length})[0];if(this.header.name&&(!n||n.name!==this.header.name)){e.addTrack().addEvent(new a.MetaEvent({time:0,type:a.MetaEvent.TRACK_NAME,data:this.header.name}))}return this.tracks.forEach(function(n){var r=e.addTrack();r.setTempo(t.bpm),n.name&&r.addEvent(new a.MetaEvent({time:0,type:a.MetaEvent.TRACK_NAME,data:n.name})),n.encode(r,t.header)}),e.toBytes()}},{key:"toArray",value:function(){for(var t=this.encode(),e=new Array(t.length),n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}},{key:"toJSON",value:function(){var t={header:this.header,startTime:this.startTime,duration:this.duration,tracks:(this.tracks||[]).map(function(t){return t.toJSON()})};return t.header.name||(t.header.name=""),t}},{key:"track",value:function(t){var e=new s.a(t);return this.tracks.push(e),e}},{key:"get",value:function(t){return o.c(t)?this.tracks[t]:this.tracks.find(function(e){return e.name===t})}},{key:"slice",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.duration,r=new t;return r.header=this.header,r.tracks=this.tracks.map(function(t){return t.slice(e,n)}),r}},{key:"startTime",get:function(){var t=this.tracks.map(function(t){return t.startTime});return t.length?Math.min.apply(Math,t)||0:0}},{key:"bpm",get:function(){return this.header.bpm},set:function(t){var e=this.header.bpm;this.header.bpm=t;var n=e/t;this.tracks.forEach(function(t){return t.scale(n)})}},{key:"timeSignature",get:function(){return this.header.timeSignature},set:function(t){this.header.timeSignature=t}},{key:"duration",get:function(){var t=this.tracks.map(function(t){return t.duration});return t.length?Math.max.apply(Math,t)||0:0}}]),t}()},function(t,e,n){"use strict";function r(t,e){var n=0,r=t.length,i=r;if(r>0&&t[r-1].time<=e)return r-1;for(;n<i;){var a=Math.floor(n+(i-n)/2),o=t[a],s=t[a+1];if(o.time===e){for(var u=a;u<t.length;u++){t[u].time===e&&(a=u)}return a}if(o.time<e&&s.time>e)return a;o.time>e?i=a:o.time<e&&(n=a+1)}return-1}function i(t,e){if(t.length){var n=r(t,e.time);t.splice(n+1,0,e)}else t.push(e)}n.d(e,"a",function(){return i})},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return o});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a={1:"modulationWheel",2:"breath",4:"footController",5:"portamentoTime",7:"volume",8:"balance",10:"pan",64:"sustain",65:"portamentoTime",66:"sostenuto",67:"softPedal",68:"legatoFootswitch",84:"portamentoContro"},o=function(){function t(e,n,i){r(this,t),this.number=e,this.time=n,this.value=i}return i(t,[{key:"name",get:function(){if(a.hasOwnProperty(this.number))return a[this.number]}}]),t}()},function(t,e,n){"use strict";function r(t){for(var e={PPQ:t.header.ticksPerBeat},n=0;n<t.tracks.length;n++)for(var r=t.tracks[n],i=0;i<r.length;i++){var a=r[i];"meta"===a.type&&("timeSignature"===a.subtype?e.timeSignature=[a.numerator,a.denominator]:"setTempo"===a.subtype&&(e.bpm||(e.bpm=6e7/a.microsecondsPerBeat)))}return e.bpm=e.bpm||120,e}n.d(e,"a",function(){return r})},function(t,e,n){"use strict";function r(t,e){for(var n=0;n<t.length;n++){var r=t[n],i=e[n];if(r.length>i)return!0}return!1}function i(t,e,n){for(var r=0,i=1/0,a=0;a<t.length;a++){var o=t[a],s=e[a];o[s]&&o[s].time<i&&(r=a,i=o[s].time)}n[r](t[r][e[r]]),e[r]+=1}function a(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];for(var a=e.filter(function(t,e){return e%2==0}),o=new Uint32Array(a.length),s=e.filter(function(t,e){return e%2==1});r(a,o);)i(a,o,s)}n.d(e,"a",function(){return a})},function(t,e,n){"use strict";function r(t){return(new s.a).decode(t)}function i(t,e){var n=(new s.a).load(t);return e&&n.then(e),n}function a(){return new s.a}function o(t){return s.a.fromJSON(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.parse=r,e.load=i,e.create=a,e.fromJSON=o;var s=n(2),u=n(0);n.d(e,"instrumentByPatchID",function(){return u.a}),n.d(e,"instrumentFamilyByID",function(){return u.b}),n.d(e,"drumKitByPatchID",function(){return u.c})},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return o});var i=n(1),a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;if(r(this,t),i.c(e))this.midi=e;else{if(!i.d(e))throw new Error("the midi value must either be in Pitch Notation (e.g. C#4) or a midi value");this.name=e}this.time=n,this.duration=a,this.velocity=o}return a(t,null,[{key:"fromJSON",value:function(e){return new t(e.midi,e.time,e.duration,e.velocity)}}]),a(t,[{key:"match",value:function(t){return i.c(t)?this.midi===t:i.d(t)?this.name.toLowerCase()===t.toLowerCase():void 0}},{key:"toJSON",value:function(){return{name:this.name,midi:this.midi,time:this.time,velocity:this.velocity,duration:this.duration}}},{key:"name",get:function(){return i.e(this.midi)},set:function(t){this.midi=i.f(t)}},{key:"noteOn",get:function(){return this.time},set:function(t){this.time=t}},{key:"noteOff",get:function(){return this.time+this.duration},set:function(t){this.duration=t-this.time}}]),t}()},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,"a",function(){return h});var i=n(3),a=n(4),o=n(6),s=n(8),u=n(0),c=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),h=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:-1;r(this,t),this.name=e,this.channelNumber=i,this.notes=[],this.controlChanges={},this.instrumentNumber=n}return c(t,null,[{key:"fromJSON",value:function(e){var n=new t(e.name,e.instrumentNumber,e.channelNumber);return n.id=e.id,e.notes&&e.notes.forEach(function(t){var e=s.a.fromJSON(t);n.notes.push(e)}),e.controlChanges&&(n.controlChanges=e.controlChanges),n}}]),c(t,[{key:"note",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,o=new s.a(t,e,r,a);return n.i(i.a)(this.notes,o),this}},{key:"noteOn",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=new s.a(t,e,0,r);return n.i(i.a)(this.notes,a),this}},{key:"noteOff",value:function(t,e){for(var n=0;n<this.notes.length;n++){var r=this.notes[n];if(r.match(t)&&0===r.duration){r.noteOff=e;break}}return this}},{key:"cc",value:function(t,e,r){this.controlChanges.hasOwnProperty(t)||(this.controlChanges[t]=[]);var o=new a.a(t,e,r);return n.i(i.a)(this.controlChanges[t],o),this}},{key:"patch",value:function(t){return this.instrumentNumber=t,this}},{key:"channel",value:function(t){return this.channelNumber=t,this}},{key:"scale",value:function(t){return this.notes.forEach(function(e){e.time*=t,e.duration*=t}),this}},{key:"slice",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.duration,r=Math.max(this.notes.findIndex(function(t){return t.time>=e}),0),i=this.notes.findIndex(function(t){return t.noteOff>=n})+1,a=new t(this.name);return a.notes=this.notes.slice(r,i),a.notes.forEach(function(t){return t.time=t.time-e}),a}},{key:"encode",value:function(t,e){function r(t){var e=Math.floor(i*t),n=Math.max(e-a,0);return a=e,n}var i=e.PPQ/(60/e.bpm),a=0,s=Math.max(0,this.channelNumber);-1!==this.instrumentNumber&&t.instrument(s,this.instrumentNumber),n.i(o.a)(this.noteOns,function(e){t.addNoteOn(s,e.name,r(e.time),Math.floor(127*e.velocity))},this.noteOffs,function(e){t.addNoteOff(s,e.name,r(e.time))})}},{key:"toJSON",value:function(){var t={startTime:this.startTime,duration:this.duration,length:this.length,notes:[],controlChanges:{}};return void 0!==this.id&&(t.id=this.id),t.name=this.name,-1!==this.instrumentNumber&&(t.instrumentNumber=this.instrumentNumber,t.instrument=this.instrument,t.instrumentFamily=this.instrumentFamily),-1!==this.channelNumber&&(t.channelNumber=this.channelNumber,t.isPercussion=this.isPercussion),this.notes.length&&(t.notes=this.notes.map(function(t){return t.toJSON()})),Object.keys(this.controlChanges).length&&(t.controlChanges=this.controlChanges),t}},{key:"noteOns",get:function(){var t=[];return this.notes.forEach(function(e){t.push({time:e.noteOn,midi:e.midi,name:e.name,velocity:e.velocity})}),t}},{key:"noteOffs",get:function(){var t=[];return this.notes.forEach(function(e){t.push({time:e.noteOff,midi:e.midi,name:e.name})}),t}},{key:"length",get:function(){return this.notes.length}},{key:"startTime",get:function(){if(this.notes.length){return this.notes[0].noteOn}return 0}},{key:"duration",get:function(){if(this.notes.length){return this.notes[this.notes.length-1].noteOff}return 0}},{key:"instrument",get:function(){return this.isPercussion?u.c[this.instrumentNumber]:u.a[this.instrumentNumber]},set:function(t){var e=u.a.indexOf(t);-1!==e&&(this.instrumentNumber=e)}},{key:"isPercussion",get:function(){return[9,10].includes(this.channelNumber)}},{key:"instrumentFamily",get:function(){return this.isPercussion?"drums":u.b[Math.floor(this.instrumentNumber/8)]}}]),t}()},function(t,e,n){(function(t){var n={};!function(t){var e=t.DEFAULT_VOLUME=90,n=(t.DEFAULT_DURATION=128,t.DEFAULT_CHANNEL=0,{midi_letter_pitches:{a:21,b:23,c:12,d:14,e:16,f:17,g:19},midiPitchFromNote:function(t){var e=/([a-g])(#+|b+)?([0-9]+)$/i.exec(t),r=e[1].toLowerCase(),i=e[2]||"";return 12*parseInt(e[3],10)+n.midi_letter_pitches[r]+("#"==i.substr(0,1)?1:-1)*i.length},ensureMidiPitch:function(t){return"number"!=typeof t&&/[^0-9]/.test(t)?n.midiPitchFromNote(t):parseInt(t,10)},midi_pitches_letter:{12:"c",13:"c#",14:"d",15:"d#",16:"e",17:"f",18:"f#",19:"g",20:"g#",21:"a",22:"a#",23:"b"},midi_flattened_notes:{"a#":"bb","c#":"db","d#":"eb","f#":"gb","g#":"ab"},noteFromMidiPitch:function(t,e){var r,i=0,a=t,e=e||!1;return t>23&&(i=Math.floor(t/12)-1,a=t-12*i),r=n.midi_pitches_letter[a],e&&r.indexOf("#")>0&&(r=n.midi_flattened_notes[r]),r+i},mpqnFromBpm:function(t){var e=Math.floor(6e7/t),n=[];do{n.unshift(255&e),e>>=8}while(e);for(;n.length<3;)n.push(0);return n},bpmFromMpqn:function(t){var e=t;if(void 0!==t[0]){e=0;for(var n=0,r=t.length-1;r>=0;++n,--r)e|=t[n]<<r}return Math.floor(6e7/t)},codes2Str:function(t){return String.fromCharCode.apply(null,t)},str2Bytes:function(t,e){if(e)for(;t.length/2<e;)t="0"+t;for(var n=[],r=t.length-1;r>=0;r-=2){var i=0===r?t[r]:t[r-1]+t[r];n.unshift(parseInt(i,16))}return n},translateTickTime:function(t){for(var e=127&t;t>>=7;)e<<=8,e|=127&t|128;for(var n=[];;){if(n.push(255&e),!(128&e))break;e>>=8}return n}}),r=function(t){if(!this)return new r(t);!t||null===t.type&&void 0===t.type||null===t.channel&&void 0===t.channel||null===t.param1&&void 0===t.param1||(this.setTime(t.time),this.setType(t.type),this.setChannel(t.channel),this.setParam1(t.param1),this.setParam2(t.param2))};r.NOTE_OFF=128,r.NOTE_ON=144,r.AFTER_TOUCH=160,r.CONTROLLER=176,r.PROGRAM_CHANGE=192,r.CHANNEL_AFTERTOUCH=208,r.PITCH_BEND=224,r.prototype.setTime=function(t){this.time=n.translateTickTime(t||0)},r.prototype.setType=function(t){if(t<r.NOTE_OFF||t>r.PITCH_BEND)throw new Error("Trying to set an unknown event: "+t);this.type=t},r.prototype.setChannel=function(t){if(t<0||t>15)throw new Error("Channel is out of bounds.");this.channel=t},r.prototype.setParam1=function(t){this.param1=t},r.prototype.setParam2=function(t){this.param2=t},r.prototype.toBytes=function(){var t=[],e=this.type|15&this.channel;return t.push.apply(t,this.time),t.push(e),t.push(this.param1),void 0!==this.param2&&null!==this.param2&&t.push(this.param2),t};var i=function(t){if(!this)return new i(t);this.setTime(t.time),this.setType(t.type),this.setData(t.data)};i.SEQUENCE=0,i.TEXT=1,i.COPYRIGHT=2,i.TRACK_NAME=3,i.INSTRUMENT=4,i.LYRIC=5,i.MARKER=6,i.CUE_POINT=7,i.CHANNEL_PREFIX=32,i.END_OF_TRACK=47,i.TEMPO=81,i.SMPTE=84,i.TIME_SIG=88,i.KEY_SIG=89,i.SEQ_EVENT=127,i.prototype.setTime=function(t){this.time=n.translateTickTime(t||0)},i.prototype.setType=function(t){this.type=t},i.prototype.setData=function(t){this.data=t},i.prototype.toBytes=function(){if(!this.type)throw new Error("Type for meta-event not specified.");var t=[];if(t.push.apply(t,this.time),t.push(255,this.type),Array.isArray(this.data))t.push(this.data.length),t.push.apply(t,this.data);else if("number"==typeof this.data)t.push(1,this.data);else if(null!==this.data&&void 0!==this.data){t.push(this.data.length);var e=this.data.split("").map(function(t){return t.charCodeAt(0)});t.push.apply(t,e)}else t.push(0);return t};var a=function(t){if(!this)return new a(t);var e=t||{};this.events=e.events||[]};a.START_BYTES=[77,84,114,107],a.END_BYTES=[0,255,47,0],a.prototype.addEvent=function(t){return this.events.push(t),this},a.prototype.addNoteOn=a.prototype.noteOn=function(t,i,a,o){return this.events.push(new r({type:r.NOTE_ON,channel:t,param1:n.ensureMidiPitch(i),param2:o||e,time:a||0})),this},a.prototype.addNoteOff=a.prototype.noteOff=function(t,i,a,o){return this.events.push(new r({type:r.NOTE_OFF,channel:t,param1:n.ensureMidiPitch(i),param2:o||e,time:a||0})),this},a.prototype.addNote=a.prototype.note=function(t,e,n,r,i){return this.noteOn(t,e,r,i),n&&this.noteOff(t,e,n,i),this},a.prototype.addChord=a.prototype.chord=function(t,e,n,r){if(!Array.isArray(e)&&!e.length)throw new Error("Chord must be an array of pitches");return e.forEach(function(e){this.noteOn(t,e,0,r)},this),e.forEach(function(e,r){0===r?this.noteOff(t,e,n):this.noteOff(t,e)},this),this},a.prototype.setInstrument=a.prototype.instrument=function(t,e,n){return this.events.push(new r({type:r.PROGRAM_CHANGE,channel:t,param1:e,time:n||0})),this},a.prototype.setTempo=a.prototype.tempo=function(t,e){return this.events.push(new i({type:i.TEMPO,data:n.mpqnFromBpm(t),time:e||0})),this},a.prototype.toBytes=function(){var t=0,e=[],r=a.START_BYTES,i=a.END_BYTES,o=function(n){var r=n.toBytes();t+=r.length,e.push.apply(e,r)};this.events.forEach(o),t+=i.length;var s=n.str2Bytes(t.toString(16),4);return r.concat(s,e,i)};var o=function(t){if(!this)return new o(t);var e=t||{};if(e.ticks){if("number"!=typeof e.ticks)throw new Error("Ticks per beat must be a number!");if(e.ticks<=0||e.ticks>=32768||e.ticks%1!=0)throw new Error("Ticks per beat must be an integer between 1 and 32767!")}this.ticks=e.ticks||128,this.tracks=e.tracks||[]};o.HDR_CHUNKID="MThd",o.HDR_CHUNK_SIZE="\0\0\0",o.HDR_TYPE0="\0\0",o.HDR_TYPE1="\0",o.prototype.addTrack=function(t){return t?(this.tracks.push(t),this):(t=new a,this.tracks.push(t),t)},o.prototype.toBytes=function(){var t=this.tracks.length.toString(16),e=o.HDR_CHUNKID+o.HDR_CHUNK_SIZE;return parseInt(t,16)>1?e+=o.HDR_TYPE1:e+=o.HDR_TYPE0,e+=n.codes2Str(n.str2Bytes(t,2)),e+=String.fromCharCode(this.ticks/256,this.ticks%256),this.tracks.forEach(function(t){e+=n.codes2Str(t.toBytes())}),e},t.Util=n,t.File=o,t.Track=a,t.Event=r,t.MetaEvent=i}(n),void 0!==t&&null!==t?t.exports=n:void 0!==e&&null!==e?e=n:this.Midi=n}).call(e,n(12)(t))},function(t,e){function n(t){function e(t){var e=t.read(4),n=t.readInt32();return{id:e,length:n,data:t.read(n)}}var n;stream=r(t);var i=e(stream);if("MThd"!=i.id||6!=i.length)throw"Bad .mid file - header not found";var a=r(i.data),o=a.readInt16(),s=a.readInt16(),u=a.readInt16();if(32768&u)throw"Expressing time division in SMTPE frames is not supported yet";ticksPerBeat=u;for(var c={formatType:o,trackCount:s,ticksPerBeat:ticksPerBeat},h=[],f=0;f<c.trackCount;f++){h[f]=[];var d=e(stream);if("MTrk"!=d.id)throw"Unexpected chunk - expected MTrk, got "+d.id;for(var l=r(d.data);!l.eof();){var p=function(t){var e={};e.deltaTime=t.readVarInt();var r=t.readInt8();if(240==(240&r)){if(255==r){e.type="meta";var i=t.readInt8(),a=t.readVarInt();switch(i){case 0:if(e.subtype="sequenceNumber",2!=a)throw"Expected length for sequenceNumber event is 2, got "+a;return e.number=t.readInt16(),e;case 1:return e.subtype="text",e.text=t.read(a),e;case 2:return e.subtype="copyrightNotice",e.text=t.read(a),e;case 3:return e.subtype="trackName",e.text=t.read(a),e;case 4:return e.subtype="instrumentName",e.text=t.read(a),e;case 5:return e.subtype="lyrics",e.text=t.read(a),e;case 6:return e.subtype="marker",e.text=t.read(a),e;case 7:return e.subtype="cuePoint",e.text=t.read(a),e;case 32:if(e.subtype="midiChannelPrefix",1!=a)throw"Expected length for midiChannelPrefix event is 1, got "+a;return e.channel=t.readInt8(),e;case 47:if(e.subtype="endOfTrack",0!=a)throw"Expected length for endOfTrack event is 0, got "+a;return e;case 81:if(e.subtype="setTempo",3!=a)throw"Expected length for setTempo event is 3, got "+a;return e.microsecondsPerBeat=(t.readInt8()<<16)+(t.readInt8()<<8)+t.readInt8(),e;case 84:if(e.subtype="smpteOffset",5!=a)throw"Expected length for smpteOffset event is 5, got "+a;var o=t.readInt8();return e.frameRate={0:24,32:25,64:29,96:30}[96&o],e.hour=31&o,e.min=t.readInt8(),e.sec=t.readInt8(),e.frame=t.readInt8(),e.subframe=t.readInt8(),e;case 88:if(e.subtype="timeSignature",4!=a)throw"Expected length for timeSignature event is 4, got "+a;return e.numerator=t.readInt8(),e.denominator=Math.pow(2,t.readInt8()),e.metronome=t.readInt8(),e.thirtyseconds=t.readInt8(),e;case 89:if(e.subtype="keySignature",2!=a)throw"Expected length for keySignature event is 2, got "+a;return e.key=t.readInt8(!0),e.scale=t.readInt8(),e;case 127:return e.subtype="sequencerSpecific",e.data=t.read(a),e;default:return e.subtype="unknown",e.data=t.read(a),e}return e.data=t.read(a),e}if(240==r){e.type="sysEx";var a=t.readVarInt();return e.data=t.read(a),e}if(247==r){e.type="dividedSysEx";var a=t.readVarInt();return e.data=t.read(a),e}throw"Unrecognised MIDI event type byte: "+r}var s;0==(128&r)?(s=r,r=n):(s=t.readInt8(),n=r);var u=r>>4;switch(e.channel=15&r,e.type="channel",u){case 8:return e.subtype="noteOff",e.noteNumber=s,e.velocity=t.readInt8(),e;case 9:return e.noteNumber=s,e.velocity=t.readInt8(),0==e.velocity?e.subtype="noteOff":e.subtype="noteOn",e;case 10:return e.subtype="noteAftertouch",e.noteNumber=s,e.amount=t.readInt8(),e;case 11:return e.subtype="controller",e.controllerType=s,e.value=t.readInt8(),e;case 12:return e.subtype="programChange",e.programNumber=s,e;case 13:return e.subtype="channelAftertouch",e.amount=s,e;case 14:return e.subtype="pitchBend",e.value=s+(t.readInt8()<<7),e;default:throw"Unrecognised MIDI event type: "+u}}(l);h[f].push(p)}}return{header:c,tracks:h}}function r(t){function e(e){var n=t.substr(s,e);return s+=e,n}function n(){var e=(t.charCodeAt(s)<<24)+(t.charCodeAt(s+1)<<16)+(t.charCodeAt(s+2)<<8)+t.charCodeAt(s+3);return s+=4,e}function r(){var e=(t.charCodeAt(s)<<8)+t.charCodeAt(s+1);return s+=2,e}function i(e){var n=t.charCodeAt(s);return e&&n>127&&(n-=256),s+=1,n}function a(){return s>=t.length}function o(){for(var t=0;;){var e=i();if(!(128&e))return t+e;t+=127&e,t<<=7}}var s=0;return{eof:a,read:e,readInt32:n,readInt16:r,readInt8:i,readVarInt:o}}t.exports=function(t){return n(t)}},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}}])});

function internalizeMidi_v1_MidiConvert(filedata){
    function calculateTicksPerSecond(ticksPerMeasure, beatsPerSecond, timeSignature){
        return (ticksPerMeasure*beatsPerSecond)/timeSignature[0];
    }

    function sortedInsert(array,key,item){
        //figure out which half of the array it's going to be in
        if( array[Math.round(array.length/2)][key] > item[key] ){
            //check/insert from front
            var a = 0;
            while( array[a][key] <= item[key] ){ a++; }
            array.splice(a, 0, item);
        }else{
            //check/insert from back
            var a = array.length-1;
            while( array[a][key] > item[key] ){ a--; }
            array.splice(a+1, 0, item);
        }
    }

    function makeCommand(tick,commandName,data){
        return {'tick':tick, 'commandName':commandName, 'data':data};
    }

    function internalizeMidiTrack_v1_MidiConvert(track,ticksPerSecond){
        var output = [];
        
            output.push( makeCommand(0,'trackName',track.name==undefined?'':track.name) );
            output.push( makeCommand(0,'channel',track.channelNumber) );
            output.push( makeCommand(0,'instrumentNumber',track.instrumentNumber) );
            output.push( makeCommand(0,'instrumentName',track.instrument==undefined?'':track.instrument) );
            output.push( makeCommand(0,'instrumentFamily',track.instrumentFamily==undefined?'':track.instrumentFamily) );
            output.push( makeCommand(0,'isPercussion',track.isPercussion) );

            for(var a = 0; a < track.notes.length; a++){
                sortedInsert( output, 'tick', 
                    makeCommand(
                        ticksPerSecond*track.notes[a].time,
                        'note',
                        {'noteNumber':track.notes[a].midi,'velocity':track.notes[a].velocity}
                    )
                );
                sortedInsert( output, 'tick', 
                    makeCommand(
                        ticksPerSecond*track.notes[a].time+ticksPerSecond*track.notes[a].duration,
                        'note',
                        {'noteNumber':track.notes[a].midi,'velocity':0}
                    )
                );
            }

        return output;
    }

    function internalizeMidiArrangement_v1_MidiConvert(MidiConvert_arrangement){
        var output = {};
            output.arrangementName = '';
            output.control = [];
                output.control.push(makeCommand(0,'ticksPerMeasure',MidiConvert_arrangement.header.PPQ*4));
                output.control.push(makeCommand(0,'timeSignature',MidiConvert_arrangement.header.timeSignature));
                output.control.push(makeCommand(0,'beatsPerSecond',MidiConvert_arrangement.header.bpm/60));      
                output.control.push(makeCommand(0,'ticksPerSecond',calculateTicksPerSecond(MidiConvert_arrangement.header.PPQ*4, MidiConvert_arrangement.header.bpm/60, MidiConvert_arrangement.header.timeSignature)));
            output.tracks = [];
                for(var a = 0; a < MidiConvert_arrangement.tracks.length; a++){
                    output.tracks.push(internalizeMidiTrack_v1_MidiConvert(
                        MidiConvert_arrangement.tracks[a],
                        (MidiConvert_arrangement.header.PPQ*MidiConvert_arrangement.header.bpm)/(15*MidiConvert_arrangement.header.timeSignature[0])
                    ));
                }

        return output;
    }

    return internalizeMidiArrangement_v1_MidiConvert(MidiConvert.parse(filedata));
}
var midi_10014 = new Uint8Array([77,84,104,100,0,0,0,6,0,1,0,5,1,195,160,77,84,114,107,0,0,0,32,0,195,191,127,3,0,0,65,0,195,191,88,4,4,2,24,8,0,195,191,89,2,0,0,0,195,191,81,3,15,66,64,0,195,191,47,0,77,84,114,107,0,0,1,194,175,0,195,191,33,1,0,0,195,191,3,9,83,73,77,79,49,46,77,73,68,0,195,129,99,0,194,177,7,127,0,194,177,10,96,194,173,0,194,145,48,102,194,129,52,48,0,60,55,102,194,129,52,55,0,60,48,103,194,129,52,48,0,60,55,103,194,129,52,55,0,60,48,104,90,48,0,30,48,104,90,48,0,30,55,104,90,55,0,30,55,105,90,55,0,30,48,105,194,129,52,48,0,60,55,105,194,129,52,55,0,60,48,106,194,129,52,48,0,60,55,106,194,129,52,55,0,60,48,107,194,129,52,48,0,60,55,107,194,129,52,55,0,60,48,108,90,48,0,30,48,108,90,48,0,30,55,109,90,55,0,30,55,109,90,55,0,30,48,109,194,129,52,48,0,60,55,110,194,129,52,55,0,60,48,110,194,129,52,48,0,60,55,111,194,129,52,55,0,60,48,111,194,129,52,48,0,60,55,112,194,129,52,55,0,60,48,112,90,48,0,30,48,112,90,48,0,30,55,113,90,55,0,30,55,113,90,55,0,30,48,113,194,129,52,48,0,60,55,114,194,129,52,55,0,60,48,114,194,129,52,48,0,60,55,115,194,129,52,55,0,60,48,115,194,129,52,48,0,60,55,116,194,129,52,55,0,60,48,116,90,48,0,30,48,116,90,48,0,30,55,117,90,55,0,30,55,117,90,55,0,30,48,117,194,129,52,48,0,60,55,118,194,129,52,55,0,60,48,118,194,129,52,48,0,60,55,119,194,129,52,55,0,60,48,119,194,129,52,48,0,60,55,120,194,129,52,55,0,60,48,120,90,48,0,30,48,121,90,48,0,30,55,121,90,55,0,30,55,121,90,55,0,30,48,121,194,129,52,48,0,60,55,122,194,129,52,55,0,60,48,122,194,129,52,48,0,60,55,123,194,129,52,55,0,60,48,123,194,129,52,48,0,60,55,124,194,129,52,55,0,60,48,124,90,48,0,30,48,125,90,48,0,30,55,125,90,55,0,30,55,125,90,55,0,30,48,125,194,129,52,48,0,60,55,126,194,129,52,55,0,0,195,191,47,0,77,84,114,107,0,0,4,98,0,195,191,33,1,0,0,195,191,3,9,83,73,77,79,49,46,77,73,68,0,195,130,99,0,194,178,7,127,0,194,178,10,32,0,194,146,60,90,90,60,0,30,72,90,90,72,0,30,60,90,90,60,0,194,129,22,64,91,90,64,0,30,69,91,90,69,0,30,65,91,90,65,0,194,129,22,65,92,90,65,0,30,67,92,90,67,0,30,60,92,90,60,0,194,129,22,57,93,90,57,0,194,130,14,62,93,90,62,0,30,64,94,90,64,0,194,129,22,60,94,90,60,0,194,129,22,57,95,90,57,0,194,129,22,60,95,90,60,0,194,129,22,67,96,90,67,0,194,129,22,69,96,90,69,0,194,129,22,67,97,90,67,0,194,129,22,64,97,90,64,0,194,129,22,65,98,90,65,0,194,129,22,69,98,90,69,0,194,129,22,72,99,90,72,0,194,129,22,64,99,90,64,0,30,67,100,90,67,0,194,130,14,72,100,90,72,0,194,129,22,62,101,90,62,0,30,64,101,90,64,0,30,62,101,90,62,0,30,60,102,90,60,0,30,60,102,90,60,0,30,76,102,0,72,102,90,72,0,0,76,0,30,79,102,0,60,102,90,60,0,0,79,0,30,76,103,90,76,0,30,81,103,0,64,103,90,64,0,0,81,0,30,76,103,0,69,103,90,69,0,0,76,0,30,84,103,0,65,103,90,65,0,0,84,0,30,76,104,90,76,0,30,81,104,0,65,104,90,65,0,0,81,0,30,76,104,0,67,104,90,67,0,0,76,0,30,79,104,0,60,104,90,60,0,0,79,0,30,76,105,90,76,0,30,81,105,0,57,105,90,57,0,0,81,0,30,76,105,90,76,0,30,84,105,90,84,0,30,76,106,0,62,106,90,62,0,0,76,0,30,81,106,0,64,106,90,64,0,0,81,0,30,76,106,90,76,0,30,79,106,0,60,106,90,60,0,0,79,0,30,76,107,90,76,0,30,81,107,0,57,107,90,57,0,0,81,0,30,76,107,90,76,0,30,84,107,0,60,107,90,60,0,0,84,0,30,72,108,90,72,0,30,76,108,0,67,108,90,67,0,0,76,0,30,72,108,90,72,0,30,79,109,0,69,109,90,69,0,0,79,0,30,72,109,90,72,0,30,76,109,0,67,109,90,67,0,0,76,0,30,72,109,90,72,0,30,76,110,0,64,110,90,64,0,0,76,0,30,69,110,90,69,0,30,72,110,0,65,110,90,65,0,0,72,0,30,69,110,90,69,0,30,76,111,0,69,111,90,69,0,0,76,0,30,67,111,90,67,0,30,72,111,0,72,111,90,72,0,0,72,0,30,67,111,90,67,0,30,69,112,0,64,112,90,64,0,0,69,0,30,67,112,0,67,112,90,67,0,0,67,0,30,72,112,90,72,0,30,67,112,90,67,0,30,69,113,0,72,113,90,72,0,0,69,0,30,67,113,90,67,0,30,72,113,0,62,113,90,62,0,0,72,0,30,67,113,0,64,113,90,64,0,0,67,0,30,69,114,0,62,114,90,62,0,0,69,0,30,64,114,0,67,114,0,60,114,58,64,0,32,60,0,0,67,0,30,67,114,0,60,114,53,67,0,37,60,0,30,64,114,0,72,114,68,64,0,22,72,0,30,69,115,0,60,115,60,69,0,30,60,0,30,64,115,60,64,0,60,67,115,0,64,115,55,67,0,35,64,0,30,60,115,0,69,115,60,60,0,30,69,0,30,64,116,0,65,116,55,64,0,35,65,0,30,60,116,58,60,0,62,67,116,0,65,116,58,67,0,32,65,0,30,60,116,0,67,116,68,60,0,22,67,0,30,64,117,0,60,117,65,64,0,25,60,0,30,60,117,58,60,0,62,64,117,0,57,117,58,64,0,32,57,0,30,57,118,68,57,0,52,60,118,60,60,0,60,57,118,0,62,118,70,57,0,20,62,0,30,64,118,0,64,118,60,64,0,0,64,0,60,57,119,70,57,0,50,60,119,0,60,119,58,60,0,0,60,0,62,55,119,65,55,0,55,57,119,0,57,119,53,57,0,0,57,0,67,55,120,75,55,0,45,60,120,0,60,120,60,60,0,0,60,0,60,55,120,65,55,0,55,57,120,0,67,120,60,57,0,30,67,0,30,52,121,58,52,0,62,55,121,0,69,121,63,55,0,27,69,0,30,52,121,83,52,0,37,57,121,0,67,121,68,57,0,22,67,0,30,52,122,73,52,0,47,55,122,0,64,122,60,55,0,30,64,0,30,48,122,70,48,0,50,52,122,0,65,122,90,65,0,0,52,0,30,48,123,90,48,0,30,55,123,0,69,123,90,69,0,0,55,0,30,48,123,90,48,0,30,48,123,0,72,123,90,72,0,0,48,0,30,55,124,90,55,0,30,48,124,0,64,124,90,64,0,0,48,0,30,52,124,0,67,124,90,67,0,0,52,0,30,45,124,90,45,0,194,129,22,48,125,0,72,125,90,72,0,0,48,0,194,129,22,62,125,90,62,0,30,64,126,90,64,0,30,62,126,90,62,0,30,60,126,90,60,0,30,60,127,194,139,32,60,0,0,195,191,47,0,77,84,114,107,0,0,1,194,175,0,195,191,33,1,1,0,195,191,3,9,83,73,77,79,49,46,77,73,68,0,195,140,99,0,194,188,7,127,0,194,188,10,96,194,173,0,194,156,48,102,194,129,52,48,0,60,55,102,194,129,52,55,0,60,48,103,194,129,52,48,0,60,55,103,194,129,52,55,0,60,48,104,90,48,0,30,48,104,90,48,0,30,55,104,90,55,0,30,55,105,90,55,0,30,48,105,194,129,52,48,0,60,55,105,194,129,52,55,0,60,48,106,194,129,52,48,0,60,55,106,194,129,52,55,0,60,48,107,194,129,52,48,0,60,55,107,194,129,52,55,0,60,48,108,90,48,0,30,48,108,90,48,0,30,55,109,90,55,0,30,55,109,90,55,0,30,48,109,194,129,52,48,0,60,55,110,194,129,52,55,0,60,48,110,194,129,52,48,0,60,55,111,194,129,52,55,0,60,48,111,194,129,52,48,0,60,55,112,194,129,52,55,0,60,48,112,90,48,0,30,48,112,90,48,0,30,55,113,90,55,0,30,55,113,90,55,0,30,48,113,194,129,52,48,0,60,55,114,194,129,52,55,0,60,48,114,194,129,52,48,0,60,55,115,194,129,52,55,0,60,48,115,194,129,52,48,0,60,55,116,194,129,52,55,0,60,48,116,90,48,0,30,48,116,90,48,0,30,55,117,90,55,0,30,55,117,90,55,0,30,48,117,194,129,52,48,0,60,55,118,194,129,52,55,0,60,48,118,194,129,52,48,0,60,55,119,194,129,52,55,0,60,48,119,194,129,52,48,0,60,55,120,194,129,52,55,0,60,48,120,90,48,0,30,48,121,90,48,0,30,55,121,90,55,0,30,55,121,90,55,0,30,48,121,194,129,52,48,0,60,55,122,194,129,52,55,0,60,48,122,194,129,52,48,0,60,55,123,194,129,52,55,0,60,48,123,194,129,52,48,0,60,55,124,194,129,52,55,0,60,48,124,90,48,0,30,48,125,90,48,0,30,55,125,90,55,0,30,55,125,90,55,0,30,48,125,194,129,52,48,0,60,55,126,194,129,52,55,0,0,195,191,47,0,77,84,114,107,0,0,4,98,0,195,191,33,1,1,0,195,191,3,9,83,73,77,79,49,46,77,73,68,0,195,141,99,0,194,189,7,127,0,194,189,10,32,0,194,157,60,90,90,60,0,30,72,90,90,72,0,30,60,90,90,60,0,194,129,22,64,91,90,64,0,30,69,91,90,69,0,30,65,91,90,65,0,194,129,22,65,92,90,65,0,30,67,92,90,67,0,30,60,92,90,60,0,194,129,22,57,93,90,57,0,194,130,14,62,93,90,62,0,30,64,94,90,64,0,194,129,22,60,94,90,60,0,194,129,22,57,95,90,57,0,194,129,22,60,95,90,60,0,194,129,22,67,96,90,67,0,194,129,22,69,96,90,69,0,194,129,22,67,97,90,67,0,194,129,22,64,97,90,64,0,194,129,22,65,98,90,65,0,194,129,22,69,98,90,69,0,194,129,22,72,99,90,72,0,194,129,22,64,99,90,64,0,30,67,100,90,67,0,194,130,14,72,100,90,72,0,194,129,22,62,101,90,62,0,30,64,101,90,64,0,30,62,101,90,62,0,30,60,102,90,60,0,30,60,102,90,60,0,30,76,102,0,72,102,90,72,0,0,76,0,30,79,102,0,60,102,90,60,0,0,79,0,30,76,103,90,76,0,30,81,103,0,64,103,90,64,0,0,81,0,30,76,103,0,69,103,90,69,0,0,76,0,30,84,103,0,65,103,90,65,0,0,84,0,30,76,104,90,76,0,30,81,104,0,65,104,90,65,0,0,81,0,30,76,104,0,67,104,90,67,0,0,76,0,30,79,104,0,60,104,90,60,0,0,79,0,30,76,105,90,76,0,30,81,105,0,57,105,90,57,0,0,81,0,30,76,105,90,76,0,30,84,105,90,84,0,30,76,106,0,62,106,90,62,0,0,76,0,30,81,106,0,64,106,90,64,0,0,81,0,30,76,106,90,76,0,30,79,106,0,60,106,90,60,0,0,79,0,30,76,107,90,76,0,30,81,107,0,57,107,90,57,0,0,81,0,30,76,107,90,76,0,30,84,107,0,60,107,90,60,0,0,84,0,30,72,108,90,72,0,30,76,108,0,67,108,90,67,0,0,76,0,30,72,108,90,72,0,30,79,109,0,69,109,90,69,0,0,79,0,30,72,109,90,72,0,30,76,109,0,67,109,90,67,0,0,76,0,30,72,109,90,72,0,30,76,110,0,64,110,90,64,0,0,76,0,30,69,110,90,69,0,30,72,110,0,65,110,90,65,0,0,72,0,30,69,110,90,69,0,30,76,111,0,69,111,90,69,0,0,76,0,30,67,111,90,67,0,30,72,111,0,72,111,90,72,0,0,72,0,30,67,111,90,67,0,30,69,112,0,64,112,90,64,0,0,69,0,30,67,112,0,67,112,90,67,0,0,67,0,30,72,112,90,72,0,30,67,112,90,67,0,30,69,113,0,72,113,90,72,0,0,69,0,30,67,113,90,67,0,30,72,113,0,62,113,90,62,0,0,72,0,30,67,113,0,64,113,90,64,0,0,67,0,30,69,114,0,62,114,90,62,0,0,69,0,30,64,114,0,67,114,0,60,114,58,64,0,32,60,0,0,67,0,30,67,114,0,60,114,53,67,0,37,60,0,30,64,114,0,72,114,68,64,0,22,72,0,30,69,115,0,60,115,60,69,0,30,60,0,30,64,115,60,64,0,60,67,115,0,64,115,55,67,0,35,64,0,30,60,115,0,69,115,60,60,0,30,69,0,30,64,116,0,65,116,55,64,0,35,65,0,30,60,116,58,60,0,62,67,116,0,65,116,58,67,0,32,65,0,30,60,116,0,67,116,68,60,0,22,67,0,30,64,117,0,60,117,65,64,0,25,60,0,30,60,117,58,60,0,62,64,117,0,57,117,58,64,0,32,57,0,30,57,118,68,57,0,52,60,118,60,60,0,60,57,118,0,62,118,70,57,0,20,62,0,30,64,118,0,64,118,60,64,0,0,64,0,60,57,119,70,57,0,50,60,119,0,60,119,58,60,0,0,60,0,62,55,119,65,55,0,55,57,119,0,57,119,53,57,0,0,57,0,67,55,120,75,55,0,45,60,120,0,60,120,60,60,0,0,60,0,60,55,120,65,55,0,55,57,120,0,67,120,60,57,0,30,67,0,30,52,121,58,52,0,62,55,121,0,69,121,63,55,0,27,69,0,30,52,121,83,52,0,37,57,121,0,67,121,68,57,0,22,67,0,30,52,122,73,52,0,47,55,122,0,64,122,60,55,0,30,64,0,30,48,122,70,48,0,50,52,122,0,65,122,90,65,0,0,52,0,30,48,123,90,48,0,30,55,123,0,69,123,90,69,0,0,55,0,30,48,123,90,48,0,30,48,123,0,72,123,90,72,0,0,48,0,30,55,124,90,55,0,30,48,124,0,64,124,90,64,0,0,48,0,30,52,124,0,67,124,90,67,0,0,52,0,30,45,124,90,45,0,194,129,22,48,125,0,72,125,90,72,0,0,48,0,194,129,22,62,125,90,62,0,30,64,126,90,64,0,30,62,126,90,62,0,30,60,126,90,60,0,30,60,127,194,139,32,60,0,0,195,191,47,0]);

midi_10014.td = new TextDecoder("utf-8");
var midi_10014 = midi_10014.td.decode(midi_10014);
var midi_starshipgroove = new Uint8Array([77,84,104,100,0,0,0,6,0,1,0,6,3,195,128,77,84,114,107,0,0,0,45,0,195,191,88,4,4,2,24,8,0,195,191,89,2,0,0,0,195,191,81,3,8,63,125,0,195,191,33,1,0,194,158,0,195,191,88,4,4,2,24,8,0,195,191,89,2,0,0,0,195,191,47,0,77,84,114,107,0,0,53,195,167,0,195,128,81,0,194,176,7,100,0,195,191,3,10,77,73,68,73,32,67,104,110,32,49,0,195,191,33,1,1,194,158,0,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,194,180,65,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,45,64,194,129,111,194,128,45,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,45,64,194,129,111,194,128,45,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,45,64,194,129,111,194,128,45,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,45,64,194,129,111,194,128,45,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,131,95,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,131,95,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,131,95,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,40,64,194,131,95,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,45,64,194,129,111,194,128,45,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,131,95,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,131,95,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,131,95,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,40,64,194,131,95,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,194,131,97,194,144,45,64,194,129,111,194,128,45,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,44,64,194,129,111,194,128,44,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,46,64,194,129,111,194,128,46,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,56,64,194,129,111,194,128,56,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,45,64,194,129,111,194,128,45,0,1,194,144,47,64,194,129,111,194,128,47,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,52,64,194,129,111,194,128,52,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,50,64,194,129,111,194,128,50,0,194,129,113,194,144,40,64,194,129,111,194,128,40,0,1,194,144,49,64,194,129,111,194,128,49,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,40,64,194,129,111,194,128,40,0,1,194,144,47,64,194,129,111,194,128,47,0,0,195,191,47,0,77,84,114,107,0,0,47,36,0,195,137,0,0,194,185,7,127,0,78,64,0,195,191,3,11,77,73,68,73,32,67,104,110,32,49,48,0,195,191,33,1,1,194,158,0,194,185,7,127,195,176,64,194,153,56,64,194,129,111,194,137,56,0,194,141,17,194,153,56,64,194,129,111,194,137,56,0,194,141,17,194,153,56,64,194,129,111,194,137,56,0,194,141,17,194,153,56,64,194,129,111,194,137,56,0,194,141,17,194,153,56,64,194,129,111,194,137,56,0,194,141,17,194,153,56,64,194,129,111,194,137,56,0,194,139,33,194,153,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,77,0,194,129,113,194,153,35,64,0,49,64,194,129,111,194,137,35,0,0,49,0,194,129,113,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,194,129,112,35,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,112,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,194,129,112,35,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,112,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,0,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,42,0,0,55,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,0,45,64,0,47,64,194,129,111,194,137,45,0,0,47,0,1,194,153,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,77,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,0,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,77,0,1,194,153,77,64,194,129,111,194,137,42,0,0,77,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,0,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,42,0,0,55,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,0,45,64,0,47,64,194,129,111,194,137,45,0,0,47,0,1,194,153,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,77,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,0,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,0,43,64,0,45,64,194,129,111,194,137,35,0,0,43,0,0,45,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,35,0,0,56,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,35,0,0,56,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,35,0,0,56,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,0,56,64,119,194,137,40,0,120,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,129,112,56,0,194,131,97,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,0,66,64,194,129,111,194,137,40,0,0,66,0,1,194,153,40,64,0,46,64,0,66,64,194,129,111,194,137,40,0,0,46,0,0,66,0,194,129,113,194,153,40,64,0,44,64,0,66,64,194,129,111,194,137,40,0,0,44,0,0,56,0,0,66,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,112,56,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,194,129,113,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,41,64,0,43,64,194,129,111,194,137,41,0,0,43,0,194,133,81,194,153,42,64,194,129,111,194,137,42,0,194,141,17,194,153,42,64,194,129,111,194,137,42,0,194,141,17,194,153,42,64,194,129,111,194,137,42,0,194,141,17,194,153,42,64,0,46,64,194,129,111,194,137,42,0,0,46,0,121,194,153,44,64,194,129,111,194,137,44,0,194,138,41,194,153,42,64,194,129,111,194,137,42,0,194,141,17,194,153,42,64,194,129,111,194,137,42,0,194,139,33,194,153,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,77,0,194,129,113,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,194,133,81,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,194,133,81,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,194,133,81,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,194,133,81,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,194,133,81,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,194,133,81,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,194,129,113,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,46,64,119,194,137,46,0,194,130,105,194,153,44,64,119,194,137,44,0,195,171,105,194,185,7,127,194,137,48,194,153,40,3,194,129,111,194,137,40,0,1,194,153,40,6,194,129,111,194,137,40,0,1,194,153,40,9,194,129,111,194,137,40,0,1,194,153,40,12,194,129,111,194,137,40,0,1,194,153,40,15,194,129,111,194,137,40,0,1,194,153,40,18,194,129,111,194,137,40,0,1,194,153,40,21,194,129,111,194,137,40,0,1,194,153,40,24,194,129,111,194,137,40,0,1,194,153,40,27,194,129,111,194,137,40,0,1,194,153,40,30,194,129,111,194,137,40,0,1,194,153,40,33,194,129,111,194,137,40,0,1,194,153,40,36,194,129,111,194,137,40,0,1,194,153,40,39,194,129,111,194,137,40,0,1,194,153,40,42,194,129,111,194,137,40,0,1,194,153,40,45,194,129,111,194,137,40,0,1,194,153,40,48,194,129,111,194,137,40,0,1,194,153,40,51,194,129,111,194,137,40,0,1,194,153,40,54,194,129,111,194,137,40,0,1,194,153,40,57,194,129,111,194,137,40,0,1,194,153,46,64,0,49,64,20,194,185,7,127,194,129,91,194,137,49,0,194,129,113,194,153,44,64,194,129,111,194,137,44,0,194,129,112,46,0,194,137,49,194,153,40,3,194,129,111,194,137,40,0,1,194,153,40,6,194,129,111,194,137,40,0,1,194,153,40,9,194,129,111,194,137,40,0,1,194,153,40,12,194,129,111,194,137,40,0,1,194,153,40,15,194,129,111,194,137,40,0,1,194,153,40,18,194,129,111,194,137,40,0,1,194,153,40,21,194,129,111,194,137,40,0,1,194,153,40,24,194,129,111,194,137,40,0,1,194,153,40,27,194,129,111,194,137,40,0,1,194,153,40,30,194,129,111,194,137,40,0,1,194,153,40,33,194,129,111,194,137,40,0,1,194,153,40,36,194,129,111,194,137,40,0,1,194,153,40,39,194,129,111,194,137,40,0,1,194,153,40,42,194,129,111,194,137,40,0,1,194,153,40,45,194,129,111,194,137,40,0,1,194,153,40,48,0,65,48,194,129,111,194,137,40,0,0,65,0,1,194,153,40,51,0,65,51,194,129,111,194,137,40,0,0,65,0,1,194,153,40,54,0,65,54,194,129,111,194,137,40,0,0,65,0,1,194,153,40,57,0,65,57,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,49,64,194,129,111,194,137,35,0,0,49,0,194,129,113,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,194,129,112,35,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,112,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,194,129,112,35,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,112,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,0,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,42,0,0,55,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,0,45,64,0,47,64,194,129,111,194,137,45,0,0,47,0,1,194,153,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,77,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,0,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,77,0,1,194,153,77,64,194,129,111,194,137,42,0,0,77,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,40,64,0,42,64,194,131,95,194,137,40,0,0,42,0,1,194,153,42,64,0,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,42,0,0,55,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,131,95,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,0,45,64,0,47,64,194,129,111,194,137,45,0,0,47,0,1,194,153,35,64,194,129,111,194,137,35,0,0,40,0,0,42,0,1,194,153,42,64,194,131,95,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,42,0,1,194,153,40,64,0,42,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,35,64,0,42,64,0,77,64,194,129,111,194,137,35,0,0,77,0,194,129,112,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,1,194,153,35,64,0,77,64,194,129,111,194,137,35,0,0,42,0,0,77,0,1,194,153,42,64,194,129,112,40,64,194,129,111,194,137,40,0,0,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,0,46,64,194,129,111,194,137,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,0,44,0,1,194,153,40,64,194,129,111,194,137,40,0,194,131,97,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,40,64,0,46,64,194,129,111,194,137,35,0,0,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,44,64,0,77,64,194,129,111,194,137,44,0,0,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,0,46,64,194,129,111,194,137,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,0,44,0,1,194,153,40,64,194,129,111,194,137,40,0,194,131,97,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,40,64,0,46,64,194,129,111,194,137,35,0,0,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,44,64,194,129,111,194,137,44,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,0,46,64,194,129,111,194,137,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,0,44,0,1,194,153,40,64,194,129,111,194,137,40,0,194,131,97,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,40,64,0,46,64,194,129,111,194,137,35,0,0,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,44,64,194,129,111,194,137,44,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,0,46,64,194,129,111,194,137,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,0,44,0,1,194,153,40,64,194,129,111,194,137,40,0,194,131,97,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,40,64,0,46,64,194,129,111,194,137,35,0,0,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,44,64,194,129,111,194,137,44,0,194,129,113,194,153,40,64,0,77,64,194,129,111,194,137,40,0,0,77,0,1,194,153,40,64,0,77,64,194,129,111,194,137,40,0,0,77,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,129,113,194,153,56,64,194,129,111,194,137,56,0,194,129,113,194,153,35,64,0,40,64,0,55,64,0,65,64,194,129,111,194,137,35,0,0,40,0,0,55,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,194,131,97,194,153,35,64,0,56,64,194,129,111,194,137,35,0,0,56,0,194,129,113,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,56,64,194,129,111,194,137,56,0,194,129,113,194,153,35,64,0,40,64,0,55,64,0,65,64,194,129,111,194,137,35,0,0,40,0,0,55,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,194,129,113,194,153,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,35,0,0,55,0,194,129,113,194,153,56,64,194,129,111,194,137,56,0,194,129,113,194,153,35,64,0,67,64,194,129,111,194,137,35,0,0,67,0,1,194,153,55,64,194,129,111,194,137,55,0,1,194,153,67,64,194,129,111,194,137,67,0,194,129,113,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,0,46,64,194,129,111,194,137,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,0,44,0,1,194,153,40,64,194,129,111,194,137,40,0,194,131,97,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,40,64,0,46,64,194,129,111,194,137,35,0,0,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,44,64,194,129,111,194,137,44,0,194,129,113,194,153,40,64,0,77,64,194,129,111,194,137,40,0,0,77,0,1,194,153,40,64,0,77,64,194,129,111,194,137,40,0,0,77,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,129,113,194,153,56,64,194,129,111,194,137,56,0,194,129,113,194,153,35,64,0,40,64,0,55,64,0,65,64,194,129,111,194,137,35,0,0,40,0,0,55,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,194,131,97,194,153,35,64,0,56,64,194,129,111,194,137,35,0,0,56,0,194,129,113,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,56,64,194,129,111,194,137,56,0,194,129,113,194,153,35,64,0,40,64,0,55,64,0,65,64,194,129,111,194,137,35,0,0,40,0,0,55,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,194,129,113,194,153,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,35,0,0,55,0,194,129,113,194,153,56,64,194,129,111,194,137,56,0,194,129,113,194,153,35,64,0,67,64,194,129,111,194,137,35,0,0,67,0,1,194,153,55,64,194,129,111,194,137,55,0,1,194,153,67,64,194,129,111,194,137,67,0,194,129,113,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,0,46,64,194,129,111,194,137,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,0,44,0,1,194,153,40,64,194,129,111,194,137,40,0,194,131,97,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,55,64,194,129,111,194,137,55,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,40,64,0,46,64,194,129,111,194,137,35,0,0,40,0,0,46,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,44,64,0,77,64,194,129,111,194,137,44,0,0,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,43,64,0,45,64,194,129,111,194,137,43,0,0,45,0,194,178,81,194,153,43,64,0,45,64,194,129,111,194,137,43,0,0,45,0,194,141,17,194,153,43,64,0,45,64,194,129,111,194,137,43,0,0,45,0,194,141,17,194,153,43,64,0,45,64,194,129,111,194,137,43,0,0,45,0,194,141,17,194,153,77,64,194,129,111,194,137,77,0,1,194,153,77,64,194,129,111,194,137,77,0,1,194,153,67,64,194,129,111,194,137,67,0,194,129,113,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,37,64,0,40,64,194,129,111,194,137,37,0,0,40,0,194,129,113,194,153,42,64,194,131,95,194,137,42,0,1,194,153,37,64,194,129,111,194,137,37,0,194,129,113,194,153,42,64,194,131,95,194,137,42,0,1,194,153,37,64,0,40,64,194,129,111,194,137,37,0,0,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,37,64,194,129,111,194,137,37,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,37,64,0,40,64,194,129,111,194,137,37,0,0,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,37,64,194,129,111,194,137,37,0,194,129,113,194,153,56,64,194,129,111,194,137,56,0,194,129,113,194,153,37,64,0,40,64,194,129,111,194,137,37,0,0,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,37,64,194,129,111,194,137,37,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,37,64,0,40,64,194,129,111,194,137,37,0,0,40,0,1,194,153,40,3,194,129,111,194,137,40,0,1,194,153,40,6,0,42,64,194,129,111,194,137,40,0,0,42,0,1,194,153,40,9,0,42,64,194,129,111,194,137,40,0,0,42,0,1,194,153,37,64,0,40,12,194,129,111,194,137,37,0,0,40,0,1,194,153,40,15,194,129,111,194,137,40,0,1,194,153,40,18,0,42,64,194,129,111,194,137,40,0,0,42,0,1,194,153,40,21,194,129,111,194,137,40,0,1,194,153,37,64,0,40,24,0,40,64,194,129,111,194,137,37,0,0,40,0,0,40,0,1,194,153,40,27,194,129,111,194,137,40,0,1,194,153,40,30,0,42,64,194,129,111,194,137,40,0,0,42,0,1,194,153,40,33,194,129,111,194,137,40,0,1,194,153,37,64,0,40,36,194,129,111,194,137,37,0,0,40,0,1,194,153,40,39,194,129,111,194,137,40,0,1,194,153,40,42,194,129,111,194,137,40,0,1,194,153,40,45,194,129,111,194,137,40,0,1,194,153,37,64,0,40,48,194,129,111,194,137,37,0,0,40,0,1,194,153,40,51,194,129,111,194,137,40,0,1,194,153,40,54,194,129,111,194,137,40,0,1,194,153,40,57,194,129,111,194,137,40,0,1,194,153,35,64,0,44,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,194,129,112,44,0,1,194,153,44,64,194,129,112,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,44,64,194,131,95,194,137,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,44,64,194,129,112,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,194,129,112,44,0,1,194,153,44,64,194,129,112,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,44,64,194,131,95,194,137,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,44,64,194,129,112,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,0,77,64,194,129,111,194,137,35,0,1,194,153,77,64,194,129,111,194,137,44,0,0,77,0,0,77,0,1,194,153,35,64,0,44,64,0,77,64,194,129,111,194,137,35,0,0,77,0,1,194,153,77,64,194,129,111,194,137,44,0,0,77,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,194,129,112,44,0,1,194,153,44,64,0,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,35,0,0,44,0,0,55,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,40,64,0,43,64,0,44,64,0,45,64,194,129,111,194,137,40,0,0,43,0,0,45,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,44,64,194,131,95,194,137,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,44,0,1,194,153,35,64,0,44,64,0,77,64,194,129,111,194,137,35,0,0,77,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,0,77,64,194,129,111,194,137,35,0,0,44,0,0,77,0,1,194,153,44,64,194,129,112,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,0,77,64,194,129,111,194,137,35,0,0,77,0,1,194,153,77,64,194,129,111,194,137,44,0,0,77,0,1,194,153,35,64,0,44,64,0,77,64,194,129,111,194,137,35,0,0,77,0,1,194,153,77,64,194,129,111,194,137,44,0,0,77,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,194,129,112,44,0,1,194,153,44,64,0,55,64,194,129,111,194,137,55,0,1,194,153,35,64,0,55,64,194,129,111,194,137,35,0,0,44,0,0,55,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,35,64,0,44,64,194,131,95,194,137,35,0,0,44,0,1,194,153,40,64,0,43,64,0,44,64,0,45,64,194,129,111,194,137,40,0,0,43,0,0,45,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,44,64,194,131,95,194,137,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,40,64,0,44,64,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,44,0,1,194,153,35,64,0,44,64,0,77,64,194,129,111,194,137,35,0,0,77,0,194,129,112,44,0,1,194,153,35,64,0,44,64,194,129,111,194,137,35,0,1,194,153,35,64,0,77,64,194,129,111,194,137,35,0,0,44,0,0,77,0,1,194,153,44,64,194,129,112,35,64,194,129,111,194,137,35,0,0,44,0,1,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,35,64,194,129,111,194,137,35,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,56,64,194,129,111,194,137,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,131,97,194,153,35,64,0,42,64,194,129,111,194,137,35,0,0,42,0,1,194,153,42,64,194,129,111,194,137,42,0,1,194,153,42,64,194,129,111,194,137,42,0,194,129,113,194,153,40,64,0,49,64,194,129,111,194,137,40,0,0,49,0,194,131,97,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,40,64,0,65,64,194,129,111,194,137,40,0,0,65,0,1,194,153,35,64,0,57,64,194,129,111,194,137,35,0,0,57,0,194,131,97,194,153,43,64,0,45,64,194,129,111,194,137,43,0,0,45,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,35,0,0,56,0,194,129,113,194,153,67,64,194,129,111,194,137,67,0,194,129,113,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,35,0,0,56,0,194,129,113,194,153,35,64,194,131,95,194,137,35,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,56,0,194,129,112,35,0,1,194,153,35,64,0,46,64,194,129,111,194,137,46,0,194,129,112,35,0,1,194,153,40,64,0,44,64,0,56,64,194,129,111,194,137,40,0,0,44,0,0,56,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,1,194,153,35,64,0,56,64,194,129,111,194,137,56,0,194,129,112,35,0,1,194,153,35,64,194,131,95,194,137,35,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,129,113,194,153,67,64,194,129,111,194,137,67,0,194,129,113,194,153,35,64,0,56,64,194,129,111,194,137,56,0,194,129,112,35,0,1,194,153,35,64,194,131,95,194,137,35,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,56,0,194,129,112,35,0,1,194,153,35,64,194,131,95,194,137,35,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,129,113,194,153,57,64,194,129,111,194,137,57,0,194,129,113,194,153,35,64,0,56,64,194,129,111,194,137,56,0,194,129,112,35,0,1,194,153,35,64,194,131,95,194,137,35,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,129,111,194,137,56,0,194,129,112,35,0,1,194,153,67,64,194,129,111,194,137,67,0,194,129,113,194,153,40,64,0,56,64,194,129,111,194,137,40,0,0,56,0,194,133,81,194,153,35,64,0,56,64,194,131,95,194,137,35,0,194,131,96,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,133,80,56,0,1,194,153,35,64,0,56,64,194,131,95,194,137,35,0,1,194,153,46,64,194,129,111,194,137,46,0,194,129,112,56,0,1,194,153,40,64,0,44,64,0,56,64,194,129,111,194,137,40,0,0,44,0,1,194,153,40,64,194,129,111,194,137,40,0,194,129,113,194,153,40,64,194,129,111,194,137,40,0,0,56,0,1,194,153,35,64,0,56,64,194,131,95,194,137,35,0,194,131,96,56,0,1,194,153,40,64,0,56,64,194,129,111,194,137,40,0,194,129,113,194,153,67,64,194,129,111,194,137,67,0,1,194,153,67,64,194,129,111,194,137,56,0,0,67,0,1,194,153,35,64,0,40,3,0,56,64,194,129,111,194,137,40,0,1,194,153,40,6,194,129,111,194,137,35,0,0,40,0,1,194,153,40,9,194,129,111,194,137,40,0,1,194,153,40,12,194,129,111,194,137,40,0,0,56,0,1,194,153,40,15,0,56,64,194,129,111,194,137,40,0,1,194,153,40,18,194,129,111,194,137,40,0,1,194,153,40,21,194,129,111,194,137,40,0,1,194,153,40,24,194,129,111,194,137,40,0,0,56,0,1,194,153,35,64,0,40,27,0,56,64,194,129,111,194,137,40,0,1,194,153,40,30,194,129,111,194,137,35,0,0,40,0,1,194,153,40,33,194,129,111,194,137,40,0,1,194,153,40,36,194,129,111,194,137,40,0,0,56,0,1,194,153,40,39,0,56,64,194,129,111,194,137,40,0,1,194,153,40,42,194,129,111,194,137,40,0,1,194,153,40,45,194,129,111,194,137,40,0,1,194,153,40,48,194,129,111,194,137,40,0,0,56,0,1,194,153,40,51,0,56,64,194,129,111,194,137,40,0,1,194,153,40,54,194,129,111,194,137,40,0,1,194,153,40,57,194,129,111,194,137,40,0,1,194,153,40,64,194,129,111,194,137,40,0,0,56,0,1,194,153,35,64,0,57,64,194,131,95,194,137,35,0,0,57,0,0,195,191,47,0,77,84,114,107,0,0,38,54,0,195,129,90,0,194,177,7,100,0,195,191,3,10,77,73,68,73,32,67,104,110,32,50,0,195,191,33,1,1,194,131,195,130,0,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,52,64,194,129,195,146,0,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,52,64,194,129,194,157,64,52,64,194,129,111,194,129,52,0,0,52,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,194,129,113,194,145,52,64,194,129,111,194,129,52,0,194,129,195,147,113,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,194,131,194,164,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,52,64,195,169,0,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,68,64,194,129,111,194,129,68,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,66,64,194,129,111,194,129,66,0,1,194,145,62,64,194,129,111,194,129,62,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,57,64,194,129,111,194,129,57,0,1,194,145,61,64,194,129,111,194,129,61,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,56,64,194,129,111,194,129,56,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,52,64,194,129,111,194,129,52,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,59,64,194,129,111,194,129,59,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,0,59,0,1,194,145,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,0,52,0,1,194,145,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,60,64,0,60,64,194,129,111,194,129,60,0,0,60,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,59,64,0,59,64,194,129,111,194,129,59,0,0,59,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,58,64,0,58,64,194,129,111,194,129,58,0,0,58,0,1,194,145,52,64,0,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,194,129,112,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,0,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,139,33,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,194,131,97,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,1,194,145,64,64,194,129,111,194,129,64,0,194,131,97,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,1,194,145,52,64,194,129,111,194,129,52,0,0,195,191,47,0,77,84,114,107,0,0,17,194,170,0,195,130,87,0,194,178,7,73,0,195,191,3,10,77,73,68,73,32,67,104,110,32,51,0,195,191,33,1,1,194,135,194,143,32,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,194,161,97,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,194,129,113,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,1,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,131,97,194,146,55,56,194,129,111,194,130,55,0,1,194,146,52,56,194,129,111,194,130,52,0,194,154,33,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,194,129,194,150,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,68,56,194,129,111,194,130,68,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,66,56,194,129,111,194,130,66,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,56,56,194,129,111,194,130,56,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,68,56,194,129,111,194,130,68,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,66,56,194,129,111,194,130,66,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,56,56,194,129,111,194,130,56,0,194,129,113,194,146,68,56,194,129,111,194,130,68,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,66,56,194,129,111,194,130,66,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,56,56,194,129,111,194,130,56,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,68,56,194,129,111,194,130,68,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,66,56,194,129,111,194,130,66,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,56,56,194,129,111,194,130,56,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,131,97,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,194,129,113,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,68,56,194,129,111,194,130,68,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,66,56,194,129,111,194,130,66,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,56,56,194,129,111,194,130,56,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,68,56,194,129,111,194,130,68,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,66,56,194,129,111,194,130,66,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,57,56,194,129,111,194,130,57,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,59,56,194,129,111,194,130,59,0,1,194,146,56,56,194,129,111,194,130,56,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,182,49,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,171,17,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,194,161,97,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,194,129,113,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,1,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,131,97,194,146,55,56,194,129,111,194,130,55,0,1,194,146,52,56,194,129,111,194,130,52,0,194,154,33,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,194,129,194,191,33,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,194,173,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,59,56,194,129,111,194,130,59,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,131,97,194,146,64,56,194,129,111,194,130,64,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,1,194,146,76,56,194,129,111,194,130,76,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,1,194,146,76,56,194,129,111,194,130,76,0,194,167,49,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,194,161,97,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,194,129,113,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,62,56,194,129,111,194,130,62,0,1,194,146,61,56,194,129,111,194,130,61,0,194,129,113,194,146,59,56,194,129,111,194,130,59,0,194,131,97,194,146,55,56,194,129,111,194,130,55,0,1,194,146,52,56,194,129,111,194,130,52,0,194,154,33,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,61,56,194,129,111,194,130,61,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,62,56,194,129,111,194,130,62,0,1,194,146,64,56,194,129,111,194,130,64,0,1,194,146,52,56,194,129,111,194,130,52,0,1,194,146,64,56,194,129,111,194,130,64,0,195,150,33,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,68,56,194,129,111,194,130,68,0,194,129,113,194,146,71,56,194,129,111,194,130,71,0,194,129,113,194,146,74,56,194,129,111,194,130,74,0,194,129,113,194,146,75,56,194,129,111,194,130,75,0,1,194,146,76,56,194,129,111,194,130,76,0,194,161,97,194,146,71,56,194,129,111,194,130,71,0,194,129,113,194,146,74,56,194,129,111,194,130,74,0,194,129,113,194,146,75,56,194,129,111,194,130,75,0,194,129,113,194,146,77,56,194,129,111,194,130,77,0,194,129,113,194,146,78,56,194,129,111,194,130,78,0,1,194,146,79,56,194,129,111,194,130,79,0,194,161,97,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,68,56,194,129,111,194,130,68,0,194,129,113,194,146,71,56,194,129,111,194,130,71,0,194,129,113,194,146,74,56,194,129,111,194,130,74,0,194,129,113,194,146,75,56,194,129,111,194,130,75,0,1,194,146,76,56,194,129,111,194,130,76,0,194,161,97,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,64,56,194,129,111,194,130,64,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,194,129,113,194,146,52,56,194,129,111,194,130,52,0,0,195,191,47,0,77,84,114,107,0,0,1,97,0,195,131,81,0,194,179,7,100,0,195,191,3,10,77,73,68,73,32,67,104,110,32,52,0,195,191,33,1,1,194,133,194,148,0,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,129,195,142,33,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,129,195,142,33,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,176,97,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,134,195,184,97,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,1,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,1,194,147,40,64,0,52,64,194,131,95,194,131,40,0,0,52,0,194,129,113,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,135,65,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,135,65,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,135,65,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,135,65,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,194,136,194,157,97,194,147,28,64,0,40,64,194,131,95,194,131,28,0,0,40,0,0,195,191,47,0]);

midi_starshipgroove.td = new TextDecoder("utf-8");
var midi_starshipgroove = midi_starshipgroove.td.decode(midi_starshipgroove);

__globals.data = {};
__globals.data.midiTracks = [];
__globals.data.midiTracks.push(internalizeMidi_v1_MidiConvert(midi_10014));
__globals.data.midiTracks.push(internalizeMidi_v1_MidiConvert(midi_starshipgroove));

var internalizedMidi = __globals.data.midiTracks[1];

parts.audio.midiPerformer_basic = function(){
    var midiSequence = null;
    var settings = {
        'arrangementName' : '',
        'ticksPerMeasure' : 128,
        'timeSignature'   : [4,4],
        'beatsPerSecond'  : 2,
        'ticksPerSecond'  : 64
    };
    var interval = null;
    var self = this;

    //internal functionality
        function calculateTicksPerSecond(ticksPerMeasure, beatsPerSecond, timeSignature){
            return (ticksPerMeasure*beatsPerSecond)/timeSignature[0];
        }
        function recalculateTiming(){
            settings.ticksPerSecond = calculateTicksPerSecond(settings.ticksPerMeasure,settings.beatsPerSecond,settings.timeSignature);
            settings.secondsPerTick = 1/settings.ticksPerSecond;

            var mux = 1; while(1000*settings.secondsPerTick*mux < 10){ mux++; }

            settings.intervalTime = settings.secondsPerTick*mux;
            settings.tickStep = mux;

            if(interval){startInterval(settings.intervalTime);}
        }

        function iterator(){
            var commandLists = [];
                commandLists = commandLists.concat( [midiSequence.control] );
                commandLists = commandLists.concat( midiSequence.tracks );

            for(var a = 0; a < commandLists.length; a++){
                while(commandLists[a].length > settings.trackIndex[a] && commandLists[a][settings.trackIndex[a]].tick <= settings.tick){
                    perform(a,commandLists[a][settings.trackIndex[a]++]);
                }
            }
            settings.tick+=settings.tickStep;
        }
        function perform(list,command){
            function calculateTicksPerSecond(ticksPerMeasure, beatsPerSecond, timeSignature){
                return (ticksPerMeasure*beatsPerSecond)/timeSignature[0];
            }

            if(list == 0){ //control list
                switch(command.commandName){
                    case 'arrangementName': 
                        settings.arrangementName = command.data;
                    break;
                    case 'ticksPerMeasure': 
                        settings.ticksPerMeasure = command.data;
                        recalculateTiming();
                    break;
                    case 'timeSignature': 
                        settings.timeSignature = command.data;
                        recalculateTiming();
                    break;
                    case 'beatsPerSecond': 
                        settings.beatsPerSecond = command.data;
                        recalculateTiming();
                    break;
                }
            }
            else{ //other lists
                self.command(list-1, command.commandName, command.data);
            }
        }
        function startInterval(intervalTime){
            clearInterval(interval);
            interval = setInterval(iterator, 1000*intervalTime);
        }

    // callbacks
        this.command = function(channel, commandType, commandData){};

    // methods
        this.loadMidi = function(midi){
            midiSequence = midi;

            //load main settings
            for(var a = 0; a < midi.control.length; a++){
                if( midi.control[a].tick == 0 ){
                    settings[midi.control[a].commandName] = midi.control[a].data;
                }
            }

            //compute additional playback settings
            recalculateTiming();
            settings.tick = 0;
            settings.trackIndex = [0];
                for(var a = 0; a < midi.tracks.length; a++){
                    settings.trackIndex.push(0);
                }
        };

        this.play = function(){ startInterval(settings.intervalTime); };
        this.stop = function(){ clearInterval(interval); };
        this.step = function(){ iterator(); };
};






function makeMidiPlayer(x,y){
    var width = 75;
    var height = 370;
    var nodeSize = 20;
    
    var _mainObject = parts.basic.g('midiPlayer', x, y);

    var backing = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeMidiPlayer);

    //generate selection area        
        _mainObject.selectionArea = {};
        _mainObject.selectionArea.box = [];
        _mainObject.selectionArea.points = [];
        _mainObject.updateSelectionArea = function(){
            //the main shape we want to use
            var temp = __globals.utility.getBoundingBox(backing);
            _mainObject.selectionArea.points = [
                [temp.x,temp.y],
                [temp.x+temp.width,temp.y],
                [temp.x+temp.width,temp.y+temp.height],
                [temp.x,temp.y+temp.height]
            ];
            _mainObject.selectionArea.box = __globals.utility.getBoundingBoxFromPoints(_mainObject.selectionArea.points);

            //adjusting it for the object's position in space
            temp = __globals.utility.getTransform(_mainObject);
            _mainObject.selectionArea.box.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });
            _mainObject.selectionArea.points.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });

        };
        _mainObject.updateSelectionArea();
        


        
    _mainObject.onSelect = function(){
        console.log('I\'ve been selected!');
        __globals.utility.setStyle(backing, 'fill:rgba(220,220,220,1)');
    };
    _mainObject.onDeselect = function(){
        console.log('I\'ve been deselected!');
        __globals.utility.setStyle(backing, 'fill:rgba(200,200,200,1)');
    };
    _mainObject.onDelete = function(){
        console.log('I\'ve been deleted!');
    };
    _mainObject.onCopy = function(original=false){
        console.log('I\'ve been copied!', original?'- original object ':'- new object');
    };

    _mainObject.importData = function(data){
        console.log('importing data', data);
    };
    _mainObject.exportData = function(){
        console.log('exporting data');
        return {'like settings and stuff':'settin\'s' };
    };



    _mainObject.io = {};
    _mainObject.io.out = [];
    for(var a = 0; a < 16; a++){
        _mainObject.io.out.push( parts.dynamic.connectionNode_data('io.out_'+a,-nodeSize/2,nodeSize*1.1*a + nodeSize/2,nodeSize,nodeSize) );
        _mainObject.append( _mainObject.io.out[a] );
    }

    var perf = new parts.audio.midiPerformer_basic();
    perf.loadMidi(internalizedMidi);
    perf.command = function(channel, commandType, commandData){
        if(commandType == 'note'){
            _mainObject.io.out[channel].send('midiNumber', {'num': commandData.noteNumber, 'velocity': commandData.velocity} );
        }
    };
    perf.play();
    // perf.step();

    _mainObject.play = perf.play;
    _mainObject.step = perf.step;
    _mainObject.stop = perf.stop;

    return _mainObject;
}


//hacking
// internalizedMidi.control[2].data = 3/4;


function makeUniversalReadout(x,y){

    //elements
        //main
            var _mainObject = parts.basic.g('universalReadout', x, y);

            var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeUniversalReadout);

            _mainObject.append(parts.display.label(null, 10, 30, 'universal','fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'));
            _mainObject.append(parts.display.label(null, 10, 40, 'readout','fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'));

        // connection ports
            _mainObject.io = {};
            _mainObject.io.in = parts.dynamic.connectionNode_data('io.in',75/2-30/2,-30/2,30,30);
                _mainObject.append(_mainObject.io.in);
                _mainObject.io.in.receive = function(address,data){
                    console.log(address,data);
                };

        //generate selection area        
            _mainObject.selectionArea = {};
            _mainObject.selectionArea.box = [];
            _mainObject.selectionArea.points = [];
            _mainObject.updateSelectionArea = function(){
                //the main shape we want to use
                var temp = __globals.utility.getBoundingBox(backing);
                _mainObject.selectionArea.points = [
                    [temp.x,temp.y],
                    [temp.x+temp.width,temp.y],
                    [temp.x+temp.width,temp.y+temp.height],
                    [temp.x,temp.y+temp.height]
                ];
                _mainObject.selectionArea.box = __globals.utility.getBoundingBoxFromPoints(_mainObject.selectionArea.points);

                //adjusting it for the object's position in space
                temp = __globals.utility.getTransform(_mainObject);
                _mainObject.selectionArea.box.forEach(function(element) {
                    element[0] += temp[0];
                    element[1] += temp[1];
                });
                _mainObject.selectionArea.points.forEach(function(element) {
                    element[0] += temp[0];
                    element[1] += temp[1];
                });

            };
            _mainObject.updateSelectionArea();
        
    return _mainObject;
}
parts.audio.synthesizer = function(
    context,
    type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, attack=0.01, release=0.1, detune=0, octave=0
){
    //components
    var mainOut = context.createGain();
        mainOut.gain.value = gain;

    //live oscillators
    var liveOscillators = {};

    //options
    this.type = function(a){if(a==null){return type;}type=a;};
    this.periodicWave = function(a){if(a==null){return periodicWave;}periodicWave=a;};
    this.gain = function(a){if(a==null){return mainOut.gain.value;}mainOut.gain.value=a;};
    this.attack = function(a){if(a==null){return attack;}attack=a;};
    this.release = function(a){if(a==null){return release;}release=a;};
    this.detune = function(a){if(a==null){return detune;}detune=a;};
    this.octave = function(a){if(a==null){return octave;}octave=a;};

    //output node
    this.out = function(){return mainOut;}

    //oscillator generator
    function makeOSC(
        context, connection, midiNumber,
        type='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
        gain=1, attack=0.01, release=0.1, detune=0, octave=0
    ){
        return new function(){
            this.generator = context.createOscillator();
                if(type == 'custom'){ 
                    this.generator.setPeriodicWave( 
                        context.createPeriodicWave(new Float32Array(periodicWave.sin),new Float32Array(periodicWave.cos))
                    ); 
                }else{ this.generator.type = type; }
                this.generator.frequency.value = __globals.audio.midiNumber_frequency(midiNumber,octave);
                this.generator.detune.value = detune;
                this.generator.start(0);

            this.gain = context.createGain();
                this.generator.connect(this.gain);
                this.gain.gain.value = 0;
                this.gain.gain.setTargetAtTime(gain, context.currentTime, attack/10);
                this.gain.connect(connection);

            this.changeVelocity = function(a){
                this.gain.gain.setTargetAtTime(a, context.currentTime, attack/10);
            };
            this.stop = function(){
                this.gain.gain.setTargetAtTime(0, context.currentTime, release/10);
                setTimeout(function(that){
                    that.gain.disconnect(); 
                    that.generator.stop(); 
                    that.generator.disconnect(); 
                    that.gain=null; 
                    that.generator=null; 
                }, release*1000, this);
            };
        };
    }

    //functions
    this.perform = function(note){
        if( !liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
        else if( !liveOscillators[note.num] ){ 
            //create new tone
            liveOscillators[note.num] = makeOSC(context, mainOut, note.num, type, periodicWave, note.velocity, attack, release, detune, octave); 
        }
        else if( note.velocity == 0 ){ 
            //stop and destroy tone
            liveOscillators[note.num].stop();
            delete liveOscillators[note.num];
        }
        else{
            //adjust tone
            liveOscillators[note.num].changeVelocity(note.velocity);
        }
    };
    this.panic = function(){
        var OSCs = Object.keys(liveOscillators);
        for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
    };
};
function makeSimpleSynthesizer(x,y){
    //styling
    var style = {
        'backing':'fill:rgba(200,200,200,1); stroke:none;',
        'h1':'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
        'h2':'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',

        'markings':'fill:none; stroke:rgb(150,150,150); stroke-width:1;',

        'handle':'fill:rgba(220,220,220,1)',
        'slot':'fill:rgba(50,50,50,1)',
        'needle':'fill:rgba(250,150,150,1)'
    };



    //elements
        //main
            var _mainObject = parts.basic.g('simpleSynthesizer', x, y);

            var path = [[0,0],[240,0],[240,40],[200,80],[0,80]];
            var backing = parts.basic.path(null, path, 'L', style.backing);
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeSimpleSynthesizer);

        //circuitry
            var synthesizer = new parts.audio.synthesizer(__globals.audio.context);

        //panic button
            var panicButton = parts.control.button_rect('panicButton', 197.5, 47.5, 20, 20, Math.PI/4, 'fill:rgba(175,175,175,1)', 'fill:rgba(220,220,220,1)', 'fill:rgba(150,150,150,1)');
                _mainObject.append(panicButton);
                panicButton.onclick = function(){ synthesizer.panic(); }

        //dials
            var x = 0;
            var y = 3;
            var spacing = 40;

            //gain
            _mainObject.append(parts.display.label(null, x+11,   y+40, 'gain', style.h1));
            _mainObject.append(parts.display.label(null, x+7,    y+34, '0',    style.h2));
            _mainObject.append(parts.display.label(null, x+16.5, y+5,  '1/2',  style.h2));
            _mainObject.append(parts.display.label(null, x+30,   y+34, '1',    style.h2));
            var dial_gain = parts.control.dial_continuous(
                'dial_gain', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_gain);

            x += spacing;

            //attack
            _mainObject.append(parts.display.label(null, x+7,    y+40, 'attack', style.h1));
            _mainObject.append(parts.display.label(null, x+7,    y+34, '0',      style.h2));
            _mainObject.append(parts.display.label(null, x+18.5, y+4,  '5',      style.h2));
            _mainObject.append(parts.display.label(null, x+30,   y+34, '10',     style.h2));
            var dial_attack = parts.control.dial_continuous(
                'dial_attack', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_attack);

            x += spacing;

            //release
            _mainObject.append(parts.display.label(null, x+5,    y+40, 'release', style.h1));
            _mainObject.append(parts.display.label(null, x+7,    y+34, '0',       style.h2));
            _mainObject.append(parts.display.label(null, x+18.5, y+4,  '5',       style.h2));
            _mainObject.append(parts.display.label(null, x+30,   y+34, '10',      style.h2));
            var dial_release = parts.control.dial_continuous(
                'dial_release', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_release);

            x += spacing;

            //detune
            _mainObject.append(parts.display.label(null, x+7,     y+40, 'detune', style.h1));
            _mainObject.append(parts.display.label(null, x+2,     y+34, '-100',   style.h2));
            _mainObject.append(parts.display.label(null, x+18.75, y+4,  '0',      style.h2));
            _mainObject.append(parts.display.label(null, x+28,    y+34, '+100',   style.h2));
            var dial_detune = parts.control.dial_continuous(
                'dial_detune', x+20, y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle, 1.2, style.markings
            );
            _mainObject.append(dial_detune);

            x += spacing;

            //octave
            _mainObject.append(parts.display.label(null, x+7,     y+40, 'octave', style.h1));
            _mainObject.append(parts.display.label(null, x+4,     y+32, '-3',     style.h2));
            _mainObject.append(parts.display.label(null, x+0,     y+21, '-2',     style.h2));
            _mainObject.append(parts.display.label(null, x+4,     y+10, '-1',     style.h2));
            _mainObject.append(parts.display.label(null, x+18.75, y+5,  '0',      style.h2));
            _mainObject.append(parts.display.label(null, x+30,    y+10, '+1',     style.h2));
            _mainObject.append(parts.display.label(null, x+35,    y+21, '+2',     style.h2));
            _mainObject.append(parts.display.label(null, x+30,    y+32, '+3',     style.h2));
            var dial_octave = parts.control.dial_discrete(
                'dial_octave', x+20, y+20, 12,
                7, (3*Math.PI)/4, 1.5*Math.PI,
                style.handle, style.slot, style.needle
            );
            _mainObject.append(dial_octave);

            x += spacing;

            //type
            _mainObject.append(parts.display.label(null, x+11, y+40, 'type', style.h1));
            _mainObject.append(parts.display.label(null, x+0,  y+32, 'sine', style.h2));
            _mainObject.append(parts.display.label(null, x+0,  y+18, 'tri',  style.h2));
            _mainObject.append(parts.display.label(null, x+10, y+6,  'squ',  style.h2));
            _mainObject.append(parts.display.label(null, x+27, y+7,  'saw',  style.h2));
            _mainObject.append(parts.basic.rect(null, x+35, y+19, 5, 2, 0, 'fill:rgba(50,50,50,1)'));
            var dial_type = parts.control.dial_discrete(
                'dial_type', x+20, y+20, 12,
                5, (3*Math.PI)/4, (5*Math.PI)/4,
                style.handle, style.slot, style.needle
            );
            _mainObject.append(dial_type);

        //connection nodes
            _mainObject.io = {};

            //audio out
            var s = 30;
            _mainObject.io.audioOut = parts.dynamic.connectionNode_audio('_mainObject.io.audioOut', 1, -s/2, 20-s/2, s, s, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.audioOut);

            //gain data in
            var s = 15;
            _mainObject.io.dataIn_gain = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_gain', 20-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_gain);

            //attack data in
            var s = 15;
            _mainObject.io.dataIn_attack = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_attack', 20+spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_attack);

            //release data in
            var s = 15;
            _mainObject.io.dataIn_release = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_release', 20+2*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_release);

            //detune data in
            var s = 15;
            _mainObject.io.dataIn_detune = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_detune', 20+3*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_detune);

            //octave data in
            var s = 15;
            _mainObject.io.dataIn_octave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_octave', 20+4*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_octave);

            //type data in
            var s = 15;
            _mainObject.io.dataIn_type = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_type', 20+5*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_type);

            //periodicWave data in
            var s = 15;
            _mainObject.io.dataIn_periodicWave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_periodicWave', 240-s/2, 20-s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_periodicWave);

            //midiNote data in
            var s = 30;
            var rotation = Math.PI/4;
            var temp = __globals.utility.getCartesian(rotation, -s);
            _mainObject.io.dataIn_midiNote = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_midiNote', 240+temp.x, 60+temp.y, s, s, rotation);
            _mainObject.prepend(_mainObject.io.dataIn_midiNote);


            //movement redraw
            _mainObject.movementRedraw = function(){
                _mainObject.io.audioOut.redraw();
                _mainObject.io.dataIn_gain.redraw();
                _mainObject.io.dataIn_attack.redraw();
                _mainObject.io.dataIn_release.redraw();
                _mainObject.io.dataIn_detune.redraw();
                _mainObject.io.dataIn_octave.redraw();
                _mainObject.io.dataIn_type.redraw();
                _mainObject.io.dataIn_periodicWave.redraw();
                _mainObject.io.dataIn_midiNote.redraw();
            };



    //wiring
        synthesizer.out().connect( _mainObject.io.audioOut.in() );

        dial_gain.onChange = function(value){ synthesizer.gain( value ); };
        dial_attack.onChange = function(value){ synthesizer.attack( value*10 ); };
        dial_release.onChange = function(value){ synthesizer.release( value*10 ); };
        dial_detune.onChange = function(value){ synthesizer.detune( value*200 - 100 ); };
        dial_octave.onChange = function(value){ synthesizer.octave(value-3); };
        dial_type.onChange = function(value){synthesizer.type(['sine','triangle','square','sawtooth','custom'][value]);};

        _mainObject.io.dataIn_gain.receive =    function(address,data){ if(address != '%'){return;} dial_gain.set(data); };
        _mainObject.io.dataIn_attack.receive =  function(address,data){ if(address != '%'){return;} dial_attack.set(data); }; 
        _mainObject.io.dataIn_release.receive = function(address,data){ if(address != '%'){return;} dial_release.set(data); };    
        _mainObject.io.dataIn_detune.receive =  function(address,data){ if(address != '%'){return;} dial_detune.set(data); };
        _mainObject.io.dataIn_octave.receive =  function(address,data){ if(address != 'discrete'){return;} dial_octave.select(data); };
        _mainObject.io.dataIn_type.receive =    function(address,data){ if(address != 'discrete'){return;} dial_type.select(data); };
        _mainObject.io.dataIn_midiNote.receive = function(address,data){ if(address != 'midiNumber'){return;} synthesizer.perform(data); };

    //setup
        dial_gain.set(0);
        dial_detune.set(0.5);
        dial_octave.select(3);

    return _mainObject;
}
function makeAudioSink(x,y){
    var _mainObject = parts.basic.g('audioSink', x, y);
        _mainObject._destination = __globals.audio.context;

    var width = 100;
    var height = 50;
    var backing = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgba(200,200,200,0.75)');
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, backing.parentElement, makeAudioSink);

    var audioConnection_width = 35;
    var audioConnection_height = 35;
    var connectionNode_audio = parts.dynamic.connectionNode_audio('connectionNode_audio', 0, width/2 - audioConnection_width/2, 30, audioConnection_width, audioConnection_height, __globals.audio.context);
        connectionNode_audio.out().connect(__globals.audio.context.destination);
        _mainObject.append(connectionNode_audio);
        _mainObject.movementRedraw = function(){ connectionNode_audio.redraw(); };

    _mainObject.io = {};
    _mainObject.io.in = connectionNode_audio;
    
    return _mainObject;
}
function makeDataDuplicator(x,y){

    var _mainObject = parts.basic.g('dataDuplicator', x, y);

    var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeDataDuplicator);

    //generate selection area        
        _mainObject.selectionArea = {};
        _mainObject.selectionArea.box = [];
        _mainObject.selectionArea.points = [];
        _mainObject.updateSelectionArea = function(){
            //the main shape we want to use
            var temp = __globals.utility.getBoundingBox(backing);
            _mainObject.selectionArea.points = [
                [temp.x,temp.y],
                [temp.x+temp.width,temp.y],
                [temp.x+temp.width,temp.y+temp.height],
                [temp.x,temp.y+temp.height]
            ];
            _mainObject.selectionArea.box = __globals.utility.getBoundingBoxFromPoints(_mainObject.selectionArea.points);

            //adjusting it for the object's position in space
            temp = __globals.utility.getTransform(_mainObject);
            _mainObject.selectionArea.box.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });
            _mainObject.selectionArea.points.forEach(function(element) {
                element[0] += temp[0];
                element[1] += temp[1];
            });

            // //print points to foreground
            // for(var a = 0; a < _mainObject.selectionArea.box.length; a++){
            //     __globals.utility.dotMaker(
            //         _mainObject.selectionArea.box[a][0],
            //         _mainObject.selectionArea.box[a][1],
            //         '['+_mainObject.selectionArea.box[a][0]+','+_mainObject.selectionArea.box[a][1]+']',
            //         2.5,
            //         'fill:rgba(255,100,100,0.75); font-size:3; font-family:Helvetica;'
            //     );
            // }
            // for(var a = 0; a < _mainObject.selectionArea.points.length; a++){
            //     __globals.utility.dotMaker(
            //         _mainObject.selectionArea.points[a][0],
            //         _mainObject.selectionArea.points[a][1],
            //         '['+_mainObject.selectionArea.points[a][0]+','+_mainObject.selectionArea.points[a][1]+']',
            //         2,
            //         'fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;'
            //     );
            // }

        };
        _mainObject.updateSelectionArea();
        


        
    _mainObject.onSelect = function(){
        console.log('I\'ve been selected!');
        __globals.utility.setStyle(backing, 'fill:rgba(220,220,220,1)');
    };
    _mainObject.onDeselect = function(){
        console.log('I\'ve been deselected!');
        __globals.utility.setStyle(backing, 'fill:rgba(200,200,200,1)');
    };
    _mainObject.onDelete = function(){
        console.log('I\'ve been deleted!');
    };
    _mainObject.onCopy = function(original=false){
        console.log('I\'ve been copied!', original?'- original object ':'- new object');
    };

    _mainObject.importData = function(data){
        console.log('importing data', data);
    };
    _mainObject.exportData = function(){
        console.log('exporting data');
        return {'like settings and stuff':'settin\'s' };
    };




    _mainObject.io = {};
    _mainObject.io.in = parts.dynamic.connectionNode_data('io.in',75/2-30/2,-30/2,30,30);
        _mainObject.append(_mainObject.io.in);
    _mainObject.io.out_1 = parts.dynamic.connectionNode_data('io.out_1',5,55-30/2,30,30);
        _mainObject.append(_mainObject.io.out_1);
    _mainObject.io.out_2 = parts.dynamic.connectionNode_data('io.out_2',75-30-5,55-30/2,30,30);
        _mainObject.append(_mainObject.io.out_2);

    _mainObject.io.in.receive = function(address,data){
        _mainObject.io.out_1.send(address,data);
        _mainObject.io.out_2.send(address,data);
    };

    return _mainObject;
}
function makeAudioCombiner(x,y){

    var _mainObject = parts.basic.g('dataDuplicator', x, y);

    var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
        _mainObject.append(backing);
        __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeAudioCombiner);


    var connectionNode_audio_in_1 = parts.dynamic.connectionNode_audio('connectionNode_audio_in_1',0,5,55-30/2,30,30,__globals.audio.context);
        _mainObject.append(connectionNode_audio_in_1);
    var connectionNode_audio_in_2 = parts.dynamic.connectionNode_audio('connectionNode_audio_in_2',0,75-30-5,55-30/2,30,30,__globals.audio.context);
        _mainObject.append(connectionNode_audio_in_2);

    var connectionNode_audio_out_1 = parts.dynamic.connectionNode_audio('connectionNode_audio_out_1',1,75/2-30/2,-30/2,30,30,__globals.audio.context);
        _mainObject.append(connectionNode_audio_out_1);


    connectionNode_audio_in_1.out().connect(connectionNode_audio_out_1.in());
    connectionNode_audio_in_2.out().connect(connectionNode_audio_out_1.in());


    _mainObject.movementRedraw = function(){
        connectionNode_audio_in_1.redraw();
        connectionNode_audio_in_2.redraw();
        connectionNode_audio_out_1.redraw();
    };

    _mainObject.io = {};
    _mainObject.io.in_1 = connectionNode_audio_in_1;
    _mainObject.io.in_2 = connectionNode_audio_in_2;
    _mainObject.io.out = connectionNode_audio_out_1;

    return _mainObject;
}



var universalReadout_1 = makeUniversalReadout(700,300);
__globals.panes.middleground.append( universalReadout_1 );

var midiPlayer_1 = makeMidiPlayer(500,50);
__globals.panes.middleground.append( midiPlayer_1 );

var dataDuplicator_1 = makeDataDuplicator(800,100);
__globals.panes.middleground.append( dataDuplicator_1 );


var simpleSynthesizer_1 = makeSimpleSynthesizer(200,80);
__globals.panes.middleground.append( simpleSynthesizer_1 );
var simpleSynthesizer_2 = makeSimpleSynthesizer(200,180);
__globals.panes.middleground.append( simpleSynthesizer_2 );
var simpleSynthesizer_3 = makeSimpleSynthesizer(200,280);
__globals.panes.middleground.append( simpleSynthesizer_3 );
var simpleSynthesizer_4 = makeSimpleSynthesizer(200,380);
__globals.panes.middleground.append( simpleSynthesizer_4 );

var audioCombiner_1 = makeAudioCombiner(50,150);
__globals.panes.middleground.append( audioCombiner_1 );
var audioCombiner_2 = makeAudioCombiner(20,250);
__globals.panes.middleground.append( audioCombiner_2 );
var audioCombiner_3 = makeAudioCombiner(90,350);
__globals.panes.middleground.append( audioCombiner_3 );

var audioSink_1 = makeAudioSink(25,25);
__globals.panes.middleground.append( audioSink_1 );






simpleSynthesizer_1.io.dataIn_gain.receive('%',0.24);

simpleSynthesizer_2.io.dataIn_gain.receive('%',0.24);
simpleSynthesizer_2.io.dataIn_release.receive('%',0.1);
simpleSynthesizer_2.io.dataIn_type.receive('discrete',1);
simpleSynthesizer_2.io.dataIn_octave.receive('discrete',4);

simpleSynthesizer_3.io.dataIn_gain.receive('%',0.4);
simpleSynthesizer_3.io.dataIn_attack.receive('%',0.1);
simpleSynthesizer_3.io.dataIn_release.receive('%',0.1);
simpleSynthesizer_3.io.dataIn_type.receive('discrete',1);
simpleSynthesizer_3.io.dataIn_octave.receive('discrete',4);

simpleSynthesizer_4.io.dataIn_gain.receive('%',0.24);
simpleSynthesizer_4.io.dataIn_attack.receive('%',0.1);
simpleSynthesizer_4.io.dataIn_release.receive('%',0.1);
simpleSynthesizer_4.io.dataIn_type.receive('discrete',1);
simpleSynthesizer_4.io.dataIn_octave.receive('discrete',5);






midiPlayer_1.io.out[1].connectTo(simpleSynthesizer_1.io.dataIn_midiNote);
midiPlayer_1.io.out[2].connectTo(simpleSynthesizer_2.io.dataIn_midiNote);
midiPlayer_1.io.out[3].connectTo(simpleSynthesizer_3.io.dataIn_midiNote);
    // midiPlayer_1.io.out[3].connectTo(dataDuplicator_1.io.in);
    // dataDuplicator_1.io.out_1.connectTo(simpleSynthesizer_3.io.dataIn_midiNote);
    // dataDuplicator_1.io.out_2.connectTo(universalReadout_1.io.in);
midiPlayer_1.io.out[4].connectTo(simpleSynthesizer_4.io.dataIn_midiNote);

simpleSynthesizer_1.io.audioOut.connectTo(audioCombiner_2.io.in_1);
simpleSynthesizer_2.io.audioOut.connectTo(audioCombiner_2.io.in_2);
simpleSynthesizer_3.io.audioOut.connectTo(audioCombiner_3.io.in_1);
simpleSynthesizer_4.io.audioOut.connectTo(audioCombiner_3.io.in_2);

audioCombiner_2.io.out.connectTo(audioCombiner_1.io.in_1);
audioCombiner_3.io.out.connectTo(audioCombiner_1.io.in_2);

audioCombiner_1.io.out.connectTo(audioSink_1.io.in);

        }
    }

// })();
