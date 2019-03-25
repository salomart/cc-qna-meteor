var Chart = require('chart.js');

var xLabel = 'X Label';
var yLabel = 'Y Label';

var scatterPlotOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		xAxes: [{
			ticks: {
				beginAtZero: true
			},
			scaleLabel: {
				display: true,
				labelString: xLabel
			}
		}],
		yAxes: [{
			ticks: {
				beginAtZero: true
			},
			scaleLabel: {
				display: true,
				labelString: yLabel
			}
		}]
	},
	tooltips: {
		callbacks: {
			label: function(tooltipItem, data) {
				var label = data.datasets[tooltipItem.datasetIndex].label;
				return label + ' (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
			}
		}
	},
	legend: {
		display: false
	}
};

var resultClusters = new ReactiveVar([]);
var selectedPoints = new ReactiveVar([]);
var selectedPointsDist = new ReactiveVar(null);
var selectedCentroidsDist = new ReactiveVar(null);
var titanicScatterPlot = null;

Template.assignment5.onRendered(function () {
	Tracker.autorun(() => {
		let chartDiv = document.getElementById('titanicScatterPlotDiv');
		
		while (chartDiv.lastChild) {
			chartDiv.removeChild(chartDiv.lastChild);
		}
		
		let ctx = 'titanicScatterPlot';
		let node = document.createElement('canvas');
		
		node.id = ctx;
		node.style.width = '400px';
		node.style.height = '400px';
		chartDiv.appendChild(node);
		
		titanicScatterPlot = new Chart(ctx, {
			type: 'scatter',
			data: {
				labels: [],
				datasets: resultClusters.get().length > 0 ? resultClusters.get() : [],
			},
			options: scatterPlotOptions
		});
		
		titanicScatterPlot.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
		titanicScatterPlot.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
		titanicScatterPlot.update();
	});
});

Template.assignment5.helpers({
	'resultClusters': function() {
		return resultClusters.get();
	},
	'clusterLength': function() {
		return this.clusterInd.length;
	},
	'selectedPoints': function() {
		if (selectedPoints.get().length == 2) {
			return '(' + selectedPoints.get()[0] + ') and (' + selectedPoints.get()[1] + ')';
		} else if (selectedPoints.get().length == 1) {
			return '(' + selectedPoints.get()[0] + ')';
		} else {
			return '';
		}
	},
	'selectedPointsDist': function() {
		return selectedPointsDist.get() ? selectedPointsDist.get() : '';
	},
	'selectedCentroidsDist': function() {
		return selectedCentroidsDist.get() ? selectedCentroidsDist.get() : '';
	},
});

Template.assignment5.events({
	'submit .getClustersByNumAttrs': function(event) {
		event.preventDefault();
		
		var clusters = event.target.clusters.value;
		var attributes = event.target.attributes.value;
		
		var attrArr = attributes.split(", ");
		
		if (attrArr.length == 2) {
			Meteor.call('getClustersByNumAttrs', clusters, attrArr, function(error, result) {
				if (!error) {
					xLabel = attrArr[0].charAt(0).toUpperCase() + attrArr[0].slice(1);
					yLabel = attrArr[1].charAt(0).toUpperCase() + attrArr[1].slice(1);
					resultClusters.set(result);
				}
			});
		}
	},
	'click #titanicScatterPlot': function(e, t) {
		var activePoints = titanicScatterPlot.getElementAtEvent(e);
		var firstPoint = activePoints[0];
		
		if (firstPoint !== undefined) {
			var value = titanicScatterPlot.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
			
			if (selectedPoints.get().length == 2) {
				let newPoints = [selectedPoints.get()[1], [value.x, value.y]];
				selectedPoints.set(newPoints);
				selectedPointsDist.set(Math.hypot(selectedPoints.get()[0][0] - selectedPoints.get()[1][0],
					selectedPoints.get()[0][1] - selectedPoints.get()[1][1]));
			} else if (selectedPoints.get().length == 1) {
				let newPoints = [selectedPoints.get()[0], [value.x, value.y]];
				selectedPoints.set(newPoints);
				selectedPointsDist.set(Math.hypot(selectedPoints.get()[0][0] - selectedPoints.get()[1][0],
					selectedPoints.get()[0][1] - selectedPoints.get()[1][1]));
			} else {
				let newPoints = [[value.x, value.y]];
				selectedPoints.set(newPoints);
			}
		}
	},
	'submit .getDistOfCentroids': function(event) {
		event.preventDefault();
		
		var centroidOne = parseInt(event.target.centroidOne.value) - 1;
		var centroidTwo = parseInt(event.target.centroidTwo.value) - 1;
		
		if (centroidOne >= 0 && centroidOne < resultClusters.get()[0]['data'].length
			&& centroidTwo >= 0 && centroidTwo < resultClusters.get()[0]['data'].length) {
			let pointOne = resultClusters.get()[0]['data'][centroidOne];
			let pointTwo = resultClusters.get()[0]['data'][centroidTwo];
			selectedCentroidsDist.set(Math.hypot(pointOne.x - pointTwo.x, pointOne.y - pointTwo.y));
		}
	}
});
