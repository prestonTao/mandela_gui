const ipcRenderer = require('electron').ipcRenderer;
$(document).ready(function() {
	$('.ui.labeled.icon.sidebar')
	    .sidebar('toggle')
	    .sidebar('attach events', '.nav_bt');

	$("#close_window_bt").on("click",function(event){
		ipcRenderer.send('window_close', 'ping');
	});
	$("#max_window_bt").on("click",function(event){
		ipcRenderer.send('window_max', 'ping');
	});
	$("#min_window_bt").on("click",function(event){
		ipcRenderer.send('window_min', 'ping');
	});
});




