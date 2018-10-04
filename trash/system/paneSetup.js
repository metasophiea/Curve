system.pane = {'global':null, 'staticBackground':null, 'background':null, 'middleground':null, 'foreground':null, 'control':null};

if( system.svgElement.children ){
    //go through SVG and see if the 'global', 'background', 'middleground', 'foreground' and 'control' elements have already been made
    for(var a = 0; a < system.svgElement.children.length; a++){
        if( system.svgElement.children[a].hasAttribute('pane') ){
            switch(system.svgElement.children[a].getAttribute('pane')){
                case 'global': system.pane.workspace = system.svgElement.children[a]; break;
                case 'staticBackground': system.pane.staticBackground = system.svgElement.children[a]; break;
                case 'background': system.pane.background = system.svgElement.children[a]; break;
                case 'middleground': system.pane.middleground = system.svgElement.children[a]; break;
                case 'foreground': system.pane.foreground = system.svgElement.children[a]; break;
                case 'control': system.pane.control = system.svgElement.children[a]; break;
            }
        }
    }

    //if the 'background', 'middleground' or 'control' elements were not made, create them
    if(system.pane.workspace == null){ 
        system.pane.workspace = document.createElementNS('http://www.w3.org/2000/svg','g');
        system.pane.workspace.setAttribute('pane','workspace');
    }
    if(system.pane.staticBackground == null){ 
        system.pane.staticBackground = document.createElementNS('http://www.w3.org/2000/svg','g');
        system.pane.staticBackground.setAttribute('pane','staticBackground');
    }
    if(system.pane.background == null){ 
        system.pane.background = document.createElementNS('http://www.w3.org/2000/svg','g');
        system.pane.background.setAttribute('pane','background');
    }
    if(system.pane.middleground == null){ 
        system.pane.middleground = document.createElementNS('http://www.w3.org/2000/svg','g');
        system.pane.middleground.setAttribute('pane','middleground');
    }
    if(system.pane.foreground == null){ 
        system.pane.foreground = document.createElementNS('http://www.w3.org/2000/svg','g');
        system.pane.foreground.setAttribute('pane','foreground');
    }
    if(system.pane.control == null){ 
        system.pane.control = document.createElementNS('http://www.w3.org/2000/svg','g');
        system.pane.control.setAttribute('pane','control'); 
    }
}

//make panes unselectable
system.utility.element.makeUnselectable(system.pane.staticBackground );
system.utility.element.makeUnselectable(system.pane.background );
system.utility.element.makeUnselectable(system.pane.middleground );
system.utility.element.makeUnselectable(system.pane.foreground );


//setup globals
if(!system.pane.staticBackground.style.transform){ system.pane.staticBackground.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
system.pane.staticBackground.setAttribute('global',true);
if(!system.pane.workspace.style.transform){ system.pane.workspace.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
system.pane.workspace.setAttribute('global',true);
if(!system.pane.control.style.transform){ system.pane.control.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
system.pane.control.setAttribute('global',true);

//clear out svg element
system.svgElement.innerHTML = '';

//add system.pane to svg element
system.svgElement.append(system.pane.staticBackground);
system.svgElement.append(system.pane.workspace);
system.pane.workspace.append(system.pane.background);
system.pane.workspace.append(system.pane.middleground);
system.pane.workspace.append(system.pane.foreground);
system.svgElement.append(system.pane.control);

//stop page scrolling when mouse is in the workspace SVG
system.svgElement.onmouseover = function(e){
    document.body.style.overflow = 'hidden';
};
system.svgElement.onmouseout = function(e){
    document.body.style.overflow = '';
};