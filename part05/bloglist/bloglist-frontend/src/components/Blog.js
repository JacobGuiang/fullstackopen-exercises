import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog, addLike, deleteBlog, showDelete,
}) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const like = () => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }
    addLike(updatedBlog, blog.id)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const deleteButton = () => (
    <div>
      <button type="button" onClick={() => deleteBlog(blog)}>delete</button>
    </div>
  )

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title}
        {' '}
        {blog.author}
        <button type="button" onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible} className="blog-details">
        <div>{blog.url}</div>
        <div>
          likes
          {' '}
          {blog.likes}
          <button type="button" onClick={like}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {showDelete && deleteButton()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  }).isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  showDelete: PropTypes.bool.isRequired,
}

export default Blog
