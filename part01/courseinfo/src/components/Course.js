const Header = ({ text }) => <h1>{text}</h1>

const Total = ({ sum }) => <b>total of {sum} exercises</b>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

function Content ({ parts }) {
  return (
    <>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
      <Total sum={parts.reduce((sum, part) => sum + part.exercises, 0)} />
    </>
  )
}

const Course = ({ course }) => {
  return(
    <>
      <Header text={course.name} />
      <Content parts={course.parts} />
    </>
  )
}

export default Course