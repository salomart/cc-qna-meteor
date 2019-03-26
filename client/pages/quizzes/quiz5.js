var result7Clusters = new ReactiveVar([]);
var result7ClustersTime = new ReactiveVar(null);
var result9Clusters = new ReactiveVar([]);
var result9ClustersTime = new ReactiveVar(null);
var resultClusters = new ReactiveVar([]);

Template.quiz5.onRendered(function () {
	Meteor.call('get7And9Clusters', function(error, result) {
		if (!error) {
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
	},
	'resultClusters': function() {
		return resultClusters.get();
	}
});

Template.quiz5.events({
	'submit .getClustersByNumAttrsMinnow': function(event) {
		event.preventDefault();
		
		var clusters = event.target.clusters.value;
		var attributes = event.target.attributes.value;
		var attrArr = attributes.split(", ");
		
		if (attrArr.length == 2) {
			Meteor.call('getClustersByNumAttrsMinnow', clusters, attrArr, function(error, result) {
				if (!error) {
					resultClusters.set(result);
				}
			});
		}
	}
});
