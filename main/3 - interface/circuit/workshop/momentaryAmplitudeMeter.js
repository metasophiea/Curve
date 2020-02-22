this.momentaryAmplitudeMeter = function(
    context
){ 
    const self = this;

    //flow
        //flow chain
            const flow = {
                momentaryAmplitudeMeterNode:{}
            };

    //momentaryAmplitudeMeterNode
        flow.momentaryAmplitudeMeterNode = {
            updateDelay: 100,
            calculationMode: 3, 
            node: context.createMomentaryAmplitudeMeter(),
        };

    //input/output node
        this.in = function(){ return flow.momentaryAmplitudeMeterNode.node; }

    //controls
        this.updateDelay = function(value){
            if(value == undefined){ return flow.momentaryAmplitudeMeterNode.updateDelay; }
            flow.momentaryAmplitudeMeterNode.updateDelay = value;
            flow.momentaryAmplitudeMeterNode.node.parameters.get('updateDelay').setValueAtTime(value,0);
        };
        this.calculationMode = function(value){
            if(value == undefined){ return flow.momentaryAmplitudeMeterNode.calculationMode; }
            flow.momentaryAmplitudeMeterNode.calculationMode = value;
            flow.momentaryAmplitudeMeterNode.node.parameters.get('calculationMode').setValueAtTime(value,0);
        };

    //callback
        this.onNewValue = function(a){};
        flow.momentaryAmplitudeMeterNode.node.port.onmessage = function(data){
            if(self.onNewValue != undefined){
                self.onNewValue(data.data);
            }
        };
};