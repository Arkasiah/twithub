import React from "react";
import ReactMarkdown from "react-markdown";
import Router from "next/router";

export type CommentProps = {
    id: string;
    body: string;
    author: {
        id: string;
        name: string;
        email: string;
    } | null;
    post: {
        id: string;
        content: string;
    } | null;
};

const Comment: React.FC<{ comment: CommentProps }> = ({ comment }) => {
    const authorName = comment.author ? comment.author.name : "Unknown author";
    return (
        <div>
            <p className={'author'} onClick={() => Router.push("/profile/[id]", `/profile/${comment["authorId"]}`)}>@{authorName}</p>
            <ReactMarkdown children={comment.body} />
            <style jsx>{`
        div {
          color: inherit;
          padding: 1rem;
          border: 1px solid rgba(6,55,214,0.8);
          border-radius: 5px;
          margin-bottom: 1rem;
        }
        .author {
            font-weight: bold;
            cursor: pointer;
        }
        
        .author:hover {
          opacity: 0.8;
        }
        
      `}</style>
        </div>
    );
};

export default Comment;
