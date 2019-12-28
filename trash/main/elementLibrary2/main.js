function executeMethod(id,method,argumentList,postProcessing){
    return new Promise((resolve, reject) => { 
        communicationModule.run('element.executeMethod',[id,method,argumentList],result => {
            if(postProcessing){resolve(postProcessing(result));}else{resolve(result);}
        });
    });
}

const missingIdRetryPeriod = 10;


{{include:group.js}}

{{include:rectangle.js}}
{{include:rectangleWithOutline.js}}
{{include:circle.js}}
{{include:circleWithOutline.js}}
{{include:polygon.js}}
{{include:polygonWithOutline.js}}

{{include:path.js}}

{{include:image.js}}
{{include:canvas.js}}

{{include:character.js}}
{{include:characterString.js}}