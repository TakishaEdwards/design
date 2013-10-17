Pongo.Element = {

	editor: null,

	formatTag: function(tag, def) {
		switch(tag) {
			case 'img':
				return '<img src="'+def+'" />';
				break;
			default:
				return def;
		}
	},

	insertContent: function(text) {
		this.editor.insertContent(text/*, {format: 'raw'}*/);
	},

	insertMarker: function() {
		var self = this;
		$('.list').on('click', '.insert',  function() {
			var tag = $(this).attr('data-tag');
			var def = $(this).attr('data-default');
			var data = (!tag) ? def : self.formatTag(tag, def);
			if(data) self.insertContent(data);
		});
	},

	settingsTinyMce: function() {
		var desktop = [];
		var mobile = [];

		desktop['toolbar'] 	= "formatselect | bold italic underline strikethrough | link | bullist numlist | table | cut copy paste | fullscreen code | undo redo";
		mobile['toolbar'] 	= "formatselect | bold italic  underline strikethrough | bullist numlist | link image | undo redo";

		desktop['plugins']	= "autolink, autoresize, code, contextmenu, fullscreen, link, paste, print, table";
		mobile['plugins']	= "autolink, autoresize, image, link";

		return (Pongo.UI.mobileBrowser()) ? mobile : desktop;
	},

	initTinyMce: function(editor) {
		this.editor = editor;
	}

};

$(function() {

	var tiny_height = Pongo.UI.setWysiwygMinHeight(3);
	var settings = Pongo.Element.settingsTinyMce();

	tinymce.init({
		auto_focus: "text",
		autoresize_min_height: tiny_height,
		contextmenu: "link",
		convert_urls: false,
		directionality: Pongo.directionality,
		document_base_url: Pongo.base,
		language: Pongo.locale,
		menubar: false,
		object_resizing : true,
		plugins: settings['plugins'],
		selector: "textarea",
		toolbar: settings['toolbar'],
		setup: function(ed) {
			ed.on('init', function() {
				Pongo.Element.initTinyMce(ed);
			});
		}
	});

	$("#fileuploader").uploadFile({
		url:Pongo.UI.url('api/page/files/upload'),
		fileName:"files",
		formData: {
			page_id: Pongo.UI.pageId(),
			action: 'insert'
		},
		allowedTypes: Pongo.mimes,
		multiple: true,
		maxUploads: Pongo.max_upload_items,
		autoSubmit: false,
		showDone: false,
		showAbort: false,
		showStatusAfterSuccess: true,
		uploadButtonClass: "btn btn-primary btn-block button",
		uploadDoneClass: "btn btn-default button",
		uploadAbortClass: "btn btn-warning button",
		uploadCancelClass: "btn btn-danger btn-block button",
		uploadStartClass: "btn btn-success btn-block",
		progressDivClass: "progress progress-striped active",
		progressBarClass: "progress-bar",
		startBtn: 'startUpload',
		returnType: 'json',

		onSubmit: function(file) {
			// console.log(file);
		},

		onSuccess: function(file, response) {
			$('.progress').remove();
			$.each(response, function(key, value) {
				var $el = $('.status-bar ul > li[rel='+key+']');
				$el.find('i').removeClass().addClass(value.icon);
				if(value.errors) {
					$.each(value.errors, function(type, error) {
						$el.after('<li class="error msg"><i class="icon-exclamation-sign"></i>'+error+'</li>');
					});
				}

				if(value.item) {
					Pongo.UI.listItemAdd(value.item);
					Pongo.UI.counterUpDown('up');
				}

			});

			Pongo.UI.createAlertMessage(response);
		}

	});

	Pongo.Element.insertMarker();
	
	Pongo.UI.changeMultiPanel();
	
	Pongo.UI.toggleApi();
	
	Pongo.UI.activePopup();

});