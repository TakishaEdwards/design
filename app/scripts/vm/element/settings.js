Pongo.VM.Settings = {

	settingsViewModel: function() {
		var self = this;
		self.itemName = ko.observable($('#name').val());
		self.elementAttrib = ko.observable($('#attrib').val());

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

	Pongo.UI.toggleIsValid();

	Pongo.Page.createNewElement();

	Pongo.Page.elementNestablePlugin();

});