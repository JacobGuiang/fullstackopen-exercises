const router = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments');

  response.json(blogs);
});

router.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const { body, user } = request;
  const blog = new Blog({ ...body, user: user.id });
  if (!body.likes) {
    blog.likes = 0;
  }

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const blogToReturn = await Blog.findById(savedBlog._id)
    .populate('user', {
      username: 1,
      name: 1,
    })
    .populate('comments');

  response.status(201).json(blogToReturn);
});

router.post('/:id/comments', async (request, response) => {
  const comment = new Comment({
    content: request.body.content,
    blog: request.params.id,
  });

  const blogToUpdate = await Blog.findById(request.params.id);
  blogToUpdate.comments = blogToUpdate.comments.concat(comment);

  await blogToUpdate.save();
  const savedComment = await comment.save();

  const commentToReturn = await savedComment.populate('blog', {
    author: 1,
    title: 1,
    url: 1,
    likes: 1,
  });

  response.status(201).json(commentToReturn);
});

router.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response.status(204).end();
  }

  if (blogToDelete.user && blogToDelete.user.toString() !== request.user.id) {
    return response.status(401).json({
      error: 'only the creator can delete a blog',
    });
  }

  await Blog.findByIdAndRemove(request.params.id);

  response.status(204).end();
});

router.put('/:id', async (request, response) => {
  const blog = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .populate('user', { username: 1, name: 1 })
    .populate('comments');

  response.json(updatedBlog);
});

module.exports = router;
