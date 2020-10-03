function uploadData(callback){
	var i = document.createElement('input');
	i.type = 'file'; i.id = '_global_metasophiea.com/code/js/liveEdit/loadsave.js';
	i.setAttribute('onchange',''+
		'var f = new FileReader();'+
		'f.readAsBinaryString(this.files[0]);'+
		'f.onloadend = function(){'+callback.name+'(f.result); document.body.removeChild(document.getElementById("'+i.id+'"));}'+
	'');

	document.body.appendChild(i);
	i.click();
}

function downloadData(name,type,data){
	if(!name || !type || !data){console.error('cannot save with missing information'); return;}

	var a = document.createElement('a');
	var file = new Blob([data]);
	a.href = URL.createObjectURL(file);
	a.download = name+'.'+type;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}