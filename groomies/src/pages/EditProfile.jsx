import React, { useState, useEffect, useReducer } from 'react';
import { useUser } from '../components/UserContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from "react-helmet-async";
import slugify from 'slugify';

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
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [userImage, setUserImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (contextUser) {
            setUserName(contextUser.userName || '');
            setFullName(contextUser.fullName || '');
            setEmail(contextUser.email || '');
            setUserImage(contextUser.userImage || null);
        }
    }, [contextUser]);

    const handleUserNameChange = (e) => setUserName(e.target.value);
    const handleFullNameChange = (e) => setFullName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    const uploadImage = async (file) => {
        if (!file) return null;

        const fileExt = file.name.split('.').pop();
        const newFileName = `${contextUser.userId}_${Date.now()}.${fileExt}`;
        const newFilePath = `users/${newFileName}`;

        if (contextUser.userImage && contextUser.userImage !== newFileName) {
            const oldImagePath = `users/${contextUser.userImage}`;
            try {
                console.log("Attempting to delete old image at path:", oldImagePath);
                const { error: deleteError } = await supabase.storage.from('Images').remove([oldImagePath]);
                if (deleteError) {
                    console.error("Error deleting old image:", deleteError);
                } else {
                    console.log("Old image deleted successfully", oldImagePath);
                }
            } catch (error) {
                console.error("Exception while deleting old image:", error);
            }
        }

        try {
            console.log("Uploading new image at path:", newFilePath);
            let { error: uploadError } = await supabase.storage.from('Images').upload(newFilePath, file);

            if (uploadError) throw uploadError;

            return newFileName;

        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error('Failed to upload image');
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const newFileName = await uploadImage(file);
            if (newFileName) {
                setUserImage(newFileName);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!contextUser) {
            dispatch({ type: 'UPDATE_FAIL', payload: 'User not logged in' });
            return;
        }

        const userSlug = slugify(fullName, {
            lower: true,
            strict: true,
            trim: true
        });

        dispatch({ type: 'UPDATE_REQUEST' });

        try {
            const updatedProfile = {
                userName,
                fullName,
                email,
                userImage: userImage,
                userSlug
            };

            const { data, error } = await supabase
                .from('users')
                .update(updatedProfile)
                .eq('userId', contextUser.userId);

            if (error) throw error;

            if (data && data.length > 0) {
                dispatch({ type: 'UPDATE_SUCCESS', payload: data[0] });
                navigate(`/user/${contextUser.userId}`);
            } else {
                dispatch({ type: 'UPDATE_FAIL', payload: 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
            dispatch({ type: 'UPDATE_FAIL', payload: error.message || 'Error updating profile' });
        }
    };

    return (
        <div>
            <Helmet>
                <title>Edit Profile</title>
            </Helmet>
            <h1 className="text-primary font-weight-bold">Edit Profile</h1>
            <div className="profile-container d-flex justify-content-between">
                <div className="user-edit-form flex-grow-1">
                    <Form onSubmit={handleUpdateProfile}>
                        <Form.Group controlId="userName">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type="text"
                                value={userName}
                                onChange={handleUserNameChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="fullName">
                            <Form.Label>Full Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={fullName}
                                onChange={handleFullNameChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="userImage">
                            <Form.Label>User Image:</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Update Profile</Button>
                    </Form>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
}