import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';

function Recommend({ show }) {
  const meResult = useQuery(ME);
  const allBooksResult = useQuery(ALL_BOOKS);

  const books = allBooksResult.data ? allBooksResult.data.allBooks : [];

  if (!show) return null;
  if (meResult.loading || allBooksResult.loading) return <div>loading</div>;
  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books based on your favorite genre{' '}
        <b>{meResult.data.me.favoriteGenre}</b>
      </div>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) =>
              book.genres.includes(meResult.data.me.favoriteGenre)
            )
            .map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Recommend;
