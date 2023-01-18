import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

function LoginForm({ show, setToken, setPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, loginRequest] = useMutation(LOGIN);

  useEffect(() => {
    if (loginRequest.data) {
      const token = loginRequest.data.login.value;
      setToken(token);
      localStorage.setItem('loggedUserToken', token);
      setPage('authors');
    }
  }, [loginRequest.data, setToken, setPage]);

  const handleLogin = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setUsername('');
    setPassword('');
  };

  if (!show) return null;
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
}

export default LoginForm;
