import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { likeBlog, commentBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

function Blog() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [comment, setComment] = useState('');

  const blog = useSelector((state) => state.blogs.find((b) => b.id === id));

  const like = () => {
    dispatch(likeBlog(blog));
    dispatch(setNotification(`liked ${blog.title}`));
  };

  const addComment = (event) => {
    event.preventDefault();
    dispatch(commentBlog(blog.id, comment));
    dispatch(setNotification(`commented ${comment}`));
    setComment('');
  };

  if (!blog) return null;
  return (
    <div className="flex flex-col justify-evenly flex-1">
      <div className="flex flex-col gap-2">
        <div>
          {blog.title} by {blog.author}
        </div>
        <div className="text-white underline">
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </div>
        <div>
          {blog.likes} likes
          <button
            type="button"
            onClick={like}
            className="bg-black text-white w-fit rounded-lg p-3 text-3xl"
          >
            like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
      </div>

      <div className="flex flex-col gap-2">
        <div>comments</div>
        <form onSubmit={addComment}>
          <div>
            <input
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white w-fit rounded-lg p-3 text-3xl"
            >
              add comment
            </button>
          </div>
        </form>
        <ul className="list-disc list-inside">
          {blog.comments.map((c) => (
            <li key={c.id}>{c.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Blog;
