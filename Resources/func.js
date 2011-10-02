(function(){

	var eachRow = function(row, fn){
		while(row.isValidRow()){
			fn.apply(row, [row]);
			row.next();
		}
		row.close();
	};

	// {{{
	app.tmpisbn = function(callback){
		var arr = [
			"978-4001156768",
			"978-4101302720"
		];
        var dialog = Ti.UI.createOptionDialog({
            title: "isbn",
            options: arr
        });

        dialog.addEventListener("click", function(ce){
			var isbn = arr[ce.index];
			callback(isbn.replace("-", ""));
        });

        dialog.show();
	};
	// }}}
	
	app.scanISBN = function(callback){
		var intent = Ti.Android.createIntent({
			action: "com.google.zxing.client.android.SCAN"
		});
		intent.putExtra("SCAN_MODE", "ONE_D_MODE");

        Ti.Android.currentActivity.startActivityForResult(intent, function(e){
			var isbn = e.intent.getStringExtra("SCAN_RESULT");
			callback(isbn.replace("-", ""));
		});
	};

	app.initTableView = function(){
		app.tableView.setData([]);
		eachRow(app.db.execute("select * from book order by updated desc, title"), function(){
			var isbn = this.fieldByName("isbn");

			var row = app.createRow({
				id: this.fieldByName("id"),
				isbn: this.fieldByName("isbn"),
				title: this.fieldByName("title"),
				author: this.fieldByName("author"),
				thumbnail: this.fieldByName("thumbnail")
			});

            //var row = Ti.UI.createTableViewRow({
			//	hasChild: false,
            //    //leftImage: this.fieldByName("thumbnail"),
            //    rowNum: this.fieldByName("id"),
            //    //rowTitle: memo.fieldByName("title")
			//	title: isbn
            //});

			//row.add(Ti.UI.createView({
			//	backgroundImage: this.fieldByName("thumbnail"),
			//	top: 0,
			//	left: 0,
			//	width: "40dp",
			//	height: "60dp"
			//}));

			//row.add(Ti.UI.createLabel({
			//	top: 0,
			//	left: "45dp",
			//	width: "auto", height: "auto",
			//	font: { fontSize: "18dp" },
			//	text: this.fieldByName("title")
			//}));

			//row.add(Ti.UI.createLabel({
			//	top: "24dp",
			//	left: "45dp",
			//	width: "auto", height: "auto",
			//	font: { fontSize: "15dp" },
			//	text: this.fieldByName("author")
			//}));


            //var v = uochan.emptyView();
            //v.add(Ti.UI.createLabel(uochan.merge(app.style.rowLabel, {
            //    text: memo.fieldByName("title"),
            //})));

            app.tableView.appendRow(row);

		});
	};

	var getText = function(e, name, defaultValue){
		var target = e.getElementsByTagName(name);

		return (target.length === 0) ? defaultValue : target.item(0).text;
	};

	app.loadBookData = function(isbn, callback){
		var xhr = Ti.Network.createHTTPClient(),
			url = "http://books.google.com/books/feeds/volumes?q=ISBN:" + isbn,
			query = "select * from feed where url = '" + url + "'";

		xhr.open("GET", url, false);
		xhr.onload = function(){
			var i, l, xmlDom = Ti.XML.parseString(xhr.responseText),
				entries = xmlDom.documentElement.getElementsByTagName("entry");

			if(entries.length !== 0){
				var entry = entries.item(0),
					title = getText(entry, "title", ""),
					author = getText(entry, "dc:creator", ""),
					publisher = getText(entry, "publisher", ""),
					thumbnail = "";

				var link = entry.getElementsByTagName("link");
				for(i = 0, l = link.length; i < l; ++i){
					var item = link.item(i);
					if(item.getAttribute("rel") === "http://schemas.google.com/books/2008/thumbnail"){
						thumbnail = item.getAttribute("href");
						break;
					}
				}

				callback({
					title: title,
					author: author,
					publisher: publisher,
					thumbnail: thumbnail
				});
			}
		};

		xhr.onerror = function(err){ Ti.API.info(err); };
		xhr.send();
	};

}());
