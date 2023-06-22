import { useState } from 'react';
import Layout from '../components/Layout';

type Props = {
  posts: Post[];
};

type Post = {
  _id: string;
  title: string;
  content: string;
};

export async function getServerSideProps() {
  try {
    let response = await fetch('http://localhost:3000/api/getPosts');
    let posts = await response.json();

    return {
      props: { posts: JSON.parse(JSON.stringify(posts)) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { posts: [] }, // 오류가 발생하면 빈 배열을 반환합니다.
    };
  }
}

export default function Posts(props: Props) {
  //const [posts, setPosts] = useState < [Post] > props.posts;
  const [posts, setPosts] = useState<Post[]>(props.posts);


  const handleDeletePost = async (postId: string) => {
 
    try {
      let response = await fetch(
        "http://localhost:3000/api/deletePost?id=" + postId,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      response = await response.json();
      window.location.reload();
    } catch (error) {
      console.log("An error occurred while deleting ", error);
    }
  };

  return (
    <Layout>
      <div className="posts-body">
        <h1 className="posts-body-heading">Top 20 Added Posts</h1>
        {posts.length > 0 ? (
          <ul className="posts-list">
            {posts.map((post) => (
              <li key={post._id} className="post-item">
                <div className="post-item-details">
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                </div>
                <div className="post-item-actions">
                  <a href={`/posts/${post._id}`}>Edit</a>
                  <button onClick={() => handleDeletePost(post._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <h2 className="posts-body-heading">Oops! No posts added so far</h2>
        )}
      </div>
      <style jsx>{`
        .posts-body {
          width: 400px;
          margin: 10px auto;
        }
        .posts-body-heading {
          font-family: sans-serif;
        }
        .posts-list {
          list-style-type: none;
          display: block;
        }
        .post-item {
          width: 100%;
          padding: 10px;
          border: 1px solid #d5d5d5;
        }
        .post-item-actions {
          display: flex;
          justify-content: space-between;
        }
        .post-item-actions a {
          text-decoration: none;
        }
      `}</style>
    </Layout>
  );
}
