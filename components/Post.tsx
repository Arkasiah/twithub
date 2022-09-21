import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div className={'post'} onClick={() => Router.push("/post/[id]", `/post/${post.id}`)}>
      <h2>{post.title}</h2>
      <p>@{authorName}</p>
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
        .post {
        cursor: pointer;
        }

      `}</style>
    </div>
  );
};

export default Post;
