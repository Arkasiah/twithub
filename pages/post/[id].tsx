// pages/p/[id].tsx

import React, {useState} from 'react';
import {GetServerSideProps} from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import {PostProps} from '../../components/Post';
import {useSession} from 'next-auth/react';
import prisma from '../../lib/prisma';
import Comment from '../../components/Comment';

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const post = await prisma.post.findUnique({
        where: {
            id: String(params?.id),
        },
        include: {
            author: {
                select: {name: true, email: true},
            },
        },
    });
    const comment = await prisma.comment.findMany({
        where: {postId: String(params?.id)},
        include: {
            author: {
                select: {name: true},
            },
        },
    });
    return {
        props: {post, comment}
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


const Post: React.FC<PostProps> = (props) => {
    const {data: session, status} = useSession();
    console.log('props: ', props)
    const [comment, setComment] = useState('');

    const createComment = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = {comment, postId: props["post"].id};
            await fetch('/api/post/comment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            });
            await Router.push(`/post/${props["post"].id}`);
        } catch (error) {
            console.error(error);
        }
    };

    if (status === 'loading') {
        return <div>Authenticating ...</div>;
    }
    const userHasValidSession = Boolean(session);
    console.log(props)
    const postBelongsToUser = session?.user?.email === props["post"]?.author?.email;
    let title = props["post"]?.title;
    if (!props["post"]?.published) {
        title = `${title} (Draft)`;
    }

    return (
        <Layout>
            <div>
                <div className={'post'}>
                    <h2>{title}</h2>
                    <p className={'author'} onClick={() => Router.push("/profile/[id]", `/profile/${props["post"].authorId}`)}>Auteur : {props?.post?.author?.name || 'Unknown author'}</p>
                    <ReactMarkdown children={props["post"].content}/>
                    {!props["post"].published && userHasValidSession && postBelongsToUser && (
                        <button onClick={() => publishPost(props["post"].id)} className={'buttonpublish'}>Publier</button>
                    )}
                    {
                        userHasValidSession && postBelongsToUser && (
                            <button onClick={() => deletePost(props["post"].id)} className={'buttondelete'}>Delete</button>
                        )
                    }
                </div>
                {props["post"].published &&
                    <>
                        <div className={'commentbox'}>
                            <h2>{'Ecrire un commentaire'}</h2>
                            {
                                userHasValidSession && (
                                    <form onSubmit={createComment}>
                    <textarea
                        cols={50}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Commentaire"
                        rows={3}
                        value={comment}
                    />
                                        <button disabled={!comment || !title} type="submit" value="Commenter"
                                                className={'button'}>Commenter
                                        </button>

                                    </form>)
                            }
                        </div>
                        <div className="commentfeed">
                            <h2>{'Espace commentaire'}</h2>
                            {props["comment"].map((comment) => (
                                <div key={comment.id}>
                                    <Comment comment={comment}/>
                                </div>
                            ))}
                        </div>
                    </>
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
        
        .post {
          border-bottom: 1px solid rgba(6,55,214,0.8);
          padding-bottom: 1rem;
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
        
        .author {
        cursor: pointer;
        }
        
        .author:hover {
        opacity: 0.7;

        }
      `}</style>
        </Layout>
    );
};

export default Post;
