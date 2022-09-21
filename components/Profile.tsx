import React from "react";

export type ProfileProps = {
    id: string;
    name: string;
    email: string;
};

const Profile: React.FC<{ profile: ProfileProps }> = ({ profile }) => {
    return (
        <div>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
        </div>
    );
};

export default Profile;
