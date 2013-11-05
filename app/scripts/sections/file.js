Pongo.File = {

	uploadFile: function() {
		
		$("#fileuploader").uploadFile({
			url:Pongo.UI.url('api/page/files/upload'),
			fileName:"files",
			formData: {
				page_id: Pongo.UI.pageId(),
				action: 'edit'
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

	}

};

$(function() {

	Pongo.File.uploadFile();

	Pongo.UI.activePopup();

});