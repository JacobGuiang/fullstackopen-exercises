const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, curBlog) => sum + curBlog.likes, 0);

module.exports = {
  dummy, totalLikes,
};
