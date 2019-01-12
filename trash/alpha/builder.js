/*
    a design
    {
        name: 'name of unit (unique to collection)',
        collection: 'name of the collection to which this unit belongs',
        x: 0, y: 0,
        space: [{x:0,y:0}, ...], //a collection of points, used to determine the unit's selection/collision area
        spaceOutline: true/false, //a helper graphic, which when set to true, will draw an outline of the space
        elements:[ //a list of all the parts
            {
                type:'part type name',
                name:'a unique name',
                grapple: true/false, //declare that this shape part should be used as an unit grapple
                data:{}, //data relevant to this part type
            }
        ] 
    }
*/
this.builder = function(creatorMethod,design){
    if(!creatorMethod){console.error("workspace unit builder:: creatorMethod missing");return;}

    //main group
        var unit = interface.part.alpha.builder('group',design.name,{x:design.x, y:design.y, angle:design.a});
        unit.model = design.name;
        unit.category = design.category;
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
                var newPart = interface.part.alpha.builder( design.elements[a].type, design.elements[a].name, design.elements[a].data );
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
            var connectionTypes = Object.keys(unit.io);
            for(var a = 0; a < connectionTypes.length; a++){
                var connections = Object.keys(unit.io[connectionTypes[a]]);
                for(var b = 0; b < connections.length; b++){
                    unit.io[connectionTypes[a]][connections[b]].disconnect();
                }
            }
        };

    //generate unit's personal space
        function generatePersonalSpace(){
            unit.space = { 
                points: Object.assign([],design.space).map(function(a){return {x:design.x+a.x,y:design.y+a.y}; }),
            };
            unit.space.box = workspace.library.math.boundingBoxFromPoints(unit.space.points);
        }
        generatePersonalSpace();

        //create invisible shape
            //create name for the space shape that won't interfer with other names 
                var spaceName = 'spaceShape';
                while( unit.getChildByName(spaceName) != undefined ){ spaceName = spaceName + Math.floor(Math.random()*10); } //add random digits until it's unique
            //create invisible backing shape (with callbacks)
                var invisibleShape = interface.part.alpha.builder( 'polygon', spaceName, {points:design.space, style:{ fill:'rgba(0,0,0,0)' } } );
                unit.prepend(invisibleShape);

        //if requested, add an outline shape
            if( design.spaceOutline ){
                unit.append( interface.part.alpha.builder( 'polygon', spaceName+'Outline', {points:design.space, style:{ fill:'rgba(0,0,0,0)', stroke:'rgba(0,0,0,1)' } } ) );
            }

    //update unit x and y adjustment methods
        unit._parameter = {};
        unit._parameter.x = unit.parameter.x;
        unit._parameter.y = unit.parameter.y;
        unit._parameter.angle = unit.parameter.angle;
        unit.parameter.x = function(newX){
            if( unit._parameter.x(newX) != undefined ){ return unit.x; }
            design.x = newX;
            generatePersonalSpace();
        };
        unit.parameter.y = function(newY){
            if( unit._parameter.y(newY) != undefined ){ return unit.y; }
            design.y = newY;
            generatePersonalSpace();
        };
        unit.parameter.angle = function(newAngle){
            if( unit._parameter.angle(newAngle) != undefined ){ return unit.angle; }
            design.angle = newAngle;
            generatePersonalSpace();
        };

    return unit;
};