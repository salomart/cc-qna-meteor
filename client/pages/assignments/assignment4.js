var Chart = require('chart.js');

var barChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		xAxes: [{
			ticks: {
				beginAtZero: true
			}
		}],
		yAxes: [{
			ticks: {
				beginAtZero: true
			}
		}]
	},
	tooltips: {
		mode: 'nearest'
	},
	legend: {
		display: false
	}
};

var pieChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	tooltips: {
		mode: 'nearest'
	},
	cutoutPercentage: 0
};

var popCount = new ReactiveVar({
	labels: ['Less than 10M', '10M - 20M', 'More than 20M'],
	count: [0,0,0]
});

var scatterData = function(data) {
	let newData = []
	if (data.length > 0) {
		for (i=0; i<data.length; i++) {
			let obj = {
				x: i+1,
				y: data[i]
			}
			
			newData.push(obj);
		}
	}
	
	return newData;
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

Template.assignment4.onRendered(function () {
	Tracker.autorun(() => {
		let chartDiv = document.getElementById('popBarChartDiv');
		
		while (chartDiv.lastChild) {
			chartDiv.removeChild(chartDiv.lastChild);
		}
		
		let ctx = 'popBarChart';
		
		let node = document.createElement('canvas');
		node.id = ctx;
		node.style.width = '400px';
		node.style.height = '400px';
		chartDiv.appendChild(node);
		
		var popBarChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: popCount.get()['labels'],
				datasets: [{
					label: 'Population Count',
					data: popCount.get()['count'],
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: barChartOptions
		});
	});
	
	Tracker.autorun(() => {
		let chartDiv = document.getElementById('popHorizontalBarChartDiv');
		
		while (chartDiv.lastChild) {
			chartDiv.removeChild(chartDiv.lastChild);
		}
		
		let ctx = 'popHorizontalBarChart';
		let node = document.createElement('canvas');
		
		node.id = ctx;
		node.style.width = '400px';
		node.style.height = '400px';
		chartDiv.appendChild(node);
		
		var popHorizontalBarChart = new Chart(ctx, {
			type: 'horizontalBar',
			data: {
				labels: popCount.get()['labels'],
				datasets: [{
					label: 'Population Count',
					data: popCount.get()['count'],
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: barChartOptions
		});
	});
	
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
				labels: popCount.get()['labels'],
				datasets: [{
					label: 'Population Count',
					data: popCount.get()['count'],
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
				labels: popCount.get()['labels'],
				datasets: [{
					label: 'Population Count',
					data: scatterData(popCount.get()['count']),
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: barChartOptions
		});
	});
});

Template.assignment4.events({
	'submit .getPopCount': function(event) {
		event.preventDefault();
		
		var year = event.target.year.value;
		
		Meteor.call('getPopCountByYear', year, function(error, result) {
			if (!error) {
				popCount.set(result);
			}
		});
	}
});
