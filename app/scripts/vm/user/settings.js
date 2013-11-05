Pongo.VM.Settings = {

	settingsViewModel: function() {
		var self = this;
		self.itemName = ko.observable($('#name').val());

		self.nameLen = ko.computed(function() {
			var observed = self.itemName;
			return Pongo.VM.countChars(observed, 20);
		});
	}

};


$(function() {

	ko.applyBindings(new Pongo.VM.Settings.settingsViewModel());

});