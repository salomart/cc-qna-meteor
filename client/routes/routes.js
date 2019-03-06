import '/client/layout/layout.html';
import '/client/layout/layout';
import '/client/pages/home.html';
import '/client/pages/home';
import '/client/pages/quizzes/quiz2.html';
import '/client/pages/quizzes/quiz2';
import '/client/pages/assignments/assignment3.html';
import '/client/pages/assignments/assignment3';
import '/client/pages/quizzes/quiz3.html';
import '/client/pages/quizzes/quiz3';
import '/client/pages/assignments/assignment4.html';
import '/client/pages/assignments/assignment4';
import '/client/pages/quizzes/quiz4.html';
import '/client/pages/quizzes/quiz4';

Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', function () {
	this.render('home');
});

Router.route('/quiz2', function () {
	this.render('quiz2');
});

Router.route('/assignment3', function () {
	this.render('assignment3');
});

Router.route('/quiz3', function () {
	this.render('quiz3');
});

Router.route('/assignment4', function () {
	this.render('assignment4');
});

Router.route('/quiz4', function () {
	this.render('quiz4');
});
