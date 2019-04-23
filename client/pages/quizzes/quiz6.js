//var population = new ReactiveVar(null);
//var counties = new ReactiveVar([]);
var states = new ReactiveVar([]);
var getStatesTime = new ReactiveVar(0);
var exTimes = new ReactiveVar([]);
var overallExTime = new ReactiveVar(0);

Template.quiz6.helpers({
	/*'population': function() {
		return population.get().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	},
	'countyCount': function() {
		return counties.get().length;
	},
	'counties': function() {
		return counties.get();
	},*/
	'states': function() {
		return states.get();
	},
	'getStatesTime': function() {
		return getStatesTime.get();
	},
	'exTimes': function() {
		return exTimes.get();
	},
	'overallExTime': function() {
		return overallExTime.get();
	}
});

Template.quiz6.events({
	'submit .getStatesByYearPop': function(event) {
		event.preventDefault();
		var startTime = new Date();
		
		var year = event.target.year.value;
		var population = event.target.population.value;
		
		Meteor.call('getStatesByYearPop', year, population, function(error, result) {
			if (!error) {
				states.set(result);
				var endTime = new Date();
				getStatesTime.set(endTime - startTime);
			}
		});
	},
	'submit .getStatesByYearRandomPops': function(event) {
		event.preventDefault();
		var startTime = new Date();
		
		var year = event.target.year2.value;
		var count = event.target.exCount.value;
		
		Meteor.call('getStatesByYearRandomPops', year, count, function(error, result) {
			if (!error) {
				exTimes.set(result);
				var endTime = new Date();
				overallExTime.set(endTime - startTime);
			}
		});
	},
	/*'submit .getPopByStateYear': function(event) {
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
	}*/
});
