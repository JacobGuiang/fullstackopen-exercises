import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import commentService from '../services/comment';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    addLike(state, action) {
      const id = action.payload;
      return state.map((blog) =>
        blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
      );
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
    addComment(state, action) {
      const { id, comment } = action.payload;
      const blogToUpdate = state.find((blog) => blog.id === id);
      blogToUpdate.comments.push(comment);
    },
  },
});

export const { appendBlog, setBlogs, addLike, removeBlog, addComment } =
  blogSlice.actions;

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll();
  dispatch(setBlogs(blogs));
};

export const createBlog = (blog) => async (dispatch) => {
  const newBlog = await blogService.create(blog);
  dispatch(appendBlog(newBlog));
};

export const likeBlog = (blog) => async (dispatch) => {
  const updatedBlog = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id,
    comments: blog.comments.map((comment) => comment.id),
  };
  await blogService.update(blog.id, updatedBlog);
  dispatch(addLike(blog.id));
};

export const deleteBlog = (id) => async (dispatch) => {
  await blogService.remove(id);
  dispatch(removeBlog(id));
};

export const commentBlog = (id, content) => async (dispatch) => {
  const comment = await commentService.create(id, { content });
  dispatch(addComment({ id, comment }));
};

export default blogSlice.reducer;
