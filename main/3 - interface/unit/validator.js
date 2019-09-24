this.validator = function(unit,describe=false){
    var normalFontColour = '#987aa1';
    var badFontColour = '#db6060';

    if(!describe){
        // return {
        //     tree:unit.getTree(),
        //     devMode:unit.devMode,
        //     dotFrame:unit.dotFrame,
        //     space:Object.assign({},unit.space),
        //     importData:unit.importData!=undefined,
        //     exportData:unit.exportData!=undefined,
        //     interface:Object.keys(unit.io).map(type => { return {type:type,list:Object.keys(unit.io[type])} })
        // };

        if(unit.importData==undefined){ console.log('\t%cimportData missing','color:'+badFontColour); }
        if(unit.exportData==undefined){ console.log('\t%cexportData missing','color:'+badFontColour); }
        return;
    }



    console.log('%cinterface.unit.validator', 'font-size:12px; font-weight:bold;');
    console.log('\tmodel: %c'+unit.model,'color:'+normalFontColour);
    console.log('\tname: %c'+unit.name,'color:'+normalFontColour);
    console.log('\taddress: %c'+unit.getAddress(),'color:'+normalFontColour);
    console.log('');


    //check for sub elements
        console.log('\tcheck for sub elements');
            Object.keys(unit.elements).forEach(type => {
                console.log( '\t\t- '+type );
                Object.keys(unit.elements[type]).forEach(item => {
                    console.log( '\t\t\t- '+item );
                });
            });
        console.log('');
    //check if devMode is on
        console.log('\tdevMode: %c'+(unit.devMode ? 'active' : 'not active'), 'color:'+normalFontColour);
        console.log('');
    //check if dotFrame is on
        console.log('\tdotFrame: %c'+(unit.dotFrame ? 'active' : 'not active'), 'color:'+normalFontColour);
        console.log('');
    //check for space
        console.log('\tUnit Space');
        console.log('\t\tboundingBox:');
        console.log('\t\t\ttopLeft',unit.space.boundingBox.topLeft );
        console.log('\t\t\tbottomRight',unit.space.boundingBox.bottomRight );
        console.log('\t\toriginalPoints');
        unit.space.originalPoints.forEach(item => console.log('\t\t\t',item));
        console.log('\t\tpoints');
        unit.space.points.forEach(item => console.log('\t\t\t',item));
        console.log('');
    //check for import/export
        console.log('\timport/export');
        console.log('\t\timportData %c' + (unit.importData == undefined ? 'missing' : 'present'), 'color:'+(unit.importData == undefined ? badFontColour : normalFontColour));
        console.log('\t\texportData %c' + (unit.exportData == undefined ? 'missing' : 'present'), 'color:'+(unit.exportData == undefined ? badFontColour : normalFontColour));
        console.log('');
    //list interface
        console.log('\tinterface');
        if(unit.i == undefined){
            console.log('\t\t- missing -');
        }else{
            Object.keys(unit.i).forEach(item => {
                console.log( '\t\t- '+item );
            });
        }
        console.log('');
    //list io
        console.log('\tio');
        Object.keys(unit.io).forEach(type => {
            console.log( '\t\t- '+type );
            Object.keys(unit.io[type]).forEach(item => {
                console.log( '\t\t\t- '+item );
            });
        });
        console.log('');
};