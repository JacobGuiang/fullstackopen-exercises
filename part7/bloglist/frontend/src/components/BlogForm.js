import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { createBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

function BlogForm({ reference }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const blog = {
        title,
        author,
        url,
        likes: 0,
      };
      await dispatch(createBlog(blog));
      reference.current.toggleVisibility();
      dispatch(setNotification(`${title} by ${author} added`));
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (exception) {
      dispatch(setNotification('missing title or url'));
    }
  };

  return (
    <div>
      <div className="mb-5">create new blog</div>
      <form onSubmit={addBlog}>
        <div>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title-input"
            placeholder="title"
          />
        </div>
        <div>
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author-input"
            placeholder="author"
          />
        </div>
        <div>
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="url-input"
            placeholder="url"
          />
        </div>
        <button type="submit" id="blog-submit">
          create
        </button>
      </form>
    </div>
  );
}

/* eslint-disable */
BlogForm.propTypes = {
  reference: PropTypes.object.isRequired,
};
/* eslint-enable */

export default BlogForm;
