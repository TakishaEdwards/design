Pongo.VM.Seo = {

	seoViewModel: function() {
		var self = this;
		self.pageTitle = ko.observable($('#title').val());
		self.pageDescr = ko.observable($('#descr').val());

		self.titleLen = ko.computed(function() {
			var observed = self.pageTitle;
			return Pongo.VM.countChars(observed, 70);
		});

		self.descrLen = ko.computed(function() {
			var observed = self.pageDescr;
			return Pongo.VM.countChars(observed, 250);
		});
	}

};

$(function() {

	ko.applyBindings(new Pongo.VM.Seo.seoViewModel(), $('#page-panel')[0]);

	Pongo.UI.changeMultiPanel();

	Pongo.UI.toggleCheckbox();

});