this.functionListRunner = function(list){
    //function builder for working with the 'functionList' format

    return function(event,data){
        //run through function list, and activate functions where necessary
            for(var a = 0; a < list.length; a++){
                var shouldRun = true;

                //determine if all the requirements of this function are met
                    for(var b = 0; b < list[a].specialKeys.length; b++){
                        shouldRun = shouldRun && event[list[a].specialKeys[b]];
                        if(!shouldRun){break;} //(one is already not a match, so save time and just bail here)
                    }

                //if all requirements were met, run the function
                if(shouldRun){  
                    //if the function returns 'false', continue with the list; otherwise stop here
                        if( list[a].function(event,data) ){ break; }
                }
            }
    }
};