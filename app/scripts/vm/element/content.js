Pongo.VM.Content = {

	contentViewModel: function() {
		var self = this;
		self.itemName = ko.observable($('#name').val());
	}

};


$(function() {

	ko.applyBindings(new Pongo.VM.Content.contentViewModel());

});