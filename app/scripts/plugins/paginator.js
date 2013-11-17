/*!
 * LoadNext, a jQuery plugin for PongoCMS v2
 * Version v0.1.1
 * http://pongoweb.it/
 *
 * Copyright (c) 2012 Fabio Fumis
 * Licensed under the MIT License: 
 * http://pongoweb.it/license
 */

(function($) {
	
	$.LoadNext = function(options) 
	{

		// default configuration properties
		var defaults = {	
			container: 'active',
			next: '.next',
			item: '.item',
			btn_class: 'btn',
			onClickNext: function() {},
			onLoadComplete: function() {},
		};

		var opts = $.extend(defaults, options);

		// Hide paginator
		var $paginator = $(opts.next).hide();

		// Get next link
		var url = $paginator.find(opts.next_link).attr('href');

		// Get item wrapper
		var $wrapper = $paginator.parent();

		// Create load button
		var $button = $('<a />').appendTo($wrapper);

		$button.attr('href', url)
			   .html(Pongo.load)
			   .addClass(opts.btn_class);		

		// Load url and get results
		$button.on('click', function(e) {
			e.preventDefault();
			var $self = $(this);
			var url = $self.attr('href');
			Pongo.UI.$btn_clicked = $self;
			Pongo.UI.addSpin();
			$.get(url, null, function (data) {
				// filter data result
				var $new_items = $(data).find(opts.container).children();				
				// get new url from last pagination
				var new_url = $new_items.last().find(opts.next_link).attr('href');
				// hide last pagination
				$new_items.last().hide();
				(new_url) ?	$self.attr('href', new_url) : $self.hide();
				$new_items.insertBefore($button);
				Pongo.UI.resetBtn();
			}, 'html');
		});
	}

})(jQuery);