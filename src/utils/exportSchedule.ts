import type { Course } from '../services/courseService';

const toFilename = (title: string): string => {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${slug || 'course'}-schedule.txt`;
};

export const formatScheduleText = (
  scheduleTitle: string,
  courses: Course[],
): string => {
  const lines = [`Course Schedule: ${scheduleTitle}`, '', 'Selected courses'];

  if (courses.length === 0) {
    lines.push('No courses selected.');
  } else {
    courses.forEach((course) => {
      lines.push(
        `${course.term} CS ${course.number}: ${course.title}`,
        `Meeting: ${course.meets}`,
        '',
      );
    });
  }

  return `${lines.join('\n').trim()}\n`;
};

export const downloadScheduleText = (
  scheduleTitle: string,
  courses: Course[],
): void => {
  const contents = formatScheduleText(scheduleTitle, courses);
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = toFilename(scheduleTitle);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
