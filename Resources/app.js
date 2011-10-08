(function(){
	Ti.UI.setBackgroundColor("#white");

	Ti.include("js/uochan/common.js");

	app = {}; // global ns
	Ti.include("util.js");
	Ti.include("db.js");
	Ti.include("func.js");
	Ti.include("style.js");
	Ti.include("ui.js");

	var tabgrp = app.ui.createTabGroup();
	app.initTableView();

	tabgrp.open();

}());

