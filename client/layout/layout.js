Template.layout.helpers({
	title: function () {
		var route = Router.current().route.getName();
		
		switch (route) {
		case null:
		case undefined:
			document.title = 'CSE 6331 Quizzes and Assignments';
			return 'CSE 6331 Quizzes and Assignments';
		case 'quiz2':
			document.title = 'Quiz 2';
			return 'Quiz 2';
		case 'assignment3':
			document.title = 'Assignment 3';
			return 'Assignment 3';
		case 'quiz3':
			document.title = 'Quiz 3';
			return 'Quiz 3';
		case 'assignment4':
			document.title = 'Assignment 4';
			return 'Assignment 4';
		case 'quiz4':
			document.title = 'Quiz 4';
			return 'Quiz 4';
		case 'assignment5':
			document.title = 'Assignment 5';
			return 'Assignment 5';
		case 'quiz5':
			document.title = 'Quiz 5';
			return 'Quiz 5';
		}
	}
});
