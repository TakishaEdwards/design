Pongo.VM = {

	countChars: function(observed, max_len) {
		var len = observed().length;
		var text = observed();

		if(len > max_len) {
			observed(text.substring(0, max_len));
			return 0;
		}
		return max_len-len;
	},

	minChars: function(observed, min_len) {
		var len = observed().length;
		var text = observed();

		if(len >= min_len) {
			return 'OK';
		}
		return len;
	},


};