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
		}
	}
});
