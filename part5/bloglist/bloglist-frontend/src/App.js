import { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogList) => setBlogs(blogList))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    }
  }, [])

  const showNotifcation = (color, message) => {
    setNotification({ color, message })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username, password,
      })
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotifcation('red', 'wrong username or password')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(savedBlog))
      blogFormRef.current.toggleVisibility()
      showNotifcation('green', `${savedBlog.title} by ${savedBlog.author} added`)
    } catch (exception) {
      showNotifcation('red', 'missing title or url')
    }
  }

  const deleteBlog = async (blogObject) => {
    const ok = window.confirm(`remove '${blogObject.title}' by ${blogObject.author}?`)

    if (!ok) {
      return
    }

    try {
      await blogService.remove(blogObject.id)
      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
      showNotifcation('green', `${blogObject.title} by ${blogObject.author} deleted`)
    } catch (exception) {
      showNotifcation('red', 'only the creator can delete a blog')
    }
  }

  const addLike = async (blogObject) => {
    await blogService.update(blogObject, blogObject.id)
    setBlogs(blogs.map((blog) =>
      blog.id === blogObject.id
        ? { ...blog, likes: blog.likes + 1 }
        : blog
    ))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification notification={notification} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              id="username"
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              id="password"
            />
          </div>

          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification} />

      <div>
        {user.name}
        {' '}
        logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
            showDelete={blog.user.username === user.username}
          />
        ))}
    </div>
  )
}

export default App
