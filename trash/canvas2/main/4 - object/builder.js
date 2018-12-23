/*
    a design
    {
        name: 'name of object (unique to collection)',
        collection: 'name of the collection to which this object belongs',
        x: 0, y: 0,
        space: [{x:0,y:0}, ...], //a collection of points, used to determine the object's selection/collision area
        spaceOutline: true/false, //a helper graphic, which when set to true, will draw an outline of the space
        elements:[ //a list of all the parts
            {
                type:'part type name',
                name:'a unique name',
                grapple: true/false, //declare that this shape part should be used as an object grapple
                data:{}, //data relivant to this part type
            }
        ] 
    }
*/
canvas.object.builder = function(creatorMethod,design){
    if(!creatorMethod){console.error("canvas.object.builder:: creatorMethod missing");return;}

    //main group
        var object = canvas.part.builder('group',design.name,{x:design.x, y:design.y});
        object.collection = design.collection;
        object.creatorMethod = design.creatorMethod;

    //generate parts and append to main group
        object.elements = {};
        for(var a = 0; a < design.elements.length; a++){
            //check for name collision
                if( object.getChildByName(design.elements[a].name) != undefined ){
                    console.warn('error: part with the name "'+design.elements[a].name+'" already exists. Part:',design.elements[a],'will not be added');
                    continue;
                }    

            //produce and append part
                var newPart = canvas.part.builder( design.elements[a].type, design.elements[a].name, design.elements[a].data );
                object.append(newPart);

            //add part to element tree
                if( object.elements[design.elements[a].type] == undefined ){ object.elements[design.elements[a].type] = {}; }
                object.elements[design.elements[a].type][design.elements[a].name] = newPart;

            //add grapple code (if appropiate)
                if( design.elements[a].grapple ){
                    canvas.object.builder.objectGrapple.declare( newPart, object );
                }
        }

    //gather together io ports
        object.io = {};
        [
            {key:'_', name:'connectionNode'},
            {key:'signal', name:'connectionNode_signal'},
            {key:'voltage', name:'connectionNode_voltage'},
            {key:'data', name:'connectionNode_data'},
            {key:'audio', name:'connectionNode_audio'},
        ].forEach(function(type){
            if(!object.elements[type.name]){return;}
            var keys = Object.keys(object.elements[type.name]);
            for(var a = 0; a < keys.length; a++){
                var part = object.elements[type.name][keys[a]];
                if( object.io[type.key] == undefined ){ object.io[type.key] = {}; }
                object.io[type.key][part.name] = part;
            }
        });

    //generate object's personal space
        object.space = { 
            points:Object.assign([],design.space),
            box:canvas.library.math.boundingBoxFromPoints(design.space),
        };

        //create invisible shape
            //create name for the space shape that won't interfer with other names 
                var spaceName = 'spaceShape';
                while( object.getChildByName(spaceName) != undefined ){ spaceName = spaceName + Math.floor(Math.random()*10); } //add random digits until it's unique
            //create invisible backing shape (with callbacks)
                var invisibleShape = canvas.part.builder( 'polygon', spaceName, {points:design.space, style:{ fill:'rgba(0,0,0,0)' } } );
                object.prepend(invisibleShape);
                invisibleShape.onkeydown = function(x,y,event){ if(object.onkeydown != undefined){ object.onkeydown(x,y,event); } };
                invisibleShape.onkeyup = function(x,y,event){ if(object.onkeyup != undefined){ object.onkeyup(x,y,event); } };

        //if requested, add an outline shape
            if( design.spaceOutline ){
                object.append( canvas.part.builder( 'polygon', spaceName+'Outline', {points:design.space, style:{ fill:'rgba(0,0,0,0)', stroke:'rgba(0,0,0,1)' } } ) );
            }

    return object;
};








canvas.object.builder.objectGrapple = {
    tmpObject:undefined,
    functionList:{ onmousedown:[], onmouseup:[], },
    declare:function(grapple, object){
        grapple.object = object;
        object.grapple = grapple;

        function grappleFunctionRunner(list){
            return function(x,y,event){
                //ensure that it's the action button on the mouse
                    if(event.button != 0){return;}

                //save object
                    canvas.object.builder.objectGrapple.tmpObject = this.object;
                
                //run through function list, and activate functions where necessary
                    canvas.library.structure.functionListRunner(list)({event:event,x:x,y:y});
            };
        }

        grapple.onmousedown = grappleFunctionRunner( canvas.object.builder.objectGrapple.functionList.onmousedown );
        grapple.onmouseup = grappleFunctionRunner( canvas.object.builder.objectGrapple.functionList.onmouseup );
    },
};