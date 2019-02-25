import { Meteor } from 'meteor/meteor';
Future = Npm.require('fibers/future');

var mysql = require('mysql');

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
	'getTimeOne': function(tuples, rowLimit, numOfQueries) {
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			connection.query('SELECT ' + tuples + ' FROM q2quakes ORDER BY RAND() LIMIT ' + rowLimit,
					function (error, results, fields) {
				if (!error) {
					fut.return(results);
				} else {
					console.log(error);
				}
			});
			
			var data = fut.wait();
		}
		
		var endTime = new Date();
		return endTime - startTime;
	},
	'getTimeTwo': function(tuples, rowLimit, numOfQueries, net) {
		var queryStr = 'SELECT ' + tuples
			+ ' FROM q2quakes WHERE net = ? ORDER BY RAND() LIMIT ' + rowLimit;
		var startTime = new Date();
		
		for (i=0; i<numOfQueries; i++) {
			var fut = new Future();
			
			connection.query(queryStr, net, function (error, results, fields) {
				if (!error) {
					fut.return(results);
				} else {
					console.log(error);
				}
			});
			
			var data = fut.wait();
		}
		
		var endTime = new Date();
		return endTime - startTime;
	}
});
