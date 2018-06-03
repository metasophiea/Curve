parts.dynamic.needleOverlay = function(
    id='needleOverlay',
    x, y, width, height, angle=0,
    needleStyles=['fill:rgba(240, 240, 240, 1);','fill:rgba(255, 231, 114, 1);'],
    areaStyles=['fill:rgba(255, 231, 114, 0.33);']
){
    var needleWidth = 0.005;//0.00125;
    var needleData = {};

    //elements
        //main
            var object = parts.basic.g(id, x, y, angle);
        //backing
            var backing = parts.basic.rect('backing', 0, 0, width, height, 0, 'fill:rgba(100,100,100, 0.33);');
            object.appendChild(backing);
        //control objects
            var invisibleHandleWidth = width*needleWidth + width*0.005;
            var controlObjects = {};
                //lead
                controlObjects.lead = parts.basic.g('lead', 0, 0, 0);
                controlObjects.lead.append(parts.basic.rect('handle', 0, 0, needleWidth*width, height, 0, needleStyles[0]));
                controlObjects.lead.append(parts.basic.rect('invisibleHandle', (width*needleWidth - invisibleHandleWidth)/2, 0, invisibleHandleWidth, height, 0, 'fill:rgba(255,0,0,0);cursor: col-resize;'));
                //selection_A
                controlObjects.selection_A = parts.basic.g('selection_A', 0, 0, 0);
                controlObjects.selection_A.append(parts.basic.rect('handle', 0, 0, needleWidth*width, height, 0, needleStyles[1]));
                controlObjects.selection_A.append(parts.basic.rect('invisibleHandle', (width*needleWidth - invisibleHandleWidth)/2, 0, invisibleHandleWidth, height, 0, 'fill:rgba(255,0,0,0);cursor: col-resize;'));
                //selection_B
                controlObjects.selection_B = parts.basic.g('selection_B', 0, 0, 0);
                controlObjects.selection_B.append(parts.basic.rect('handle', 0, 0, needleWidth*width, height, 0, needleStyles[1]));
                controlObjects.selection_B.append(parts.basic.rect('invisibleHandle', (width*needleWidth - invisibleHandleWidth)/2, 0, invisibleHandleWidth, height, 0, 'fill:rgba(255,0,0,0);cursor: col-resize;'));
                //selection_area
                controlObjects.selection_area = parts.basic.rect('selection_area', 0, 0, 0, height, 0, areaStyles[0]+'cursor: move;');
            var controlObjectsGroup = parts.basic.g('controlObjectsGroup', 0, 0);
            object.append(controlObjectsGroup);

    //internal functions
        function positionFromPoint(event){
            var elementOrigin = __globals.utility.element.getCumulativeTransform(object);
            var mouseClick = __globals.utility.workspace.pointConverter.browser2workspace(event.offsetX,event.offsetY);

            var temp = __globals.utility.math.cartesian2polar(
                mouseClick.x-elementOrigin.x,
                mouseClick.y-elementOrigin.y
            );
            temp.ang -= angle;
            temp = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);

            return {x:temp.x/width,y:temp.y/height};
        }
        function jumpTo(location){
            if(location == undefined){
                controlObjects.lead.remove();
                delete needleData['lead'];
                return;
            }
            if( !controlObjectsGroup.contains(controlObjects.lead) ){
                controlObjectsGroup.append(controlObjects.lead);
            }
            __globals.utility.element.setTransform_XYonly( controlObjects.lead, location*width - width*needleWidth*location, 0);
            needleData['lead'] = location;
        }
        function select(start,end){
            if( start == undefined && end == undefined ){
                controlObjects.selection_A.remove();
                controlObjects.selection_B.remove();
                controlObjects.selection_area.remove();
                delete needleData['selection_A'];
                delete needleData['selection_B'];
                return;
            }

            if( !controlObjectsGroup.contains(controlObjects.selection_A) ){
                controlObjectsGroup.append(controlObjects.selection_area);
                controlObjectsGroup.append(controlObjects.selection_A);
                controlObjectsGroup.append(controlObjects.selection_B);
            }

            select_a(start);
            select_b(end);
            computeSelectionArea();
        }
        function select_a(location){
            __globals.utility.element.setTransform_XYonly( controlObjects.selection_A, width*(location - needleWidth*location), 0);
            needleData['selection_A'] = location;
            computeSelectionArea();
        }
        function select_b(location){
            __globals.utility.element.setTransform_XYonly( controlObjects.selection_B, width*(location - needleWidth*location), 0);
            needleData['selection_B'] = location;
            computeSelectionArea();
        }
        function computeSelectionArea(){
            var start = needleData['selection_A'];
            var end = needleData['selection_B'];
            if(start > end){var temp = start; start = end; end = temp;}
            var area = end - start;
            __globals.utility.element.setTransform_XYonly( controlObjects.selection_area, width*(start + (1-start)*needleWidth), 0);
            controlObjects.selection_area.setAttribute('width',width*(area - (1+end)*needleWidth ));
        }

    //interaction
        backing.onmousedown = function(event){
            if(!event.shiftKey){
                jumpTo(positionFromPoint(event).x);
            }else{
                var initialValue = positionFromPoint(event).x;
                select_a(initialValue);
            }
        };

    //controls
    //callbacks
    //setup
        jumpTo(1);
        select(0.4,0.2);

    return object;
};