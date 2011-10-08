(function(){

 	app.ui = {};

	// =showBarcodeGuide
	// @isSetGuide: ガイド表示・非表示チェックボックスを表示するかどうか
	app.ui.showBarcodeGuide = function(callback, isNotSetGuide){
		var dialog,
			notSetGuide = (isNotSetGuide === true),
			view = Ti.UI.createView(app.style.full);

		view.add(Ti.UI.createImageView(app.style.guide.imageView()));
		var guideCheck = Ti.UI.createSwitch(app.style.guide.checkbox());
		if(!notSetGuide){
			view.add(guideCheck);
		}

		var button = Ti.UI.createButton(app.style.guide.button(notSetGuide));
		button.addEventListener("click", function(){
			if(!notSetGuide){
				Ti.App.Properties.setBool("show_barcode_guide", !guideCheck.value);
			}
			dialog.hide();

			if(uochan.isFunction(callback)){
				callback();
			}
		});
		view.add(button);

		dialog = Ti.UI.createOptionDialog(app.style.guide.dialog(view));
		dialog.show();
	};

	// =addBookDialog
	app.ui.addBookDialog = function(data){
		var dialog;

		var view = Ti.UI.createView(app.style.full);

		view.add(Ti.UI.createImageView(app.style.addBook.imageView(data.thumbnail)));
		view.add(Ti.UI.createLabel(app.style.addBook.title(data.title)));
		view.add(Ti.UI.createLabel(app.style.addBook.author(data.author)));

		var comment = Ti.UI.createTextField(app.style.addBook.comment());
		view.add(comment);
		var ok = Ti.UI.createButton(app.style.addBook.ok());
		var cancel = Ti.UI.createButton(app.style.addBook.cancel());

		ok.addEventListener("click", function(){
			var commentValue = (uochan.isBlank(comment.value) ? "コメントなし" : comment.value);

			app.db.insertBook(data.isbn, data.title, data.author, data.publisher, data.thumbnail, commentValue);
	
			data.id = app.db.getLastInsertRowId();
			data.comment = commentValue;

			var row = app.ui.createRow(data);
			app.tableView.insertRowBefore(0, row);
			dialog.hide();
		});

		cancel.addEventListener("click", function(){
			dialog.hide();
		});

		view.add(ok);
		view.add(cancel);

		dialog = Ti.UI.createOptionDialog({
			androidView: view,
			title: "本を追加"
		});
		dialog.show();
	};

	// =createMainWindow
	app.ui.createMainWindow = function(){
		var win = Ti.UI.createWindow(app.style.main.window());

		win.orientationModes = [ Ti.UI.PORTRAIT ];

		app.tableView = Ti.UI.createTableView(app.style.main.tableView());
		app.tableView.addEventListener("click", function(e){
			var id = e.row.rowNum;
			if(uochan.isNotNull(id)){
				var data = app.db.getBook(id),
					dialog = Ti.UI.createAlertDialog(app.style.main.alertDialog(data.title, data.comment));

				dialog.addEventListener("click", function(ev){
					if(ev.index === 0){
						// share
						app.share(data.title + ": " + data.comment);
					} else if(ev.index === 1){
						// delete
						app.util.confirm("削除していいですか？", function(){
							app.db.deleteBook(id);
							app.initTableView();
						});
						
					}
				});

				dialog.show();
			}
		});

		var addButton = Ti.UI.createButton(app.style.main.addButton());
		addButton.addEventListener("click", function(){
			if(Ti.App.Properties.getBool("show_barcode_guide", true)){
				app.ui.showBarcodeGuide(function(){
					app.startScanISBN();
				});
			} else {
				app.startScanISBN();
			}
		});
	
		win.add(app.tableView);
		win.add(addButton);

		win.activity.onCreateOptionsMenu = function(e){
			var menu = e.menu,
	            menuItem = null;
	
			menuItem = menu.add({title: "ガイドの表示"});
			menuItem.addEventListener("click", function(){
				app.ui.showBarcodeGuide();
			});
	
		};

		return win;
	};

	// =createTabGroup
	app.ui.createTabGroup = function(){
		var tabgrp = Ti.UI.createTabGroup(),
			tab = Ti.UI.createTab(app.style.main.tab(app.ui.createMainWindow()));

		tabgrp.addTab(tab);

		return tabgrp;
	};

	// =createRow
	app.ui.createRow = function(data){
        var row = Ti.UI.createTableViewRow(app.style.main.tableRow(data.id));

		row.add(Ti.UI.createView(app.style.main.tableRowView(data.thumbnail)));

		row.add(Ti.UI.createLabel(app.style.main.tableRowTitle(data.title + " / " + data.author)));

		row.add(Ti.UI.createLabel(app.style.main.tableRowComment(data.comment)));

		return row;
	};

}());
