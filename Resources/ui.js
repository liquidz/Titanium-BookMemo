(function(){

	app.createBookWindow = function(bookId){
		var win, row = app.db.execute("select * from book where id = " + bookId);
		if(row.isValidRow()){
			win = Ti.UI.createWindow({
				title: "本の詳細",
				backgroundColor: "#fff"
			});

			win.add(Ti.UI.createImageView({
				top: "10dp", left: "10dp",
				width: "80dp",
				height: "120dp",
				image: row.fieldByName("thumbnail")
			}));

			win.add(Ti.UI.createLabel({
				top: "10dp", left: "100dp",
				font: { fontSize: "15dp" },
				text: row.fieldByName("title")
			}));

			win.add(Ti.UI.createLabel({
				top: "30dp", left: "100dp",
				font: { fontSize: "15dp" },
				text: row.fieldByName("author")
			}));


			var del = Ti.UI.createButton({
				title: "delete",
				top: "100dp", left: 0
			});

			del.addEventListener("click", function(){
				alert("delete: " + bookId);
			});

			win.add(del);
		}

		row.close();
		return win;
	};

	app.createMainWindow = function(){
		var win = Ti.UI.createWindow({
			title: "BookMemo",
			backgroundColor: "#fff"
		});

		app.tableView = Ti.UI.createTableView({
			top: 0,
			left: 0,
			width: "100%",
			height: "85%"
		});
		app.tableView.addEventListener("click", function(e){
			var dialog;

			var view = Ti.UI.createView({ width: "100%", height: "100%" });
			view.add(Ti.UI.createTextField({top: 0, left: 0}));
			var b = Ti.UI.createButton({top: "30dp", left: 0, title: "close"});
			b.addEventListener("click", function(){
//				Ti.UI.currentWindow.close();
				dialog.hide();
			});
			view.add(b);

			dialog = Ti.UI.createOptionDialog({
				androidView: view,
				title: "hello",
				options: ["ok", "cancel"],
				cancel: 1
			});
			dialog.show();

			//Ti.UI.currentTab.open(app.createBookWindow(e.row.rowNum));
		});

		var addButton = Ti.UI.createButton({
			title: "add",
			top: "85%",
			left: 0,
			backgroundColor: "#444",
			color: "#fff",
			width: "100%",
			height: "15%"
		});
		addButton.addEventListener("click", function(){
			//app.scanISBN(function(isbn){
			app.tmpisbn(function(isbn){
				app.loadBookData(isbn, function(data){
					app.db.execute("insert into book (isbn, title, author, publisher, thumbnail) values(?, ?, ?, ?, ?)",
						isbn, data.title, data.author, data.publisher, data.thumbnail);

					data.id = app.db.lastInsertRowId;
					var row = app.createRow(data);
					app.tableView.insertRowBefore(0, row);
				});
			});
		});
	
		win.add(app.tableView);
		win.add(addButton);

		return win;
	};


	app.createTabGroup = function(){
		var tab = Ti.UI.createTabGroup();

		tab.addTab(Ti.UI.createTab({
			title: "BookMemo",
			window: app.createMainWindow()
		}));

		return tab;
	};

	app.createRow = function(data){
        var row = Ti.UI.createTableViewRow({
			hasChild: false,
            rowNum: data.id,
			title: data.isbn
        });

		row.add(Ti.UI.createView({
			backgroundImage: data.thumbnail,
			top: 0,
			left: 0,
			width: "40dp",
			height: "60dp"
		}));

		row.add(Ti.UI.createLabel({
			top: 0,
			left: "45dp",
			width: "auto", height: "auto",
			font: { fontSize: "18dp" },
			text: data.title
		}));

		row.add(Ti.UI.createLabel({
			top: "24dp",
			left: "45dp",
			width: "auto", height: "auto",
			font: { fontSize: "15dp" },
			text: data.author
		}));

		return row;
	};



}());
