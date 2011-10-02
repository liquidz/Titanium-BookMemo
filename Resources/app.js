(function(){
	Ti.UI.setBackgroundColor("#white");

	Ti.include("js/uochan/common.js");

	app = {};
	Ti.include("db.js");
	Ti.include("func.js");
	Ti.include("ui.js");

	var tabgrp = app.createTabGroup();
	//var win = app.createMainWindow();
	app.initTableView();


	//win.open();
	tabgrp.open();
	
	//app.createBookWindow(1).open();

}());

