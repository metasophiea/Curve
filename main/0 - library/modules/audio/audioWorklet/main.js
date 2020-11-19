this.audioWorklet = new function(){
    const worklets = {
        production:{
            only_js:{
                list:[
                    {{include:production - only_js/*/listing}}
                ],
                readyCount:0,
            },
            wasm:{
                list:[
                    {{include:production - wasm/*/listing}}
                ],
                readyCount:0,
            },
        },
        workshop:{
            only_js:{
                list:[
                    {{include:workshop - only_js/*/listing}}
                ],
                readyCount:0,
            },
            wasm:{
                list:[
                    {{include:workshop - wasm/*/listing}}
                ],
                readyCount:0,
            },
        },
    };
    this.production = { only_js:{}, wasm:{} };
    this.workshop = { only_js:{}, wasm:{} };


    function checkIfReady(){
        dev.log.audio('.AudioWorklet::checkIfReady()'); //#development

        //check through and update un-ready sections
            dev.log.audio('.AudioWorklet::checkIfReady -> updating un-ready sections...'); //#development
            Object.keys(worklets).forEach(developmentMode => { //production / workshop
                Object.keys(worklets[developmentMode]).forEach(developmentType => { //only_js / wasm
                    worklets[developmentMode][developmentType].readyCount = 0;

                    for(workletListingIndex in worklets[developmentMode][developmentType].list){
                        if(worklets[developmentMode][developmentType].readyCount == worklets[developmentMode][developmentType].list.length){
                            dev.log.audio('.AudioWorklet::checkIfReady:update "'+developmentMode+'.'+developmentType+'" -> all worklets loaded'); //#development
                            break;
                        }
                        dev.log.audio('.AudioWorklet::checkIfReady:update "'+developmentMode+'.'+developmentType+'" | ready status:', worklets[developmentMode][developmentType].readyCount, '-> loading', worklets[developmentMode][developmentType].list[workletListingIndex]); //#development
                        if(worklets[developmentMode][developmentType].list[workletListingIndex].loaded != undefined && worklets[developmentMode][developmentType].list[workletListingIndex].loaded){
                            worklets[developmentMode][developmentType].readyCount++;
                        }
                    }
                });
            });

        //check if all sections are ready, and if so just report true
            dev.log.audio('.AudioWorklet::checkIfReady -> section lengths:'); //#development
            dev.log.audio('.AudioWorklet::checkIfReady -> production.only_js: readyCount:', worklets.production.only_js.readyCount, 'list length:', worklets.production.only_js.list.length); //#development
            dev.log.audio('.AudioWorklet::checkIfReady -> production.wasm readyCount::', worklets.production.wasm.readyCount, 'list length:', worklets.production.wasm.list.length); //#development
            dev.log.audio('.AudioWorklet::checkIfReady -> workshop.only_js: readyCount:', worklets.workshop.only_js.readyCount, 'list length:', worklets.workshop.only_js.list.length); //#development
            dev.log.audio('.AudioWorklet::checkIfReady -> workshop.wasm: readyCount:', worklets.workshop.wasm.readyCount, 'list length:', worklets.workshop.wasm.list.length); //#development

            if(
                worklets.production.only_js.readyCount == worklets.production.only_js.list.length &&
                worklets.production.wasm.readyCount == worklets.production.wasm.list.length &&
                worklets.workshop.only_js.readyCount == worklets.workshop.only_js.list.length &&
                worklets.workshop.wasm.readyCount == worklets.workshop.wasm.list.length
            ){ return true; }

        return false;
    };
    this.checkIfReady = function(){ return checkIfReady(); };
    this.nowReady = function(){};
    this.requestWasm = function(class_self, instance_self){
        if(class_self.compiled_wasm != undefined){
            instance_self.port.postMessage({command:'loadWasm', 'value':class_self.compiled_wasm});
        } else if(class_self.fetch_promise == undefined){
            class_self.fetch_promise = fetch(class_self.wasm_url)
                .then(response => {
                    return response.arrayBuffer();
                }).then(arrayBuffer => {
                    return WebAssembly.compile(arrayBuffer);
                }).then(module => {
                    class_self.compiled_wasm = module;
                    instance_self.port.postMessage({command:'loadWasm', 'value':class_self.compiled_wasm});
                });
        } else {
            instance_self.attemptSecondaryWasmLoadIntervalId = setInterval(() => {
                if(class_self.compiled_wasm != undefined){
                    clearInterval(instance_self.attemptSecondaryWasmLoadIntervalId);
                    instance_self.port.postMessage({command:'loadWasm', 'value':class_self.compiled_wasm});
                }
            }, 100);
        }
    };

    Object.keys(worklets).forEach(developmentMode => { //production / workshop
        Object.keys(worklets[developmentMode]).forEach(developmentType => { //only_js / wasm
            worklets[developmentMode][developmentType].list.forEach(worklet => {
                dev.log.audio('.AudioWorklet -> loading "'+[developmentMode]+'.'+[developmentType]+'" worklet:', worklet.name); //#development
                worklet.loaded = false;
        
                audio.context.audioWorklet.addModule(window.URL.createObjectURL(worklet.worklet)).then( () => {
                    dev.log.audio('.AudioWorklet "'+[developmentMode]+'.'+[developmentType]+'" ->', worklet.name, 'has been loaded'); //#development
                    worklet.loaded = true;
        
                    audio.audioWorklet[developmentMode][developmentType][worklet.name] = worklet.class; //fancy new way
                    // audio.audioWorklet[worklet.name] = worklet.class; //old fashioned way of doing things

                    if( checkIfReady() && this.nowReady != undefined ){
                        dev.log.audio('.AudioWorklet "'+[developmentMode]+'.'+[developmentType]+'" ->', worklet.name, 'running nowReady'); //#development
                        this.nowReady();
                    }
                } );
            });
        });
    });
};