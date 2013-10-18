/**
 * Pongo CMS jQuery library
 * v1.0.0
 */

Pongo.UI = {

	// jQuery properties

	$body: $(document.body),
	$win: $(window),
	$container: $('.wrapper'),
	$counter: $('.counter'),
	$list: $('.list'),
	$page: $('#page-panel'),
	$overlay: $('#overlay'),
	$form_group: $('.form-group'),
	$form_text: $('#text'),
	$alert_box: $('.alert-msg'),
	$modal_box: $('.modal-box'),
	$close_modal: $('.close-modal'),
	$left_toggle: $('.left-toggle'),
	$right_toggle: $('.right-toggle'),
	$toolbar: $('.toolbar'),
	$multipanel: $('.multi-panel'),
	$popup: $('.popup'),
	$btn_clicked: null,
	$api_url: null,
	$modal_url: null,
	
	// Common properties

	btn_text: null,
	lang: null,
	timeout: 1 * 1000,
	multipanel_w: 286,

	// HTML TEMPLATES
	
	loading_tpl: '<i class="icon-refresh icon-spin"></i> ',

	counter_tpl: '<span class="label label-primary counter"><%= n %></span>',

	list_item_tpl: 	'<li class="dl-item" data-id="<%= file_id %>">' +

						'<div class="dl-handle">' +

							'<a href="<%= thumb_url %>" class="<%= thumb_class %>"><%= thumb %></a>' +

							'<span><%= file_name %></span>' +

							'<div>' +

								'<span class="ext"><%= ext %></span>' +

								'<span class="size"><%= size %></span>' +

							'</div>' +

						'</div>' +

						'<a href="<%= edit_url %>" class="<%= edit_class %>" data-default="<%= data_default %>" data-tag="<%= data_tag %>"><i class="icon-chevron-left"></i></a>' +

						'<a href="<%= delete_url %>" class="remove confirm"><i class="icon-remove"></i></a>' +

					'</li>',

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
	 * Format a URL
	 * @param  {string} url
	 * @return {string}
	 */
	url: function(url) {
		return Pongo.base + '/' + url;
	},

	/**
	 * Activate Magnific Popup plugin
	 * @return {void} [description]
	 */
	activePopup: function() {
		this.$list.magnificPopup({
			delegate: 'a.popup',
			type: 'image',
			closeOnContentClick: true
		});
	},

	/**
	 * Add or prepend spin icon class
	 */
	addSpin: function() {
		this.btn_text = this.$btn_clicked.html();
		if(this.btn_text.indexOf('<i') == -1) {
			this.$btn_clicked.prepend(this.loading_tpl);
		} else {
			this.$btn_clicked.find('i').removeClass().addClass('icon-refresh icon-spin');
		}
	},

	/**
	 * Check all elements to be cloned
	 * @return {void}
	 */
	checkAllClone: function() {
		$('#clone_all').change(function () {
			$('.cloned_element').prop('checked', this.checked);
		});
	},

	/**
	 * Remove status-bar after upload
	 * @return {[type]} [description]
	 */
	cleanStatusBar: function(n) {
		setTimeout(function() {
			$('.status-bar').remove();
		}, n * 1000)
	},

	/**
	 * Increse or decrese counter value
	 * @param  {string} where up || down
	 * @return {void}
	 */
	counterUpDown: function(where) {
		if(this.$counter.length == 0 && where == 'up') {
			var tpl = _.template(this.counter_tpl);
			var template = tpl({n: 0});
			this.$right_toggle.append(template);
			this.$counter = $('.counter');
		}
		var n = this.$counter.html();
		(where == 'up') ? n ++ : n --;
		this.$counter.html(n);
		if(n <= 0) this.$counter.remove();
	},

	/**
	 * Manage multi-panel change panel
	 * @return {void}
	 */
	changeMultiPanel: function() {
		var self = this;
		var $li = self.$toolbar.find('li');
		$li.each(function(index) {
			var $this = $(this);
			var $link = $this.find('a');
			$link.on('click', function(e) {
				e.preventDefault();
				$li.removeClass('active');
				$this.addClass('active');
				self.$multipanel.animate({left: -(index * self.multipanel_w)}, 200);
			});
		});
	},

	/**
	 * Check if button clicked has spin
	 * 
	 * @return {bool}
	 */
	checkSpin: function() {
		return this.$btn_clicked.find('i').hasClass('icon-spin');
	},

	/**
	 * Check and format TinyMce content
	 * @return {[type]} [description]
	 */
	checkTinyMce: function() {
		if(Pongo.Element !== undefined) {
			var editor = Pongo.Element.editor;
			this.$form_text.text(editor.getContent());
			editor.isNotDirty = true;
		}
	},

	/**
	 * Add compiled list item to list
	 * @param  {object} item
	 * @return {void}
	 */
	listItemAdd: function(item) {
		var tpl = _.template(this.list_item_tpl);
		var template = tpl(item);
		this.$list.prepend(template);
		$('li .confirm').unbind('click');
		// this.loadingConfirm();
	},

	/**
	 * Remove list item
	 * @param  {id} id List item id
	 * @return {void}
	 */
	listItemRemove: function(id) {
		this.$list.find('li[data-id='+id+']').remove();
		this.counterUpDown('down');
		this.$close_modal.trigger('click');
	},

	/**
	 * Add loading icon to clicked button in a form
	 * @return {void}
	 */
	loadingBtn: function() {
		var self = this;

		// Override if type=submit
		this.submitBtn();

		$('form .btn').on('click', function(e) {
			e.preventDefault();
			self.$alert_box.remove();
			if(!self.$btn_clicked)
				self.$btn_clicked = $(this);
			if(!self.checkSpin()) {
				self.addSpin();
				var notApi 		= !self.$btn_clicked.hasClass('api');
				var notConfirm 	= !self.$btn_clicked.hasClass('confirm');
				var notButton	= !self.$btn_clicked.hasClass('button');

				if(notApi && notConfirm && notButton) {
					setTimeout(function() {
						self.$btn_clicked.parents('form').submit();
					}, self.timeout);
				}
			}
		});
	},

	/**
	 * Add loading icon to confirm action
	 * @return {void}
	 */
	loadingConfirm: function() {
		var self = this;
		// $('li .confirm').on('click', function(e) {
		$('.list, form').on('click', '.confirm', function(e) {
			e.preventDefault();
			self.$alert_box.remove();
			if(!self.$btn_clicked)
				self.$btn_clicked = $(this);
			if(!self.checkSpin()) {
				var url = $(this).attr('href');
				self.addSpin();
				self.$modal_box.find('.api').attr('href', url);
				self.$modal_box.css({'z-index': 2001}).addClass('open');
				self.$body.addClass('open-modal');
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
			if(!self.checkSpin()) {
				self.addSpin();
			}
		});
	},

	/**
	 * Open confirm modal-box
	 * @return {void}
	 */
	confirmForm: function() {
		var self = this;

		self.$modal_box.each(function() {
			var height = $(this).outerHeight() + 10;
			$(this).css({'top': -height});
		});

		self.closeConfirm();

		$('form .confirm').on('click', function(e) {
			e.preventDefault();
			var $this = $(this);
			self.$modal_box = $($this.attr('href'));
			self.$modal_box.css({'z-index': 2001}).addClass('open');
			self.$body.addClass('open-modal');
		});
	},

	/**
	 * Close the confirm modal-box
	 * @return {void}
	 */
	closeConfirm: function() {
		var self = this;
		$('.close-modal').on('click', function(e) {
			e.preventDefault();
			self.$modal_box.css({'z-index': 0}).removeClass('open');
			self.$body.removeClass('open-modal');
			self.resetBtn();
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
		self.$alert_box.remove();
		var msg = $('<div/>')
					.attr('class', 'alert-msg')
					.addClass(data.status)
					.html(data.msg);
		if(data.type == 'expired') {
			self.redirectTo('login');
		} else {
			self.$alert_box = msg;
			// Fix fixed position bug
			if(Modernizr.touch) {
				self.$alert_box.addClass('fixfixed');
				self.$body.animate({scrollTop: 0}, 0).prepend(msg);
			} else {
				self.$body.prepend(msg);
			}
		}
	},

	/**
	 * Highlight the layout zone
	 * @return {void}
	 */
	highlightLayout: function() {
		var self = this;
		if($('#layout-preview').length > 0) {
			var $layout_preview = $('#layout-preview');

			if($('#layout').length > 0) {
				var $layout = $('#layout');
				$layout.change(function() {					
					$.post(self.url('api/page/layout/change'), {
						header: $('#header').val(),
						layout: $layout.val(),
						footer: $('#footer').val()
					}, function(data) {
						if(data) $('#template-wrapper').empty().html(data);	
					});
				});
			}

			if($('#zone').length > 0) {
				var $zone = $('#zone');
				var zone = $zone.val();
				$layout_preview.find('[data-zone='+zone+']').addClass('active');
				$zone.change(function() {
					zone = $zone.val();
					$layout_preview.find('.active').removeClass('active');
					$layout_preview.find('[data-zone='+zone+']').addClass('active');
				});
			}

		}
	},

	/**
	 * Check if the browser is mobile
	 * @return {bool}
	 */
	mobileBrowser: function() {
		return (jQuery.browser.mobile) ? true : false;
	},

	/**
	 * Get current page Id
	 * @return {int}
	 */
	pageId: function() {
		var $input = $('input[name=page_id]');
		return ($input.length > 0) ? $input.val() : 0;
	},

	/**
	 * Redirect to url
	 * @return {void}
	 */
	redirectTo: function(url) {
		window.location = this.url(url);
	},

	/**
	 * Reset button text content
	 * @return {void}
	 */
	resetBtn: function() {
		if(!!this.btn_text && !!this.$btn_clicked) {
			this.$btn_clicked.html(this.btn_text);
			this.$btn_clicked = null;
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
			var $this = $(this);
			var $form = $this.parents('form');
			self.$api_url = $this.attr('href');
			self.checkTinyMce();
			$.ajax({
				url: self.$api_url,
				type: 'POST',
				data: $form.serialize(),
				dataType: 'json',
				context: self,
				success: self.validateForm
			}).done(function() {
				setTimeout(function() {
					self.resetBtn();
				}, self.timeout);

			});
		});
	},

	/**
	 * Set min height og TinyMce
	 * @param {[type]} n [description]
	 */
	setWysiwygMinHeight: function(n) {
		var self = this;
		var win_h = self.viewPortSize('h');
		self.$win.resize(function() {
			win_h = self.viewPortSize('h');
			return win_h / n;
		});
		return win_h / n;
	},

	/**
	 * Add loading icon to clicked button in a form
	 * @return {void}
	 */
	submitBtn: function() {
		var self = this;
		$('form .btn[type=submit]').on('click', function(e) {
			e.preventDefault();
			self.$alert_box.remove();
			$(this).parents('form').submit();
		});
	},

	/**
	 * Toggle Markers API
	 * @return {void}
	 */
	toggleApi: function() {
		$('.api-toggle').on('click', function(e) {
			e.preventDefault();
			$(this).parents('.dl-handle').find('.api').toggle();
		});
	},

	/**
	 * Toggle ajax checkboxes
	 * @return {void}
	 */
	toggleCheckbox: function() {
		var self = this;
		$('.page_rel').on('click', function() {
			var $this = $(this);
			var url = $this.parents('form').attr('action');
			var rel_id = $this.val();
			var action = (this.checked) ? 'add' : 'remove';
			$this.hide().parent('label').prepend(self.loading_tpl);
			$.post(url, {
				page_id: self.pageId(),
				rel_id: rel_id,
				action: action
			}, function(data) {
				if(data.status) {
					setTimeout(function() {
						$this.prev().remove();
						$this.show();
					}, self.timeout);
				}
			}, 'json');
		});
	},

	/**
	 * Process form submission
	 * 
	 * @param  {json obj} data 
	 * @return {void}
	 */
	validateForm: function(data) {
		this.$form_group.removeClass('has-error');
		this.$form_group.find('.err').remove();
		if(data.errors) Pongo.Page.pageError(data.errors);
		if(data.counter) this.counterUpDown(data.counter);
		if(data.infos) Pongo.Page.pageInform(data.infos);
		if(data.page) Pongo.Page.pageUpdate(data.page);
		if(data.element) Pongo.Page.elementUpdate(data.element);
		if(data.item) this.listItemAdd(data.item);
		if(data.remove) this.listItemRemove(data.remove);
		this.createAlertMessage(data);
	},

	/**
	 * Get ViewPort size
	 * 
	 * @param  {string} what
	 * @return {array}
	 */
	viewPortSize: function(what) {
		var self = this;
		var height = self.$win.height();
		var width = self.$win.width();	
		var res = [];
		res['w'] = width;
		res['h'] = height;

		return res[what];
	}

}