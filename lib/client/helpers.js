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

Template.registerHelper('formatDate', function (dateData) {
	var daysAgo = moment(dateData).startOf('day').fromNow();
	return daysAgo;
});

Template.registerHelper('dateFormatWeekDay', function (dateData) {
	var day = moment(dateData).format('ddd');
	return day;
});

Template.registerHelper('dateFormatDayMonth', function (dateData) {
	var date = moment(dateData).format('DD / MM');
	return date;
});