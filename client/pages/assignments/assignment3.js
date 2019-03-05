var sqlExTime = new ReactiveVar(null);
var sqlRisExTime = new ReactiveVar(null);
var redisExTime = new ReactiveVar(null);
var redisRisExTime = new ReactiveVar(null);

Template.assignment3.helpers({
	'sqlExTime': function() {
		return sqlExTime.get();
	},
	'sqlRisExTime': function() {
		return sqlRisExTime.get();
	},
	'redisExTime': function() {
		return redisExTime.get();
	},
	'redisRisExTime': function() {
		return redisRisExTime.get();
	}
});

Template.assignment3.events({
	'submit .getSqlExTime': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getSqlExTime', tuples, numOfQueries, function(error, result) {
			if (!error) {
				sqlExTime.set(result);
			}
		});
	},
	'submit .getSqlRisExTime': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		var net = event.target.net.value;
		net = net ? net : "us";
		
		Meteor.call('getSqlRisExTime', tuples, numOfQueries, net, function(error, result) {
			if (!error) {
				sqlRisExTime.set(result);
			}
		});
	},
	'submit .getRedisExTime': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getRedisExTime', tuples, numOfQueries, function(error, result) {
			if (!error) {
				redisExTime.set(result);
			}
		});
	},
	'submit .getRedisRisExTime': function(event) {
		event.preventDefault();
		
		var tuples = event.target.tuples.value;
		tuples = tuples ? tuples : "1";
		var numOfQueries = event.target.numOfQueries.value;
		numOfQueries ? numOfQueries : "1";
		
		Meteor.call('getRedisRisExTime', tuples, numOfQueries, net, function(error, result) {
			if (!error) {
				redisRisExTime.set(result);
			}
		});
	}
});
