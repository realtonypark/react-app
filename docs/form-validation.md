Add code to check that the form data is valud course data and give user feedback about which fields have bad data.

This involves define a type schema for course data and a validator function that can be used a a resolver in the form. At a minimum:

the course title must be at least two characters, e.g., "AI" would be accepted but not "X"
the term must be the string Fall, Winter, Spring, or Summer
the course number must be a string that is a number with an optional section, e.g., "213-2"
the meeting time must be either the empty string or a legal meeting time with one or more days and a non-empty timespan.
Helpful messages should appear next to form fields with invalid data, such "must contain days and start-end, e.g., MWF 12:00-13:20".