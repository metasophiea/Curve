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















    this.generateSelectionArea = function(points, _mainObject){
        _mainObject.selectionArea = {};
        _mainObject.selectionArea.box = [];
        _mainObject.selectionArea.points = [];
        _mainObject.updateSelectionArea = function(){
            //the main shape we want to use
            _mainObject.selectionArea.points = [];
            points.forEach(function(item){ _mainObject.selectionArea.points.push(item.slice()); });
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
    element.style = 'transform: translate('+0+'px,'+0+'px) scale(1) rotate('+0+'rad);' + style;

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
this.segmentDisplay = function(
    id='segmentDisplay',
    x, y, width, height,
    backgroundStyle='fill:rgb(0,0,0)',
    glowStyle='fill:rgb(200,200,200)',
    dimStyle='fill:rgb(20,20,20)'
){
    var margin = width/8;
    var division = width/8;
    var shapes = {
        segments:{
            points: {
                top:{
                    left:[
                        {x:division*1.0+margin,         y:division*1.0+margin},
                        {x:division*0.5+margin,         y:division*0.5+margin},
                        {x:division*1.0+margin,         y:division*0.0+margin},
                        {x:division*0.0+margin,         y:division*1.0+margin},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:division*0.0+margin},
                        {x:width-division*0.5-margin,   y:division*0.5+margin},
                        {x:width-division*1.0-margin,   y:division*1.0+margin},
                        {x:width-division*0.0-margin,   y:division*1.0+margin}
                    ]
                },
                middle: {
                    left:[
                        {x:division*1.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                        {x:division*0.5+margin,         y:height*0.5-division*0.5+margin*0.5},
                        {x:division*1.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                        {x:division*0.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                        {x:division*0.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height*0.5-division*0.0+margin*0.5},
                        {x:width-division*0.5-margin,   y:height*0.5-division*0.5+margin*0.5},
                        {x:width-division*1.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                        {x:width-division*0.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                        {x:width-division*0.0-margin,   y:height*0.5-division*0.0+margin*0.5}
                    ]
                },
                bottom: {
                    left:[
                        {x:division*1.0+margin,         y:height-division*1.0-margin},
                        {x:division*0.5+margin,         y:height-division*0.5-margin},
                        {x:division*1.0+margin,         y:height-division*0.0-margin},
                        {x:division*0.0+margin,         y:height-division*1.0-margin},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height-division*0.0-margin},
                        {x:width-division*0.5-margin,   y:height-division*0.5-margin},
                        {x:width-division*1.0-margin,   y:height-division*1.0-margin},
                        {x:width-division*0.0-margin,   y:height-division*1.0-margin}
                    ]
                }
            }
        }
    };

    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //backing
        var rect = parts.basic.rect(null, 0, 0, width, height, 0, backgroundStyle);
            object.appendChild(rect);

        //segments
            var segments = [];
            var points = [
                [
                    [shapes.segments.points.top.left[0].x,  shapes.segments.points.top.left[0].y],
                    [shapes.segments.points.top.right[2].x, shapes.segments.points.top.right[2].y],
                    [shapes.segments.points.top.right[1].x, shapes.segments.points.top.right[1].y],
                    [shapes.segments.points.top.right[0].x, shapes.segments.points.top.right[0].y],
                    [shapes.segments.points.top.left[2].x,  shapes.segments.points.top.left[2].y],
                    [shapes.segments.points.top.left[1].x,  shapes.segments.points.top.left[1].y],
                ],
                [
                    [shapes.segments.points.top.left[1].x,    shapes.segments.points.top.left[1].y],
                    [shapes.segments.points.top.left[3].x,    shapes.segments.points.top.left[3].y],
                    [shapes.segments.points.middle.left[3].x, shapes.segments.points.middle.left[3].y],
                    [shapes.segments.points.middle.left[1].x, shapes.segments.points.middle.left[1].y],
                    [shapes.segments.points.middle.left[0].x, shapes.segments.points.middle.left[0].y],
                    [shapes.segments.points.top.left[0].x,    shapes.segments.points.top.left[0].y],
                ],
                [
                    [shapes.segments.points.top.right[1].x,    shapes.segments.points.top.right[1].y],
                    [shapes.segments.points.top.right[3].x,    shapes.segments.points.top.right[3].y],
                    [shapes.segments.points.middle.right[3].x, shapes.segments.points.middle.right[3].y],
                    [shapes.segments.points.middle.right[1].x, shapes.segments.points.middle.right[1].y],
                    [shapes.segments.points.middle.right[2].x, shapes.segments.points.middle.right[2].y],
                    [shapes.segments.points.top.right[2].x,    shapes.segments.points.top.right[2].y],
                ],
                [
                    [shapes.segments.points.middle.left[0].x,  shapes.segments.points.middle.left[0].y],
                    [shapes.segments.points.middle.right[2].x, shapes.segments.points.middle.right[2].y],
                    [shapes.segments.points.middle.right[1].x, shapes.segments.points.middle.right[1].y],
                    [shapes.segments.points.middle.right[0].x, shapes.segments.points.middle.right[0].y],
                    [shapes.segments.points.middle.left[2].x,  shapes.segments.points.middle.left[2].y],
                    [shapes.segments.points.middle.left[1].x,  shapes.segments.points.middle.left[1].y],
                ],
                [
                    [shapes.segments.points.middle.left[1].x, shapes.segments.points.middle.left[1].y],
                    [shapes.segments.points.middle.left[4].x, shapes.segments.points.middle.left[4].y],
                    [shapes.segments.points.bottom.left[3].x, shapes.segments.points.bottom.left[3].y],
                    [shapes.segments.points.bottom.left[1].x, shapes.segments.points.bottom.left[1].y],
                    [shapes.segments.points.bottom.left[0].x, shapes.segments.points.bottom.left[0].y],
                    [shapes.segments.points.middle.left[2].x, shapes.segments.points.middle.left[2].y],
                ],
                [
                    [shapes.segments.points.middle.right[1].x, shapes.segments.points.middle.right[1].y],
                    [shapes.segments.points.middle.right[4].x, shapes.segments.points.middle.right[4].y],
                    [shapes.segments.points.bottom.right[3].x, shapes.segments.points.bottom.right[3].y],
                    [shapes.segments.points.bottom.right[1].x, shapes.segments.points.bottom.right[1].y],
                    [shapes.segments.points.bottom.right[2].x, shapes.segments.points.bottom.right[2].y],
                    [shapes.segments.points.middle.right[0].x, shapes.segments.points.middle.right[0].y],
                ],
                [
                    [shapes.segments.points.bottom.left[0].x,  shapes.segments.points.bottom.left[0].y],
                    [shapes.segments.points.bottom.right[2].x, shapes.segments.points.bottom.right[2].y],
                    [shapes.segments.points.bottom.right[1].x, shapes.segments.points.bottom.right[1].y],
                    [shapes.segments.points.bottom.right[0].x, shapes.segments.points.bottom.right[0].y],
                    [shapes.segments.points.bottom.left[2].x,  shapes.segments.points.bottom.left[2].y],
                    [shapes.segments.points.bottom.left[1].x,  shapes.segments.points.bottom.left[1].y],
                ]
            ];
            for(var a = 0; a < points.length; a++){
                var temp = {
                    segment: parts.basic.path(null, points[a], 'L', dimStyle),
                    state: false
                };
                segments.push( temp );
                object.append( temp.segment );
            }


    //methods
        object.set = function(segment,state){
            segments[segment].state = state;
            if(state){ __globals.utility.setStyle(segments[segment].segment,glowStyle); }
            else{ __globals.utility.setStyle(segments[segment].segment,dimStyle); }
        };
        object.get = function(segment){ return segments[segment].state; };
        object.clear = function(){
            for(var a = 0; a < segments.length; a++){
                this.set(a,false);
            }
        };

        object.enterCharacter = function(char){
            var stamp = [];
            switch(char){
                case '0': stamp = [1,1,1,0,1,1,1]; break;
                case '1': stamp = [0,0,1,0,0,1,0]; break;
                case '2': stamp = [1,0,1,1,1,0,1]; break;
                case '3': stamp = [1,0,1,1,0,1,1]; break;
                case '4': stamp = [0,1,1,1,0,1,0]; break;
                case '5': stamp = [1,1,0,1,0,1,1]; break;
                case '6': stamp = [1,1,0,1,1,1,1]; break;
                case '7': stamp = [1,0,1,0,0,1,0]; break;
                case '8': stamp = [1,1,1,1,1,1,1]; break;
                case '9': stamp = [1,1,1,1,0,1,1]; break;
                default:  stamp = [0,0,0,0,0,0,0]; break;
            }

            for(var a = 0; a < stamp.length; a++){
                this.set(a, stamp[a]==1);
            }
        };

        object.test = function(){
            this.clear();
            this.enterCharacter('9');
        };

    return object;
};
this.glowbox_rect = function(
    id='glowbox_rect',
    x, y, width, height, angle=0,
    glowStyle = 'fill:rgba(240,240,240,1)',
    dimStyle = 'fill:rgba(80,80,80,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, dimStyle);
        object.appendChild(rect);

    //methods
    object.on = function(){
        __globals.utility.setStyle(rect,glowStyle);
    };
    object.off = function(){
        __globals.utility.setStyle(rect,dimStyle);
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
    object.wave = function(a=null,type=null){
        if(a==null){
            while(this._data.wave.sin.length < this._data.wave.cos.length){ this._data.wave.sin.push(0); }
            while(this._data.wave.sin.length > this._data.wave.cos.length){ this._data.wave.cos.push(0); }
            for(var a = 0; a < this._data.wave['sin'].length; a++){
                if( !this._data.wave['sin'][a] ){ this._data.wave['sin'][a] = 0; }
                if( !this._data.wave['cos'][a] ){ this._data.wave['cos'][a] = 0; }
            }
            return this._data.wave;
        }

        if(type==null){
            this._data.wave = a;
        }
        switch(type){
            case 'sin': this._data.wave.sin = a; break;
            case 'cos': this._data.wave.cos = a; break;
            default: break;
        }
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
    object.clear = function(){
        for(var y = 0; y < ycount; y++){
            for(var x = 0; x < xcount; x++){
                object.box(x,y).set(false,false);
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
    handleStyle = 'fill:rgba(180,180,180,1)',
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
        for(var b = 0; b < a.length; b++){
            this.slide(b).set(a[b],false);
        }
        for(var b = a.length; b < count; b++){
            this.slide(b).set(1/2,false);
        }

        if(update&&this.onChange){ this.onChange(a); }
    };
    object.setAll = function(a){
        for(var b = 0; b < count; b++){
            this.slide(b).set(a,false);
        }
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

__globals.objects = {};
__globals.utility.generateSelectionArea = function(points, _mainObject){
    _mainObject.selectionArea = {};
    _mainObject.selectionArea.box = [];
    _mainObject.selectionArea.points = [];
    _mainObject.updateSelectionArea = function(){
        //the main shape we want to use
        _mainObject.selectionArea.points = [];
        points.forEach(function(item){ _mainObject.selectionArea.points.push(item.slice()); });
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
};
__globals.objects.make_basicSynth = function(x,y){
    //set numbers
        var type = 'basicSynth';
        var shape = {
            base: [[0,0],[240,0],[240,40],[200,80],[0,80]],
            connector: { width: 30, height: 30 }
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
            markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
    
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)'
        };



    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //circuitry
        _mainObject.__synthesizer = new parts.audio.synthesizer(__globals.audio.context);

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.generateSelectionArea(shape.base, _mainObject);

        //panic button
            var panicButton = parts.control.button_rect('panicButton', 197.5, 47.5, 20, 20, Math.PI/4, 'fill:rgba(175,175,175,1)', 'fill:rgba(220,220,220,1)', 'fill:rgba(150,150,150,1)');
                _mainObject.append(panicButton);
                panicButton.onclick = function(){ _mainObject.__synthesizer.panic(); }

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
            _mainObject.append(parts.basic.rect(null, x+35, y+19, 5, 2, 0, style.slot));
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
            s = 15;
            _mainObject.io.dataIn_gain = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_gain', 20-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_gain);

            //attack data in
            _mainObject.io.dataIn_attack = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_attack', 20+spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_attack);

            //release data in
            _mainObject.io.dataIn_release = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_release', 20+2*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_release);

            //detune data in
            _mainObject.io.dataIn_detune = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_detune', 20+3*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_detune);

            //octave data in
            _mainObject.io.dataIn_octave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_octave', 20+4*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_octave);

            //type data in
            _mainObject.io.dataIn_type = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_type', 20+5*spacing-s/2, -s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_type);

            //periodicWave data in
            _mainObject.io.dataIn_periodicWave = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_periodicWave', 240-s/2, 20-s/2, s, s);
            _mainObject.prepend(_mainObject.io.dataIn_periodicWave);

            //midiNote data in
            s = 30;
            var rotation = Math.PI/4;
            var temp = __globals.utility.getCartesian(rotation, -s);
            _mainObject.io.dataIn_midiNote = parts.dynamic.connectionNode_data('_mainObject.io.dataIn_midiNote', 240+temp.x, 60+temp.y, s, s, rotation);
            _mainObject.prepend(_mainObject.io.dataIn_midiNote);

    //wiring
    _mainObject.__synthesizer.out().connect( _mainObject.io.audioOut.in() );

        dial_gain.onChange = function(value){ _mainObject.__synthesizer.gain( value ); };
        dial_attack.onChange = function(value){ _mainObject.__synthesizer.attack( value*10 ); };
        dial_release.onChange = function(value){ _mainObject.__synthesizer.release( value*10 ); };
        dial_detune.onChange = function(value){ _mainObject.__synthesizer.detune( value*200 - 100 ); };
        dial_octave.onChange = function(value){ _mainObject.__synthesizer.octave(value-3); };
        dial_type.onChange = function(value){_mainObject.__synthesizer.type(['sine','triangle','square','sawtooth','custom'][value]);};

        _mainObject.io.dataIn_gain.receive =    function(address,data){ if(address != '%'){return;} dial_gain.set(data); };
        _mainObject.io.dataIn_attack.receive =  function(address,data){ if(address != '%'){return;} dial_attack.set(data); }; 
        _mainObject.io.dataIn_release.receive = function(address,data){ if(address != '%'){return;} dial_release.set(data); };    
        _mainObject.io.dataIn_detune.receive =  function(address,data){ if(address != '%'){return;} dial_detune.set(data); };
        _mainObject.io.dataIn_octave.receive =  function(address,data){ if(address != 'discrete'){return;} dial_octave.select(data); };
        _mainObject.io.dataIn_type.receive =    function(address,data){ if(address != 'discrete'){return;} dial_type.select(data); };
        _mainObject.io.dataIn_midiNote.receive = function(address,data){ if(address != 'midiNumber'){return;} _mainObject.__synthesizer.perform(data); };

    //setup
        dial_gain.set(0);
        dial_detune.set(0.5);
        dial_octave.select(3);

    return _mainObject;
};
__globals.objects.make_selectorSender = function(x,y){
    //set numbers
    var type = 'selectorSender';
    var attributes = {
        value: 0,
        valueLimit: 9
    };
    var shape = {
        base: [[10,0],[55,0],[65,32.5],[45,55],[20,55],[0,32.5]],
        littleConnector: { width: 20, height: 20 },
        connectionNodes:{
            inc: {x:38.75, y:41.25, width:20, height:20, angle:-Math.PI/4},
            dec: {x:12.5, y:27.5, width:20, height:20, angle:Math.PI/4},
            send:{x:22.5, y:40, width:20, height:20, angle:0},
            out:{x:22.5, y:-5, width:20, height:20, angle:0}
        },
        readouts: [
            {x: 26.25,   y: 7.5, width: 12.5, height: 25},
        ],
        incButton: {x: 40, y: 10, width: 10, height: 20},
        decButton: {x: 15, y: 10, width: 10, height: 20},
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        readout: 'fill:rgba(0,0,0,1); font-size:12px; font-family:Courier New;',
        readoutBacking: 'fill:rgba(0,0,0,1);',
        button: {
            up: 'fill:rgba(175,175,175,1)',
            hover: 'fill:rgba(220,220,220,1)',
            down: 'fill:rgba(150,150,150,1)'
        },
    };


    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);


        //buttons
            //inc
            var incButton = parts.control.button_rect('incButton', shape.incButton.x, shape.incButton.y, shape.incButton.width, shape.incButton.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(incButton);
                incButton.onclick = function(){ incValue(); }

            //dec
            var decButton = parts.control.button_rect('resetButton', shape.decButton.x, shape.decButton.y, shape.decButton.width, shape.decButton.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(decButton);
                decButton.onclick = function(){ decValue(); }

        //readout
            var segmentDisplays = [];
            for(var a = 0; a < shape.readouts.length; a++){
                var temp = parts.display.segmentDisplay(null, shape.readouts[a].x, shape.readouts[a].y, shape.readouts[a].width, shape.readouts[a].height);
                    _mainObject.append(temp);
                    segmentDisplays.push(temp);
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in_inc = parts.dynamic.connectionNode_data('_mainObject.io.in_inc', shape.connectionNodes.inc.x, shape.connectionNodes.inc.y, shape.connectionNodes.inc.width, shape.connectionNodes.inc.height, shape.connectionNodes.inc.angle);
            _mainObject.prepend(_mainObject.io.in_inc);
            _mainObject.io.in_inc.receive = function(address,data){if(address!='pulse'){return;}incValue();};
        _mainObject.io.in_dec = parts.dynamic.connectionNode_data('_mainObject.io.in_dec', shape.connectionNodes.dec.x, shape.connectionNodes.dec.y, shape.connectionNodes.dec.width, shape.connectionNodes.dec.height, shape.connectionNodes.dec.angle);
            _mainObject.prepend(_mainObject.io.in_dec);
            _mainObject.io.in_dec.receive = function(address,data){if(address!='pulse'){return;}decValue();};
        _mainObject.io.in_send = parts.dynamic.connectionNode_data('_mainObject.io.in_send', shape.connectionNodes.send.x, shape.connectionNodes.send.y, shape.connectionNodes.send.width, shape.connectionNodes.send.height, shape.connectionNodes.send.angle);
            _mainObject.prepend(_mainObject.io.in_send);    
            _mainObject.io.in_send.receive = function(address,data){if(address!='pulse'){return;}sendValue();};
        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', shape.connectionNodes.out.x, shape.connectionNodes.out.y, shape.connectionNodes.out.width, shape.connectionNodes.out.height, shape.connectionNodes.out.angle);
            _mainObject.prepend(_mainObject.io.out);     
            
    //internal workings
        function render(){
            segmentDisplays[0].enterCharacter(''+attributes.value);
        }
        function incValue(){
            attributes.value = attributes.value >= attributes.valueLimit ? 0 : attributes.value+1;
            render();
        }
        function decValue(){
            attributes.value = attributes.value <= 0 ? attributes.valueLimit : attributes.value-1;
            render();
        }
        function sendValue(){ _mainObject.io.out.send('discrete',attributes.value); }
            
    //setup
        render();

    return _mainObject;
};
__globals.objects.make_pulseClock = function(x,y){
    //set numbers
        var type = 'pulseClock';
        var attributes = {
            tempoLimits: {low:60, high:240},
            interval: null
        };
        var shape = {
            base: [[0,0],[90,0],[90,40],[0,40]],
            connector: { width: 20, height: 20 },
            readoutBacking :{x:45, y: 7.5, width: 12.5*3, height: 25},
            readouts: [
                {x: 45,   y: 7.5, width: 12.5, height: 25},
                {x: 57.5, y: 7.5, width: 12.5, height: 25},
                {x: 70,   y: 7.5, width: 12.5, height: 25},
            ],
            dial: {x: 0, y: 2}
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(150,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            },
            readout: 'fill:rgba(0,0,0,1); font-size:12px; font-family:Courier New;',
            readoutBacking: 'fill:rgba(0,0,0,1);'
        };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.generateSelectionArea(shape.base, _mainObject);

        //tempo dial
            _mainObject.append(parts.display.label(null, shape.dial.x+7,    shape.dial.y+34, '60',        style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '150',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '240',       style.text));
            var dial_tempo = parts.control.dial_continuous(
                'dial_tempo', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_tempo);
            dial_tempo.ondblclick = function(){ this.set(1/3); };
            dial_tempo.onChange = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                setReadout(data);
            };
            dial_tempo.onRelease = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                setReadout(data);
                startClock(data);
            };

        //tempo readout
            _mainObject.append( parts.basic.rect(null, shape.readoutBacking.x, shape.readoutBacking.y, shape.readoutBacking.width, shape.readoutBacking.height, 0, style.readoutBacking) );

            var segmentDisplays = [];
            for(var a = 0; a < shape.readouts.length; a++){
                var temp = parts.display.segmentDisplay(null, shape.readouts[a].x, shape.readouts[a].y, shape.readouts[a].width, shape.readouts[a].height);
                    _mainObject.append(temp);
                    segmentDisplays.push(temp);
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2][1]-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
            _mainObject.prepend(_mainObject.io.out);

    //internal workings
        function setReadout(num){
            num = ''+num;
            while(num.length < 3){ num = '0'+num;}
            for(var a = 0; a < num.length; a++){ segmentDisplays[a].enterCharacter(num[a]); }
        }
    
        function startClock(tempo){
            if(attributes.interval){
                clearInterval(attributes.interval);
            }

            attributes.interval = setInterval(function(){
                _mainObject.io.out.send('pulse');
            },1000*(60/tempo));
        }

    //setup
        dial_tempo.set(1/3);
            
    return _mainObject;
};
__globals.objects.make_dataDuplicator = function(x,y){
    //set numbers
    var type = 'dataDuplicator';
    var shape = {
        base: [[0,0],[55,0],[55,55],[0,55]],
        littleConnector: { width: 20, height: 20 },
        markings:{
            rect:[
                //flow lines
                {x:(20/4), y:(20*0.25 + 20/2), width:45, height:2, angle:0}, //top horizontal
                {x:(55*0.5), y:(20*0.25 + 20/2), width:2, height:25, angle:0}, //vertical
                {x:(55*0.5), y:(20*1.5  + 20/2), width:22.5, height:2, angle:0} //bottom horizontal
            ],
            path:[
                [[(55-10),(20*0 + 20/2)+1],[(55-2.5),(20*0.25 + 20/2)+1],[(55-10),(20*0.5 + 20/2)+1]], //upper arrow
                [[(55-10),(20*1.25 + 20/2)+1],[(55-2.5),(20*1.5 + 20/2)+1],[(55-10),(20*1.75 + 20/2)+1]] //lower arrow
            ]
        }
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        markings: 'fill:rgba(150,150,150,1)',
    };


    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.generateSelectionArea(shape.base, _mainObject);

        //markings
            for(var a = 0; a < shape.markings.rect.length; a++){
                _mainObject.append(parts.basic.rect(null, shape.markings.rect[a].x,shape.markings.rect[a].y,shape.markings.rect[a].width,shape.markings.rect[a].height,shape.markings.rect[a].angle, style.markings));
            }
            for(var a = 0; a < shape.markings.path.length; a++){
                _mainObject.append(parts.basic.path(null, shape.markings.path[a], 'L', style.markings));
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in = parts.dynamic.connectionNode_data('_mainObject.io.in', -shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.in);
            _mainObject.io.in.receive = function(address,data){
                _mainObject.io.out_1.send(address,data);
                _mainObject.io.out_2.send(address,data);
            };
        _mainObject.io.out_1 = parts.dynamic.connectionNode_data('_mainObject.io.out_1', shape.base[2][0]-shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out_1);
        _mainObject.io.out_2 = parts.dynamic.connectionNode_data('_mainObject.io.out_2', shape.base[2][0]-shape.littleConnector.width/2, shape.littleConnector.height*1.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out_2);
    

    return _mainObject;
};

//Operation Instructions
//  Data signals that are sent into the in port, are duplicated and sent out the two out ports
//  Note: they are not sent out at the same time; signals are produced from the 1st out port
//        first and then the 2nd port. 
__globals.objects.make_accumulator = function(x,y){
    //set numbers
    var type = 'accumulator';
    var attributes = {
        levels: 8,
        currentLevel: 0
    };
    var shape = {
        base: [[0,0],[40,0],[65,25],[65,55],[0,55]],
        littleConnector: { width: 20, height: 20 },
        glowboxArea: {x:5, y:2.5, width:30, height:50, gappage:1},
        resetButton: {x: 45, y: 10, width: 20, height: 10},
        markings:{
            rect:[
                {x:(65*0.575), y:(20*1.5  + 20/2)-1, width:22.5, height:2, angle:0}
            ],
            path:[
                [[(65-10),(20*1.25 + 20/2)],[(65-2.5),(20*1.5 + 20/2)],[(65-10),(20*1.75 + 20/2)]]
            ]
        }
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        markings: 'fill:rgba(150,150,150,1)',
        button: {
            up: 'fill:rgba(175,175,175,1)',
            hover: 'fill:rgba(220,220,220,1)',
            down: 'fill:rgba(150,150,150,1)'
        },
    };


    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //markings
            for(var a = 0; a < shape.markings.rect.length; a++){
                _mainObject.append(parts.basic.rect(null, shape.markings.rect[a].x,shape.markings.rect[a].y,shape.markings.rect[a].width,shape.markings.rect[a].height,shape.markings.rect[a].angle, style.markings));
            }
            for(var a = 0; a < shape.markings.path.length; a++){
                _mainObject.append(parts.basic.path(null, shape.markings.path[a], 'L', style.markings));
            }

        //glowboxes
        var glowboxeBacking = parts.basic.rect(null, shape.glowboxArea.x, shape.glowboxArea.y, shape.glowboxArea.width, shape.glowboxArea.height, 0, 'fill:rgb(20,20,20)');
            _mainObject.append(glowboxeBacking);

        var glowboxes = [];
        var height = (2*shape.glowboxArea.height - 1)/(2*attributes.levels);
        for(var a = 0; a < attributes.levels; a++){
            var temp = parts.display.glowbox_rect(
                null, 
                shape.glowboxArea.x+shape.glowboxArea.gappage/2,
                shape.glowboxArea.y+a*height+(shape.glowboxArea.gappage/2),
                shape.glowboxArea.width-shape.glowboxArea.gappage,
                height-(shape.glowboxArea.gappage/2),
                0
            );
                _mainObject.append(temp);
                glowboxes.push(temp);
        }

        //reset
            var resetButton = parts.control.button_rect('resetButton', shape.resetButton.x, shape.resetButton.y, shape.resetButton.width, shape.resetButton.height, Math.PI/4, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(resetButton);
                resetButton.onclick = function(){ reset(); }


    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in = parts.dynamic.connectionNode_data('_mainObject.io.in', shape.littleConnector.width*0.5, -shape.littleConnector.height*0.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.in);
            _mainObject.io.in.receive = function(address,data){if(address!='pulse'){return;}accumulate();};
        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', shape.base[3][0]-shape.littleConnector.width*0.5, shape.base[3][1]-shape.littleConnector.height*1.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out);


    //internal workings
        function accumulate(){
            attributes.currentLevel++;
            if(attributes.currentLevel == attributes.levels){ reset(); }
            else{ glowboxes[attributes.levels-attributes.currentLevel-1].on(); }
        }
        function reset(){ 
            attributes.currentLevel = 0;
            _mainObject.io.out.send('pulse');
            for(var a = 0; a < attributes.levels; a++){
                glowboxes[a].off();
            }
            glowboxes[attributes.levels-1].on();
        }

    //setup
        reset();

    return _mainObject;
};
__globals.objects.make_audioSink = function(x,y){
    //set numbers
        var type = 'audioSink';
        var size = {
            base: { width: 100, height: 50 },
            connector: { width: 30, height: 30 }
        };
        var style = {
            background: 'fill:rgba(200,200,200,1)',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'
        };



    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //circuitry
    _mainObject._destination = __globals.audio.context;

    //elements
        //backing
        var backing = parts.basic.rect(null, 0, 0, size.base.width, size.base.height, 0, style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        _mainObject.append(parts.display.label(null, 20, 22.5, 'audio sink',style.text));
            
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


    //connection nodes
        _mainObject.io = {};
        _mainObject.io.audio_in = parts.dynamic.connectionNode_audio('connectionNode_audio', 0, size.base.width/2 - size.connector.width/2, size.base.height-size.connector.height/2, size.connector.width, size.connector.height, __globals.audio.context);
            _mainObject.io.audio_in.out().connect(__globals.audio.context.destination);
            _mainObject.append(_mainObject.io.audio_in);

    return _mainObject;
}
__globals.objects.make_launchpad = function(x,y){
    //set numbers
        var type = 'launchpad';
        var variables = {
            pageCount: 10,
            currentPage: 0,
            pages: [],
        };
        var attributes = {
            notes: ['5C', '4B', '4A', '4G', '4F', '4E', '4D', '4C'],
            stage: 0,
            prevStage: 0
        };
        var shape = {
            base: [[0,0],[150,0],[150,120],[0,120]],
            connector: { width: 30, height: 30 },
            littleConnector: { width: 20, height: 20 },
            grid: {x: 10, y: 10, width: 100, height: 100, xCount: 8, yCount: 8},
            manualPulse: {x: 115, y: 10, width: 30, height: 20},
            nextPage: {x: 115, y: 35, width: 15, height: 10},
            prevPage: {x: 115, y: 45, width: 15, height: 10},
            dial: {x: 110, y: 70},
            pageNumberReadout: {x: 131, y: 35, width: 14, height: 20}
        };
        var style = {        
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            grid: {
                backingStyle: 'fill:rgba(200,175,200,1)',
                checkStyle: 'fill:rgba(150,125,150,1)',
                backingGlowStyle: 'fill:rgba(225,175,225,1)',
                checkGlowStyle:'fill:rgba(200,125,200,1)'
            },
            button: {
                up: 'fill:rgba(175,175,175,1)',
                hover: 'fill:rgba(220,220,220,1)',
                down: 'fill:rgba(150,150,150,1)'
            },
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(250,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            }
        };
    
    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    var keycaptureObj = __globals.keyboardInteraction.declareKeycaptureObject(_mainObject);
        keycaptureObj.keyPress = function(key){
            switch(key){
                case ' ': manualPulse.onclick(); break;
                case 'ArrowUp': nextPage.onclick(); break;
                case 'ArrowDown': prevPage.onclick(); break;
            }
        };

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.generateSelectionArea(shape.base, _mainObject);

        //grid
        var rastorgrid = parts.control.rastorgrid('rastorgrid', shape.grid.x, shape.grid.y, shape.grid.width, shape.grid.height, shape.grid.xCount, shape.grid.yCount, style.grid.backingStyle, style.grid.checkStyle, style.grid.backingGlowStyle, style.grid.checkGlowStyle);
            _mainObject.append(rastorgrid);

        //velocity dial
            _mainObject.append(parts.display.label(null, shape.dial.x+10,   shape.dial.y+40, 'velocity',  style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+7,    shape.dial.y+34, '0',         style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '1/2',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '1',         style.text));
            var dial_velocity = parts.control.dial_continuous(
                'dial_velocity', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_velocity);

        //manual pulse
            var manualPulse = parts.control.button_rect('manualPulse', shape.manualPulse.x, shape.manualPulse.y, shape.manualPulse.width, shape.manualPulse.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(manualPulse);
            manualPulse.onclick = function(){ progress(); }

        //page turners
            var nextPage = parts.control.button_rect('nextPage', shape.nextPage.x, shape.nextPage.y, shape.nextPage.width, shape.nextPage.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(nextPage);
                nextPage.onclick = function(){ setPage(variables.currentPage+1); }
            var prevPage = parts.control.button_rect('prevPage', shape.prevPage.x, shape.prevPage.y, shape.prevPage.width, shape.prevPage.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(prevPage);
                prevPage.onclick = function(){ setPage(variables.currentPage-1); }
            var pageNumberReadout = parts.display.segmentDisplay(null, shape.pageNumberReadout.x, shape.pageNumberReadout.y, shape.pageNumberReadout.width, shape.pageNumberReadout.height);
                _mainObject.append(pageNumberReadout);

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2][1]-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
            _mainObject.prepend(_mainObject.io.out);
        _mainObject.io.pulseIn = parts.dynamic.connectionNode_data('_mainObject.io.pulseIn', shape.base[2][0]-shape.littleConnector.width/2, shape.littleConnector.height*0.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.pulseIn);
            _mainObject.io.pulseIn.receive = function(address,data){if(address!='pulse'){return;} progress(); };
        _mainObject.io.pageSelect = parts.dynamic.connectionNode_data('_mainObject.io.pageSelect', shape.base[2][0]-shape.littleConnector.width/2, shape.littleConnector.height*1.75, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.pageSelect);
            _mainObject.io.pageSelect.receive = function(address,data){if(address!='discrete'){return;}setPage(data);};
    
    //internal workings
        function setPage(pageNumber){
            pageNumber = pageNumber<0 ? variables.pageCount-1 : pageNumber;
            pageNumber = pageNumber>variables.pageCount-1 ? 0 : pageNumber;

            //save the current page to memory only if we're not switching to the same page
            if(pageNumber != variables.currentPage){ variables.pages[variables.currentPage] = rastorgrid.get(); }

            if( variables.pages[pageNumber] ){ rastorgrid.set(variables.pages[pageNumber]); }
            else{ rastorgrid.clear();  }

            pageNumberReadout.enterCharacter(''+pageNumber);

            variables.currentPage = pageNumber;
        }
        function progress(){
            for(var a = 0; a < shape.grid.yCount; a++){
                rastorgrid.light(attributes.prevStage,a,false);
                _mainObject.io.out.send('midiNumber',{'num':__globals.audio.names_midinumbers[attributes.notes[a]], 'velocity':0});
            }

            for(var a = 0; a < shape.grid.yCount; a++){
                rastorgrid.light(attributes.stage,a,true);
                if( rastorgrid.box(attributes.stage,a).get() ){ _mainObject.io.out.send('midiNumber',{'num':__globals.audio.names_midinumbers[attributes.notes[a]], 'velocity':dial_velocity.get()}); }
            }

            attributes.prevStage = attributes.stage; 
            attributes.stage++;
            if(attributes.stage>=attributes.notes.length){attributes.stage=0;}
        }

    //import/export
        _mainObject.importData = function(data){
            variables.pages = data.pages;
            variables.currentPage = data.currentPage;
            dial_velocity.set(data.velocityDial);
            setPage(variables.currentPage);
        };
        _mainObject.exportData = function(){
            //push current page
            variables.pages[variables.currentPage] = rastorgrid.get();

            return {
                pages: variables.pages,
                currentPage: variables.currentPage,
                velocityDial: dial_velocity.get()
            };
        };

    //setup
        dial_velocity.set(0.5)
        setPage(0);

    return _mainObject;
};






var audioSink_1 = __globals.objects.make_audioSink(25,25);
__globals.panes.middleground.append( audioSink_1 );

var basicSynth_1 = __globals.objects.make_basicSynth(200,25);
__globals.panes.middleground.append( basicSynth_1 );

var launchpad_1 = __globals.objects.make_launchpad(500,25);
__globals.panes.middleground.append( launchpad_1 );

var pulseClock_1 = __globals.objects.make_pulseClock(700,25);
__globals.panes.middleground.append( pulseClock_1 );

var dataDuplicator_1 = __globals.objects.make_dataDuplicator(200,250);
__globals.panes.middleground.append( dataDuplicator_1 );

var accumulator_1 = __globals.objects.make_accumulator(300,250);
__globals.panes.middleground.append( accumulator_1 );

var selectorSender_1 = __globals.objects.make_selectorSender(100,250);
__globals.panes.middleground.append( selectorSender_1 );

pulseClock_1.io.out.connectTo(launchpad_1.io.pulseIn);
launchpad_1.io.out.connectTo(basicSynth_1.io.dataIn_midiNote);
basicSynth_1.io.audioOut.connectTo(audioSink_1.io.audio_in);



// __globals.utility.gotoPosition(-1631.06, -1044.94, 4.59435, 0);

        }
    }

// })();
