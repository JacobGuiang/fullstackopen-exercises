const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

const { userExtractor } = middleware;

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate(
    'user',
    { blogs: 0 },
  );

  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { body, user } = request;

  if (!body.title) {
    return response.status(400).json({ error: 'missing title' });
  }
  if (!body.url) {
    return response.status(400).json({ error: 'missing url' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { user } = request;

  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
  user.blogs = user.blogs.filter((blogId) => blogId.toString() !== deletedBlog.id);
  await user.save();

  return response.status(204).end();
});

module.exports = blogsRouter;
