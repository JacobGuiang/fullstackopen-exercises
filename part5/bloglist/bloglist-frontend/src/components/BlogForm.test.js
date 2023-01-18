import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  let container
  const createBlog = jest.fn()

  beforeEach(() => {
    container = render(<BlogForm createBlog={createBlog} />).container
  })

  test('<BlogForm /> submit receives proper details', async () => {
    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const submitButton = screen.getByText('create')

    const title = 'Blog Title'
    const author = 'Blog Author'
    const url = 'blogs.com/blog'

    const user = userEvent.setup()
    await user.type(titleInput, title)
    await user.type(authorInput, author)
    await user.type(urlInput, url)
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(title)
    expect(createBlog.mock.calls[0][0].author).toBe(author)
    expect(createBlog.mock.calls[0][0].url).toBe(url)
  })
})