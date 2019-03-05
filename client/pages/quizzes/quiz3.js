var population = new ReactiveVar(null);
var counties = new ReactiveVar([]);
var states = new ReactiveVar([]);

Template.quiz3.helpers({
	'population': function() {
		return population.get();
	},
	'countyCount': function() {
		return counties.get().length;
	},
	'counties': function() {
		return counties.get();
	},
	'states': function() {
		return states.get();
	}
});

Template.quiz3.events({
	'submit .getPopByStateYear': function(event) {
		event.preventDefault();
		
		var state = event.target.state.value;
		var year = event.target.year.value;
		
		Meteor.call('getPopByStateYear', state, year, function(error, result) {
			if (!error) {
				population.set(result);
			}
		});
	},
	'submit .getCountiesByState': function(event) {
		event.preventDefault();
		
		var state = event.target.state.value;
		
		Meteor.call('getCountiesByState', state, function(error, result) {
			if (!error) {
				counties.set(result);
			}
		});
	},
	'submit .getStatesByPopRange': function(event) {
		event.preventDefault();
		
		var year = event.target.year.value;
		var minPop = event.target.minPop.value;
		var maxPop = event.target.maxPop.value;
		
		if (year >= 2010 && year <= 2018) {
			Meteor.call('getStatesByPopRange', year, minPop, maxPop, function(error, result) {
				if (!error) {
					states.set(result);
				}
			});
		}
	}
});
