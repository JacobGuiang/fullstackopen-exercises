import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reducers/userReducer';
import { setNotification } from '../reducers/notificationReducer';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await dispatch(loginUser(username, password));
      dispatch(setNotification(`welcome ${username}`));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setNotification('wrong username or password'));
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-10">
      <div>
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          id="username"
          placeholder="username"
          className="text-center rounded-lg p-5"
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          id="password"
          placeholder="password"
          className="text-center rounded-lg p-5"
        />
      </div>

      <button
        type="submit"
        id="login-button"
        className="bg-black text-white w-fit self-center p-5 rounded-lg"
      >
        login
      </button>
    </form>
  );
}

export default LoginForm;
