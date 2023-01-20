interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseDescriptive extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CourseDescriptive {
  type: 'normal';
}

interface CourseProjectPart extends CoursePartBase {
  type: 'groupProject';
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseDescriptive {
  type: 'submission';
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseDescriptive {
  type: 'special';
  requirements: string[];
}

type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;

const courseParts: CoursePart[] = [
  {
    name: 'Fundamentals',
    exerciseCount: 10,
    description: 'This is the easy course part',
    type: 'normal',
  },
  {
    name: 'Advanced',
    exerciseCount: 7,
    description: 'This is the hard course part',
    type: 'normal',
  },
  {
    name: 'Using props to pass data',
    exerciseCount: 7,
    groupProjectCount: 3,
    type: 'groupProject',
  },
  {
    name: 'Deeper type usage',
    exerciseCount: 14,
    description: 'Confusing description',
    exerciseSubmissionLink: 'https://fake-exercise-submit.made-up-url.dev',
    type: 'submission',
  },
  {
    name: 'Backend development',
    exerciseCount: 21,
    description: 'Typing the backend',
    requirements: ['nodejs', 'jest'],
    type: 'special',
  },
];

const Header = ({ name }: { name: string }) => {
  return <h1>{name}</h1>;
};

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      Number of exercises{' '}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </div>
  );
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.type) {
    case 'normal':
      return (
        <div>
          <em>{coursePart.description}</em>
        </div>
      );
    case 'groupProject':
      return <div>project exercises {coursePart.groupProjectCount}</div>;
    case 'submission':
      return (
        <>
          <div>
            <em>{coursePart.description}</em>
          </div>
          <div>submit to {coursePart.exerciseSubmissionLink}</div>
        </>
      );
    case 'special':
      return (
        <>
          <div>
            <em>{coursePart.description}</em>
          </div>
          <div>required skills: {coursePart.requirements.join()}</div>
        </>
      );
  }
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  courseParts.forEach((part) => {
    switch (part.type) {
      case 'normal':
        break;
      case 'groupProject':
        break;
      case 'submission':
        break;
      case 'special':
        break;
      default:
        return assertNever(part);
    }
  });

  return (
    <>
      {courseParts.map((coursePart) => (
        <>
          <div>
            <b>
              {coursePart.name} {coursePart.exerciseCount}
            </b>
          </div>
          <Part coursePart={coursePart} key={coursePart.name} />
          <br />
        </>
      ))}
    </>
  );
};

const App = () => {
  const courseName = 'Half Stack application development';

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
