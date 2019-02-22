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
		}
	}
});
