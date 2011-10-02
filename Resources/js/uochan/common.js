(function(window){
	if(!window.uochan){ uochan = {}; }

	// =isNull
	uochan.isNull = function(x){ return (x === null || x === undefined); };

	// =isBlank
	uochan.isBlank = function(x){ return (this.isNull(x) || x === ""); };

	uochan.isFunction = function(x){ return (typeof x === "function"); };
	uochan.isString = function(x){ return (typeof x === "string"); };
	uochan.isArray = function(x){ return (typeof x === "object" && !this.isNull(x.length)); };
	uochan.isObject = function(x){ return (typeof x === "object"); };

	// =not
	uochan.not = function(pred){ return !pred; };

	// =each
	uochan.each = function(x, fn){
		var i, l, key, res;

		if(this.isArray(x)){
			for(i = 0, l = x.length; i < l; ++i){
				res = fn.apply(x[i], [i, x[i]]);
				if(res === true){ break; }
				else if(res === false){ continue; }
			}
		} else if(this.isObject(x)){
			for(key in x){
				res = fn.apply(x[key], [key, x[key]]);
				if(res === true){ break; }
				else if(res === false){ continue; }
			}
		}
	};

	// =map
	uochan.map = function(x, fn){
		var res = [], tmp;

		if(this.isArray(x)){
			this.each(x, function(i, v){
				tmp = fn.apply(v, [v]);
				if(!uochan.isNull(tmp)){ res.push(tmp) };
			});
		} else if(this.isObject(x)){
			this.each(x, function(k, v){
				tmp = fn.apply(v, [k, v]);
				if(!uochan.isNull(tmp)){ res.push(tmp); }
			});
		}

		return res;
	};

	// =id
	uochan.id = function(x){ return x; };

	// =toArr
	uochan.toArr = function(x){ return this.map(x, this.id); };

	// =partial
	uochan.partial = function(){
		var self = this,
			fn = arguments[0],
			args = this.toArr(arguments);

		// 0 is fn
		args.shift();

		return function(){
			var localArgs = uochan.toArr(arguments);
			return fn.apply(self, args.concat(localArgs));
		};
	};

	// =reduce
	uochan.reduce = function(x, b, c){
		if(arguments.length === 2){
			var res = x.shift(),
				fn = b;
			return this.reduce(x, res, fn);

		} else if(arguments.length === 3){
			var res = b,
				fn = c,
				self = this;

			if(this.isArray(x)){
				this.each(x, function(){
					res = fn.apply(self, [res, this]);
				});
			} else if(this.isObject(x)){
				this.each(x, function(k, v){
					res = fn.apply(self, [res, k, v]);
				});
			}
			
			return res;
		}
	};

	// =nth
	uochan.nth = function(index, arr){
		var defaultValue = null;
		if(arguments.length === 3){
			defaultValue = arguments[2];
		}

		return ((this.isArray(arr) && arr.length > index) ? arr[index] : defaultValue);
	};

	// =first
	uochan.first = uochan.partial(uochan.nth, 0);
	// =second
	uochan.second = uochan.partial(uochan.nth, 1);

	// =comp
	uochan.comp = function(){
		var funcs = this.toArr(arguments).reverse();

		return function(){
			var args = uochan.toArr(arguments),
				result;

			result = uochan.reduce(funcs, args, function(res, fn){
				return [fn.apply(this, res)];
			});

			return result[0];
		};
	};

	// =isNotNull
	uochan.isNotNull = uochan.comp(uochan.not, uochan.isNull);

	uochan.bind = function(ns, fn){
		return function(){
			return fn.apply(ns, arguments);
		};
	};

	uochan.findFirst = function(x, pred){
		var res = null;

		if(this.isFunction(pred)){
			if(this.isArray(x)){
				uochan.each(x, function(i, v){
					if(pred.apply(v, [v]) === true){
						res = v;
						return true;
					}
				});
			} else if(this.isObject(x)){
				this.each(x, function(i, k, v){
					if(pred.apply(v, [k, v]) === true){
						res = {};
						res[k] = v;
						return true;
					}
				});
			}
		}

		return res;
	};

}(this));
