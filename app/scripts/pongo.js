/**
 * Pongo CMS jQuery library
 * v0.0.1
 */

var Pongo = {};

Pongo.UI = {

	// jQuery properties

	$body: $(document.body),
	$container: $('.wrapper'),
	$page: $('#page-panel'),
	$btn_clicked: null,
	$api_url: null,	
	
	// Common properties

	btn_text: null,
	dropped_id: null,
	lang: null,
	timeout: 1 * 1000,

	// HTML TEMPLATES
	
	loading_tpl: '<i class="icon-refresh icon-spin"></i> ',

	/**
	 * console.log wrapper
	 * @param  {mixed} text
	 * @return {string}
	 */
	console: function(text) {
		console.log(text);
	},

	/**
	 * Print API debug on page
	 * @param  {mixed} text
	 * @return {string}
	 */
	debug: function(text) {
		this.$page.html(text);
	},

	/**
	 * Add loading icon to clicked button in a form
	 * @return {void}
	 */
	loadingBtn: function() {
		var self = this;
		$('form .btn').on('click', function(e) {
			e.preventDefault();
			self.$btn_clicked = $(this);
			self.btn_text = self.$btn_clicked.html();
			self.$btn_clicked.prepend(self.loading_tpl);

			if( ! self.$btn_clicked.hasClass('api')) {
				setTimeout(function() {
					self.$btn_clicked.parents('form').submit();
				}, self.timeout);
			}
		});
	},

	/**
	 * Add loading icon to clicked button with icon
	 * @return {void}
	 */
	loadingIcoBtn: function() {
		var self = this;
		$('.btn.loading').on('click', function() {
			self.$btn_clicked = $(this);
			self.btn_text = self.$btn_clicked.html();
			self.$btn_clicked.find('i').remove();
			self.$btn_clicked.prepend(self.loading_tpl);
		});
	},

	/**
	 * Add a new alert message
	 * saveForm success callback
	 * @param  {mixed} data
	 * @param  {string} textStatus
	 * @param  {object} jqXHR
	 * @return {void}
	 */
	createAlertMessage: function(data, textStatus, jqXHR) {
		var self = this;
		$('.alert-msg').remove();		
		var msg = $('<div/>')
					.attr('class', 'alert-msg')
					.addClass(data.status)
					.html(data.msg);
		if(data.type == 'expired') {
			window.location = '/cms/login';
		} else {
			self.$body.prepend(msg);
		}
	},

	/**
	 * Reset button text content
	 * @return {void}
	 */
	resetBtn: function() {
		if(!!this.btn_text && !!this.$btn_clicked) {
			this.$btn_clicked.html(this.btn_text);	
		}		
	},

	/**
	 * Save information to the server
	 * @return {void}
	 */
	saveForm: function() {
		var self = this;
		$('.api').on('click', function(e) {
			e.preventDefault();
			self.$api_url = $(this).attr('href');			
			$.ajax({
				url: self.$api_url,
				dataType: 'json',
				context: self,
				success: self.createAlertMessage
			}).done(function() {
				setTimeout(function() {
					self.resetBtn();
				}, self.timeout);

			});
		});
	},

	

}