(function(){
 	app.style.guide = {};

	app.style.guide.imageView = function(){
		return {
			image: "img/guide.png",
			top: 0, left: 0,
			width: "140dp", height: "100dp"
		};
	};

	app.style.guide.checkbox = function(){
		return {
			top: "105dp", left: "10dp",
			style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
			title: "今後この画面を表示しない",
			value: !Ti.App.Properties.getBool("show_barcode_guide", true)
		};
	};

	app.style.guide.button = function(isNotSetGuide){
		return {
			top: (isNotSetGuide ? "105dp" : "135dp"), left: 0,
			width: "100%", height: "35dp",
			title: "OK"
		};
	};

	app.style.guide.dialog = function(view){
		return {
			androidView: view,
			title: "バーコードについて"
		};
	};
}());
