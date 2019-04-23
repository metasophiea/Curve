/*
    a design
    {
        name: 'name of unit (unique to collection)',
        collection: 'name of the collection to which this unit belongs',
        x: 0, y: 0, angle: 0,
        space: [{x:0,y:0}, ...], //a collection of points, used to determine the unit's selection/collision area
        spaceOutline: true/false, //a helper graphic, which when set to true will draw an outline of the space
        elements:[ //a list of all the parts
            {
                type:'part type name',
                name:'a unique name',
                data:{}, //data relevant to this part type
            }
        ] 
    }
*/
this.builder = function(creatorMethod,design){
    if(!creatorMethod){console.error("workspace unit builder:: creatorMethod missing");return;}

    //input check
        if(design.x == undefined){ design.x = 0; }
        if(design.y == undefined){ design.y = 0; }
        if(design.angle == undefined){ design.angle = 0; }

    //main group
        var unit = _canvas_.interface.part.builder('group',design.name,{x:design.x, y:design.y, angle:design.angle});
        unit.model = design.name;
        unit.collection = design.collection;
        unit.creatorMethod = creatorMethod;

    //generate parts and append to main group
        unit.elements = {};
        for(var a = 0; a < design.elements.length; a++){
            //check for name collision
                if( unit.getChildByName(design.elements[a].name) != undefined ){
                    console.warn('error: part with the name "'+design.elements[a].name+'" already exists. Part:',design.elements[a],'will not be added');
                    continue;
                }    

            //produce and append part
                var newPart = _canvas_.interface.part.builder( design.elements[a].type, design.elements[a].name, design.elements[a].data );
                unit.append(newPart);

            //add part to element tree
                if( unit.elements[design.elements[a].type] == undefined ){ unit.elements[design.elements[a].type] = {}; }
                unit.elements[design.elements[a].type][design.elements[a].name] = newPart;
        }

    //gather together io ports
        unit.io = {};
        [
            {key:'_', name:'connectionNode'},
            {key:'signal', name:'connectionNode_signal'},
            {key:'voltage', name:'connectionNode_voltage'},
            {key:'data', name:'connectionNode_data'},
            {key:'audio', name:'connectionNode_audio'},
        ].forEach(function(type){
            if(!unit.elements[type.name]){return;}
            var keys = Object.keys(unit.elements[type.name]);
            for(var a = 0; a < keys.length; a++){
                var part = unit.elements[type.name][keys[a]];
                if( unit.io[type.key] == undefined ){ unit.io[type.key] = {}; }
                unit.io[type.key][part.name] = part;
            }
        });

        unit.disconnectEverything = function(){
            for(connectionType in unit.io){
                for(connectionName in unit.io[connectionType]){
                    unit.io[connectionType][connectionName].disconnect();
                }
            }
        };
        unit.allowIOConnections = function(bool){
            if(bool == undefined){return;}
            for(connectionType in unit.io){
                for(connectionName in unit.io[connectionType]){
                    unit.io[connectionType][connectionName].allowConnections(bool);
                }
            }
        };
        unit.allowIODisconnections = function(bool){
            if(bool == undefined){return;}
            for(connectionType in unit.io){
                for(connectionName in unit.io[connectionType]){
                    unit.io[connectionType][connectionName].allowDisconnections(bool);
                }
            }
        };

    //generate unit's personal space
        unit.space = {};
        unit.space.originalPoints = design.space;
        function generatePersonalSpace(){
            unit.space.points = design.space.map(a => {
                var tmp = _canvas_.library.math.cartesianAngleAdjust(a.x,a.y,unit.angle())
                tmp.x += design.x;
                tmp.y += design.y;
                return tmp;
            } );
            unit.space.boundingBox = _canvas_.library.math.boundingBoxFromPoints(unit.space.points);

            //create invisible space shape
            if( unit.space.shape != undefined ){
                unit.space.shape.pointsAsXYArray(unit.space.originalPoints);
            }else{
                unit.space.shape = _canvas_.interface.part.builder( 'polygon', 'unit.space.shape', { pointsAsXYArray:unit.space.originalPoints, colour:{r:0,g:1,b:0,a:0} } );
                unit.space.shape.unit = unit;
                unit.prepend( unit.space.shape );
            }
        }
        generatePersonalSpace();

        //if requested, add an outline shape
            if( design.spaceOutline ){
                unit.append( _canvas_.interface.part.builder( 'polygonWithOutline', 'unit.space.shape'+'_Outline', {pointsAsXYArray:design.space, colour:{r:1,g:1,b:1,a:0.25}, lineColour:{r:0,g:0,b:0,a:1} } ) );
            }

    //augment unit x, y and angle adjustment methods
        unit._x = unit.x;
        unit._y = unit.y;
        unit._angle = unit.angle;
        unit.x = function(newX){
            if( unit._x(newX) != undefined ){ return design.x; }
            design.x = newX;
            generatePersonalSpace();
        };
        unit.y = function(newY){
            if( unit._y(newY) != undefined ){ return design.y; }
            design.y = newY;
            generatePersonalSpace();
        };
        unit.angle = function(newAngle){
            if( unit._angle(newAngle) != undefined ){ return design.angle; }
            design.angle = newAngle;
            generatePersonalSpace();
        };


    //disable all control parts method
        unit.interactable = function(bool){
            if(bool == undefined){return;}
            for(partType in unit.elements){
                for(partName in unit.elements[partType]){
                    if( unit.elements[partType][partName].interactable ){
                        unit.elements[partType][partName].interactable(bool);
                    }
                }
            }
        };

    return unit;
};