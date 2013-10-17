Pongo.VM.Settings = {

	settingsViewModel: function() {
		var self = this;
		self.itemName = ko.observable($('#name').val());
		self.elementAttrib = ko.observable($('#attrib').val());

		self.elementState = ko.observable($('input[name=is_valid]').is(':checked'));
		self.elementStatus = ko.computed(function() {
			return self.elementState() ? 'label-success' : 'label-danger';
		});
		self.elementStatusLabel = ko.computed(function() {
			return self.elementState() ? 'online' : 'offline';
		});

		self.createAttrib = function() {
			var name = self.itemName();
			
			var slugged = name.toLowerCase()
					   	  .replace(/[^\w ]+/g,'')
					   	  .replace(/ +/g,'-');

			self.elementAttrib(slugged);
			Pongo.UI.resetBtn();
		}
	}

};


$(function() {

	ko.applyBindings(new Pongo.VM.Settings.settingsViewModel());

	Pongo.UI.changeMultiPanel();

});