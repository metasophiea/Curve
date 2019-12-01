[
    {functionName:'getAvailableShapes', argumentList:[]},
    {functionName:'getProxyableMethodsForShape', argumentList:['type']},

    {functionName:'deleteShape', argumentList:['id']},
    {functionName:'deleteAllCreatedShapes', argumentList:[]},
    {functionName:'getCreatedShapes', argumentList:[]},
    {functionName:'createShape', argumentList:['type']},
    {functionName:'getShapeTypeById', argumentList:['id']},
    {functionName:'executeShapeMethod', argumentList:['shapeId','methodName','argumentList']},
].forEach( method => {
    communicationModule.function['arrangement.'+method.functionName] = new Function( ...(method.argumentList.concat('return arrangement.'+method.functionName+'('+method.argumentList.join(',')+');')) );
});