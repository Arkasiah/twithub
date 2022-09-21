import React, {useState} from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import {useSession} from "next-auth/react";

const Draft: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const {data: session} = useSession();

    if (!session) {
        return (
            <Layout>
                <h1>Nouveau post</h1>
                <div>Vous devez vous connecter pour accéder à cette page.</div>
            </Layout>
        );
    }
    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = {title, content};
            await fetch('/api/post', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            });
            await Router.push('/drafts');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Layout>
            <div>
                <form onSubmit={submitData}>

                    <h1>Nouveau post</h1>
                    <input
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre"
                        type="text"
                        value={title}
                    />
                    <textarea
                        cols={50}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Contenu"
                        rows={8}
                        value={content}
                    />
                    <input disabled={!content || !title} type="submit" value="Créer le post"/>
                </form>
            </div>
            <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
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
          background: rgba(6,55,214,0.8);
          color: white;
          border: 0;
          padding: 1rem 2rem;
          cursor: pointer;
        }
        input[type='submit']:hover {
          transform: scale(1.05);
        }
        .back {
          margin-left: 1rem;
        }
      `}</style>
        </Layout>
    );
};

export default Draft;
