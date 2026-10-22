const DAY_PATTERN = /Su|Sa|Th|Tu|M|W|F/g;

const parseDays = (daysText) => daysText.match(DAY_PATTERN) ?? [];

const parseTime = (timeText) => {
  const [hours, minutes] = timeText.split(':').map(Number);
  return hours * 60 + minutes;
};

const parseMeeting = (meetingText) => {
  if (!meetingText) {
    return null;
  }

  const [daysText, timesText] = meetingText.split(' ');
  const [start, end] = timesText.split('-').map(parseTime);

  return { days: parseDays(daysText), start, end };
};

const daysOverlap = (firstDays, secondDays) =>
  firstDays.some((day) => secondDays.includes(day));

const timesOverlap = (first, second) =>
  first.start < second.end && second.start < first.end;

const meetingsOverlap = (firstMeeting, secondMeeting) => {
  const first = parseMeeting(firstMeeting);
  const second = parseMeeting(secondMeeting);

  return Boolean(
    first &&
      second &&
      daysOverlap(first.days, second.days) &&
      timesOverlap(first, second),
  );
};

export const hasTimeConflict = (course, otherCourses) =>
  otherCourses.some(
    (otherCourse) =>
      otherCourse.term === course.term &&
      meetingsOverlap(course.meets, otherCourse.meets),
  );
