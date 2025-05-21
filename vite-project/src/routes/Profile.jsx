import React from 'react';

const Profile = () => {
    const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'Software developer with a passion for creating amazing applications.',
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Profile</h1>
            <div style={{ marginTop: '20px' }}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Bio:</strong> {user.bio}</p>
            </div>
        </div>
    );
};

export default Profile;