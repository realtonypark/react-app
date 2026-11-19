import { useState } from 'react';
import type { Schedule } from '../services/courseService';
import type { Term } from '../types/course';
import { CourseList } from './CourseList';
import { CourseForm } from './CourseForm';
import { CoursePlan } from './CoursePlan';
import { TermSelector } from './TermSelector';
import { hasTimeConflict } from '../utils/timeConflicts';
import { saveCourse, type Course } from '../services/courseService';
import { downloadScheduleText } from '../utils/exportSchedule';

interface TermPageProps {
  schedule: Schedule;
  scheduleId?: string;
  canEdit?: boolean;
}

export const TermPage = ({
  schedule,
  scheduleId = 'CS-2018-2019',
  canEdit = false,
}: TermPageProps) => {
  const [courses, setCourses] = useState(schedule.courses);
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [editingCourseKey, setEditingCourseKey] = useState<string | null>(null);

  const toggleClass = (courseKey: string) => {
    setSelectedClasses((currentSelectedClasses) => {
      if (currentSelectedClasses.indexOf(courseKey) !== -1) {
        return currentSelectedClasses.filter((key) => key !== courseKey);
      }

      const course = courses[courseKey];
      const selectedCourses = currentSelectedClasses.map(
        (key) => courses[key],
      );

      return hasTimeConflict(course, selectedCourses)
        ? currentSelectedClasses
        : [...currentSelectedClasses, courseKey];
    });
  };

  const handleCourseSubmit = async (courseKey: string, course: Course) => {
    if (!canEdit) {
      throw new Error('You must be an administrator to edit course information.');
    }

    await saveCourse(scheduleId, courseKey, course);
    setCourses((currentCourses) => ({ ...currentCourses, [courseKey]: course }));
    setEditingCourseKey(null);
  };

  const handleExport = () => {
    const selectedCourses = selectedClasses
      .map((courseKey) => courses[courseKey])
      .filter((course): course is Course => Boolean(course));

    downloadScheduleText(schedule.title, selectedCourses);
  };

  return (
    <main className="min-h-screen bg-stone-50 px-8 py-10 text-stone-950">
      <div className="mb-12 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{schedule.title}</h1>
        {!editingCourseKey && (
          <button
            type="button"
            onClick={handleExport}
            className="shrink-0 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow-sm transition-colors hover:border-stone-400 hover:bg-stone-100"
          >
            Export .txt
          </button>
        )}
      </div>
      {editingCourseKey && canEdit ? (
        <CourseForm
          course={courses[editingCourseKey]}
          onCancel={() => setEditingCourseKey(null)}
          onSubmit={(course) => handleCourseSubmit(editingCourseKey, course)}
        />
      ) : (
        <>
          <div className="mb-10 flex items-end justify-between gap-4">
            <TermSelector selectedTerm={selectedTerm} onTermChange={setSelectedTerm} />
            <button
              type="button"
              onClick={() => setIsPlanOpen(true)}
              className="rounded-lg bg-stone-950 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-stone-800"
            >
              Course plan
            </button>
          </div>
          <CourseList
            courses={courses}
            selectedTerm={selectedTerm}
            selectedClasses={selectedClasses}
            onClassToggle={toggleClass}
            onEditCourse={setEditingCourseKey}
            canEdit={canEdit}
          />
        </>
      )}
      {isPlanOpen && (
        <CoursePlan
          courses={schedule.courses}
          selectedClasses={selectedClasses}
          onClose={() => setIsPlanOpen(false)}
        />
      )}
    </main>
  );
};
