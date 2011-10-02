(function(){
    app.db = Ti.Database.open("bookmemo");

	//app.db.execute("drop table book");
    app.db.execute("create table if not exists book (id integer primary key autoincrement, isbn varchar(20), title varchar(256), author varchar(128), publisher varchar(128), thumbnail text, comment text, updated timestamp default current_timestamp)");
}());
