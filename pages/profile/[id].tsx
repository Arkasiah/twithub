// pages/p/[id].tsx

import React, {useState} from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { ProfileProps } from '../../components/Profile';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import Comment from '../../components/Comment';
import Post from "../../components/Post";

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const user = await prisma.user.findUnique({
        where: {
            id: String(params?.id),
        },
    });
    const post = await prisma.post.findMany({
        where: {
            authorId: String(params?.id),
            published: true
        },
        include: {
            author: {
                select: {name: true},
            },
        },
    });
    return {
        props: {user, post}
    };
};

async function publishPost(id: string): Promise<void> {
    await fetch(`/api/publish/${id}`, {
        method: 'PUT',
    });
    await Router.push('/');
}

// pages/p/[id].tsx

async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
        method: 'DELETE',
    });
    Router.push('/');
}


const Profile: React.FC<ProfileProps> = (props) => {
    const { data: session, status } = useSession();
    console.log('props: ', props)

    if (status === 'loading') {
        return <div>Authenticating ...</div>;
    }
    const userHasValidSession = Boolean(session);
    console.log(props)
    const postBelongsToUser = session?.user?.email === props["post"]?.author?.email;

    return (
        <Layout>
            <div>
                <div className={'profile'}>
                    <h2>{props["user"].name}</h2>
                    <p>Mail : {props["user"].email}</p>
                    <p>Nombre de post : {props["post"].length}</p>
                </div>

                {props["post"].map((post) => (
                    <div key={post.id} className="post">
                        <Post post={post} />
                    </div>
                ))}
                {props["post"].length === 0 &&
                    <div>Aucun post publié</div>
                }
            </div>
            <style jsx>{`
        .button {
         background-color: rgba(6,55,214,0.8);
         color: white;
         border: 0.5px solid black;
         border-radius: 10px;
        }
        
        button:disabled { 
          cursor: default;
          opacity: 0.85;
        }
        
        .buttondelete {
          background-color: rgba(173, 10, 10, 0.8);
          color: white;
          border: 0.5px solid black;
          border-radius: 10px;
        }
        .buttonpublish {
          background-color: rgba(80, 211, 11, 0.8);
          color: white;
          border: 0.5px solid black;
          border-radius: 10px;
        }
        
        post {
          background: white;
          transition: box-shadow 0.1s ease-in;
          border: 0.5px solid rgba(6,55,214,0.8);
          cursor: pointer;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
        
        .commentbox {
          border-bottom: 1px solid rgba(6,55,214,0.8);
          padding-bottom: 1rem;
        }
        .commentfeed {
        }
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
        
        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }
      `}</style>
        </Layout>
    );
};

export default Profile;
