var q3TaskOneTime = new ReactiveVar(null);
var q3TaskTwoTime = new ReactiveVar(null);
var q3TaskThreeTime = new ReactiveVar(null);
var q3TaskFourTime = new ReactiveVar(null);
var q3TaskSeven = new ReactiveVar(null);
var q3TaskEight = new ReactiveVar([]);
var q3TaskNine = new ReactiveVar([]);

Template.quiz3.helpers({
	'taskOneTime': function() {
		return q3TaskOneTime.get();
	},
	'taskTwoTime': function() {
		return q3TaskTwoTime.get();
	},
	'taskThreeTime': function() {
		return q3TaskThreeTime.get();
	},
	'taskFourTime': function() {
		return q3TaskFourTime.get();
	},
	'population': function() {
		return q3TaskSeven.get();
	},
	'countyCount': function() {
		return q3TaskEight.get().length;
	},
	'counties': function() {
		return q3TaskEight.get();
	},
	'states': function() {
		return q3TaskNine.get();
	}
});

Template.quiz3.events({
	'submit .q3task7': function(event) {
		event.preventDefault();
		
		var state = event.target.state.value;
		var year = event.target.year.value;
		
		Meteor.call('getQ3TimeSeven', state, year, function(error, result) {
			if (!error) {
				q3TaskSeven.set(result);
			}
		});
	},
	'submit .q3task8': function(event) {
		event.preventDefault();
		
		var state = event.target.state.value;
		
		Meteor.call('getQ3TimeEight', state, function(error, result) {
			if (!error) {
				q3TaskEight.set(result);
			}
		});
	},
	'submit .q3task9': function(event) {
		event.preventDefault();
		
		var year = event.target.year.value;
		var minPop = event.target.minPop.value;
		var maxPop = event.target.maxPop.value;
		
		if (year >= 2010 && year <= 2018) {
			Meteor.call('getQ3TimeNine', year, minPop, maxPop, function(error, result) {
				if (!error) {
					q3TaskNine.set(result);
				}
			});
		}
	}/*,
	'submit .q3task1': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getQ3TimeOne', tuples, numOfQueries, function(error, result) {
			if (!error) {
				q3TaskOneTime.set(result);
			}
		});
	},
	'submit .q3task2': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		var year = event.target.year.value;
		year = year ? year : "0";
		var minPop = event.target.minPop.value;
		minPop = minPop ? minPop : "0";
		var maxPop = event.target.maxPop.value;
		maxPop = maxPop ? maxPop : "50000000";
		
		if (year >= 2010 && year <= 2018) {
			Meteor.call('getQ3TimeTwo', tuples, numOfQueries, year, minPop, maxPop, function(error, result) {
				if (!error) {
					q3TaskTwoTime.set(result);
				}
			});
		}
	},
	'submit .q3task3': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getQ3TimeThree', tuples, numOfQueries, function(error, result) {
			if (!error) {
				q3TaskThreeTime.set(result);
			}
		});
	},
	'submit .q3task4': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		var year = event.target.year.value;
		year = year ? year : "0";
		var minPop = event.target.minPop.value;
		minPop = minPop ? minPop : "0";
		var maxPop = event.target.maxPop.value;
		maxPop = maxPop ? maxPop : "50000000";
		
		if (year >= 2010 && year <= 2018) {
			Meteor.call('getQ3TimeFour', tuples, numOfQueries, year, minPop, maxPop, function(error, result) {
				if (!error) {
					q3TaskTwoTime.set(result);
				}
			});
		}
	}*/
});
