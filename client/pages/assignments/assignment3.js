var taskOneTime = new ReactiveVar(null);
var taskTwoTime = new ReactiveVar(null);

Template.assignment3.helpers({
	'taskOneTime': function() {
		return taskOneTime.get();
	},
	'taskTwoTime': function() {
		return taskTwoTime.get();
	}
});

Template.assignment3.events({
	'submit .a3task1': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "*";
		var rowLimit = event.target.rowLimit.value;
		rowLimit = rowLimit ? rowLimit : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getTimeOne', tuples, rowLimit, numOfQueries, function(error, result) {
			if (!error) {
				taskOneTime.set(result);
			}
		});
	},
	'submit .a3task2': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "*";
		var rowLimit = event.target.rowLimit.value;
		rowLimit = rowLimit ? rowLimit : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		var net = event.target.net.value;
		net = net ? net : "us";
		
		Meteor.call('getTimeTwo', tuples, rowLimit, numOfQueries, net, function(error, result) {
			if (!error) {
				taskTwoTime.set(result);
			}
		});
	}
});
