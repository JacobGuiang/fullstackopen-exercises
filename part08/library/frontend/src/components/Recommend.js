import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';
import BookList from './BookList';

function Recommend({ show }) {
  const meResult = useQuery(ME);
  const booksResult = useQuery(ALL_BOOKS);

  if (!show || !booksResult.data || !meResult.data) {
    return null;
  }

  const genre = meResult.data.me.favoriteGenre;
  const recommendedBooks = booksResult.data.allBooks.filter((book) =>
    book.genres.includes(genre)
  );

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre <strong>{genre}</strong>
      </div>

      <BookList books={recommendedBooks} />
    </div>
  );
}

export default Recommend;
