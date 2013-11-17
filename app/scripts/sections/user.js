Pongo.User = {

	$user_list: $('.user-list'),
	$role_list: $('.role-list'),
	$create_role_btn: $('#create-user'),

	user_item_tpl: 	'<li class="dd-item" data-id="<%= id %>">' +						
						'<a href="<%= url %>" class="<%= cls %>">' +						
							'<i class="fa fa-chevron-left"></i>' +						
						'</a>' +
						'<div class="dd-handle">' +						
							'<span><%= name %></span>' +
							'<label>' +
								'<input type="checkbox" value="<%= id %>" class="is_valid">' +
							'</label>' +						
						'</div>' +
					'</li>',

	user_src_tpl: 	'<li class="dd-item search" data-id="<%= id %>">' +						
						'<a href="<%= url %>" class="<%= cls %>">' +						
							'<i class="fa fa-chevron-left"></i>' +						
						'</a>' +
						'<div class="dd-handle">' +						
							'<span><%= name %></span>' +
							'<label>' +
								'<input type="checkbox" value="<%= id %>" class="is_valid"<%= checked %>>' +
							'</label>' +						
						'</div>' +
					'</li>',

	/**
	 * Create a new element
	 * @return {void}
	 */
	createNewUser: function() {
		var self = this;
		self.$create_role_btn.on('click', function() {
			self.$user_list.find('.search').remove();
			var page_id = self.$page_id;
			var lang = Pongo.UI.lang;
			$.post(Pongo.UI.url('api/user/create'),	{
				create: 'new'
			}, function(data) {
				
				if(data.status == 'success') {
					var tpl = _.template(self.user_item_tpl);
					var template = tpl(data);
					var $el = self.$user_list.find('ol');
					$el.find('a.new').removeClass('new');
					$el.prepend(template);
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

	linkUserRole: function() {
		var self = this;
		var $selected = self.$role_list.find('.user_role:checked');
		self.$role_list.on('click', '.user_role', function() {
			var $this = $(this);
			var $role = $('.user_role');
			var url = $this.parents('form').attr('action');
			var user_id = $this.parents('form').attr('data-id');
			var role_id = $this.val();
			var level = $this.attr('data-level');
			$role.prop('checked', false);
			$this.hide().parent('label').prepend(Pongo.UI.loading_tpl);
			$.post(url, {
				role_id: role_id,
				user_id: user_id,
				level: level
			}, function(data) {
				if(data.status == 'success') {					
					setTimeout(function() {
						$this.prev().remove();
						$this.prop('checked', true).show();						
					}, Pongo.UI.timeout);
				} else if(data.status == 'error') {					
					$this.prev().remove();
					$this.prop('checked', false).show();
					$selected.prop('checked', true);
					Pongo.UI.createAlertMessage(data);
				}
			}, 'json');
		});
	},

	userSearch: function() {
		var self = this;
		$('input[name=search]').on('keyup', function() {
			var $this = $(this);
			var val = $this.val();
			var item = $this.attr('data-item');
			var $el = self.$user_list.find('ol');
			if(val.length >= 3) {				
				// setTimeout(function() {
					$el.find('.search').fadeOut('fast').remove();
					$.post(Pongo.UI.url('api/'+item+'/search'), {
						input: val
					}, function(data) {
						$.each(data, function(index, value) {
							var tpl = _.template(self.user_src_tpl);
							var template = tpl(value);
							$el.prepend(template);
						});
					}, 'json');
				// }, 1000);
			} else if(val.length == 0) {
				$el.find('.search').fadeOut('fast').remove();
			}
		});
	},

	/**
	 * Manage user update
	 * @param  {json obj} page
	 * @return {void}
	 */
	userUpdate: function(user) {
		$item = $('.dd-item[data-id='+user.id+'] > .dd-handle');
		$item.find('span').html(user.name);
	},

};

$(function() {

	Pongo.User.createNewUser();

	Pongo.User.linkUserRole();

	Pongo.User.userSearch();

	Pongo.UI.paginateList('.dd-item');

	Pongo.UI.toggleIsValid();

	Pongo.UI.changeMultiPanel();

	Pongo.UI.toggleSearch();

});