import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';
import { checkLoggedUser } from './reducers/userReducer';
import Togglable from './components/Togglable';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import LogOut from './components/LogOut';
import Users from './components/Users';
import UserBlogs from './components/UserBlogs';
import { initializeBlogs } from './reducers/blogReducer';
import { initializeUsers } from './reducers/usersReducer';

function App() {
  const blogFormRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLoggedUser());
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, []);

  const user = useSelector((state) => state.user);

  if (user === null) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center text-5xl bg-red-500">
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="text-5xl flex flex-col h-screen p-5 bg-red-500">
      <div className="flex justify-evenly text-white">
        <Link className="w-fit bg-black p-5 rounded-xl" to="/">
          blogs
        </Link>
        <Link className="w-fit bg-black p-5 rounded-xl" to="/users">
          users
        </Link>
        <LogOut />
      </div>

      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm reference={blogFormRef} />
              </Togglable>
              <BlogList />
            </>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserBlogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </div>
  );
}

export default App;
