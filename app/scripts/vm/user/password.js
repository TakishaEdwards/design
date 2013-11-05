Pongo.VM.Password = {

	passwordViewModel: function() {
		var self = this;
		self.itemName = ko.observable($('#name').val());
		self.itemPassword = ko.observable($('#password').val());
		self.itemConfirmed = ko.observable($('#password_confirmation').val());

		self.passwordLen = ko.computed(function() {
			var observed = self.itemPassword;
			return Pongo.VM.minChars(observed, 8);
		});

		self.passwordCheck = ko.computed(function() {
			return (self.itemConfirmed().length > 0 && self.itemConfirmed() === self.itemPassword()) ? true : false;
		});
	}

};


$(function() {

	ko.applyBindings(new Pongo.VM.Password.passwordViewModel());

});