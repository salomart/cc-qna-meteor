var resultClusters = new ReactiveVar(null);

Template.assignment5.onRendered(function () {
});

Template.assignment5.helpers({
	'resultClusters': function() {
		return resultClusters.get();
	}
});

Template.assignment5.events({
	'submit .getClustersByNumAttrs': function(event) {
		event.preventDefault();
		
		var clusters = event.target.clusters.value;
		var attributes = event.target.attributes.value;
		
		Meteor.call('getClustersByNumAttrs', clusters, attributes, function(error, result) {
			if (!error) {
				resultClusters.set(result);
			}
		});
	}
});
