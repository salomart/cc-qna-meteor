import '/client/layout/layout.html';
import '/client/layout/layout';
import '/client/pages/home.html';
import '/client/pages/home';
import '/client/pages/quizzes/quiz2.html';
import '/client/pages/quizzes/quiz2';

Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', function () {
	this.render('home');
});

Router.route('/quiz2', function () {
	this.render('quiz2');
});
