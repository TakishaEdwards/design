
Pongo.Page = {

	$create_btn: $('#create-page'),
	$page_lang: $('#change-lang'),
	$page_list: $('.dd'),
	$el_list: $('.dl'),

	pg_dropped_id: null,
	el_dropped_id: null,

	page_item_tpl:  '<li class="dd-item" data-id="<%= id %>">' +
						'<div class="dd-handle">' +
							'<i class="icon-unchecked"></i>' +
							' <%= name %>' +
						'</div>' +
						'<a href="page/edit/<%= id %>" class="<%= cls %>">' +
							'<i class="icon-chevron-right"></i>' +
						'</a>' +
					'</li>',

	el_item_tpl:  	'<li class="dl-item" data-id="<%= id %>">' +
						'<div class="dl-handle">' +
							'<%= name %> ' +
							'<i class="icon-unchecked"></i>' +							
						'</div>' +
						'<a href="element/edit/<%= id %>" class="<%= cls %>">' +
							'<i class="icon-chevron-right"></i>' +
						'</a>' +
					'</li>',

	printName: function() {
		console.log('sections/pages.js loaded!');
	},

	createPage: function() {
		var self = this;
		self.$create_btn.on('click', function() {
			var lang = Pongo.UI.lang;
			$.post('api/page/create', {
				lang: lang
			}, function(data) {
				
				if(data.status == 'success') {
					var tpl = _.template(self.page_item_tpl);
					var template = tpl(data);
					$('.dd[rel=' + lang + '] > ol').prepend(template);
					self.$page_list.nestable('serialize');
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
		var pagesJson = self.reorderElementStringify();
		$.post('api/element/order', {
			pages: pagesJson
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
	reorderElementStringify: function() {
		if(JSON && this.$el_list) {
			var serialObj = $('.dl').nestable('serialize');
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
			$.post('api/page/lang', {
				lang: Pongo.UI.lang
			}, function(data) {
				self.$page_list.hide();
				$('.dd[rel=' + Pongo.UI.lang + ']').show();
				Pongo.UI.createAlertMessage(data, null, null);
			}, 'json');
		});
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
		$.post('api/page/order', {
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
		$('.element-toggle').on('click', function() {
			Pongo.UI.$body.toggleClass('push-left');
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

};


$(function() {

	Pongo.Page.printName();

	Pongo.Page.toggleElements();

	Pongo.Page.createPage();

	Pongo.Page.togglePages();

	Pongo.Page.pageNestablePlugin();

	Pongo.Page.pageExpColl();

	Pongo.Page.pageSelectLang();

	Pongo.Page.elementNestablePlugin();

});