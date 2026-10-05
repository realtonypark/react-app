import './App.css';

const schedules = {
  'CS-2018-2019': {
    title: 'CS Courses for 2018-2019',
    courses: {
      F101: {
        term: 'Fall',
        number: '101',
        meets: 'MWF 11:00-11:50',
        title: 'Computer Science: Concepts, Philosophy, and Connections',
      },
      F110: {
        term: 'Fall',
        number: '110',
        meets: 'MWF 10:00-10:50',
        title: 'Intro Programming for non-majors',
      },
      S313: {
        term: 'Spring',
        number: '313',
        meets: 'TuTh 15:30-16:50',
        title: 'Tangible Interaction Design and Learning',
      },
      S314: {
        term: 'Spring',
        number: '314',
        meets: 'TuTh 9:30-10:50',
        title: 'Tech & Human Interaction',
      },
    },
  },
};

const App = () => {
  const schedule = schedules['CS-2018-2019'];
  return (
    <main className="min-h-screen bg-stone-50 px-8 py-10 text-stone-950">
      <h1 className="mb-12 text-3xl font-semibold tracking-tight">{schedule.title}</h1>
      <ul className="grid w-full grid-cols-4 gap-3">
        {Object.keys(schedule.courses).map((key) => {
          const course = schedule.courses[key as keyof typeof schedule.courses];
          return (
            <li
              key={key}
              className="flex min-h-[204px] min-w-0 flex-col rounded-md border border-stone-300 bg-white px-6 py-6 shadow-sm"
            >
              <h2 className="text-xl font-medium leading-tight">
                {course.term} CS {course.number}
              </h2>
              <p className="mt-2 flex-1 text-[15px] leading-[1.4] text-stone-800">{course.title}</p>
              <p className="mt-4 border-t border-stone-300 pt-3 text-sm text-stone-700">{course.meets}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default App;