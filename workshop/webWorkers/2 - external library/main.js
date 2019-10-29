// var count = 25;

// worker = new Worker("worker.js");

// var returnedCount = 0;
// worker.onmessage = function(event){
//     returnedCount++;
//     console.log(returnedCount+'/'+count);
//     if(returnedCount == count){ 
//         var endTime = (new Date()).getTime();
//         console.log( (endTime - startTime)/1000 + 'seconds');
//     }
// };

// var startTime = (new Date()).getTime();
// for(var a = 0; a < count; a++){
//     worker.postMessage( {processID:a, path:(new Array(1024).fill().map( () => Math.random()*100 ))} );
// }
















var count = 100;
var processCount = 2;

var workerList = new Array(processCount).fill().map( () => new Worker("worker.js") );

var returnedCount = 0;
workerList.forEach( worker => {
    worker.onmessage = function(event){
        returnedCount++;
        console.log(returnedCount+'/'+count);
        if(returnedCount == count){ 
            var endTime = (new Date()).getTime();
            console.log( (endTime - startTime)/1000 + 'seconds');
        }
    }
} );


var loopCount = count;
var startTime = (new Date()).getTime();
for(var a = 0; a < loopCount; a++){
    workerList[a%processCount].postMessage( {processID:a, path:(new Array(1024).fill().map( () => Math.random()*100 ))} );
}
var endTime = (new Date()).getTime();
console.log( (endTime - startTime)/1000 + 'seconds');






