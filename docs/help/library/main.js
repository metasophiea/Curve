const main_section = document.getElementById('main_list_section');
const document_size = 250;
const document_padding = 0.2;
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

        //add units
            const group_units_section = document.createElement('section');
            group_units_section.id = 'group_units_section';
            group_section.append(group_units_section);

            group.documents.forEach(unit => {
                //create unit section
                    const group_unit_section = document.createElement('section');
                    group_unit_section.id = group.name+'_'+unit.name+'_unit_section';
                    group_unit_section.classList.add('unit_document_section');
                    group_units_section.append(group_unit_section);

                //add document image link
                    const link = document.createElement('a');
                    link.href = root_directory + group.name + '/' + unit.name + '/document.pdf';
                
                    const image = document.createElement('img');
                    image.src = root_directory + group.name + '/' + unit.name + '/cover.png';
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
    window.onresize = function(){
        const mux = Math.trunc( (window.innerWidth / document_size) - document_padding );
        groups.forEach(group => {
            const sections = group.getElementsByClassName('unit_document_section');

            for(var a = 0; a < sections.length; a++){
                sections[a].style.width = (1/mux)*100 + '%';
            }
        });

    };
    setTimeout(window.onresize,1);