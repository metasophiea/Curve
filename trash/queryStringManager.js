// _canvas_.curve.go.add( function(){

//     // //mod request
//     //     var modLoadCount = 0;
//     //     var modListFileExtension = '.cml';

//     //     var modURL = (new URL(window.location.href)).searchParams.get('mod');
//     //     if(modURL != undefined){ loadMod(modURL); }

//     //     var counter = 1;
//     //     do{
//     //         modURL = (new URL(window.location.href)).searchParams.get('mod'+counter++);
//     //         if(modURL != undefined){ loadMod(modURL); }
//     //     }while(modURL != undefined)

//     //     function loadMod(modURL){
//     //         modLoadCount++;
//     //         var isList = false;
//     //         var workingModURL = modURL;

//     //         if(modURL.slice(-modListFileExtension.length) == modListFileExtension){
//     //             isList = true;
//     //         }

//     //         _canvas_.library.misc.loadFileFromURL(workingModURL,function(responseText){
//     //             if(isList){
//     //                 responseText.split('\n').forEach(url => loadMod(url));
//     //             }else{
//     //                 var newScript = document.createElement('script');
//     //                 newScript.innerHTML = responseText;
//     //                 newScript.id = workingModURL;
//     //                 document.body.append(newScript);
//     //             }
//     //             modLoadCount--;
//     //         },'text');
//     //     }

//     //demo request
//     //(you have to wait for all mods to be loaded first)
//         function loadDemo(){
//             // if(modLoadCount > 0){ setTimeout(loadDemo,1000); return; }
//             let demoURL = (new URL(window.location.href)).searchParams.get('demo');
//             if(demoURL != undefined){
//                 if( typeof parseInt(demoURL) == 'number' ){
//                     demoURL = 'https://curve.metasophiea.com/demos/'+demoURL+'.crv';
//                 }
//                 _canvas_.control.scene.load(demoURL,undefined,false);
//             }
//         }
//         loadDemo();

// });