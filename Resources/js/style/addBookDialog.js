(function(){
 	app.style.addBook = {};

 	app.style.addBook.imageView = function(thumbnail){
		return {
			image: (uochan.isBlank(thumbnail) ? "img/noimage.png" : thumbnail),
			top: 0, left: 0,
			width: "60dp", height: "90dp"
		};
	};

	app.style.addBook.title = function(title){
		return {
			top: 0, left: "65dp",
			height: "auto", width: "55%",
			font: { fontSize: "18dp" },
			text: title
		};
	};

	app.style.addBook.author = function(author){
		return {
			top: "35dp", left: "65dp",
			height: "auto", width: "55%",
			font: { fontSize: "15dp" },
			text: author
		};
	};

	app.style.addBook.comment = function(){
		return {
			top: "95dp", left: 0,
			height: "25dp", width: "100%",
			font: { fontSize: "20dp" },
			hintText: "コメント"
		};
	};

	app.style.addBook.ok = function(){
		return {
			top: "125dp", left: 0,
			title: "OK",
			width: "50%", height: "30dp"
		};
	};

	app.style.addBook.cancel = function(){
		return {
			top: "125dp", left: "50%",
			title: "Cancel",
			width: "50%", height: "30dp"
		};
	};
}());
