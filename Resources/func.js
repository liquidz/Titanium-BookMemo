(function(){

	// {{{
	app.tmpisbn = function(callback){
		var arr = [
			"978-4001156768",
			"978-4101302720",
			"978-4798123981"
		];
        var dialog = Ti.UI.createOptionDialog({
            title: "isbn",
            options: arr
        });

        dialog.addEventListener("click", function(ce){
			if(ce.index >= 0){
				var isbn = arr[ce.index];
				callback(isbn.replace("-", ""));
			}
        });

        dialog.show();
	};
	// }}}
	
	// =scanISBN
	app.scanISBN = function(callback){
		var intent = Ti.Android.createIntent({
			action: "com.google.zxing.client.android.SCAN"
		});
		intent.putExtra("SCAN_MODE", "ONE_D_MODE");

        Ti.Android.currentActivity.startActivityForResult(intent, function(e){
			if(e && uochan.isNotNull(e.intent)){
				try {
					var isbn = e.intent.getStringExtra("SCAN_RESULT");
					callback(isbn.replace("-", ""));
				} catch(ex){
					alert("スキャンに失敗したか、QRコードスキャナがインストールされていません。スキャンし直すか、スキャナをインストール後に再度お試しください");
				}
			}
		});
	};

	// =initTableView
	app.initTableView = function(){
		var isAppended = false;
		app.tableView.setData([]);
		app.db.eachRow(app.db.selectBook({order: "updated desc, title"}), function(){
			var row = app.ui.createRow(app.db.getFields(this,
					["id", "isbn", "title", "author", "comment", "publisher", "thumbnail"]));

            app.tableView.appendRow(row);
			isAppended = true;
		});

		if(!isAppended && !Ti.App.Properties.getBool("initial_exp", false)){
			app.util.notify("下の「本を追加」ボタンから本を追加してください。", 2000);
			Ti.App.Properties.setBool("initial_exp", true);
		};
	};

	// =loadBookData
	app.loadBookData = function(isbn, successCallback, failCallback){
		var xhr = Ti.Network.createHTTPClient(),
			url = "http://books.google.com/books/feeds/volumes?q=ISBN:" + isbn;

		xhr.open("GET", url, false);
		xhr.onload = function(){
			var i, l, xmlDom = Ti.XML.parseString(xhr.responseText),
				entries = xmlDom.documentElement.getElementsByTagName("entry");

			if(entries.length !== 0){
				var entry = entries.item(0),
					title = app.util.getText(entry, "title", ""),
					author = app.util.getText(entry, "dc:creator", ""),
					publisher = app.util.getText(entry, "publisher", ""),
					thumbnail = "";

				var link = entry.getElementsByTagName("link");
				for(i = 0, l = link.length; i < l; ++i){
					var item = link.item(i);
					if(item.getAttribute("rel") === "http://schemas.google.com/books/2008/thumbnail"){
						thumbnail = item.getAttribute("href");
						break;
					}
				}

				successCallback({
					title: title,
					author: author,
					publisher: publisher,
					thumbnail: (uochan.isBlank(thumbnail) ? "img/noimage.png" : thumbnail)
				});
			} else {
				alert("書籍データが見つかりませんでした。");
				failCallback();
			}
		};

		xhr.onerror = function(err){
			alert("書籍データの読み込みに失敗しました。時間をおいてから再度お試しください。");
			failCallback(err);
		};
		xhr.send();
	};

	// =share
	app.share = function(text){
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain"
		});
		intent.putExtra(Ti.Android.EXTRA_TEXT, text);

		var chooser = Ti.Android.createIntentChooser(intent, "選択してください");

		Ti.Android.currentActivity.startActivity(chooser);
	};

	// =startScanISBN
	app.startScanISBN = function(){
		app.scanISBN(function(isbn){
		//app.tmpisbn(function(isbn){
			if(app.util.isISBN(isbn)){
				var act = Ti.UI.createActivityIndicator({ message: "読み込み中" });
				act.show();
	
				app.loadBookData(isbn, function(data){
					// success
					act.hide();
	
					data.isbn = isbn;
					app.ui.addBookDialog(data);
				}, function(){
					// fail
					act.hide();
	
				});
			} else {
				app.showBarcodeGuide(function(){
					app.startScanISBN();
				}, true);
			}
		});
	};

}());


