Pongo.Page = {

	$create_pg_btn: $('#create-page'),
	$create_el_btn: $('#create-element'),
	$page_lang: $('#change-lang'),
	$page_id: Pongo.UI.pageId(),
	$page_list: $('.dd'),
	$el_list: $('.dl'),
	$el_counter: $('.element-toggle span'),

	pg_dropped_id: null,
	el_dropped_id: null,

	page_item_tpl:  '<li class="dd-item" data-id="<%= id %>">' +
						'<div class="dd-handle">' +
							'<i class="icon-unchecked"></i>' +
							' <%= name %>' +
						'</div>' +
						'<a href="<%= url %>" class="<%= cls %>">' +
							'<i class="icon-chevron-right"></i>' +
						'</a>' +
					'</li>',

	el_item_tpl:  	'<li class="dl-item" data-id="<%= id %>">' +
						'<div class="dl-handle">' +
							' <%= name %> ' +
						'</div>' +
						'<label>' +
							'<input type="checkbox" value="<%= id %>" class="is_valid">' +
						'</label>' +
						'<a href="<%= url %>" class="<%= cls %>">' +
							'<i class="icon-chevron-left"></i>' +
						'</a>' +
					'</li>',

	/**
	 * Create a new element
	 * @return {void}
	 */
	createNewElement: function() {
		var self = this;
		self.$create_el_btn.on('click', function() {
			var page_id = self.$page_id;
			var lang = Pongo.UI.lang;
			$.post(Pongo.UI.url('api/element/create'), {
				page_id: page_id,
				lang: lang
			}, function(data) {
				
				if(data.status == 'success') {
					var tpl = _.template(self.el_item_tpl);
					var template = tpl(data);
					var $el = $('.dl ol');
					$el.find('a.new').removeClass('new');
					$el.prepend(template);
					Pongo.UI.counterUpDown(data.counter);
					self.$el_list.nestable('serialize');
					Pongo.UI.createAlertMessage(data, null, null);
				} else {
					Pongo.UI.createAlertMessage(data, null, null);
				}
				
				setTimeout(function() {
					Pongo.UI.resetBtn();
				}, Pongo.UI.timeout);
			}, 'json');
		});
	},

	/**
	 * Create a new page
	 * @return {void}
	 */
	createNewPage: function() {
		var self = this;
		self.$create_pg_btn.on('click', function() {
			var lang = Pongo.UI.lang;
			$.post(Pongo.UI.url('api/page/create'), {
				lang: lang
			}, function(data) {
				
				if(data.status == 'success') {
					var tpl = _.template(self.page_item_tpl);
					var template = tpl(data);
					var $el = $('.dd[rel=' + lang + '] > ol');					
					$el.find('a.new').removeClass('new');
					$el.prepend(template);
					self.$page_list.nestable('serialize');
					Pongo.UI.createAlertMessage(data, null, null);
				} else {
					Pongo.UI.createAlertMessage(data, null, null);
				}
				
				setTimeout(function() {
					Pongo.UI.resetBtn();
				}, Pongo.UI.timeout);
			}, 'json');
		});
	},

	/**
	 * Execute nestable.js plugin on Elements
	 * @return {void} 
	 */
	elementNestablePlugin: function() {
		var self = this;
		self.$el_list.nestable({
			maxDepth: 0,
			rootClass: 'dl',
			listClass: 'dl-list',
			itemClass: 'dl-item',
			dragClass: 'dl-dragel',
			handleClass: 'dl-handle',
			placeClass: 'dl-placeholder',
			dropCallback: function(id) {
				self.reorderElement(id);
			}
		}).on('reorder', function() {
			self.reorderElementPost();
		});
	},

	/**
	 * Manage element item icons update
	 * @param  {json obj} page
	 * @return {void}
	 */
	elementUpdate: function(element) {
		$item = $('.dl-item[data-id='+element.id+'] > .dl-handle');
		$item.find('span').html(element.name);
	},

	/**
	 * Reorder element actions
	 * @param  {int} id
	 * @return {void}
	 */
	reorderElement: function(id) {
		this.el_dropped_id = id;
		this.reorderElementLoading();
	},

	/**
	 * Start loading icon on reorder
	 * @return {void}
	 */
	reorderElementLoading: function() {
		var id = this.el_dropped_id;
		var $el = $('.dl-item[data-id='+id+'] > a').find('i');
		$el.removeClass('icon-chevron-left')
		   .addClass('icon-refresh icon-spin');
	},

	/**
	 * Post JSON array to controller
	 * @return {string} json
	 */
	reorderElementPost: function() {
		var self = this;
		var pagesJson = self.reorderElementStringify(this.$el_list);
		$.post(Pongo.UI.url('api/element/order'), {
			elements: pagesJson,
			page_id: self.$page_id
		}, function(data) {
			Pongo.UI.createAlertMessage(data, null, null);
			setTimeout(function() {
				self.reorderElementReset();
			}, Pongo.UI.timeout);
		}, 'json');
	},

	/**
	 * Reset loading icon on finish reordering
	 * @return {void}
	 */
	reorderElementReset: function() {
		var id = this.el_dropped_id;
		var $el = $('.dl-item[data-id='+id+'] > a').find('i');
		$el.removeClass('icon-refresh icon-spin')
		   .addClass('icon-chevron-left');
	},

	/**
	 * Stringify JSON on reorder elements
	 * @return {string} Json object stringified
	 */
	reorderElementStringify: function(list) {
		if(JSON && this.$el_list) {
			var serialObj = list.nestable('serialize');
			return JSON.stringify(serialObj);
		} else {
			var data = {
				status: 'error',
				msg: 'Unsupported browser!'
			}
			Pongo.UI.createAlertMessage(data, null, null);
		}
	},

	/**
	 * Execute nestable.js plugin on Pages
	 * @return {void} 
	 */
	pageNestablePlugin: function() {
		var self = this;
		self.$page_list.nestable({
			dropCallback: function(id) {
				self.reorderPage(id);
			}
		}).on('reorder', function() {
			self.reorderPagePost();
		});
	},

	/**
	 * Switch expand/collapse all pages menu
	 * @return {void}
	 */
	pageExpColl: function() {
		var self = this;
		$('.page-controls').on('click', function(e)	{
			var target = $(e.target),
				action = target.data('action');
			if (action === 'expand-all') {
				self.$page_list.nestable('expandAll');
			}
			if (action === 'collapse-all') {
				self.$page_list.nestable('collapseAll');
			}
		});
	},

	pageSelectLang: function() {
		var self = this;
		Pongo.UI.lang = this.$page_lang.val();
		$('.dd[rel=' + Pongo.UI.lang + ']').show();
		// Change event
		this.$page_lang.on('change', function() {
			Pongo.UI.lang = self.$page_lang.val();
			$.post(Pongo.UI.url('api/page/lang'), {
				lang: Pongo.UI.lang
			}, function(data) {
				self.$page_list.hide();
				$('.dd[rel=' + Pongo.UI.lang + ']').show();
				Pongo.UI.createAlertMessage(data, null, null);
			}, 'json');
		});
	},

	/**
	 * Manage data errors on validateForm
	 * @param  {json obj} errors
	 * @return {void}
	 */
	pageError: function(errors) {
		$.each(errors, function(key, value) {
			$item = $('.form-group[rel='+key+']');
			$item.removeClass('has-error');
			$item.find('.help-block').remove();
			$item.addClass('has-error');
			$item.children('label').append('<span class="err"> - '+value+'</span>');
		});
	},

	/**
	 * Manage data informations on validateForm
	 * @param  {json obj} infos (rel|msg)
	 * @return {void}
	 */
	pageInform: function(infos) {
		$.each(infos, function(key, value) {
			$item = $('.form-group[rel='+key+']');
			$item.removeClass('has-error');
			$item.find('.help-block').remove();
			$item.append('<span class="help-block">'+value+'</span>');
		});
	},

	/**
	 * Manage pageitem icons update
	 * @param  {json obj} page
	 * @return {void}
	 */
	pageUpdate: function(page) {
		$('.slug-full').html(page.slug);
		$item = $('.dd-item[data-id='+page.id+'] > .dd-handle');
		$item.find('span').html(page.name);
		var $home = $item.find('.icon-home');
		if(page.home) {
			$('.dd[rel=' + page.lang + '] > ol').find('.icon-home').hide();
			$home.show();
		} else {
			$home.hide();
		}
		var $check = $item.find('.check');
		if(page.checked && $check.hasClass('icon-unchecked'))
			$check.removeClass('icon-unchecked').addClass('icon-check');
		if(!page.checked && $check.hasClass('icon-check'))
			$check.removeClass('icon-check').addClass('icon-unchecked');
	},

	/**
	 * Reorder page actions
	 * @param  {int} id
	 * @return {void}
	 */
	reorderPage: function(id) {
		this.pg_dropped_id = id;
		this.reorderPageLoading();
	},

	/**
	 * Start loading icon on reorder
	 * @return {void}
	 */
	reorderPageLoading: function() {
		var id = this.pg_dropped_id;
		var $el = $('.dd-item[data-id='+id+'] > a').find('i');
		$el.removeClass('icon-chevron-right')
		   .addClass('icon-refresh icon-spin');
	},

	/**
	 * Post JSON array to controller
	 * @return {string} json
	 */
	reorderPagePost: function() {
		var self = this;
		var pagesJson = self.reorderPageStringify();
		$.post(Pongo.UI.url('api/page/order'), {
			pages: pagesJson
		}, function(data) {
			Pongo.UI.createAlertMessage(data, null, null);
			setTimeout(function() {
				self.reorderPageReset();
			}, Pongo.UI.timeout);
		}, 'json');
	},

	/**
	 * Reset loading icon on finish reordering
	 * @return {void}
	 */
	reorderPageReset: function() {
		var id = this.pg_dropped_id;
		var $el = $('.dd-item[data-id='+id+'] > a').find('i');
		$el.removeClass('icon-refresh icon-spin')
		   .addClass('icon-chevron-right');
	},

	/**
	 * Stringify JSON on reorder pages
	 * @return {string} Json object stringified
	 */
	reorderPageStringify: function() {
		if(JSON && this.$page_list) {
			var serialObj = $('.dd[rel=' + Pongo.UI.lang + ']').nestable('serialize');
			return JSON.stringify(serialObj);
		} else {
			var data = {
				status: 'error',
				msg: 'Unsupported browser!'
			}
			Pongo.UI.createAlertMessage(data, null, null);
		}
	},

	/**
	 * Show/hide page elements
	 * @return {void}
	 */
	toggleElements: function() {
		var self = this;
		$('.right-toggle').on('click', function() {
			Pongo.UI.$body.toggleClass('push-left');
		});
	},

	/**
	 * Show/hide page elements
	 * @return {void}
	 */
	toggleOptions: function() {
		var self = this;
		$('.options-toggle').on('click', function() {
			Pongo.UI.$body.toggleClass('push-right-options');
		});
	},

	/**
	 * Show/hide page manager
	 * @return {void}
	 */
	togglePages: function() {
		var self = this;
		$('.page-toggle').on('click', function() {
			Pongo.UI.$body.toggleClass('push-right');
		});
	},

	untoggleMenu: function() {
		var self = this;
		Pongo.UI.$overlay.on('click', function() {
			Pongo.UI.$body.removeClass();
			$('.close-modal').trigger('click');
		});
	},

};


$(function() {

	Pongo.Page.toggleOptions();

	Pongo.Page.toggleElements();

	Pongo.Page.togglePages();
	
	Pongo.Page.createNewPage();
	
	Pongo.Page.untoggleMenu();

	Pongo.Page.pageNestablePlugin();

	Pongo.Page.pageExpColl();

	Pongo.Page.pageSelectLang();

});