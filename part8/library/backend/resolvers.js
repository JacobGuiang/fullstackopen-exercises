const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const pubsub = new PubSub();

const JWT_SECRET = 'sekret';

let books;

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const query = {};

      if (args.author) {
        const theAuthor = await Author.findOne({ name: args.author });
        query.author = theAuthor.id;
      }

      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }

      return Book.find(query).populate('author');
    },
    allAuthors: async () => {
      books = await Book.find({});
      return Author.find({});
    },
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: async (root) =>
      books.filter((book) => String(book.author) === String(root.id)).length,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser)
        throw new AuthenticationError('not authenticated');

      let newAuthor = false;
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        newAuthor = true;
        author = new Author({ name: args.author });
      }

      let book = new Book({ ...args, author });

      try {
        if (newAuthor) {
          await author.save();
        }
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      book = await Book.findById(book.id).populate('author');
      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser)
        throw new AuthenticationError('not authenticated');

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};

module.exports = resolvers;
