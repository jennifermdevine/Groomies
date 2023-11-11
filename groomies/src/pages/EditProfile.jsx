import React, { useState, useEffect, useReducer } from 'react';
import { useUser } from '../components/UserContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'UPDATE_SUCCESS':
            return { ...state, loading: false, error: '', user: action.payload };
        case 'UPDATE_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    loading: false,
    error: '',
};

export default function EditProfile() {
    const { user: contextUser } = useUser();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user, loading, error } = state;
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    // Initialize useNavigate at the top-level of the component
    const navigate = useNavigate();

    useEffect(() => {
        if (contextUser) {
            setFullName(contextUser.fullName || ''); // Initialize with user's full name or empty string
            setEmail(contextUser.email || ''); // Initialize with user's email or empty string
        }
    }, [contextUser]);

    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (!contextUser) {
            // If the user is not logged in (contextUser is null), handle the error
            dispatch({ type: 'UPDATE_FAIL', payload: 'User not logged in' });
            return;
        }

        try {
            dispatch({ type: 'UPDATE_REQUEST' });

            console.log('Updating profile...', contextUser);
            console.log('User ID:', contextUser.userId);
            console.log('Full Name:', fullName);
            console.log('Email:', email);

            // Update the user's profile
            const { data, error } = await supabase
                .from('users')
                .update({
                    fullName,
                    email,
                })
                .eq('userId', contextUser.userId); // Update based on the user's userId
            console.log('1 Data from Supabase:', data);
            console.log('2 Data from Supabase:', data);
            console.log('Error from Supabase:', error);

            if (error) throw error;

            if (data && data.length > 0) {
                // Check if data is not null and contains at least one item
                dispatch({ type: 'UPDATE_SUCCESS', payload: data[0] });
                alert('Profile updated!');

                // Use the `navigate` function to navigate to the user profile page
                navigate(`/user/${contextUser.userId}`);
            } else {
                // Handle the case where data is null or empty
                dispatch({ type: 'UPDATE_FAIL', payload: 'Profile update failed' });
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
            dispatch({ type: 'UPDATE_FAIL', payload: error.error_description || error.message });
        }
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={handleFullNameChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            {loading && <p>Updating...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}
