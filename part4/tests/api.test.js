const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

describe('blog tests', () => {
  let token;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'password' });

    token = response.body.token;
  }, 100000);

  describe('get all blogs', () => {
    test('notes are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('all notes are returned', async () => {
      const response = await api.get('/api/blogs');

      expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    test('unique identifier is named id', async () => {
      const response = await api.get('/api/blogs');

      response.body.forEach((blog) => expect(blog.id).toBeDefined());
    });
  });

  describe('add blog', () => {
    test('add new blog to list', async () => {
      const newBlog = {
        title: 'new blog',
        author: 'blog author',
        url: 'blogs.com/blog',
        likes: 900,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAfter = await helper.blogsInDb();
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1);

      const blogTitles = blogsAfter.map((blog) => blog.title);
      expect(blogTitles).toContain('new blog');
    });

    test('adding blog with missing likes property sets likes to 0', async () => {
      const newBlog = {
        title: 'blog with no likes',
        author: 'likeless author',
        url: 'blogs.com/blogwithnolikes',
      };

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      expect(response.body.likes).toEqual(0);

      const blogsAfter = await helper.blogsInDb();
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1);
    });

    test('adding blog with missing title or url properties gives status code 400', async () => {
      const missingTitleBlog = {
        author: 'blog author',
        url: 'blogs.com/blog',
        likes: 400,
      };

      const missingUrlBlog = {
        title: 'missing url blog',
        author: 'blog author',
        likes: 400,
      };

      await api
        .post('/api/blogs')
        .send(missingTitleBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400);

      await api
        .post('/api/blogs')
        .send(missingUrlBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400);

      const blogsAfter = await helper.blogsInDb();
      expect(blogsAfter.length).toEqual(helper.initialBlogs.length);
    });
  });

  describe('update blog', () => {
    test('a blog can be updated ', async () => {
      const blogsBefore = await helper.blogsInDb();
      const blogToUpdate = blogsBefore[0];

      blogToUpdate.likes = 9001;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200);

      const blogsAfter = await helper.blogsInDb();
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length);

      const blogLikes = blogsAfter.map((blog) => blog.likes);
      expect(blogLikes).toContain(9001);
    });
  });

  describe('delete blog', () => {
    test('a blog can be deleted', async () => {
      const blogsBefore = await helper.blogsInDb();
      const blogToDelete = blogsBefore[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204);

      const blogsAfter = await helper.blogsInDb();
      expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1);

      const blogTitles = blogsAfter.map((blog) => blog.title);
      expect(blogTitles).not.toContain(blogToDelete.title);
    });
  });
});

describe('user tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('new user can be created', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'jacobguiang',
      name: 'Jacob Guiang',
      password: 'admin',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'password',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
