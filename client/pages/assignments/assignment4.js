var Chart = require('chart.js');

var barChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		xAxes: [{
			ticks: {
				beginAtZero: true
			},
			scaleLabel: {
				display: true,
				labelString: 'Population'
			}
		}],
		yAxes: [{
			ticks: {
				beginAtZero: true
			},
			scaleLabel: {
				display: true,
				labelString: 'No. of States'
			}
		}]
	},
	legend: {
		display: false
	}
};

var hBarChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		xAxes: [{
			ticks: {
				beginAtZero: true
			},
			scaleLabel: {
				display: true,
				labelString: 'No. of States'
			}
		}],
		yAxes: [{
			ticks: {
				beginAtZero: true
			},
			scaleLabel: {
				display: true,
				labelString: 'Population'
			}
		}]
	},
	legend: {
		display: false
	}
};

var pieChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	cutoutPercentage: 0,
	tooltips: {
		callbacks: {
			label: function(tooltipItem, data) {
				var label = data.datasets[tooltipItem.datasetIndex].label;
				return label + ': ' + data.labels[tooltipItem.index];
			}
		}
	}
};

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
				labelString: 'Population'
			}
		}],
		yAxes: [{
			ticks: {
				beginAtZero: true
			},
			scaleLabel: {
				display: true,
				labelString: 'Counties'
			}
		}]
	},
	tooltips: {
		callbacks: {
			label: function(tooltipItem, data) {
				var label = data.labels[tooltipItem.index];
				return label + '(' + tooltipItem.xLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ', ' + tooltipItem.yLabel + ')';
			}
		}
	},
	legend: {
		display: false
	}
};

var popCount = new ReactiveVar([{
	labels: [],
	count: []
},{
	labels: [],
	count: []
},0,0]);

var popAndCountyCount = new ReactiveVar([]);

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
		let chartDiv = document.getElementById('popLineChartDiv');
		
		while (chartDiv.lastChild) {
			chartDiv.removeChild(chartDiv.lastChild);
		}
		
		let ctx = 'popLineChart';
		
		let node = document.createElement('canvas');
		node.id = ctx;
		node.style.width = '400px';
		node.style.height = '400px';
		chartDiv.appendChild(node);
		
		var popBarChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: popCount.get()[0]['labels'],
				datasets: [{
					label: 'Population Count',
					data: popCount.get()[0]['count'],
					fill: false,
					borderColor: borderColors[0],
					borderWidth: 1
				},{
					label: 'Population Count',
					data: popCount.get()[1]['count'],
					fill: false,
					borderColor: borderColors[1],
					borderWidth: 1
				}]
			},
			options: barChartOptions
		});
	});
	
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
				labels: popCount.get()[0]['labels'],
				datasets: [{
					label: 'Population Count',
					data: popCount.get()[0]['count'],
					backgroundColor: backgroundColors[0],
					borderColor: borderColors[0],
					borderWidth: 1
				},{
					label: 'Population Count',
					data: popCount.get()[1]['count'],
					backgroundColor: backgroundColors[1],
					borderColor: borderColors[1],
					borderWidth: 1
				}]
			},
			options: barChartOptions
		});
	});
	
	Tracker.autorun(() => {
		let chartDiv = document.getElementById('popLineBarChartDiv');
		
		while (chartDiv.lastChild) {
			chartDiv.removeChild(chartDiv.lastChild);
		}
		
		let ctx = 'popLineBarChart';
		
		let node = document.createElement('canvas');
		node.id = ctx;
		node.style.width = '400px';
		node.style.height = '400px';
		chartDiv.appendChild(node);
		
		var popBarChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: popCount.get()[0]['labels'],
				datasets: [{
					label: 'Population Count',
					data: popCount.get()[0]['count'],
					backgroundColor: backgroundColors[0],
					borderColor: borderColors[0],
					borderWidth: 1
				},{
					label: 'Population Count',
					data: popCount.get()[1]['count'],
					borderColor: borderColors[1],
					borderWidth: 1,
					type: 'line',
					fill: false,
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
				labels: popCount.get()[0]['labels'],
				datasets: [{
					label: 'Population Count',
					data: popCount.get()[0]['count'],
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: hBarChartOptions
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
				labels: popCount.get()[0]['labels'],
				datasets: [{
					label: popCount.get()[2],
					data: popCount.get()[0]['count'],
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				},{
					label: popCount.get()[3],
					data: popCount.get()[1]['count'],
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
				labels: popAndCountyCount.get()['labels'],
				datasets: [{
					label: 'Population Count',
					data: popAndCountyCount.get()['points'],
					backgroundColor: backgroundColors[0],
					borderColor: borderColors[0],
					borderWidth: 1
				}]
			},
			options: scatterPlotOptions
		});
	});
});

Template.assignment4.events({
	'submit .getPopCountByYear': function(event) {
		event.preventDefault();
		
		var year = event.target.year.value;
		var year2 = event.target.year2.value;
		
		Meteor.call('getPopCountByYear', year, year2, function(error, result) {
			if (!error) {
				popCount.set(result);
			}
		});
	},
	'submit .getPopAndCountiesByYear': function(event) {
		event.preventDefault();
		
		var year = event.target.year.value;
		
		Meteor.call('getPopAndCountiesByYear', year, function(error, result) {
			if (!error) {
				popAndCountyCount.set(result);
			}
		});
	}
});
