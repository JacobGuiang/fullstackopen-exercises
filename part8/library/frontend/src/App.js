import { useState, useEffect } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommend from './components/Recommend';
import LoginForm from './components/LoginForm';
import { BOOK_ADDED, ALL_BOOKS } from './queries';

function App() {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const loggedUserToken = localStorage.getItem('loggedUserToken');
    if (loggedUserToken) {
      setToken(loggedUserToken);
    }
  }, []);

  const logout = async () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((elem) => elem.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded;
      alert(`new book ${book.title} by ${book.author.name}`);
      updateCacheWith(book);
    },
  });

  return (
    <div>
      <div>
        <button type="button" onClick={() => setPage('authors')}>
          authors
        </button>
        <button type="button" onClick={() => setPage('books')}>
          books
        </button>
        {token ? (
          <>
            <button type="button" onClick={() => setPage('recommended')}>
              recommended
            </button>
            <button type="button" onClick={() => setPage('add')}>
              add book
            </button>
            <button type="button" onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setPage('login')}>
            login
          </button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommended'} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
}

export default App;
