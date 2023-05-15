import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import BookList from './BookList';

function Books({ show }) {
  const allbooksResult = useQuery(ALL_BOOKS);
  const [genreBooks, genreBooksResult] = useLazyQuery(ALL_BOOKS);

  const [books, setBooks] = useState(null);
  const [genre, setGenre] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (allbooksResult.data && allbooksResult.data.allBooks && !genre) {
      const { allBooks } = allbooksResult.data;
      setBooks(allBooks);
      setGenres([...new Set(allBooks.flatMap((book) => book.genres))]);
    }
  }, [allbooksResult.data, genre]);

  useEffect(() => {
    if (genreBooksResult.data) {
      setBooks(genreBooksResult.data.allBooks);
    }
  }, [genreBooksResult.data]);

  const onGenreClick = (newGenre) => {
    setGenre(newGenre);
    genreBooks({
      variables: {
        genre: newGenre,
      },
    });
  };

  if (!show || !books) return null;
  return (
    <div>
      <h2>books</h2>

      {genre && (
        <div>
          in genre <b>{genre}</b>
        </div>
      )}

      <BookList books={books} />

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => onGenreClick(g)} type="button">
            {g}
          </button>
        ))}
        <button onClick={() => onGenreClick(null)} type="button">
          all genres
        </button>
      </div>
    </div>
  );
}

export default Books;
