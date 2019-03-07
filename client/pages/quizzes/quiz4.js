var popCount = new ReactiveVar([[],[],[]]);
var scatterData = new ReactiveVar([[],[]]);
var Chart = require('chart.js');

var pieChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	cutoutPercentage: 0
};

var scatterPlotOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		xAxes: [{
			scaleLabel: {
				display: true,
				labelString: 'Year'
			}
		}],
		yAxes: [{
			scaleLabel: {
				display: true,
				labelString: 'BLPercent'
			}
		}]
	},
	legend: {
		display: false
	}
};

var backgroundColors = [
	'rgba(255, 99, 132, 0.2)',
	'rgba(54, 162, 235, 0.2)',
	'rgba(75, 192, 192, 0.2)'
];

var borderColors = [
	'rgba(255, 99, 132, 1)',
	'rgba(54, 162, 235, 1)',
	'rgba(75, 192, 192, 1)'
];

Template.quiz4.onRendered(function () {
	Tracker.autorun(() => {
		let chartDiv = document.getElementById('popPieChartDiv');
		
		while (chartDiv.lastChild) {
			chartDiv.removeChild(chartDiv.lastChild);
		}
		
		let ctx = 'popPieChart';
		let node = document.createElement('canvas');
		
		node.id = ctx;
		node.style.width = '400px';
		node.style.height = '400px';
		chartDiv.appendChild(node);
		
		var popPieChart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: popCount.get()[1],
				datasets: [{
					label: "Count By Ranges",
					data: popCount.get()[2],
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: pieChartOptions
		});
	});
	
	Tracker.autorun(() => {
		let chartDiv = document.getElementById('popScatterPlotDiv');
		
		while (chartDiv.lastChild) {
			chartDiv.removeChild(chartDiv.lastChild);
		}
		
		let ctx = 'popScatterPlot';
		let node = document.createElement('canvas');
		
		node.id = ctx;
		node.style.width = '400px';
		node.style.height = '400px';
		chartDiv.appendChild(node);
		
		var popScatterPlot = new Chart(ctx, {
			type: 'scatter',
			data: {
				labels: scatterData.get()['labels'],
				datasets: [{
					label: 'Population Count',
					data: scatterData.get()['points'],
					backgroundColor: backgroundColors[0],
					borderColor: borderColors[0],
					borderWidth: 1
				}]
			},
			options: scatterPlotOptions
		});
	});
});

Template.quiz4.helpers({
	'popCount': function() {
		return popCount.get()[0];
	}
});

Template.quiz4.events({
	'submit .getPopCountByYearRanges': function(event) {
		event.preventDefault();
		
		var year = event.target.year.value;
		var range1 = event.target.range1.value;
		var range2 = event.target.range2.value;
		var range3 = event.target.range3.value;
		
		Meteor.call('getPopCountByYearRanges', year, range1, range2, range3, function(error, result) {
			if (!error) {
				popCount.set(result);
			}
		});
	},
	'submit .getScatterData': function(event) {
		event.preventDefault();
		
		var letterCode = event.target.letterCode.value;
		var year = event.target.year.value;
		
		Meteor.call('getScatterData', letterCode, year, function(error, result) {
			if (!error) {
				scatterData.set(result);
			}
		});
	}
});
