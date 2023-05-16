CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES ('Author One', 'blog.com/one', 'Blog One');

INSERT INTO blogs (url, title)
VALUES ('blog.com/two', 'Blog Two');