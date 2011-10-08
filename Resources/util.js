(function(){
 	app.util = {};

	app.util.isISBN = function(data){
		var isbn = "" + data,
			l = isbn.length,
			res = false;

		if(l === 10){
			res = true;
		} else if(l === 13 && (isbn.indexOf("978") === 0 || isbn.indexOf("979") === 0)){
			res = true;
		}

		return res;
	};

	app.util.getText = function(e, name, defaultValue){
		var target = e.getElementsByTagName(name);

		return (target.length === 0) ? defaultValue : target.item(0).text;
	};


	app.util.confirm = function(message, callback){
		var dialog = Ti.UI.createAlertDialog({
			title: "確認",
			message: message,
			buttonNames: ["OK", "キャンセル"],
			cancel: 1
		});

		dialog.addEventListener("click", function(e){
			if(e.index === 0){ callback(); }
		});

		dialog.show();
	};


	app.util.notify = function(){
        var message = arguments[0],
            duration = (arguments.length === 2) ? arguments[1] : 1000;

        Ti.UI.createNotification({
            duration: duration,
            message: message
        }).show();
    };


}());
