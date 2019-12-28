// var parameters = 'dev&mod1=http://localhost:8000/mods/test_1.js';
var parameters = 'dev&mod1=http://localhost:8000/mods/modListTest_1.cml';
// var parameters = 'dev&mod1=http://localhost:8000/mods/modListTest_1.cml&mod2=http://localhost:8000/mods/test_1.js';

if( location.href.split('?')[1] != parameters ){ location.href = '?' + parameters; }




_canvas_.control.queryString.defaultDemoUrlPrefix = 'localhost:8000/demos/';
_canvas_.control.queryString.modsBeingLoaded = 0;
_canvas_.control.queryString.controlModListPostfix = 'cml';
_canvas_.control.queryString.modLoader(() => { console.log('mods loaded'); });
_canvas_.control.queryString.demoLoader(() => { console.log('demo loaded'); });