import { useState } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommend from './components/Recommend';
import LoginForm from './components/LoginForm';
import { BOOK_ADDED } from './queries';

function App() {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const client = useApolloClient();

  const notify = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const { bookAdded } = data.data;
      notify(`added ${bookAdded.title} by ${bookAdded.author.name}`);
    },
  });

  const logout = async (event) => {
    event.preventDefault();
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('login');
  };

  const addBookButton = () => (
    <button type="button" onClick={() => setPage('add')}>
      add book
    </button>
  );

  const recommendButton = () => (
    <button type="button" onClick={() => setPage('recommend')}>
      recommend
    </button>
  );

  const loginButton = () => (
    <button type="button" onClick={() => setPage('login')}>
      login
    </button>
  );

  const logoutButton = () => (
    <button type="button" onClick={logout}>
      logout
    </button>
  );

  return (
    <div>
      <div>
        <button type="button" onClick={() => setPage('authors')}>
          authors
        </button>
        <button type="button" onClick={() => setPage('books')}>
          books
        </button>
        {!token && loginButton()}
        {token && addBookButton()}
        {token && recommendButton()}
        {token && logoutButton()}
      </div>

      {notification && <div>{notification}</div>}

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommend show={page === 'recommend'} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
}

export default App;
