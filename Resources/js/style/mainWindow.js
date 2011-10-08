(function(){

 	app.style.main = {}

	app.style.main.window = function(){
		return {
			title: "BookMemo",
			backgroundColor: "#fff"
		};
	};

	app.style.main.tableView = function(){
		return {
			top: 0,
			left: 0,
			width: "100%",
			height: "85%"
		};
	};

	app.style.main.alertDialog = function(title, comment){
		return {
			title: title,
			message: comment,
			buttonNames: ["共有", "削除", "もどる"],
			cancel: 2
		};
	};

	app.style.main.addButton = function(){
		return {
			title: "本を追加",
			top: "85%", left: 0,
			backgroundColor: "#444",
			backgroundSelectedColor: "#888",
			font: { fontSize: "18dp" },
			color: "#fff",
			width: "100%", height: "16%"
		};
	};

	app.style.main.tab = function(win){
		return {
			icon: "img/tabicon.png",
			title: "bookmemo",
			window: win
		};
	};

	app.style.main.tableRow = function(id){
		return {
			hasChild: false,
            rowNum: id
			//title: isbn
		};
	};

	app.style.main.tableRowView = function(thumbnail){
		return {
			backgroundImage: thumbnail,
			top: 0, left: 0,
			width: "30dp", height: "45dp"
		};
	};

	app.style.main.tableRowTitle = function(title){
		return {
			top: 0, left: "35dp",
			width: "80%", height: "auto",
			font: { fontSize: "17dp" },
			text: title
		};
	};

	app.style.main.tableRowComment = function(comment){
		return {
			bottom: 0,
			left: "35dp",
			width: "100%", height: "auto",
			font: { fontSize: "14dp" },
			color: "#86dd43",
			text: comment
		};
	};
}());
