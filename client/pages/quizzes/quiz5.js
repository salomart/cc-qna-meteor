var result7Clusters = new ReactiveVar([]);
var result7ClustersTime = new ReactiveVar(null);
var result9Clusters = new ReactiveVar([]);
var result9ClustersTime = new ReactiveVar(null);

Template.quiz5.onRendered(function () {
	Meteor.call('get7And9Clusters', function(error, result) {
		if (!error) {
			console.log(result);
			result7Clusters.set(result[0]);
			result7ClustersTime.set(result[1]);
			result9Clusters.set(result[2]);
			result9ClustersTime.set(result[3]);
		}
	});
});

Template.quiz5.helpers({
	'result7Clusters': function() {
		return result7Clusters.get();
	},
	'result7ClustersTime': function() {
		return result7ClustersTime.get();
	},
	'result9Clusters': function() {
		return result9Clusters.get();
	},
	'result9ClustersTime': function() {
		return result9ClustersTime.get();
	},
	'clusterLength': function() {
		return this.clusterInd.length;
	}
});

Template.quiz5.events({
	
});
