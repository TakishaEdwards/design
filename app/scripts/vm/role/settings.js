Pongo.VM.Settings = {

	settingsViewModel: function() {
		var self = this;
		self.itemName = ko.observable($('#name').val());
	}

};


$(function() {

	ko.applyBindings(new Pongo.VM.Settings.settingsViewModel());

});