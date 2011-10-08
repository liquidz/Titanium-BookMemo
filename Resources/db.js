(function(){
 	app.db = {};
    app.db.dbObj = Ti.Database.open("bookmemo");
	var execute = function(sql){ return app.db.dbObj.execute(sql); };

	// initialize
	var tableSQL = "create table if not exists book ("
		+ "id integer primary key autoincrement, isbn varchar(20), title varchar(256),"
		+ "author varchar(128), publisher varchar(128), thumbnail text, comment text,"
		+ "updated timestamp default current_timestamp)";
   	execute(tableSQL);

	// =eachRow
 	app.db.eachRow = function(row, fn){
		while(row.isValidRow()){
			fn.apply(row, [row]);
			row.next();
		}
		row.close();
	};

	// =getFields
	app.db.getFields = function(row, fields){
		var result = {};
		if(row.isValidRow()){
			uochan.each(fields, function(i, v){
				result[v] = row.fieldByName(v);
			});
		}
		return result;
	};

	// =getBook
	app.db.getBook = function(id){
		var res = {}, row = execute("select * from book where id = " + id);
		if(row.isValidRow()){
			res = this.getFields(row, ["title", "author", "publisher", "thumbnail", "comment", "updated"]);
		}
		row.close();
		return res;
	};

	// =selectBook
	app.db.selectBook = function(opt){
		var column = (uochan.isNull(opt.column) ? "*" : opt.column),
			where = (uochan.isNull(opt.where) ? "" : " where " + opt.where),
			order = (uochan.isNull(opt.order) ? "" : " order by " + opt.order);
		return execute("select " + column + " from book" + where + order);
	};

	// =insertBook
	app.db.insertBook = function(isbn, title, author, publisher, thumbnail, comment){
		this.dbObj.execute("insert into book (isbn, title, author, publisher, thumbnail, comment) values(?, ?, ?, ?, ?, ?)",
				isbn, title, author, publisher, thumbnail, comment);
	};

	// =deleteBook
	app.db.deleteBook = function(id){
        execute("delete from book where id = " + id);
	};

	// =getLastInsertRowId
	app.db.getLastInsertRowId = function(){
		return this.dbObj.lastInsertRowId;
	};

}());
