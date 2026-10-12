Implement an interactive user interface element (radio buttons) to let users choose whether to see classes for fall, winter, or spring. Follow these steps:

- Add a selectedTerm state variable initialized to 'Fall'.
- Create a TermSelector with Fall, Winter, and Spring buttons.
- Create a TermPage that owns the selected term state.
- Pass the selected term to CourseList.
- Filter courses with course.term === selectedTerm.
- Update state when a term button is clicked.