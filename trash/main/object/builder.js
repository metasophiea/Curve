object.builder = function(creatorMethod,design){ 
    //main
        var obj = part.builder('g',design.name,{x:design.x, y:design.y});
        if(design.base.type == undefined){design.base.type = 'path';}
        obj.name = design.name;
        obj.collection = design.collection;
        obj.clippingActive = design.clippingActive == undefined ? true : design.clippingActive;
    
    //generate selection area
        switch(design.base.type){
            case 'rect':
                //generate selection area
                    design.base.points = [{x:design.x,y:design.y}, {x:design.width,y:design.y}, {x:design.width,y:design.height}, {x:design.x,y:design.height}];
                    system.utility.object.generateSelectionArea(design.base.points, obj);
                    
                //backingbase
                    design.base = part.builder('rect',null,{x:design.base.x, y:design.base.y, width:design.base.width, height:design.base.height, angle:design.base.angle, style:design.base.style});
            break;
            case 'circle': 
                //generate selection area
                    var res = 12; //(number of sides generated)
                    var mux = 2*Math.PI/res;
                    design.base.points = [];
                    for(var a = 0; a < res; a++){
                        design.base.points.push(
                            { x:design.base.x-Math.sin(a*mux)*design.base.r, y:design.base.y-Math.cos(a*mux)*design.base.r }
                        );
                    }
                    system.utility.object.generateSelectionArea(design.base.points, obj);
                    
                //backing
                    design.base = part.builder('circle',null,{x:design.base.x, y:design.base.y, r:design.base.r, angle:design.base.angle, style:design.base.style});
            break;
            case 'path': 
                //generate selection area
                    system.utility.object.generateSelectionArea(design.base.points, obj);
                //backing
                    design.base = part.builder('path',null,{path:design.base.points, lineType:'L', style:design.base.style});
            break;
            default: console.error('Unknown base type:',design.base.type,'when creating object "'+design.collection+'.'+design.name+'"'); return; break;
        };
        obj.append(design.base);

        //declare grapple
            if(!design.skipGrapple){
                system.mouse.declareObjectGrapple(design.base, obj, creatorMethod);
            }

    //generate elements
        if(design.elements){
            for(var a = 0; a < design.elements.length; a++){
                if(!design[design.elements[a].type]){design[design.elements[a].type]={};}
                if(design.elements[a].name in design[design.elements[a].type]){console.warn('error: element with the name "'+design.elements[a].name+'" already exists. Element:',design.elements[a],'will not be added');continue;}
                design[design.elements[a].type][design.elements[a].name] = part.builder(design.elements[a].type,design.elements[a].name,design.elements[a].data);
                obj.append(design[design.elements[a].type][design.elements[a].name]);
            }
        }

    //io setup
        obj.io = {};
        if(design.connectionNode_audio){
            var keys = Object.keys(design.connectionNode_audio);
            for(var a = 0; a < keys.length; a++){
                if(keys[a] in obj.io){console.warn('error: connection node with the name "'+keys[a]+'" already exists in the .io group. Node ',design.connectionNode_data[keys[a]],' will not be added');continue;}
                obj.io[keys[a]] = design.connectionNode_audio[keys[a]];
            }
        }
        if(design.connectionNode_data){
            var keys = Object.keys(design.connectionNode_data);
            for(var a = 0; a < keys.length; a++){
                if(keys[a] in obj.io){console.warn('error: connection node with the name "'+keys[a]+'" already exists in the .io group. Node ',design.connectionNode_data[keys[a]],' will not be added');continue;}
                obj.io[keys[a]] = design.connectionNode_data[keys[a]];
            }
        }

    return obj;
};