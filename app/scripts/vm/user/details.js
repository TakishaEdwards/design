Pongo.VM.Details = {

	detailsViewModel: function() {
		var self = this;
		self.date = ko.observable($('#date').val());

		self.day = ko.computed(function() {
			var date_arr = self.date().split('-');
			return date_arr[2];
		});

		self.month = ko.computed(function() {
			var date_arr = self.date().split('-');
			return date_arr[1];
		});

		self.year = ko.computed(function() {
			var date_arr = self.date().split('-');
			return date_arr[0];
		});

		self.hh = ko.computed(function() {
			if(self.date().indexOf(':') > 0) {
				var date_arr = self.date().split(' ');
				var time = date_arr[1].split(':')
				return time[0];
			}
		});

		self.mm = ko.computed(function() {
			if(self.date().indexOf(':') > 0) {
				var date_arr = self.date().split(' ');
				var time = date_arr[1].split(':')
				return time[1];
			}
		});
	}

};


$(function() {

	ko.applyBindings(new Pongo.VM.Details.detailsViewModel(), $('#page-panel')[0]);

});