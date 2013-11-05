Pongo.VM.Settings = {

	settingsViewModel: function() {
		var self = this;
		self.itemName = ko.observable($('#name').val());
		self.slugBase = ko.observable($('#slug_base').val());
		self.slugLast = ko.observable($('#slug_last').val());

		self.slugFull = ko.computed(function() {
			return self.slugBase() + '/' + self.slugLast();
		});

		self.pageHomeState = ko.observable($('input[name=is_home]').is(':checked'));
		self.pageHomeStatus = ko.computed(function() {
			return self.pageHomeState() ? 'label-success' : 'label-danger';
		});

		self.pageState = ko.observable($('input[name=is_valid]').is(':checked'));
		self.pageStatus = ko.computed(function() {
			return self.pageState() ? 'label-success' : 'label-danger';
		});
		self.pageStatusLabel = ko.computed(function() {
			return self.pageState() ? 'online' : 'offline';
		});

		self.createSlug = function() {
			var name = self.itemName();
			
			var slugged = name.toLowerCase()
					   	  .replace(/[^\w ]+/g,'')
					   	  .replace(/ +/g,'-');

			self.slugLast(slugged);
			Pongo.UI.resetBtn();
		}
	}

};


$(function() {

	ko.applyBindings(new Pongo.VM.Settings.settingsViewModel());

	Pongo.UI.changeMultiPanel();
	
	Pongo.UI.checkAllClone();

	Pongo.UI.toggleCheckbox();

	Pongo.UI.toggleIsValid();

	Pongo.Page.createNewElement();

	Pongo.Page.elementNestablePlugin();
	
});