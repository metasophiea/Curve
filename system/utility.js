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