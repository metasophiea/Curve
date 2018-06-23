// __globals.utility.generateSelectionArea = function(points, _mainObject){
//     _mainObject.selectionArea = {};
//     _mainObject.selectionArea.box = [];
//     _mainObject.selectionArea.points = [];
//     _mainObject.updateSelectionArea = function(){
//         //the main shape we want to use
//         _mainObject.selectionArea.points = [];
//         points.forEach(function(item){ _mainObject.selectionArea.points.push(item.slice()); });
//         _mainObject.selectionArea.box = __globals.utility.math.boundingBoxFromPoints(_mainObject.selectionArea.points);

//         //adjusting it for the object's position in space
//         temp = __globals.utility.getTransform(_mainObject);
//         _mainObject.selectionArea.box.forEach(function(element) {
//             element[0] += temp[0];
//             element[1] += temp[1];
//         });
//         _mainObject.selectionArea.points.forEach(function(element) {
//             element[0] += temp[0];
//             element[1] += temp[1];
//         });
//     };

//     _mainObject.updateSelectionArea();
// };