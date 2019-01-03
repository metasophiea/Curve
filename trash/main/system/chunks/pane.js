//{'global':null, 'staticBackground':null, 'background':null, 'middleground':null, 'foreground':null, 'control':null};


if( system.svgElement.children ){
    //go through SVG and see if the 'global', 'background', 'middleground', 'foreground' and 'control' elements have already been made
    for(var a = 0; a < system.svgElement.children.length; a++){
        if( system.svgElement.children[a].hasAttribute('pane') ){
            switch(system.svgElement.children[a].getAttribute('pane')){
                case 'global':           this.workspace =           system.svgElement.children[a]; break;
                case 'staticBackground': this.staticBackground =    system.svgElement.children[a]; break;
                case 'background':       this.background =          system.svgElement.children[a]; break;
                case 'middleground':     this.middleground =        system.svgElement.children[a]; break;
                case 'foreground':       this.foreground =          system.svgElement.children[a]; break;
                case 'control':          this.control =             system.svgElement.children[a]; break;
            }
        }
    }

    //if the 'background', 'middleground' or 'control' elements were not made, create them
        if(this.workspace == null){
            this.workspace = document.createElementNS('http://www.w3.org/2000/svg','g');
            this.workspace.setAttribute('pane','workspace');
        }
        if(this.staticBackground == null){ 
            this.staticBackground = document.createElementNS('http://www.w3.org/2000/svg','g');
            this.staticBackground.setAttribute('pane','staticBackground');
        }
        if(this.background == null){ 
            this.background = document.createElementNS('http://www.w3.org/2000/svg','g');
            this.background.setAttribute('pane','background');
        }
        if(this.middleground == null){ 
            this.middleground = document.createElementNS('http://www.w3.org/2000/svg','g');
            this.middleground.setAttribute('pane','middleground');
        }
        if(this.foreground == null){ 
            this.foreground = document.createElementNS('http://www.w3.org/2000/svg','g');
            this.foreground.setAttribute('pane','foreground');
        }
        if(this.control == null){ 
            this.control = document.createElementNS('http://www.w3.org/2000/svg','g');
            this.control.setAttribute('pane','control'); 
        }
}

//make panes unselectable
    setTimeout(function(){
        system.utility.element.makeUnselectable(system.pane.staticBackground);
        system.utility.element.makeUnselectable(system.pane.background);
        system.utility.element.makeUnselectable(system.pane.middleground);
        system.utility.element.makeUnselectable(system.pane.foreground);
    },10);

//setup globals
    if(!this.staticBackground.style.transform){ this.staticBackground.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
    this.staticBackground.setAttribute('global',true);
    if(!this.workspace.style.transform){ this.workspace.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
    this.workspace.setAttribute('global',true);
    if(!this.control.style.transform){ this.control.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
    this.control.setAttribute('global',true);

//clear out svg element
    system.svgElement.innerHTML = '';

//add this to svg element
    system.svgElement.append(this.staticBackground);
    system.svgElement.append(this.workspace);
    system.svgElement.append(this.control);
    this.workspace.append(this.background);
    this.workspace.append(this.middleground);
    this.workspace.append(this.foreground);

//stop page scrolling when mouse is in the workspace SVG
    system.svgElement.onmouseover = function(e){
        if(system.super.enableWindowScrollbarAutomaticRemoval){
            document.body.style.overflow = 'hidden';
        }
    };
    system.svgElement.onmouseout = function(e){
        if(system.super.enableWindowScrollbarAutomaticRemoval){
            document.body.style.overflow = '';
        }
    };

//alert control when the window changes size
    window.onresize = function(){ if(control.windowresize){control.windowresize();} };