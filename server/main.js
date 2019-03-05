Future = Npm.require('fibers/future');

var mysql = require('mysql');
var redis = require('ioredis');

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

var redisClient = new redis({
	port: 6379,
	host: 'cc-qna.redis.cache.windows.net',
	family: 4,
	password: '4p+V+Q7mWu2t5Rsdm7rRhJeENfC+2Z4aNTiMlPUnLio=',
	db: 0
});

Meteor.startup(() => {
});

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
	'getTimeOne': function(tuples, numOfQueries) {
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
	'getTimeTwo': function(tuples, numOfQueries, net) {
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
	'getTimeThree': function(tuples, numOfQueries) {
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
	'getTimeFour': function(tuples, numOfQueries, net) {
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
	'getQ3TimeOne': function(tuples, numOfQueries) {
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			connection.query('SELECT * FROM q3counties ORDER BY RAND() LIMIT ' + tuples,
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
	'getQ3TimeTwo': function(tuples, numOfQueries, year, minPop, maxPop) {
		var queryStr = 'SELECT County FROM q3counties INNER JOIN q3population '
			+ 'ON q3counties.State = q3population.State WHERE ? >= ? AND ? <= ? '
			+ 'ORDER BY RAND() LIMIT ' + tuples;
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			connection.query(queryStr, [year, minPop, year, maxPop], function (error, results, fields) {
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
	'getQ3TimeThree': function(tuples, numOfQueries) {
		var cursor = Math.floor(Date.now()/1000);
		var match = '*Cou*';
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
	'getQ3TimeFour': function(tuples, numOfQueries, year, minPop, maxPop) {
		var cursor = Math.floor(Date.now()/1000);
		var match = '*Pop*';
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			redisClient.keys(match).then(function (result) {
				var pipeline = redisClient.pipeline();
				
				console.log(result);
				
				for (j=0; j<result.length; j++) {
					pipeline.hget(result[j], year);
				}
				
				pipeline.exec(function (err, results) {
					console.log(results);
					fut.return('done');
				});
			});
			
			cursor = cursor + 1;
			var data = fut.wait();
		}
		
		var endTime = new Date();
		return endTime - startTime;
	},
	'getQ3TimeSeven': function(state, year) {
		var queryStr = 'SELECT `' + year + '` FROM q3population INNER JOIN q3statecode '
			+ 'ON q3population.State = q3statecode.State WHERE `State Code` = ?';
		
		var fut = new Future();
		
		connection.query(queryStr, state, function (error, results, fields) {
			if (!error) {
				console.log(results);
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data[0][year];
	},
	'getQ3TimeEight': function(state, year) {
		var queryStr = 'SELECT County FROM q3counties INNER JOIN q3statecode '
			+ 'ON q3counties.State = q3statecode.State WHERE `State Code` = ?';
		
		var fut = new Future();
		
		connection.query(queryStr, state, function (error, results, fields) {
			if (!error) {
				console.log(results);
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data;
	},
	'getQ3TimeNine': function(year, minPop, maxPop) {
		var queryStr = 'SELECT State FROM q3population WHERE `' + year + '` >= ? AND `' + year + '` <= ?';

		var fut = new Future();
		
		connection.query(queryStr, [minPop, maxPop], function (error, results, fields) {
			if (!error) {
				console.log(results);
				fut.return(results);
			} else {
				console.log(error);
				fut.return([]);
			}
		});
		
		var data = fut.wait();
		return data;
	},
	'getPopCountByYear': function(year) {
		var queryStr = 'SELECT `' + year + '` FROM q3population';
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
		
		if (data && data.length > 0) {
			for (i=0; i<data.length; i++) {
				if (data[i][year] > 0 && data[i][year] < 10000000) {
					popCount['count'][0]++;
				} else if (data[i][year] >= 10000000 && data[i][year] <= 20000000) {
					popCount['count'][1]++;
				} else if (data[i][year] > 20000000) {
					popCount['count'][2]++;
				}
			}
		}
		
		return popCount;
	}
});
