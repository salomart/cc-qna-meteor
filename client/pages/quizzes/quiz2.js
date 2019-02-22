var mags = new ReactiveVar([]);

Template.quiz2.helpers({
	'mags': function() {
		return mags.get();
	}
});

Template.quiz2.events({
	'submit form': function(event) {
		event.preventDefault();
		
		var lowestMagnitude = event.target.lowestMagnitude.value;
		var highestMagnitude = event.target.highestMagnitude.value;
		var net = event.target.net.value;
		
		Meteor.call('getMagsByRangeAndNet', lowestMagnitude,
			highestMagnitude, net, function(error, result) {
			if (!error) {
				mags.set(result);
			}
		});
	}
});
