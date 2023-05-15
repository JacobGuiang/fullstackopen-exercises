describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const newUser = {
      username: 'admin',
      name: 'admin',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3003/api/users', newUser)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.login({ username: 'admin', password: 'password' })
      cy.contains('admin logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'password' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('Blog Title')
      cy.get('#author-input').type('Blog Author')
      cy.get('#url-input').type('blog.com/test')
      cy.get('#blog-submit').click()

      cy.contains('Blog Title by Blog Author added')

      cy.request('GET', 'http://localhost:3003/api/blogs')
        .its('body')
        .its('length')
        .should('eq', 1)
    })

    it('A blog can be liked', function() {
      cy.createBlog({
        title: 'Blog Title',
        author: 'Blog Author',
        url: 'blogs.com/test',
      })

      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted by the user who created it', function() {
      cy.createBlog({
        title: 'Blog Title',
        author: 'Blog Author',
        url: 'blogs.com/test',
      })

      cy.contains('view').click()
      cy.contains('delete').click()
      cy.contains('Blog Title Blog Author').should('not.exist')
    })

    it('Blogs are sorted by most likes', function () {
      cy.createBlog({
        title: 'The title with the second most likes',
        author: 'Blog Author',
        url: 'blogs.com/test',
      })

      cy.createBlog({
        title: 'The title with the most likes',
        author: 'Blog Author',
        url: 'blogs.com/test',
      })

      cy.get('.blog').eq(1).as('blogToLike')
      cy.get('@blogToLike').contains('view').click()
      cy.get('@blogToLike').find('.blog-details').contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
      cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
    })
  })
})