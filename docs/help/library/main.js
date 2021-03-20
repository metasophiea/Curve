const main_section = document.getElementById('main_list_section');
const document_size = 250;
const document_padding = 25;
const root_directory = '/help/library/';






//populate
    const groups = [];

    library.forEach(group => {
        //create group section
            const group_section = document.createElement('section');
            groups.push(group_section);
            group_section.classList.add('group_section');
            group_section.id = group.name;
            main_section.append(group_section);

        //add group name
            const group_heading = document.createElement('h2');
            group_heading.id = 'heading';
            group_heading.classList.add('group_heading');
            group_heading.innerHTML = group.print_name;
            group_section.append(group_heading);

        //add group descriptions
            group.description.forEach(description => {
                const group_description = document.createElement('p');
                group_description.id = 'description';
                group_description.innerHTML = description;
                group_section.append(group_description);
            });


        //add units
            const units_section = document.createElement('section');
            units_section.id = 'units_section';
            units_section.style.display = 'grid';
            group_section.append(units_section);

            group.html = {};
            group.html.section = units_section;
            group.html.units = [];

            group.documents.forEach(unit => {
                //create unit section
                    const group_unit_section = document.createElement('section');
                    group_unit_section.id = group.name+'_'+unit.name+'_unit_section';
                    group_unit_section.classList.add('unit_document_section');
                    // units_section.append(group_unit_section);
                    group.html.units.push( group_unit_section );

                //add document image link
                    const link = document.createElement('a');
                    link.href = root_directory + group.name + '/' + unit.name + '/document.pdf';
                
                    const image = document.createElement('img');
                    if(window.devicePixelRatio <= 1){
                        image.src = root_directory + group.name + '/' + unit.name + '/cover_250.png';
                    } else if(window.devicePixelRatio <= 2){
                        image.src = root_directory + group.name + '/' + unit.name + '/cover_250@2.png';
                    } else {
                        image.src = root_directory + group.name + '/' + unit.name + '/cover.png';
                    }
                    image.classList.add('unit_document_cover_image');
                    image.width = document_size;
                    image.height = document_size * unit.document_aspect_ratio;
                    link.append(image);

                    group_unit_section.append(link);

                //add caption
                    const caption = document.createElement('p');
                    caption.id = group.name+'_'+unit.name+'_unit_section_caption';
                    caption.classList.add('unit_document_caption');
                    caption.innerHTML = unit.print_name;
                    group_unit_section.append(caption);
            });
    });

//resizing
    let previous_mux = 0;
    window.onresize = function(){
        const mux = Math.trunc( window.innerWidth / (document_size + document_padding) );

        if(mux != previous_mux) {
            library.forEach(group => {
                group.html.section.innerHTML = '';

                group.html.units.forEach(unit => {
                    unit.style.width = (1/mux)*100 + '%';
                });

                for(let a = 0; a < group.html.units.length; a+=mux){
                    const units_sub_section = document.createElement('section');
                    units_sub_section.id = 'units_sub_section';
                    group.html.section.append(units_sub_section);

                    for(let index = 0; index < mux; index++){
                        if(group.html.units[a+index] != undefined){ units_sub_section.append(group.html.units[a+index]); }
                    }
                }
            });
        }

    };
    setTimeout(window.onresize,1);