import React from 'react';
import Login from '../components/Login';

const Profile = () => {
    const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'Software developer with a passion for creating amazing applications.',
    };

    return (
    <>
    <Login />
    </>
    );
};

export default Profile;