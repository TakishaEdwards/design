Pongo.Role = {

	$role_list: $('.dl'),
	$create_role_btn: $('#create-role'),

	role_item_tpl: 	'<li class="dl-item" data-id="<%= id %>">' +						
						'<div class="dl-handle full">' +						
							'<span><%= name %></span>' +						
						'</div>' +						
						'<a href="<%= url %>" class="<%= cls %>">' +						
							'<i class="fa fa-chevron-left"></i>' +						
						'</a>' +
					'</li>',

	/**
	 * Execute nestable.js plugin on Roles
	 * @return {void} 
	 */
	roleNestablePlugin: function() {
		var self = this;
		self.$role_list.nestable({
			maxDepth: 0,
			rootClass: 'dl',
			listClass: 'dl-list',
			notClass: 'dl-not',
			itemClass: 'dl-item',
			dragClass: 'dl-dragel',
			handleClass: 'dl-handle',
			placeClass: 'dl-placeholder',
			dropCallback: function(id) {
				Pongo.Page.reorderElement(id);
			}
		}).on('reorder', function() {
			self.reorderRolePost();
		});
	},

	/**
	 * Post JSON array to controller
	 * @return {string} json
	 */
	reorderRolePost: function() {
		var self = this;
		var rolesJson = Pongo.Page.reorderElementStringify(this.$role_list);
		console.log(rolesJson);
		$.post(Pongo.UI.url('api/role/order'), {
			roles: rolesJson
		}, function(data) {
			Pongo.UI.createAlertMessage(data, null, null);
			setTimeout(function() {
				Pongo.Page.reorderElementReset();
			}, Pongo.UI.timeout);
		}, 'json');
	},

	/**
	 * Create a new element
	 * @return {void}
	 */
	createNewRole: function() {
		var self = this;
		self.$create_role_btn.on('click', function() {
			var page_id = self.$page_id;
			var lang = Pongo.UI.lang;
			$.post(Pongo.UI.url('api/role/create'),	{
				create: 'new'
			}, function(data) {
				
				if(data.status == 'success') {
					var tpl = _.template(self.role_item_tpl);
					var template = tpl(data);
					var $el = $('.dl > ol');
					$el.find('a.new').removeClass('new');
					$el.append(template);
					// self.$el_list.nestable('serialize');
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
	 * Manage user update
	 * @param  {json obj} page
	 * @return {void}
	 */
	roleUpdate: function(role) {
		$item = $('.dl-list').find('li[data-id='+role.id+'] > .dl-handle');
		$item.find('span').not('.label').html(role.name);
	},

};

$(function() {

	Pongo.Role.roleNestablePlugin();

	Pongo.Role.createNewRole();

	// Pongo.UI.paginateList('.dd-item');


});