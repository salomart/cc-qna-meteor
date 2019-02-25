var taskOneTime = new ReactiveVar(null);
var taskTwoTime = new ReactiveVar(null);
var taskThreeTime = new ReactiveVar(null);
var taskFourTime = new ReactiveVar(null);

Template.assignment3.helpers({
	'taskOneTime': function() {
		return taskOneTime.get();
	},
	'taskTwoTime': function() {
		return taskTwoTime.get();
	},
	'taskThreeTime': function() {
		return taskThreeTime.get();
	},
	'taskFourTime': function() {
		return taskFourTime.get();
	}
});

Template.assignment3.events({
	'submit .a3task1': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getTimeOne', tuples, numOfQueries, function(error, result) {
			if (!error) {
				taskOneTime.set(result);
			}
		});
	},
	'submit .a3task2': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		var net = event.target.net.value;
		net = net ? net : "us";
		
		Meteor.call('getTimeTwo', tuples, numOfQueries, net, function(error, result) {
			if (!error) {
				taskTwoTime.set(result);
			}
		});
	},
	'submit .a3task3': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getTimeThree', tuples, numOfQueries, function(error, result) {
			if (!error) {
				taskThreeTime.set(result);
			}
		});
	},
	'submit .a3task4': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getTimeFour', tuples, numOfQueries, net, function(error, result) {
			if (!error) {
				taskFourTime.set(result);
			}
		});
	}
});
