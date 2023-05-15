import { useQuery, useMutation } from '@apollo/client';
import Select from 'react-select';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

function SetBirthYear({ authors }) {
  const [editAuthor] = useMutation(EDIT_AUTHOR);

  if (authors.length === 0) {
    return null;
  }

  const options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  const handleSubmit = (event) => {
    event.preventDefault();

    editAuthor({
      variables: {
        name: event.target.author.value,
        setBornTo: Number(event.target.year.value),
      },
    });
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <Select options={options} name="author" />
        <input name="year" />
        <button type="submit">update author</button>
      </form>
    </div>
  );
}

function Authors({ show }) {
  const result = useQuery(ALL_AUTHORS);
  const authors = result.data ? result.data.allAuthors : [];

  if (!show || !result.data) return null;
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={authors} />
    </div>
  );
}

export default Authors;
