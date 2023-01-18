import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function BlogList() {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div className="flex-1 flex flex-col justify-start text-3xl">
      {[...blogs]
        .sort((blogA, blogB) => blogB.likes - blogA.likes)
        .map((blog) => (
          <div key={blog.id} className="text-white underline">
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
    </div>
  );
}

export default BlogList;
