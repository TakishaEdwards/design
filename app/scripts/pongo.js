/**
 * Pongo CMS jQuery library
 * v0.0.1
 */

var Pongo = {};

Pongo.UI = {

	$body: $(document.body),

	loading_tpl: '<i class="icon-refresh icon-spin"></i> loading...',
	btn_text: null,
	$btn_clicked: null,


	console: function(text) {
		console.log(text);
	},

	loadingBtn: function() {
		var that = this;
		$('form .btn').on('click', function(e) {
			// e.preventDefault();
			that.$btn_clicked = $(this);
			that.btn_text = that.$btn_clicked.html();
			that.$btn_clicked.html(that.loading_tpl);
			
			setTimeout(function() {
				that.resetBtn();
			}, 3000);
		});
	},

	resetBtn: function() {
		var that = this;
		if(!!that.btn_text && !!that.$btn_clicked) {
			that.$btn_clicked.html(that.btn_text);	
		}		
	}

}