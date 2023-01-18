import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';

function NewBook({ show }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK);

  const submit = async (event) => {
    event.preventDefault();

    addBook({
      variables: {
        title,
        author,
        genres,
        published: Number(published),
      },
      refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
      update: (store, response) => {
        genres.forEach((g) => {
          try {
            const dataInStore = store.readQuery({
              query: ALL_BOOKS,
              variables: { g },
            });

            store.writeQuery({
              query: ALL_BOOKS,
              variables: { g },
              data: {
                allBooks: [...dataInStore.allBooks].concat(
                  response.data.addBook
                ),
              },
            });
          } catch (e) {
            console.log('not queried', g);
          }
        });
      },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  if (!show) return null;
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
}

export default NewBook;
