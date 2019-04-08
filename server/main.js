var Future = Npm.require('fibers/future');
var mysql = require('mysql');
var redis = require('ioredis');
var kmeans = require('node-kmeans');

var connection = mysql.createConnection({
	host: 'cse-6331-db.c72x8ipqq7oz.us-east-2.rds.amazonaws.com',
	user: 'salomart',
	password: 'cse6331qna',
	database: 'cse_6331_db'
});

connection.connect();

var closeAndExit = function() {
	connection.end();
};

process.on('SIGTERM', closeAndExit);
process.on('SIGINT', closeAndExit);

/* var redisClient = new redis({
	port: 6379,
	host: 'cc-qna.redis.cache.windows.net',
	family: 4,
	password: '4p+V+Q7mWu2t5Rsdm7rRhJeENfC+2Z4aNTiMlPUnLio=',
	db: 0
}); */

var getRandomColor = function() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	
	return color;
}

Meteor.methods({
	'getMagsByRangeAndNet': function(lowestMag, highestMag, net) {
		var fut = new Future();
		
		connection.query('SELECT mag FROM q2quakes WHERE mag >= ? AND mag <= ? AND net = ?',
				[lowestMag, highestMag, net], function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data;
	},
	'getSqlExTime': function(tuples, numOfQueries) {
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			connection.query('SELECT * FROM q2quakes ORDER BY RAND() LIMIT ' + tuples,
					function (error, results, fields) {
				if (!error) {
					fut.return(results);
				} else {
					console.log(error);
					fut.return([]);
				}
			});
			
			var data = fut.wait();
		}
		
		var endTime = new Date();
		return endTime - startTime;
	},
	'getSqlRisExTime': function(tuples, numOfQueries, net) {
		var queryStr = 'SELECT * FROM q2quakes WHERE net = ? ORDER BY RAND() LIMIT ' + tuples;
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			connection.query(queryStr, net, function (error, results, fields) {
				if (!error) {
					fut.return(results);
				} else {
					console.log(error);
					fut.return([]);
				}
			});
			
			var data = fut.wait();
		}
		
		var endTime = new Date();
		return endTime - startTime;
	},
	'getRedisExTime': function(tuples, numOfQueries) {
		var cursor = Math.floor(Date.now()/1000);
		var match = '*';
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			redisClient.scan(cursor.toString(), 'MATCH', match,
					'COUNT', tuples).then(function (result) {
				var pipeline = redisClient.pipeline();
				
				for (j=0; j<result[1].length; j++) {
					pipeline.hgetall(result[1][j]);
				}
				
				pipeline.exec(function (err, results) {
					fut.return('done');
				});
			});
			
			cursor = cursor + 1;
			var data = fut.wait();
		}
		
		var endTime = new Date();
		return endTime - startTime;
	},
	'getRedisRisExTime': function(tuples, numOfQueries, net) {
		var cursor = Math.floor(Date.now()/1000);
		var match = '*';
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			var count = 0;
			
			redisClient.scan(cursor.toString(), 'MATCH', match,
					'COUNT', tuples).then(function (result) {
				var pipeline = redisClient.pipeline();
				
				for (j=0; j<result[1].length; j++) {
					pipeline.hgetall(result[1][j]);
				}
				
				pipeline.exec(function (err, results) {
					if (results.length > 0 && results.length[0] > 0) {
						if (results[0][1]['net'] == net) {
							count = count + 1;
						}
					}
					
					fut.return('done');
				});
			});
			
			cursor = cursor + 1;
			var data = fut.wait();
		}
		
		var endTime = new Date();
		return endTime - startTime;
	},
	'getPopByStateYear': function(state, year) {
		var queryStr = 'SELECT `' + year + '` FROM q3population INNER JOIN q3statecode '
			+ 'ON q3population.State = q3statecode.State WHERE `State Code` = ?';
		
		var fut = new Future();
		
		connection.query(queryStr, state, function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data[0][year];
	},
	'getCountiesByState': function(state, year) {
		var queryStr = 'SELECT County FROM q3counties INNER JOIN q3statecode '
			+ 'ON q3counties.State = q3statecode.State WHERE `State Code` = ?';
		
		var fut = new Future();
		
		connection.query(queryStr, state, function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data;
	},
	'getStatesByPopRange': function(year, minPop, maxPop) {
		var queryStr = 'SELECT State FROM q3population WHERE `' + year + '` >= ? AND `' + year + '` <= ?';
		
		var fut = new Future();
		
		connection.query(queryStr, [minPop, maxPop], function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data;
	},
	'getPopCountByYear': function(year, year2) {
		var queryStr = 'SELECT `' + year + '`, `' + year2 + '` FROM q3population';
		var fut = new Future();
		
		connection.query(queryStr, function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		var popCount = {
			labels: ['Less than 10M', '10M - 20M', 'More than 20M'],
			count: [0,0,0]
		};
		var popCount2 = {
			labels: ['Less than 10M', '10M - 20M', 'More than 20M'],
			count: [0,0,0]
		};
		
		if (data && data.length > 0) {
			for (i=0; i<data.length; i++) {
				if (data[i][year] > 0 && data[i][year] < 10000000) {
					popCount['count'][0]++;
				} else if (data[i][year] >= 10000000 && data[i][year] <= 20000000) {
					popCount['count'][1]++;
				} else if (data[i][year] > 20000000) {
					popCount['count'][2]++;
				}
				
				if (data[i][year2] > 0 && data[i][year2] < 10000000) {
					popCount2['count'][0]++;
				} else if (data[i][year2] >= 10000000 && data[i][year2] <= 20000000) {
					popCount2['count'][1]++;
				} else if (data[i][year2] > 20000000) {
					popCount2['count'][2]++;
				}
			}
		}
		
		return [popCount, popCount2, year, year2];
	},
	'getPopAndCountiesByYear': function(year) {
		var queryStr = 'SELECT q3counties.State, `' + year + '`, COUNT(*) AS `counties` FROM q3population '
		+ 'INNER JOIN q3counties ON q3population.State = q3counties.State GROUP BY q3counties.State';
		var fut = new Future();
		
		connection.query(queryStr, function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		var points = [];
		var stateNames = [];
		
		if (data && data.length > 0) {
			for (i=0; i<data.length; i++) {
				let newObj = {};
				newObj.x = data[i][year];
				newObj.y = data[i]['counties'];
				points.push(newObj);
				stateNames.push(data[i]['State']);
			}
		}
		
		return {points: points, labels: stateNames};
	},
	'getPopCountByYearRanges': function(year, range1, range2, range3) {
		var queryStr = 'SELECT `' + year + '` FROM q3population';
		var fut = new Future();
		var range1Arr = range1.split('-');
		var range2Arr = range2.split('-');
		var range3Arr = range3.split('-');
		
		connection.query(queryStr, function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		var popCount = [{name: 'Range1', count: 0},{name: 'Range2', count: 0},{name: 'Range3', count: 0}];
		var labels = ['Range1', 'Range2', 'Range3'];
		var counts = [0,0,0];
		
		if (data && data.length > 0) {
			for (i=0; i<data.length; i++) {
				if (data[i][year] > Number(range1Arr[0]) * 1000000 && data[i][year] < Number(range1Arr[1]) * 1000000) {
					popCount[0]['count']++;
					counts[0]++;
				}
				if (data[i][year] > Number(range2Arr[0]) * 1000000 && data[i][year] < Number(range2Arr[1]) * 1000000) {
					popCount[1]['count']++;
					counts[1]++;
				}
				if (data[i][year] > Number(range3Arr[0]) * 1000000 && data[i][year] < Number(range3Arr[1]) * 1000000) {
					popCount[2]['count']++;
					counts[2]++;
				}
			}
		}
		
		return [popCount,labels,counts];
	},
	'getScatterData': function(letterCode, year) {
		var yearArr = year.split('-');
		var queryStr = 'SELECT Year, BLPercent FROM q4educationshare WHERE Year > ? AND Year < ? AND Code = ?';
		var fut = new Future();
		
		connection.query(queryStr, [Number(yearArr[0]), Number(yearArr[1]), letterCode], function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		var points = [];
		var pointNames = [];
		
		if (data && data.length > 0) {
			for (i=0; i<data.length; i++) {
				let newObj = {};
				newObj.x = data[i]['Year'];
				newObj.y = data[i]['BLPercent'];
				points.push(newObj);
				pointNames.push('Point');
			}
		}
		
		return {points: points, labels: pointNames};
	},
	'getClustersByNumAttrs': function(clusters, attrArr) {
		var queryStr = 'SELECT ' + attrArr[0] + ', ' + attrArr[1] + ' FROM a5titanic';
		var fut = new Future();
		
		connection.query(queryStr, function (error, results, fields) {
			if (!error) {
				let vectors = [];
				
				for (i=0; i<results.length; i++) {
					let sample = [results[i][attrArr[0]], results[i][attrArr[1]]];
					vectors[i] = sample;
				}
				
				kmeans.clusterize(vectors, {k: parseInt(clusters)}, (err, res) => {
					if (err) {
						console.error(err);
						fut.return([]);
					} else {
						fut.return(res);
					}
				});
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		
		var centroids = {
			label: 'Cluster Centroid',
			data: [],
			backgroundColor: 'white',
			borderColor: 'black',
			borderWidth: 3,
			showInTable: false
		}
		
		for (i=0; i<data.length; i++) {
			let points = [];
			let randomColor = getRandomColor();
			let stdDev = 0;
			
			for (j=0; j<data[i]['cluster'].length; j++) {
				let newObj = {};
				newObj.x = data[i]['cluster'][j][0];
				newObj.y = data[i]['cluster'][j][1];
				points.push(newObj);
				
				stdDev = stdDev + Math.pow((data[i]['cluster'][j][0] - data[i]['centroid'][0]), 2);
				stdDev = stdDev + Math.pow((data[i]['cluster'][j][1] - data[i]['centroid'][1]), 2);
			}
			
			stdDev = stdDev / (data[i]['cluster'].length - 1);
			stdDev = Math.pow(stdDev, 0.5);
			
			data[i]['index'] = i + 1;
			data[i]['stdDev'] = stdDev;
			
			data[i]['label'] = 'Cluster ' + data[i]['index'];
			data[i]['data'] = points;
			data[i]['backgroundColor'] = randomColor;
			data[i]['borderColor'] = randomColor;
			data[i]['borderWidth'] = 1;
			data[i]['showInTable'] = true;
			
			centroids.data.push({x: data[i]['centroid'][0], y: data[i]['centroid'][1]});
		}
		
		data.unshift(centroids);
		return data;
	},
	'get7And9Clusters': function() {
		var queryStr = 'SELECT Age, Fare FROM q5minnow';
		var queryStr2 = 'SELECT CabinNum, Fare FROM q5minnow';
		var result = [];
		var fut = new Future();
		var startTime1 = new Date();
		
		connection.query(queryStr, function (error, results, fields) {
			if (!error) {
				let vectors = [];
				
				for (i=0; i<results.length; i++) {
					let sample = [results[i]['Age'], results[i]['Fare']];
					vectors[i] = sample;
				}
				
				kmeans.clusterize(vectors, {k: parseInt(7)}, (err, res) => {
					if (err) {
						console.error(err);
						fut.return([]);
					} else {
						fut.return(res);
					}
				});
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		var endTime1 = new Date();
		
		for (i=0; i<data.length; i++) {
			data[i]['index'] = i + 1;
		}
		
		result.push(data);
		result.push(endTime1 - startTime1);
		fut = new Future();
		var startTime2 = new Date();
		
		connection.query(queryStr2, function (error, results, fields) {
			if (!error) {
				let vectors = [];
				
				for (i=0; i<results.length; i++) {
					let sample = [parseInt(results[i]['CabinNum'] / 100.0), results[i]['Fare']];
					vectors[i] = sample;
				}
				
				kmeans.clusterize(vectors, {k: parseInt(9)}, (err, res) => {
					if (err) {
						console.error(err);
						fut.return([]);
					} else {
						fut.return(res);
					}
				});
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		data = fut.wait();
		var endTime2 = new Date();
		
		for (i=0; i<data.length; i++) {
			data[i]['index'] = i + 1;
		}
		
		result.push(data);
		result.push(endTime2 - startTime2);
		return result;
	},
	'getClustersByNumAttrsMinnow': function(clusters, attrArr) {
		var queryStr = 'SELECT ' + attrArr[0] + ', ' + attrArr[1] + ' FROM q5minnow';
		var fut = new Future();
		
		connection.query(queryStr, function (error, results, fields) {
			if (!error) {
				let vectors = [];
				
				for (i=0; i<results.length; i++) {
					let sample = [results[i][attrArr[0]], results[i][attrArr[1]]];
					vectors[i] = sample;
				}
				
				kmeans.clusterize(vectors, {k: parseInt(clusters)}, (err, res) => {
					if (err) {
						console.error(err);
						fut.return([]);
					} else {
						fut.return(res);
					}
				});
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		
		for (i=0; i<data.length; i++) {
			let maxDist = 0;
			
			for (j=0; j<data[i]['cluster'].length; j++) {
				for (k=0; k<data[i]['cluster'].length; k++) {
					let pointOne = data[i]['cluster'][j];
					let pointTwo = data[i]['cluster'][k];
					distance = Math.hypot(pointOne[0] - pointTwo[0], pointOne[1] - pointTwo[1]);
					
					if (distance > maxDist) {
						maxDist = distance;
					}
				}
			}
			
			data[i]['index'] = i + 1;
			data[i]['maxDist'] = maxDist;
		}
		
		return data;
	},
	'getStatesByYearPop': function(year, population) {
		var queryStr = 'SELECT State FROM q3population WHERE `' + year + '` > ?';
		
		var fut = new Future();
		
		connection.query(queryStr, population, function (error, results, fields) {
			if (!error) {
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data;
	},
});
