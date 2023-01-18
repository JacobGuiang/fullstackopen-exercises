import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

function Books({ show }) {
  const [genre, setGenre] = useState(null);
  const [genreList, setGenreList] = useState([]);
  const result = useQuery(ALL_BOOKS, { variables: { genre } });

  useEffect(() => {
    if (result.data && !genreList.length)
      setGenreList([
        ...new Set(result.data.allBooks.flatMap((book) => book.genres)),
      ]);
  }, [result.data]);

  const books = result.data ? result.data.allBooks : [];

  if (!show) return null;
  if (result.loading) return <div>loading</div>;
  return (
    <div>
      <h2>books</h2>

      {genre && (
        <div>
          in genre <b>{genre}</b>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genreList.map((g) => (
        <button key={g} onClick={() => setGenre(g)} type="button">
          {g}
        </button>
      ))}
    </div>
  );
}

export default Books;
