// Header.tsx
import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {signOut, useSession} from 'next-auth/react';



const Header: React.FC = () => {
    const router = useRouter();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const {data: session, status} = useSession();
    console.log('session :' , session)

    let left = (
        <div className="left">
            <Link href="/">
                <a className="bold" data-active={isActive('/')}>
                    Accueil
                </a>
            </Link>
            <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: var(--geist-foreground);
          display: inline-block;
        }

        .left a[data-active='true'] {
            border-bottom: 1px solid white;
        }
        a + a {
          margin-left: 1rem;
        }
      `}</style>
        </div>
    );

    let right = null;

    if (status === 'loading') {
        left = (
            <div className="left">
                <Link href="/">
                    <a className="bold" data-active={isActive('/')}>
                        Accueil
                    </a>
                </Link>
                <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left a[data-active='true'] {
            border-bottom: 1px solid white;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
            </div>
        );
        right = (
            <div className="right">
                <p>Validating session ...</p>
                <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
            </div>
        );
    }

    if (!session) {
        right = (
            <div className="right">
                <Link href="/api/auth/signin">
                    <a data-active={isActive('/signup')}>Se connecter</a>
                </Link>
                <style jsx>{`
          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid var(--geist-foreground);
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        `}</style>
            </div>
        );
    }

    if (session) {
        left = (
            <div className="left">
                <Link href="/">
                    <a className="bold" data-active={isActive('/')}>
                        Accueil
                    </a>
                </Link>
                <Link href="/drafts">
                    <a data-active={isActive('/drafts')}>Mes posts</a>
                </Link>
                <style jsx>{`
          .bold {
            font-weight: bold;
            color: white;
          }

          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left a[data-active='true'] {
            border-bottom: 1px solid white;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
            </div>
        );
        right = (
            <div className="right">
                <p>
                    {session.user.name}
                </p>
                <Link href="/create">
                    <p data-active={isActive('/create')}>Créer un post</p>
                </Link>
                <p onClick={() => signOut()}>Se déconnecter</p>
                <style jsx>{`
          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }
          .right p[data-active='true'] {
            border-bottom: 1px solid white;
          }
          p {
            display: inline-block;
            font-size: 16px;
            margin-right: 1rem;
          }
          
          p:hover {
            cursor: pointer;
           }
            
          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid var(--geist-foreground);
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          button {
            border: none;
          }
        `}</style>
            </div>
        );
    }

    return (
        <nav>
            {left}
            {right}
            <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
          border-bottom: 1px solid black;
          background-color: rgba(6,55,214,0.8);
          color: white;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }
      `}</style>
        </nav>
    );
};

export default Header;
