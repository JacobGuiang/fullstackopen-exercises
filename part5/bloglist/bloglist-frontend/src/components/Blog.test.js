import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'test blog',
    author: 'blog author',
    url: 'test.com',
    likes: 100,
    user: {
      token: '123',
      username: 'admin',
      name: 'admin'
    }
  }

  const mockHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        addLike={mockHandler}
        deleteBlog={mockHandler}
        showDelete={true}
      />
    ).container
  })

  test('<Blog /> only shows title and author by default', () => {
    const titleAuthor = screen.getByText(`${blog.title} ${blog.author}`)
    expect(titleAuthor).toBeDefined()

    const div = container.querySelector('.blog-details')
    expect(div).toHaveStyle('display: none')
  })

  test('<Blog /> shows url and likes when button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blog-details')
    expect(div).not.toHaveStyle('display: none')
  })

  test('<Blog /> like button can be clicked twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})