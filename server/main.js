import { Meteor } from 'meteor/meteor';
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
					return 'error';
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
					return 'error';
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
			
			var scanStream = redisClient.scan(cursor.toString(), 'MATCH',
					match, 'COUNT', tuples).then(function (result) {
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
			
			var scanStream = redisClient.scan(cursor.toString(), 'MATCH',
					match, 'COUNT', tuples).then(function (result) {
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
	}
});
