Template.registerHelper('equal', function (a, b) {
	return a === b;
});

Template.registerHelper('headLineText', function (text, newLength) {
	var strippedString = text;
	
	if (strippedString.length > newLength) {
		var shortendText = strippedString.substring(0, newLength) + "...";
		return shortendText;
	} else {
		return strippedString;
	}
});

Template.registerHelper('formatFbDate', function (dateData) {
	var daysAgo = moment(dateData).startOf('day').fromNow();
	return daysAgo;
});